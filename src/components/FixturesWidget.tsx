import { useState, useEffect, useMemo } from "react";
import { useParsedFixtures, useFWPLeagueTable } from "@/hooks/useFWP";
import { format, parseISO, differenceInSeconds } from "date-fns";
import type { FWPFixture } from "@/lib/fwp";
import { Link } from "react-router-dom";

const WHK_ID = 468;

const useCountdown = (targetDate: string, targetTime: string) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return useMemo(() => {
    try {
      if (!targetDate || !targetTime) return { d: "00", h: "00", m: "00", s: "00" };
      const target = parseISO(`${targetDate}T${targetTime}:00`);
      const diff = differenceInSeconds(target, now);
      if (diff <= 0) return { d: "00", h: "00", m: "00", s: "00" };
      return {
        d: String(Math.floor(diff / 86400)).padStart(2, "0"),
        h: String(Math.floor((diff % 86400) / 3600)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
        s: String(diff % 60).padStart(2, "0"),
      };
    } catch { return { d: "00", h: "00", m: "00", s: "00" }; }
  }, [now, targetDate, targetTime]);
};

function formatDisplayDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), "EEEE, d MMMM").toUpperCase();
  } catch {
    return "";
  }
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

.fw-widget {
  --bg: #0a0a0a;
  --panel: #111111;
  --line: rgba(255,255,255,0.10);
  --muted: rgba(255,255,255,0.42);
  --text: #f5f5f5;
  --accent: #8e160b;
  --outer: #ffffff;

  background: var(--outer);
  color: var(--text);
  font-family: Inter, Arial, Helvetica, sans-serif;
  padding: 32px 0;
  border-top: 1px solid #eee;
}

.fw-widget * { box-sizing: border-box; }

.fw-widget .wrap {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

.fw-widget .match-strip {
  background: linear-gradient(90deg, #1d1d1f 0%, #141416 18%, #111214 42%, #070708 65%, #101113 100%);
  min-height: 236px;
  display: flex;
  align-items: stretch;
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
}

.fw-widget .strip-inner {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 32px;
  min-height: inherit;
}

.fw-widget .match-strip:first-of-type {
  padding-left: calc((100% - 1400px) / 2 + 16px);
  justify-content: flex-end;
}

.fw-widget .match-strip:last-of-type {
  padding-right: calc((100% - 1400px) / 2 + 16px);
  justify-content: flex-start;
}

@media (max-width: 1400px) {
  .fw-widget .match-strip:first-of-type { padding-left: 16px; }
  .fw-widget .match-strip:last-of-type { padding-right: 16px; }
}

.fw-widget .match-block {
  position: relative;
  flex: 1; 
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  column-gap: 20px;
  align-items: stretch;
  padding: 46px 0 0 24px; 
  border-right: 1px solid rgba(255,255,255,0.03);
}

.fw-widget .match-block.is-next {
  border-left: 1px solid rgba(255,255,255,0.08);
}

.fw-widget .section-label {
  position: absolute;
  top: 14px;
  left: 24px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 20px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #fff;
  pointer-events: none;
}

.fw-widget .date-box {
  background: #2a2a2c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 12px;
  /* height 100% implicitly passed from flex stretch! spans straight to the bottom */
  text-transform: uppercase;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.5px;
}

.fw-widget .date-box .day {
  font-size: 20px;
  line-height: 1;
  color: #fff;
  font-weight: 400;
}

.fw-widget .date-box .month {
  margin-top: 4px;
  font-size: 11px;
  line-height: 1;
  color: rgba(255,255,255,0.78);
  font-weight: 400;
}

.fw-widget .match-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 24px; /* Internal content padding */
  padding-right: 24px;
}

.fw-widget .competition {
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1.8px;
  font-size: 11px;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fw-widget .teams-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  color: #f4f4f4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.fw-widget .teams-row .team-names {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
}
.fw-widget .teams-row .scores {
  color: var(--accent);
  text-align: right;
  flex-shrink: 0;
  font-weight: 700;
}

.fw-widget .standings-wrap {
  margin-top: auto;
  padding-top: 20px;
}

.fw-widget .standings-btn {
  appearance: none;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.65);
  height: 36px;
  min-width: 144px;
  padding: 0 18px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 22px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}
.fw-widget .standings-btn:hover { background: #fff; color: #000; }

.fw-widget .timer-box {
  width: 320px;
  background: #8e160b;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 20;
  transform: translateY(-20px);
  height: 80%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255,255,255,0.15);
}

.fw-widget .countdown {
  font-family: "Bebas Neue", sans-serif;
  font-size: 66px;
  line-height: 0.95;
  letter-spacing: 1px;
  color: #fff;
  margin-bottom: 16px;
  white-space: nowrap;
}

