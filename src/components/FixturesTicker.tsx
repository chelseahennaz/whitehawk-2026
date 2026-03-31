import { motion } from "framer-motion";
import { useParsedFixtures } from "@/hooks/useFWP";
import { useSettings } from "@/hooks/useSupabase";
import { format, parseISO } from "date-fns";

const FixturesTicker = () => {
  const { nextMatch, isLoading } = useParsedFixtures();
  const { data: settings } = useSettings("fixtures_ticker");
  
  const shoutText = "UP THE HAWKS!";

  if (settings?.value?.enabled === false) {
    return null;
  }

  const items = Array(6).fill(null);

  // Fallback text while loading or if no next match
  let tickerText = "LOADING NEXT MATCH...";
  
  if (!isLoading) {
    if (nextMatch) {
      const isHome = nextMatch["home-team"].name === "Whitehawk" || nextMatch["home-team"].id === 468;
      const opponent = isHome ? nextMatch["away-team"].name : nextMatch["home-team"].name;
      const hOrA = isHome ? "HOME" : "AWAY";
      const dateStr = format(parseISO(nextMatch.date), "EEE d MMM").toUpperCase();
      const compLabel = nextMatch.competition.name.includes("Isthmian League") ? "LEAGUE" : "CUP";
      tickerText = `NEXT ${hOrA} GAME: ${dateStr} VS. ${opponent.toUpperCase()} (${compLabel}) – ${nextMatch.time} KO`;
    } else {
      tickerText = "NO UPCOMING MATCHES SCHEDULED";
    }
  }

  return (
    <div className="fixed top-[56px] lg:top-[96px] left-0 right-0 z-[45] bg-club-gold overflow-hidden h-7 flex items-center">
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
            <span className="px-4 font-heading uppercase tracking-wider text-club-dark flex items-center gap-2 text-xs font-semibold">
              <span className="inline-block w-3.5 h-3.5 rounded-sm overflow-hidden">
                <img alt="" className="w-full h-full object-contain" src="https://img.icons8.com/?size=100&id=2865&format=png&color=000000" />
              </span>
              {tickerText}
            </span>
            <span className="px-4 font-heading uppercase tracking-widest text-club-gold font-bold text-xs bg-club-dark/90 py-0.5 px-3 rounded-sm">
              {shoutText}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FixturesTicker;
