import { useSponsors } from "@/hooks/useSupabase";
import { Loader2, Facebook, Instagram, Twitter, Youtube, Music2, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import type { Sponsor } from "@/hooks/useSupabase";

const SponsorRow = ({ 
  sponsors, 
  logoHeightClass 
}: { 
  sponsors: Sponsor[]; 
  logoHeightClass: string;
}) => {
  if (sponsors.length === 0) return null;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-center gap-x-12 gap-y-8 flex-wrap">
        {sponsors.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`flex items-center justify-center ${logoHeightClass} px-4 transition-all duration-500 group`}
          >
            <a 
              href={s.website_url || "#"} 
              target="_blank" 
              rel="noreferrer"
              className="relative w-full h-full flex items-center justify-center"
            >
              {s.logo_url ? (
                <img 
                  src={s.logo_url} 
                  alt={s.name} 
                  className="max-h-full max-w-full object-contain grayscale opacity-60 brightness-95 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500 ease-in-out" 
                />
              ) : (
                <span className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground/30">{s.name}</span>
              )}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SponsorsBar = () => {
  const { data: sponsors, isLoading } = useSponsors();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center bg-white border-t border-border">
        <Loader2 className="w-8 h-8 animate-spin text-[#8e160b]" />
      </div>
    );
  }

  if (!sponsors || sponsors.length === 0) return null;

  const elite = sponsors.filter(s => s.tier === 'Elite');
  const otherTiers = sponsors.filter(s => s.tier !== 'Elite');

  return (
    <section className="bg-white border-t border-[#eee]">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Elite Sponsors Section */}
        {elite.length > 0 && (
          <div className="py-16 md:py-20 border-b border-[#f0f0f0]">
             <div className="flex items-center justify-center gap-x-10 gap-y-8 flex-wrap">
                {elite.map((s) => (
                  <motion.a
                    key={s.id}
                    href={s.website_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="h-12 md:h-20 w-auto flex items-center justify-center px-4 transition-all duration-500 group"
                  >
                    {s.logo_url ? (
                      <img 
                        src={s.logo_url} 
                        alt={s.name} 
                        className="max-h-full max-w-full object-contain grayscale opacity-60 min-w-[110px] md:min-w-[170px] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                      />
                    ) : (
                      <span className="font-heading text-lg uppercase tracking-widest text-[#141b2b]/30">{s.name}</span>
                    )}
                  </motion.a>
                ))}
             </div>
          </div>
        )}

        {/* Other Partners Section (Combined prestige/signature/classic) */}
        {otherTiers.length > 0 && (
          <div className="py-12 md:py-16 border-b border-[#f0f0f0]">
            <div className="flex items-center justify-center gap-x-8 gap-y-6 flex-wrap">
              {otherTiers.map((s) => (
                <motion.a
                  key={s.id}
                  href={s.website_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="h-8 md:h-10 w-auto flex items-center justify-center px-4 transition-all duration-500 group"
                >
                  {s.logo_url ? (
                    <img 
                      src={s.logo_url} 
                      alt={s.name} 
                      className="max-h-full max-w-full object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    />
                  ) : (
                    <span className="font-heading text-xs uppercase tracking-widest text-[#141b2b]/20">{s.name}</span>
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* Social Bar Section */}
        <div className="py-12 flex items-center justify-center">
          <div className="flex items-center gap-6 md:gap-8">
            {[
              { Icon: Facebook, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Youtube, href: "#" },
              { Icon: Music2, href: "#" }, // TikTok
              { Icon: Linkedin, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a 
                key={i} 
                href={href} 
                className="text-[#141b2b] hover:text-[#8e160b] transition-all duration-300 transform hover:scale-110"
              >
                <Icon size={22} className={i === 2 ? "fill-current" : ""} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsBar;
