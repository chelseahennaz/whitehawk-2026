import { Outlet, useLocation } from "react-router-dom";
import ClubNavigation from "./ClubNavigation";
import FixturesTicker from "./FixturesTicker";
import ClubFooter from "./ClubFooter";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";
import { useSettings } from "@/hooks/useSupabase";

const PublicLayout = () => {
  const location = useLocation();
  const { data: heroSettings } = useSettings("homepage_hero");

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";
  const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;
  const hSettings = heroSettings?.value;
  const deviceHero = hSettings ? (isMobileView ? (hSettings.mobile || hSettings) : (hSettings.desktop || hSettings)) : null;
  
  const isSolidHero = isHomePage && deviceHero?.background_type === "color";
  const heroColor = deviceHero?.background_color || "#8e160b";

  return (
    <CartProvider>
      <div 
        className={`min-h-screen flex flex-col transition-colors duration-500 ${!isHomePage ? "bg-white" : ""}`} 
        style={{ backgroundColor: isSolidHero ? heroColor : (isHomePage ? "#000000" : "#ffffff") }}
      >
        <ClubNavigation />
        <FixturesTicker />
        <main className="flex-1 pt-[82px] lg:pt-[114px]">
          <Outlet />
        </main>
        <ClubFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default PublicLayout;

