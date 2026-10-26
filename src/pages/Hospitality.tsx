import { motion } from "framer-motion";
import { Coffee, Trophy, User, Home, Mail, Phone, ExternalLink, Star, Crown, Zap, Tv, Wine, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hospitality = () => {
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
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-[#8e160b] font-bold mb-6">Premium Experiences</p>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase text-black leading-tight tracking-tighter">
              The Box <br className="hidden md:block" /> & Terrace
            </h1>
            <p className="font-body text-muted-foreground/80 max-w-2xl mx-auto mt-8 text-base md:text-xl leading-relaxed">
              Experience the Enclosed Ground in unmatched style. From the buzz of matchday hospitality to hosting your own private event, our newly renovated boardroom is the heart of the club.
            </p>
            <div className="h-2 w-24 bg-club-gold mx-auto mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Boardroom Photo Banner */}
      <section className="relative w-full overflow-hidden" style={{ height: "60vh", minHeight: "400px" }}>
        <img
          src="/boardroom.jpg"
          alt="Hawks Boardroom & Terrace overlooking the pitch"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 text-center text-white">
          <p className="font-heading text-xs uppercase tracking-[0.4em] text-club-gold mb-2">The Hawks Boardroom</p>
          <p className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tighter">Premium Views. Unmatched Atmosphere.</p>
        </div>
      </section>

      {/* Matchday Hospitality */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-8 leading-none">
                Matchday <br /> Hospitality
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground font-body leading-relaxed mb-12">
                <p>
                  Join us in the revamped Hawks Boardroom for a matchday experience like no other. Whether you're booking as an individual or securing the entire box for your group, you'll enjoy a premium atmosphere overlooking the pitch.
                </p>
                <p className="mt-4">
                  Our private terrace provides the best view in the ground, while inside, our wall-mounted screens keep you updated with live scores and club sponsors in a dedicated media environment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { icon: <Utensils size={20} />, text: "Matchday Buffet or Two-Course Meal (by request)" },
                   { icon: <Tv size={20} />, text: "Live Scores & Media on TVs" },
                   { icon: <Wine size={20} />, text: "Private Bar" },
                   { icon: <Home size={20} />, text: "Exclusive Terrace Access" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <div className="p-2 bg-[#8e160b]/5 text-[#8e160b] rounded-lg">{item.icon}</div>
                      <span className="font-heading text-sm uppercase tracking-wide font-bold">{item.text}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="lg:col-span-5">
               <div className="p-10 bg-[#141b2b] rounded-2xl text-white shadow-2xl">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-white border-b border-white/10 pb-4">Book For Saturday</h3>
                  <div className="space-y-6 mb-10">
                     <div className="flex justify-between items-center">
                        <span className="font-body text-sm opacity-70">Individual Booking</span>
                        <span className="font-heading text-xl font-bold">Contact for pricing</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-body text-sm opacity-70">Private Box (Up to 15)</span>
                        <span className="font-heading text-xl font-bold text-club-gold">Contact for pricing</span>
                     </div>
                  </div>
                  <a href="mailto:events@whitehawkfc.com" className="block w-full bg-[#8e160b] text-white font-heading uppercase py-4 rounded-lg tracking-widest text-sm text-center hover:bg-[#7a1309] transition-colors shadow-lg shadow-black/20">
                    Book Matchday Now
                  </a>
                  <p className="text-center font-body text-[10px] uppercase tracking-widest mt-6 opacity-40 italic">Incl. Match Ticket & Program</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Hire */}
      <section className="py-24 bg-[#8e160b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2100-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-heading text-sm uppercase tracking-[0.3em] text-club-gold font-bold mb-6">Non-Matchday</p>
              <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase mb-8 leading-none tracking-tighter">
                Hire Our <br /> Box
              </h2>
              <p className="font-body text-lg md:text-xl opacity-90 leading-relaxed mb-10">Looking for a unique venue for your next event? The boardroom and clubroom are available for private hire across Brighton. Hire for meetings or events. Can seat 16 people more if standing. We provide a flexible space with a fully licensed bar.</p>
              <div className="h-1 w-24 bg-club-gold mb-12" />
              <div className="flex flex-wrap gap-4">
                <a href="mailto:events@whitehawkfc.com">
                  <Button size="lg" className="bg-white text-[#8e160b] hover:bg-white/90 font-heading uppercase tracking-widest text-xs h-14 px-8">
                     Enquire for Hire
                  </Button>
                </a>
                <div className="flex items-center gap-4 text-white/80 font-body text-sm px-4">
                   <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                      <Tv size={16} />
                   </div>
                   Full Media & AV Setup
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-white/10 transition-colors">
                  <h4 className="font-heading text-2xl font-bold uppercase mb-2">Parties</h4>
                  <p className="font-body text-[10px] uppercase tracking-widest opacity-60">Fully Licensed Bar</p>
               </div>
               <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center mt-12 group hover:bg-white/10 transition-colors">
                  <h4 className="font-heading text-2xl font-bold uppercase mb-2">Meetings</h4>
                  <p className="font-body text-[10px] uppercase tracking-widest opacity-60">WIFI & AV Included</p>
               </div>
               <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center -mt-12 group hover:bg-white/10 transition-colors">
                  <h4 className="font-heading text-2xl font-bold uppercase mb-2">Functions</h4>
                  <p className="font-body text-[10px] uppercase tracking-widest opacity-60">Bespoke Catering</p>
               </div>
               <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center group hover:bg-white/10 transition-colors">
                  <h4 className="font-heading text-2xl font-bold uppercase mb-2">Wakes</h4>
                  <p className="font-body text-[10px] uppercase tracking-widest opacity-60">Peaceful Environment</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase text-black mb-6 tracking-tighter leading-none">
            Get in <br className="md:hidden" /> Touch
          </h2>
          <p className="font-body text-muted-foreground/80 max-w-xl mx-auto mb-12 text-lg md:text-xl">
             We&apos;d love to host you at the Enclosed Ground. Contact our commercial team for availability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="tel:02045827336">
              <Button size="lg" className="bg-[#8e160b] hover:bg-[#8e160b]/90 text-white h-16 px-10 font-heading uppercase tracking-widest text-sm gap-3 shadow-xl shadow-[#8e160b]/20">
                <Phone size={18} /> 020 4582 7336
              </Button>
            </a>
            <a href="mailto:events@whitehawkfc.com">
              <Button size="lg" variant="outline" className="h-16 px-10 font-heading uppercase tracking-widest text-sm gap-3 border-[#8e160b]/30 text-[#8e160b] hover:bg-[#8e160b]/5 transition-colors">
                <Mail size={18} /> Email Us
              </Button>
            </a>
          </div>
          <div className="h-1.5 w-16 bg-club-gold mx-auto mt-12" />
        </div>
      </section>
    </>
  );
};

export default Hospitality;
