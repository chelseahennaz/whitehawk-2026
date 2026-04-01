import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Trophy, Loader2, ChevronRight, LayoutGrid, List } from "lucide-react";
import { useFWPFixtures, useFWPLeagueTable } from "@/hooks/useFWP";
import { format, parseISO, getMonth } from "date-fns";
import type { FWPFixture } from "@/lib/fwp";
import { motion, AnimatePresence } from "framer-motion";

const MONTHS = [
  { name: "ALL SEASON", value: "all" },
  { name: "JUL", value: 6 },
  { name: "AUG", value: 7 },
  { name: "SEP", value: 8 },
  { name: "OCT", value: 9 },
  { name: "NOV", value: 10 },
  { name: "DEC", value: 11 },
  { name: "JAN", value: 0 },
  { name: "FEB", value: 1 },
  { name: "MAR", value: 2 },
  { name: "APR", value: 3 },
  { name: "MAY", value: 4 },
  { name: "JUN", value: 5 },
];

const MatchCard = ({ match }: { match: FWPFixture }) => {
  const isWhkHome = match["home-team"].id === 468 || match["home-team"].name === "Whitehawk";
  const homeTeam = match["home-team"];
  const awayTeam = match["away-team"];
  
  const isPlayed = match.status?.short === "FT" || 
                   match.status?.short === "AET" || 
                   match.status?.short === "Pens" || 
                   match.status?.full?.includes("Full Time");

  const dateObj = parseISO(match.date);
  const formattedDate = format(dateObj, "dd MMMM yyyy");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border/60 rounded-sm flex flex-col shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      {/* Label section */}
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#8e160b]">
          {match.competition.name.replace("Isthmian League", "").trim() || "League"}
        </span>
        {isPlayed && (
           <span className="text-[10px] font-heading uppercase text-muted-foreground font-bold italic">FT</span>
        )}
      </div>

      {/* Main match info */}
      <div className="p-5 flex-1 flex flex-col items-center justify-center space-y-4">
        {/* Teams grid */}
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Home */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-heading text-lg font-bold uppercase tracking-wide leading-tight line-clamp-2">
              {homeTeam.name}
            </span>
          </div>

          {/* Result / Time */}
          <div className="flex flex-col items-center justify-center">
            {isPlayed ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-heading font-black">{homeTeam.score}</span>
                <span className="text-xl font-heading text-muted-foreground">-</span>
                <span className="text-2xl font-heading font-black">{awayTeam.score}</span>
              </div>
            ) : (
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs font-heading font-bold">{match.time}</span>
              </div>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-heading text-lg font-bold uppercase tracking-wide leading-tight line-clamp-2">
              {awayTeam.name}
            </span>
          </div>
        </div>

        {/* Date & Location */}
        <div className="text-center space-y-1">
          <p className="text-[11px] font-bold text-foreground">
            {formattedDate} - {match.time}
          </p>
          <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate max-w-[180px]">{match.venue}</span>
          </p>
        </div>
      </div>

      {/* Button footer */}
      <Link 
        to={`/match-center/${match.id}`}
        className="block text-center w-full py-3 bg-muted/40 group-hover:bg-[#8e160b] group-hover:text-white transition-colors border-t border-border/40 font-heading text-[10px] uppercase font-bold tracking-widest"
      >
        Match Center
      </Link>
    </motion.div>
  );
};

