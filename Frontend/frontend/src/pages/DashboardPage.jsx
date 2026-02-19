import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardContent from "../components/DashboardContent";
import MyAdsContent from "../components/MyAdsContent";
import MyMessagesContent from "../components/MyMessagesContent";
import MyFavoritesContent from "../components/MyFavoritesContent";
import MyProfileContent from "../components/MyProfileContent";
import { useLocation } from "react-router-dom";
import { getMe } from "../apis/user";

export default function DashboardPage() {
  const location = useLocation();
  const [active, setActive] = useState(location.state?.tab || "dashboard");

  const [user, setUser] = useState(null);

  useEffect(() => {
  async function loadUser() {
    try {
      const data = await getMe();
      const u = data?.user ?? data ?? {};

      setUser({
        fullName: u.fullName || null,
        email: u.email || null,
        avatar: u.avatarUrl || null,
      });
    } catch (err) {
      console.error(err);
    }
  }

  // charger au début
  loadUser();

  // ✅ écouter changement avatar
  const handleUserUpdated = () => {
    loadUser();
  };

  window.addEventListener("userUpdated", handleUserUpdated);

  return () => {
    window.removeEventListener("userUpdated", handleUserUpdated);
  };
}, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar
        user={user} // ✅ ENVOYER AU SIDEBAR
        active={active}
        counts={{ ads: 3, messages: 5 }}
        onSelect={setActive}
        onLogout={() => console.log("logout")}
      />

      {active === "dashboard" && (
        <DashboardContent
          stats={{ activeAds: 3, totalViews: 1240, messages: 5, favorites: 8 }}
          activity={[
            { id: "1", text: "Nouvelle vue sur votre annonce Peugeot 208", when: "Il y a 2 h" },
            { id: "2", text: "Message reçu de Karim B.", when: "Il y a 5 h" },
            { id: "3", text: "Votre annonce Golf 7 a été publiée", when: "Hier" },
          ]}
        />
      )}

      {active !== "dashboard" && (
        <div className="flex-1 p-10 text-slate-700">
          {active === "ads" && (
            <MyAdsContent
              onEdit={(ad) => console.log("edit", ad)}
              onDelete={(ad) => console.log("delete", ad)}
            />
          )}

          {active === "messages" && (
            <MyMessagesContent onOpenMessage={(m) => console.log("open message", m)} />
          )}

          {active === "favorites" && (
            <MyFavoritesContent onRemoveFavorite={(f) => console.log("remove fav", f)} />
          )}

          {active === "profile" && <MyProfileContent />}
        </div>
      )}
    </div>
  );
}