import React, { useMemo, useState } from "react";
import {
    ImagePlus,
    Trash2,
    Car,
    CheckCircle2,
    BadgePercent,
    PhoneCall,
    Camera,
} from "lucide-react";

const TUNISIA_GOVS = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana",
    "Sousse", "Monastir", "Mahdia", "Kairouan", "Kasserine", "Sidi Bouzid", "Sfax", "Gafsa", "Tozeur", "Kébili", "Gabès", "Médenine", "Tataouine",
];

const CAR_BRANDS = [
    "Abarth", "Acura", "Aixam", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Buick", "BYD", "Cadillac",
    "Changan", "Chery", "Chevrolet", "Chrysler", "Citroën", "Cupra", "Dacia", "Daewoo", "Daihatsu", "Dodge", "DS", "Ferrari",
    "Fiat", "Ford", "Foton", "Geely", "Genesis", "GMC", "Great Wall", "Haval", "Honda", "Hummer", "Hyundai", "Infiniti", "Isuzu",
    "Iveco", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati",
    "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche", "Proton",
    "Renault", "Rolls-Royce", "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Zotye",
];

const BODY_TYPES = [
    "Citadine", "Berline", "SUV / 4x4", "Coupé", "Cabriolet", "Break", "Monospace", "Utilitaire", "Pick-up", "Van", "Sport", "Luxe", "Électrique",
];

const FUELS = ["Essence", "Diesel", "GPL", "Hybride", "Électrique"];
const GEARBOX = ["Manuelle", "Automatique", "Séquentielle"];
const DOORS = ["2", "3", "4", "5"];
const STATE = ["Occasion", "Neuf"];


function clampFiles(files, max) {
    const arr = Array.from(files || []);
    return arr.slice(0, max);
}

