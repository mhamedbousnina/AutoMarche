import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    MapPin,
    Calendar,
    Fuel,
    Gauge,
    Settings2,
    Car,
    Phone,
    MessageCircle,
    Heart,
    Share2,
    Shield,
    ChevronLeft,
    ChevronRight,
    Eye,
    Clock,
    User,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    Expand,
    X,
    Tag,
} from "lucide-react";

/** ✅ Mock data مطابق لـ Listing Schema (frontend only) */
const mockListings = {
    "1": {
        _id: "1",
        userId: "user1",

        title: "Peugeot 208 Style",
        state: "Occasion",

        brand: "Peugeot",
        model: "208",
        year: 2023,
        mileage: 25000,

        fuel: "Essence",
        gearbox: "Automatique",

        color: "Gris Artense",
        body: "Citadine",
        power: 130,
        doors: 5,
        description:
            "Peugeot 208 Style en excellent état, premier propriétaire, jamais accidentée. Entretien régulier chez le concessionnaire. Voiture très bien équipée.",

        price: 45000,
        negotiable: true,

        contactFullName: "Mohamed Ben Ali",
        contactPhone: "+216 98 765 432",
        gov: "Tunis",
        city: "Tunis",

        photos: [
            "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&h=800&fit=crop",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=800&fit=crop",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=800&fit=crop",
        ],

        createdAt: "2026-02-17T10:30:00.000Z",
        updatedAt: "2026-02-17T11:10:00.000Z",
    },

    "2": {
        _id: "2",
        userId: "user2",

        title: "Volkswagen Golf 8",
        state: "Occasion",

        brand: "Volkswagen",
        model: "Golf 8",
        year: 2022,
        mileage: 40000,

        fuel: "Diesel",
        gearbox: "Manuelle",

        color: "Blanc Pur",
        body: "Berline compacte",
        power: 150,
        doors: 5,
        description:
            "Golf 8 TDI en parfait état mécanique et esthétique. Carnet d'entretien complet.",

        price: 72000,
        negotiable: false,

        contactFullName: "Karim Trabelsi",
        contactPhone: "+216 55 123 456",
        gov: "Sousse",
        city: "Sousse",

        photos: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=800&fit=crop",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop",
            "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&h=800&fit=crop",
        ],

        createdAt: "2026-02-16T09:10:00.000Z",
        updatedAt: "2026-02-16T10:00:00.000Z",
    },
};

const fallbackListing = mockListings["1"];

