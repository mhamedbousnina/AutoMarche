import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleHelp,
  Globe,
  Mail,
  Sparkles,
  Tag,
  User,
  Plus,
  Search,
  ChevronDown,
  Car,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const CATS = [
  "Berlines",
  "SUV & 4x4",
  "Citadines",
  "Utilitaires",
  "Sport",
  "Luxe",
  "Électriques",
  "Pièces",
];

// ✅ Initiales depuis user.fullName
function getInitials(fullName = "") {
  return (
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "U"
  );
}

function readUserLS() {
  try {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export default function Navbar({ onOpenLogin, user }) {
  const navigate = useNavigate();

  // ✅ IMPORTANT: navUser prend localStorage en priorité (pour survivre au refresh)
  const [navUser, setNavUser] = useState(() => readUserLS() || user || null);

  // ✅ si parent change user, on sync (sans écraser avatarUrl si absent)
  useEffect(() => {
    if (!user) return;

    const stored = readUserLS() || {};
    const merged = { ...stored, ...user };

    // si le parent ne fournit pas avatarUrl, garder celui du storage
    if (user.avatarUrl === undefined) merged.avatarUrl = stored.avatarUrl;

    setNavUser(merged);
  }, [user]);

  // ✅ écoute l'event quand MyProfileContent met à jour l'avatar
  useEffect(() => {
    const sync = () => setNavUser(readUserLS());
    window.addEventListener("userUpdated", sync);
    return () => window.removeEventListener("userUpdated", sync);
  }, []);

  const firstName = navUser?.fullName ? navUser.fullName.split(" ")[0] : null;

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenu(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goDashboard = () => {
    setOpenMenu(false);
    navigate("/dashboard");
  };

  const logout = () => {
    setOpenMenu(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="w-full">
      {/* Top dark bar */}
      <div className="bg-slate-900 text-slate-200">
        <div className="w-full px-8">
          <div className="h-10 flex items-center justify-between text-sm">
            <div className="flex items-center gap-5">
              <a href="#" className="flex items-center gap-2 hover:text-white">
                <CircleHelp className="h-4 w-4 opacity-90" />
                <span className="font-semibold">Aide &amp; Support</span>
              </a>

              <div className="flex items-center gap-2 opacity-90">
                <Mail className="h-4 w-4 opacity-90" />
                <span>contact@automarche.tn</span>
              </div>

              <div className="flex items-center gap-2 opacity-90">
                <Globe className="h-4 w-4 opacity-90" />
                <span className="font-semibold">FR</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-2 hover:text-white">
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">Nouveau</span>
              </a>

              <a href="#" className="flex items-center gap-2 hover:text-white">
                <Tag className="h-4 w-4" />
                <span className="font-semibold">Promotions</span>
              </a>

              <a href="#" className="font-semibold hover:text-white">
                Acheter
              </a>
              <a href="#" className="font-semibold hover:text-white">
                Vendre
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main white bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-20 flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 min-w-65">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 grid place-items-center text-white">
                <Car className="h-7 w-7" />
              </div>

              <div className="leading-tight">
                <div
                  onClick={() => navigate("/")}
                  className="text-2xl font-extrabold text-slate-900 cursor-pointer hover:text-blue-600 transition"
                >
                  AutoMarché
                </div>
                <div className="text-xs font-semibold text-slate-500 tracking-wide">
                  ACHAT &amp; VENTE AUTO
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-3xl">
                <div className="h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center overflow-hidden">
                  <div className="px-4 text-slate-500">
                    <Search className="h-5 w-5" />
                  </div>

                  <input
                    className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-500 text-base"
                    placeholder="Marque, modèle, ville..."
                  />

                  <div className="h-7 w-px bg-slate-300" />

                  <button className="px-6 h-full text-blue-600 font-semibold hover:bg-slate-200/60">
                    Filtres
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 min-w-65 justify-end">
              {/* Publier */}
              <button
                onClick={() => {
                  if (navUser) navigate("/publier");
                  else onOpenLogin();
                }}
                className="h-12 px-7 rounded-2xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Publier
              </button>

              {/* User dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    if (!navUser) onOpenLogin();
                    else setOpenMenu((v) => !v);
                  }}
                  className="h-12 px-4 pr-6 rounded-2xl bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50 flex items-center gap-3"
                >
                  {/* ✅ Avatar : photo si existe sinon initiales */}
                  {navUser ? (
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-blue-600 text-white text-sm font-bold grid place-items-center">
                      {navUser.avatarUrl ? (
                        <img
                          src={navUser.avatarUrl}
                          alt="avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(navUser.fullName)
                      )}
                    </div>
                  ) : (
                    <User className="h-5 w-5" />
                  )}

                  <span>{firstName || "Connexion"}</span>

                  {navUser ? <ChevronDown className="h-4 w-4 text-slate-500" /> : null}
                </button>

                {navUser && openMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {navUser.fullName || "Utilisateur"}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {navUser.email || ""}
                      </div>
                    </div>

                    <div className="h-px bg-slate-200" />

                    <MenuItem
                      icon={LayoutDashboard}
                      label="Tableau de bord"
                      onClick={goDashboard}
                    />

                    <div className="h-px bg-slate-200" />

                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition text-sm"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-semibold">Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categories row */}
          <nav className="h-12 flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#" className="flex items-center gap-1 hover:text-blue-600">
              Toutes <ChevronDown className="h-4 w-4 text-slate-500" />
            </a>

            {CATS.map((c) => (
              <a key={c} href="#" className="hover:text-blue-600">
                {c}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition text-sm"
    >
      <Icon className="h-5 w-5 text-slate-500" />
      <span className="font-semibold">{label}</span>
    </button>
  );
}