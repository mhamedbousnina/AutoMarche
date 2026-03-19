import React, { useMemo, useEffect, useState, useRef } from "react";
import { Trash2, MessageSquare, Send, Car } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// ⚠️ simulate user connecté
const currentUser = {
  id: "seller_001",
};

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
  return (
    <div
      className={[
        "w-full border rounded-xl p-3 transition flex items-center justify-between gap-3",
        isActive
          ? "bg-blue-50 border-blue-200"
          : conv.isNew
          ? "bg-blue-50/60 border-blue-100 hover:bg-blue-50"
          : "bg-white border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      <div
        className="flex items-start gap-3 min-w-0 cursor-pointer flex-1"
        onClick={() => onOpen?.(conv)}
      >
        <Avatar name={conv.fromName} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="font-semibold text-slate-900 truncate">
              {conv.fromName}
            </div>
            {conv.isNew && <NewBadge />}
          </div>
          <div className="text-sm text-slate-600 truncate">{conv.preview}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="text-xs text-slate-400 whitespace-nowrap">
          {conv.when}
        </div>

        <button
          onClick={() => onDelete?.(conv.id)}
          className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-red-50 grid place-items-center transition"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}

function ChatBubble({ mine, text, when }) {
  return (
    <div className={["w-full flex", mine ? "justify-end" : "justify-start"].join(" ")}>
      <div
        className={[
          "max-w-[78%] rounded-2xl px-4 py-3 border",
          mine
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-900 border-slate-200",
        ].join(" ")}
      >
        <div className="text-sm leading-relaxed">{text}</div>
        {when && (
          <div className={["text-[11px] mt-1", mine ? "text-white/60" : "text-slate-400"].join(" ")}>
            {when}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyMessagesContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state || {};
  const car = locationState.car || null;
  const sellerName = locationState.sellerName || "";
  const sellerId = locationState.sellerId || "seller_001"; // 🔥 IMPORTANT

  // ✅ ROOM PRIVÉ FIX
  const roomId = useMemo(() => {
  if (!car?._id) return null;

  const ids = [currentUser.id, sellerId].sort(); // 🔥 clé
  return `chat_${car._id}_${ids[0]}_${ids[1]}`;
}, [car, sellerId]);

  const [conversations, setConversations] = useState([
    {
      id: "1",
      fromName: sellerName,
      preview: "Nouvelle conversation",
      when: "à l’instant",
      isNew: true,
      messages: [],
    },
  ]);

  const [activeId, setActiveId] = useState("1");
  const [draft, setDraft] = useState("");
  const socketRef = useRef(null);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  

  // ✅ SOCKET FIX
  useEffect(() => {
  if (!roomId) return;

  const socket = io(SOCKET_URL, { transports: ["websocket"] });
  socketRef.current = socket;

  socket.on("connect", () => {
    socket.emit("joinRoom", { roomId });
  });

  socket.on("message", (message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;

        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: message.id || `m_${Date.now()}`,
              text: message.text,
              mine: message.from?.id === currentUser.id,
              when: new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
          preview: message.text,
          when: "à l’instant",
        };
      })
    );
  });

  return () => {
    socket.disconnect(); // ❗ remove leaveRoom
  };
}, [roomId, activeId]);

  function sendMessage() {
  const text = draft.trim();
  if (!text || !activeConv || !socketRef.current) return;

  const messageData = {
    id: `m_${Date.now()}`,
    roomId,
    text,
    from: currentUser,
    to: {
      id: sellerId,
      name: sellerName,
    },
    listingId: car?._id,
    createdAt: new Date().toISOString(),
  };

  // ✅ afficher direct (optimistic UI)
  setConversations((prev) =>
    prev.map((c) => {
      if (c.id !== activeConv.id) return c;

      return {
        ...c,
        preview: text,
        when: "à l’instant",
        messages: [
          ...c.messages,
          {
            id: messageData.id,
            text,
            mine: true,
            when: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      };
    })
  );

  // ✅ envoyer socket
  socketRef.current.emit("sendMessage", messageData);

  setDraft("");
}

  function openConversation(conv) {
    setActiveId(conv.id);
  }

  function deleteConversation(convId) {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
  }

  return (
    <div className="h-[calc(100vh-0px)] w-full bg-slate-50">
      {/* Header */}
      <div className="w-full bg-slate-900">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
            <MessageSquare className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Mes Messages
          </h1>
        </div>
      </div>

      {/* Layout 3 colonnes */}
      <div className="h-[calc(100vh-76px)] w-full px-6 py-6">
        <div className="h-full grid grid-cols-12 gap-6">
          {/* Colonne gauche : Conversations */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 h-full">
            <div className="h-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-slate-900">Conversations</div>
                <div className="text-xs text-slate-400">{conversations.length}</div>
              </div>

              <div className="space-y-3 overflow-auto pr-1">
                {conversations.length === 0 ? (
                  <div className="text-sm text-slate-500 py-10 text-center">
                    Aucune conversation
                  </div>
                ) : (
                  conversations.map((c) => (
                    <ConversationRow
                      key={c.id}
                      conv={c}
                      isActive={c.id === activeId}
                      onOpen={openConversation}
                      onDelete={deleteConversation}
                    />
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Colonne centre : Chat */}
          <main className="col-span-12 md:col-span-8 lg:col-span-6 h-full">
            <div className="h-full bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
              {/* Chat header (avec supprimer à la place du téléphone) */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={activeConv?.fromName || "—"} />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {activeConv?.fromName || "Aucune conversation"}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {activeConv ? "En ligne" : "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto px-5 py-5 space-y-3 bg-slate-50">
                {activeConv ? (
                  activeConv.messages.map((m) => (
                    <ChatBubble key={m.id} mine={m.mine} text={m.text} when={m.when} />
                  ))
                ) : (
                  <div className="h-full grid place-items-center text-slate-500">
                    Sélectionne une conversation
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={activeConv ? "Écrire un message..." : "—"}
                    disabled={!activeConv}
                    className="flex-1 h-11 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!activeConv || !draft.trim()}
                    className="h-11 w-11 rounded-xl bg-slate-900 disabled:bg-slate-300 grid place-items-center transition"
                    title="Envoyer"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Colonne droite : Détails annonce */}
          <aside className="col-span-12 lg:col-span-3 h-full">
            <div className="h-full bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-900 grid place-items-center">
                  <Car className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Annonce</div>
                  <div className="text-xs text-slate-500">Détails du véhicule</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="h-36 rounded-2xl overflow-hidden bg-slate-200">
                  {car?.photos?.length ? (
                    <img
                      src={car.photos[0]}
                      alt={car.title || "Image voiture"}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-500 text-sm">
                      Image voiture
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="font-extrabold text-slate-900">
                    {car?.title || "Aucune annonce"}
                  </div>

                  <div className="text-blue-600 font-bold">
                    {car?.price ? `${car.price} DT` : ""}
                  </div>

                  <div className="pt-2 space-y-1 text-sm text-slate-600">
                    <div>📅 {car?.year || "-"}</div>
                    <div>🛣️ {car?.km || "-"}</div>
                    <div>📍 {car?.location || "-"}</div>
                  </div>

                  <button
                    onClick={() => {
                      const listingId = car?._id || car?.id;
                      if (listingId) navigate(`/annonce/${listingId}`);
                    }}
                    className="w-full h-11 rounded-xl bg-amber-400 text-slate-900 font-semibold flex items-center justify-center gap-2 hover:bg-amber-500 transition"
                  >
                    Voir l’annonce
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}