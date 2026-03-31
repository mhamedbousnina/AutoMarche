import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { TUNISIA_GOVS, TUNISIA_CITIES } from "../data/tunisia";

const FUEL_OPTIONS = ["Essence", "Diesel", "GPL", "Hybride", "Électrique"];
const GEARBOX_OPTIONS = ["Manuelle", "Automatique", "Séquentielle"];
const YEAR_OPTIONS = Array.from({ length: 35 }, (_, index) => 2025 - index);

const EMPTY_FILTERS = {
  brand: "",
  minPrice: "",
  maxPrice: "",
  year: "",
  fuel: "",
  gearbox: "",
  gov: "",
  city: "",
};

export default function FilterModal({ open, values, onApply, onClose, onReset }) {
  const [form, setForm] = useState(values || EMPTY_FILTERS);

  useEffect(() => {
    if (!open) return;
    setForm(values || EMPTY_FILTERS);
  }, [open, values]);

  const cityOptions = useMemo(() => {
    if (!form.gov) return [];
    return TUNISIA_CITIES[form.gov] || [];
  }, [form.gov]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onApply?.(form);
    onClose?.();
  }

  function handleClear() {
    setForm(EMPTY_FILTERS);
    onReset?.();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-8 py-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Filtrer les annonces</h2>
            <p className="mt-2 text-sm text-slate-500">
              Choisissez les critères et appliquez-les aux annonces publiées.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Marque
                  <input
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                    placeholder="Renault, Peugeot..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Carburant
                  <select
                    value={form.fuel}
                    onChange={(e) => updateField("fuel", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Tous</option>
                    {FUEL_OPTIONS.map((fuel) => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Ligne de prix min
                  <input
                    type="number"
                    min="0"
                    value={form.minPrice}
                    onChange={(e) => updateField("minPrice", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Boîte de vitesse
                  <select
                    value={form.gearbox}
                    onChange={(e) => updateField("gearbox", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Tous</option>
                    {GEARBOX_OPTIONS.map((gear) => (
                      <option key={gear} value={gear}>{gear}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Année
                  <select
                    value={form.year}
                    onChange={(e) => updateField("year", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Toutes</option>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Gouvernorat
                  <select
                    value={form.gov}
                    onChange={(e) => updateField("gov", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Tous</option>
                    {TUNISIA_GOVS.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Ville
                  <select
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    disabled={!form.gov}
                  >
                    <option value="">Toutes</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-2xl border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Réinitialiser
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Appliquer les filtres
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
