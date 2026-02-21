import Listing from "../models/listing.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const toBool = (v) => v === "true" || v === true;
const toNum = (v, def = null) => {
  if (v === undefined || v === null || v === "") return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

export const createListing = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const files = req.files || [];

  // ✅ IMPORTANT: enregistrer des URLs servies par express.static
  const photos = files.map((f) => `/uploads/${f.filename}`);

  const payload = {
    userId: req.user._id,

    title: (req.body.title || "").trim(),
    state: req.body.state,

    brand: req.body.brand,
    model: (req.body.model || "").trim(),
    year: toNum(req.body.year, 0),
    mileage: toNum(req.body.mileage, 0),

    fuel: req.body.fuel,
    gearbox: req.body.gearbox,

    color: req.body.color || "",
    body: req.body.body || "",
    power: toNum(req.body.power, null),
    doors: toNum(req.body.doors, null),
    description: req.body.description || "",

    price: toNum(req.body.price, 0),
    negotiable: toBool(req.body.negotiable),

    contactFullName: (req.body.contactFullName || "").trim(),
    contactPhone: (req.body.contactPhone || "").trim(),
    gov: req.body.gov,
    city: req.body.city || "",

    photos,
  };

  const required = [
    "title",
    "state",
    "brand",
    "model",
    "year",
    "mileage",
    "fuel",
    "gearbox",
    "price",
    "contactFullName",
    "contactPhone",
    "gov",
  ];

  for (const k of required) {
    if (payload[k] === undefined || payload[k] === null || String(payload[k]).trim() === "") {
      throw new AppError(`Champ obligatoire: ${k}`, 400);
    }
  }

  const listing = await Listing.create(payload);

  res.status(201).json({ success: true, listing });
});

// ✅ Mes annonces (user connecté)
export const getMyListings = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const listings = await Listing.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, listings });
});

// ✅ Détail annonce (public)
export const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new AppError("Annonce introuvable", 404);

  res.json({ success: true, listing });
});

// controllers/listing.controller.js
export const updateListing = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Annonce introuvable", 404);

  // ✅ فقط صاحب الإعلان
  if (listing.userId.toString() !== req.user._id.toString()) {
    throw new AppError("Non autorisé", 403);
  }

  // ✅ photos existantes envoyées par le frontend (JSON string)
  // ex: keptPhotos: ["/uploads/a.jpg", "/uploads/b.jpg"]
  let keptPhotos = [];
  if (req.body.keptPhotos) {
    try {
      keptPhotos = JSON.parse(req.body.keptPhotos);
      if (!Array.isArray(keptPhotos)) keptPhotos = [];
    } catch {
      keptPhotos = [];
    }
  }

  // ✅ Normaliser keptPhotos (au cas où tu reçois des URLs complètes)
  keptPhotos = keptPhotos
    .filter(Boolean)
    .map((p) => String(p).trim())
    .map((p) => {
      // si frontend envoie "http://localhost:5000/uploads/x.jpg"
      const idx = p.indexOf("/uploads/");
      if (idx !== -1) return p.slice(idx);
      return p.startsWith("/uploads/") ? p : p;
    })
    .filter((p) => p.startsWith("/uploads/"));

  // ✅ nouvelles photos uploadées
  const files = req.files || [];

  // 🔥 IMPORTANT: utiliser filename (PAS path)
  const newPhotos = files.map((f) => `/uploads/${f.filename}`);

  const photos = [...keptPhotos, ...newPhotos];

  // ✅ update fields (avec conversions sûres)
  const up = {
    title: (req.body.title || "").trim(),
    state: req.body.state,

    brand: req.body.brand,
    model: (req.body.model || "").trim(),

    year: req.body.year ? Number(req.body.year) : 0,
    mileage: req.body.mileage ? Number(req.body.mileage) : 0,

    fuel: req.body.fuel,
    gearbox: req.body.gearbox,

    color: req.body.color || "",
    body: req.body.body || "",
    power: req.body.power ? Number(req.body.power) : null,
    doors: req.body.doors ? Number(req.body.doors) : null,
    description: req.body.description || "",

    price: req.body.price ? Number(req.body.price) : 0,
    negotiable: req.body.negotiable === "true" || req.body.negotiable === true,

    contactFullName: (req.body.contactFullName || "").trim(),
    contactPhone: (req.body.contactPhone || "").trim(),
    gov: req.body.gov,
    city: req.body.city || "",

    photos,
  };

  const updated = await Listing.findByIdAndUpdate(req.params.id, up, { new: true });

  res.json({ success: true, listing: updated });
});


function safeUnlink(fileUrl) {
  try {
    // fileUrl ex: "/uploads/xxx.jpg"
    if (!fileUrl?.startsWith("/uploads/")) return;

    const absPath = path.join(process.cwd(), fileUrl); 
    // ex: /project/uploads/xxx.jpg
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  } catch {
    // ignore
  }
}

export const deleteListing = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Annonce introuvable", 404);

  // ✅ فقط صاحب الإعلان
  if (listing.userId.toString() !== req.user._id.toString()) {
    throw new AppError("Non autorisé", 403);
  }

  // ✅ supprimer les photos du disque (optionnel)
  (listing.photos || []).forEach(safeUnlink);

  await Listing.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "Annonce supprimée" });
});

export const getPublicListings = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 9);

  const listings = await Listing.find()
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json({ success: true, listings });
});

export const addView = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ✅ increment atomic
  const updated = await Listing.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!updated) throw new AppError("Annonce introuvable", 404);

  res.json({ success: true, views: updated.views });
});

