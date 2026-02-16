import React from "react";
import { Heart, Calendar, Fuel, MapPin } from "lucide-react";

const CARS = [
  {
    title: "Peugeot 208 Style",
    price: "45 000 DT",
    year: "2023",
    fuel: "Essence",
    city: "Tunis",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Volkswagen Golf 8",
    price: "72 000 DT",
    year: "2022",
    fuel: "Diesel",
    city: "Sousse",
    img: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Renault Clio 5",
    price: "38 000 DT",
    year: "2021",
    fuel: "Essence",
    city: "Sfax",
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80",
  },
];

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Icon className="h-4 w-4 text-gray-400" />
      <span>{children}</span>
    </div>
  );
}

export default function CardListing() {
  return (
    <section className="w-full bg-gray-100 py-14 px-4 md:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Annonces récentes
        </h2>

        <a
          href="#"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Voir toutes les annonces →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CARS.map((car) => (
          <div
            key={car.title}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={car.img}
                alt={car.title}
                className="h-60 w-full object-cover"
              />

              <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white shadow flex items-center justify-center">
                <Heart className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">
                  {car.title}
                </h3>
                <span className="text-lg font-bold text-blue-600">
                  {car.price}
                </span>
              </div>

              <div className="mt-4 flex gap-6 flex-wrap">
                <Info icon={Calendar}>{car.year}</Info>
                <Info icon={Fuel}>{car.fuel}</Info>
                <Info icon={MapPin}>{car.city}</Info>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}