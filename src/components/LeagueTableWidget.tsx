import { useMemo } from "react";
import { useFWPLeagueTable, useFWPCompetitionFixtures } from "@/hooks/useFWP";
import { isMatchLive } from "@/lib/fwp";
import { Link } from "react-router-dom";

const WHK_ID = 468;

const LeagueTableWidget = () => {
  const { data: tableResponse, isLoading: tableLoading } = useFWPLeagueTable();
  const fullTable = tableResponse?.teams || [];
  const compId = tableResponse?.competition?.id || 0;
  
  const { data: fixtures = [] } = useFWPCompetitionFixtures(compId);

  // Identify live matches in the competition
  const liveMatchesMap = useMemo(() => {
    const scores = new Map<number, { homeScore: number, awayScore: number, homeTeamId: number, awayTeamId: number, homeTeamName: string, awayTeamName: string }>();
    fixtures.forEach(m => {
      const isLive = isMatchLive(m);
      if (isLive) {
        scores.set(m["home-team"].id, { 
          homeScore: m["home-team"].score || 0, 
          awayScore: m["away-team"].score || 0, 
          homeTeamId: m["home-team"].id, 
          awayTeamId: m["away-team"].id,
          homeTeamName: m["home-team"].name,
          awayTeamName: m["away-team"].name
        });
        scores.set(m["away-team"].id, { 
          homeScore: m["home-team"].score || 0, 
          awayScore: m["away-team"].score || 0, 
          homeTeamId: m["home-team"].id, 
          awayTeamId: m["away-team"].id,
          homeTeamName: m["home-team"].name,
          awayTeamName: m["away-team"].name
        });
      }
    });
    return scores;
  }, [fixtures]);

  const displayTable = useMemo(() => {
    if (!fullTable || fullTable.length === 0) return [];
    const whkIndex = fullTable.findIndex(r => r.id === WHK_ID);
    
    // If not found, show top 5
    if (whkIndex === -1) return fullTable.slice(0, 5);

    // Center logic: Try to have WHK at index 2 (the middle of 5)
    let start = whkIndex - 2;
    // Top 3 case: if WHK is pos 1, 2, or 3, start will be <= 0, clamp to 0
    if (start < 0) start = 0;
    
    let end = start + 5;
    // Bottom 3 case: if end exceeds table length, clamp end and shift start back
    if (end > fullTable.length) {
      end = fullTable.length;
      start = Math.max(0, end - 5);
    }
    
    return fullTable.slice(start, end);
  }, [fullTable]);

  return (
    <div style={{ padding: "60px 0", background: "#ffffff", borderTop: "1px solid #f0f0f0" }}>
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 pb-4">
          <div>
            <h2 className="font-heading text-4xl md:text-6xl text-[#141b2b] uppercase tracking-wider leading-none">
              Men's First Team League Table
            </h2>
            <div className="h-1 w-12 bg-club-gold mt-4" />
          </div>
        </div>
        
        <div className="bg-white border border-[#e5e5e5] rounded-none overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141b2b] text-white">
                  <th className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center w-12">#</th>
                  <th className="py-4 px-4 font-heading text-sm uppercase tracking-widest min-w-[140px] md:min-w-[200px]">Team</th>
                  <th className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">P</th>
                  <th className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">W</th>
                  <th className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">D</th>
                  <th className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">L</th>
                  <th className="hidden md:table-cell py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">F</th>
                  <th className="hidden md:table-cell py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">A</th>
                  <th className="hidden md:table-cell py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">+/-</th>
                  <th className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr><td colSpan={10} className="py-20 text-center text-muted-foreground font-heading text-sm uppercase tracking-widest animate-pulse">Loading Table Data…</td></tr>
                ) : displayTable.map(row => {
                  const isWhk = row.name === "Whitehawk" || row.id === WHK_ID;
                  return (
                    <tr 
                      key={row.id} 
                      className={`transition-colors border-b border-[#eee] ${
                        isWhk ? "bg-[#8e160b] text-white font-bold" : "hover:bg-[#f8f8f8] text-[#333]"
                      }`}
                    >
                      <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row.position}</td>
                      <td className="py-4 px-4 font-heading text-lg uppercase tracking-widest relative group">
                        <div className="flex items-center justify-between gap-x-2 w-full">
                          <span className="truncate">{row.name}</span>
                          {liveMatchesMap.has(row.id) && (() => {
                            const liveInfo = liveMatchesMap.get(row.id)!;
                            const isHome = liveInfo.homeTeamId === row.id;
                            const myScore = isHome ? liveInfo.homeScore : liveInfo.awayScore;
                            const oppScore = isHome ? liveInfo.awayScore : liveInfo.homeScore;
                            
                            let bgColor = "bg-[#d8a32a]"; // Draw
                            if (myScore > oppScore) bgColor = "bg-[#61a868]"; // Win
                            else if (myScore < oppScore) bgColor = "bg-[#ed3c45]"; // Loss
                            
                            return (
                              <span className={`px-2 py-0.5 rounded text-white text-sm md:text-base font-bold tabular-nums shrink-0 leading-none ${bgColor}`}>
                                {liveInfo.homeScore}-{liveInfo.awayScore}
                              </span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].played}</td>
                      <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].won}</td>
                      <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].drawn}</td>
                      <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].lost}</td>
                      <td className="hidden md:table-cell py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].for}</td>
                      <td className="hidden md:table-cell py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].against}</td>
                      <td className="hidden md:table-cell py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"]["goal-difference"] > 0 ? `+${row["all-matches"]["goal-difference"]}` : row["all-matches"]["goal-difference"]}</td>
                      <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["total-points"]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "32px", borderTop: "1px solid #e5e5e5" }}>
          <Link
            to="/standings"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              color: "#111",
              textDecoration: "none",
              borderTop: "1px solid #292929",
              borderBottom: "1px solid #292929",
              padding: "12px 16px 10px",
              minWidth: "250px",
              justifyContent: "center",
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: "24px",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontSize: "28px", lineHeight: "1" }}>→</span>
            <span>FULL STANDINGS</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeagueTableWidget;
