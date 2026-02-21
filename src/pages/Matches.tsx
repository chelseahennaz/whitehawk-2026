import { useState } from "react";
import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import ClubFooter from "@/components/ClubFooter";
import { MapPin, ExternalLink, Calendar, Trophy } from "lucide-react";
import clubBadge from "@/assets/club-badge.png";

interface Match {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  venue: string;
  time?: string;
  competition: string;
  result?: "W" | "L" | "D" | "P";
  isNext?: boolean;
}

const matches: Match[] = [
  // Upcoming fixtures
  { id: 30, date: "22 Feb 2026", homeTeam: "Whitehawk", awayTeam: "Brentwood Town", venue: "The Enclosed Ground", time: "3:00pm", competition: "League", isNext: true },
  { id: 31, date: "28 Feb 2026", homeTeam: "Lewes", awayTeam: "Whitehawk", venue: "The Dripping Pan", time: "3:00pm", competition: "League" },
  { id: 32, date: "7 Mar 2026", homeTeam: "Whitehawk", awayTeam: "Dulwich Hamlet", venue: "The Enclosed Ground", time: "3:00pm", competition: "League" },
  { id: 33, date: "14 Mar 2026", homeTeam: "Horsham", awayTeam: "Whitehawk", venue: "The Camping World Community Stadium", time: "3:00pm", competition: "League" },
  { id: 34, date: "21 Mar 2026", homeTeam: "Whitehawk", awayTeam: "Chatham Town", venue: "The Enclosed Ground", time: "3:00pm", competition: "League" },
  { id: 35, date: "28 Mar 2026", homeTeam: "Cheshunt", awayTeam: "Whitehawk", venue: "Cheshunt Stadium", time: "3:00pm", competition: "League" },
  // Results (most recent first)
  { id: 20, date: "14 Feb 2026", homeTeam: "Whitehawk", awayTeam: "Burgess Hill Town", homeScore: 3, awayScore: 1, venue: "The Enclosed Ground", competition: "League", result: "W" },
  { id: 19, date: "10 Feb 2026", homeTeam: "Whitehawk", awayTeam: "Cheshunt", venue: "The Enclosed Ground", competition: "League", result: "P" },
  { id: 18, date: "7 Feb 2026", homeTeam: "Whitehawk", awayTeam: "Hashtag United", homeScore: 3, awayScore: 2, venue: "The Enclosed Ground", competition: "League", result: "W" },
  { id: 17, date: "3 Feb 2026", homeTeam: "Dulwich Hamlet", awayTeam: "Whitehawk", venue: "Champion Hill", competition: "League", result: "P" },
  { id: 16, date: "31 Jan 2026", homeTeam: "Carshalton Athletic", awayTeam: "Whitehawk", homeScore: 2, awayScore: 2, venue: "War Memorial Sports Ground", competition: "League", result: "D" },
  { id: 15, date: "27 Jan 2026", homeTeam: "Chatham Town", awayTeam: "Whitehawk", venue: "The Bauvill Stadium", competition: "League", result: "P" },
  { id: 14, date: "24 Jan 2026", homeTeam: "Whitehawk", awayTeam: "Canvey Island", homeScore: 1, awayScore: 1, venue: "The Enclosed Ground", competition: "League", result: "D" },
  { id: 13, date: "17 Jan 2026", homeTeam: "St Albans City", awayTeam: "Whitehawk", homeScore: 3, awayScore: 5, venue: "Clarence Park", competition: "League", result: "W" },
  { id: 12, date: "10 Jan 2026", homeTeam: "Whitehawk", awayTeam: "Cheshunt", venue: "The Enclosed Ground", competition: "League", result: "P" },
  { id: 11, date: "3 Jan 2026", homeTeam: "Whitehawk", awayTeam: "Margate", homeScore: 2, awayScore: 0, venue: "The Enclosed Ground", competition: "League", result: "W" },
  { id: 10, date: "26 Dec 2025", homeTeam: "Lewes", awayTeam: "Whitehawk", homeScore: 1, awayScore: 2, venue: "The Dripping Pan", competition: "League", result: "W" },
  { id: 9, date: "20 Dec 2025", homeTeam: "Whitehawk", awayTeam: "Horsham", homeScore: 1, awayScore: 1, venue: "The Enclosed Ground", competition: "League", result: "D" },
  { id: 8, date: "13 Dec 2025", homeTeam: "Bognor Regis Town", awayTeam: "Whitehawk", homeScore: 0, awayScore: 2, venue: "Nyewood Lane", competition: "League", result: "W" },
  { id: 7, date: "6 Dec 2025", homeTeam: "Whitehawk", awayTeam: "Folkestone Invicta", homeScore: 1, awayScore: 3, venue: "The Enclosed Ground", competition: "League", result: "L" },
  { id: 6, date: "22 Nov 2025", homeTeam: "Whitehawk", awayTeam: "Dartford", homeScore: 2, awayScore: 1, venue: "The Enclosed Ground", competition: "League", result: "W" },
  { id: 5, date: "15 Nov 2025", homeTeam: "Billericay Town", awayTeam: "Whitehawk", homeScore: 2, awayScore: 0, venue: "AGP Arena", competition: "League", result: "L" },
  { id: 4, date: "8 Nov 2025", homeTeam: "Whitehawk", awayTeam: "Ramsgate", homeScore: 3, awayScore: 1, venue: "The Enclosed Ground", competition: "League", result: "W" },
  { id: 3, date: "1 Nov 2025", homeTeam: "Aveley", awayTeam: "Whitehawk", homeScore: 2, awayScore: 1, venue: "Parkside", competition: "League", result: "L" },
  { id: 2, date: "25 Oct 2025", homeTeam: "Whitehawk", awayTeam: "Chichester City", homeScore: 0, awayScore: 0, venue: "The Enclosed Ground", competition: "League", result: "D" },
  { id: 1, date: "18 Oct 2025", homeTeam: "Cray Wanderers", awayTeam: "Whitehawk", homeScore: 1, awayScore: 2, venue: "Hayes Lane", competition: "League", result: "W" },
];

