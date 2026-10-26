import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface AcademyTeam {
  name: string;
  ageGroup: string;
  manager: string;
  league: string;
  additionalLeague?: string;
  note?: string;
  path: string;
}

const academyTeams: AcademyTeam[] = [
  {
    name: "Under 16s",
    ageGroup: "U16",
    manager: "Ian Jackson",
    league: "Div 1 MSYFL",
    path: "/teams/academy/u16",
  },
  {
    name: "Under 15s",
    ageGroup: "U15",
    manager: "John Nolan",
    league: "Div 2 MSYFL",
    path: "/teams/academy/u15",
  },
  {
    name: "Under 14s",
    ageGroup: "U14",
    manager: "Matt Weston",
    league: "Div 1 MSYFL",
    path: "/teams/academy/u14",
  },
  {
    name: "Under 13s",
    ageGroup: "U13",
    manager: "Danny Collins",
    league: "Div 2 MSYFL",
    path: "/teams/academy/u13",
  },
  {
    name: "Under 13s Red",
    ageGroup: "U13 Red",
    manager: "Andrew Joinson",
    league: "Div 1 MSYFL",
    additionalLeague: "JPL",
    path: "/teams/academy/u13-red",
  },
  {
    name: "Under 13s White",
    ageGroup: "U13 White",
    manager: "Nick Fogden",
    league: "Div 2 SSYFL",
    additionalLeague: "JPL",
    path: "/teams/academy/u13-white",
  },
  {
    name: "Under 12s",
    ageGroup: "U12",
    manager: "Jim Townsend",
    league: "Div 1 SSYFL",
    additionalLeague: "JPL",
    path: "/teams/academy/u12",
  },
  {
    name: "Under 7s / Under 8s",
    ageGroup: "U7 / U8",
    manager: "Karl Anscombe",
    league: "Crawley & District Youth League",
    note: "Playing up a year as U8s",
    path: "/teams/academy/u7",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const Academy = () => {
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
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">Whitehawk FC Youth</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Youth <br className="hidden md:block" /> Teams
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              Home to our youth teams from Under 7s through to Under 16s. Whitehawk Youth is where the next generation of Hawks learn, develop, and compete across Sussex and beyond.
            </p>
            <div className="h-2 w-24 bg-club-gold mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-4">
            Our Teams
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mb-16">
            Each of our youth teams competes in local and regional leagues, guided by dedicated FA-qualified coaches committed to player development.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {academyTeams.map((team, i) => (
              <motion.div
                key={team.path}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={cardVariants}
              >
                <Link
                  to={team.path}
                  className="group block p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/40 hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-[#8e160b]/5 border border-[#8e160b]/20 rounded-xl px-4 py-2">
                      <span className="font-heading text-xl font-bold text-[#8e160b] uppercase tracking-tight">
                        {team.ageGroup}
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-muted-foreground/40 group-hover:text-[#8e160b] group-hover:translate-x-1 transition-all mt-2"
                    />
                  </div>

                  <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-black mb-4">
                    {team.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs uppercase tracking-widest text-muted-foreground/60">Manager</span>
                      <span className="font-body text-sm text-black font-medium">{team.manager}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs uppercase tracking-widest text-muted-foreground/60">League</span>
                      <span className="font-body text-sm text-black font-medium">{team.league}</span>
                    </div>
                    {team.additionalLeague && (
                      <div className="flex items-center gap-2">
                        <span className="font-body text-xs uppercase tracking-widest text-muted-foreground/60">Also</span>
                        <span className="font-body text-sm text-black font-medium">{team.additionalLeague}</span>
                      </div>
                    )}
                    {team.note && (
                      <p className="font-body text-xs text-[#8e160b]/70 italic mt-2">{team.note}</p>
                    )}
                  </div>

                  <div className="h-0.5 w-0 group-hover:w-12 bg-club-gold mt-6 transition-all duration-500" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Info Section */}
      <section className="py-20 bg-[#141b2b]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-white">Join Whitehawk Youth</h3>
              <p className="font-body text-sm text-white/70 mb-8 leading-relaxed">
                Want your child to be part of Whitehawk Youth? We welcome new players at all age groups. Get in touch to find out about trials and training sessions.
              </p>
              <a
                href="mailto:club@whitehawkfc.com"
                className="bg-[#8e160b] text-white font-heading uppercase py-4 px-8 rounded-lg tracking-widest text-sm inline-block hover:bg-[#7a1309] transition-colors"
              >
                Contact Us
              </a>
            </div>
            <div>
              <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-white">Volunteering</h3>
              <p className="font-body text-sm text-white/70 mb-6 leading-relaxed">
                Our youth setup is powered by incredible volunteers — parents, coaches, and community members. If you'd like to get involved, we'd love to hear from you.
              </p>
              <div className="h-0.5 w-12 bg-club-gold" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Academy;
