import { motion } from "framer-motion";

const U18Team = () => {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative text-black">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2100-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">The Future Hawks</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Whitehawk <br className="hidden md:block" /> Under 18s
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              Managed by Matt Dorn and competing in the Sussex County Football League (SCFL), our U18s bridge the gap between youth football and the senior squad, focusing on technical excellence, tactical understanding, and a clear pathway to the first team.
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
               <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-10">
                Building Tomorrow
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground font-body leading-relaxed">
                <p>
                  At Whitehawk FC, our U18 team is a critical component of our long-term strategy. We pride ourselves on creating an environment that challenges players to reach their potential, with several former U18s having progressed directly into our first-team squad.
                </p>
                 <p className="mt-6">
                   Competing in the Sussex County Football League under the management of Matt Dorn, our players experience a high level of competition, preparing them for the rigours of senior football.
                 </p>
              </div>

               <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 bg-[#8e160b]/5 border border-[#8e160b]/20 rounded-2xl">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2 text-[#8e160b]">Trials</h3>
                  <p className="font-body text-sm text-[#8e160b]/80">Trials for the 2025/26 season take place in early Summer. Registered Hawks Youth players are automatically considered.</p>
                </div>
                 <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2">Training</h3>
                  <p className="font-body text-sm text-muted-foreground">Monday evenings, 7:00 PM - 9:00 PM. Elite technical focus.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-12">
               <div className="bg-[#141b2b] p-10 rounded-2xl text-white">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight">Recent Match</h3>
                  <div className="border-b border-white/5 pb-6">
                    <p className="text-[10px] uppercase tracking-widest text-club-gold mb-1">Youth League · 12 Apr</p>
                    <div className="flex justify-between items-center text-sm font-heading mb-4">
                      <span>Horsham U18</span>
                      <span className="text-club-gold">1 - 2</span>
                      <span className="opacity-70">Whitehawk U18</span>
                    </div>
                  </div>
               </div>

               <div className="p-10 border border-border/50 rounded-2xl">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-black">Contact</h3>
                  <p className="font-body text-sm text-muted-foreground mb-6">Want to find out more about the U18 development pathway?</p>
                  <a href="mailto:club@whitehawkfc.com" className="font-heading uppercase tracking-widest text-sm text-[#8e160b] hover:text-[#7a1309] flex items-center gap-2 transition-colors">
                    Get in Touch <div className="h-0.5 w-6 bg-club-gold" />
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default U18Team;