const leagueTable = [
  { pos: 1, team: "Folkestone Invicta", p: 31, w: 23, d: 5, l: 3, gf: 79, ga: 24, pts: 74 },
  { pos: 2, team: "Aveley", p: 30, w: 17, d: 10, l: 3, gf: 70, ga: 40, pts: 61 },
  { pos: 3, team: "Brentwood Town", p: 31, w: 17, d: 4, l: 10, gf: 62, ga: 53, pts: 55 },
  { pos: 4, team: "Billericay Town", p: 30, w: 14, d: 9, l: 7, gf: 53, ga: 36, pts: 51 },
  { pos: 5, team: "Chatham Town", p: 28, w: 15, d: 5, l: 8, gf: 54, ga: 27, pts: 50 },
  { pos: 6, team: "Cray Wanderers", p: 31, w: 11, d: 15, l: 5, gf: 56, ga: 52, pts: 48 },
  { pos: 7, team: "Dartford", p: 29, w: 13, d: 8, l: 8, gf: 50, ga: 39, pts: 47 },
  { pos: 8, team: "Ramsgate", p: 30, w: 11, d: 11, l: 8, gf: 57, ga: 49, pts: 44 },
  { pos: 9, team: "Burgess Hill Town", p: 30, w: 12, d: 7, l: 11, gf: 54, ga: 59, pts: 43 },
  { pos: 10, team: "Whitehawk", p: 27, w: 11, d: 8, l: 8, gf: 43, ga: 40, pts: 41, highlight: true },
  { pos: 11, team: "St Albans City", p: 31, w: 11, d: 7, l: 13, gf: 58, ga: 48, pts: 40 },
  { pos: 12, team: "Chichester City", p: 29, w: 10, d: 9, l: 10, gf: 37, ga: 43, pts: 39 },
  { pos: 13, team: "Dulwich Hamlet", p: 28, w: 10, d: 8, l: 10, gf: 41, ga: 41, pts: 38 },
  { pos: 14, team: "Hashtag United", p: 30, w: 10, d: 7, l: 13, gf: 43, ga: 52, pts: 37 },
  { pos: 15, team: "Horsham", p: 30, w: 10, d: 7, l: 13, gf: 40, ga: 44, pts: 37 },
  { pos: 16, team: "Canvey Island", p: 30, w: 9, d: 9, l: 12, gf: 38, ga: 44, pts: 36 },
  { pos: 17, team: "Lewes", p: 30, w: 9, d: 7, l: 14, gf: 46, ga: 56, pts: 34 },
  { pos: 18, team: "Margate", p: 30, w: 9, d: 6, l: 15, gf: 39, ga: 56, pts: 33 },
  { pos: 19, team: "Bognor Regis Town", p: 31, w: 8, d: 8, l: 15, gf: 40, ga: 55, pts: 32 },
  { pos: 20, team: "Cheshunt", p: 29, w: 7, d: 6, l: 16, gf: 39, ga: 58, pts: 27 },
  { pos: 21, team: "Carshalton Athletic", p: 30, w: 5, d: 10, l: 15, gf: 32, ga: 54, pts: 25 },
  { pos: 22, team: "East Thurrock United", p: 30, w: 4, d: 4, l: 22, gf: 29, ga: 80, pts: 16 },
];

