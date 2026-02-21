import React, { useEffect, useState } from "react";
import { Car, Heart, MapPin, Gauge } from "lucide-react";
import { getMyFavorites, removeFavorite } from "../apis/favorites";
import { toBackendImage } from "../apis/listings";
import { useNavigate } from "react-router-dom";

function FavoriteRow({ fav, onRemove }) {
  const cover = fav?.photos?.[0] ? toBackendImage(fav.photos[0]) : null;
  const location = [fav.gov, fav.city].filter(Boolean).join(", ");
   const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/annonce/${fav._id}`)} // ✅ يفتح التفاصيل
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-slate-50 transition"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="h-14 w-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 grid place-items-center">
            {cover ? (
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <Car className="h-6 w-6 text-slate-500" />
            )}
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">
              {fav.title || "—"}
            </div>

            <div className="mt-1 text-sm font-bold text-amber-600">
              {fav.price !== undefined && fav.price !== null
                ? `${Number(fav.price).toLocaleString()} DT`
                : "—"}
            </div>

            <div className="mt-1 text-xs text-slate-500 flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location || "—"}
              </span>

              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" />
                {fav.mileage
                  ? `${Number(fav.mileage).toLocaleString()} km`
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Right heart */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ يمنع فتح التفاصيل
            onRemove?.(fav);
          }}
          className="h-10 w-10 rounded-lg border border-slate-200 bg-white hover:bg-red-50 grid place-items-center transition"
          title="Retirer des favoris"
        >
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        </button>
      </div>
    </div>
  );
}

export default function MyFavoritesContent() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ load favorites
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const listings = await getMyFavorites(); // returns array of listings
        if (!mounted) return;
        setFavorites(Array.isArray(listings) ? listings : []);
      } catch {
        if (!mounted) return;
        setFavorites([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ remove favorite
  async function onRemoveFavorite(fav) {
    if (!fav?._id) return;

    

    try {
      await removeFavorite(fav._id);
      setFavorites((prev) => prev.filter((x) => x._id !== fav._id));
    } catch (e) {
      alert(e.message || "Erreur suppression favori");
    }
  }

  return (
    <div className="flex-1 p-10">
      {/* Header */}
      <div className="w-full bg-slate-900 rounded-lg">
        <div className="px-8 py-7">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
              <Heart className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Mes Favoris</h1>
              <p className="text-sm text-white/70">
                {loading ? "Chargement..." : `${favorites.length} annonce(s)`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 space-y-4 w-full">
        {loading ? (
          <div className="text-slate-500">Chargement...</div>
        ) : favorites.length === 0 ? (
          <div className="text-slate-500">Aucun favori.</div>
        ) : (
          favorites.map((f) => (
            <FavoriteRow key={f._id} fav={f} onRemove={onRemoveFavorite} />
          ))
        )}
      </div>
    </div>
  );
}