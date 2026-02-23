import { ChevronRight } from "lucide-react";
import clubBadge from "@/assets/club-badge.png";
import { motion } from "framer-motion";

interface Fixture {
  id: number;
  date: string;
  homeAway: "H" | "A";
  competition: string;
  opponent: string;
  venue: string;
  time?: string;
  homeScore?: number;
  awayScore?: number;
  isNext?: boolean;
  result?: "W" | "L" | "D" | "P";
}

const fixtures: Fixture[] = [
  { id: 3, date: "Sat 1 Mar 2025", homeAway: "H", competition: "League", opponent: "Bowers & Pitsea", venue: "TerraPura Ground", time: "3:00pm", isNext: true },
  { id: 4, date: "Sat 8 Mar 2025", homeAway: "A", competition: "League", opponent: "Horsham", venue: "The Camping World Community Stadium", time: "3:00pm" },
  { id: 1, date: "Sat 15 Feb 2025", homeAway: "H", competition: "League", opponent: "Burgess Hill Town", venue: "TerraPura Ground", homeScore: 3, awayScore: 1, result: "W" },
  { id: 2, date: "Sat 22 Feb 2025", homeAway: "H", competition: "League", opponent: "Cheshunt", venue: "TerraPura Ground", result: "P" },
];

const resultBg = (r?: string) => {
  if (r === "W") return "bg-green-600 text-primary-foreground";
  if (r === "L") return "bg-red-600 text-primary-foreground";
  if (r === "D") return "bg-amber-500 text-primary-foreground";
  if (r === "P") return "bg-muted-foreground/30 text-foreground";
  return "bg-muted text-foreground";
};

