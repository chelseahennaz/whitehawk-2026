import { motion } from "framer-motion";

const FixturesTicker = () => {
  const tickerText = "NEXT HOME GAME: SAT 1 MAR VS. BOWERS & PITSEA – 3:00PM KO";
  const shoutText = "UP THE HAWKS!";

  const items = Array(6).fill(null);

  return (
    <div className="fixed top-[56px] md:top-[96px] left-0 right-0 z-[45] bg-club-gold overflow-hidden h-7 flex items-center">
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
        }}>

        {items.map((_, i) =>
        <div key={i} className="flex items-center">
            <span className="px-4 font-heading uppercase tracking-wide text-club-dark flex items-center gap-2 text-lg font-semibold">
              <span className="inline-block w-4 h-4 rounded-sm overflow-hidden">
                <img alt="" className="w-full h-full object-contain" src="https://img.icons8.com/?size=100&id=2865&format=png&color=000000" />
              </span>
              {tickerText}
            </span>
            <span className="px-4 font-heading uppercase tracking-wider text-club-red-dark font-bold text-lg bg-popover-foreground text-club-gold">
              {shoutText}
            </span>
          </div>
        )}
      </motion.div>
    </div>);

};

export default FixturesTicker;