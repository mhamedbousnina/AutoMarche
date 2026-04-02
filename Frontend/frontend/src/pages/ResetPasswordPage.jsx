import React, { useState, useEffect } from "react";
import { Car, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../apis/auth";

export default function SetNewPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Extraction du token
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // 2. Vérification immédiate du token au chargement
  useEffect(() => {
    if (!token) {
      setStatus({
        type: "error",
        text: "Jeton de sécurité absent. Veuillez cliquer sur le lien envoyé par email."
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return; // Sécurité supplémentaire

    const { password, confirmPassword } = formData; 

  // Désormais, "password" est défini et tu peux l'utiliser dans ta Regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/;

  if (!passwordRegex.test(password)) { // Cette ligne ne plantera plus
    return setStatus({ 
      type: "error", 
      text: "Le mot de passe doit faire 8 à 12 caractères et inclure une majuscule, un chiffre et un caractère spécial." 
    });
  }

    if (formData.password !== formData.confirmPassword) {
      return setStatus({ type: "error", text: "Les mots de passe ne correspondent pas." });
    }

    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      await resetPassword({
        token: token,
        newPassword: formData.password // Match the backend key name
      });

      setStatus({ type: "success", text: "Mot de passe mis à jour ! ✅" });
      setTimeout(() => {
        navigate("/?showLogin=true"); // Le paramètre doit être EXACTEMENT le même
      }, 3000);
    } catch (err) {
      // 4. Extraction du message d'erreur réel du backend
      const errorMessage = err.response?.data?.message || "Le lien est invalide ou a expiré.";
      setStatus({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80)" }} />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl bg-[#1b2a44] border border-white/10 shadow-2xl px-10 py-10 text-white">

          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-600 grid place-items-center shadow-lg">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold">Nouveau mot de passe</h2>
          <p className="mt-2 text-center text-white/65">Rétablissez l'accès à votre compte AutoMarché</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* --- SECTION D'ANIMATION DE SUCCÈS --- */}
            {status.type === "success" ? (
              <div className="w-full flex justify-center py-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-fadeIn w-full">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center animate-pop">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-draw" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-base">{status.text}</p>
                    <p className="text-xs text-emerald-500/80 text-nowrap">Redirection vers la connexion...</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />
                  <input
                    required
                    type="password"
                    placeholder="Nouveau mot de passe"
                    disabled={!token || loading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-400 text-white disabled:opacity-50 transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />
                  <input
                    required
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    disabled={!token || loading}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-400 text-white disabled:opacity-50 transition-all"
                  />
                </div>

                {status.type === "error" && (
                  <div className="mt-4 flex items-center gap-2 text-sm p-3 rounded-lg bg-red-500/20 text-red-400 border border-red-500/20 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {status.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="mt-5 w-full h-12 rounded-xl bg-yellow-400 text-slate-900 font-extrabold flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Réinitialiser mon mot de passe"}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}