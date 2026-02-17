import React from "react";
import { Car, Eye, MessageSquare, Heart } from "lucide-react";
import { LayoutDashboard } from "lucide-react";

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

export default function DashboardContent({
  stats = { activeAds: 3, totalViews: 1240, messages: 5, favorites: 8 },
  activity = [
    { id: "1", text: "Nouvelle vue sur votre annonce Peugeot 208", when: "Il y a 2 h" },
    { id: "2", text: "Message reçu de Karim B.", when: "Il y a 5 h" },
    { id: "3", text: "Votre annonce Golf 7 a été publiée", when: "Hier" },
  ],
}) {
  return (
    <div className="flex-1 p-10">
      <div className="bg-slate-900">
                <div className="w-full px-8 py-7">
                    <div className="flex items-center gap-3 text-white">
                        <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
                            <LayoutDashboard className="h-5 w-5 text-slate-900" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold">Tableau De Board</h1>
                          
                        </div>
                    </div>
                </div>
            </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={Car} value={stats.activeAds} label="Annonces actives" colorClass="text-blue-600" />
        <StatCard icon={Eye} value={stats.totalViews.toLocaleString()} label="Vues totales" colorClass="text-amber-500" />
        <StatCard icon={MessageSquare} value={stats.messages} label="Messages reçus" colorClass="text-green-600" />
        <StatCard icon={Heart} value={stats.favorites} label="Favoris" colorClass="text-red-500" />
      </div>

      {/* Activité récente */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-8 py-6 font-bold text-slate-900">Activité récente</div>
        <div className="px-8 pb-6 space-y-6">
          {activity.map((a, idx) => (
            <div key={a.id}>
              <div className="flex items-center justify-between gap-6">
                <div className="text-sm font-medium text-slate-900">{a.text}</div>
                <div className="text-xs text-slate-500 whitespace-nowrap">{a.when}</div>
              </div>
              {idx !== activity.length - 1 && <div className="mt-5 h-px bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}