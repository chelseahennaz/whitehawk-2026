// v1.2 - Force Refresh for Nav Changes
import React, { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSupabase";

import { Link, useLocation } from "react-router-dom";
import { Menu, X, Facebook, Instagram, Twitter, Youtube, ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { teamNavItems } from "@/data/clubTeams";
import clubLogoWhite from "@/assets/club-logo-white.png";
import ionosLogo from "@/assets/ionos-logo.png";

import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";

interface NavItem {
  label: string;
  path: string;
  id?: string;
  children?: { label: string; path: string; id?: string }[];
}

const firstTeamNavItems = [
  { label: "Players & Staff", path: "/teams", id: "first-team-players" },
  { label: "Matches", path: "/matches", id: "first-team-matches" },
  { label: "Table", path: "/standings", id: "first-team-table" },
];

const otherTeamsNavItems = [
  { label: "Whitehawk Women", path: "/teams/women", id: "teams-women" },
  { label: "Whitehawk U18", path: "/teams/u18", id: "teams-u18" },
  { label: "Youth", path: "/teams/academy", id: "teams-youth" },
];

const leftNavItems: NavItem[] = [
  { label: "First Team", path: "/teams", id: "first-team", children: firstTeamNavItems },
  { label: "Teams", path: "/teams", id: "teams", children: otherTeamsNavItems },
  {
    label: "Club",
    path: "/club",
    id: "club",
    children: [
      { label: "Club Personnel", path: "/personnel", id: "club-personnel" },
      { label: "Match Photos", path: "/match-photos", id: "club-photos" },
      { label: "Hire Our Pitch", path: "/hire-pitch", id: "club-pitch" },
      { label: "Hire Our Clubhouse", path: "/hire-clubhouse", id: "club-clubhouse" },
    ]
  },
  { label: "Fanzone", path: "/fanzone", id: "fanzone" },
  { label: "News", path: "/news", id: "news" },
];

const rightNavItems: NavItem[] = [
  { label: "Tickets", path: "https://whitehawkfc.ktckts.com/", id: "tickets" },
  { label: "Hospitality", path: "/hospitality", id: "hospitality" },
  { label: "Sponsor", path: "/sponsor", id: "sponsor" },
  { label: "Shop", path: "/shop", id: "shop" },
  { label: "Contact", path: "/contact", id: "contact" },
];

const getFilteredNavItems = (items: NavItem[], hiddenIds: string[]) => {
  return items.filter(item => !item.id || !hiddenIds.includes(item.id)).map(item => ({
    ...item,
    children: item.children?.filter(child => !child.id || !hiddenIds.includes(child.id))
  }));
};

const isItemActive = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`);

const CartIconButton = ({ isScrolled }: { isScrolled?: boolean }) => {
  const { totalItems, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      aria-label="Open cart"
      className={`relative flex items-center justify-center ml-2 text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 ${
        isScrolled ? "p-2" : "p-2.5"
      }`}
    >
      <ShoppingBag size={isScrolled ? 18 : 20} />
      {totalItems > 0 && (
        <motion.span
          key={totalItems}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-0.5 -right-0.5 bg-club-gold text-black text-[9px] font-extrabold font-heading w-4 h-4 rounded-full flex items-center justify-center leading-none"
        >
          {totalItems > 9 ? "9+" : totalItems}
        </motion.span>
      )}
    </button>
  );
};

const DesktopNav = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<NavItem | null>(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
  const { data: brandSettings } = useSettings("club_brand");
  const { data: heroSettings } = useSettings("homepage_hero");
  const { data: menuSettings } = useSettings("menu_visibility");
  const hiddenIds = menuSettings?.value?.hidden || [];
  const logoUrl = ionosLogo;
  
  const filteredLeft = getFilteredNavItems(leftNavItems, hiddenIds);
  const filteredRight = getFilteredNavItems(rightNavItems, hiddenIds);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const headerActive = isScrolled || hoveredMenu !== null || !isHomePage;

  const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;
  const hSettings = heroSettings?.value;
  const deviceHero = hSettings ? (isMobileView ? (hSettings.mobile || hSettings) : (hSettings.desktop || hSettings)) : null;
  
  const isSolidHero = isHomePage && deviceHero?.background_type === "color";
  const heroColor = deviceHero?.background_color || "#8e160b";

  return (
    <header 
      className="hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      onMouseLeave={() => {
        setHoveredMenu(null);
        setHoveredSubmenu(null);
      }}
    >
      <div 
        className={`transition-all duration-300 relative w-full ${headerActive ? "shadow-xl" : "bg-transparent"}`}
        style={{ backgroundColor: headerActive ? (isSolidHero ? heroColor : "#8e160b") : "transparent" }}
      >
        <div className={`container mx-auto flex items-center justify-between py-0 px-8 transition-all duration-300 ${isScrolled ? "h-16" : "h-20 md:h-28"}`}>
          {/* Left Nav */}
          <nav className="flex-1 flex justify-end items-center gap-0">
            {filteredLeft.map((item) => {
              const isActive = isItemActive(location.pathname, item.path);
              return (
                <div 
                  key={item.label} 
                  className="group relative"
                  onMouseEnter={() => item.children ? setHoveredMenu(item) : setHoveredMenu(null)}
                >
                  {item.path.startsWith('http') ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-4 font-heading uppercase transition-all duration-300 border-b-3 ${
                        isScrolled ? "py-2 text-md" : "py-5 text-lg"
                      } border-transparent text-primary-foreground/80 hover:text-primary-foreground`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1.5 px-4 font-heading uppercase transition-all duration-300 border-b-3 ${
                        isScrolled ? "py-2 text-md" : "py-5 text-lg"
                      } ${
                        isActive || hoveredMenu?.path === item.path
                          ? "border-club-gold text-primary-foreground"
                          : "border-transparent text-primary-foreground/80 hover:text-primary-foreground"
                      }`}
                    >
                      {item.label}
                      {item.children && <ChevronDown size={14} className={`transition-transform opacity-60 ${hoveredMenu?.path === item.path ? "rotate-180" : ""}`} />}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Centered Logo */}
          <div className="flex-shrink-0 px-12 relative z-[60] flex items-center justify-center">
            <Link to="/" className="flex items-center justify-center" onMouseEnter={() => setHoveredMenu(null)}>
              <img
                alt="Whitehawk FC"
                className={`transition-all duration-300 object-contain ${isScrolled ? "h-11 w-11" : "h-16 w-16 md:h-20 md:w-20"}`}
                src={logoUrl}
              />
            </Link>
          </div>

          {/* Right Nav */}
          <nav className="flex-1 flex justify-start items-center gap-0">
            {filteredRight.map((item) => {
              const isActive = isItemActive(location.pathname, item.path);
              return (
                <div 
                  key={item.label} 
                  className="group relative"
                  onMouseEnter={() => item.children ? setHoveredMenu(item) : setHoveredMenu(null)}
                >
                  {item.path.startsWith('http') ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-4 font-heading uppercase transition-all duration-300 border-b-3 ${
                        isScrolled ? "py-2 text-md" : "py-5 text-lg"
                      } border-transparent text-primary-foreground/80 hover:text-primary-foreground`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1.5 px-4 font-heading uppercase transition-all duration-300 border-b-3 ${
                        isScrolled ? "py-2 text-md" : "py-5 text-lg"
                      } ${
                        isActive || hoveredMenu?.path === item.path
                          ? "border-club-gold text-primary-foreground"
                          : "border-transparent text-primary-foreground/80 hover:text-primary-foreground"
                      }`}
                    >
                      {item.label}
                      {item.children && <ChevronDown size={14} className={`transition-transform opacity-60 ${hoveredMenu?.path === item.path ? "rotate-180" : ""}`} />}
                    </Link>
                  )}
                </div>
              );
            })}
            {/* Cart Icon */}
            <CartIconButton isScrolled={isScrolled} />
          </nav>
        </div>

        {/* Mega Menu Content */}
        <AnimatePresence>
          {hoveredMenu && hoveredMenu.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 shadow-2xl"
              style={{ backgroundColor: isSolidHero ? heroColor : "#8e160b" }}
            >
              <div className="container mx-auto px-8 py-16 flex border-b border-white/5">
                {/* Large label on left */}
                <div className="w-1/3 pr-12">
                  <h2 className="font-heading text-8xl text-white uppercase leading-none tracking-tighter opacity-90">
                    {hoveredMenu.label}
                  </h2>
                </div>
                
                {/* Sub-links in columns */}
                <div className="flex-1">
                  {hoveredMenu.label === "Teams" ? (
                    <div className="flex gap-12">
                      {/* Column 1: Main Options */}
                      <div className="w-80 space-y-6">
                        <Link
                          to="/teams/women"
                          onMouseEnter={() => setHoveredSubmenu(null)}
                          onClick={() => setHoveredMenu(null)}
                          className="block font-heading text-2xl uppercase text-white hover:text-club-gold transition-colors tracking-wider"
                        >
                          Whitehawk Women
                        </Link>
                        <Link
                          to="/teams/u18"
                          onMouseEnter={() => setHoveredSubmenu(null)}
                          onClick={() => setHoveredMenu(null)}
                          className="block font-heading text-2xl uppercase text-white hover:text-club-gold transition-colors tracking-wider"
                        >
                          Whitehawk U18
                        </Link>
                        <div
                          onMouseEnter={() => setHoveredSubmenu("youth")}
                          className="group/youth flex items-center justify-between cursor-pointer font-heading text-2xl uppercase text-white hover:text-club-gold transition-colors tracking-wider"
                        >
                          <Link
                            to="/teams/academy"
                            onClick={() => {
                              setHoveredMenu(null);
                              setHoveredSubmenu(null);
                            }}
                            className="hover:text-club-gold"
                          >
                            Youth
                          </Link>
                          <ChevronRight size={18} className="text-white/60 group-hover/youth:text-club-gold group-hover/youth:translate-x-1 transition-transform ml-2" />
                        </div>
                      </div>
                      
                      {/* Column 2: Youth Teams nested flyout */}
                      <div className="flex-1 min-h-[220px]">
                        <AnimatePresence>
                          {hoveredSubmenu === "youth" && (
                            <motion.div
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.2 }}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-12 border-l border-white/10 pl-12"
                            >
                              <div className="col-span-2 mb-2">
                                <Link
                                  to="/teams/academy"
                                  onClick={() => {
                                    setHoveredMenu(null);
                                    setHoveredSubmenu(null);
                                  }}
                                  className="font-heading text-xs uppercase tracking-[0.2em] text-club-gold hover:underline font-extrabold"
                                >
                                  Youth Hub Overview →
                                </Link>
                              </div>
                              <Link to="/teams/academy/u16" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 16s</Link>
                              <Link to="/teams/academy/u15" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 15s</Link>
                              <Link to="/teams/academy/u14" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 14s</Link>
                              <Link to="/teams/academy/u13" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 13s</Link>
                              <Link to="/teams/academy/u13-red" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 13s Red</Link>
                              <Link to="/teams/academy/u13-white" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 13s White</Link>
                              <Link to="/teams/academy/u12" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 12s</Link>
                              <Link to="/teams/academy/u7" onClick={() => { setHoveredMenu(null); setHoveredSubmenu(null); }} className="block font-heading text-base uppercase text-white/85 hover:text-club-gold transition-colors tracking-wide">Under 7s / Under 8s</Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {hoveredMenu.children.map((child) => {
                        const isExternal = child.path.startsWith('http');
                        if (isExternal) {
                          return (
                            <a
                              key={child.path}
                              href={child.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setHoveredMenu(null)}
                              className="block font-heading text-2xl uppercase text-white hover:text-club-gold transition-colors tracking-wider"
                            >
                              {child.label}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setHoveredMenu(null)}
                            className="block font-heading text-2xl uppercase text-white hover:text-club-gold transition-colors tracking-wider"
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileYouthOpen, setMobileYouthOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: brandSettings } = useSettings("club_brand");
  const { data: heroSettings } = useSettings("homepage_hero");
  const { data: menuSettings } = useSettings("menu_visibility");
  const hiddenIds = menuSettings?.value?.hidden || [];
  const logoUrl = ionosLogo;
  
  const filteredLeft = getFilteredNavItems(leftNavItems, hiddenIds);
  const filteredRight = getFilteredNavItems(rightNavItems, hiddenIds);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const headerActive = isScrolled || !isHomePage;

  const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;
  const hSettings = heroSettings?.value;
  const deviceHero = hSettings ? (isMobileView ? (hSettings.mobile || hSettings) : (hSettings.desktop || hSettings)) : null;
  
  const isSolidHero = isHomePage && deviceHero?.background_type === "color";
  const heroColor = deviceHero?.background_color || "#8e160b";

  return (
    <>
      <header 
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerActive ? "shadow-md border-b border-white/10" : "bg-transparent"}`}
        style={{ backgroundColor: headerActive ? (isSolidHero ? heroColor : "#8e160b") : "transparent" }}
      >
        <div className={`flex items-center justify-between px-4 transition-all duration-300 relative ${isScrolled ? "py-1.5" : "py-3"}`}>
          {/* Logo - Centered absolute */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Whitehawk FC"
                className={`transition-all duration-300 object-contain ${isScrolled ? "h-10 w-10" : "h-14 w-14"}`}
              />
            </Link>
          </div>

          <div className="flex items-center gap-3 invisible"> {/* Placeholder for symmetry */}
             <div className="h-11 w-11" />
          </div>

          <div className="flex items-center gap-1">
            <CartIconButton isScrolled={isScrolled} />
            <button 
              onClick={() => {
                if (menuOpen) setOpenSubmenu(null);
                setMenuOpen(!menuOpen);
              }} 
              className="text-primary-foreground p-2 relative z-50" 
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-[72px] left-0 right-0 z-40 bg-club-dark/95 backdrop-blur-sm border-b border-primary/20"
          >
            {[...filteredLeft, ...filteredRight].map((item) => {
              const isActive = isItemActive(location.pathname, item.path);
              const isSubmenuOpen = openSubmenu === item.label;

              if (item.children) {
                return (
                  <div key={item.label} className="border-b border-primary-foreground/10">
                    <div className="flex items-center justify-between px-6 py-4">
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`font-heading text-2xl uppercase tracking-wider ${isActive ? "text-club-gold" : "text-primary-foreground/80"}`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.label)}
                        className="text-primary-foreground/80 p-2"
                        aria-label={`Toggle ${item.label} submenu`}
                      >
                        <ChevronDown size={18} className={isSubmenuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                    </div>
                    {isSubmenuOpen ? (
                      <div className="pb-3">
                        {item.children.map((child) => {
                          const isExternal = child.path.startsWith('http');
                          
                          if (child.label === "Youth") {
                            return (
                              <div key={child.path} className="w-full">
                                <div className="flex items-center justify-between px-10 py-2">
                                  <Link
                                    to={child.path}
                                    onClick={() => setMenuOpen(false)}
                                    className="font-heading text-xl uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground"
                                  >
                                    {child.label} Hub
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => setMobileYouthOpen(!mobileYouthOpen)}
                                    className="text-primary-foreground/60 p-2"
                                    aria-label="Toggle Youth Teams submenu"
                                  >
                                    <ChevronDown size={16} className={mobileYouthOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                                  </button>
                                </div>
                                {mobileYouthOpen && (
                                  <div className="pl-14 pb-2 space-y-2.5 border-l border-white/10 ml-10 mb-2">
                                    <Link to="/teams/academy/u16" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U16s</Link>
                                    <Link to="/teams/academy/u15" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U15s</Link>
                                    <Link to="/teams/academy/u14" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U14s</Link>
                                    <Link to="/teams/academy/u13" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U13s</Link>
                                    <Link to="/teams/academy/u13-red" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U13s Red</Link>
                                    <Link to="/teams/academy/u13-white" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U13s White</Link>
                                    <Link to="/teams/academy/u12" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U12s</Link>
                                    <Link to="/teams/academy/u7" onClick={() => setMenuOpen(false)} className="block py-1 font-heading text-lg uppercase text-primary-foreground/50 hover:text-club-gold">U7 / U8s</Link>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          if (isExternal) {
                            return (
                              <a
                                key={child.path}
                                href={child.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMenuOpen(false)}
                                className="block px-10 py-2.5 font-heading text-xl uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground"
                              >
                                {child.label}
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setMenuOpen(false)}
                              className="block px-10 py-2.5 font-heading text-xl uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground"
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              }

              if (item.path.startsWith('http')) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-6 py-4 font-heading text-2xl uppercase tracking-wider border-b border-primary-foreground/10 text-primary-foreground/80 hover:text-club-gold"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-6 py-4 font-heading text-2xl uppercase tracking-wider border-b border-primary-foreground/10 ${
                    isActive ? "text-club-gold bg-primary/10" : "text-primary-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

const ClubNavigation = () => (
  <>
    <DesktopNav />
    <MobileNav />
  </>
);

export default ClubNavigation;