const resultColor = (r?: string) => {
  if (r === "W") return "bg-green-600 text-primary-foreground";
  if (r === "L") return "bg-red-600 text-primary-foreground";
  if (r === "D") return "bg-amber-500 text-club-dark";
  if (r === "P") return "bg-muted-foreground/30 text-foreground";
  return "";
};

const isHome = (m: Match) => m.homeTeam === "Whitehawk";

const MatchRow = ({ match }: { match: Match }) => (
  <div className={`border-b border-border py-4 px-4 md:px-6 hover:bg-muted/30 transition-colors ${match.isNext ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
        {match.date}
      </span>
      <span className="text-[10px] font-body text-muted-foreground">·</span>
      <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
        {match.competition}
      </span>
      {match.isNext && (
        <span className="bg-club-gold text-club-dark text-[9px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold ml-auto">
          Next Match
        </span>
      )}
    </div>
    <div className="flex items-center gap-3">
      {/* Home team */}
      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
        <span className={`font-heading text-sm uppercase tracking-wide truncate text-right ${match.homeTeam === "Whitehawk" ? "font-bold text-primary" : "text-foreground"}`}>
          {match.homeTeam}
        </span>
        {match.homeTeam === "Whitehawk" ? (
          <img src={clubBadge} alt="Whitehawk" className="w-7 h-7 object-contain shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="font-heading text-[8px] text-muted-foreground">{match.homeTeam.substring(0, 3).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Score / Time */}
      <div className="w-20 text-center shrink-0">
        {match.homeScore !== undefined && match.awayScore !== undefined ? (
          <div className="flex items-center justify-center gap-1 bg-club-dark rounded-sm py-1 px-2">
            <span className="font-heading text-lg font-bold text-primary-foreground">{match.homeScore}</span>
            <span className="font-heading text-xs text-primary-foreground/50">-</span>
            <span className="font-heading text-lg font-bold text-primary-foreground">{match.awayScore}</span>
          </div>
        ) : match.result === "P" ? (
          <span className="font-heading text-xs font-bold text-muted-foreground bg-muted rounded-sm py-1.5 px-2 block">PPD</span>
        ) : (
          <span className="font-heading text-sm font-semibold text-foreground bg-muted/50 rounded-sm py-1.5 px-2 block">{match.time}</span>
        )}
      </div>

      {/* Away team */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {match.awayTeam === "Whitehawk" ? (
          <img src={clubBadge} alt="Whitehawk" className="w-7 h-7 object-contain shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="font-heading text-[8px] text-muted-foreground">{match.awayTeam.substring(0, 3).toUpperCase()}</span>
          </div>
        )}
        <span className={`font-heading text-sm uppercase tracking-wide truncate ${match.awayTeam === "Whitehawk" ? "font-bold text-primary" : "text-foreground"}`}>
          {match.awayTeam}
        </span>
      </div>

      {/* Result badge */}
      <div className="w-6 shrink-0">
        {match.result && match.result !== "P" && (
          <span className={`w-6 h-6 flex items-center justify-center rounded-sm font-heading text-[10px] font-bold ${resultColor(match.result)}`}>
            {match.result}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
      <MapPin size={10} />
      <span className="text-[10px] font-body">{match.venue}</span>
    </div>
  </div>
);

type Tab = "fixtures" | "results" | "table";

const Matches = () => {
  const [tab, setTab] = useState<Tab>("fixtures");

  const upcomingMatches = matches.filter((m) => !m.result);
  const results = matches.filter((m) => !!m.result);

  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <FixturesTicker />
      <main className="pt-[90px] md:pt-[124px]">
        {/* Hero */}
        <section className="bg-club-dark py-16 md:py-24">
          <div className="container mx-auto px-4">
            <p className="font-heading text-sm uppercase tracking-widest text-club-gold mb-2">2025-26 Season</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase text-primary-foreground leading-none">
              Matches
            </h1>
            <p className="mt-4 text-primary-foreground/70 font-body text-base max-w-lg">
              Isthmian League Premier Division — fixtures, results and league table.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <div className="border-b border-border bg-card sticky top-[84px] md:top-[124px] z-30">
          <div className="container mx-auto px-4 flex gap-0">
            {([
              { key: "fixtures" as Tab, label: "Fixtures", icon: <Calendar size={14} /> },
              { key: "results" as Tab, label: "Results", icon: <Trophy size={14} /> },
              { key: "table" as Tab, label: "League Table", icon: <ExternalLink size={14} /> },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-5 py-3.5 font-heading text-sm uppercase tracking-wider border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {tab === "fixtures" && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="bg-club-dark px-4 md:px-6 py-3">
                  <h3 className="font-heading text-sm uppercase tracking-widest text-primary-foreground">
                    Upcoming Fixtures
                  </h3>
                </div>
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((m) => <MatchRow key={m.id} match={m} />)
                ) : (
                  <p className="p-6 text-muted-foreground font-body text-sm">No upcoming fixtures scheduled.</p>
                )}
              </div>
            )}

            {tab === "results" && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="bg-club-dark px-4 md:px-6 py-3">
                  <h3 className="font-heading text-sm uppercase tracking-widest text-primary-foreground">
                    Results
                  </h3>
                </div>
                {results.map((m) => <MatchRow key={m.id} match={m} />)}
              </div>
            )}

            {tab === "table" && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="bg-club-dark px-4 md:px-6 py-3">
                  <h3 className="font-heading text-sm uppercase tracking-widest text-primary-foreground">
                    Isthmian League Premier Division
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-2.5 px-3 text-left font-heading text-[10px] uppercase tracking-widest text-muted-foreground w-8">#</th>
                        <th className="py-2.5 px-3 text-left font-heading text-[10px] uppercase tracking-widest text-muted-foreground">Team</th>
                        <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">P</th>
                        <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">W</th>
                        <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">D</th>
                        <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">L</th>
                        <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground hidden md:table-cell">GF</th>
                        <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground hidden md:table-cell">GA</th>
                        <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted-foreground">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leagueTable.map((row) => (
                        <tr
                          key={row.pos}
                          className={`border-b border-border text-sm ${
                            row.highlight
                              ? "bg-primary/5 font-bold border-l-4 border-l-primary"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="py-2.5 px-3 font-heading text-xs text-muted-foreground">{row.pos}</td>
                          <td className={`py-2.5 px-3 font-heading text-xs uppercase tracking-wide ${row.highlight ? "text-primary font-bold" : "text-foreground"}`}>
                            {row.team}
                          </td>
                          <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.p}</td>
                          <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.w}</td>
                          <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.d}</td>
                          <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.l}</td>
                          <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground hidden md:table-cell">{row.gf}</td>
                          <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground hidden md:table-cell">{row.ga}</td>
                          <td className="py-2.5 px-3 text-center font-heading text-xs font-bold text-foreground">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <ClubFooter />
    </div>
  );
};

export default Matches;
