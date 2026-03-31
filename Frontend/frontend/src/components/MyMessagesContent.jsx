import React, { useMemo, useEffect, useState, useRef } from "react";
import { Trash2, MessageSquare, Send, Car } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Calendar, Gauge, MapPin } from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const getConversationId = (listingId, userA, userB) => {
  if (!listingId || !userA || !userB) return null;
  return [listingId.toString(), userA.toString(), userB.toString()]
    .sort()
    .join("_");
};

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const currentUser = {
  id: storedUser._id || "temp_id",
  fullName: storedUser.fullName || "Utilisateur"
};

// --- SOUS-COMPOSANTS ---
function Avatar({ name }) {
  const initials = (name || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return (
    <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold grid place-items-center shrink-0">
      {initials || "??"}
    </div>
  );
}

function ConversationRow({ conv, isActive, onOpen, onDelete }) {
  const id = conv.id || conv._id;

  // On active le style bleu si la conversation est sélectionnée (isActive) 
  // OU si elle contient un nouveau message (isNew / highlighted)
  const isBlue = isActive || conv.isNew || conv.highlighted;

  const containerClass = isBlue
    ? "border-blue-500 bg-blue-50 shadow-sm"
    : "border-slate-200 bg-white hover:bg-slate-50";

  return (
    <div
      onClick={() => onOpen(conv)}
      className={`w-full border-2 rounded-xl p-3 transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${containerClass}`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Avatar préservé du 1er code */}
        <div className="relative">
          <Avatar name={conv.fromName} />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-bold truncate ${isBlue ? "text-slate-900" : "text-slate-700"}`}>
              {conv.fromName}
            </span>
            
            {/* Badge Nouveau : s'affiche indépendamment sur chaque ligne si isNew est vrai */}
            {conv.isNew && !isActive && (
              <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Nouveau
              </span>
            )}
          </div>

          {/* Preview du message : passe en bleu et gras si nouveau message */}
          <p className={`text-sm truncate ${conv.isNew || conv.highlighted ? "text-blue-700 font-semibold" : "text-slate-500"}`}>
            {conv.preview}
          </p>
        </div>
      </div>

      {/* Bouton de suppression préservé */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Empêche l'ouverture de la conversation lors du clic sur supprimer
          onDelete(id);
        }}
        className="p-2 hover:bg-red-100 rounded-lg group transition-colors"
      >
        <Trash2 size={16} className="text-slate-400 group-hover:text-red-500" />
      </button>
    </div>
  );
}

function ChatBubble({ mine, text, when }) {
  return (
    <div className={`w-full flex ${mine ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${mine ? "bg-slate-900 text-white rounded-tr-none" : "bg-white border border-slate-200 rounded-tl-none text-slate-800"
        }`}>
        <div className="text-sm leading-relaxed">{text}</div>
        <div className={`text-[10px] mt-1 ${mine ? "text-slate-400" : "text-slate-500"}`}>{when}</div>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function MyMessagesContent() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const currentUser = {
  id: storedUser._id || "temp_id",
  fullName: storedUser.fullName || "Utilisateur"
};
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const socketRef = useRef(null);


  const { car, sellerName, sellerId } = location.state || {};


  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(car?._id || null);
  const [draft, setDraft] = useState("");

  const activeConv = useMemo(
    () => conversations.find((c) => (c.id || c._id)?.toString() === activeId?.toString()),
    [conversations, activeId]
  );

  const currentCar =
    typeof activeConv?.listingId === "object"
      ? activeConv.listingId
      : activeConv?.listing || null;

      

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Remplace l'URL par ton point d'accès API réel
        const response = await fetch(`http://localhost:5000/api/conversations/${currentUser.id}`);
        const data = await response.json();

        // On formate les données pour s'assurer que le nom affiché est celui de l'interlocuteur
        const formattedConvs = data.map(conv => {
          const otherMember = conv.members.find(m => m._id !== currentUser.id);
          return {
            ...conv,
            fromName: otherMember?.fullName || "Utilisateur",
            otherMemberId: otherMember?._id,
            isNew: conv.unreadBy.includes(currentUser.id), 
      highlighted: conv.unreadBy.includes(currentUser.id)
          };
        });

        setConversations(formattedConvs);

      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
      }
    };

    if (currentUser.id) {
      fetchConversations();
    }
  }, [currentUser.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  // 1. Initialisation Socket
  useEffect(() => {
  const socket = io(SOCKET_URL);
  socketRef.current = socket;

  // rejoindre room user
  socket.emit("join_user_room", currentUser.id);

 socket.on("receive_message", (msg) => {
  const msgConvId = msg.conversationId.toString();
  const isMe = (msg.sender?._id || msg.sender).toString() === currentUser.id.toString();

  setConversations((prev) => {
    // 1. Trouver l'index de la conversation
    const existingIndex = prev.findIndex((c) => (c.id || c._id).toString() === msgConvId);

    let updatedConv;

    if (existingIndex !== -1) {
      // ✅ ELLE EXISTE : On crée une version mise à jour
      const oldConv = prev[existingIndex];
      updatedConv = {
        ...oldConv,
        preview: msg.text,
        highlighted: !isMe, // Cadre bleu
        isNew: !isMe,       // Badge "Nouveau"
        messages: [...(oldConv.messages || []), {
          id: msg._id,
          text: msg.text,
          mine: isMe,
          when: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }],
      };

      // 🔥 ACTION CRUCIALE : On enlève l'ancienne et on met la nouvelle à l'index 0 (en haut)
      const otherConvs = prev.filter((_, idx) => idx !== existingIndex);
      return [updatedConv, ...otherConvs];

    } else {
      // ✅ NOUVELLE CONVERSATION : On l'ajoute au sommet
      const newConv = {
        id: msgConvId,
        _id: msgConvId,
        fromName: isMe ? (msg.receiver?.fullName || "Destinataire") : (msg.sender?.fullName || "Nouveau"),
        preview: msg.text,
        highlighted: !isMe,
        isNew: !isMe,
        messages: [{
          id: msg._id,
          text: msg.text,
          mine: isMe,
          when: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }],
      };
      return [newConv, ...prev];
    }
  });
});

  return () => socket.disconnect();
}, []);

  // 2. Logique Buyer (Nouvelle discussion)
  useEffect(() => {
    if (car && sellerId) {
      const convId = getConversationId(car._id, currentUser.id, sellerId);
      setConversations(prev => {
        const exists = prev.find(c => (c.id || c._id) === convId);

        if (exists) return prev;

        return [{
          id: convId,
          _id: convId,
          fromName: sellerName,
          otherMemberId: sellerId,
          preview: "Démarrer la discussion...",
          messages: [],
          listingId: car._id,   // ✅ backend
          listing: car,         // ✅ frontend
          members: [currentUser.id, sellerId]
        }, ...prev];
      });
      setActiveId(convId);
      socketRef.current?.emit("join_conversation", convId);
    }
  }, [car, sellerId, sellerName]);

  const openConversation = async (conv) => {
    const id = conv.id || conv._id;

    setActiveId(id);
    setConversations(prev => prev.map(c => 
    (c.id || c._id) === id ? { ...c, highlighted: false, isNew: false } : c
  ));
    socketRef.current?.emit("join_conversation", id);

  try {
    await fetch(`http://localhost:5000/api/conversations/read/${id}/${currentUser.id}`, {
      method: "PATCH"
    });
  } catch (err) {
    console.error("Erreur mark as read:", err);
  }

    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`);
      const data = await res.json();

      setConversations(prev =>
        prev.map(c => {
          if ((c.id || c._id).toString() === id.toString()) {
            return {
              ...c,
              highlighted: false,
              messages: data.map(m => ({
                id: m._id,
                text: m.text,
                mine: (m.sender._id === currentUser.id),
                when: new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              }))
            };
          }
          return c;
        })
      );

    } catch (err) {
      console.error("Erreur chargement messages:", err);
    }
  };

  const deleteConversation = async (id) => {
    try {
      const raw = localStorage.getItem("user");
      const user = JSON.parse(raw);

      await fetch(`http://localhost:5000/api/conversations/full/${id}/${user._id}`, {
        method: "DELETE",
      });

      // ✅ Update UI après succès
      setConversations(prev =>
        prev.filter(c => (c.id || c._id) !== id)
      );

      if (activeId === id) setActiveId(null);

    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  // ✅ ENVOI MESSAGE SANS DOUBLON
  const sendMessage = () => {
    if (!draft.trim() || !activeId || !socketRef.current) return;

    const receiverId =
      activeConv?.otherMemberId ||
      activeConv?.members?.find(m => (m._id || m)?.toString() !== currentUser.id.toString()) ||
      sellerId;

    if (!receiverId) return;

    const listingId = car?._id || activeConv?.listingId?._id || activeConv?.listingId;
    if (!listingId) return;

    const conversationId = activeConv?.id || activeConv?._id || getConversationId(listingId, currentUser.id, receiverId);
    if (!conversationId) return;

    const messageData = {
      conversationId,
      senderId: currentUser.id,
      receiverId,
      text: draft,
      listingId,
    };

    // 1. Envoyer au serveur
    socketRef.current.emit("send_message", messageData);

    // 2. Ajouter localement (Optimistic UI) pour affichage immédiat à DROITE
    
    setDraft("");
  };

  return (
    <div className="h-[calc(100vh-0px)] w-full bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full bg-slate-900 shrink-0">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
            <MessageSquare className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Mes Messages</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="h-full grid grid-cols-12 gap-6">
          {/* Liste Conversations */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 h-full flex flex-col min-h-0">
            <div className="h-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col">
              <div className="font-bold text-slate-900 mb-4">Conversations ({conversations.length})</div>
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {conversations.map((c) => (
                  <ConversationRow
                    key={c.id || c._id}
                    conv={c}
                    isActive={(c.id || c._id) === activeId}
                    isHighlighted={c.highlighted}
                    onOpen={openConversation}
                    onDelete={deleteConversation}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Chat Principal */}
          <main className="col-span-12 md:col-span-8 lg:col-span-6 h-full flex flex-col min-h-0">
            <div className="h-full bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-white">
                <Avatar name={activeConv?.fromName || "—"} />
                <div className="font-bold text-slate-900">{activeConv?.fromName || "Sélectionnez un chat"}</div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-slate-50/30">
                {activeConv?.messages?.map((m, idx) => (
                  <ChatBubble key={m.id || idx} mine={m.mine} text={m.text} when={m.when} />
                ))}
                <div ref={scrollRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Votre message..."
                    className="flex-1 h-11 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!draft.trim() || !activeId}
                    className="h-11 w-11 rounded-xl bg-slate-900 flex items-center justify-center disabled:bg-slate-300 transition-transform active:scale-90"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Détails Annonce */}
          <aside className="hidden lg:flex lg:col-span-3 h-full flex-col">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

              {currentCar && (
                <div className="space-y-4 mt-2">

                  {/* Image */}
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={
                        currentCar.photos?.[0]
                          ? `http://localhost:5000/${currentCar.photos[0].replace(/^\/+/, "")}`
                          : "/no-image.jpg"
                      }
                      className="h-44 w-full object-cover"
                      alt={currentCar.title}
                    />
                  </div>

                  {/* Infos */}
                  <div className="space-y-2">

                    <h3 className="font-semibold text-base text-slate-900">
                      {currentCar.title}
                    </h3>

                    <p className="text-blue-600 text-2xl font-extrabold">
                      {currentCar.price?.toLocaleString()} DT
                    </p>

                    <div className="space-y-2 text-sm text-slate-500">

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{currentCar?.year || "—"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-slate-400" />
                        <span>
                          {(currentCar.km || currentCar.mileage || "—")}
                          {(currentCar.km || currentCar.mileage) ? " km" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>
                          {currentCar.location || currentCar.city || "—"}
                        </span>
                      </div>

                    </div>

                    <button
                      onClick={() => navigate(`/annonce/${currentCar._id}`)}
                      className="w-full mt-3 py-2.5 rounded-xl border border-slate-200"
                    >
                      Voir l'annonce
                    </button>

                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}