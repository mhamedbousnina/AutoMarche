import React from "react";
import { Car, Heart, MapPin, Gauge } from "lucide-react";

function FavoriteRow({ fav, onRemove }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="h-14 w-16 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center shrink-0">
            <Car className="h-6 w-6 text-slate-500" />
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">
              {fav.title}
            </div>

            <div className="mt-1 text-sm font-bold text-amber-600">
              {fav.price}
            </div>

            <div className="mt-1 text-xs text-slate-500 flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {fav.city}
              </span>

              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" />
                {fav.km}
              </span>
            </div>
          </div>
        </div>

        {/* Right heart */}
        <button
          onClick={() => onRemove?.(fav)}
          className="h-10 w-10 rounded-lg border border-slate-200 bg-white hover:bg-red-50 grid place-items-center transition"
          title="Retirer des favoris"
        >
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        </button>
      </div>
    </div>
  );
}

export default function MyFavoritesContent({
  favorites = [
    {
      id: "1",
      title: "BMW Série 3 2020",
      price: "65,000 TND",
      city: "Tunis",
      km: "45,000 km",
    },
    {
      id: "2",
      title: "Mercedes C200 2019",
      price: "72,000 TND",
      city: "Sousse",
      km: "80,000 km",
    },
    {
      id: "3",
      title: "Audi A4 2021",
      price: "85,000 TND",
      city: "Sfax",
      km: "30,000 km",
    },
  ],
  onRemoveFavorite,
}) {
  return (
    <div className="flex-1 p-10">
      {/* ✅ Header dark plein largeur */}
      <div className="w-full bg-slate-900 rounded-lg">
        <div className="px-8 py-7">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
              <Heart className="h-5 w-5 text-slate-900" />
            </div>
            <h1 className="text-3xl font-extrabold">Mes Favoris</h1>
          </div>
        </div>
      </div>

      {/* ✅ Plein écran */}
      <div className="mt-8 space-y-4 w-full">
        {favorites.map((f) => (
          <FavoriteRow key={f.id} fav={f} onRemove={onRemoveFavorite} />
        ))}
      </div>
    </div>
  );
}