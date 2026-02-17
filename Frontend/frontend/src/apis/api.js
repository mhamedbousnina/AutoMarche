const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Erreur serveur");
  }

  return data;
}

export const listingsApi = {
  create: ({ token, form, photos }) => {
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (typeof v === "boolean") fd.append(k, v ? "true" : "false");
      else fd.append(k, v ?? "");
    });

    (photos || []).forEach((p) => {
      const file = p?.file || p;
      if (file) fd.append("photos", file);
    });

    return request("/listings", {
      method: "POST",
      body: fd,
      token,
      isFormData: true,
    });
  },
};