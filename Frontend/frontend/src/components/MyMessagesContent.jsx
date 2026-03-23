import React, { useMemo, useState, useEffect, useRef } from "react"; // ✅ Ajout de useRef
import { Trash2, MessageSquare, Send, Car } from "lucide-react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold grid place-items-center shrink-0">
      {initials || "??"}
    </div>
  );
}

function NewBadge() {
  return (
    <span className="rounded-full bg-blue-600 text-white text-[11px] font-semibold px-3 py-1">
      Nouveau
    </span>
  );
}

function ConversationRow({ conv, isActive, onOpen, onDelete }) {
  const id = conv._id || conv.id;
  
  return (
    <div
      className={[
        "w-full border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors",
        isActive
          ? "bg-blue-50 border-blue-200"
          : conv.isNew
          ? "bg-blue-50/60 border-blue-100"
          : "bg-white border-slate-200",
      ].join(" ")}
    >
      <div
        className="flex items-start gap-3 flex-1 cursor-pointer"
        onClick={() => onOpen(conv)}
      >
        <Avatar name={conv.fromName} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold truncate">{conv.fromName}</div>
            {conv.isNew && <NewBadge />}
          </div>
          <div className="text-sm text-slate-600 truncate">{conv.preview}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-xs text-slate-400">{conv.when}</div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(id); }}>
          <Trash2 size={18} className="text-red-500 hover:text-red-700" />
        </button>
      </div>
    </div>
  );
}

function ChatBubble({ mine, text, when }) {
  return (
    <div className={mine ? "text-right" : "text-left"}>
      <div
        className={
          mine
            ? "inline-block bg-slate-900 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]"
            : "inline-block bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[80%]"
        }
      >
        <div className="text-sm leading-relaxed text-left">{text}</div>
        <div className={`text-[10px] mt-1 ${mine ? "text-slate-400" : "text-slate-500"}`}>
          {when}
        </div>
      </div>
    </div>
  );
}

export default function MyMessagesContent() {
  const location = useLocation();
  const navState = location.state || {};
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [draft, setDraft] = useState("");

  // 🟢 LOGIQUE SCROLL AUTOMATIQUE
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const activeConv = conversations.find((c) => (c._id || c.id) === activeId);

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages]); 
  // -----------------------------

  // 🔥 Charger TOUTES les conversations au démarrage
