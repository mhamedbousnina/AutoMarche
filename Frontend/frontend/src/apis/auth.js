// src/apis/auth.js
import { apiRequest } from "./api";

export function register(payload) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function forgotPassword(email) {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(data) { // Accept the whole object
  return apiRequest("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data), 
  });
}

export function meAuth() {
  return apiRequest("/api/auth/me", { method: "GET" });
}