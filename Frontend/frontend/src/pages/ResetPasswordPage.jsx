import React from "react";
import { Car, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Background image (comme la capture) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80)",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Center Card */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl bg-[#1b2a44] border border-white/10 shadow-2xl px-10 py-10 text-white">
          {/* Close X (optionnel) */}
          <button
            onClick={() => navigate("/")}
            className="absolute right-6 top-6 text-white/60 hover:text-white"
            aria-label="close"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-600 grid place-items-center">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Réinitialisation
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-center text-white/65">
            Recevez un lien de réinitialisation par email
          </p>

          {/* Input */}
          <div className="mt-8">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Button */}
            <button
              type="button"
              className="mt-5 w-full h-12 rounded-xl bg-yellow-400 text-slate-900 font-extrabold flex items-center justify-center gap-2 hover:bg-yellow-500 transition shadow-lg"
            >
              Envoyer le lien <ArrowRight className="h-5 w-5" />
            </button>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-white/40">ou</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* Back link */}
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 text-yellow-400 font-semibold hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}