import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, MonitorPlay, Minimize2, Radio, Clock, UserPlus, UserMinus, AlertCircle, Goal
} from "lucide-react";
import { useFWPMatchDetails, useFWPLeagueTable, useFWPCompetitionFixtures } from "@/hooks/useFWP";
import { getTeamBadgeUrl, isMatchLive } from "@/lib/fwp";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";

const WHK_ID = 468;

// --- Sky Sports Styled Subcomponents ---

/**
 * The Main Red Hero Section (Sky Style)
 * Rescaled for visibility - no clipping
 */
const SkyHero = ({ match }: { match: any }) => {
  if (!match) return null;
  const home = match["home-team"];
  const away = match["away-team"];
  
  return (
    <div className="relative w-full flex-grow flex flex-col items-center justify-center p-10 overflow-hidden shrink-0 border-b border-black/40">
       {/* Deep Red Gradient Background */}
       <div className="absolute inset-0 bg-gradient-to-br from-[#c8102e] via-[#a50d26] to-[#7a0a1c]" />
       
       {/* Subtle Mesh Texture */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
       <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

       {/* Top Competition Bar */}
       <div className="relative z-10 flex flex-col items-center mb-8">
          <span className="font-heading text-white text-xl sm:text-3xl tracking-[0.2em] drop-shadow-md opacity-90 uppercase leading-none">{match.competition.name}</span>
          <div className="flex items-center gap-3 mt-2">
             <div className="h-px w-6 bg-white/20" />
             <span className="font-body text-[#ffd700] text-[9px] sm:text-xs font-black tracking-[0.3em] uppercase">MATCHDAY LIVE</span>
             <div className="h-px w-6 bg-white/20" />
          </div>
       </div>

       {match.status?.short === 'CANC' && (
         <div className="relative z-10 mb-6 bg-red-600 border border-white/40 px-6 py-2.5 rounded shadow-2xl text-center">
           <span className="font-heading text-white text-sm sm:text-lg font-black uppercase tracking-widest flex items-center gap-2 justify-center">
             ⚠️ THIS MATCH HAS BEEN CANCELLED — DO NOT TRAVEL
           </span>
         </div>
       )}
       {match.status?.short === 'P-P' && (
         <div className="relative z-10 mb-6 bg-amber-500 border border-white/40 px-6 py-2.5 rounded shadow-2xl text-center">
           <span className="font-heading text-white text-sm sm:text-lg font-black uppercase tracking-widest flex items-center gap-2 justify-center">
             ⚠️ THIS MATCH HAS BEEN POSTPONED — NEW DATE TBC
           </span>
         </div>
       )}

       {/* Scoreboard Matrix */}
       <div className="relative z-10 w-full max-w-[1100px] grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 px-8">
          
          {/* Home Column */}
          <div className="flex flex-col items-center text-center px-4">
             <h2 className="font-heading text-white text-3xl sm:text-5xl font-black drop-shadow-md uppercase tracking-tighter leading-[0.9]">{home.name}</h2>
             <div className="mt-4 flex flex-col gap-1 items-center max-h-[80px] overflow-hidden">
               {home.goals?.slice(0, 3).map((g:any, i:number) => (
                 <span key={i} className="font-body text-white/80 text-[10px] sm:text-xs font-bold whitespace-nowrap">{g.description} {g.minute}'</span>
               ))}
               {(home.goals?.length || 0) > 3 && <span className="text-white/40 text-[8px]">+ MORE</span>}
             </div>
          </div>

          {/* Center Score & Clock */}
          <div className="flex flex-col items-center justify-center">
             <div className="flex items-center gap-4 sm:gap-8">
                <span className="font-heading text-white text-[80px] sm:text-[110px] font-black leading-none drop-shadow-heavy select-none tabular-nums tracking-tighter">{home.score ?? "0"}</span>
                <span className="font-heading text-white/30 text-5xl sm:text-7xl font-black leading-none select-none">-</span>
                <span className="font-heading text-white text-[80px] sm:text-[110px] font-black leading-none drop-shadow-heavy select-none tabular-nums tracking-tighter">{away.score ?? "0"}</span>
             </div>
             
             {/* Match Clock Box */}
             <div className={`mt-1 ${match.status?.short === 'CANC' ? 'bg-red-700' : match.status?.short === 'P-P' ? 'bg-amber-600' : 'bg-black/80'} border border-white/20 px-4 py-1.5 shadow-xl min-w-[120px] flex justify-center`}>
                <span className="font-heading text-white text-xl sm:text-3xl tabular-nums font-black tracking-widest flex items-center gap-3">
                   <Clock size={20} className="text-[#ffd700] animate-pulse" />
                   {match.status?.short === 'CANC' ? 'CANCELLED' : match.status?.short === 'P-P' ? 'POSTPONED' : (isMatchLive(match) ? (match.status?.short || "LIVE") : (match.status?.short || match.time))}
                </span>
             </div>
             <span className="mt-4 font-body text-white/30 text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] px-4 text-center select-none truncate max-w-[200px]">{match.venue}</span>
          </div>

          {/* Away Column */}
          <div className="flex flex-col items-center text-center px-4">
             <h2 className="font-heading text-white text-3xl sm:text-5xl font-black drop-shadow-md uppercase tracking-tighter leading-[0.9]">{away.name}</h2>
             <div className="mt-4 flex flex-col gap-1 items-center max-h-[80px] overflow-hidden">
               {away.goals?.slice(0, 3).map((g:any, i:number) => (
                 <span key={i} className="font-body text-white/80 text-[10px] sm:text-xs font-bold whitespace-nowrap">{g.description} {g.minute}'</span>
               ))}
               {(away.goals?.length || 0) > 3 && <span className="text-white/40 text-[8px]">+ MORE</span>}
             </div>
          </div>

       </div>
    </div>
  );
};

/**
 * Tabular Match Activity (Sky Style)
 * White background, only for current match
 */
const SkyMatchActivity = ({ match }: { match: any }) => {
  const events = useMemo(() => {
    if (!match) return [];
    const evs: any[] = [];
    
    const processTeam = (side: "home-team" | "away-team") => {
      const t = match[side];
      const teamInits = t.name.substring(0, 3).toUpperCase();
      
      // Goals
      t.goals?.forEach((g: any) => evs.push({ 
        type: 'GOAL', 
        minute: g.minute, 
        team: teamInits, 
        desc: `${g.description}`,
        icon: <Goal size={14} className="text-green-600" />
      }));
      
      // Cards & Subs
      ["line-up", "substitutes"].forEach(cat => {
        t[cat]?.forEach((p: any) => {
          const pName = p.player["last-name"] || p.player["first-name"];
          if (p.cautioned) evs.push({ 
            type: 'CARD', minute: p.cautioned.minute, team: teamInits, 
            desc: `${pName} (Yellow)`, icon: <div className="w-3 h-4 bg-yellow-400 border border-black/10 rounded-sm" />
          });
          if (p["sent-off"]) evs.push({ 
            type: 'CARD', minute: p["sent-off"].minute, team: teamInits, 
            desc: `${pName} (Red)`, icon: <div className="w-3 h-4 bg-red-600 border border-black/10 rounded-sm" />
          });
          if (p["substituted-off"]) evs.push({ 
            type: 'SUB', minute: p["substituted-off"].minute, team: teamInits, 
            desc: `OUT: ${pName}`, icon: <UserMinus size={14} className="text-red-500" />
          });
          if (p["substituted-on"]) evs.push({ 
            type: 'SUB', minute: p["substituted-on"].minute, team: teamInits, 
            desc: `IN: ${pName}`, icon: <UserPlus size={14} className="text-blue-500" />
          });
        });
      });
    };

    processTeam("home-team");
    processTeam("away-team");
    
    return evs.sort((a, b) => b.minute - a.minute);
  }, [match]);

  return (
    <div className="h-[200px] lg:h-[240px] w-full bg-white overflow-hidden flex flex-col shrink-0">
       <div className="bg-gray-100 py-2 px-6 border-b border-gray-200 flex items-center justify-between">
          <span className="font-heading text-gray-400 text-xs tracking-widest uppercase font-black">LATEST UPDATES</span>
          <span className="font-heading text-red-600 text-[10px] tracking-widest uppercase font-black">MATCH FEED LIVE</span>
       </div>
       <div className="flex-1 overflow-y-auto no-scrollbar">
          {events.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <tbody>
                {events.map((e, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 w-16">
                       <span className="font-heading text-gray-400 text-sm font-black tabular-nums">{e.minute}'</span>
                    </td>
                    <td className="py-3 px-2 w-10 flex justify-center mt-0.5">
                       {e.icon}
                    </td>
                    <td className="py-3 px-4 w-24">
                       <span className="font-heading text-blue-800 text-xs font-black tracking-widest uppercase">{e.team}</span>
                    </td>
                    <td className="py-3 px-4">
                       <span className="font-heading text-gray-800 text-base font-black uppercase tracking-tight">{e.desc}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 p-12 text-center">
               <AlertCircle size={48} className="mb-4 text-gray-400" />
               <p className="font-heading text-xl uppercase tracking-widest text-gray-400">Waiting for events...</p>
            </div>
          )}
       </div>
    </div>
  );
};

/**
 * The Blue Sidebar League Table (Full Height Sky Style)
 */
const SkySidebar = ({ compId }: { compId: number }) => {
  const { data: tableResponse, isLoading } = useFWPLeagueTable();
  const fullTable = (tableResponse?.teams || []).slice(0, 24); 

  if (isLoading) return <div className="text-white/50 p-8 font-heading animate-pulse">TRANSMITTING TABLE DATA...</div>;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0038a8] via-[#002b80] to-[#001740] border-l border-white/10 overflow-hidden">
       {/* Heading */}
       <div className="bg-white/10 py-4 px-6 shadow-sm border-b border-white/5 shrink-0">
          <h3 className="font-heading uppercase tracking-widest text-xl font-black text-white flex items-center justify-between">
             LEAGUE TABLE
             <Radio size={14} className="text-red-500 animate-pulse" />
          </h3>
       </div>
       
       <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <table className="w-full text-white tabular-nums border-collapse">
            <thead className="sticky top-0 bg-[#0038a8] z-10 shadow-lg border-b border-white/10">
              <tr className="text-white/40 text-[9px] font-black uppercase">
                 <th className="py-3 px-4 text-left">POS</th>
                 <th className="py-3 px-4 text-left">TEAM</th>
                 <th className="py-3 px-2 text-center">P</th>
                 <th className="py-3 px-2 text-center">GD</th>
                 <th className="py-3 px-6 text-center">PTS</th>
              </tr>
            </thead>
            <tbody>
              {fullTable.map((row: any) => {
                const isWhk = row.id === WHK_ID || row.name === "Whitehawk";
                return (
                  <tr key={row.id} className={`${isWhk ? "bg-white text-black font-black" : "hover:bg-white/5 text-white/95"} border-b border-white/5 transition-colors`}>
                    <td className="py-2 px-4 text-sm font-bold opacity-70">{row.position}</td>
                    <td className="py-2 px-4 text-sm font-black uppercase truncate max-w-[140px] tracking-tight">{row.name}</td>
                    <td className="py-2 px-2 text-center text-[10px] opacity-60 font-medium">{row["all-matches"].played}</td>
                    <td className="py-2 px-2 text-center text-[10px] opacity-60 font-medium">{row["all-matches"]["goal-difference"]}</td>
                    <td className={`py-2 px-6 text-center text-base font-black ${isWhk ? "" : "text-[#ffd700]"}`}>{row["total-points"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
       </div>
    </div>
  );
};

/**
 * Consolidated Bottom Scrolling Ticker (Sky Style)
 */
const SkyTickerSystem = ({ compId, matchDate, currentId }: { compId: number, matchDate: string, currentId: string | number }) => {
  const { data: fixtures = [] } = useFWPCompetitionFixtures(compId);
  const matchSet = fixtures.filter(m => m.date === matchDate && m.id !== currentId);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="shrink-0 relative z-30 h-14 bg-black/90 flex items-center overflow-hidden border-t-[3px] border-black/20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
       {/* News Console (White Background, Red/Blue branding) */}
       <div className="bg-white h-full flex items-center px-6 gap-6 border-r border-black/10 shrink-0 shadow-[10px_0_20px_rgba(0,0,0,0.3)] relative z-20">
          <div className="flex items-center gap-2 select-none leading-none">
             <span className="font-heading text-red-600 text-2xl font-black italic tracking-tighter uppercase">Whitehawk</span>
             <span className="font-heading text-blue-700 text-2xl font-black italic tracking-tighter uppercase">News</span>
          </div>
          <div className="h-4 w-px bg-black/10" />
          <span className="font-heading text-black text-2xl font-black tabular-nums tracking-wider">{currentTime}</span>
       </div>

       {/* Scrolling Yellow Ticker Section */}
       <div className="flex-1 h-full bg-[#fff200] relative flex items-center overflow-hidden">
          <motion.div 
            className="flex items-center gap-20 whitespace-nowrap pl-16 pr-16"
            animate={{ x: [0, -2500] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          >
             {matchSet.length > 0 ? [...matchSet, ...matchSet, ...matchSet].map((m, i) => (
               <div key={i} className="flex items-center gap-4 text-black font-body font-black uppercase text-base tracking-tighter">
                  <span className="opacity-60 font-heading text-[10px] tracking-widest">{m.status?.short || 'KO'}</span>
                  <span>{m["home-team"].name}</span>
                  <span className="bg-black text-white px-2.5 py-0.5 tabular-nums ring-1 ring-black shadow-lg">{m["home-team"].score ?? "0"} - {m["away-team"].score ?? "0"}</span>
                  <span>{m["away-team"].name}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-black/20 mx-4" />
               </div>
             )) : (
                <div className="text-black font-heading font-black uppercase text-sm tracking-widest opacity-60">/// BROADCAST LIVE FROM THE ENCLOSED GROUND /// HAWA-A-A-Y THE HAWKS ///</div>
             )}
          </motion.div>
       </div>

       {/* Live Hub Badge */}
       <div className="bg-red-700 h-full flex items-center px-8 shrink-0 border-l border-white/10 shadow-[-10px_0_20px_rgba(0,0,0,0.2)]">
          <span className="font-heading text-white text-lg font-black tracking-[0.2em] uppercase italic drop-shadow-md">LIVE HUB</span>
       </div>
    </div>
  );
};

const MatchCenter = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useFWPMatchDetails(id || "");
  const matchCenterRef = useRef<HTMLDivElement>(null);
  const [isTVMode, setIsTVMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"activity" | "report">("report");

  const toggleTVMode = () => {
    if (!document.fullscreenElement) {
      matchCenterRef.current?.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err.message);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsTVMode(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (isLoading) return <div className="min-h-screen bg-[#111] text-white flex justify-center items-center font-heading text-2xl animate-pulse italic uppercase tracking-widest">TRANSMISSION CONNECTING...</div>;
  if (error || !match) return <div className="min-h-screen bg-[#111] text-white flex justify-center items-center font-heading text-2xl text-red-500 uppercase">SIGNAL LOST - MATCH UNAVAILABLE</div>;

  return (
    <div ref={matchCenterRef} className={`relative flex flex-col w-full h-full text-white font-sans bg-black overflow-hidden ${isTVMode ? 'fixed inset-0 z-50' : 'min-h-[calc(100vh-80px)]'}`}>
      
      {/* Utilities Overlay */}
      <div className="absolute top-4 left-4 z-[60] flex items-center gap-2 opacity-15 hover:opacity-100 transition-opacity">
         {!isTVMode && (
           <Link to="/matches" className="bg-black/95 text-white p-2 border border-white/20 transition-colors shadow-xl hover:bg-white hover:text-black"><ChevronLeft size={16} /></Link>
         )}
         <button onClick={toggleTVMode} className="bg-black/95 text-white px-4 py-2 font-heading text-xs uppercase border border-white/20 flex items-center gap-3 transition-all hover:bg-white hover:text-black shadow-xl">
            {isTVMode ? <><Minimize2 size={14} /> EXIT HUD</> : <><MonitorPlay size={14} /> BROADCAST MODE</>}
         </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
         
         {/* Center: Hero & Activity Feed / Match Report */}
         <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
            <SkyHero match={match} />
            {match.match_report ? (
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="flex items-center bg-gray-100 border-b border-gray-200 shrink-0">
                  <button 
                    onClick={() => setActiveTab("activity")}
                    className={`px-8 py-3 font-heading uppercase text-xs font-black tracking-widest transition-colors ${activeTab === 'activity' ? 'bg-white text-red-600 border-t-2 border-t-red-600 border-r border-r-gray-200' : 'text-gray-500 hover:bg-gray-50 border-t-2 border-t-transparent border-r border-r-gray-200'}`}
                  >
                    Match Activity
                  </button>
                  <button 
                    onClick={() => setActiveTab("report")}
                    className={`px-8 py-3 font-heading uppercase text-xs font-black tracking-widest transition-colors ${activeTab === 'report' ? 'bg-white text-red-600 border-t-2 border-t-red-600 border-r border-r-gray-200' : 'text-gray-500 hover:bg-gray-50 border-t-2 border-t-transparent border-r border-r-gray-200'}`}
                  >
                    Match Report
                  </button>
                </div>
                {activeTab === "activity" ? (
                  <SkyMatchActivity match={match} />
                ) : (
                  <div className="flex-1 overflow-y-auto bg-white p-6 md:p-10 text-black">
                     <div className="prose prose-sm md:prose-base max-w-3xl mx-auto prose-img:rounded-md prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-red-600" dangerouslySetInnerHTML={{ __html: match.match_report }} />
                  </div>
                )}
              </div>
            ) : (
              <SkyMatchActivity match={match} />
            )}
         </div>

         {/* Right: Sidebar Table */}
         <div className="w-full md:w-[320px] lg:w-[420px] shrink-0 flex flex-col relative z-10 shadow-[-30px_0_60px_rgba(0,0,0,0.8)] border-l border-white/5">
            <SkySidebar compId={match.competition.id} />
         </div>
      </div>

      {/* Unified Bottom Ticker System */}
      <SkyTickerSystem compId={match.competition.id} matchDate={match.date} currentId={id || ""} />

    </div>
  );
};

export default MatchCenter;
