import React, { useEffect, useState } from "react";
import { Heart, Calendar, Fuel, MapPin } from "lucide-react";
import { getPublicListings, toBackendImage } from "../apis/listings";
import { useNavigate } from "react-router-dom";

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Icon className="h-4 w-4 text-gray-400" />
      <span>{children}</span>
    </div>
  );
}

export default function CardListing() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getPublicListings();
        if (!mounted) return;
        setListings(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setListings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-gray-100 py-14 px-4 md:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Annonces récentes
        </h2>
      </div>

      {loading ? (
        <div className="text-gray-500">Chargement...</div>
      ) : listings.length === 0 ? (
        <div className="text-gray-500">Aucune annonce disponible.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((car) => (
            <div
              key={car._id}
              onClick={() => navigate(`/annonce/${car._id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={
                    car.photos?.[0]
                      ? toBackendImage(car.photos[0])
                      : "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={car.title}
                  className="h-60 w-full object-cover"
                />

                <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white shadow flex items-center justify-center">
                  <Heart className="h-5 w-5 text-gray-500" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">
                    {car.title}
                  </h3>
                  <span className="text-lg font-bold text-blue-600">
                    {Number(car.price).toLocaleString()} DT
                  </span>
                </div>

                <div className="mt-4 flex gap-6 flex-wrap">
                  <Info icon={Calendar}>{car.year}</Info>
                  <Info icon={Fuel}>{car.fuel}</Info>
                  <Info icon={MapPin}>{car.gov}</Info>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}