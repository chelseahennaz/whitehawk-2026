import { motion } from "framer-motion";
import { Calendar, Shield, Users, Clock, Mail, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

const HirePitch = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-[#0d1526] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-club-gold/20 text-club-gold border border-club-gold/30 font-body mb-6">
              <Construction size={12} className="animate-pulse" /> Exciting Upgrades Underway
            </span>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase leading-none tracking-tighter mb-6">
              Hire Our Pitch
            </h1>
            <p className="font-body text-white/70 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              We are currently transforming our main ground into a state-of-the-art 3G pitch facility, available for community and private hire very soon.
            </p>
            <div className="h-1.5 w-20 bg-club-gold mx-auto mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Intro & Coming Soon Details */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="font-heading text-xs uppercase tracking-widest text-[#8e160b] font-bold">New Facilities</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-black">
                State-of-the-Art 3G Football Pitch
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                As part of our commitment to the local community and the growth of football in East Brighton, we are installing a brand new, all-weather 3G playing surface at the Enclosed Ground. 
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Whether you are a local grassroots club looking for a regular training venue, hosting a corporate tournament, or running a soccer school, our new pitch will provide the perfect professional environment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-border rounded-3xl bg-slate-50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-club-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="font-heading text-xl font-bold uppercase text-black mb-4">Pitch Features</h3>
              <ul className="space-y-4">
                {[
                  { icon: Shield, title: "FA Approved Surface", desc: "Fully certified 3G turf designed for peak performance and player safety." },
                  { icon: Users, title: "Versatile Layouts", desc: "Can be configured for full 11-a-side matches or split for smaller sided games (5-a-side/7-a-side)." },
                  { icon: Clock, title: "Modern Floodlighting", desc: "Energy-efficient LED floodlights allowing for evening matches and late training sessions." },
                  { icon: Calendar, title: "Changing Rooms", desc: "Access to clean, secure changing rooms and hot showers on site." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-[#8e160b]/10 flex items-center justify-center text-[#8e160b] shrink-0 mt-0.5">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-black uppercase tracking-wide">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enquiry Call to Action */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-border/50 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-widest text-[#8e160b] font-bold mb-4">Register Interest</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase text-black mb-6">
            Join the Waiting List
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
            Bookings will open soon. Contact our commercial team today to register your interest, secure your training slot, or receive updates on the project completion.
          </p>
          <a
            href="mailto:commercial@whitehawkfc.com?subject=3G%20Pitch%20Hire%20Enquiry"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-[#8e160b] text-white rounded-full font-heading text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Mail size={16} /> Contact Commercial Team
          </a>
        </div>
      </section>
    </div>
  );
};

export default HirePitch;
