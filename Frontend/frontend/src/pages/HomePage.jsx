import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import CardListing from "../components/CardListing";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal"; // 1. On importe le bon nom

export default function HomePage({ filters }) {
  const [searchParams] = useSearchParams();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // 2. Si l'URL contient ?showLogin=true
    if (searchParams.get("showLogin") === "true") {
      setIsAuthOpen(true);
    }
  }, [searchParams]);

  return (
    <main>
      <HeroSection />
      <Categories />
      <CardListing filters={filters} />
      <Footer />

      {/* 3. On affiche la modale AuthModal */}
      {isAuthOpen && (
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          initialMode="login" // Optionnel: pour forcer le mode connexion
        />
      )}
    </main>
  );
}