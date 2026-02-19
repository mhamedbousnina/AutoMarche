// src/apis/user.js
import { apiRequest } from "./api";

export function getMe() {
  return apiRequest("/api/users/me", { method: "GET" });
}

export function updateMe(payload) {
  return apiRequest("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload) {
  return apiRequest("/api/users/me/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function uploadAvatar(file) {
  const fd = new FormData();
  fd.append("avatar", file); // multer field name

  // ✅ ICI ON AJOUTE /api
  return apiRequest("/api/users/me/avatar", {
    method: "PUT",
    body: fd,
  });
}
export function deleteAvatar() {
  return apiRequest("/api/users/me/avatar", { method: "DELETE" });
}