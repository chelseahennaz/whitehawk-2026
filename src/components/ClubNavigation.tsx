import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Newspaper, Users, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clubBadge from "@/assets/club-badge.png";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Fixtures", path: "/fixtures", icon: Calendar },
  { label: "News", path: "/news", icon: Newspaper },
  { label: "Squad", path: "/squad", icon: Users },
];

const DesktopNav = () => {
  const location = useLocation();

  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 z-50">
      <div className="club-gradient">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={clubBadge} alt="Club Badge" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-heading text-xl font-bold uppercase text-primary-foreground tracking-wider">
                Your Club FC
              </h1>
              <p className="text-xs text-primary-foreground/70 font-body tracking-wide">
                Est. 1920
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 font-heading text-sm uppercase tracking-wider transition-colors rounded ${
                  location.pathname === item.path
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="h-1 club-gradient-horizontal opacity-60" />
    </header>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 club-gradient">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={clubBadge} alt="Club Badge" className="h-9 w-9 object-contain" />
            <span className="font-heading text-lg font-bold uppercase text-primary-foreground tracking-wider">
              Your Club FC
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-primary-foreground p-1"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-[60px] left-0 right-0 z-40 bg-club-dark/95 backdrop-blur-sm border-b border-primary/20"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-4 font-heading text-sm uppercase tracking-wider border-b border-primary-foreground/10 ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-primary-foreground/80"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-club-dark border-t border-primary/20 safe-area-bottom">
        <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-heading uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
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
