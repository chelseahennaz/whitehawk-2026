import { ExternalLink } from "lucide-react";
import clubBadge from "@/assets/club-badge.png";

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
  {
    id: 3,
    date: "Sat 1 Mar",
    homeAway: "H",
    competition: "League",
    opponent: "Bowers & Pitsea",
    venue: "TerraPura Ground",
    time: "3:00pm",
    isNext: true,
  },
  {
    id: 4,
    date: "Sat 8 Mar",
    homeAway: "A",
    competition: "League",
    opponent: "Horsham",
    venue: "The Camping World Community Stadium",
    time: "3:00pm",
  },
  {
    id: 1,
    date: "Sat 15 Feb",
    homeAway: "H",
    competition: "League",
    opponent: "Burgess Hill Town",
    venue: "TerraPura Ground",
    homeScore: 3,
    awayScore: 1,
    result: "W",
  },
  {
    id: 2,
    date: "Sat 22 Feb",
    homeAway: "H",
    competition: "League",
    opponent: "Cheshunt",
    venue: "TerraPura Ground",
    result: "P",
  },
];

const upcoming = fixtures.filter((f) => !f.result);
const past = fixtures.filter((f) => !!f.result);

const resultBadge = (r?: string) => {
  if (r === "W") return "bg-green-600 text-primary-foreground";
  if (r === "L") return "bg-red-600 text-primary-foreground";
  if (r === "D") return "bg-amber-500 text-club-dark";
  if (r === "P") return "bg-muted-foreground/30 text-foreground";
  return "";
};

const FixtureCard = ({ fixture }: { fixture: Fixture }) => (
  <div className={`bg-card border border-border rounded-lg p-4 ${fixture.isNext ? "border-l-4 border-l-primary" : ""}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
        {fixture.date} · {fixture.competition}
      </span>
      <span
        className={`text-[10px] font-heading uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${
          fixture.homeAway === "H" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {fixture.homeAway === "H" ? "Home" : "Away"}
      </span>
    </div>
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <img src={clubBadge} alt="Whitehawk" className="w-8 h-8 object-contain shrink-0" />
        <span className="font-heading text-sm uppercase tracking-wide font-bold text-primary truncate">WHK</span>
      </div>
      <div className="text-center shrink-0">
        {fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
          <div className="flex items-center gap-1">
            <span className="font-heading text-2xl font-bold text-foreground">{fixture.homeScore}</span>
            <span className="font-heading text-sm text-muted-foreground">-</span>
            <span className="font-heading text-2xl font-bold text-foreground">{fixture.awayScore}</span>
          </div>
        ) : fixture.result === "P" ? (
          <span className="font-heading text-lg font-bold text-muted-foreground">P-P</span>
        ) : (
          <span className="font-heading text-lg font-semibold text-foreground">{fixture.time}</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="font-heading text-sm uppercase tracking-wide text-foreground truncate text-right">
          {fixture.opponent}
        </span>
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="font-heading text-[9px] text-muted-foreground">
            {fixture.opponent.substring(0, 3).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-2">
      <span className="text-[10px] font-body text-muted-foreground truncate">{fixture.venue}</span>
      {fixture.result && (
        <span className={`w-5 h-5 flex items-center justify-center rounded-sm font-heading text-[9px] font-bold ${resultBadge(fixture.result)}`}>
          {fixture.result}
        </span>
      )}
      {fixture.isNext && (
        <span className="bg-club-gold text-club-dark text-[9px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold">
          Next
        </span>
      )}
    </div>
  </div>
);

const leagueTable = [
  { pos: 2, team: "Hornchurch", p: 30, w: 19, d: 6, l: 5, pts: 63 },
  { pos: 3, team: "Whitehawk", p: 28, w: 18, d: 5, l: 5, pts: 59, highlight: true },
  { pos: 4, team: "Bishop's Stortford", p: 30, w: 17, d: 6, l: 7, pts: 57 },
  { pos: 5, team: "Horsham", p: 29, w: 16, d: 7, l: 6, pts: 55 },
  { pos: 6, team: "Enfield Town", p: 30, w: 15, d: 7, l: 8, pts: 52 },
];

const FixturesWidget = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wide text-foreground">
            Fixtures & Results
          </h3>
          <a
            href="/matches"
            className="text-xs font-heading uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
          >
            All Matches <ExternalLink size={10} />
          </a>
        </div>

        {/* Upcoming fixtures - side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {upcoming.map((f) => (
            <FixtureCard key={f.id} fixture={f} />
          ))}
        </div>

        {/* Past results - side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {past.map((f) => (
            <FixtureCard key={f.id} fixture={f} />
          ))}
        </div>

        {/* League Table - full width, 5 teams */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wide text-foreground">
            League Table
          </h3>
          <a
            href="/matches"
            className="text-xs font-heading uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
          >
            Full Table <ExternalLink size={10} />
          </a>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-club-dark text-primary-foreground">
                <th className="py-2.5 px-3 text-left font-heading text-[10px] uppercase tracking-widest w-8"></th>
                <th className="py-2.5 px-3 text-left font-heading text-[10px] uppercase tracking-widest">Team</th>
                <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">P</th>
                <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">W</th>
                <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">D</th>
                <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">L</th>
                <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">Pts</th>
              </tr>
            </thead>
            <tbody>
              {leagueTable.map((row) => (
                <tr
                  key={row.pos}
                  className={`border-b border-border text-sm ${
                    row.highlight
                      ? "bg-primary/5 font-bold border-l-4 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <td className="py-2.5 px-3 font-heading text-xs text-muted-foreground">{row.pos}</td>
                  <td
                    className={`py-2.5 px-3 font-heading text-xs uppercase tracking-wide ${
                      row.highlight ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {row.team}
                  </td>
                  <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.p}</td>
                  <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.w}</td>
                  <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.d}</td>
                  <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.l}</td>
                  <td className="py-2.5 px-3 text-center font-heading text-xs font-bold text-foreground">{row.pts}</td>
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
