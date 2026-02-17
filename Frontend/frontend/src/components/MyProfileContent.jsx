import React, { useState } from "react";
import { User } from "lucide-react";

export default function MyProfileContent() {
  const [form, setForm] = useState({
    fullName: "Ahmed Mansour",
    email: "ahmed@email.com",
    phone: "98 765 432",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setSaved(false);
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // ✅ Validation simple frontend
    if (form.newPassword !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSaved(true);
  }

  const initials =
    form.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex-1 p-10">
      {/* Header */}
      <div className="w-full bg-slate-900 rounded-lg">
        <div className="px-8 py-7 flex items-center gap-4 text-white">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
            <User className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-3xl font-extrabold">Mes informations</h1>
        </div>
      </div>

      {/* Card agrandie jusqu'au milieu */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 max-w-4xl">
        {/* Avatar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white grid place-items-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                {form.fullName}
              </div>
              <div className="text-sm text-slate-500">
                Membre AutoMarché
              </div>
            </div>
          </div>

          {saved && (
            <div className="text-sm font-semibold text-emerald-600">
              ✅ Enregistré
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="font-semibold text-slate-800 mb-4">
              Changer le mot de passe
            </h2>

            {/* Mot de passe actuel */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nouveau mot de passe */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirmer */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="mt-3 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Bouton */}
          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}