import Listing from "../models/listing.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const createListing = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("Non autorisé", 401);

  const files = req.files || [];
  const photos = files.map((f) => `/${f.path.replace(/\\/g, "/")}`);

  const payload = {
    userId: req.user._id,
    title: req.body.title,
    state: req.body.state,

    brand: req.body.brand,
    model: req.body.model,
    year: Number(req.body.year),
    mileage: Number(req.body.mileage),

    fuel: req.body.fuel,
    gearbox: req.body.gearbox,

    color: req.body.color || "",
    body: req.body.body || "",
    power: req.body.power ? Number(req.body.power) : null,
    doors: req.body.doors ? Number(req.body.doors) : null,
    description: req.body.description || "",

    price: Number(req.body.price),
    negotiable: req.body.negotiable === "true" || req.body.negotiable === true,

    contactFullName: req.body.contactFullName,
    contactPhone: req.body.contactPhone,
    gov: req.body.gov,
    city: req.body.city || "",

    photos,
  };

  const listing = await Listing.create(payload);
  res.status(201).json({ success: true, listing });
});