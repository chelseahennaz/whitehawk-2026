import { Outlet, useLocation } from "react-router-dom";
import ClubNavigation from "./ClubNavigation";
import FixturesTicker from "./FixturesTicker";
import ClubFooter from "./ClubFooter";
import { useEffect } from "react";

const PublicLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <ClubNavigation />
      <FixturesTicker />
      <main className="flex-1 pt-[80px] lg:pt-[112px]">
        <Outlet />
      </main>
      <ClubFooter />
    </div>
  );
};

export default PublicLayout;
