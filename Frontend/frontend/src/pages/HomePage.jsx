import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import CardListing from "../components/CardListing";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <Categories />
        <CardListing />
      </main>
      <Footer />
    </div>
  );
}