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

  useEffect(() => {
    async function loadMe() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      try {
        // ✅ CORRECTION: /api/auth/me
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("ME ERROR:", res.status, data);
          throw new Error(data?.message || "Erreur serveur");
        }

        setUser(data.user);
      } catch (err) {
        console.error("LOAD ME FAILED:", err);
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
      <Navbar onOpenLogin={openLogin} user={user} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/publier" element={<ListingPage user={user} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/annonce/:id" element={<AnnonceDetail />} />
        <Route path="*" element={<div className="p-6">Page introuvable</div>} />
      </Routes>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onAuthSuccess={(u) => {
          setUser(u);
          // ✅ important: token doit déjà être enregistré dans AuthModal après login
        }}
      />
    </BrowserRouter>
  );
}