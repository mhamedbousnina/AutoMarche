// src/apis/listings.js
// Compatible avec ton ListingPage.jsx (FormData + token + VITE_API_URL=http://localhost:5000)
// ✅ Backend: app.use("/api/listings", listingRoutes)
// ✅ Donc endpoint: POST /api/listings

import { apiRequest } from "./api";

/**
 * Construit un FormData compatible backend
 * - photos: array de {file,url} ou File
 * - form: objet du formulaire (comme dans ton state)
 */
export function buildListingFormData({ form, photos }) {
  const fd = new FormData();

  // Champs véhicule
  fd.append("title", form.title ?? "");
  fd.append("state", form.state ?? "");
  fd.append("brand", form.brand ?? "");
  fd.append("model", form.model ?? "");
  fd.append("year", String(form.year ?? ""));
  fd.append("mileage", String(form.mileage ?? ""));
  fd.append("fuel", form.fuel ?? "");
  fd.append("gearbox", form.gearbox ?? "");
  fd.append("color", form.color ?? "");
  fd.append("body", form.body ?? "");
  fd.append("power", String(form.power ?? ""));
  fd.append("doors", String(form.doors ?? ""));
  fd.append("description", form.description ?? "");
  fd.append("price", String(form.price ?? ""));
  fd.append("negotiable", String(!!form.negotiable));

  // Champs contact (⚠️ même noms que ton backend)
  fd.append("contactFullName", form.fullName ?? "");
  fd.append("contactPhone", form.phone ?? "");
  fd.append("gov", form.gov ?? "");
  fd.append("city", form.city ?? "");

  // Photos (⚠️ fieldname: "photos")
  (photos || []).forEach((p) => {
    const file = p?.file || p; // accepte {file,url} ou File direct
    if (file) fd.append("photos", file);
  });

  return fd;
}

/**
 * Crée une annonce
 * @param {Object} args
 * @param {Object} args.form - ton state form
 * @param {Array}  args.photos - ton state photos
 */
export function createListing({ form, photos }) {
  const fd = buildListingFormData({ form, photos });

  // ✅ IMPORTANT: le path DOIT être /api/listings (pas /listings)
  return apiRequest("/api/listings", {
    method: "POST",
    body: fd,
  });
}