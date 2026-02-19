import { motion } from "framer-motion";

const FixturesTicker = () => {
  const tickerText = "NEXT HOME GAME: SAT 1 MAR VS. BOWERS & PITSEA – 3:00PM KO";
  const shoutText = "UP THE HAWKS!";

  const items = Array(6).fill(null);

  return (
    <div className="fixed top-0 md:top-[105px] left-0 right-0 z-[55] bg-club-gold overflow-hidden h-7 flex items-center">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear"
          }
        }}>

        {items.map((_, i) =>
        <div key={i} className="flex items-center">
            <span className="px-4 font-heading text-xs uppercase tracking-wide text-club-dark font-semibold flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-sm overflow-hidden">
                <img src="/favicon.ico" alt="" className="w-full h-full object-contain" />
              </span>
              {tickerText}
            </span>
            <span className="px-4 font-heading text-xs uppercase tracking-wider text-club-red-dark font-bold">
              {shoutText}
            </span>
          </div>
        )}
      </motion.div>
    </div>);

};

export default FixturesTicker;