export default function ListingPage() {
    const [photos, setPhotos] = useState([]); // {file, url}
    const maxPhotos = 10;
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        title: "",
        state: "",
        brand: "",
        model: "",
        year: "",
        mileage: "",
        fuel: "",
        gearbox: "",
        color: "",
        body: "",
        power: "",
        doors: "",
        description: "",
        price: "",
        negotiable: true,
        fullName: "",
        phone: "",
        gov: "",
        city: "",
    });

    const canAddMore = photos.length < maxPhotos;

    const brandOptions = useMemo(
        () => [...CAR_BRANDS].sort((a, b) => a.localeCompare(b, "fr")),
        []
    );

    const govOptions = useMemo(
        () => [...TUNISIA_GOVS].sort((a, b) => a.localeCompare(b, "fr")),
        []
    );

    function updateField(key, value) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    function onAddPhotos(e) {
        const files = clampFiles(e.target.files, maxPhotos - photos.length);
        const mapped = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPhotos((p) => [...p, ...mapped]);
        e.target.value = "";
    }

    function removePhoto(idx) {
        setPhotos((p) => {
            const copy = [...p];
            const removed = copy.splice(idx, 1)[0];
            if (removed?.url) URL.revokeObjectURL(removed.url);
            return copy;
        });
    }

    function clearAllPhotos() {
        photos.forEach((p) => p?.url && URL.revokeObjectURL(p.url));
        setPhotos([]);
    }

    function setField(key, value) {
        // met à jour le form
        setForm((p) => ({ ...p, [key]: value }));

        // ✅ si l'utilisateur a rempli, on enlève l'erreur
        if (String(value).trim() !== "") {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[key];
                return copy;
            });
        }
    }

    function fieldClass(key) {
        return `mt-1 w-full h-11 rounded-xl px-4 outline-none focus:ring-2 transition
    ${errors[key]
                ? "bg-slate-100 border-2 border-red-500 focus:ring-red-200"
                : "bg-slate-100 border border-slate-200 focus:ring-yellow-400"}
  `;
    }

    function validateForm() {
        const newErrors = {};

        if (!form.title.trim()) newErrors.title = "Champ obligatoire";
        if (!form.state) newErrors.state = "Champ obligatoire";
        if (!form.brand) newErrors.brand = "Champ obligatoire";
        if (!form.model.trim()) newErrors.model = "Champ obligatoire";
        if (!form.year) newErrors.year = "Champ obligatoire";
        if (!form.mileage) newErrors.mileage = "Champ obligatoire";
        if (!form.fuel) newErrors.fuel = "Champ obligatoire";
        if (!form.gearbox) newErrors.gearbox = "Champ obligatoire";
        if (!form.price) newErrors.price = "Champ obligatoire";
        if (!form.fullName.trim()) newErrors.fullName = "Champ obligatoire";
        if (!form.phone.trim()) newErrors.phone = "Champ obligatoire";
        if (!form.gov) newErrors.gov = "Champ obligatoire";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

  async function onSubmit(e) {
  e.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté");
    return;
  }

        const fd = new FormData();

        fd.append("title", form.title);
        fd.append("state", form.state);
        fd.append("brand", form.brand);
        fd.append("model", form.model);
        fd.append("year", form.year);
        fd.append("mileage", form.mileage);
        fd.append("fuel", form.fuel);
        fd.append("gearbox", form.gearbox);
        fd.append("color", form.color);
        fd.append("body", form.body);
        fd.append("power", form.power);
        fd.append("doors", form.doors);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("negotiable", String(form.negotiable));

        // ✅ IMPORTANT : mêmes noms que backend
        fd.append("contactFullName", form.fullName);
        fd.append("contactPhone", form.phone);
        fd.append("gov", form.gov);
        fd.append("city", form.city);

        photos.forEach((p) => fd.append("photos", p.file));

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const res = await fetch(`${API_URL}/listings`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: fd,
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data?.message || "Erreur lors de la publication");
            return;
        }

        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setShowSuccess(false), 4000);
    }

    return (

        <div className="bg-slate-50 min-h-screen w-full">
            {showSuccess && (
                <div className="w-full flex justify-center mt-6">
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-8 py-5 rounded-2xl shadow-xl flex items-center gap-4 animate-fadeIn">

                        {/* Cercle avec check animé */}
                        <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center animate-pop">
                            <svg
                                className="h-7 w-7 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                    className="animate-draw"
                                />
                            </svg>
                        </div>

                        {/* Texte */}
                        <div>
                            <p className="text-lg font-bold">
                                Annonce publiée avec succès
                            </p>
                            <p className="text-sm text-emerald-700">
                                Votre annonce est maintenant en ligne.
                            </p>
                        </div>

                    </div>
                </div>
            )}
            {/* Header (comme l'image) */}

            <div className="bg-slate-900">
                <div className="w-full px-8 py-7">
                    <div className="flex items-center gap-3 text-white">
                        <div className="h-10 w-10 rounded-xl bg-yellow-400 grid place-items-center">
                            <Car className="h-5 w-5 text-slate-900" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold">Publier une annonce</h1>
                            <p className="text-sm text-white/70">
                                Remplissez les informations de votre véhicule pour publier votre annonce
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plein écran : formulaire gauche / conseils droite */}
            <div className="w-full px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* ✅ LEFT: Formulaire (large) */}
                    <div className="lg:col-span-8">
                        <form onSubmit={onSubmit} className="space-y-6">
                            {/* Photos */}
                            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="px-6 py-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-extrabold text-slate-900">Photos du véhicule</h2>
                                        <p className="text-sm text-slate-500">(max 10 photos)</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {photos.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearAllPhotos}
                                                className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Tout supprimer
                                            </button>
                                        )}

                                        <label
                                            className={`h-10 px-4 rounded-xl font-semibold flex items-center gap-2 cursor-pointer
                        ${canAddMore ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                            Ajouter
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                disabled={!canAddMore}
                                                onChange={onAddPhotos}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="px-6 pb-6">
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50">
                                        {photos.length === 0 ? (
                                            <div className="flex items-center justify-center py-10 text-slate-500">
                                                <div className="text-center">
                                                    <div className="mx-auto h-12 w-12 rounded-2xl bg-white border border-slate-200 grid place-items-center">
                                                        <ImagePlus className="h-6 w-6" />
                                                    </div>
                                                    <p className="mt-3 font-semibold">Ajoutez des photos</p>
                                                    <p className="text-sm text-slate-500">
                                                        JPG/PNG — jusqu’à {maxPhotos} photos
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                {photos.map((p, idx) => (
                                                    <div
                                                        key={p.url}
                                                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-white"
                                                    >
                                                        <img src={p.url} alt={`photo-${idx}`} className="h-24 w-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(idx)}
                                                            className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-black/60 text-white grid place-items-center hover:bg-black/75"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Informations du véhicule */}
                            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="px-6 py-5">
                                    <h2 className="font-extrabold text-slate-900">Informations du véhicule</h2>
                                </div>

                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Titre de l’annonce *</label>
                                            <input
                                                value={form.title}
                                                onChange={(e) => setField("title", e.target.value)}
                                                placeholder="Ex: Peugeot 208 Active 2020"
                                                className={fieldClass("title")}
                                            />
                                            {errors.title && (
                                                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">État *</label>

                                            <div
                                                className={`mt-1 h-11 rounded-xl px-3 flex items-center gap-6 transition
                                            ${errors.state ? "border-2 border-red-500" : "border border-slate-200"}
                                            bg-slate-100
                                            `}
                                            >
                                                {STATE.map((s) => (
                                                    <label key={s} className="flex items-center gap-2 text-sm text-slate-700">
                                                        <input
                                                            type="radio"
                                                            name="state"
                                                            value={s}
                                                            checked={form.state === s}
                                                            onChange={(e) => {
                                                                setField("state", e.target.value); // ✅ enlève l'erreur automatiquement
                                                            }}
                                                        />
                                                        {s}
                                                    </label>
                                                ))}
                                            </div>

                                            {errors.state && (
                                                <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Marque *</label>
                                            <select
                                                value={form.brand}
                                                onChange={(e) => {
                                                    updateField("brand", e.target.value);

                                                    // ✅ enlever l'erreur dès que l'utilisateur choisit
                                                    if (e.target.value) {
                                                        setErrors((prev) => {
                                                            const copy = { ...prev };
                                                            delete copy.brand;
                                                            return copy;
                                                        });
                                                    }
                                                }}
                                                className={`mt-1 w-full h-11 rounded-xl px-4 outline-none focus:ring-2 transition
                                                        ${errors.brand
                                                        ? "border-2 border-red-500 focus:ring-red-200 bg-slate-100"
                                                        : "border border-slate-200 bg-slate-100 focus:ring-yellow-400"}
                                                `}
                                            >
                                                <option value="">Sélectionner</option>
                                                {brandOptions.map((b) => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>

                                            {errors.brand && (
                                                <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Modèle *</label>
                                            <input
                                                value={form.model}
                                                onChange={(e) => {
                                                    updateField("model", e.target.value);

                                                    // ✅ Supprimer l'erreur automatiquement si rempli
                                                    if (e.target.value.trim() !== "") {
                                                        setErrors((prev) => {
                                                            const copy = { ...prev };
                                                            delete copy.model;
                                                            return copy;
                                                        });
                                                    }
                                                }}
                                                placeholder="Ex: 208, Golf, Clio..."
                                                className={`mt-1 w-full h-11 rounded-xl px-4 outline-none transition focus:ring-2
    ${errors.model
                                                        ? "border-2 border-red-500 focus:ring-red-200 bg-slate-100"
                                                        : "border border-slate-200 bg-slate-100 focus:ring-yellow-400"}
  `}
                                            />

                                            {errors.model && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.model}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Année *</label>
                                            <input
                                                value={form.year}
                                                onChange={(e) =>
                                                    setField("year", e.target.value.replace(/[^\d]/g, "").slice(0, 4))
                                                }
                                                placeholder="2020"
                                                className={`mt-1 w-full h-11 rounded-xl px-4 outline-none focus:ring-2 transition
                                                ${errors.year
                                                        ? "border-2 border-red-500 focus:ring-red-200 bg-slate-100"
                                                        : "border border-slate-200 bg-slate-100 focus:ring-yellow-400"
                                                    }
    `}
                                            />

                                            {errors.year && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.year}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Kilométrage (km) *</label>
                                            <input
                                                value={form.mileage}
                                                onChange={(e) => setField("mileage", e.target.value.replace(/[^\d]/g, ""))}
                                                placeholder="Ex: 85000"
                                                className={fieldClass("mileage")}
                                            />
                                            {errors.mileage && (
                                                <p className="text-red-600 text-sm mt-1">{errors.mileage}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Carburant *</label>
                                            <select
                                                value={form.fuel}
                                                onChange={(e) => setField("fuel", e.target.value)}
                                                className={fieldClass("fuel")}
                                            >
                                                <option value="">Carburant</option>
                                                {FUELS.map((f) => (
                                                    <option key={f} value={f}>{f}</option>
                                                ))}
                                            </select>
                                            {errors.fuel && (
                                                <p className="text-red-600 text-sm mt-1">{errors.fuel}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Boîte de vitesses *</label>
                                            <select
                                                value={form.gearbox}
                                                onChange={(e) => setField("gearbox", e.target.value)}
                                                className={fieldClass("gearbox")}
                                            >
                                                <option value="">Boîte</option>
                                                {GEARBOX.map((g) => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                            {errors.gearbox && (
                                                <p className="text-red-600 text-sm mt-1">{errors.gearbox}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Couleur</label>
                                            <input
                                                value={form.color}
                                                onChange={(e) => updateField("color", e.target.value)}
                                                placeholder="Ex: Blanc, Noir, Gris..."
                                                className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Carrosserie</label>
                                            <select
                                                value={form.body}
                                                onChange={(e) => updateField("body", e.target.value)}
                                                className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                            >
                                                <option value="">Type</option>
                                                {BODY_TYPES.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Puissance fiscale (CV)</label>
                                            <input
                                                value={form.power}
                                                onChange={(e) => updateField("power", e.target.value.replace(/[^\d]/g, ""))}
                                                placeholder="Ex: 6"
                                                className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Nombre de portes</label>
                                            <select
                                                value={form.doors}
                                                onChange={(e) => updateField("doors", e.target.value)}
                                                className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                            >
                                                <option value="">Portes</option>
                                                {DOORS.map((d) => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-sm font-semibold text-slate-700">Description</label>
                                            <textarea
                                                value={form.description}
                                                onChange={(e) => updateField("description", e.target.value)}
                                                placeholder="Décrivez votre véhicule : équipements, options, état général, historique d'entretien..."
                                                className="mt-1 w-full min-h-27.5 rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Prix */}
                            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="px-6 py-5">
                                    <h2 className="font-extrabold text-slate-900">Prix</h2>
                                </div>

                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Prix (TND) *</label>
                                            <input
                                                value={form.price}
                                                onChange={(e) => setField("price", e.target.value.replace(/[^\d]/g, ""))}
                                                placeholder="Ex: 35000"
                                                className={fieldClass("price")}
                                            />
                                            {errors.price && (
                                                <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Négociable ?</label>
                                            <div className="mt-1 h-11 rounded-xl bg-slate-100 border border-slate-200 px-3 flex items-center gap-6">
                                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                                    <input
                                                        type="radio"
                                                        name="neg"
                                                        checked={form.negotiable === true}
                                                        onChange={() => updateField("negotiable", true)}
                                                    />
                                                    Oui
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                                    <input
                                                        type="radio"
                                                        name="neg"
                                                        checked={form.negotiable === false}
                                                        onChange={() => updateField("negotiable", false)}
                                                    />
                                                    Non
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Coordonnées */}
                            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="px-6 py-5">
                                    <h2 className="font-extrabold text-slate-900">Coordonnées</h2>
                                </div>

                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Nom complet *</label>
                                            <input
                                                value={form.fullName}
                                                onChange={(e) => setField("fullName", e.target.value)}
                                                placeholder="Votre nom"
                                                className={fieldClass("fullName")}
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Téléphone *</label>
                                            <input
                                                value={form.phone}
                                                onChange={(e) => setField("phone", e.target.value)}
                                                placeholder="Ex: 98 765 432"
                                                className={fieldClass("phone")}
                                            />
                                            {errors.phone && (
                                                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Gouvernorat *</label>
                                            <select
                                                value={form.gov}
                                                onChange={(e) => setField("gov", e.target.value)}
                                                className={fieldClass("gov")}
                                            >
                                                <option value="">Gouvernorat</option>
                                                {govOptions.map((g) => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                            {errors.gov && (
                                                <p className="text-red-600 text-sm mt-1">{errors.gov}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Ville / Délégation</label>
                                            <input
                                                value={form.city}
                                                onChange={(e) => updateField("city", e.target.value)}
                                                placeholder="Ex: La Marsa, Sousse ville..."
                                                className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Footer actions (Aperçu supprimé) */}
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="submit"
                                    className="h-11 px-6 rounded-xl bg-yellow-400 text-slate-900 font-extrabold hover:bg-yellow-500"
                                >
                                    Publier l’annonce
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ✅ RIGHT: Conseils (écriture à droite) */}
                    <aside className="lg:col-span-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
                            <h3 className="text-slate-900 font-extrabold text-lg">
                                Conseils pour une annonce efficace
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Quelques astuces simples pour attirer plus d’acheteurs.
                            </p>

                            <div className="mt-5 space-y-4">
                                <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 grid place-items-center">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Présentez l’essentiel clairement</p>
                                        <p className="text-sm text-slate-600">
                                            Marque, modèle, année, kilométrage et état : une annonce claire inspire confiance.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-yellow-50 border border-yellow-100 grid place-items-center">
                                        <BadgePercent className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Proposez un prix cohérent</p>
                                        <p className="text-sm text-slate-600">
                                            Regardez les prix du marché et activez “Négociable” si vous acceptez discuter.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 grid place-items-center">
                                        <Camera className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Multipliez les bonnes photos</p>
                                        <p className="text-sm text-slate-600">
                                            Extérieur, intérieur, tableau de bord… des photos nettes augmentent les demandes.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 grid place-items-center">
                                        <PhoneCall className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Soyez facile à contacter</p>
                                        <p className="text-sm text-slate-600">
                                            Un nom complet + un numéro valide rassurent et accélèrent les échanges.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-xs text-slate-500">
                                Astuce : une description honnête (même les petits défauts) évite les pertes de temps.
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}