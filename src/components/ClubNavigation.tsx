import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Facebook, Instagram, Twitter, Youtube, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { teamNavItems } from "@/data/clubTeams";
import clubLogoWhite from "@/assets/club-logo-white.png";
import { useSettings } from "@/hooks/useSupabase";

interface NavItem {
  label: string;
  path: string;
  children?: { label: string; path: string; }[];
}

const leftNavItems: NavItem[] = [
  { label: "Teams", path: "/teams", children: teamNavItems },
  { label: "Matches", path: "/matches" },
  { label: "Tickets", path: "/tickets" },
  { label: "News", path: "/news" },
];

const rightNavItems: NavItem[] = [
  { 
    label: "Club", 
    path: "/club", 
    children: [
      { label: "Hire Our Pitch", path: "/hire-pitch" },
      { label: "Hire Our Clubhouse", path: "/hire-clubhouse" },
    ] 
  },
  { label: "Sponsor", path: "/sponsor" },
  { label: "Contact", path: "/contact" },
  { label: "Admin", path: "/admin/login" },
];

const isItemActive = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`);

const DesktopNav = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<NavItem | null>(null);
  const { data: brandSettings } = useSettings("club_brand");
  const logoUrl = brandSettings?.value?.logo_url || clubLogoWhite;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerActive = isScrolled || hoveredMenu !== null;

  return (
    <header 
      className="hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      onMouseLeave={() => setHoveredMenu(null)}
    >
      <div className={`transition-all duration-300 relative w-full ${headerActive ? "bg-[#8e160b] shadow-xl" : "bg-transparent"}`}>
        <div className={`container mx-auto flex items-center justify-between py-0 px-8 transition-all duration-300 ${isScrolled ? "h-16" : "h-20 md:h-28"}`}>
          {/* Left Nav */}
          <nav className="flex-1 flex justify-end items-center gap-0">
            {leftNavItems.map((item) => {
              const isActive = isItemActive(location.pathname, item.path);
              return (
                <div 
                  key={item.path} 
                  className="group relative"
                  onMouseEnter={() => item.children ? setHoveredMenu(item) : setHoveredMenu(null)}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1.5 px-6 font-heading uppercase transition-all duration-300 border-b-3 ${
                      isScrolled ? "py-2 text-lg" : "py-5 text-xl"
                    } ${
                      isActive || hoveredMenu?.path === item.path
                        ? "border-club-gold text-primary-foreground"
                        : "border-transparent text-primary-foreground/80 hover:text-primary-foreground"
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className={`transition-transform opacity-60 ${hoveredMenu?.path === item.path ? "rotate-180" : ""}`} />}
                  </Link>
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
            {rightNavItems.map((item) => {
              const isActive = isItemActive(location.pathname, item.path);
              return (
                <div 
                  key={item.path} 
                  className="group relative"
                  onMouseEnter={() => item.children ? setHoveredMenu(item) : setHoveredMenu(null)}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1.5 px-6 font-heading uppercase transition-all duration-300 border-b-3 ${
                      isScrolled ? "py-2 text-lg" : "py-5 text-xl"
                    } ${
                      isActive || hoveredMenu?.path === item.path
                        ? "border-club-gold text-primary-foreground"
                        : "border-transparent text-primary-foreground/80 hover:text-primary-foreground"
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className={`transition-transform opacity-60 ${hoveredMenu?.path === item.path ? "rotate-180" : ""}`} />}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Mega Menu Content */}
        <AnimatePresence>
          {hoveredMenu && hoveredMenu.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#8e160b] border-t border-white/10 shadow-2xl"
            >
              <div className="container mx-auto px-8 py-16 flex border-b border-white/5">
                {/* Large label on left */}
                <div className="w-1/3 pr-12">
                  <h2 className="font-heading text-8xl text-white uppercase leading-none tracking-tighter opacity-90">
                    {hoveredMenu.label}
                  </h2>
                </div>
                
                {/* Sub-links in columns */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12">
                  {hoveredMenu.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setHoveredMenu(null)}
                      className="block font-heading text-xl uppercase text-white hover:text-club-gold transition-colors tracking-wide"
                    >
                      {child.label}
                    </Link>
                  ))}
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
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: brandSettings } = useSettings("club_brand");
  const logoUrl = brandSettings?.value?.logo_url || clubLogoWhite;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#8e160b] shadow-md" : "bg-transparent"}`}>
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

          <button onClick={() => setMenuOpen(!menuOpen)} className="text-primary-foreground p-2 relative z-50" aria-label="Toggle navigation">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
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
            {[...leftNavItems, ...rightNavItems].map((item) => {
              const isActive = isItemActive(location.pathname, item.path);

              if (item.children) {
                return (
                  <div key={item.path} className="border-b border-primary-foreground/10">
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
                        onClick={() => setTeamsOpen(!teamsOpen)}
                        className="text-primary-foreground/80"
                        aria-label="Toggle teams submenu"
                      >
                        <ChevronDown size={18} className={teamsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                    </div>
                    {teamsOpen ? (
                      <div className="pb-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setMenuOpen(false)}
                            className="block px-10 py-2.5 font-heading text-xl uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
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
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-6 py-4 font-heading text-2xl uppercase tracking-wider border-b border-primary-foreground/10 text-club-gold bg-primary/5"
            >
              Admin Login
            </Link>
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
