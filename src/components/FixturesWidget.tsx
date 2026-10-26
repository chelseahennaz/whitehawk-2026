import { useState, useEffect, useMemo } from "react";
import { useParsedFixtures } from "@/hooks/useFWP";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { type FWPFixture } from "@/lib/fwp";
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
  background: #141b2b;
  min-height: 236px;
  display: flex;
  align-items: stretch;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
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
  font-size: 26px;
  letter-spacing: 0.8px;
  line-height: 1;
  text-transform: uppercase;
  color: #fff;
  pointer-events: none;
}

.fw-widget .date-box {
  background: #0d121c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 12px;
  text-transform: uppercase;
  font-family: "Bebas Neue", sans-serif;
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
  font-size: 14px;
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
  color: #facc15;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 14px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fw-widget .teams-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-family: "Bebas Neue", sans-serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 1;
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
  const isPostponed = fixture.status?.short === "P-P";
  const isCancelled = fixture.status?.short === "CANC";

  return (
    <article className={`match-block ${isNext ? 'is-next' : ''}`}>
      {label && <div className="section-label">{label}</div>}
      
      <div className="date-box">
        <div className="day">{day}</div>
        <div className="month">{mon}</div>
      </div>

      <div className="match-content">
        <div>
          <div className="competition" title={fixture.competition.name}>
            {comp} · {fixture.time}
            {isCancelled && <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] tracking-wider font-bold">CANCELLED</span>}
            {isPostponed && <span className="ml-2 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] tracking-wider font-bold">POSTPONED</span>}
          </div>
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
        
        {isCancelled ? (
          <div className="standings-wrap">
            <span className="inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider">
              Match Cancelled
            </span>
          </div>
        ) : isPostponed ? (
          <div className="standings-wrap">
            <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider">
              Match Postponed
            </span>
          </div>
        ) : btnLabel && (
          <div className="standings-wrap">
            <Link to={
              btnLabel === "STANDINGS" ? "/standings" 
              : btnLabel === "REPORT" ? `/match-report/${fixture.id}` 
              : btnLabel === "PREVIEW" || btnLabel === "MATCH CENTER" ? `/match-center/${fixture.id}` 
              : "/matches"
            }>
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
  const { results, nextMatch } = useParsedFixtures();
  const lastTwo = useMemo(() => results.slice(0, 2).reverse(), [results]);
  const cd = useCountdown(nextMatch?.date || "", nextMatch?.time || "");
  const nextMatchDisplayDate = nextMatch ? formatDisplayDate(nextMatch.date) : "N/A";
  const isNextCancelled = nextMatch?.status?.short === "CANC";
  const isNextPostponed = nextMatch?.status?.short === "P-P";

  return (
    <section>
      <style>{css}</style>

      <div className="fw-widget">
        <div className="strip-inner">
          <section className="match-strip flex-1">
            <MatchBlock 
              fixture={lastTwo[0]} 
              label="LAST MATCHES" 
              btnLabel="REPORT" 
              showScore 
            />
            
            <MatchBlock 
              fixture={lastTwo[1]} 
              btnLabel="REPORT" 
              showScore 
            />
          </section>

          <section className="match-strip flex-1">
            <MatchBlock 
              fixture={nextMatch || results[0]} 
              label={nextMatch ? "NEXT MATCH" : "LATEST RESULT"} 
              btnLabel={nextMatch ? "PREVIEW" : "REPORT"} 
              showScore={!nextMatch} 
              isNext
            />

            <div 
              className="timer-box"
              style={{
                backgroundColor: isNextCancelled ? "#dc2626" : isNextPostponed ? "#d97706" : undefined
              }}
            >
              {nextMatch ? (
                isNextCancelled ? (
                  <>
                    <div className="countdown" style={{ fontSize: "44px" }}>CANCELLED</div>
                    <div className="countdown-sub">Match Will Not Be Played</div>
                  </>
                ) : isNextPostponed ? (
                  <>
                    <div className="countdown" style={{ fontSize: "44px" }}>POSTPONED</div>
                    <div className="countdown-sub">New Date To Be Confirmed</div>
                  </>
                ) : (
                  <>
                    <div className="countdown" id="countdown">
                      {cd.d}:{cd.h}:{cd.m}:{cd.s}
                    </div>
                    <div className="countdown-sub" id="countdownDate">{nextMatchDisplayDate}</div>
                  </>
                )
              ) : (
                <>
                  <div className="countdown" id="countdown">FT</div>
                  <div className="countdown-sub" id="countdownDate">Season in Progress</div>
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

    </section>
  );
};

export default FixturesWidget;
