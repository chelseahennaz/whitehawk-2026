import { ChevronRight, MapPin, Calendar } from "lucide-react";
import clubBadge from "@/assets/club-badge.png";
import { motion } from "framer-motion";
import { useState } from "react";

interface Fixture {
  id: number;
  date: string;
  homeAway: "H" | "A";
  competition: string;
  opponent: string;
  opponentLogo?: string;
  venue: string;
  time?: string;
  homeScore?: number;
  awayScore?: number;
  isNext?: boolean;
  result?: "W" | "L" | "D" | "P";
}

const fixtures: Fixture[] = [
  { id: 3, date: "Sat 1 Mar", homeAway: "H", competition: "League", opponent: "Bowers & Pitsea", venue: "TerraPura Ground", time: "3:00pm", isNext: true },
  { id: 4, date: "Sat 8 Mar", homeAway: "A", competition: "League", opponent: "Horsham", venue: "The Camping World Community Stadium", time: "3:00pm" },
  { id: 1, date: "Sat 15 Feb", homeAway: "H", competition: "League", opponent: "Burgess Hill Town", venue: "TerraPura Ground", homeScore: 3, awayScore: 1, result: "W" },
  { id: 2, date: "Sat 22 Feb", homeAway: "H", competition: "League", opponent: "Cheshunt", venue: "TerraPura Ground", result: "P" },
];

const upcoming = fixtures.filter((f) => !f.result);
const past = fixtures.filter((f) => !!f.result);

const resultColor = (r?: string) => {
  if (r === "W") return "bg-green-600";
  if (r === "L") return "bg-red-600";
  if (r === "D") return "bg-amber-500";
  if (r === "P") return "bg-muted-foreground/40";
  return "";
};

const FixtureRow = ({ fixture }: { fixture: Fixture }) => {
  const isResult = !!fixture.result;
  const homeTeam = fixture.homeAway === "H" ? "Whitehawk" : fixture.opponent;
  const awayTeam = fixture.homeAway === "A" ? "Whitehawk" : fixture.opponent;
  const homeBadge = fixture.homeAway === "H" ? clubBadge : null;
  const awayBadge = fixture.homeAway === "A" ? clubBadge : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-lg ${
        fixture.isNext
          ? "border-primary/40 bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/20"
      }`}
    >
      {/* Next match banner */}
      {fixture.isNext && (
        <div className="bg-primary text-primary-foreground text-[10px] font-heading uppercase tracking-[0.2em] text-center py-1.5 font-bold">
          Next Match
        </div>
      )}

      {/* Competition & date bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/30">
        <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Calendar size={10} className="opacity-60" />
          {fixture.date}
        </span>
        <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
          {fixture.competition}
        </span>
      </div>

      {/* Main matchup row */}
      <div className="flex items-center px-4 py-4 md:py-5">
        {/* Home team */}
        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
          <span className={`font-heading text-sm md:text-base uppercase tracking-wide text-right truncate ${
            fixture.homeAway === "H" ? "font-bold text-primary" : "text-foreground"
          }`}>
            {homeTeam}
          </span>
          {homeBadge ? (
            <img src={homeBadge} alt={homeTeam} className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0" />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
              <span className="font-heading text-[10px] text-muted-foreground font-bold">
                {homeTeam.substring(0, 3).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Score / VS / Time */}
        <div className="shrink-0 mx-3 md:mx-6 min-w-[70px] md:min-w-[90px] text-center">
          {isResult ? (
            fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
              <div className="flex items-center justify-center gap-2">
                <span className="font-heading text-2xl md:text-3xl font-black text-foreground">{fixture.homeScore}</span>
                <span className="text-muted-foreground text-sm">-</span>
                <span className="font-heading text-2xl md:text-3xl font-black text-foreground">{fixture.awayScore}</span>
              </div>
            ) : (
              <span className="font-heading text-lg font-bold text-muted-foreground">P - P</span>
            )
          ) : (
            <div className="flex flex-col items-center">
              <span className="font-heading text-xl md:text-2xl font-black text-primary">VS</span>
              <span className="text-[10px] font-heading text-muted-foreground mt-0.5">{fixture.time}</span>
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          {awayBadge ? (
            <img src={awayBadge} alt={awayTeam} className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0" />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
              <span className="font-heading text-[10px] text-muted-foreground font-bold">
                {awayTeam.substring(0, 3).toUpperCase()}
              </span>
            </div>
          )}
          <span className={`font-heading text-sm md:text-base uppercase tracking-wide truncate ${
            fixture.homeAway === "A" ? "font-bold text-primary" : "text-foreground"
          }`}>
            {awayTeam}
          </span>
        </div>
      </div>

      {/* Footer with venue & result badge */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/40 bg-muted/20">
        <span className="text-[10px] font-body text-muted-foreground flex items-center gap-1.5 truncate">
          <MapPin size={10} className="opacity-60 shrink-0" />
          {fixture.venue}
        </span>
        {fixture.result && (
          <span className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-heading font-black text-primary-foreground ${resultColor(fixture.result)}`}>
            {fixture.result}
          </span>
        )}
      </div>
    </motion.div>
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
  const [tab, setTab] = useState<"fixtures" | "results">("fixtures");

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
              Fixtures & Results
            </h3>
            <div className="h-1 w-12 bg-primary rounded-full mt-2" />
          </div>
          <a
            href="/matches"
            className="text-xs font-heading uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            All Matches <ChevronRight size={12} />
          </a>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted/50 rounded-lg p-1 w-fit border border-border">
          <button
            onClick={() => setTab("fixtures")}
            className={`px-5 py-2 rounded-md font-heading text-xs uppercase tracking-wider transition-all ${
              tab === "fixtures"
                ? "bg-primary text-primary-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Fixtures
          </button>
          <button
            onClick={() => setTab("results")}
            className={`px-5 py-2 rounded-md font-heading text-xs uppercase tracking-wider transition-all ${
              tab === "results"
                ? "bg-primary text-primary-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Results
          </button>
        </div>

        {/* Fixture/Result cards */}
        <div className="flex flex-col gap-3 mb-12">
          {tab === "fixtures"
            ? upcoming.map((f) => <FixtureRow key={f.id} fixture={f} />)
            : past.map((f) => <FixtureRow key={f.id} fixture={f} />)
          }
        </div>

        {/* League Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
              League Table
            </h3>
            <div className="h-1 w-12 bg-primary rounded-full mt-2" />
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
