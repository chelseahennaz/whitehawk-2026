import { Phone, Mail, Loader2, Check, Star, Trophy, Crown, Zap, ExternalLink, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSponsors } from "@/hooks/useSupabase";
import type { Sponsor } from "@/hooks/useSupabase";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const SponsorTierSection = ({ 
  title, 
  sponsors, 
  tierType 
}: { 
  title: string; 
  sponsors: Sponsor[]; 
  tierType: "Elite" | "Prestige" | "Signature" | "Classic" 
}) => {
  if (sponsors.length === 0) return null;

  const gridClasses = {
    Elite: "grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto",
    Prestige: "grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto",
    Signature: "grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto",
    Classic: "grid-cols-3 md:grid-cols-6 gap-4 max-w-6xl mx-auto"
  };

  const cardClasses = {
    Elite: "p-8 border-2 border-club-gold/30 bg-club-dark/5 shadow-xl hover:border-club-gold transition-all duration-500",
    Prestige: "p-6 border border-border bg-card shadow-md hover:border-primary/50 transition-all",
    Signature: "p-4 border border-border bg-card shadow-sm hover:border-primary/30 transition-all",
    Classic: "p-3 border border-border/50 bg-muted/20 opacity-70 hover:opacity-100 hover:bg-muted/40 transition-all"
  };

  const logoBox = {
    Elite: "h-24 md:h-32 w-56 md:w-72",
    Prestige: "h-16 md:h-20 w-40 md:w-56",
    Signature: "h-12 md:h-16 w-32 md:w-44",
    Classic: "h-8 md:h-12 w-24 md:w-32"
  };

  return (
    <div className="mb-20">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px bg-border flex-1 max-w-[100px]" />
        <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
          {title}
        </h3>
        <div className="h-px bg-border flex-1 max-w-[100px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`grid ${gridClasses[tierType]}`}
      >
        {sponsors.map((s) => (
          <motion.div 
            key={s.id} 
            variants={itemVariants}
            className={`group rounded-2xl flex flex-col items-center justify-center text-center ${cardClasses[tierType]}`}
          >
            <a 
              href={s.website_url || "#"} 
              target="_blank" 
              rel="noreferrer"
              className={`w-full flex items-center justify-center ${logoBox[tierType]} transition-all duration-500`}
            >
              {s.logo_url ? (
                <img 
                  src={s.logo_url} 
                  alt={s.name} 
                  className="max-h-full max-w-full object-contain grayscale opacity-60 brightness-95 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500 ease-in-out" 
                />
              ) : (
                <span className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground">{s.name}</span>
              )}
            </a>
            {tierType === 'Elite' && (
              <div className="mt-6 flex flex-col items-center">
                 <span className="font-heading text-sm font-bold uppercase tracking-tight mb-1">{s.name}</span>
                 <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-club-gold font-bold">
                    <Crown size={10} /> Principal Partner
                 </div>
              </div>
            )}
            {s.website_url && tierType !== 'Classic' && (
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ExternalLink size={14} className="text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const Sponsor = () => {
  const { data: sponsors, isLoading } = useSponsors();

  const eliteSponsors = sponsors?.filter(s => s.tier === 'Elite') || [];
  const prestigeSponsors = sponsors?.filter(s => s.tier === 'Prestige') || [];
  const signatureSponsors = sponsors?.filter(s => s.tier === 'Signature') || [];
  const classicSponsors = sponsors?.filter(s => s.tier === 'Classic') || [];

  return (
    <>
      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-club-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://whitehawkfc.com/wp-content/uploads/2023/04/E8A6820.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 club-gradient opacity-90" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-club-gold mb-6">Partnership Opportunities</p>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase text-primary-foreground leading-tight tracking-tighter">
              Grow with <br className="hidden md:block" /> The Hawks
            </h1>
            <p className="font-body text-primary-foreground/70 max-w-2xl mx-auto mt-8 text-base md:text-lg">
              Join a vibrant community-focused club with a reach that extends far beyond the Enclosed Ground. 
              Let's create a partnership that delivers real value for your brand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Users className="text-primary" size={32} />, 
                title: "Vibrant Community", 
                desc: "Connect with thousands of passionate local fans and over 30 youth teams within our club ecosystem." 
              },
              { 
                icon: <Trophy className="text-primary" size={32} />, 
                title: "Digital Reach", 
                desc: "High engagement across social platforms and our automated website powered by real-time FWP data." 
              },
              { 
                icon: <Star className="text-primary" size={32} />, 
                title: "Brand Visibility", 
                desc: "From pitchside boards to front-of-shirt sponsorship, get your brand seen by visitors and media." 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-muted/30 border border-border/50"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="font-heading text-lg font-bold uppercase mb-4 tracking-tight">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners Section */}
      <section className="py-20 md:py-32 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase mb-4 tracking-tighter">
              Meet Our Partners
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              We are proud to work with businesses that share our commitment to community and sporting excellence.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <SponsorTierSection title="Elite Partners" sponsors={eliteSponsors} tierType="Elite" />
              <SponsorTierSection title="Prestige Partners" sponsors={prestigeSponsors} tierType="Prestige" />
              <SponsorTierSection title="Signature Partners" sponsors={signatureSponsors} tierType="Signature" />
              <SponsorTierSection title="Club Partners" sponsors={classicSponsors} tierType="Classic" />
            </>
          )}
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="font-heading text-sm uppercase tracking-widest text-primary mb-2">Join Us</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase">Sponsorship Packages</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "Bronze", 
                price: "£500", 
                icon: <Zap size={20} />, 
                features: ["Pitchside Advertising", "Website Logo", "2 Season Tickets", "Social Mentions"] 
              },
              { 
                name: "Silver", 
                price: "£1,500", 
                icon: <Star size={20} />, 
                popular: true,
                features: ["Double Pitchside Boards", "Quarter Page Program", "4 Season Tickets", "Website Header Logo"] 
              },
              { 
                name: "Gold", 
                price: "£5,000", 
                icon: <Trophy size={20} />, 
                features: ["Shirt Sleeve Sponsor", "Full Page Program", "10 Season Tickets", "Match Day Hospitality"] 
              },
              { 
                name: "Elite", 
                price: "£15,000", 
                icon: <Crown size={20} />, 
                features: ["Main Shirt Sponsor", "Dugout Branding", "Stand Naming Rights", "VVIP Boardroom Access"] 
              }
            ].map((pkg, idx) => (
              <div 
                key={idx} 
                className={`relative p-8 rounded-2xl border ${pkg.popular ? 'border-primary border-2 bg-primary/5' : 'border-border bg-card'} flex flex-col`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-heading uppercase px-3 py-1 rounded-full font-bold tracking-widest">
                    Most Popular
                  </span>
                )}
                <div className="mb-6 flex items-center justify-between">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pkg.popular ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}>
                      {pkg.icon}
                   </div>
                   <span className="font-heading text-xl font-bold">{pkg.price}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase mb-6">{pkg.name}</h3>
                <ul className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                       <Check size={14} className="text-primary shrink-0" />
                       {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full font-heading uppercase tracking-widest text-xs h-12" variant={pkg.popular ? "default" : "outline"}>
                   Request Brochure
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-club-dark relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/5 -skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase text-primary-foreground mb-6 tracking-tighter">
            Let's Talk <br className="md:hidden" /> Partnership
          </h2>
          <p className="font-body text-primary-foreground/70 max-w-xl mx-auto mb-10 text-lg">
            We'd love to chat about how a partnership with Whitehawk FC can work for your business. No hard sell — just a conversation about community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="tel:02045827336">
              <Button size="lg" className="h-16 px-10 font-heading uppercase tracking-widest text-sm gap-3 shadow-xl shadow-primary/20">
                <Phone size={18} /> 020 4582 7336
              </Button>
            </a>
            <a href="mailto:sponsor@whitehawkfc.com">
              <Button size="lg" variant="outline" className="h-16 px-10 font-heading uppercase tracking-widest text-sm gap-3 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Mail size={18} /> Email Us
              </Button>
            </a>
          </div>
          <p className="font-body text-xs text-primary-foreground/40 mt-10 tracking-widest uppercase">Speak with Kevin — Commercial Director</p>
        </div>
      </section>
    </>
  );
};

export default Sponsor;
