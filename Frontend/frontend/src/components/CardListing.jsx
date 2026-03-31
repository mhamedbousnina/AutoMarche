import React, { useEffect, useMemo, useState } from "react";
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

export default function CardListing({ filters = {} }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filteredListings = useMemo(() => {
    const brandFilter = String(filters.brand || "").trim().toLowerCase();
    const fuelFilter = String(filters.fuel || "").trim().toLowerCase();
    const gearboxFilter = String(filters.gearbox || "").trim().toLowerCase();
    const yearFilter = String(filters.year || "").trim();
    const govFilter = String(filters.gov || "").trim();
    const cityFilter = String(filters.city || "").trim();
    const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

    return listings.filter((car) => {
      const title = String(car.title || car.brand || "").toLowerCase();
      const price = Number(car.price || 0);

      if (brandFilter && !title.includes(brandFilter)) return false;
      if (fuelFilter && String(car.fuel || "").toLowerCase() !== fuelFilter) return false;
      if (gearboxFilter && String(car.gearbox || "").toLowerCase() !== gearboxFilter) return false;
      if (yearFilter && String(car.year || "") !== yearFilter) return false;
      if (govFilter && String(car.gov || "") !== govFilter) return false;
      if (cityFilter && String(car.city || "") !== cityFilter) return false;
      if (minPrice !== null && price < minPrice) return false;
      if (maxPrice !== null && price > maxPrice) return false;
      return true;
    });
  }, [filters, listings]);

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
      ) : filteredListings.length === 0 ? (
        <div className="text-gray-500">Aucune annonce disponible.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((car) => (
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