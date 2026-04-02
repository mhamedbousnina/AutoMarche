import React, { useEffect, useState } from "react";
import {
    X,
    Car,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    User,
    Phone,
    CheckCircle2,
} from "lucide-react";
import { getMe } from "../apis/user";

export default function AuthModal({ open, onClose, mode, setMode, onAuthSuccess }) {
    const [showPwd, setShowPwd] = useState(false);

    // Champs
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ✅ animation success
    const [showSuccessAnim, setShowSuccessAnim] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => e.key === "Escape" && handleClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // ✅ quand la modale s'ouvre -> toujours login
    useEffect(() => {
        if (!open) return;
        setMode?.("login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function resetLocalState() {
        setShowPwd(false);
        setFullName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setLoading(false);
        setError("");
        setSuccess("");
        setShowSuccessAnim(false);
    }

    function handleClose() {
        resetLocalState();
        onClose?.();
    }

    if (!open) return null;

    const isLogin = mode === "login";
    const isRegister = mode === "register";
    const isReset = mode === "reset";

    async function callApi(path, body) {
        const res = await fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            console.error("AUTH API ERROR:", res.status, path, data);
            throw new Error(data?.message || "Erreur serveur");
        }

        return data;
    }

    async function handleSubmit() {
    setError("");
    setSuccess("");

    // 1. Vérification des champs vides
    const isFieldsEmpty =
        (isRegister && (!fullName || !phone || !email || !password || !confirmPassword)) ||
        (isLogin && (!email || !password)) ||
        (isReset && !email);

    if (isFieldsEmpty) {
        // ✅ On n'affiche l'erreur QUE si on n'est PAS en login
        if (!isLogin) {
            setError("Veuillez remplir tous les champs obligatoires (*).");
        }
        return; 
    }

    // 2. Validation stricte UNIQUEMENT pour l'inscription (Register)
    if (isRegister) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/;
        
        if (!passwordRegex.test(password)) {
            setError("Le mot de passe doit contenir entre 8 et 12 caractères, une majuscule, un chiffre et un caractère spécial.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
    }

    setLoading(true);
    try {
        if (isRegister) {
            // Logique Register (Appel API classique)
            await callApi("/api/auth/register", {
                fullName,
                phone,
                email,
                password,
                confirmPassword,
            });

            setSuccess("Compte créé ✅");
            setShowSuccessAnim(true);

            setTimeout(() => {
                setShowSuccessAnim(false);
                setMode?.("login");
                setPassword("");
                setConfirmPassword("");
                setSuccess("");
            }, 1200);

        } else if (isLogin) {
            // Logique Login avec message d'erreur simplifié
            try {
                const data = await callApi("/api/auth/login", { email, password });

                if (data?.token) localStorage.setItem("token", data.token);

                const meRes = await getMe();
                const meUser = meRes.user;

                localStorage.setItem("user", JSON.stringify(meUser));
                window.dispatchEvent(new Event("userUpdated"));
                onAuthSuccess?.(meUser);

                setTimeout(() => handleClose(), 300);

            } catch (err) {
                // ✅ On ignore le message serveur détaillé pour afficher un message simple
                throw new Error("Email ou mot de passe incorrect.");
            }

        } else if (isReset) {
            const data = await callApi("/api/auth/forgot-password", { email });
            setSuccess(data?.message || "Lien envoyé ✅");
        }
    } catch (e) {
        // Affiche soit l'erreur "Email ou mot de passe incorrect" (Login),
        // soit les erreurs de l'API/Validation (Register)
        setError(e.message);
    } finally {
        setLoading(false);
    }
}

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

            {/* Modal */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="relative w-full max-w-lg rounded-2xl bg-[#1b2a44] text-white shadow-2xl border border-white/10">
                    {/* Close */}
                    <button
                        onClick={handleClose}
                        className="absolute right-5 top-5 text-white/70 hover:text-white"
                        aria-label="close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="px-10 py-10">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-2xl bg-blue-600 grid place-items-center">
                                <Car className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        {/* Titles */}
                        {isRegister ? (
                            <>
                                <h2 className="mt-6 text-center text-3xl font-extrabold">
                                    Rejoignez-nous
                                </h2>
                                <p className="mt-2 text-center text-white/65">
                                    Créez votre compte en quelques secondes
                                </p>
                            </>
                        ) : isReset ? (
                            <>
                                <h2 className="mt-6 text-center text-3xl font-extrabold">
                                    Réinitialisation
                                </h2>
                                <p className="mt-2 text-center text-white/65">
                                    Recevez un lien de réinitialisation par email
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="mt-6 text-center text-3xl font-extrabold">
                                    Bon retour !
                                </h2>
                                <p className="mt-2 text-center text-white/65">
                                    Connectez-vous à votre espace AutoMarché
                                </p>
                            </>
                        )}

                        {/* Form */}
                        <form
                            className="mt-8 space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            {/* REGISTER fields */}
                            {isRegister && (
                                <>


                                    {/* Nom & Prenom */}
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />
                                        <span className="absolute left-10 top-2 text-red-500 text-xs">*</span>
                                        <input
                                            type="text"
                                            placeholder="Nom & prénom *"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>

                                    {/* Téléphone */}
                                    <div className="relative">
                                        {/* Icône de téléphone */}
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />

                                        {/* Astérisque rouge obligatoire */}
                                        <span className="absolute left-10 top-2 text-red-500 text-xs">*</span>

                                        <input
                                            type="text"
                                            inputMode="numeric" // Force le clavier numérique sur mobile
                                            placeholder="Téléphone *"
                                            value={phone}
                                            onChange={(e) => {
                                                // ✅ CORRECTION : Supprime tout ce qui n'est PAS un chiffre (0-9)
                                                const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                                                setPhone(value);
                                            }}
                                            className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />
                                {/* Affiche l'étoile seulement en mode inscription */}
                                {isRegister && <span className="absolute left-10 top-2 text-red-500 text-xs">*</span>}
                                <input
                                    type="email"
                                    placeholder={isRegister ? "votre@email.com *" : "votre@email.com"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Password */}
                            {!isReset && (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />
                                    {isRegister && <span className="absolute left-10 top-2 text-red-500 text-xs">*</span>}
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        placeholder={isRegister ? "Mot de passe *" : "Mot de passe"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-12 outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                     <button
                                        type="button"
                                        onClick={() => setShowPwd((s) => !s)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 hover:text-white"
                                    >
                                        {showPwd ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Confirm password */}
                            {isRegister && (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/35" />
                                    <span className="absolute left-10 top-2 text-red-500 text-xs">*</span>
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        placeholder="Confirmer le mot de passe *"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-12 rounded-xl bg-white/10 border border-white/10 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>
                            )}

                            {/* Forgot password */}
                            {isLogin && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setMode("reset")}
                                        className="text-sm text-yellow-400 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            )}

                            {/* ✅ success animation (compte créé) */}
                            {showSuccessAnim && (
                                <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-400 animate-bounce" />
                                    <span className="text-green-300 font-semibold animate-pulse">
                                        Compte créé avec succès
                                    </span>
                                </div>
                            )}

                            {/* Messages */}
                            {error && <p className="text-sm text-red-400">{error}</p>}
                            {success && !showSuccessAnim && (
                                <p className="text-sm text-green-400">{success}</p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-yellow-400 text-slate-900 font-extrabold flex items-center justify-center gap-2 hover:bg-yellow-500 transition disabled:opacity-60"
                            >
                                {loading
                                    ? "Chargement..."
                                    : isReset
                                        ? "Envoyer le lien"
                                        : isRegister
                                            ? "Créer mon compte"
                                            : "Se connecter"}
                                <ArrowRight className="h-5 w-5" />
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="h-px bg-white/10 flex-1" />
                                <span className="text-xs text-white/40">ou</span>
                                <div className="h-px bg-white/10 flex-1" />
                            </div>

                            {/* Footer switch */}
                            {isReset ? (
                                <p className="text-center text-sm text-white/60">
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className="text-yellow-400 font-semibold hover:underline"
                                    >
                                        ← Retour à la connexion
                                    </button>
                                </p>
                            ) : isRegister ? (
                                <p className="text-center text-sm text-white/60">
                                    Déjà un compte ?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className="text-yellow-400 font-semibold hover:underline"
                                    >
                                        Se connecter
                                    </button>
                                </p>
                            ) : (
                                <p className="text-center text-sm text-white/60">
                                    Pas encore de compte ?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("register")}
                                        className="text-yellow-400 font-semibold hover:underline"
                                    >
                                        Créer un compte
                                    </button>
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}