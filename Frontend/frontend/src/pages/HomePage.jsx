import React from "react";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import CardListing from "../components/CardListing";
import Footer from "../components/Footer";

export default function HomePage({ filters }) {
  return (
    <main>
      <HeroSection />
      <Categories />
      <CardListing filters={filters} />
      <Footer />
    </main>
  );
}