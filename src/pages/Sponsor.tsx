// Sponsor Page - Standard White & Borderless Redesign v1.2
import { Phone, Mail, Loader2, Check, Star, Trophy, Crown, Zap, ExternalLink, Users, Shield, Target } from "lucide-react";
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

  const logoHeight = {
    Elite: "h-24 md:h-32",
    Prestige: "h-16 md:h-20",
    Signature: "h-12 md:h-16",
    Classic: "h-10 md:h-12"
  };

  const containerMaxWidth = {
    Elite: "max-w-4xl",
    Prestige: "max-w-5xl",
    Signature: "max-w-5xl",
    Classic: "max-w-6xl"
  };

  return (
    <div className="mb-20">
      {tierType !== 'Elite' && (
        <div className="flex justify-center mb-12">
          <div className="h-px bg-border w-24" />
        </div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`flex items-center justify-center gap-x-12 gap-y-12 flex-wrap mx-auto ${containerMaxWidth[tierType]}`}
      >
        {sponsors.map((s) => (
          <motion.div 
            key={s.id} 
            variants={itemVariants}
            className={`group transition-all duration-500`}
          >
            <a 
              href={s.website_url || "#"} 
              target="_blank" 
              rel="noreferrer"
              className={`flex flex-col items-center justify-center ${logoHeight[tierType]} transition-all duration-500`}
            >
              {s.logo_url ? (
                <img 
                  src={s.logo_url} 
                  alt={s.name} 
                  className="max-h-full max-w-[280px] object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out" 
                />
              ) : (
                <span className="font-heading text-xs uppercase tracking-widest text-[#141b2b]/30">{s.name}</span>
              )}
            </a>
            
            {tierType === 'Elite' && (
              <div className="mt-8 flex flex-col items-center border-t border-border/40 pt-4 opacity-80 group-hover:opacity-100 transition-opacity">
                 <span className="font-heading text-sm font-bold uppercase tracking-tight mb-1 text-black">{s.name}</span>
                 <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-[#8e160b] font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-club-gold" /> Principal Partner
                 </div>
              </div>
            )}

            {tierType === 'Prestige' && (
               <div className="mt-4 opacity-0 group-hover:opacity-60 transition-opacity text-center">
                  <span className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground">{s.name}</span>
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

  const visibleSponsors = sponsors?.filter(s => s.is_visible !== false) || [];

  const eliteSponsors = visibleSponsors.filter(s => s.tier === 'Elite');
  const prestigeSponsors = visibleSponsors.filter(s => s.tier === 'Prestige');
  const signatureSponsors = visibleSponsors.filter(s => s.tier === 'Signature');
  const classicSponsors = visibleSponsors.filter(s => s.tier === 'Classic');

  return (
    <>
      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-white border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://thehawksfc.com/wp-content/uploads/2023/04/E8A6820.jpg')] bg-cover bg-center" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-[#8e160b] font-bold mb-6">Partnership Opportunities</p>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase text-black leading-tight tracking-tighter">
              Grow with <br className="hidden md:block" /> The Hawks
            </h1>
            <p className="font-body text-muted-foreground/80 max-w-2xl mx-auto mt-8 text-base md:text-xl leading-relaxed">
              Join a vibrant community-focused club with a reach that extends far beyond the Enclosed Ground. 
              Let's create a partnership that delivers real value for your brand.
            </p>
            <div className="h-2 w-24 bg-club-gold mx-auto mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-black">
            {[
              { 
                icon: <Users className="text-[#8e160b]" size={32} />, 
                title: "Vibrant Community", 
                desc: "Connect with thousands of passionate local fans and over 30 youth teams within our club ecosystem." 
              },
              { 
                icon: <Trophy className="text-[#8e160b]" size={32} />, 
                title: "Digital Reach", 
                desc: "High engagement across social platforms and our automated website powered by real-time FWP data." 
              },
              { 
                icon: <Star className="text-[#8e160b]" size={32} />, 
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
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-border/50 hover:border-[#8e160b]/30 transition-all"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="font-heading text-lg font-bold uppercase mb-4 tracking-tight">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 md:py-32 bg-[#141b2b] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="font-heading text-sm uppercase tracking-widest text-club-gold mb-2">Corporate Tiers</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white leading-none">Partnership Packages</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "Classic", 
                price: "£895", 
                subtitle: "+ VAT per season",
                extraFee: "Board manufacture & installation: £125 + VAT",
                icon: <Zap size={20} />, 
                features: [
                  "8ft pitchside advertising board",
                  "1 Complimentary Season Ticket (Worth £250)",
                  "Company logo and hyperlink on the Whitehawk FC website",
                  "Company logo featured in every home Matchday Programme",
                  "Access to the Sponsors Lounge throughout the season",
                  "Invitation to the annual Sponsors Evening"
                ] 
              },
              { 
                name: "Signature", 
                price: "£1,495", 
                subtitle: "+ VAT per season",
                extraFee: "Board manufacture & installation: £250 + VAT",
                icon: <Star size={20} />, 
                features: [
                  "16ft pitchside advertising board",
                  "2 Complimentary Season Tickets (Worth £500)",
                  "Company logo and hyperlink on the Whitehawk FC website",
                  "Company logo featured in every home Matchday Programme",
                  "Access to the Sponsors Lounge throughout the season",
                  "Invitation to the annual Sponsors Evening"
                ] 
              },
              { 
                name: "Prestige", 
                price: "£2,495", 
                subtitle: "+ VAT per season",
                extraFee: "Board manufacture & installation: £500 + VAT",
                icon: <Trophy size={20} />, 
                popular: true,
                features: [
                  "2 × 16ft pitchside advertising boards",
                  "4 Complimentary Season Tickets (Worth £1,000)",
                  "Company logo and hyperlink on the Whitehawk FC website",
                  "Company logo featured in every home Matchday Programme",
                  "Access to the Sponsors Lounge throughout the season",
                  "Half-page advert in every home Matchday Programme",
                  "Dedicated sponsor spotlight on social media",
                  "Featured business profile on the website",
                  "Invitation to the annual Sponsors Evening"
                ] 
              },
              { 
                name: "Elite", 
                price: "£3,995", 
                subtitle: "+ VAT per season",
                extraFee: "Board manufacture & installation: £1,000 + VAT",
                icon: <Crown size={20} />, 
                features: [
                  "4 × 16ft pitchside advertising boards",
                  "8 Complimentary Season Tickets (Worth £2,000)",
                  "Company logo and hyperlink on the Whitehawk FC website",
                  "Company logo featured in every home Matchday Programme",
                  "Access to the Sponsors Lounge throughout the season",
                  "Full-page advert in every home Matchday Programme",
                  "Match Sponsor for one home league fixture",
                  "Complimentary hospitality for up to 8 guests",
                  "Dedicated sponsor spotlight on social media",
                  "Premium business profile on the website",
                  "Complimentary signed first team shirt",
                  "Invitation to the annual Sponsors Evening"
                ] 
              }
            ].map((pkg, idx) => (
              <div 
                key={idx} 
                className={`relative p-8 rounded-2xl border ${pkg.popular ? 'border-[#8e160b] border-2 bg-[#8e160b]/10' : 'border-white/10 bg-white/5'} flex flex-col`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8e160b] text-white text-[10px] font-heading uppercase px-3 py-1 rounded-full font-bold tracking-widest">
                    Most Popular
                  </span>
                )}
                <div className="mb-6 flex items-center justify-between">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${pkg.popular ? 'bg-[#8e160b] text-white' : 'bg-white/10 text-white'}`}>
                      {pkg.icon}
                   </div>
                   <div className="text-right">
                     <span className="font-heading text-xl font-bold">{pkg.price}</span>
                     <div className="text-[9px] uppercase tracking-widest text-white/50">{pkg.subtitle}</div>
                   </div>
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase mb-2 text-white">{pkg.name}</h3>
                <p className="text-xs text-white/70 mb-6 font-medium">{pkg.extraFee}</p>
                <ul className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                       <Check size={14} className="text-club-gold shrink-0 mt-0.5" />
                       <span className="leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full font-heading uppercase tracking-widest text-xs h-12 ${pkg.popular ? 'bg-[#8e160b] hover:bg-[#8e160b]/90 text-white' : 'bg-white text-black hover:bg-white/90'}`} variant={pkg.popular ? "default" : "secondary"}>
                   Request Brochure
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners Section */}
      <section className="py-20 md:py-32 bg-white border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="font-heading text-5xl md:text-8xl font-bold uppercase mb-6 tracking-tighter text-black leading-none">
              Meet Our Partners
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              We are proud to work with businesses that share our commitment to community and sporting excellence. 
            </p>
            <div className="h-1.5 w-24 bg-club-gold mx-auto mt-10" />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#8e160b]" />
            </div>
          ) : (
            <>
              <SponsorTierSection title="" sponsors={eliteSponsors} tierType="Elite" />
              <SponsorTierSection title="" sponsors={prestigeSponsors} tierType="Prestige" />
              <SponsorTierSection title="" sponsors={signatureSponsors} tierType="Signature" />
              <SponsorTierSection title="" sponsors={classicSponsors} tierType="Classic" />
            </>
          )}
        </div>
      </section>

      {/* Matchday Impact Section */}
      <section className="py-20 md:py-32 bg-white text-black">
        <div className="container mx-auto px-4 text-center">
            <p className="font-heading text-sm uppercase tracking-widest text-[#8e160b] mb-4">Sponsor A Game</p>
            <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase mb-16 tracking-tighter text-black leading-none">
              Matchday <br /> Impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
               {[
                 {
                    icon: <Trophy size={24} className="text-[#8e160b]" />,
                    title: "Match Sponsor",
                    price: "£500 + VAT",
                    desc: "Become the principal sponsor for a home league fixture and enjoy the ultimate Whitehawk matchday experience.",
                    features: [
                      "Hospitality in The Trafalgar Terrace for up to 8 guests",
                      "Matchday programme front cover recognition",
                      "Full-page advertisement in the Matchday Programme",
                      "PA announcements before the match & at half-time",
                      "Presentation of the Player of the Match award",
                      "Company branding on matchday social media",
                      "Company logo on the digital match graphics",
                      "Team sheet branding",
                      "Presentation photograph for press & social media"
                    ]
                 },
                 {
                    icon: <Target size={24} className="text-[#8e160b]" />,
                    title: "Ball Sponsorship",
                    price: "£150",
                    desc: "Special mention in the boardroom and on social media, plus a signed match ball presentation photo.",
                    features: ["Boardroom Mention", "Signed Ball", "Presentation Photo"]
                 },
                 {
                    icon: <Shield size={24} className="text-[#8e160b]" />,
                    title: "Player Sponsorship",
                    price: "£250",
                    desc: "Individual kit sponsorship of your favorite Hawk. Includes program recognition and social mentions.",
                    features: ["Home/Away Shirt", "Program Name", "Player Event Invitation"]
                 }
               ].map((item, idx) => (
                 <div key={idx} className="p-10 bg-white border border-border rounded-2xl hover:border-[#8e160b]/30 transition-all group">
                    <div className="flex justify-between items-start mb-8">
                       <div className="p-3 bg-muted rounded-xl group-hover:bg-[#8e160b] group-hover:text-white transition-colors">{item.icon}</div>
                       <span className="font-heading text-2xl font-bold">{item.price}</span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold uppercase mb-4 text-black">{item.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">{item.desc}</p>
                    <ul className="space-y-3">
                       {item.features.map((f, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs uppercase tracking-widest font-heading font-medium text-muted-foreground">
                            <div className="h-1 w-1 bg-[#8e160b] rounded-full" /> {f}
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-white border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[#8e160b]/5 -skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase text-black mb-6 tracking-tighter leading-none">
            Secure Your <br className="md:hidden" /> Partnership
          </h2>
          <p className="font-body text-muted-foreground/80 max-w-xl mx-auto mb-12 text-lg md:text-xl">
            We'd love to chat about how a partnership with Whitehawk FC can work for your business. No hard sell — just a conversation about community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="tel:02045827336">
              <Button size="lg" className="bg-[#8e160b] hover:bg-[#8e160b]/90 text-white h-16 px-10 font-heading uppercase tracking-widest text-sm gap-3 shadow-xl shadow-[#8e160b]/20">
                <Phone size={18} /> 020 4582 7336
              </Button>
            </a>
            <a href="mailto:commercial@whitehawkfc.com">
              <Button size="lg" variant="outline" className="h-16 px-10 font-heading uppercase tracking-widest text-sm gap-3 border-[#8e160b]/30 text-[#8e160b] hover:bg-[#8e160b]/5">
                <Mail size={18} /> Email Us
              </Button>
            </a>
          </div>
          <p className="font-body text-[10px] text-muted-foreground uppercase mt-12 tracking-[0.3em]">Speak with our Commercial Manager</p>
          <div className="h-1.5 w-16 bg-club-gold mx-auto mt-8" />
        </div>
      </section>
    </>
  );
};

export default Sponsor;