const FixtureCard = ({ fixture }: { fixture: Fixture }) => {
  const isResult = !!fixture.result;
  const homeTeam = fixture.homeAway === "H" ? "Whitehawk" : fixture.opponent;
  const awayTeam = fixture.homeAway === "A" ? "Whitehawk" : fixture.opponent;
  const isWhkHome = fixture.homeAway === "H";

  return (
    <div className={`relative bg-card border border-border rounded-lg flex flex-col min-w-[260px] md:min-w-[280px] snap-start ${fixture.isNext ? "border-primary/30" : ""}`}>
      {/* Top bar: H/A badge + competition/date + result/next badge */}
      <div className="flex items-start justify-between px-4 pt-4">
        <span className="text-[11px] font-heading uppercase tracking-widest text-muted-foreground border border-border rounded px-2 py-0.5">
          {fixture.homeAway === "H" ? "H" : "A"}
        </span>
        <div className="flex-1 text-center px-2">
          <span className="text-primary text-[10px] font-heading uppercase tracking-widest font-bold block">
            {fixture.competition}
          </span>
          <span className="text-[11px] font-heading uppercase tracking-wider text-foreground font-semibold block mt-0.5">
            {fixture.date}
          </span>
        </div>
        {fixture.isNext ? (
          <span className="bg-green-600 text-primary-foreground text-[10px] font-heading uppercase tracking-wider px-2.5 py-0.5 rounded font-bold">
            Next Match
          </span>
        ) : fixture.result ? (
          <span className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-heading font-black ${resultBg(fixture.result)}`}>
            {fixture.result}
          </span>
        ) : <div className="w-7" />}
      </div>

      {/* Badges + V */}
      <div className="flex items-center justify-center gap-4 px-4 py-5">
        {/* Home badge */}
        {isWhkHome ? (
          <img src={clubBadge} alt="Whitehawk" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center border border-border">
            <span className="font-heading text-xs text-muted-foreground font-bold">{homeTeam.substring(0, 3).toUpperCase()}</span>
          </div>
        )}
        <span className="font-heading text-lg text-muted-foreground font-bold">V</span>
        {/* Away badge */}
        {!isWhkHome ? (
          <img src={clubBadge} alt="Whitehawk" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center border border-border">
            <span className="font-heading text-xs text-muted-foreground font-bold">{awayTeam.substring(0, 3).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Team names */}
      <div className="text-center px-4 space-y-0.5">
        <p className={`font-heading text-sm uppercase tracking-wide ${isWhkHome ? "font-bold text-foreground" : "text-foreground"}`}>
          {homeTeam}
        </p>
        <p className="text-primary text-[10px] font-heading uppercase tracking-widest font-bold">VS</p>
        <p className={`font-heading text-sm uppercase tracking-wide ${!isWhkHome ? "font-bold text-foreground" : "text-foreground"}`}>
          {awayTeam}
        </p>
      </div>

      {/* Venue */}
      <p className="text-[10px] text-muted-foreground text-center font-body mt-2 px-4 truncate">
        {fixture.venue}
      </p>

      {/* Score / Time at bottom */}
      <div className="mt-auto pt-4 pb-5 flex flex-col items-center gap-2">
        {isResult ? (
          fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
            <div className="flex items-center gap-1.5">
              <span className={`w-10 h-10 flex items-center justify-center rounded font-heading text-lg font-black ${resultBg(fixture.result)}`}>
                {fixture.homeScore}
              </span>
              <span className={`w-10 h-10 flex items-center justify-center rounded font-heading text-lg font-black ${resultBg(fixture.result)}`}>
                {fixture.awayScore}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className={`w-10 h-10 flex items-center justify-center rounded font-heading text-lg font-black ${resultBg(fixture.result)}`}>P</span>
              <span className={`w-10 h-10 flex items-center justify-center rounded font-heading text-lg font-black ${resultBg(fixture.result)}`}>P</span>
            </div>
          )
        ) : (
          <span className="bg-muted text-foreground font-heading text-lg font-bold px-5 py-2 rounded">
            {fixture.time}
          </span>
        )}
      </div>
    </div>
  );
};

const leagueTable = [
  { pos: 2, team: "Hornchurch", p: 30, w: 19, d: 6, l: 5, pts: 63 },
  { pos: 3, team: "Whitehawk", p: 28, w: 18, d: 5, l: 5, pts: 59, highlight: true },
  { pos: 4, team: "Bishop's Stortford", p: 30, w: 17, d: 6, l: 7, pts: 57 },
  { pos: 5, team: "Horsham", p: 29, w: 16, d: 7, l: 6, pts: 55 },
  { pos: 6, team: "Enfield Town", p: 30, w: 15, d: 7, l: 8, pts: 52 },
];

const FixturesWidget = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
              Fixtures / Results
            </h3>
            <div className="h-1 w-16 bg-club-gold rounded-full mt-2" />
          </div>
          <a
            href="/matches"
            className="text-xs font-heading uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            All Matches <ChevronRight size={12} />
          </a>
        </motion.div>

        {/* Horizontally scrolling cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {fixtures.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[280px] md:w-[300px]"
            >
              <FixtureCard fixture={f} />
            </motion.div>
          ))}
        </div>

        {/* League Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6 mt-12"
        >
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
              League Table
            </h3>
            <div className="h-1 w-12 bg-club-gold rounded-full mt-2" />
          </div>
          <a
            href="/matches"
            className="text-xs font-heading uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            Full Table <ChevronRight size={12} />
          </a>
        </motion.div>
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-club-dark text-primary-foreground">
                <th className="py-3 px-4 text-left font-heading text-[10px] uppercase tracking-widest w-8"></th>
                <th className="py-3 px-4 text-left font-heading text-[10px] uppercase tracking-widest">Team</th>
                <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest">P</th>
                <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest">W</th>
                <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest">D</th>
                <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest">L</th>
                <th className="py-3 px-4 text-center font-heading text-[10px] uppercase tracking-widest">Pts</th>
              </tr>
            </thead>
            <tbody>
              {leagueTable.map((row) => (
                <tr
                  key={row.pos}
                  className={`border-b border-border/50 text-sm transition-colors ${
                    row.highlight
                      ? "bg-primary/5 font-bold border-l-4 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <td className="py-3 px-4 font-heading text-xs text-muted-foreground">{row.pos}</td>
                  <td className={`py-3 px-4 font-heading text-xs uppercase tracking-wide ${row.highlight ? "text-primary" : "text-foreground"}`}>
                    {row.team}
                  </td>
                  <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row.p}</td>
                  <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row.w}</td>
                  <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row.d}</td>
                  <td className="py-3 px-4 text-center font-body text-xs text-muted-foreground">{row.l}</td>
                  <td className="py-3 px-4 text-center font-heading text-xs font-bold text-foreground">{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FixturesWidget;
