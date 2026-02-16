import React from "react";

export default function HeroSection() {
  return (
    <section className="w-full mt-6">
      <div className="relative w-full h-105 overflow-hidden rounded-none">
        {/* Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=2000&q=80)",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold max-w-4xl">
            Achetez & Vendez votre voiture facilement
          </h1>

          <p className="mt-4 text-lg md:text-xl max-w-2xl text-white/90">
            Des milliers d’annonces automobiles vérifiées. Trouvez la voiture
            de vos rêves ou vendez la vôtre en quelques clics.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="px-8 py-3 rounded-full bg-blue-600 font-semibold text-white hover:bg-blue-700 transition">
              Acheter une voiture
            </button>

            <button className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition">
              Vendre ma voiture
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}