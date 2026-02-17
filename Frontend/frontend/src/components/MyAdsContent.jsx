import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, Pencil, Trash2 } from "lucide-react";
import { Megaphone } from "lucide-react";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();

  if (s === "active") {
    return (
      <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">
        Active
      </span>
    );
  }

  if (s === "pending" || s === "en attente") {
    return (
      <span className="rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1">
        En attente
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1">
      {status || "—"}
    </span>
  );
}

function AdRow({ ad, onEdit, onDelete, onOpen }) {
  return (
    <div
      onClick={() => onOpen?.(ad)}
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-slate-50 transition"
    >
      <div className="flex items-center gap-4">
        {/* Image placeholder */}
        <div className="h-14 w-16 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center shrink-0">
          <Car className="h-6 w-6 text-slate-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 truncate">{ad.title}</div>
          <div className="mt-1 text-sm font-bold text-amber-600">{ad.price}</div>
          <div className="mt-1 text-xs text-slate-500">
            {ad.views} vues &nbsp;&nbsp;•&nbsp;&nbsp; {ad.date}
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-3">
          <StatusBadge status={ad.status} />

          {/* ✅ stopPropagation pour ne pas ouvrir détail */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(ad);
            }}
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center"
            title="Modifier"
          >
            <Pencil className="h-4 w-4 text-slate-600" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(ad);
            }}
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-red-50 grid place-items-center"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyAdsContent({
  ads = [
    {
      id: "1",
      title: "Peugeot 208 Active 2020",
      price: "32,000 TND",
      views: 450,
      date: "12/01/2026",
      status: "Active",
    },
    {
      id: "2",
      title: "Volkswagen Golf 7 2019",
      price: "45,000 TND",
      views: 230,
      date: "10/01/2026",
      status: "Active",
    },
    {
      id: "3",
      title: "Renault Clio 5 2021",
      price: "38,000 TND",
      views: 470,
      date: "15/01/2026",
      status: "En attente",
    },
  ],
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-10">
      {/* HEADER DARK */}
      <div className="bg-slate-900 rounded-lg">
        <div className="w-full px-8 py-7">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
              <Megaphone className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Mes Annonces</h1>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {ads.map((ad) => (
          <AdRow
            key={ad.id}
            ad={ad}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpen={() => navigate(`/annonce/${ad.id}`)} // ✅ ouverture détail
          />
        ))}
      </div>
    </div>
  );
}