.fw-widget .countdown-sub {
  font-family: "Bebas Neue", sans-serif;
  font-size: 24px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.8);
}

.fw-widget .bottom-link {
  display: flex;
  justify-content: flex-end;
  background: var(--outer);
  padding: 32px 0 0;
}

.fw-widget .fixtures-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: #111;
  text-decoration: none;
  border-top: 1px solid #292929;
  border-bottom: 1px solid #292929;
  padding: 12px 16px 10px;
  min-width: 250px;
  justify-content: center;
  font-family: "Bebas Neue", sans-serif;
  font-size: 24px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: opacity 0.2s;
}
.fw-widget .fixtures-link:hover { opacity: 0.8; }
.fw-widget .fixtures-link .arrow { font-size: 28px; line-height: 1; }

@media (max-width: 1400px) {
  .fw-widget .match-block { padding-left: 16px; column-gap: 14px; }
  .fw-widget .timer-box { width: 320px; padding-left: 20px; padding-right: 20px; }
}

@media (max-width: 1200px) {
  .fw-widget .strip-inner { flex-direction: column; gap: 4px; }
  .fw-widget .match-strip:first-of-type, .fw-widget .match-strip:last-of-type { padding: 0 16px; }
  .fw-widget .match-block { flex: 1; }
  .fw-widget .timer-box { width: 100%; box-shadow: none; border-top: 1px solid rgba(255,255,255,0.05); transform: none; height: auto; }
}

