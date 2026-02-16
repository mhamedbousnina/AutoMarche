import React, { useMemo, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { Car } from "lucide-react";

const TUNISIA_GOVS = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Béja",
    "Jendouba",
    "Le Kef",
    "Siliana",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Sfax",
    "Gafsa",
    "Tozeur",
    "Kébili",
    "Gabès",
    "Médenine",
    "Tataouine",
];

// Liste “large” des marques (tu peux en ajouter/supprimer)
const CAR_BRANDS = [
    "Abarth",
    "Acura",
    "Aixam",
    "Alfa Romeo",
    "Aston Martin",
    "Audi",
    "Bentley",
    "BMW",
    "Bugatti",
    "Buick",
    "BYD",
    "Cadillac",
    "Changan",
    "Chery",
    "Chevrolet",
    "Chrysler",
    "Citroën",
    "Cupra",
    "Dacia",
    "Daewoo",
    "Daihatsu",
    "Dodge",
    "DS",
    "Ferrari",
    "Fiat",
    "Ford",
    "Foton",
    "Geely",
    "Genesis",
    "GMC",
    "Great Wall",
    "Haval",
    "Honda",
    "Hummer",
    "Hyundai",
    "Infiniti",
    "Isuzu",
    "Iveco",
    "Jaguar",
    "Jeep",
    "Kia",
    "Koenigsegg",
    "Lamborghini",
    "Lancia",
    "Land Rover",
    "Lexus",
    "Lincoln",
    "Lotus",
    "Maserati",
    "Maybach",
    "Mazda",
    "McLaren",
    "Mercedes-Benz",
    "MG",
    "Mini",
    "Mitsubishi",
    "Nissan",
    "Opel",
    "Peugeot",
    "Porsche",
    "Proton",
    "Renault",
    "Rolls-Royce",
    "Seat",
    "Skoda",
    "Smart",
    "SsangYong",
    "Subaru",
    "Suzuki",
    "Tesla",
    "Toyota",
    "Volkswagen",
    "Volvo",
    "Zotye",
];

const BODY_TYPES = [
    "Citadine",
    "Berline",
    "SUV / 4x4",
    "Coupé",
    "Cabriolet",
    "Break",
    "Monospace",
    "Utilitaire",
    "Pick-up",
    "Van",
    "Sport",
    "Luxe",
    "Électrique",
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

    const [form, setForm] = useState({
        title: "",
        state: "Occasion",
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

    function onSubmit(e) {
        e.preventDefault();

        // Ici tu brancheras ton backend: POST /api/listings (par exemple)
        // En attendant: juste console.log
        console.log("Listing form:", form);
        console.log("Photos:", photos.map((p) => p.file));

        alert("Annonce prête à être envoyée ✅ (branche le backend ensuite)");
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header section title (comme sur capture) */}
            <div className="bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 py-7">
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

            <form onSubmit={onSubmit} className="max-w-6xl mx-auto px-4 py-8 space-y-6">
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

                            <label className={`h-10 px-4 rounded-xl font-semibold flex items-center gap-2 cursor-pointer
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
                                            <img
                                                src={p.url}
                                                alt={`photo-${idx}`}
                                                className="h-24 w-full object-cover"
                                            />
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
                            {/* Titre + Etat */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700">
                                    Titre de l’annonce *
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                    placeholder="Ex: Peugeot 208 Active 2020"
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700">État *</label>
                                <div className="mt-1 h-11 rounded-xl bg-slate-100 border border-slate-200 px-3 flex items-center gap-4">
                                    {STATE.map((s) => (
                                        <label key={s} className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="radio"
                                                name="state"
                                                checked={form.state === s}
                                                onChange={() => updateField("state", s)}
                                            />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Marque / Modèle */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Marque *</label>
                                <select
                                    value={form.brand}
                                    onChange={(e) => updateField("brand", e.target.value)}
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    <option value="">Sélectionner</option>
                                    {brandOptions.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700">Modèle *</label>
                                <input
                                    value={form.model}
                                    onChange={(e) => updateField("model", e.target.value)}
                                    placeholder="Ex: 208, Golf, Clio..."
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Année / Kilométrage */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Année *</label>
                                <input
                                    value={form.year}
                                    onChange={(e) => updateField("year", e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                                    placeholder="2020"
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700">Kilométrage (km) *</label>
                                <input
                                    value={form.mileage}
                                    onChange={(e) => updateField("mileage", e.target.value.replace(/[^\d]/g, ""))}
                                    placeholder="Ex: 85000"
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Carburant / Boîte */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Carburant *</label>
                                <select
                                    value={form.fuel}
                                    onChange={(e) => updateField("fuel", e.target.value)}
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    <option value="">Carburant</option>
                                    {FUELS.map((f) => (
                                        <option key={f} value={f}>
                                            {f}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700">Boîte de vitesses *</label>
                                <select
                                    value={form.gearbox}
                                    onChange={(e) => updateField("gearbox", e.target.value)}
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    <option value="">Boîte</option>
                                    {GEARBOX.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Couleur / Carrosserie */}
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
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Puissance / Portes */}
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
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description full width */}
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    placeholder="Décrivez votre véhicule : équipements, options, état général, historique d'entretien..."
                                    className="mt-1 w-full min-h-[110px] rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
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
                                    onChange={(e) => updateField("price", e.target.value.replace(/[^\d]/g, ""))}
                                    placeholder="Ex: 35000"
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
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
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    placeholder="Votre nom"
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700">Téléphone *</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    placeholder="Ex: 98 765 432"
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700">Gouvernorat *</label>
                                <select
                                    value={form.gov}
                                    onChange={(e) => updateField("gov", e.target.value)}
                                    className="mt-1 w-full h-11 rounded-xl bg-slate-100 border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    <option value="">Gouvernorat</option>
                                    {govOptions.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
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
    );
}