const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  let data = null;
  let text = null;

  // ✅ essaie JSON sinon texte
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    text = await res.text().catch(() => null);
  }

  if (!res.ok) {
    console.error("API ERROR:", {
      url,
      status: res.status,
      statusText: res.statusText,
      contentType,
      tokenExists: !!token,
      json: data,
      textPreview: text?.slice(0, 300),
    });
    throw new Error((data && data.message) || `Erreur serveur (${res.status})`);
  }

  // ✅ log si la réponse n'est pas JSON
  if (!contentType.includes("application/json")) {
    console.warn("API NON-JSON RESPONSE:", {
      url,
      status: res.status,
      contentType,
      textPreview: text?.slice(0, 300),
    });
    return {};
  }

  return data ?? {};
}