import { useParams, Link } from "react-router-dom";
import { useFWPMatchDetails } from "@/hooks/useFWP";
import { format, parseISO } from "date-fns";
import { 
  ChevronLeft, MapPin, Calendar, Clock, Users, Shield, 
  Loader2, Goal, UserPlus, UserMinus, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import type { FWPLineupPlayer } from "@/lib/fwp";

/* ──────────────────────── helpers ──────────────────────── */

const PlayerName = ({ p }: { p: FWPLineupPlayer }) => {
  const name = `${p.player["first-name"] || ""} ${p.player["last-name"] || ""}`.trim();
  return (
    <div className="flex items-center gap-2 py-2 px-1">
      <span className="font-heading text-[11px] text-muted-foreground tabular-nums w-5 text-center">{p.shirt}</span>
      <span className="font-body text-sm font-semibold text-foreground">
        {name}
        {p.captain && <span className="ml-1 text-[9px] font-heading text-club-gold font-black">(C)</span>}
      </span>
      <span className="flex items-center gap-1 ml-auto">
        {p.cautioned && <div className="w-2.5 h-3.5 bg-yellow-400 rounded-[1px] border border-black/10" title={`Yellow ${p.cautioned.minute}'`} />}
        {p["sent-off"] && <div className="w-2.5 h-3.5 bg-red-600 rounded-[1px] border border-black/10" title={`Red ${p["sent-off"].minute}'`} />}
        {p["substituted-off"] && (
          <span className="text-[10px] font-heading text-red-500 font-bold flex items-center gap-0.5">
            <UserMinus size={10} /> {p["substituted-off"].minute}'
          </span>
        )}
        {p["substituted-on"] && (
          <span className="text-[10px] font-heading text-green-600 font-bold flex items-center gap-0.5">
            <UserPlus size={10} /> {p["substituted-on"].minute}'
          </span>
        )}
      </span>
    </div>
  );
};

/* ──────────────────────── page ──────────────────────── */

const MatchReport = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useFWPMatchDetails(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#8e160b]" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertTriangle size={48} className="text-[#8e160b] opacity-40" />
        <p className="font-heading text-xl uppercase tracking-widest text-muted-foreground">Match data unavailable</p>
        <Link to="/matches" className="font-heading text-sm uppercase tracking-widest text-[#8e160b] underline underline-offset-4">
          Back to Fixtures
        </Link>
      </div>
    );
  }

  const home = match["home-team"];
  const away = match["away-team"];
  const hasLineup = (home as any)["line-up"]?.length > 0 || (away as any)["line-up"]?.length > 0;
  const hasGoals = (home as any).goals?.length > 0 || (away as any).goals?.length > 0;
  const homeLineup: FWPLineupPlayer[] = (home as any)["line-up"] || [];
  const homeSubs: FWPLineupPlayer[] = (home as any).substitutes || [];
  const awayLineup: FWPLineupPlayer[] = (away as any)["line-up"] || [];
  const awaySubs: FWPLineupPlayer[] = (away as any).substitutes || [];
  const homeGoals = (home as any).goals || [];
  const awayGoals = (away as any).goals || [];

  let dateStr = "";
  try {
    dateStr = format(parseISO(match.date), "EEEE do MMMM yyyy");
  } catch { dateStr = match.date; }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">

      {/* ────── HERO HEADER ────── */}
      <section className="relative bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

        <div className="container mx-auto px-4 relative z-10">
          {/* Back link */}
          <Link to="/matches" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors font-heading text-xs uppercase tracking-widest mb-8">
            <ChevronLeft size={14} /> Back to Fixtures
          </Link>

          {/* Competition + Date bar */}
          <div className="flex flex-col items-center text-center mb-10">
            <span className="font-heading text-[#8e160b] text-xs uppercase tracking-[0.3em] font-bold mb-2">
              {match.competition?.name || "Match Report"}
            </span>
            <span className="font-body text-white/40 text-xs">
              {dateStr} • KO {match.time}
            </span>
          </div>

          {/* Scoreboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-6 md:gap-14"
          >
            {/* Home */}
            <div className="flex flex-col items-center text-center min-w-0 flex-1 max-w-[200px]">
              <h2 className="font-heading text-white text-xl md:text-3xl font-black uppercase tracking-tight leading-tight">{home.name}</h2>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3 md:gap-6 shrink-0">
              <span className="font-heading text-white text-5xl md:text-8xl font-black leading-none tabular-nums">{home.score ?? 0}</span>
              <span className="font-heading text-white/20 text-3xl md:text-5xl font-black">-</span>
              <span className="font-heading text-white text-5xl md:text-8xl font-black leading-none tabular-nums">{away.score ?? 0}</span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center text-center min-w-0 flex-1 max-w-[200px]">
              <h2 className="font-heading text-white text-xl md:text-3xl font-black uppercase tracking-tight leading-tight">{away.name}</h2>
            </div>
          </motion.div>

          {/* HT Score + Meta */}
          <div className="flex items-center justify-center gap-6 mt-6 text-white/30 text-xs font-heading uppercase tracking-widest">
            {(home["half-time-score"] !== undefined && away["half-time-score"] !== undefined) && (
              <span>HT: {home["half-time-score"]} - {away["half-time-score"]}</span>
            )}
            <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full font-bold">{match.status?.short || "FT"}</span>
          </div>

          {/* Quick meta */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-white/25 text-[10px] font-body uppercase tracking-wider">
            {match.venue && (
              <span className="flex items-center gap-1.5"><MapPin size={10} /> {match.venue}</span>
            )}
            {match.attendance && (
              <span className="flex items-center gap-1.5"><Users size={10} /> Att: {match.attendance}</span>
            )}
            {(match as any).referee && (
              <span className="flex items-center gap-1.5"><Shield size={10} /> Ref: {(match as any).referee}</span>
            )}
          </div>
        </div>
      </section>

      {/* ────── CONTENT ────── */}
      <section className="container mx-auto px-4 py-10 md:py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">

          {/* Left: Match Report + Goals */}
          <div className="space-y-10">

            {/* Match Report Text */}
            {match.match_report && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2 border-b-2 border-[#8e160b] pb-3">
                  Match Report
                </h3>
                <div 
                  className="prose prose-sm md:prose-base max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#8e160b] prose-img:rounded-md prose-p:text-gray-700 prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: match.match_report }}
                />
              </motion.div>
            )}

            {/* Goals */}
            {hasGoals && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2 border-b-2 border-[#8e160b] pb-3">
                  <Goal size={18} className="text-[#8e160b]" /> Goals
                </h3>
                <div className="bg-white border border-border/60 rounded-lg overflow-hidden shadow-sm">
                  {[...homeGoals.map((g: any) => ({ ...g, team: home.name })), ...awayGoals.map((g: any) => ({ ...g, team: away.name }))]
                    .sort((a, b) => a.minute - b.minute)
                    .map((g: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors">
                        <span className="font-heading text-sm text-muted-foreground tabular-nums w-10 text-right font-bold">{g.minute}'</span>
                        <Goal size={14} className="text-green-600 shrink-0" />
                        <div>
                          <span className="font-body text-sm font-semibold text-foreground">{g.description || `${g.player?.["first-name"] || ""} ${g.player?.["last-name"] || ""}`.trim()}</span>
                          <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest ml-2">{g.team}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* No report or goals fallback */}
            {!match.match_report && !hasGoals && (
              <div className="py-20 text-center text-muted-foreground">
                <p className="font-heading uppercase tracking-widest text-sm">No match report available yet.</p>
                <p className="font-body text-xs mt-2 opacity-60">Check back soon — reports are published after the final whistle.</p>
              </div>
            )}
          </div>

          {/* Right sidebar: Lineups */}
          <div className="space-y-8">
            {hasLineup && (
              <>
                {/* Home Lineup */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h4 className="font-heading text-sm font-bold uppercase tracking-widest mb-3 text-[#8e160b] border-b-2 border-[#8e160b] pb-2">
                    {home.name}
                  </h4>
                  <div className="bg-white border border-border/60 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-2 bg-muted/30 border-b border-border/30">
                      <span className="font-heading text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Starting XI</span>
                    </div>
                    <div className="divide-y divide-border/20 px-3">
                      {homeLineup.map((p, i) => <PlayerName key={i} p={p} />)}
                    </div>
                    {homeSubs.length > 0 && (
                      <>
                        <div className="px-4 py-2 bg-muted/30 border-t border-b border-border/30">
                          <span className="font-heading text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Substitutes</span>
                        </div>
                        <div className="divide-y divide-border/20 px-3">
                          {homeSubs.map((p, i) => <PlayerName key={i} p={p} />)}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Away Lineup */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h4 className="font-heading text-sm font-bold uppercase tracking-widest mb-3 text-gray-600 border-b-2 border-gray-300 pb-2">
                    {away.name}
                  </h4>
                  <div className="bg-white border border-border/60 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-2 bg-muted/30 border-b border-border/30">
                      <span className="font-heading text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Starting XI</span>
                    </div>
                    <div className="divide-y divide-border/20 px-3">
                      {awayLineup.map((p, i) => <PlayerName key={i} p={p} />)}
                    </div>
                    {awaySubs.length > 0 && (
                      <>
                        <div className="px-4 py-2 bg-muted/30 border-t border-b border-border/30">
                          <span className="font-heading text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Substitutes</span>
                        </div>
                        <div className="divide-y divide-border/20 px-3">
                          {awaySubs.map((p, i) => <PlayerName key={i} p={p} />)}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MatchReport;
