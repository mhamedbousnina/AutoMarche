import React from "react";
import {
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Heart,
  User,
  HelpCircle,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardSidebar({
  user, // ✅ AJOUT: infos depuis DB
  active = "dashboard",
  counts = { ads: 3, messages: 5 },
  onLogout,
  onSelect,
}) {
  const navigate = useNavigate();

  // ✅ Initiales si pas d'avatar ou pas de nom
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("")
    : "U";

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-[calc(100vh-0px)] flex flex-col">
      {/* Header user */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white grid place-items-center font-bold">
              {initials}
            </div>
          )}

          <div className="leading-tight min-w-0">
            <div className="font-semibold text-slate-900 truncate">
              {user?.fullName || "Utilisateur"}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {user?.email || "email@example.com"}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200" />

      {/* Body scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Actions */}
        <div className="p-5">
          <div className="text-xs font-semibold text-slate-400 mb-3">
            Actions
          </div>

          <button
            onClick={() => navigate("/publier")}
            className="w-full h-11 rounded-xl bg-amber-400 text-slate-900 font-semibold flex items-center justify-center gap-2 hover:bg-amber-500 transition"
          >
            <Plus className="h-5 w-5" />
            Publier une annonce
          </button>
        </div>

        {/* Menu */}
        <div className="px-5 pb-5">
          <div className="text-xs font-semibold text-slate-400 mb-3">
            Mon espace
          </div>

          <div className="space-y-1">
            <Item
              icon={LayoutDashboard}
              label="Tableau de bord"
              active={active === "dashboard"}
              onClick={() => onSelect?.("dashboard")}
            />
            <Item
              icon={Megaphone}
              label="Mes annonces"
              active={active === "ads"}
              badge={counts?.ads}
              onClick={() => onSelect?.("ads")}
            />
            <Item
              icon={MessageSquare}
              label="Mes messages"
              active={active === "messages"}
              badge={counts?.messages}
              onClick={() => onSelect?.("messages")}
            />
            <Item
              icon={Heart}
              label="Mes favoris"
              active={active === "favorites"}
              onClick={() => onSelect?.("favorites")}
            />
            <Item
              icon={User}
              label="Mes informations"
              active={active === "profile"}
              onClick={() => onSelect?.("profile")}
            />
          </div>

          <div className="mt-6 text-xs font-semibold text-slate-400 mb-3">
            Support
          </div>

          <div className="space-y-1">
            <Item
              icon={HelpCircle}
              label="Aide & Support"
              active={active === "support"}
              onClick={() => onSelect?.("support")}
            />
            <Item
              icon={Settings}
              label="Paramètres"
              active={active === "settings"}
              onClick={() => onSelect?.("settings")}
            />
          </div>
        </div>
      </div>

      {/* Bottom fixed */}
      <div className="border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full px-5 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

function Item({ icon: Icon, label, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full h-11 px-4 rounded-xl flex items-center justify-between transition",
        active ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-slate-500" />
        <span className="text-sm font-medium">{label}</span>
      </div>

      {badge ? (
        <span className="min-w-7 h-7 px-2 rounded-full bg-blue-600 text-white text-xs font-bold grid place-items-center">
          {badge}
        </span>
      ) : null}
    </button>
  );
}