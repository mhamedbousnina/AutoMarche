import React, { useEffect, useMemo, useState } from "react";
import { Car, Eye, MessageSquare, Heart, LayoutDashboard } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getMyListings } from "../apis/listings";
import { io } from "socket.io-client";

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
  const refreshKey = location.state?.refresh;

  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = io("http://localhost:5000"); // Socket.io

  // Charger annonces
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getMyListings();
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

  // Charger messages reçus initialement
  useEffect(() => {
    async function fetchMessages() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) return;

        const res = await axios.get(
          `http://localhost:5000/api/messages/received/${user._id}`
        );

        // Formater messages pour Dashboard
        const formatted = res.data.map((m) => ({
          _id: m._id,
          senderName: m.senderName || "Acheteur",
          text: m.text,
          listingTitle: m.listingTitle || "",
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Erreur messages:", err);
        setMessages([]);
      }
    }

    fetchMessages();
  }, []);

  // Écouter messages en temps réel
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?._id) return;

  socket.emit("join_user_room", user._id); // rejoindre sa room

  socket.on("new_dashboard_message", (payload) => {
    if (payload?.message) {
      setMessages((prev) => [payload.message, ...prev]);
    }
  });

  return () => socket.off("new_dashboard_message");
}, []);

  // Calculer stats
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
      messages: messages.length,
      favorites: totalFavorites,
    };
  }, [listings, messages]);

  return (
    <div className="flex-1 p-10">
      {/* Header */}
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

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={Car} value={stats.activeAds} label="Annonces actives" colorClass="text-blue-600" />
        <StatCard icon={Eye} value={stats.totalViews.toLocaleString()} label="Vues totales" colorClass="text-amber-500" />
        <StatCard icon={MessageSquare} value={stats.messages} label="Messages reçus" colorClass="text-green-600" />
        <StatCard icon={Heart} value={stats.favorites} label="Favoris" colorClass="text-red-500" />
      </div>

      {/* Messages récents */}
      <div className="mt-6 bg-white p-4 rounded-xl">
        <div className="font-bold mb-3">Messages récents</div>
        {messages.slice(0, 5).map((m) => (
          <div key={m._id} className="border-b py-2">
            <div className="font-semibold">{m.senderName}</div>
            <div className="text-sm text-gray-500">{m.text}</div>
            {m.listingTitle && <div className="text-xs text-gray-400">{m.listingTitle}</div>}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-sm text-gray-400">Aucun message reçu pour le moment</div>
        )}
      </div>

      {/* Activité récente */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-8 py-6 font-bold text-slate-900">Activité récente</div>
        <div className="px-8 pb-6 text-sm text-slate-500">
          {loading ? "Chargement..." : "Statistiques synchronisées avec vos annonces."}
        </div>
      </div>
    </div>
  );
}