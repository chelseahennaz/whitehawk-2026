import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AcademyU16 = () => {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative text-black">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2100-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">Whitehawk Youth</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Under <br className="hidden md:block" /> 16s
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              The final step before the U18 development squad. Our U16s compete in MSYFL Division 1 under Ian Jackson, honing their skills for the next level.
            </p>
            <div className="h-2 w-24 bg-club-gold mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            <div className="lg:col-span-7">
              <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-10">About the Team</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground font-body leading-relaxed">
                <p>The Under 16s represent the final step before the U18 development squad and are a critical part of Whitehawk's player pathway. Competing in Division 1 of the Mid Sussex Youth Football League under Ian Jackson, the standards are high and the expectations match.</p>
                <p className="mt-6">Players at this level are working towards a potential pathway into the Whitehawk U18s and, ultimately, the first team. The coaching focuses on preparing players physically, technically, and mentally for the demands of senior football.</p>
              </div>
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 bg-[#8e160b]/5 border border-[#8e160b]/20 rounded-2xl">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2 text-[#8e160b]">Manager</h3>
                  <p className="font-body text-sm text-[#8e160b]/80">Ian Jackson</p>
                </div>
                <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2">League</h3>
                  <p className="font-body text-sm text-muted-foreground">Division 1 MSYFL</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-12">
              <div className="p-10 border border-border/50 rounded-2xl">
                <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-black">Contact</h3>
                <p className="font-body text-sm text-muted-foreground mb-6">Want to find out more about the U16 team?</p>
                <a href="mailto:club@whitehawkfc.com" className="font-heading uppercase tracking-widest text-sm text-[#8e160b] hover:text-[#7a1309] flex items-center gap-2 transition-colors">
                  Get in Touch <div className="h-0.5 w-6 bg-club-gold" />
                </a>
              </div>
              <div className="p-10 bg-[#141b2b] rounded-2xl text-white">
                <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight">Youth Hub</h3>
                <p className="font-body text-sm text-white/70 mb-6">View all of our youth teams and find out how to get involved.</p>
                <Link to="/teams/academy" className="font-heading uppercase tracking-widest text-sm text-club-gold hover:text-white flex items-center gap-2 transition-colors">
                  View All Teams <div className="h-0.5 w-6 bg-club-gold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AcademyU16;
