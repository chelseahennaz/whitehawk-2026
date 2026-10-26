import { motion } from "framer-motion";
import { ExternalLink, CalendarDays, Trophy, ListOrdered } from "lucide-react";
import { featuredMatchCentres } from "@/data/teamMatchCentres";

const WomenTeam = () => {
  const matchCentre = featuredMatchCentres.find(m => m.id === "women-match-centre");

  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2020-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">Football for All</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Whitehawk <br className="hidden md:block" /> Women
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              Our women's first team is a vital part of the club, competing at a high level and inspiring the next generation of female footballers in Brighton and beyond.
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
                Pioneering Progress
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground font-body leading-relaxed">
                <p>
                  Established with a mission to provide elite-level football for women in our community, Whitehawk Women has grown rapidly into a competitive force. We play our home games at the Enclosed Ground, sharing the same premium facilities as the men's first team.
                </p>
                <p className="mt-6">
                  Our focus is on creating a professional environment where players can excel, develop, and represent the Hawks with pride.
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2">Training</h3>
                  <p className="font-body text-sm text-muted-foreground">Tuesday & Thursday evenings at the Enclosed Ground.</p>
                </div>
                <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors">
                  <h3 className="font-heading text-xl font-bold uppercase mb-2">Matchdays</h3>
                  <p className="font-body text-sm text-muted-foreground">Sundays, 2:00 PM KO at the Enclosed Ground.</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 space-y-12">
               <div className="bg-[#141b2b] p-10 rounded-2xl text-white">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-4 tracking-tight">Match Centre</h3>
                  <p className="font-body text-sm text-gray-400 mb-8 leading-relaxed">
                    {matchCentre?.summary}
                  </p>
                  
                  <div className="space-y-4">
                    <a href={matchCentre?.resources.fixtures.href} target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group">
                      <div className="flex items-center gap-3">
                        <CalendarDays size={18} className="text-club-gold" />
                        <span className="font-heading uppercase text-sm tracking-wider">Fixtures</span>
                      </div>
                      <ExternalLink size={16} className="text-white/50 group-hover:text-white transition-colors" />
                    </a>
                    <a href={matchCentre?.resources.results.href} target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group">
                      <div className="flex items-center gap-3">
                        <Trophy size={18} className="text-club-gold" />
                        <span className="font-heading uppercase text-sm tracking-wider">Results</span>
                      </div>
                      <ExternalLink size={16} className="text-white/50 group-hover:text-white transition-colors" />
                    </a>
                    <a href={matchCentre?.resources.table.href} target="_blank" rel="noreferrer noopener" className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group">
                      <div className="flex items-center gap-3">
                        <ListOrdered size={18} className="text-club-gold" />
                        <span className="font-heading uppercase text-sm tracking-wider">League Table</span>
                      </div>
                      <ExternalLink size={16} className="text-white/50 group-hover:text-white transition-colors" />
                    </a>
                  </div>
               </div>

               <div className="p-10 border border-border/50 rounded-2xl">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-black">Contact</h3>
                  <p className="font-body text-sm text-muted-foreground mb-6">Interested in playing for or sponsoring the women's team?</p>
                  <a href="mailto:club@whitehawkfc.com" className="font-heading uppercase tracking-widest text-sm text-[#8e160b] hover:text-[#7a1309] flex items-center gap-2">
                    Enquire Now <div className="h-0.5 w-6 bg-club-gold" />
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WomenTeam;
