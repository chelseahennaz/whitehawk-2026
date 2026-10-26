import { motion } from "framer-motion";
import { Coffee, GlassWater, Music, Utensils, Mail, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const HireClubhouse = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-[#0d1526] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-club-gold font-bold mb-6">Venue Hire</p>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase leading-none tracking-tighter mb-6">
              Hire Our Clubhouse
            </h1>
            <p className="font-body text-white/70 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Looking for a unique, spacious venue with a fully licensed bar and food options for your next party, meeting, or event?
            </p>
            <div className="h-1.5 w-20 bg-club-gold mx-auto mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="font-heading text-xs uppercase tracking-widest text-[#8e160b] font-bold">The Perfect Venue</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-black">
                Versatile Space for Any Event
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                The Whitehawk FC clubhouse is located at the The Enclosed Ground in East Brighton Park. Surrounded by nature yet easily accessible, our clubhouse offers a flexible indoor venue space suitable for a wide range of functions.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Whether you are celebrating a birthday, staging a wedding reception, holding a business meeting, organizing community sessions, or hosting a wake, we offer a welcoming atmosphere, comfortable seating, and first-class services.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-border rounded-3xl bg-slate-50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#8e160b]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="font-heading text-xl font-bold uppercase text-black mb-4">Venue Features</h3>
              <ul className="space-y-4">
                {[
                  { icon: GlassWater, title: "Fully Licensed Bar", desc: "A well-stocked bar featuring draft beers, ales, wines, spirits, and soft drinks at competitive prices." },
                  { icon: Utensils, title: "Food & Catering", desc: "Flexible food options including hot/cold buffet catering, matchday style kitchen food, or external caterer access." },
                  { icon: Users, title: "Capacity up to 120 Guests", desc: "Ample room for dancing, dining, or presentations, with customizable table layouts and seating." },
                  { icon: Music, title: "Sound System & Tech", desc: "Equipped with speakers, projector screens, flat screen TVs, and space for a live DJ or acoustic performance." }
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

      {/* Catering Details */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl font-bold uppercase text-black mb-4">Food & Bar Catering</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              We work with you to craft the perfect refreshments menu for your guests. From casual finger food to hot meals, we can cater to dietary requirements.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Finger Buffet", desc: "Assorted sandwiches, wraps, light bites, and classic party favorites. Perfect for casual birthday parties and networking." },
              { title: "Licensed Bar Service", desc: "Fully staffed bar serving popular lagers, local craft beer, premium spirits, prosecco, and non-alcoholic choices." },
              { title: "Custom Hot Catering", desc: "Coordinated catering, offering everything from artisan burgers and chips to hot pies and tailored dinner setups." }
            ].map((menu, idx) => (
              <div key={idx} className="p-6 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-heading text-base font-bold text-black uppercase mb-2">{menu.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{menu.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form CTA */}
      <section className="py-16 md:py-24 text-center bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-widest text-[#8e160b] font-bold mb-4">Get In Touch</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase text-black mb-6">
            Book the Clubhouse
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
            Get in touch to check availability, schedule a viewing, or get a custom venue hire quote. Our volunteers will get back to you within a few business days.
          </p>
          <a
            href="mailto:events@whitehawkfc.com?subject=Clubhouse%20Hire%20Enquiry"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-[#8e160b] text-white rounded-full font-heading text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Mail size={16} /> Enquire About Clubhouse Hire
          </a>
        </div>
      </section>
    </div>
  );
};

export default HireClubhouse;
