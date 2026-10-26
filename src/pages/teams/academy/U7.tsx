import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AcademyU7 = () => {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative text-black">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2100-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">Whitehawk Youth</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Under 7s <br className="hidden md:block" /> / Under 8s
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              Our youngest Hawks! The U7/U8 team focuses on fun, friendship, and falling in love with football under the guidance of Karl Anscombe.
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
                <p>The Under 7s are our youngest squad at Whitehawk FC, and under the management of Karl Anscombe, they are playing up a year as U8s in the Crawley & District Youth League. This early exposure to competitive football gives our youngest players an incredible head start.</p>
                <p className="mt-6">At this age, the emphasis is firmly on enjoyment, developing basic skills, and building a love for the game. Training sessions are fun and engaging, with small-sided games helping players develop confidence with the ball.</p>
              </div>
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 bg-[#8e160b]/5 border border-[#8e160b]/20 rounded-2xl">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2 text-[#8e160b]">Manager</h3>
                  <p className="font-body text-sm text-[#8e160b]/80">Karl Anscombe</p>
                </div>
                <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2">League</h3>
                  <p className="font-body text-sm text-muted-foreground">Crawley & District Youth League (playing up as U8s)</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-12">
              <div className="p-10 border border-border/50 rounded-2xl">
                <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-black">Contact</h3>
                <p className="font-body text-sm text-muted-foreground mb-6">Want to find out more about the U7/U8 team?</p>
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

export default AcademyU7;
