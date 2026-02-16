import React from "react";
import {
  Car,
  Truck,
  Gauge,
  Users,
  Star,
  Shield,
  Zap,
  Wrench,
} from "lucide-react";

const CATS = [
  { label: "Berlines", count: "1240 annonces", icon: Car },
  { label: "SUV & 4x4", count: "876 annonces", icon: Truck },
  { label: "Citadines", count: "2100 annonces", icon: Gauge },
  { label: "Familiales", count: "654 annonces", icon: Users },
  { label: "Sport", count: "312 annonces", icon: Star },
  { label: "Luxe", count: "189 annonces", icon: Shield },
  { label: "Électriques", count: "423 annonces", icon: Zap },
  { label: "Pièces détachées", count: "3200 annonces", icon: Wrench },
];

export default function Categories() {
  return (
    <section className="w-full px-8 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">
          Explorez toutes les catégories
        </h2>
        <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
          Voir tout
        </a>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {CATS.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.label}
              href="#"
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center hover:shadow-sm transition"
            >
              {/* Icon circle */}
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                <Icon className="h-6 w-6 text-slate-600" />
              </div>

              {/* Text */}
              <div className="mt-4 font-bold text-slate-900 text-sm">
                {c.label}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {c.count}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}