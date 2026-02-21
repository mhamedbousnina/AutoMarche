import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Car, Pencil, Trash2, Megaphone, X } from "lucide-react";
import { getMyListings, toBackendImage, deleteListing } from "../apis/listings";

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

function AdRow({ ad, onOpen, onEdit, onDelete }) {
  const cover = ad.photos?.[0] ? toBackendImage(ad.photos[0]) : null;
  const location = [ad.gov, ad.city].filter(Boolean).join(", ");

  return (
    <div
      onClick={() => onOpen?.(ad)}
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-slate-50 transition"
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="h-14 w-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 grid place-items-center">
          {cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <Car className="h-6 w-6 text-slate-500" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 truncate">{ad.title}</div>

          <div className="mt-1 text-sm font-bold text-amber-600">
            {Number(ad.price).toLocaleString()} DT
          </div>

          <div className="mt-1 text-xs text-slate-500 truncate">
            {ad.contactFullName} • {ad.contactPhone} • {location || "—"}
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-3">
          <StatusBadge status={ad.status} />

          {/* Modifier */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(ad);
            }}
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center"
            title="Modifier"
          >
            <Pencil className="h-4 w-4 text-slate-600" />
          </button>

          {/* Supprimer */}
          <button
            type="button"
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

export default function MyAdsContent({ onDelete: onDeleteProp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ message suppression (rouge)
  const [deleteToast, setDeleteToast] = useState({
    show: false,
    text: "",
  });

  const refreshKey = location.state?.refresh;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getMyListings(); // idéalement retourne array
        if (!mounted) return;
        setAds(Array.isArray(data) ? data : data?.listings || []);
      } catch {
        if (mounted) setAds([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  // petite aide: afficher toast + auto-hide
  function showDeleteToast(msg) {
    setDeleteToast({ show: true, text: msg });
    window.setTimeout(() => setDeleteToast({ show: false, text: "" }), 3500);
  }

  async function onDelete(ad) {
  console.log("CLICK DELETE:", ad?._id); // ✅ DEBUG

  


  try {
    await deleteListing(ad._id);
    setAds((prev) => prev.filter((x) => x._id !== ad._id));
    showDeleteToast("Annonce supprimée avec succès");
  } catch (err) {
    console.error("DELETE ERROR:", err);
    alert(err?.message || "Erreur lors de la suppression");
  }
}

  return (
    <div className="flex-1 p-10">
      {/* ✅ Toast rouge (animation) */}
      {deleteToast.show && (
        <div className="w-full flex justify-center mb-6">
          <div className="bg-red-100 border border-red-300 text-red-800 px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn">
            <div className="h-10 w-10 rounded-full bg-red-600 text-white grid place-items-center animate-pop">
              <Trash2 className="h-5 w-5" />
            </div>

            <div className="font-semibold">{deleteToast.text}</div>

            <button
              type="button"
              onClick={() => setDeleteToast({ show: false, text: "" })}
              className="ml-2 text-red-700 hover:text-red-900"
              title="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

       <div className="w-full bg-slate-900 rounded-lg">
        <div className="px-8 py-7">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
              <Megaphone className="h-5 w-5 text-slate-900" />
            </div>
            <h1 className="text-3xl font-extrabold">Mes Annonces</h1>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-slate-500">Chargement...</div>
        ) : ads.length === 0 ? (
          <div className="text-slate-500">Aucune annonce.</div>
        ) : (
          ads.map((ad) => (
            <AdRow
              key={ad._id}
              ad={ad}
              onOpen={(ad) => navigate(`/annonce/${ad._id}`)}
              onEdit={(ad) => navigate(`/annonce/${ad._id}/modifier`)}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* ✅ Animations CSS si tu ne les as pas déjà */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .25s ease-out; }

        @keyframes pop {
          0% { transform: scale(.85); }
          100% { transform: scale(1); }
        }
        .animate-pop { animation: pop .18s ease-out; }
      `}</style>
    </div>
  );
}