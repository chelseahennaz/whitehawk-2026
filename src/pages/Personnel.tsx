import { motion } from "framer-motion";
import { usePersonnel } from "@/hooks/useSupabase";
import { Briefcase, Shield, Settings, Users, Megaphone, Loader2, Mail } from "lucide-react";
import { useMemo } from "react";

const deptMeta: Record<string, { icon: any; accent: string; description: string }> = {
  "Club Leadership": {
    icon: <Briefcase size={20} />,
    accent: "from-[#8e160b] to-[#c22b1a]",
    description: "The leadership team guiding Whitehawk FC’s vision and strategic direction.",
  },
  "Club Officers": {
    icon: <Shield size={20} />,
    accent: "from-[#141b2b] to-[#2a3550]",
    description: "Senior officials representing the administration, heritage and identity of the club.",
  },
  "Commercial, Media & Events": {
    icon: <Megaphone size={20} />,
    accent: "from-[#8e160b] to-[#c22b1a]",
    description: "Supporting the club’s commercial growth, communications, events and engagement.",
  },
  "Club & Ground Operations": {
    icon: <Settings size={20} />,
    accent: "from-[#141b2b] to-[#2a3550]",
    description: "Keeping the club and the Enclosed Ground running smoothly.",
  },
  "Matchday Operations": {
    icon: <Users size={20} />,
    accent: "from-[#8e160b] to-[#c22b1a]",
    description: "Delivering safe, welcoming and well-organised matchdays at the Enclosed Ground.",
  },
  "Club Ambassadors": {
    icon: <Shield size={20} />,
    accent: "from-[#141b2b] to-[#2a3550]",
    description: "Representing Whitehawk FC and helping promote the club within the wider community.",
  },
};

const Personnel = () => {
  const { data: personnel, isLoading } = usePersonnel("club");

  const groupedPersonnel = useMemo(() => {
    if (!personnel) return {};
    return personnel.reduce((acc: any, member) => {
      if (!acc[member.department]) {
        acc[member.department] = [];
      }
      acc[member.department].push(member);
      return acc;
    }, {});
  }, [personnel]);

  const departments = useMemo(() => {
    if (!groupedPersonnel) return [];
    const order = [
      "Club Leadership",
      "Club Officers",
      "Commercial, Media & Events",
      "Club & Ground Operations",
      "Matchday Operations",
      "Club Ambassadors"
    ];
    return Object.keys(groupedPersonnel).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [groupedPersonnel]);

  return (
    <>
      {/* Hero Header */}
      <section className="bg-[#141b2b] pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden relative text-white">
        <div className="absolute inset-0 opacity-[0.08] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A1550-scaled.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#141b2b]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 font-heading text-sm uppercase tracking-[0.4em] font-bold text-club-gold">Behind the Scenes</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-[0.9] text-white md:text-9xl tracking-tighter">
              Club <br /> Personnel
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-white/60 leading-relaxed">
              Meet the dedicated team working behind the scenes at the Enclosed Ground to keep Whitehawk FC moving forward on and off the pitch.
            </p>
            <div className="flex items-center gap-4 mt-10">
              <div className="h-1.5 w-16 bg-club-gold rounded-full" />
              <div className="h-1.5 w-8 bg-club-gold/40 rounded-full" />
              <div className="h-1.5 w-4 bg-club-gold/20 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Personnel Grid */}
      <section className="py-20 md:py-28 bg-white min-h-[400px]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#8e160b]" />
              <p className="font-heading uppercase tracking-widest text-xs">Loading Personnel...</p>
            </div>
          ) : (
            <div className="space-y-28">
              {departments.map((deptName, deptIdx) => {
                const meta = deptMeta[deptName] || {
                  icon: <Users size={20} />,
                  accent: "from-[#8e160b] to-[#c22b1a]",
                  description: "",
                };
                const members = groupedPersonnel[deptName]?.filter((m: any) => m.is_active) || [];
                
                if (members.length === 0) return null;

                return (
                  <motion.div
                    key={deptName}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: deptIdx * 0.05 }}
                  >
                    {/* Department Header */}
                    <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 mb-14">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.accent} text-white`}>
                            {meta.icon}
                          </div>
                          <span className="font-heading text-[10px] uppercase tracking-[0.25em] text-[#8e160b] font-extrabold">
                            Department
                          </span>
                        </div>
                        <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tighter text-black leading-[0.9]">
                          {deptName}
                        </h2>
                      </div>
                      {meta.description && (
                        <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed pb-1">
                          {meta.description}
                        </p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-[#8e160b]/30 via-border/50 to-transparent mb-14" />

                    {/* Personnel Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-16 md:gap-24">
                      {members.map((member: any, memberIdx: number) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: memberIdx * 0.04, duration: 0.4 }}
                          className="group cursor-default"
                        >
                          {/* Photo Container */}
                          <div className="relative w-full aspect-[3/4] mb-5 overflow-hidden rounded-xl bg-gradient-to-b from-muted/40 to-muted/10 border border-border/40 group-hover:border-[#8e160b]/30 transition-all duration-500">
                            {member.image_url ? (
                              <>
                                <img
                                  src={member.image_url}
                                  alt={member.name}
                                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#141b2b] to-[#1f2940]">
                                <span className="font-heading text-4xl md:text-5xl font-bold text-white/15 group-hover:text-white/25 transition-colors duration-500">
                                  {member.name.split(" ").map((n: string) => n[0]).join("")}
                                </span>
                              </div>
                            )}

                            {/* Honorary badge overlay */}
                            {member.is_honorary && (
                              <div className="absolute top-3 right-3 z-10">
                                <span className="inline-block bg-amber-500 text-white font-heading text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm border border-amber-400">
                                  Honorary
                                </span>
                              </div>
                            )}

                            {/* Role badge overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                              <span className="inline-block bg-[#8e160b] text-white font-heading text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-md">
                                {member.role}
                              </span>
                            </div>
                          </div>

                          {/* Name & Role */}
                          <h3 className="font-heading text-base md:text-lg font-bold uppercase tracking-tight text-black leading-tight group-hover:text-[#8e160b] transition-colors duration-300">
                            {member.name}
                          </h3>
                          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-widest font-medium mt-1 leading-relaxed">
                            {member.role}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-28 bg-[#141b2b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2020-scaled.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-club-gold to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-club-gold font-bold mb-6">Get Involved</p>
              <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase mb-8 leading-[0.85] tracking-tighter">
                The Engine <br /> Room
              </h2>
              <p className="font-body text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-12">
                Passionate about the club? We are always looking for volunteers to help on matchdays and across our community projects. Be part of something special.
              </p>
              <a
                href="mailto:club@whitehawkfc.com"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8e160b] to-[#b71c1c] text-white font-heading uppercase py-4 px-10 rounded-xl tracking-widest text-sm hover:from-[#7a1309] hover:to-[#9a1818] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#8e160b]/20"
              >
                <Mail size={16} />
                Volunteer With Us
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Personnel;
