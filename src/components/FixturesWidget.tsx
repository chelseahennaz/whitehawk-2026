import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

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
{
  id: 1,
  date: "Saturday 15 Feb 2026",
  homeAway: "H",
  competition: "league",
  opponent: "Burgess Hill Town",
  venue: "TerraPura Ground",
  homeScore: 3,
  awayScore: 1,
  result: "W"
},
{
  id: 2,
  date: "Saturday 22 Feb 2026",
  homeAway: "H",
  competition: "league",
  opponent: "Cheshunt",
  venue: "TerraPura Ground",
  result: "P"
},
{
  id: 3,
  date: "Saturday 1 Mar 2026",
  homeAway: "H",
  competition: "league",
  opponent: "Bowers & Pitsea",
  venue: "TerraPura Ground",
  time: "3:00pm",
  isNext: true
},
{
  id: 4,
  date: "Saturday 8 Mar 2026",
  homeAway: "A",
  competition: "league",
  opponent: "Horsham",
  venue: "The Camping World Community Stadium",
  time: "3:00pm"
}];


const resultColor = (r?: string) => {
  if (r === "W") return "bg-green-600 text-primary-foreground";
  if (r === "L") return "bg-red-600 text-primary-foreground";
  if (r === "D") return "bg-amber-500 text-club-dark";
  if (r === "P") return "bg-muted-foreground/30 text-foreground";
  return "bg-muted text-muted-foreground";
};

const FixtureRow = ({ fixture }: {fixture: Fixture;}) =>
<div className={`border-b border-border py-4 px-4 ${fixture.isNext ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}>
    <div className="flex items-center gap-2 mb-1">
      <span className={`text-[10px] font-heading uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${
    fixture.homeAway === "H" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`
    }>
        {fixture.homeAway}
      </span>
      <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
        {fixture.competition}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="font-heading text-xs text-muted-foreground">{fixture.date}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-heading text-sm uppercase tracking-wide font-bold text-primary">
            Whitehawk
          </span>
          <span className="font-heading text-xs text-muted-foreground">VS</span>
          <span className="font-heading text-sm uppercase tracking-wide text-foreground">
            {fixture.opponent}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <MapPin size={10} />
          <span className="text-[10px] font-body">{fixture.venue}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {fixture.homeScore !== undefined && fixture.awayScore !== undefined ?
      <div className="flex items-center gap-1">
            <span className="font-heading text-xl font-bold text-foreground">{fixture.homeScore}</span>
            <span className="font-heading text-sm text-muted-foreground">-</span>
            <span className="font-heading text-xl font-bold text-foreground">{fixture.awayScore}</span>
          </div> :
      fixture.result === "P" ?
      <span className="font-heading text-sm font-bold text-muted-foreground">P - P</span> :
      fixture.time ?
      <span className="font-heading text-sm font-semibold text-foreground">{fixture.time}</span> :
      null}
        {fixture.result &&
      <span className={`w-6 h-6 flex items-center justify-center rounded-sm font-heading text-[10px] font-bold ${resultColor(fixture.result)}`}>
            {fixture.result}
          </span>
      }
      </div>
    </div>
    {fixture.isNext &&
  <div className="mt-2">
        <span className="bg-club-gold text-club-dark text-[10px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold">
          Next Match
        </span>
      </div>
  }
  </div>;


const leagueTable = [
{ pos: 1, team: "Cray Wanderers", p: 30, w: 20, d: 5, l: 5, pts: 65 },
{ pos: 2, team: "Hornchurch", p: 30, w: 19, d: 6, l: 5, pts: 63 },
{ pos: 3, team: "Whitehawk", p: 28, w: 18, d: 5, l: 5, pts: 59, highlight: true },
{ pos: 4, team: "Bishop's Stortford", p: 30, w: 17, d: 6, l: 7, pts: 57 },
{ pos: 5, team: "Horsham", p: 29, w: 16, d: 7, l: 6, pts: 55 },
{ pos: 6, team: "Enfield Town", p: 30, w: 15, d: 7, l: 8, pts: 52 },
{ pos: 7, team: "Lewes", p: 29, w: 14, d: 8, l: 7, pts: 50 },
{ pos: 8, team: "Margate", p: 30, w: 13, d: 8, l: 9, pts: 47 },
{ pos: 9, team: "Bognor Regis Town", p: 29, w: 12, d: 9, l: 8, pts: 45 },
{ pos: 10, team: "Folkestone Invicta", p: 30, w: 12, d: 7, l: 11, pts: 43 }];


const FixturesWidget = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Fixtures */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wide text-foreground">
                Men's Fixtures / Results
              </h3>
              <a href="/matches" className="text-xs font-heading uppercase tracking-wider text-primary hover:underline flex items-center gap-1">
                All Matches <ExternalLink size={10} />
              </a>
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {fixtures.map((fixture) =>
              <FixtureRow key={fixture.id} fixture={fixture} />
              )}
            </div>
          </div>

          {/* League Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wide text-foreground">
                Men's First Team League Table
              </h3>
              <a href="/matches" className="text-xs font-heading uppercase tracking-wider text-primary hover:underline flex items-center gap-1">
                League Table <ExternalLink size={10} />
              </a>
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden px-0 py-0 my-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-club-dark text-primary-foreground">
                    <th className="py-2.5 px-3 text-left font-heading text-[10px] uppercase tracking-widest"></th>
                    <th className="py-2.5 px-3 text-left font-heading text-[10px] uppercase tracking-widest">Team</th>
                    <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">P</th>
                    <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">W</th>
                    <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">D</th>
                    <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">L</th>
                    <th className="py-2.5 px-3 text-center font-heading text-[10px] uppercase tracking-widest">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueTable.map((row) =>
                  <tr
                    key={row.pos}
                    className={`border-b border-border text-sm ${
                    row.highlight ?
                    "bg-primary/5 font-bold border-l-4 border-l-primary" :
                    "hover:bg-muted/50"}`
                    }>

                      <td className="py-2.5 px-3 font-heading text-xs text-muted-foreground">{row.pos}</td>
                      <td className={`py-2.5 px-3 font-heading text-xs uppercase tracking-wide ${
                    row.highlight ? "text-primary" : "text-foreground"}`
                    }>
                        {row.team}
                      </td>
                      <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.p}</td>
                      <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.w}</td>
                      <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.d}</td>
                      <td className="py-2.5 px-3 text-center font-body text-xs text-muted-foreground">{row.l}</td>
                      <td className="py-2.5 px-3 text-center font-heading text-xs font-bold text-foreground">{row.pts}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default FixturesWidget;