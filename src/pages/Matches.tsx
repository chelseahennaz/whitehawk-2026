import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Trophy, Loader2, ChevronRight, LayoutGrid, List, Radio, XCircle, PauseCircle } from "lucide-react";
import { useFWPFixtures, useFWPLeagueTable, useFWPCompetitionFixtures } from "@/hooks/useFWP";
import { isMatchLive } from "@/lib/fwp";
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
      className={`bg-white border ${match.status?.short === 'CANC' ? 'border-red-400 ring-1 ring-red-400' : match.status?.short === 'P-P' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-border/60'} rounded-sm flex flex-col shadow-sm hover:shadow-md transition-all duration-300 group`}
    >
      {/* Label section */}
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#8e160b]">
          {match.competition.name.replace("Isthmian League", "").trim() || "League"}
        </span>
        {match.status?.short === 'CANC' ? (
          <span className="text-[10px] font-heading uppercase bg-red-600 text-white font-black px-2 py-0.5 rounded tracking-wider">
            CANCELLED
          </span>
        ) : match.status?.short === 'P-P' ? (
          <span className="text-[10px] font-heading uppercase bg-amber-500 text-white font-black px-2 py-0.5 rounded tracking-wider">
            POSTPONED
          </span>
        ) : isPlayed && (
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
            ) : match.status?.short === 'CANC' ? (
              <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded-full text-center">
                <span className="text-xs font-heading font-black tracking-wider">CANCELLED</span>
              </div>
            ) : match.status?.short === 'P-P' ? (
              <div className="bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1 rounded-full text-center">
                <span className="text-xs font-heading font-black tracking-wider">P - P</span>
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
      {(() => {
        const statusShort = match.status?.short;
        const live = isMatchLive(match);

        if (statusShort === 'CANC') {
          return (
            <div className="flex items-center justify-center gap-2 w-full py-3 border-t border-red-200 bg-red-600 text-white font-heading text-[10px] uppercase font-bold tracking-widest">
              <XCircle size={12} />
              Match Cancelled
            </div>
          );
        }

        if (statusShort === 'P-P') {
          return (
            <div className="flex items-center justify-center gap-2 w-full py-3 border-t border-amber-200 bg-amber-500 text-white font-heading text-[10px] uppercase font-bold tracking-widest">
              <PauseCircle size={12} />
              Postponed — Check Back for Updates
            </div>
          );
        }

        const linkTo = isPlayed ? `/match-report/${match.id}` : `/match-center/${match.id}`;
        return (
          <Link 
            to={linkTo}
            className={`flex items-center justify-center gap-2 w-full py-3 transition-colors border-t border-border/40 font-heading text-[10px] uppercase font-bold tracking-widest ${
              live 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-muted/40 group-hover:bg-[#8e160b] group-hover:text-white'
            }`}
          >
            {live ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Match Center — LIVE
              </>
            ) : isPlayed ? (
              'Match Report'
            ) : (
              'Match Preview'
            )}
          </Link>
        );
      })()}
    </motion.div>
  );
};

const Matches = () => {
  const currentMonth = new Date().getMonth();
  const [activeMonth, setActiveMonth] = useState<string | number>(currentMonth);
  const [activeComp, setActiveComp] = useState<string>("all");

  const { data: allMatches = [], isLoading: fixturesLoading } = useFWPFixtures();
  const { data: tableResponse, isLoading: tableLoading } = useFWPLeagueTable();
  
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
            2026/27 Season
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
            
            {/* Table Link */}
            <Link
               to="/standings"
               className="ml-4 flex items-center gap-2 px-4 py-1.5 rounded-full font-heading text-[10px] uppercase tracking-widest border transition-all bg-white text-muted-foreground border-[#8e160b]/30 text-[#8e160b] hover:bg-[#8e160b]/5"
            >
              <Trophy size={12} />
              View Standings
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
        </div>
      </section>
    </div>
  );
};

export default Matches;