@media (max-width: 800px) {
  .fw-widget { padding: 16px 0; }
  .fw-widget .match-strip { flex-direction: column; min-height: auto; }
  .fw-widget .match-block { flex: 1 1 100%; padding-bottom: 20px; }
  .fw-widget .match-block:not(:first-child) { border-left: none; border-top: 1px solid rgba(255,255,255,0.08); }
  .fw-widget .match-block.is-next { margin-left: 0; border-left: none; border-top: 1px solid rgba(255,255,255,0.08); }
  .fw-widget .countdown { font-size: 48px; }
  .fw-widget .fixtures-link { min-width: 100%; }
}
`;

// Uniform Universal Math Block Component
const MatchBlock = ({ fixture, label, btnLabel, showScore = false, isNext = false }: { fixture?: FWPFixture, label?: string, btnLabel?: string, showScore?: boolean, isNext?: boolean }) => {
  if (!fixture) {
    return (
      <div className={`match-block ${isNext ? 'is-next' : ''}`}>
        {label && <div className="section-label">{label}</div>}
        <div style={{ color: "var(--muted)", textTransform: "uppercase", padding: "60px 24px" }}>
          No match data
        </div>
      </div>
    );
  }

  const home = fixture["home-team"];
  const away = fixture["away-team"];
  let comp = fixture.competition.name;
  if (comp.includes("Isthmian")) comp = "Isthmian";
  const day = format(parseISO(fixture.date), "dd");
  const mon = format(parseISO(fixture.date), "MMM");

  return (
    <article className={`match-block ${isNext ? 'is-next' : ''}`}>
      {label && <div className="section-label">{label}</div>}
      
      <div className="date-box">
        <div className="day">{day}</div>
        <div className="month">{mon}</div>
      </div>

      <div className="match-content">
        <div>
          <div className="competition" title={fixture.competition.name}>{comp} · {fixture.time}</div>
          <div className="teams-row">
            <div className="team-names">
              <span className={home.name === "Whitehawk" || home.id === WHK_ID ? "font-bold" : "font-normal"}>{home.name}</span>
              <br/>
              <span className={away.name === "Whitehawk" || away.id === WHK_ID ? "font-bold" : "font-normal"}>{away.name}</span>
            </div>
            {showScore && (
              <div className="scores">
                {home.score ?? "-"}<br/>{away.score ?? "-"}
              </div>
            )}
          </div>
        </div>
        
        {btnLabel && (
          <div className="standings-wrap">
            <Link to="/matches">
              <button className="standings-btn">{btnLabel}</button>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};

// Main Export
const FixturesWidget = () => {
  const { results, nextMatch, isLoading } = useParsedFixtures();
  const { data: fullTable, isLoading: tableLoading } = useFWPLeagueTable();
  const displayTable = useMemo(() => {
    if (!fullTable || fullTable.length === 0) return [];
    const whkIndex = fullTable.findIndex(r => r.id === WHK_ID);
    
    // If not found, show top 5
    if (whkIndex === -1) return fullTable.slice(0, 5);

    // Center logic: Try to have WHK at index 2 (the middle of 5)
    let start = whkIndex - 2;
    // Top 3 case: if WHK is pos 1, 2, or 3, start will be <= 0, clamp to 0
    if (start < 0) start = 0;
    
    let end = start + 5;
    // Bottom 3 case: if end exceeds table length, clamp end and shift start back
    if (end > fullTable.length) {
      end = fullTable.length;
      start = Math.max(0, end - 5);
    }
    
    return fullTable.slice(start, end);
  }, [fullTable]);
  const lastTwo = useMemo(() => results.slice(0, 2).reverse(), [results]);
  const cd = useCountdown(nextMatch?.date || "", nextMatch?.time || "");
  const nextMatchDisplayDate = nextMatch ? formatDisplayDate(nextMatch.date) : "N/A";

  return (
    <section>
      <style>{css}</style>

      <div className="fw-widget">
        <div className="strip-inner">
          <section className="match-strip flex-1">
            <MatchBlock 
              fixture={lastTwo[0]} 
              label="LAST MATCHES:" 
              btnLabel="MATCHROOM" 
              showScore 
            />
            
            <MatchBlock 
              fixture={lastTwo[1]} 
              btnLabel="MATCHROOM" 
              showScore 
            />
          </section>

          <section className="match-strip flex-1">
            <MatchBlock 
              fixture={nextMatch || undefined} 
              label="NEXT MATCH:" 
              btnLabel="STANDINGS" 
              showScore={false} 
              isNext
            />

            <div className="timer-box">
              {nextMatch ? (
                <>
                  <div className="countdown" id="countdown">
                    {cd.d}:{cd.h}:{cd.m}:{cd.s}
                  </div>
                  <div className="countdown-sub" id="countdownDate">{nextMatchDisplayDate}</div>
                </>
              ) : (
                <>
                  <div className="countdown" id="countdown">00:00:00:00</div>
                  <div className="countdown-sub" id="countdownDate">AWAITING FIXTURE</div>
                </>
              )}
            </div>
          </section>
        </div>

        <div className="wrap">
          <div className="bottom-link">
            <Link to="/matches" className="fixtures-link">
              <span className="arrow">→</span>
              <span>FIXTURES AND RESULTS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* League Table Component below the widget block */}
      <div style={{ padding: "60px 0", background: "#ffffff", borderTop: "1px solid #f0f0f0" }}>
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 pb-4">
            <div>
              <h2 className="font-heading text-4xl md:text-6xl text-[#141b2b] uppercase tracking-wider leading-none">
                Men's First Team League Table
              </h2>
              <div className="h-1 w-12 bg-club-gold mt-4" />
            </div>
          </div>
          
          <div className="bg-white border border-[#e5e5e5] rounded-none overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#141b2b] text-white">
                    <th className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center w-12">#</th>
                    <th className="py-4 px-4 font-heading text-sm uppercase tracking-widest min-w-[200px]">Team</th>
                    {["P", "W", "D", "L", "F", "A", "+/-", "Pts"].map(h => (
                      <th key={h} className="py-4 px-3 font-heading text-sm uppercase tracking-widest text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableLoading ? (
                    <tr><td colSpan={10} className="py-20 text-center text-muted-foreground font-heading text-sm uppercase tracking-widest animate-pulse">Loading Table Data…</td></tr>
                  ) : displayTable.map(row => {
                    const isWhk = row.name === "Whitehawk" || row.id === WHK_ID;
                    return (
                      <tr 
                        key={row.id} 
                        className={`transition-colors border-b border-[#eee] ${
                          isWhk ? "bg-[#8e160b] text-white font-bold" : "hover:bg-[#f8f8f8] text-[#333]"
                        }`}
                      >
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row.position}</td>
                        <td className="py-4 px-4 font-heading text-lg uppercase tracking-widest">
                          {row.name}
                        </td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].played}</td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].won}</td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].drawn}</td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].lost}</td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].for}</td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"].against}</td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["all-matches"]["goal-difference"] > 0 ? `+${row["all-matches"]["goal-difference"]}` : row["all-matches"]["goal-difference"]}</td>
                        <td className="py-4 px-3 text-center font-heading text-lg tracking-widest">{row["total-points"]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* League Table CTA - inline styles matching All News / Fixtures & Results */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "32px", borderTop: "1px solid #e5e5e5" }}>
            <Link
              to="/matches"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                color: "#111",
                textDecoration: "none",
                borderTop: "1px solid #292929",
                borderBottom: "1px solid #292929",
                padding: "12px 16px 10px",
                minWidth: "250px",
                justifyContent: "center",
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: "24px",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <span style={{ fontSize: "28px", lineHeight: "1" }}>→</span>
              <span>LEAGUE TABLE</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FixturesWidget;
