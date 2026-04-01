import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Music2, Linkedin } from "lucide-react";
import clubBadge from "@/assets/club-badge.png";
import { useSettings } from "@/hooks/useSupabase";

const footerColumns = [
  {
    heading: "Whitehawk FC",
    links: [
      { label: "News", path: "/news" },
      { label: "First Team", path: "/teams/first-team" },
      { label: "Matches & Results", path: "/matches" },
      { label: "The Club", path: "/club" },
      { label: "Tickets", path: "/tickets" },
      { label: "Hire Our Pitch", path: "/hire-pitch" },
      { label: "Hire Our Clubhouse", path: "/hire-clubhouse" },
      { label: "Contact Us", path: "/contact" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { label: "Sponsorship Packages", path: "/sponsor" },
      { label: "Become a Sponsor", path: "/sponsor" },
      { label: "Community", path: "/club" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Cookie Policy", path: "/cookie-policy" },
      { label: "Terms of Use", path: "/terms" },
    ],
  },
];

const SOCIAL_DEFS = [
  { key: "facebook",  Icon: Facebook, label: "Facebook" },
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "twitter",   Icon: Twitter,   label: "X / Twitter" },
  { key: "youtube",   Icon: Youtube,   label: "YouTube" },
  { key: "tiktok",    Icon: Music2,    label: "TikTok" },
  { key: "linkedin",  Icon: Linkedin,  label: "LinkedIn" },
] as const;

const ClubFooter = () => {
  const { data: socialsSettings } = useSettings("club_socials");
  const socials = socialsSettings?.value || {};

  const activeSocials = SOCIAL_DEFS.filter(({ key }) => !!socials[key]);

  return (
    <footer className="bg-[#0d1526]">
      {/* Social Bar — only shown if at least one link is set */}
      {activeSocials.length > 0 && (
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="container mx-auto px-6 max-w-6xl flex justify-center">
            <div className="flex items-center gap-7">
              {activeSocials.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  href={socials[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-[#141b2b]/50 hover:text-[#8e160b] transition-colors duration-200"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Grid */}
      <div className="container mx-auto px-6 max-w-6xl py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h5 className="font-heading text-[11px] uppercase tracking-[0.18em] text-[#8e160b] mb-5 font-semibold">
                {col.heading}
              </h5>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-white text-sm font-body transition-colors duration-200 leading-snug"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Badge Column */}
          <div className="flex items-start justify-end">
            <Link to="/">
              <img
                src={clubBadge}
                alt="Whitehawk FC"
                className="h-28 w-28 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="container mx-auto px-6 max-w-6xl py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs font-body">
            © {new Date().getFullYear()} Whitehawk Football Club. All rights reserved.
          </p>
          <p className="text-white/20 text-xs font-body">
            TerraPura Ground, East Brighton Park, Brighton, BN2 5TS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ClubFooter;
