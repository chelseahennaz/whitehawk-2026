import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Facebook, Instagram, Twitter, Youtube, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { teamNavItems } from "@/data/clubTeams";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Teams", path: "/teams", children: teamNavItems },
  { label: "Matches", path: "/matches" },
  { label: "News", path: "/news" },
  { label: "Club", path: "/club" },
  { label: "Tickets", path: "/tickets" },
  { label: "Contact", path: "/contact" },
];

const utilityLinks = [
  { label: "Hire Our Pitch", path: "/hire-pitch" },
  { label: "Hire Our Clubhouse", path: "/hire-clubhouse" },
  { label: "Sponsor Pack", path: "/sponsor" },
];

const socialIcons = [
  { Icon: Facebook, href: "https://facebook.com/whitehawkfc", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com/whitehawkfc", label: "Instagram" },
  { Icon: Twitter, href: "https://twitter.com/whitehawkfc", label: "X" },
  { Icon: Youtube, href: "https://youtube.com/@whitehawkfc", label: "YouTube" },
];

const isItemActive = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`);

const DesktopNav = () => {
  const location = useLocation();

  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-50">
      <div className="bg-club-dark">
        <div className="container mx-auto flex items-center justify-end gap-4 py-1.5 px-4">
          {utilityLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-[11px] font-heading uppercase tracking-widest text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-club-red-dark relative">
        <div className="container mx-auto flex items-center justify-between py-0 px-4">
          <Link to="/" className="absolute left-4 -top-6 z-[60] flex items-center">
            <img
              alt="Whitehawk FC"
              className="h-24 w-24 object-contain drop-shadow-lg"
              src="https://whitehawkfc.com/wp-content/uploads/2023/04/cropped-twitter-badge-round.png"
            />
          </Link>

          <div className="w-28" />

          <nav className="flex items-center gap-0">
            {navItems.map((item) => {
              const isActive = isItemActive(location.pathname, item.path);

              if (item.children) {
                return (
                  <div key={item.path} className="group relative">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1 px-5 py-5 font-heading text-base uppercase tracking-wider transition-colors border-b-3 ${
                        isActive
                          ? "border-club-gold text-primary-foreground"
                          : "border-transparent text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                    </Link>
                    <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-2 rounded-xl border border-border bg-card p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block rounded-lg px-4 py-3 font-heading text-sm uppercase tracking-wider text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-5 font-heading text-base uppercase tracking-wider transition-colors border-b-3 ${
                    isActive
                      ? "border-club-gold text-primary-foreground"
                      : "border-transparent text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0">
            <div className="w-px h-6 bg-primary-foreground/20 mx-3" />
            {socialIcons.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-club-red-dark">
        <div className="flex items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://whitehawkfc.com/wp-content/uploads/2023/04/cropped-twitter-badge-round.png"
              alt="Whitehawk FC"
              className="h-11 w-11 object-contain"
            />
            <span className="font-heading text-sm font-semibold uppercase text-primary-foreground tracking-widest">
              Whitehawk FC
            </span>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-primary-foreground p-1" aria-label="Toggle navigation">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-[64px] left-0 right-0 z-40 bg-club-dark/95 backdrop-blur-sm border-b border-primary/20"
          >
            {navItems.map((item) => {
              const isActive = isItemActive(location.pathname, item.path);

              if (item.children) {
                return (
                  <div key={item.path} className="border-b border-primary-foreground/10">
                    <div className="flex items-center justify-between px-6 py-4">
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`font-heading text-sm uppercase tracking-wider ${isActive ? "text-club-gold" : "text-primary-foreground/80"}`}
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
                            className="block px-10 py-2.5 font-heading text-xs uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground"
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
                  className={`flex items-center px-6 py-4 font-heading text-sm uppercase tracking-wider border-b border-primary-foreground/10 ${
                    isActive ? "text-club-gold bg-primary/10" : "text-primary-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center justify-center gap-4 py-4">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-club-dark border-t border-primary/20 safe-area-bottom">
        <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
          {navItems.slice(0, 5).map((item) => {
            const isActive = isItemActive(location.pathname, item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="text-[10px] font-heading uppercase tracking-wider">{item.label}</span>
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