// 🔥 CHARGER TOUTES LES CONVERSATIONS (LISTE DE GAUCHE)
useEffect(() => {
  if (!user?._id) return;

  const fetchMyConversations = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/conversations/${user._id}`);
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();

      // On formate les données pour l'affichage
      const formatted = data.map((c) => {
  const otherMember = c.members.find((m) => m._id !== user._id);
  
  return {
    ...c,
    id: c._id,
    fromName: otherMember?.fullName || "Utilisateur",
    preview: c.lastMessage || "Nouveau message...",
    // On garde listingId intact pour que openConversation le trouve
    listingId: c.listingId 
  };
});

      setConversations(formatted);
      if (formatted.length > 0 && !activeId) {
  setActiveId(formatted[0].id);
  if (formatted[0].listingId) {
    setSelectedCar(formatted[0].listingId);
  }
}
    } catch (err) {
      console.error("❌ Erreur chargement conversations:", err);
    }
  };

  fetchMyConversations();
}, [user?._id]);

 useEffect(() => {
  if (!activeId) return;

  const loadMessages = async () => {
    try {
      // Nettoyage de l'ID (au cas où il y aurait un préfixe "conv_")
      const cleanId = activeId.toString().replace("conv_", "");

      const res = await fetch(`http://localhost:5000/api/messages/${cleanId}`);

      if (!res.ok) {
        console.error("❌ Erreur API:", res.status);
        return;
      }

      const data = await res.json();

      setConversations((prev) =>
        prev.map((c) => {
          if ((c._id || c.id).toString() === activeId.toString()) {
            return {
              ...c,
              messages: data.map((m) => ({
                ...m,
                // On vérifie si l'ID du sender correspond à l'utilisateur connecté
                mine: (m.sender?._id || m.sender) === user._id,
                when: new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })),
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("❌ loadMessages error:", err);
    }
  };

  loadMessages();
}, [activeId]); // Se déclenche dès que vous changez de conversation

  useEffect(() => {
  if (navState?.car?.initialConversation) {
    const conv = navState.car.initialConversation;
    const id = conv._id || conv.id;

    setConversations((prev) => {
      // On vérifie si elle existe déjà pour ne pas avoir de doublons
      const exists = prev.find((c) => (c._id || c.id) === id);
      if (exists) return prev;
      
      // On l'ajoute au début de la liste avec l'annonce (car) attachée
      return [{ ...conv, listingId: navState.car }, ...prev];
    });

    setActiveId(id);
    setSelectedCar(navState.car); // 🔥 Affiche l'annonce tout de suite
  }
}, [navState]);

  useEffect(() => {
    if (user?._id) socket.emit("join_user_room", user._id);
    if (activeId) socket.emit("join_conversation", activeId.toString().replace("conv_", ""));
  }, [activeId, user?._id]);

useEffect(() => {
  const handleMessage = (message) => {
    setConversations((prev) =>
      prev.map((c) => {
        const convId = (c._id || c.id).toString().replace("conv_", "");
        const incomingConvId = message.conversationId.toString().replace("conv_", "");

        if (convId !== incomingConvId) return c;

        // 🛡️ PROTECTION CONTRE LES DOUBLONS
        // On vérifie si le message (par son ID) est déjà présent
        const alreadyExists = c.messages?.some(
          (m) => (m._id || m.id) === (message._id || message.id)
        );
        
        // Si l'ID existe déjà, on ne change rien à cette conversation
        if (alreadyExists) return c;

        return {
          ...c,
          preview: message.text,
          messages: [
            ...(c.messages || []),
            {
              ...message,
              mine: message.sender._id === user._id || message.sender === user._id,
              when: new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
        };
      })
    );
  };

  socket.on("receive_message", handleMessage);
  return () => socket.off("receive_message", handleMessage);
}, [user?._id]);


function openConversation(conv) {
  setActiveId(conv._id || conv.id);
  
  // 🔥 On vérifie toutes les sources possibles de l'annonce
  const carData = conv.listingId || conv.car; 
  
  if (carData) {
    setSelectedCar(carData);
  } else {
    // Si on n'a rien, on ne laisse pas l'ancien affichage
    setSelectedCar(null); 
  }
}

  function deleteConversation(convId) {
    setConversations((prev) => prev.filter((c) => (c._id || c.id) !== convId));
    if (convId === activeId) setActiveId(null);
  }

  async function sendMessage() {
  if (!draft.trim() || !activeConv || !user?._id) return;

  const messageText = draft;
  // On nettoie l'ID pour correspondre au format MongoDB
  const cleanConvId = (activeConv._id || activeConv.id).toString().replace("conv_", "");

  try {
    // 1. APPEL À TON API (Enregistrement en BDD)
    const response = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: cleanConvId,
        senderId: user._id,
        text: messageText
      }),
    });

    if (!response.ok) throw new Error("Erreur serveur lors de l'envoi");

    const savedMessage = await response.json();

    // 2. MISE À JOUR OPTIMISTE DE L'INTERFACE
    // Note : Ton backend envoie déjà "receive_message" via Socket, 
    // donc si ton useEffect Socket est bien réglé, le message apparaîtra tout seul.
    // Sinon, tu peux forcer l'ajout ici :
    setConversations((prev) =>
      prev.map((c) => {
        if ((c._id || c.id).toString() === (activeConv._id || activeConv.id).toString()) {
          return {
            ...c,
            preview: messageText,
            messages: [
              ...(c.messages || []),
              {
                ...savedMessage,
                mine: true,
                when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ],
          };
        }
        return c;
      })
    );

    setDraft(""); // Vider le champ de texte
  } catch (err) {
    console.error("❌ Erreur envoi message:", err);
    alert("Impossible d'envoyer le message.");
  }
}

  return (
    <div className="h-[calc(100vh-0px)] w-full bg-slate-50 flex flex-col">
      <div className="w-full bg-slate-900 shrink-0">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
            <MessageSquare className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Mes Messages</h1>
        </div>
      </div>

      <div className="flex-1 w-full px-6 py-6 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 h-full overflow-hidden flex flex-col">
            <div className="h-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="font-bold text-slate-900">Conversations</div>
                <div className="text-xs text-slate-400">{conversations.length}</div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {conversations.length === 0 ? (
                  <div className="text-sm text-slate-500 py-10 text-center">Aucune conversation</div>
                ) : (
                  conversations.map((c) => (
                    <ConversationRow
                      key={c._id || c.id}
                      conv={c}
                      isActive={(c._id || c.id) === activeId}
                      onOpen={openConversation}
                      onDelete={deleteConversation}
                    />
                  ))
                )}
              </div>
            </div>
          </aside>

          <main className="col-span-12 md:col-span-8 lg:col-span-6 h-full overflow-hidden flex flex-col">
            <div className="h-full bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={activeConv?.fromName || "—"} />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{activeConv?.fromName || "Sélectionnez un chat"}</div>
                    <div className="text-xs text-green-500 font-medium">{activeConv ? "En ligne" : "—"}</div>
                  </div>
                </div>
              </div>

              {/* ZONE DE MESSAGES AVEC SCROLL */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-slate-50/50">
                {activeConv ? (
                  <>
                    {activeConv.messages?.map((m, idx) => (
                      <ChatBubble key={m._id || m.id || idx} mine={m.mine} text={m.text} when={m.when || "maintenant"} />
                    ))}
                    {/* 🟢 CIBLE DU SCROLL */}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="h-full grid place-items-center text-slate-400 text-sm italic">Sélectionne une conversation pour commencer</div>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={activeConv ? "Écrire un message..." : "—"}
                    disabled={!activeConv}
                    className="flex-1 h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!activeConv || !draft.trim()}
                    className="h-12 w-12 rounded-xl bg-slate-900 disabled:bg-slate-300 flex items-center justify-center transition-transform active:scale-95"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </main>

          <aside className="col-span-12 lg:col-span-3 h-full overflow-hidden flex flex-col">
            {/* Détails de l'annonce inchangés */}
            <div className="h-full bg-white border border-slate-200 rounded-2xl p-4 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-900 grid place-items-center"><Car size={18} className="text-white" /></div>
                <div>
                  <div className="font-bold text-slate-900">Annonce</div>
                  <div className="text-xs text-slate-500">Détails du véhicule</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {selectedCar?.photos?.[0] ? <img src={selectedCar.photos[0]} alt="car" className="w-full h-40 object-cover" /> : <div className="h-40 bg-slate-100 grid place-items-center text-slate-400 text-sm italic">Aucune photo</div>}
                <div className="p-4 space-y-2">
                  <div className="font-extrabold text-slate-900 truncate">{selectedCar?.title || "—"}</div>
                  <div className="text-blue-600 font-bold text-lg">{selectedCar?.price || "—"} DT</div>
                  <div className="pt-2 space-y-2 text-sm text-slate-600">
                    <div>📅 {selectedCar?.year || "—"}</div>
                    <div>🛣️ {selectedCar?.km || "—"} km</div>
                    <div>📍 {selectedCar?.location || "—"}</div>
                  </div>
                  <button className="w-full h-11 mt-2 rounded-xl bg-amber-400 text-slate-900 font-bold hover:bg-amber-500 transition-colors">Voir l’annonce</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}