const Matches = () => {
  const [activeMonth, setActiveMonth] = useState<string | number>("all");
  const [activeComp, setActiveComp] = useState<string>("all");
  const [showTable, setShowTable] = useState(false);

  const { data: allMatches = [], isLoading: fixturesLoading } = useFWPFixtures();
  const { data: leagueTable = [], isLoading: tableLoading } = useFWPLeagueTable();

  const sortedMatches = useMemo(() => {
    return [...allMatches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allMatches]);

  const comps = useMemo(() => {
    const list = Array.from(new Set(allMatches.map(m => m.competition.name)));
    return ["all", ...list];
  }, [allMatches]);

  const filteredMatches = useMemo(() => {
    return sortedMatches.filter(m => {
      const matchMonth = getMonth(parseISO(m.date));
      const monthMatch = activeMonth === "all" || matchMonth === activeMonth;
      const compMatch = activeComp === "all" || m.competition.name === activeComp;
      return monthMatch && compMatch;
    });
  }, [sortedMatches, activeMonth, activeComp]);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Bold Header Section */}
      <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16 border-b border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight text-black leading-none mb-4">
            Fixtures & Results
          </h1>
          <p className="font-heading text-2xl md:text-3xl font-bold text-muted-foreground uppercase">
            2025/26 Season
          </p>
        </div>
      </section>

      {/* Primary Filtering Section */}
      <section className="bg-white border-b border-border shadow-sm sticky top-[84px] md:top-[124px] z-30">
        <div className="container mx-auto px-4">
          {/* Months Navigation */}
          <div className="flex items-center justify-center gap-0 overflow-x-auto no-scrollbar py-2 border-b border-border/40">
            {MONTHS.map((m) => (
              <button
                key={m.name}
                onClick={() => setActiveMonth(m.value)}
                className={`px-4 py-3 font-heading text-[11px] uppercase tracking-widest transition-all whitespace-nowrap relative ${
                  activeMonth === m.value 
                    ? "text-[#8e160b] font-bold" 
                    : "text-muted-foreground hover:text-black"
                }`}
              >
                {m.name}
                {activeMonth === m.value && (
                  <motion.div 
                    layoutId="activeMonth"
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#8e160b]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Competitions Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            {comps.map((comp) => (
              <button
                key={comp}
                onClick={() => setActiveComp(comp)}
                className={`px-4 py-1.5 rounded-full font-heading text-[10px] uppercase tracking-widest border transition-all ${
                  activeComp === comp 
                    ? "bg-black text-white border-black" 
                    : "bg-transparent text-muted-foreground border-border hover:border-black hover:text-black"
                }`}
              >
                {comp === "all" ? "All Competitions" : comp.replace("Isthmian League", "League")}
              </button>
            ))}
            
            {/* Table Toggle */}
            <button
               onClick={() => setShowTable(!showTable)}
               className={`ml-4 flex items-center gap-2 px-4 py-1.5 rounded-full font-heading text-[10px] uppercase tracking-widest border transition-all ${
                showTable 
                  ? "bg-[#8e160b] text-white border-[#8e160b]" 
                  : "bg-white text-muted-foreground border-[#8e160b]/30 text-[#8e160b] hover:bg-[#8e160b]/5"
              }`}
            >
              <Trophy size={12} />
              {showTable ? "Hide Table" : "View Table"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {showTable ? (
               <motion.div 
                key="table"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-black px-6 py-4 flex items-center justify-between">
                  <h3 className="font-heading text-sm uppercase tracking-widest text-white">Isthmian Premier Division Table</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="py-3 px-4 text-left font-heading text-[10px] uppercase tracking-widest text-muted-foreground w-8">#</th>
                        <th className="py-3 px-4 text-left font-heading text-[10px] uppercase tracking-widest text-muted-foreground">Team</th>
                        <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">P</th>
                        <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">W</th>
                        <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">D</th>
                        <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">L</th>
                        <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">GD</th>
                        <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableLoading ? (
                        <tr><td colSpan={8} className="py-20 text-center"><Loader2 className="animate-spin text-[#8e160b] mx-auto" size={32} /></td></tr>
                      ) : (
                        leagueTable.map((row) => {
                          const isWhk = row.name === "Whitehawk" || row.id === 468;
                          return (
                            <tr key={row.id} className={`border-b border-border text-sm transition-colors ${isWhk ? "bg-[#8e160b]/5 font-bold" : "hover:bg-muted/30"}`}>
                              <td className="py-3 px-4 font-heading text-xs text-muted-foreground">{row.position}</td>
                              <td className={`py-3 px-4 font-heading text-sm uppercase tracking-wide ${isWhk ? "text-[#8e160b] font-bold" : "text-foreground"}`}>
                                {row.name}
                              </td>
                              <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row["all-matches"].played}</td>
                              <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row["all-matches"].won}</td>
                              <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row["all-matches"].drawn}</td>
                              <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row["all-matches"].lost}</td>
                              <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row["all-matches"]["goal-difference"]}</td>
                              <td className="py-3 px-4 text-center font-heading text-xs font-bold text-foreground">{row["total-points"]}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {fixturesLoading ? (
                  <div className="p-20 flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-[#8e160b]" />
                    <p className="font-heading uppercase tracking-widest text-xs">Live Match Syncing...</p>
                  </div>
                ) : filteredMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredMatches.map((m) => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center">
                    <p className="font-heading text-muted-foreground uppercase tracking-widest text-sm">
                      No matches found for this period.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Matches;

