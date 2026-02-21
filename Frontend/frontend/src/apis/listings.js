// src/apis/listings.js

const API_URL = "http://localhost:5000/api";
const BACKEND_URL = "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Convertir "/uploads/xxx.jpg" -> url complète
export function toBackendImage(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}

export async function createListing({ form, photos }) {
  const fd = new FormData();

  Object.entries(form).forEach(([k, v]) => {
    fd.append(k, typeof v === "boolean" ? String(v) : (v ?? ""));
  });

  photos.forEach((p) => fd.append("photos", p.file));

  const res = await fetch(`${API_URL}/listings`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Erreur publication");
  return data.listing;
}

export async function getMyListings() {
  const res = await fetch(`${API_URL}/listings/me`, {
    headers: { ...authHeaders() },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Erreur chargement");
  return data.listings;
}

export async function getListingById(id) {
  const res = await fetch(`${API_URL}/listings/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Annonce introuvable");
  return data.listing;
}
export async function updateListing(id, { form, newPhotos, keptPhotos }) {
  const fd = new FormData();

  Object.entries(form).forEach(([k, v]) => {
    fd.append(k, typeof v === "boolean" ? String(v) : (v ?? ""));
  });

  fd.append("keptPhotos", JSON.stringify(keptPhotos || []));

  (newPhotos || []).forEach((p) => fd.append("photos", p.file));

  const res = await fetch(`${API_URL}/listings/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders() },
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Erreur modification");
  return data.listing;
}

export async function deleteListing(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/listings/${id}`, {  // ✅ PAS /api/listings
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Erreur suppression");
  }

  return data;
}