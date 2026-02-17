import React from "react";
import { Car, Trash2 } from "lucide-react";
import { MessageSquare } from "lucide-react";

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

function MessageRow({ msg, onOpen, onDelete }) {
    return (
        <div
            className={[
                "w-full border rounded-xl p-4 transition",
                msg.isNew
                    ? "bg-blue-50 border-blue-100"
                    : "bg-white border-slate-200 hover:bg-slate-50",
            ].join(" ")}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div
                    onClick={() => onOpen?.(msg)}
                    className="flex items-start gap-3 min-w-0 cursor-pointer flex-1"
                >
                    <Avatar name={msg.fromName} />

                    <div className="min-w-0">
                        <div className="font-semibold text-slate-900">
                            {msg.fromName}
                        </div>
                        <div className="text-sm text-slate-600 truncate">
                            {msg.preview}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                        {msg.when}
                    </div>

                    {msg.isNew && <NewBadge />}

                    {/* ✅ Bouton Supprimer */}
                    <button
                        onClick={() => onDelete?.(msg)}
                        className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-red-50 grid place-items-center transition"
                        title="Supprimer"
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MyMessagesContent({
    messages = [
        {
            id: "1",
            fromName: "Karim B.",
            preview: "Bonjour, est-ce que la voiture est encore disponible ?",
            when: "il y a 2 h",
            isNew: true,
        },
        {
            id: "2",
            fromName: "Salma T.",
            preview: "Le prix est-il négociable ? Je suis intéressé.",
            when: "il y a 5 h",
            isNew: true,
        },
        {
            id: "3",
            fromName: "Mohamed A.",
            preview: "Merci pour les infos, je vais réfléchir.",
            when: "Hier",
            isNew: false,
        },
        {
            id: "4",
            fromName: "Leila R.",
            preview: "Est-ce que vous acceptez un échange ?",
            when: "il y a 2 j",
            isNew: false,
        },
    ],
    onOpenMessage,
    onDeleteMessage,
}) {
    return (
        <div className="flex-1 p-10">
            {/* ✅ Header plein largeur */}
            <div className="w-full bg-slate-900 rounded-lg">
                <div className="px-8 py-7">
                    <div className="flex items-center gap-3 text-white">
                        <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
                            <MessageSquare className="h-5 w-5 text-slate-900" />
                        </div>
                        <h1 className="text-3xl font-extrabold">
                            Mes Messages
                        </h1>
                    </div>
                </div>
            </div>

            {/* ✅ Plein écran (pas max-w) */}
            <div className="mt-8 space-y-4 w-full">
                {messages.map((m) => (
                    <MessageRow
                        key={m.id}
                        msg={m}
                        onOpen={onOpenMessage}
                        onDelete={onDeleteMessage}
                    />
                ))}
            </div>
        </div>
    );
}