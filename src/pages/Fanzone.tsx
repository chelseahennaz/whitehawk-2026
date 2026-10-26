import { motion } from "framer-motion";
import { Music, Utensils, Beer, Users, Camera, Star, Heart, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Fanzone = () => {
  return (
    <>
      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-white border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2020-scaled.jpg')] bg-cover bg-center" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-[#8e160b] font-bold mb-6">The Hawks Matchday Experience</p>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase text-black leading-tight tracking-tighter">
               The <br className="hidden md:block" /> Fanzone
            </h1>
            <p className="font-body text-muted-foreground/80 max-w-2xl mx-auto mt-8 text-base md:text-xl leading-relaxed">
              Experience the most inclusive and vibrant fanzone in non-league football. Featuring craft beer from Bison Beer, local food, and the world‑famous Hawks atmosphere.
            </p>
            <div className="h-2 w-24 bg-club-gold mx-auto mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Utensils className="text-[#8e160b]" size={28} />,
                title: "Local Food",
                desc: "A rotation of Brighton's finest independent street food vendors every matchday."
              },
              {
                icon: <Beer className="text-[#8e160b]" size={28} />,
                title: "Craft Bar",
                desc: "Featuring local brews from UnBarred, Brooksteed and more. Real ale for real fans."
              },
              {
                icon: <Music className="text-[#8e160b]" size={28} />,
                title: "Live Music",
                desc: "Pre-match sets from local Brighton artists and DJs to get the ground jumping."
              },
              {
                icon: <Users className="text-[#8e160b]" size={28} />,
                title: "Family Zone",
                desc: "Dedicated space for younger fans with games, activities and a chance to meet the mascot."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/20 transition-all"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="font-heading text-xl font-bold uppercase mb-3 text-black">{feature.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      
      </section>

      {/* Bison Beer Partnership */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase text-black mb-8">Bison Beer x The Hawks Social</h2>
          <p className="font-body text-muted-foreground/80 max-w-2xl mx-auto text-base md:text-xl leading-relaxed">Whitehawk FC has partnered with Brighton & Hove brewhouse Bison Beer, who will be manning the bar at The Hawks Social.</p>
        </div>
      </section>

      {/* Atmosphere Section */}
      <section className="py-24 bg-[#141b2b] text-white relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-heading text-sm uppercase tracking-[0.3em] text-club-gold font-bold mb-6">More Than 90 Minutes</p>
              <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase mb-8 leading-none tracking-tighter">
                 Brighton&apos;s Best <br /> Kept Secret
              </h2>
              <p className="font-body text-lg opacity-80 leading-relaxed mb-8">
                The Enclosed Ground is famous for its atmosphere. We pride ourselves on being a club for everyone—no matter who you are or where you&apos;re from. Our fanzone is the heart of that community.
              </p>
              <div className="space-y-4">
                {[
                  "Award-winning matchday program",
                  "Inclusive, family-friendly environment",
                  "Independent merchandise stall",
                  "The 'Din' — Brighton's most vocal supporters"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Star size={16} className="text-club-gold" />
                    <span className="font-heading uppercase text-sm tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://thehawksfc.com/wp-content/uploads/2023/10/E8A3750-scaled.jpg" 
                alt="Hawks Fans" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b]/60 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visit Info */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase text-black mb-8 tracking-tighter">
              Planning Your Visit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-16">
              <div className="p-8 bg-muted/30 rounded-2xl border border-border/50">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#8e160b]/10 flex items-center justify-center text-[#8e160b]">
                       <Calendar size={20} />
                    </div>
                    <h4 className="font-heading text-lg font-bold uppercase">When to arrive</h4>
                 </div>
                 <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Our fanzone opens 2 hours before kick-off. Arrive early to soak up the atmosphere and grab the best food!
                 </p>
              </div>
              <div className="p-8 bg-muted/30 rounded-2xl border border-border/50">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#8e160b]/10 flex items-center justify-center text-[#8e160b]">
                       <MapPin size={20} />
                    </div>
                    <h4 className="font-heading text-lg font-bold uppercase">Where to find us</h4>
                 </div>
                 <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    The fanzone is located directly behind the main stand at the Enclosed Ground. Just follow the music!
                 </p>
              </div>
            </div>
            <div className="mt-16">
              <Button size="lg" className="bg-[#8e160b] hover:bg-[#8e160b]/90 text-white font-heading uppercase tracking-widest text-sm h-16 px-12 gap-3 shadow-xl shadow-[#8e160b]/20">
                 Get Match Tickets <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Fanzone;
