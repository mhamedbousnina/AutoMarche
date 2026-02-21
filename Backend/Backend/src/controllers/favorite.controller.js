import Favorite from "../models/favorite.js";
import Listing from "../models/listing.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

// ✅ add favorite
export const addFavorite = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const { listingId } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Annonce introuvable", 404);

  const exists = await Favorite.findOne({
    userId: req.user._id,
    listingId,
  });

  if (exists) {
    return res.json({ success: true }); // déjà favori
  }

  await Favorite.create({
    userId: req.user._id,
    listingId,
  });

  await Listing.findByIdAndUpdate(listingId, {
    $inc: { favoritesCount: 1 },
  });

  res.status(201).json({ success: true });
});

// ✅ remove favorite
export const removeFavorite = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const { listingId } = req.params;

  const deleted = await Favorite.findOneAndDelete({
    userId: req.user._id,
    listingId,
  });

  // ✅ ننقص فقط إذا كان فعلاً كان موجود
  if (deleted) {
    await Listing.findByIdAndUpdate(listingId, {
      $inc: { favoritesCount: -1 },
    });

    // ✅ حماية من النزول تحت 0
    await Listing.findByIdAndUpdate(
      listingId,
      { $max: { favoritesCount: 0 } }
    );
  }

  res.json({ success: true });
});

// ✅ get my favorites (with listing populated)
export const getMyFavorites = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const favorites = await Favorite.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate("listingId"); // يرجع تفاصيل الإعلان

  // نرجّع array متاع listings مباشرة باش يسهل عليك
  const listings = favorites
    .map((f) => f.listingId)
    .filter(Boolean);

  res.json({ success: true, listings });
});

// ✅ check if favorite
export const isFavorite = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const { listingId } = req.params;

  const exists = await Favorite.exists({
    userId: req.user._id,
    listingId,
  });

  res.json({ success: true, liked: !!exists });
});