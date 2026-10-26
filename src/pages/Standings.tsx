import { useFWPLeagueTable, useFWPCompetitionFixtures } from "@/hooks/useFWP";
import { isMatchLive } from "@/lib/fwp";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const WHK_ID = 468;

const Standings = () => {
  const { data: tableResponse, isLoading: tableLoading } = useFWPLeagueTable();
  const leagueTable = tableResponse?.teams || [];
  const compId = tableResponse?.competition?.id || 0;
  
  const { data: fixtures = [] } = useFWPCompetitionFixtures(compId);

  // Identify live matches in the competition
  const liveMatchesMap = useMemo(() => {
    const scores = new Map<number, { homeScore: number, awayScore: number, homeTeamId: number, awayTeamId: number, homeTeamName: string, awayTeamName: string, status: string }>();
    
    fixtures.forEach(m => {
      const isLive = isMatchLive(m);
      
      if (isLive) {
        scores.set(m["home-team"].id, { 
          homeScore: m["home-team"].score || 0, 
          awayScore: m["away-team"].score || 0,
          homeTeamId: m["home-team"].id,
          awayTeamId: m["away-team"].id,
          homeTeamName: m["home-team"].name,
          awayTeamName: m["away-team"].name,
          status: m.status?.full || "Live"
        });
        scores.set(m["away-team"].id, { 
          homeScore: m["home-team"].score || 0, 
          awayScore: m["away-team"].score || 0,
          homeTeamId: m["home-team"].id,
          awayTeamId: m["away-team"].id,
          homeTeamName: m["home-team"].name,
          awayTeamName: m["away-team"].name,
          status: m.status?.full || "Live"
        });
      }
    });
    return scores;
  }, [fixtures]);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Page Header */}
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16 border-b border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight text-black leading-none mb-4">
            League Table
          </h1>
          <p className="font-heading text-2xl md:text-3xl font-bold text-muted-foreground uppercase">
            Isthmian Premier Division · 2026/27
          </p>
          <div className="h-1.5 w-24 bg-club-gold mx-auto mt-8" />
        </div>
      </section>

      {/* Standings Table Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white border border-[#e5e5e5] rounded-none overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#141b2b] text-white">
                    <th className="py-4 md:py-5 px-3 md:px-4 font-heading text-sm md:text-base uppercase tracking-widest text-center w-12 md:w-16">#</th>
                    <th className="py-4 md:py-5 px-4 md:px-6 font-heading text-sm md:text-base uppercase tracking-widest min-w-[180px] md:min-w-[240px]">Team</th>
                    <th className="py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">P</th>
                    <th className="py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">W</th>
                    <th className="py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">D</th>
                    <th className="py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">L</th>
                    <th className="hidden md:table-cell py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">F</th>
                    <th className="hidden md:table-cell py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">A</th>
                    <th className="hidden md:table-cell py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">+/-</th>
                    <th className="py-4 md:py-5 px-3 font-heading text-sm md:text-base uppercase tracking-widest text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {tableLoading ? (
                    <tr>
                      <td colSpan={10} className="py-32 text-center text-muted-foreground font-heading text-lg uppercase tracking-widest animate-pulse">
                        <Loader2 className="animate-spin text-[#8e160b] mx-auto mb-4" size={40} />
                        Syncing Official Standings...
                      </td>
                    </tr>
                  ) : (
                    leagueTable.map((row) => {
                      const isWhk = row.name === "Whitehawk" || row.id === WHK_ID;
                      const liveInfo = liveMatchesMap.get(row.id);

                      return (
                        <tr 
                          key={row.id} 
                          className={`transition-colors border-b border-[#eee] ${
                            isWhk ? "bg-[#8e160b] text-white font-bold" : "hover:bg-[#f8f8f8] text-[#333]"
                          }`}
                        >
                          <td className="py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row.position}</td>
                          <td className="py-4 md:py-5 px-4 md:px-6 font-heading text-xl md:text-2xl uppercase tracking-widest relative group">
                            <div className="flex items-center justify-between gap-x-2 w-full">
                              <span className="truncate">{row.name}</span>
                              {liveInfo && (() => {
                                const isHome = liveInfo.homeTeamId === row.id;
                                const myScore = isHome ? liveInfo.homeScore : liveInfo.awayScore;
                                const oppScore = isHome ? liveInfo.awayScore : liveInfo.homeScore;
                                
                                let bgColor = "bg-[#d8a32a]"; // Draw
                                if (myScore > oppScore) bgColor = "bg-[#61a868]"; // Win
                                else if (myScore < oppScore) bgColor = "bg-[#ed3c45]"; // Loss
                                
                                return (
                                  <span className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded text-white text-base md:text-lg font-bold tabular-nums shrink-0 leading-none ${bgColor}`}>
                                    {liveInfo.homeScore}-{liveInfo.awayScore}
                                  </span>
                                );
                              })()}
                            </div>
                          </td>
                          <td className="py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row["all-matches"].played}</td>
                          <td className="py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row["all-matches"].won}</td>
                          <td className="py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row["all-matches"].drawn}</td>
                          <td className="py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row["all-matches"].lost}</td>
                          <td className="hidden md:table-cell py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row["all-matches"].for}</td>
                          <td className="hidden md:table-cell py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row["all-matches"].against}</td>
                          <td className="hidden md:table-cell py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">
                            {row["all-matches"]["goal-difference"] > 0 ? `+${row["all-matches"]["goal-difference"]}` : row["all-matches"]["goal-difference"]}
                          </td>
                          <td className="py-4 md:py-5 px-3 text-center font-heading text-xl md:text-2xl tracking-widest">{row["total-points"]}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground font-body text-sm italic">
              Table data powered by Football Web Pages · Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Standings;