function formatDateTime(dateLike) {
    if (!dateLike) return "";
    const d = new Date(dateLike);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export default function AnnonceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const listing = mockListings[id || "1"] || fallbackListing;

    const [currentImage, setCurrentImage] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [liked, setLiked] = useState(false);

    const images = listing.photos?.length ? listing.photos : [];

    const nextImage = () => setCurrentImage((p) => (p + 1) % images.length);
    const prevImage = () => setCurrentImage((p) => (p - 1 + images.length) % images.length);
    const [showPhone, setShowPhone] = useState(false);
   

    const specs = [
        { icon: Tag, label: "État", value: listing.state },
        { icon: Car, label: "Marque", value: listing.brand },
        { icon: Car, label: "Modèle", value: listing.model },
        { icon: Calendar, label: "Année", value: listing.year },
        { icon: Gauge, label: "Kilométrage", value: `${listing.mileage.toLocaleString()} km` },
        { icon: Fuel, label: "Carburant", value: listing.fuel },
        { icon: Settings2, label: "Boîte", value: listing.gearbox },
        { icon: Eye, label: "Puissance", value: listing.power ? `${listing.power} ch` : "—" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* ✅ PAS NAVBAR ICI si Navbar global */}

            {/* Fullscreen gallery */}
            {fullscreen && images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center">
                    <button
                        onClick={() => setFullscreen(false)}
                        className="absolute top-6 right-6 text-white hover:text-slate-200"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-6 text-white hover:text-slate-200"
                            >
                                <ChevronLeft className="h-10 w-10" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-6 text-white hover:text-slate-200"
                            >
                                <ChevronRight className="h-10 w-10" />
                            </button>
                        </>
                    )}

                    <img
                        src={images[currentImage]}
                        alt={listing.title}
                        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
                    />

                    <div className="absolute bottom-8 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentImage(i)}
                                className={[
                                    "w-3 h-3 rounded-full transition-all",
                                    i === currentImage ? "bg-yellow-400 scale-125" : "bg-white/40",
                                ].join(" ")}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ✅ PLEIN ÉCRAN */}
            <div className="w-full px-10 py-6">
                <button
                    onClick={() => navigate("/dashboard", { state: { tab: "ads" } })}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors text-sm font-semibold"
                >
                    <ArrowLeft className="h-4 w-4" /> Retour aux annonces
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Image Gallery */}
                        <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-16/10 group">
                            {images.length > 0 ? (
                                <img
                                    src={images[currentImage]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full grid place-items-center text-slate-500">
                                    <Car className="h-10 w-10" />
                                </div>
                            )}

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-slate-900" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                    >
                                        <ChevronRight className="h-5 w-5 text-slate-900" />
                                    </button>
                                </>
                            )}

                            {images.length > 0 && (
                                <button
                                    onClick={() => setFullscreen(true)}
                                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                >
                                    <Expand className="h-5 w-5 text-slate-900" />
                                </button>
                            )}

                            {images.length > 0 && (
                                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900">
                                    {currentImage + 1}/{images.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImage(i)}
                                        className={[
                                            "shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                                            i === currentImage
                                                ? "border-blue-600 ring-2 ring-blue-600/20"
                                                : "border-slate-200 opacity-70 hover:opacity-100",
                                        ].join(" ")}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Specs */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h2 className="font-bold text-slate-900 text-lg mb-4">
                                Caractéristiques
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {specs.map((spec) => (
                                    <div key={spec.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                                            <spec.icon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">{spec.label}</p>
                                            <p className="font-bold text-sm text-slate-900">{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-200 my-5" />

                            {/* ✅ Champs listing restants */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Couleur :</span>
                                    <span className="text-sm font-semibold text-slate-900">{listing.color || "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Portes :</span>
                                    <span className="text-sm font-semibold text-slate-900">{listing.doors ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Carrosserie :</span>
                                    <span className="text-sm font-semibold text-slate-900">{listing.body || "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Gouvernorat :</span>
                                    <span className="text-sm font-semibold text-slate-900">{listing.gov}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h2 className="font-bold text-slate-900 text-lg mb-3">Description</h2>
                            <p className="text-slate-600 text-sm leading-relaxed">{listing.description || "—"}</p>
                        </div>

                        
                    </div>

                    {/* Right */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-4">
                            <div className="flex items-start justify-between mb-1">
                                <h1 className="text-xl font-extrabold text-slate-900">{listing.title}</h1>

                                <div className="flex gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setLiked(!liked)}
                                        className={[
                                            "w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center transition-colors",
                                            liked ? "bg-red-50 border-red-200" : "hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        <Heart className={liked ? "h-4 w-4 fill-red-500 text-red-500" : "h-4 w-4 text-slate-500"} />
                                    </button>

                                    <button
                                        type="button"
                                        className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                                    >
                                        <Share2 className="h-4 w-4 text-slate-500" />
                                    </button>
                                </div>
                            </div>

                            {/* ✅ Localisation + Date/Heure (timestamps) */}
                            <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs mb-4">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {listing.gov}{listing.city ? `, ${listing.city}` : ""}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDateTime(listing.createdAt)}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="bg-blue-600/5 rounded-xl p-4 mb-4">
                                <p className="text-3xl font-extrabold text-blue-600">
                                    {Number(listing.price).toLocaleString()} <span className="text-lg">DT</span>
                                </p>

                                {listing.negotiable && (
                                    <div className="mt-2 inline-flex rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1">
                                        Prix négociable
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-slate-200 my-4" />

                            {/* ✅ Seller Info from Listing model */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{listing.contactFullName}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Shield className="h-3 w-3 text-blue-600" /> Vendeur
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowPhone((prev) => !prev)}
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold gap-2 h-12 text-base flex items-center justify-center transition"
                                >
                                    <Phone className="h-5 w-5" />
                                    {showPhone ? "Masquer le numéro" : "Appeler le vendeur"}
                                </button>

                                <button
                                    type="button"
                                    className="w-full rounded-xl font-bold gap-2 h-12 text-base border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition"
                                >
                                    <MessageCircle className="h-5 w-5" /> Envoyer un message
                                </button>

                                {/* ✅ Numéro animé */}
                                <div
                                    className={[
                                        "overflow-hidden transition-all duration-500 ease-in-out",
                                        showPhone ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0",
                                    ].join(" ")}
                                >
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                                        <div className="text-xs text-slate-500">Numéro du vendeur</div>
                                        <div className="text-lg font-extrabold text-slate-900 tracking-wide">
                                            {listing.contactPhone}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                                <AlertTriangle className="h-4 w-4 text-yellow-700 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600">
                                    Ne payez jamais à l'avance. Vérifiez le véhicule avant tout achat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ PAS FOOTER ICI si Footer global */}
        </div>
    );
}