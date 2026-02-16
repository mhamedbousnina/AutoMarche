import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgePercent,
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

export default function Navbar({ onOpenLogin, user }) {
  const navigate = useNavigate();

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : null;

  return (
    <header className="w-full">
      {/* Top dark bar */}
      <div className="bg-slate-900 text-slate-200">
        <div className="w-full px-8">
          <div className="h-10 flex items-center justify-between text-sm">
            {/* Left */}
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

            {/* Right */}
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
                <div className="text-2xl font-extrabold text-slate-900">
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
              {/* ✅ Publier: si connecté -> /publier, sinon login */}
              <button
                onClick={() => {
                  if (user) navigate("/publier");
                  else onOpenLogin();
                }}
                className="h-12 px-7 rounded-2xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Publier
              </button>

              {/* ✅ Connexion: affiche prénom si connecté */}
              <button
                onClick={() => {
                  if (!user) onOpenLogin();
                  else navigate("/profil"); // optionnel: si tu n'as pas /profil, remplace par onOpenLogin ou remove
                }}
                className="h-12 px-7 rounded-2xl bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="h-5 w-5" />
                {firstName || "Connexion"}
              </button>
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