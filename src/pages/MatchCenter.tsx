import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  MapPin, 
  Users, 
  User, 
  Clock, 
  Trophy, 
  AlertCircle,
  Shield,
  ArrowRightLeft,
  Calendar
} from "lucide-react";
import { useFWPMatchDetails } from "@/hooks/useFWP";
import { getTeamBadgeUrl, type FWPFixture } from "@/lib/fwp";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Vidiprinter from "@/components/Vidiprinter";

const MatchCenter = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useFWPMatchDetails(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#8e160b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-heading uppercase tracking-widest text-xs text-muted-foreground">Accessing Match Data...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-center space-y-6 max-w-md px-6">
          <AlertCircle size={48} className="mx-auto text-muted-foreground opacity-20" />
          <h2 className="font-heading text-2xl uppercase font-bold">Match Not Found</h2>
          <p className="text-muted-foreground text-sm">We couldn't retrieve the details for this match. It might be scheduled for later or the data is temporarily unavailable.</p>
          <Link to="/matches" className="inline-block bg-black hover:bg-[#8e160b] text-white transition-colors h-10 px-8 font-heading uppercase text-[10px] tracking-widest rounded-sm leading-[40px]">
            Back to Fixtures
          </Link>
        </div>
      </div>
    );
  }

  const isWhkHome = match["home-team"].id === 468 || match["home-team"].name === "Whitehawk";
  const statusShort = match.status?.short || "";
  const isLive = statusShort !== "FT" && statusShort !== "AET" && statusShort !== "Pens" && statusShort !== "" && !match.status?.full?.includes("Full Time");
  const isFinished = statusShort === "FT" || statusShort === "AET" || statusShort === "Pens" || match.status?.full?.includes("Full Time");

  // Combine and sort events for the timeline
  const getMatchEvents = () => {
    const allEvents: any[] = [];
    
    // 1. Goals
    (match["home-team"].goals || []).forEach(g => {
      allEvents.push({ 
        type: "goal", 
        minute: g.minute, 
        team: "home", 
        player: g.description.split(' (')[0],
        icon: Trophy
      });
    });
    (match["away-team"].goals || []).forEach(g => {
      allEvents.push({ 
        type: "goal", 
        minute: g.minute, 
        team: "away", 
        player: g.description.split(' (')[0],
        icon: Trophy
      });
    });

    // 2. Cards & Subs from Lineups
    const processPlayers = (players: any[] = [], team: "home" | "away") => {
      players.forEach(p => {
        const name = p.player ? `${p.player["first-name"]} ${p.player["last-name"]}` : "Unknown Player";
        if (p.cautioned) allEvents.push({ type: "yellow-card", minute: p.cautioned.minute, team, player: name, icon: AlertCircle });
        if (p["sent-off"]) allEvents.push({ type: "red-card", minute: p["sent-off"].minute, team, player: name, icon: AlertCircle });
        if (p["substituted-off"]) allEvents.push({ type: "sub-off", minute: p["substituted-off"].minute, team, player: name, icon: ArrowRightLeft });
        if (p["substituted-on"]) allEvents.push({ type: "sub-on", minute: p["substituted-on"].minute, team, player: name, icon: ArrowRightLeft });
      });
    };

    processPlayers(match["home-team"]["line-up"], "home");
    processPlayers(match["home-team"].substitutes, "home");
    processPlayers(match["away-team"]["line-up"], "away");
    processPlayers(match["away-team"].substitutes, "away");

    return allEvents.sort((a, b) => a.minute - b.minute);
  };

  const timelineEvents = getMatchEvents();

  // Derive Vidiprinter events
  const vidiprinterEvents: string[] = [];
  const allGoals = timelineEvents.filter(e => e.type === "goal");
  
  if (allGoals.length > 0) {
    let hScore = 0;
    let aScore = 0;
    allGoals.forEach(g => {
      if (g.team === "home") hScore++;
      else aScore++;
      vidiprinterEvents.push(`GOAL! ${match["home-team"].name.toUpperCase()} ${hScore}-${aScore} ${match["away-team"].name.toUpperCase()} (${g.player} ${g.minute}')`);
    });
  } else if (!isFinished && !isLive) {
    vidiprinterEvents.push(`MATCH PREVIEW: ${match["home-team"].name.toUpperCase()} VS ${match["away-team"].name.toUpperCase()} AT ${match.venue?.toUpperCase()}`);
  }

  if (isLive) {
    vidiprinterEvents.push(`LIVE UPDATE: ${match.status?.full?.toUpperCase() || "MATCH IN PROGRESS"}`);
  } else if (isFinished) {
    vidiprinterEvents.push(`FULL TIME: ${match["home-team"].name.toUpperCase()} ${match["home-team"].score}-${match["away-team"].score} ${match["away-team"].name.toUpperCase()}`);
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-20">
      {/* Vidiprinter Bar */}
      <div className="pt-20 md:pt-24">
        <Vidiprinter events={vidiprinterEvents.reverse()} isLive={isLive} />
      </div>

      {/* Header / Scoreboard */}
      <section className="bg-white border-b border-border/60 pt-8 pb-12 md:pt-12 md:pb-16 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#8e160b]/5 skew-x-[-20deg] translate-x-1/2 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/matches" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#8e160b] text-xs font-heading font-bold uppercase tracking-widest mb-8 transition-colors">
            <ChevronLeft size={14} /> Back to Fixtures
          </Link>

          <div className="flex flex-col items-center">
             <Badge variant="outline" className={`mb-6 font-heading tracking-widest uppercase text-[10px] py-1 px-3 border-[#8e160b]/20 text-[#8e160b] rounded-full ${isLive ? "animate-pulse" : ""}`}>
               {isLive ? `• Live - ${match.status?.full}` : match.competition.name || "Competition"}
             </Badge>

             <div className="w-full grid grid-cols-3 items-center max-w-4xl mx-auto">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 md:w-28 md:h-28 bg-white rounded-full border border-border/40 shadow-sm p-3 flex items-center justify-center mb-2">
                    <img src={getTeamBadgeUrl(match["home-team"].id)} alt={match["home-team"].name} className="w-full h-full object-contain" />
                  </div>
                  <h1 className="font-heading text-sm md:text-2xl font-black uppercase tracking-tight leading-none">
                    {match["home-team"].name}
                  </h1>
                </div>

                {/* Score / Time Area */}
                <div className="flex flex-col items-center justify-center">
                  {isFinished || isLive ? (
                    <div className="flex items-center gap-2 md:gap-5">
                      <span className="text-4xl md:text-7xl font-heading font-black tabular-nums">{match["home-team"].score}</span>
                      <span className="text-xl md:text-3xl font-heading font-black text-muted-foreground opacity-20">-</span>
                      <span className="text-4xl md:text-7xl font-heading font-black tabular-nums">{match["away-team"].score}</span>
                    </div>
                  ) : (
                    <div className="bg-black text-white px-5 md:px-7 py-2 rounded-sm font-heading text-lg md:text-xl font-bold tracking-widest">
                      {match.time}
                    </div>
                  )}
                  {isFinished && (
                    <span className="mt-3 font-heading text-[9px] uppercase font-bold tracking-[0.25em] text-muted-foreground">FT</span>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 md:w-28 md:h-28 bg-white rounded-full border border-border/40 shadow-sm p-3 flex items-center justify-center mb-2">
                    <img src={getTeamBadgeUrl(match["away-team"].id)} alt={match["away-team"].name} className="w-full h-full object-contain" />
                  </div>
                  <h1 className="font-heading text-sm md:text-2xl font-black uppercase tracking-tight leading-none">
                    {match["away-team"].name}
                  </h1>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Match Info Bar */}
      <section className="bg-muted/30 border-b border-border/40 py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={13} className="text-[#8e160b]" />
              <span className="font-heading text-[9px] uppercase font-bold tracking-widest">{format(parseISO(match.date), "EEE d MMM yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={13} className="text-[#8e160b]" />
              <span className="font-heading text-[9px] uppercase font-bold tracking-widest">{match.venue}</span>
            </div>
            {match.attendance && match.attendance > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={13} className="text-[#8e160b]" />
                <span className="font-heading text-[9px] uppercase font-bold tracking-widest">Att: {match.attendance}</span>
              </div>
            )}
            {match.referee && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield size={13} className="text-[#8e160b]" />
                <span className="font-heading text-[9px] uppercase font-bold tracking-widest">Ref: {match.referee}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-white border p-1 rounded-sm">
              <TabsTrigger value="overview" className="font-heading text-[10px] uppercase tracking-widest font-bold px-10 data-[state=active]:bg-black data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="lineups" className="font-heading text-[10px] uppercase tracking-widest font-bold px-10 data-[state=active]:bg-black data-[state=active]:text-white">Lineups</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-10">
            {/* Scorers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Home Scorers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="font-heading text-[11px] uppercase font-bold tracking-widest text-[#8e160b]">{match["home-team"].name} Goals</h4>
                  <Trophy size={14} className="text-muted-foreground opacity-30" />
                </div>
                <div className="space-y-2.5">
                  {(match["home-team"].goals || []).length > 0 ? (
                    match["home-team"].goals?.map((g, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-border/10 last:border-0">
                        <span className="font-body font-medium">{g.description.split(' (')[0]}</span>
                         <Badge variant="secondary" className="font-heading text-[9px] font-bold h-5 px-1.5 rounded-sm">{g.minute}&apos;</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest py-4 text-center opacity-40 italic">No goals recorded</p>
                  )}
                </div>
              </div>

              {/* Away Scorers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                   <h4 className="font-heading text-[11px] uppercase font-bold tracking-widest text-[#8e160b]">{match["away-team"].name} Goals</h4>
                   <Trophy size={14} className="text-muted-foreground opacity-30" />
                </div>
                <div className="space-y-2.5">
                  {(match["away-team"].goals || []).length > 0 ? (
                    match["away-team"].goals?.map((g, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-border/10 last:border-0">
                        <span className="font-body font-medium">{g.description.split(' (')[0]}</span>
                        <Badge variant="secondary" className="font-heading text-[9px] font-bold h-5 px-1.5 rounded-sm">{g.minute}&apos;</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest py-4 text-center opacity-40 italic">No goals recorded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Real Match Timeline */}
            {timelineEvents.length > 0 ? (
              <div className="space-y-12 max-w-2xl mx-auto px-4 py-6">
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-border/40" />
                  
                  <div className="space-y-10">
                    {timelineEvents.map((event, idx) => {
                      const Icon = event.icon;
                      const isHome = event.team === "home";
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={idx} 
                          className="relative flex items-center gap-8 group"
                        >
                          {/* Minute Marker & Dot */}
                          <div className="relative z-10 flex items-center justify-center w-[40px] h-[40px] bg-white border border-border/40 rounded-full shadow-sm group-hover:border-[#8e160b] transition-colors">
                            <span className="font-heading text-[10px] font-black">{event.minute}&apos;</span>
                          </div>

                          {/* Event Card */}
                          <div className={`flex-1 bg-white border border-border/40 p-4 rounded-sm shadow-sm flex items-center justify-between group-hover:shadow-md transition-all ${isHome ? "border-l-4 border-l-[#8e160b]" : "border-r-4 border-r-[#141b2b]"}`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.type === 'goal' ? 'bg-club-gold/10' : 'bg-muted/30'}`}>
                                {event.type === 'yellow-card' ? (
                                  <div className="w-2.5 h-3.5 bg-yellow-400 rounded-[1px]" />
                                ) : event.type === 'red-card' ? (
                                  <div className="w-2.5 h-3.5 bg-red-600 rounded-[1px]" />
                                ) : (
                                  <Icon size={14} className={event.type === 'goal' ? 'text-club-gold' : 'text-muted-foreground'} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-heading text-xs font-black uppercase tracking-tight">
                                  {event.type === 'goal' ? 'GOAL!' : 
                                   event.type === 'sub-on' ? 'Substitution On' : 
                                   event.type === 'sub-off' ? 'Substitution Off' : 
                                   event.type === 'yellow-card' ? 'Yellow Card' : 'Red Card'}
                                </h4>
                                <p className="text-[11px] font-body text-muted-foreground">
                                  {event.player} <span className="font-bold opacity-40 ml-1">({isHome ? match["home-team"].name : match["away-team"].name})</span>
                                </p>
                              </div>
                            </div>
                            {event.type === 'goal' && <Trophy size={16} className="text-club-gold opacity-30" />}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-border/40 rounded-sm p-12 text-center space-y-5">
                <Clock size={36} className="mx-auto text-[#8e160b] opacity-20" />
                <h3 className="font-heading text-lg uppercase font-bold tracking-tight">Timeline & Events</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto font-body leading-relaxed">
                  No match events recorded yet. The live timeline will update with goals, cards, and substitutions as they happen.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="lineups" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Home XI */}
               <TeamLineup title={match["home-team"].name} players={match["home-team"]["line-up"]} substitutes={match["home-team"].substitutes} />
               {/* Away XI */}
               <TeamLineup title={match["away-team"].name} players={match["away-team"]["line-up"]} substitutes={match["away-team"].substitutes} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const TeamLineup = ({ title, players = [], substitutes = [] }: { title: string, players?: any[], substitutes?: any[] }) => {
  return (
    <div className="space-y-10">
      <div>
        <h4 className="font-heading text-sm uppercase font-bold tracking-widest text-[#8e160b] border-b border-border/60 pb-3 mb-6 relative">
          {title} Lineup
          <div className="absolute bottom-[-1px] left-0 w-16 h-0.5 bg-[#8e160b]" />
        </h4>
        
        <div className="space-y-1">
          {players.length > 0 ? (
            players.sort((a,b) => a.sort - b.sort).map((p, idx) => (
              <LineupRow key={idx} player={p} />
            ))
          ) : (
             <div className="py-16 text-center border-2 border-dashed border-border/40 rounded-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-heading font-black tracking-widest opacity-60">Lineup Not Available</p>
             </div>
          )}
        </div>
      </div>

      {substitutes.length > 0 && (
        <div className="pt-2">
          <h4 className="font-heading text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground mb-4 opacity-70">Bench</h4>
          <div className="space-y-1">
            {substitutes.sort((a,b) => a.sort - b.sort).map((p, idx) => (
              <LineupRow key={idx} player={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LineupRow = ({ player }: { player: any }) => {
  const name = player.player ? `${player.player["first-name"]} ${player.player["last-name"]}` : "Unknown Player";
  
  return (
    <div className="flex items-center justify-between py-2.5 px-3 hover:bg-white hover:shadow-sm border-l-2 border-transparent hover:border-[#8e160b] transition-all group">
      <div className="flex items-center gap-4">
        <span className="w-5 font-heading text-[10px] font-black text-muted-foreground/40 group-hover:text-[#8e160b] transition-colors">{player.shirt}</span>
        <div className="flex flex-col">
          <span className="font-heading text-[11px] md:text-[12px] uppercase font-black tracking-tight group-hover:text-[#8e160b] transition-colors">
            {name}
            {player.captain && <span className="ml-2 py-0.5 px-1.5 border border-muted-foreground/20 text-[8px] font-black text-muted-foreground rounded-xs">C</span>}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {player.cautioned && (
          <div className="w-2.5 h-3.5 bg-yellow-400 rounded-[1px] shadow-sm" title={`Yellow Card: ${player.cautioned.minute}'`} />
        )}
        {player["sent-off"] && (
          <div className="w-2.5 h-3.5 bg-red-600 rounded-[1px] shadow-sm" title={`Red Card: ${player["sent-off"].minute}'`} />
        )}
        {player["substituted-off"] && (
          <div className="flex items-center text-red-500 font-heading text-[8px] font-bold gap-1" title={`Subbed Off: ${player["substituted-off"].minute}'`}>
             <ArrowRightLeft size={10} /> {player["substituted-off"].minute}'
          </div>
        )}
        {player["substituted-on"] && (
          <div className="flex items-center text-green-500 font-heading text-[8px] font-bold gap-1" title={`Subbed On: ${player["substituted-on"].minute}'`}>
             <ArrowRightLeft size={10} /> {player["substituted-on"].minute}'
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCenter;
