const API_URL = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vous devez être connecté");
  return { Authorization: `Bearer ${token}` };
}

export async function addFavorite(listingId) {
  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ listingId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Erreur ajout favori");
  return data;
}

export async function removeFavorite(listingId) {
  const res = await fetch(`${API_URL}/favorites/${listingId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Erreur suppression favori");
  return data;
}

export async function getMyFavorites() {
  const res = await fetch(`${API_URL}/favorites/me`, {
    headers: { ...authHeaders() },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Erreur");
  return data.listings; // array listings
}

export async function isFavorite(listingId) {
  const res = await fetch(`${API_URL}/favorites/${listingId}`, {
    headers: { ...authHeaders() },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Erreur");
  return !!data.liked;
}