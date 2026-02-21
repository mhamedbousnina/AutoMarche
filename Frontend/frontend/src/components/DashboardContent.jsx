import React, { useEffect, useMemo, useState } from "react";
import { Car, Eye, MessageSquare, Heart, LayoutDashboard } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getMyListings } from "../apis/listings";

function StatCard({ icon: Icon, value, label, colorClass }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>

      <div className="mt-5 text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-600">{label}</div>
    </div>
  );
}

export default function DashboardContent() {
  const location = useLocation();
  const refreshKey = location.state?.refresh; // ✅ quand tu navigues avec refresh: Date.now()

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  

  // ✅ charge les annonces du user
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getMyListings(); // doit retourner array
        if (!mounted) return;
        setListings(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setListings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  // ✅ calcule les stats
 const stats = useMemo(() => {
  const activeAds = listings.length;

  const totalViews = listings.reduce((sum, l) => sum + Number(l.views || 0), 0);

  const totalFavorites = listings.reduce(
    (sum, l) => sum + Number(l.favoritesCount || 0),
    0
  );

  return {
    activeAds,
    totalViews,
    messages: 0,
    favorites: totalFavorites, // ✅
  };
}, [listings]);

  return (
    <div className="flex-1 p-10">
      <div className="bg-slate-900">
        <div className="w-full px-8 py-7">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
              <LayoutDashboard className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Tableau De Bord</h1>
              <p className="text-sm text-white/70">
                {loading ? "Synchronisation..." : `${listings.length} annonce(s)`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={Car}
          value={stats.activeAds}
          label="Annonces actives"
          colorClass="text-blue-600"
        />
        <StatCard
          icon={Eye}
          value={stats.totalViews.toLocaleString()}
          label="Vues totales"
          colorClass="text-amber-500"
        />
        <StatCard
          icon={MessageSquare}
          value={stats.messages}
          label="Messages reçus"
          colorClass="text-green-600"
        />
        <StatCard
          icon={Heart}
          value={stats.favorites}
          label="Favoris"
          colorClass="text-red-500"
        />
      </div>

      {/* Activité récente (optionnel) */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-8 py-6 font-bold text-slate-900">Activité récente</div>
        <div className="px-8 pb-6 text-sm text-slate-500">
          {loading ? "Chargement..." : "Statistiques synchronisées avec vos annonces."}
        </div>
      </div>
    </div>
  );
}