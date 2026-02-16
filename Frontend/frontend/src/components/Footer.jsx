import React from "react";

export default function Footer() {
  return (
    <footer className="mt-14 bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-600 grid place-items-center text-white font-bold">
                A
              </div>
              <div className="font-extrabold text-white">AutoMarché</div>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              La plateforme N°1 pour acheter et vendre des voitures en Tunisie.
            </p>
          </div>

          <div>
            <div className="font-bold text-white">Acheter</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:underline">Voitures neuves</a></li>
              <li><a href="#" className="hover:underline">Occasions</a></li>
              <li><a href="#" className="hover:underline">Financement</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white">Vendre</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:underline">Publier une annonce</a></li>
              <li><a href="#" className="hover:underline">Conseils de vente</a></li>
              <li><a href="#" className="hover:underline">Estimation</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white">Support</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:underline">Centre d’aide</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-sm text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} AutoMarché. Tous droits réservés.</span>
          <span>FR</span>
        </div>
      </div>
    </footer>
  );
}