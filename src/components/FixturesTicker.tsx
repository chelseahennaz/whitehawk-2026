import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParsedFixtures } from "@/hooks/useFWP";
import { useSettings } from "@/hooks/useSupabase";
import { format, parseISO, differenceInSeconds } from "date-fns";

const FixturesTicker = () => {
  const { data: settings, isLoading: settingsLoading } = useSettings("fixtures_ticker");
  const { data: heroSettings } = useSettings("homepage_hero");
  const { nextMatch, isLoading: matchLoading } = useParsedFixtures();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    if (!nextMatch) return null;
    const target = parseISO(`${nextMatch.date}T${nextMatch.time}:00`);
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      mins: Math.floor((diff % 3600) / 60),
      secs: diff % 60
    };
  }, [nextMatch, now]);
  
  // Prevent flicker: don't show anything while settings are loading
  // and only show if explicitly enabled.
  if (settingsLoading || settings?.value?.enabled !== true) {
    return null;
  }

  // Get current device hero settings
  const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;
  const hSettings = heroSettings?.value;
  const deviceHero = hSettings ? (isMobileView ? (hSettings.mobile || hSettings) : (hSettings.desktop || hSettings)) : null;
  
  const isSolidHero = deviceHero?.background_type === "color";
  const heroColor = deviceHero?.background_color || "#8e160b";

  const items = Array(6).fill(null);
  
  const isCancelled = nextMatch?.status?.short === "CANC";
  const isPostponed = nextMatch?.status?.short === "P-P";

  // Text content logic...
  let tickerText = "LOADING NEXT MATCH...";
  if (!matchLoading) {
    if (nextMatch) {
      const isHome = nextMatch["home-team"].name === "Whitehawk" || nextMatch["home-team"].id === 468;
      const opponent = isHome ? nextMatch["away-team"].name : nextMatch["home-team"].name;
      const hOrA = isHome ? "HOME" : "AWAY";
      const dateStr = format(parseISO(nextMatch.date), "EEE d MMM").toUpperCase();
      const compLabel = nextMatch.competition.name.includes("Isthmian League") ? "LEAGUE" : "CUP";
      
      if (isCancelled) {
        tickerText = `⚠️ MATCH CANCELLED: ${dateStr} VS. ${opponent.toUpperCase()} (${compLabel}) – DO NOT TRAVEL`;
      } else if (isPostponed) {
        tickerText = `⚠️ MATCH POSTPONED: ${dateStr} VS. ${opponent.toUpperCase()} (${compLabel}) – NEW DATE TBC`;
      } else {
        let countdownStr = "";
        if (countdown) {
          countdownStr = ` – IN ${countdown.days}D ${String(countdown.hours).padStart(2,'0')}H ${String(countdown.mins).padStart(2,'0')}M ${String(countdown.secs).padStart(2,'0')}S`;
        }
        
        tickerText = `NEXT ${hOrA} GAME: ${dateStr} VS. ${opponent.toUpperCase()} (${compLabel}) – ${nextMatch.time} KO${countdownStr}`;
      }
    } else {
      tickerText = "NO UPCOMING MATCHES SCHEDULED";
    }
  }

  const shoutText = isCancelled ? "MATCH CANCELLED" : isPostponed ? "MATCH POSTPONED" : "UP THE HAWKS!";

  const barBg = isCancelled 
    ? "#dc2626" 
    : isPostponed 
    ? "#d97706" 
    : (isSolidHero ? heroColor : "var(--club-gold, #e8c32a)");

  const textColor = (isCancelled || isPostponed)
    ? "#ffffff"
    : (isSolidHero ? "#ffffff" : "#141b2b");

  return (
    <div 
      className="fixed top-[56px] lg:top-[96px] left-0 right-0 z-[45] overflow-hidden h-7 flex items-center transition-colors duration-500"
      style={{ backgroundColor: barBg }}
    >
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 45,
            ease: "linear"
          }
        }}
      >
        {items.map((_, i) => (
          <div key={i} className="flex items-center">
            <span 
              className="px-4 font-heading uppercase tracking-wider flex items-center gap-2 text-xs font-semibold"
              style={{ color: textColor }}
            >
              <span className="inline-block w-3.5 h-3.5 rounded-sm overflow-hidden">
                <img 
                  alt="" 
                  className="w-full h-full object-contain" 
                  src={`https://img.icons8.com/?size=100&id=2865&format=png&color=${(isCancelled || isPostponed || isSolidHero) ? 'ffffff' : '000000'}`} 
                />
              </span>
              {tickerText}
            </span>
            <span 
              className="px-4 font-heading uppercase tracking-widest font-bold text-xs py-0.5 px-3 rounded-sm"
              style={{ 
                backgroundColor: (isCancelled || isPostponed) ? 'rgba(0,0,0,0.3)' : (isSolidHero ? 'rgba(255,255,255,0.1)' : '#141b2b'),
                color: (isCancelled || isPostponed) ? '#ffffff' : (isSolidHero ? '#ffffff' : '#e8c32a')
              }}
            >
              {shoutText}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FixturesTicker;
