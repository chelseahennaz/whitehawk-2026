// v1.1 - Force Refresh for Players & Staff Changes
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePlayers, usePersonnel, useSettings } from "@/hooks/useSupabase";
import { Loader2, Users, Shield } from "lucide-react";
import { useMemo } from "react";

const positionLabel: Record<string, string> = {
  GK: "Goalkeepers",
  DEF: "Defenders",
  MID: "Midfielders",
  FWD: "Forwards",
};

const Teams = () => {
  const { data: squad, isLoading: isLoadingSquad } = usePlayers("mens-first-team");
  const { data: staff, isLoading: isLoadingStaff } = usePersonnel("football");
  const { data: visibilitySettings, isLoading: isLoadingSettings } = useSettings("squad_visibility");
  
  const squadComingSoon = visibilitySettings?.value?.squad_coming_soon ?? false;
  const staffComingSoon = visibilitySettings?.value?.staff_coming_soon ?? false;
  
  const activeSquad = useMemo(() => {
    return squad?.filter(p => p.is_active) || [];
  }, [squad]);

  const grouped = useMemo(() => {
    if (!activeSquad.length) return [];
    return ["GK", "DEF", "MID", "FWD"].map((pos) => ({
      position: pos,
      label: positionLabel[pos],
      players: activeSquad.filter((p) => p.position === pos),
    })).filter(group => group.players.length > 0);
  }, [activeSquad]);

  const teamStaff = useMemo(() => {
    return staff?.filter(s => s.is_active) || [];
  }, [staff]);

  if (isLoadingSquad || isLoadingStaff || isLoadingSettings) {
    return (
      <div className="flex-1 flex items-center justify-center p-20 min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#8e160b]" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A1550-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">The Men's First Team</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Players <br className="hidden md:block" /> & Staff
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              Meet the players and backroom staff representing the Hawks.
            </p>
            <div className="h-2 w-24 bg-club-gold mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Squad Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {/* Players Section */}
            {squadComingSoon ? (
              <div className="group">
                <div className="flex items-center gap-4 mb-16 border-b border-border/50 pb-8 transition-colors group-hover:border-[#8e160b]/30">
                  <div className="p-3 bg-[#8e160b]/5 rounded-xl">
                    <Shield size={24} className="text-[#8e160b]" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
                    First Team Squad
                  </h2>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-full bg-[#141b2b] text-white p-12 md:p-16 border border-border/30 shadow-md relative overflow-hidden flex flex-col items-center justify-center text-center rounded-xl"
                >
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A1550-scaled.jpg')] bg-cover bg-center" />
                  <div className="relative z-10 max-w-lg space-y-6">
                    <div className="inline-flex p-4 rounded-full bg-[#8e160b]/10 text-club-gold border border-club-gold/20 mb-2">
                      <Shield size={48} className="animate-pulse" />
                    </div>
                    <h3 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
                      Squad Coming Soon
                    </h3>
                    <p className="font-body text-sm text-gray-400 leading-relaxed">
                      We are currently finalizing our playing squad for the upcoming season. Check back soon to meet the new signings and returning players representing the Hawks!
                    </p>
                    <div className="h-1.5 w-16 bg-club-gold mx-auto mt-4" />
                  </div>
                </motion.div>
              </div>
            ) : (
              grouped.map((group, groupIdx) => (
                <div key={group.position} className="group">
                  <div className="flex items-center gap-4 mb-16 border-b border-border/50 pb-8 transition-colors group-hover:border-[#8e160b]/30">
                    <div className="p-3 bg-[#8e160b]/5 rounded-xl">
                      <Shield size={24} className="text-[#8e160b]" />
                    </div>
                    <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
                      {group.label}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-16 md:gap-24">
                    {group.players.map((player, playerIdx) => (
                      <motion.div
                        key={player.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: playerIdx * 0.04, duration: 0.4 }}
                        className="group"
                      >
                        <Link to={`/player/${player.id}`} className="block">
                          {/* Photo Container */}
                          <div className="relative w-full aspect-[3/4] mb-5 overflow-hidden rounded-xl bg-gradient-to-b from-muted/40 to-muted/10 border border-border/40 group-hover:border-[#8e160b]/30 transition-all duration-500">
                            {player.photo_url ? (
                              <>
                                <img
                                  src={player.photo_url}
                                  alt={player.name}
                                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#141b2b] to-[#1f2940]">
                                <span className="font-heading text-4xl md:text-5xl font-bold text-white/15 group-hover:text-white/25 transition-colors duration-500">
                                  {player.name.split(" ").map(n => n[0]).join("")}
                                </span>
                              </div>
                            )}
                            {/* Stats badge overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                              <span className="inline-block bg-[#8e160b] text-white font-heading text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-md">
                                {player.appearances} Apps · {player.goals} Goals
                              </span>
                            </div>
                          </div>

                          {/* Name & Role */}
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-base md:text-lg font-bold uppercase tracking-tight text-black leading-tight group-hover:text-[#8e160b] transition-colors duration-300">
                              {player.name}
                            </h3>
                            {player.is_captain && (
                              <span className="bg-club-gold text-white text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-sm" title="Captain">C</span>
                            )}
                          </div>
                          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-widest font-medium mt-1 leading-relaxed">
                            {player.position}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
            {/* Staff Section */}
            {staffComingSoon ? (
              <div className="group">
                <div className="flex items-center gap-4 mb-16 border-b border-border/50 pb-8 transition-colors group-hover:border-[#8e160b]/30">
                  <div className="p-3 bg-[#8e160b]/5 rounded-xl">
                    <Users size={24} className="text-[#8e160b]" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
                    Management Team
                  </h2>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-full bg-[#141b2b] text-white p-12 md:p-16 border border-border/30 shadow-md relative overflow-hidden flex flex-col items-center justify-center text-center rounded-xl"
                >
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A1550-scaled.jpg')] bg-cover bg-center" />
                  <div className="relative z-10 max-w-lg space-y-6">
                    <div className="inline-flex p-4 rounded-full bg-[#8e160b]/10 text-club-gold border border-club-gold/20 mb-2">
                      <Users size={48} className="animate-pulse" />
                    </div>
                    <h3 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
                      Staff Coming Soon
                    </h3>
                    <p className="font-body text-sm text-gray-400 leading-relaxed">
                      Our coaching staff and backroom team details are being updated for the new season. Stay tuned for official announcements!
                    </p>
                    <div className="h-1.5 w-16 bg-club-gold mx-auto mt-4" />
                  </div>
                </motion.div>
              </div>
            ) : (
              teamStaff.length > 0 && (
                <div className="group">
                  <div className="flex items-center gap-4 mb-16 border-b border-border/50 pb-8 transition-colors group-hover:border-[#8e160b]/30">
                    <div className="p-3 bg-[#8e160b]/5 rounded-xl">
                      <Users size={24} className="text-[#8e160b]" />
                    </div>
                    <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
                      Management Team
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-16 md:gap-24">
                    {teamStaff.map((staff, staffIdx) => (
                      <motion.div
                        key={staff.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: staffIdx * 0.04, duration: 0.4 }}
                        className="group"
                      >
                        <Link to={`/staff/${staff.id}`} className="block">
                        {/* Photo Container */}
                        <div className="relative w-full aspect-[3/4] mb-5 overflow-hidden rounded-xl bg-gradient-to-b from-muted/40 to-muted/10 border border-border/40 group-hover:border-[#8e160b]/30 transition-all duration-500">
                          {staff.image_url ? (
                            <>
                              <img
                                src={staff.image_url}
                                alt={staff.name}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                              />
                              {/* Gradient overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#141b2b] to-[#1f2940]">
                              <span className="font-heading text-4xl md:text-5xl font-bold text-white/15 group-hover:text-white/25 transition-colors duration-500">
                                {staff.name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                          )}
                          {/* Role badge overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <span className="inline-block bg-[#8e160b] text-white font-heading text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-md">
                              {staff.role}
                            </span>
                          </div>
                        </div>

                        {/* Name & Role */}
                        <h3 className="font-heading text-base md:text-lg font-bold uppercase tracking-tight text-black leading-tight group-hover:text-[#8e160b] transition-colors duration-300">
                          {staff.name}
                        </h3>
                        <p className="font-body text-[11px] text-muted-foreground uppercase tracking-widest font-medium mt-1 leading-relaxed">
                          {staff.role}
                        </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#141b2b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2020-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase mb-6 leading-none tracking-tighter">
              One Club. <br /> One Community.
            </h2>
            <div className="h-1 w-24 bg-club-gold mx-auto" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Teams;
