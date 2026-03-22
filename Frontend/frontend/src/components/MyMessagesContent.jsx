import React, { useMemo, useState, useEffect } from "react";
import { Trash2, MessageSquare, Send, Car } from "lucide-react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// ✅ UNE SEULE connexion socket
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
  return (
    <div
      className={[
        "w-full border rounded-xl p-3 flex items-center justify-between gap-3",
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
        <div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{conv.fromName}</div>
            {conv.isNew && <NewBadge />}
          </div>
          <div className="text-sm text-slate-600">{conv.preview}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-xs text-slate-400">{conv.when}</div>
        <button onClick={() => onDelete(conv.id)}>
          <Trash2 className="text-red-500" />
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
            ? "inline-block bg-black text-white p-2 rounded"
            : "inline-block bg-gray-200 p-2 rounded"
        }
      >
        {text}
        <div className="text-xs">{when}</div>
      </div>
    </div>
  );
}

export default function MyMessagesContent() {
  const location = useLocation();
  const navState = location.state || {};

  const initialConversations = useMemo(() => [], []);

  const [conversations, setConversations] = useState(() => {
    if (navState?.car?.initialConversation) {
      return [navState.car.initialConversation, ...initialConversations];
    }
    return initialConversations;
  });

  const [activeId, setActiveId] = useState(() => {
    return navState?.car?.initialConversation?.id || null;
  });

  const [selectedCar, setSelectedCar] = useState(() => navState?.car || null);
  const [draft, setDraft] = useState("");

  const activeConv = conversations.find((c) => c.id === activeId);

  // ✅ rejoindre conversation
  useEffect(() => {
    if (activeId) {
      socket.emit("join_conversation", activeId);
    }
  }, [activeId]);

  // ✅ recevoir messages temps réel
  useEffect(() => {
    socket.on("receive_message", (message) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== message.conversationId) return c;

          return {
            ...c,
            messages: [...c.messages, message],
          };
        })
      );
    });

    return () => socket.off("receive_message");
  }, []);

  function openConversation(conv) {
    setActiveId(conv.id);

    if (navState?.car && conv.id === navState.car.initialConversation?.id) {
      setSelectedCar(navState.car);
    }
  }

  function deleteConversation(convId) {
    setConversations((prev) => prev.filter((c) => c.id !== convId));

    if (convId === activeId) {
      const remaining = conversations.filter((c) => c.id !== convId);
      setActiveId(remaining?.[0]?.id || null);
    }
  }

  // ✅ envoyer message temps réel
 function sendMessage() {
  if (!draft.trim() || !activeId) return;

  const raw = localStorage.getItem("user");
  if (!raw) {
    console.error("❌ user absent localStorage");
    return;
  }

  const user = JSON.parse(raw);

  if (!user?._id) {
    console.error("❌ user._id manquant", user);
    return;
  }

  const message = {
    id: Date.now(),
    conversationId: activeId,
    senderId: user._id,
    mine: true,
    text: draft,
    when: "maintenant",
  };

  socket.emit("send_message", {
    conversationId: activeId,
    senderId: user._id,
    text: draft,
  });

 


    // affichage immédiat
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;

        return {
          ...c,
          messages: [...c.messages, message],
        };
      })
    );

    setDraft("");
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
      <ChatBubble
        key={m._id || m.id} // 🔥 fix
        mine={m.mine}
        text={m.text}
        when={m.when}
      />
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
                {selectedCar?.photos?.[0] ? (
                  <img
                    src={selectedCar.photos[0]}
                    alt="car"
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="h-36 bg-slate-200 grid place-items-center text-slate-500 text-sm">
                    Image voiture
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="font-extrabold text-slate-900">
                    {selectedCar?.title || "—"}
                  </div>
                  <div className="text-blue-600 font-bold">
                    {selectedCar?.price || "—"} DT
                  </div>

                  <div className="pt-2 space-y-1 text-sm text-slate-600">
                    <div>📅 {selectedCar?.year || "—"}</div>
                    <div>🛣️ {selectedCar?.km || "—"} km</div>
                    <div>📍 {selectedCar?.location || "—"}</div>
                  </div>

                  <button className="w-full h-11 rounded-xl bg-amber-400 text-slate-900 font-semibold flex items-center justify-center gap-2 hover:bg-amber-500 transition">
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