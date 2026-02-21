import React, { useEffect, useMemo, useState } from "react";
import { User,ImagePlus,Trash2} from "lucide-react";
import { getMe, updateMe, changePassword, uploadAvatar, deleteAvatar } from "../apis/user";

export default function MyProfileContent() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ toast
  const [toast, setToast] = useState(null);
  // toast = { type: "success" | "error", text: string }

  // ✅ Avatar
  const [avatarPreview, setAvatarPreview] = useState(""); // URL blob OU URL serveur

  function showToast(type, text) {
    setToast({ type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3000);
  }

  // ✅ Cleanup blob
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // ✅ Load profile
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const res = await getMe();
        const user = res?.user ?? res;

        if (!user || (!user.email && !user.fullName && !user.phone)) {
          showToast("error", "Profil introuvable (token invalide / non autorisé)");
          return;
        }

        if (!mounted) return;

        setForm((prev) => ({
          ...prev,
          fullName: user.fullName ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          avatarUrl: user.avatarUrl ?? "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        // ✅ IMPORTANT : afficher l'avatar DB au refresh
        setAvatarPreview(user.avatarUrl ?? "");
      } catch (e) {
        showToast("error", e.message || "Erreur serveur");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(e) {
    setToast(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const initials = useMemo(() => {
    return (
      form.fullName
        ?.split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    );
  }, [form.fullName]);

 async function onPickAvatar(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) return showToast("error", "Image uniquement");
  if (file.size > 2 * 1024 * 1024) return showToast("error", "Max 2MB");

  // ✅ Preview instantané
  if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
  const localUrl = URL.createObjectURL(file);
  setAvatarPreview(localUrl);

  try {
    const res = await uploadAvatar(file);
    const updatedUser = res?.user;
    

    if (updatedUser?.avatarUrl) {
      // ✅ mettre à jour form + preview avec URL serveur
      setForm((prev) => ({ ...prev, avatarUrl: updatedUser.avatarUrl }));
      setAvatarPreview(updatedUser.avatarUrl);

      // ✅ IMPORTANT : sync navbar (localStorage + event)
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
    }

    showToast("success", "Photo mise à jour ");
  } catch (err) {
    showToast("error", err.message || "Upload échoué");
    // ✅ rollback preview => reprendre avatarUrl DB
    setAvatarPreview(form.avatarUrl || "");
  } finally {
    e.target.value = "";
  }
}

async function removeAvatar() {
  try {
    const res = await deleteAvatar();
    const updatedUser = res?.user ?? res;

    setAvatarPreview("");
    setForm((prev) => ({ ...prev, avatarUrl: "" }));

    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("userUpdated"));

    showToast("success", "Photo supprimée");
  } catch (err) {
    showToast("error", err.message || "Suppression échouée");
  }
}

  async function handleSubmit(e) {
    e.preventDefault();
    setToast(null);

    try {
      await updateMe({
        fullName: form.fullName,
        phone: form.phone,
      });

      const wantsPasswordChange =
        form.currentPassword || form.newPassword || form.confirmPassword;

      if (wantsPasswordChange) {
        if (!form.currentPassword) return showToast("error", "Mot de passe actuel requis");
        if (!form.newPassword) return showToast("error", "Nouveau mot de passe requis");
        if (!form.confirmPassword) return showToast("error", "Confirmation requise");
        if (form.newPassword !== form.confirmPassword)
          return showToast("error", "Les mots de passe ne correspondent pas");
        if (form.newPassword.length < 8)
          return showToast("error", "Le mot de passe doit contenir au moins 8 caractères");

        await changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        });

        setForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        showToast("success", "Mot de passe mis à jour ");
      } else {
        showToast("success", "Profil mis à jour ");
      }
    } catch (e2) {
      showToast("error", e2.message || "Erreur serveur");
    }
  }

  return (
    <div className="flex-1 p-10">
      {/* ✅ Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-9999 w-85">
          <div
            className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur
            animate-[toastIn_.25s_ease-out]
            ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="font-semibold">
                  {toast.type === "success" ? "Succès" : "Erreur"}
                </div>
                <div className="text-sm opacity-90">{toast.text}</div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-slate-500 hover:text-slate-900"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 h-1 w-full overflow-hidden rounded bg-black/10">
              <div
                className={`h-full animate-[toastBar_3s_linear]
                ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full bg-slate-900 rounded-lg">
        <div className="px-8 py-7 flex items-center gap-4 text-white">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
            <User className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-3xl font-extrabold">Mes Informations</h1>
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 max-w-4xl">
        {/* Avatar header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-blue-600 text-white grid place-items-center text-xl font-bold">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div>
            <div className="font-semibold text-slate-900">{form.fullName || "—"}</div>
            

            <div className="flex items-center gap-2 mt-2">
  {/* ✅ Bouton Supprimer (même style que "Tout supprimer") */}
  {(avatarPreview || form.avatarUrl) && (
    <button
      type="button"
      onClick={removeAvatar}
      className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Supprimer
    </button>
  )}

  {/* ✅ Bouton Ajouter (même style que photos) */}
  <label className="h-10 px-4 rounded-xl font-semibold flex items-center gap-2 cursor-pointer bg-slate-900 text-white hover:bg-slate-800">
    <ImagePlus className="h-4 w-4" />
    Ajouter
    <input
      id="avatar-input"
      type="file"
      accept="image/*"
      onChange={onPickAvatar}
      className="hidden"
    />
  </label>
</div>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-600">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email (non modifiable)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

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

            <div className="border-t border-slate-200 pt-6">
              <h2 className="font-semibold text-slate-800 mb-4">Changer le mot de passe</h2>

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
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ✅ animations Tailwind custom (mets ça dans index.css) */}
      {/* 
      @keyframes toastIn { from { transform: translateY(-8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      @keyframes toastBar { from { width: 100% } to { width: 0% } }
      */}
    </div>
  );
}