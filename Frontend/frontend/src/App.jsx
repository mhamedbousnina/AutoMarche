import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

import HomePage from "./pages/HomePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ListingPage from "./pages/ListingPage";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnnonceDetail from "./pages/AnnonceDetail";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);

  // ✅ charger user si token existe
  useEffect(() => {
    async function loadMe() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Erreur serveur");

        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    loadMe();
  }, []);

  function openLogin() {
    setAuthMode("login");
    setAuthOpen(true);
  }

  return (
    <BrowserRouter>
      {/* ✅ Navbar toujours affiché */}
      <Navbar onOpenLogin={openLogin} user={user} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ✅ on passe user à ListingPage si tu veux auto-fill */}
        <Route path="/publier" element={<ListingPage user={user} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/annonce/:id" element={<AnnonceDetail />} />

        <Route path="*" element={<div className="p-6">Page introuvable</div>} />
      </Routes>

      {/* ✅ Modal disponible partout */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onAuthSuccess={(u) => setUser(u)}
      />
    </BrowserRouter>
  );
}