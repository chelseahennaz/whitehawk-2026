import { motion } from "framer-motion";

interface TickerFixture {
  id: number;
  home: string;
  away: string;
  date: string;
  competition: string;
  result?: string;
  isNext?: boolean;
}

const tickerFixtures: TickerFixture[] = [
  { id: 1, home: "Whitehawk", away: "Burgess Hill Town", date: "SAT 15 FEB", competition: "Isthmian League", result: "3 - 1" },
  { id: 2, home: "Whitehawk", away: "Cheshunt", date: "SAT 22 FEB", competition: "Isthmian League", result: "P - P" },
  { id: 3, home: "Whitehawk", away: "Bowers & Pitsea", date: "SAT 1 MAR", competition: "Isthmian League", isNext: true },
  { id: 4, home: "Horsham", away: "Whitehawk", date: "SAT 8 MAR", competition: "Isthmian League" },
  { id: 5, home: "Whitehawk", away: "Lewes", date: "SAT 15 MAR", competition: "Isthmian League" },
  { id: 6, home: "Enfield Town", away: "Whitehawk", date: "SAT 22 MAR", competition: "Isthmian League" },
];

const TickerItem = ({ fixture }: { fixture: TickerFixture }) => {
  const isWhitehawkHome = fixture.home === "Whitehawk";
  
  return (
    <div className="flex items-center gap-3 px-4 whitespace-nowrap">
      <span className="text-[10px] font-heading uppercase tracking-widest text-primary-foreground/50">
        {fixture.date}
      </span>
      <div className="flex items-center gap-2">
        <span className={`font-heading text-xs uppercase tracking-wide ${
          isWhitehawkHome ? "text-primary font-bold" : "text-primary-foreground/80"
        }`}>
          {fixture.home}
        </span>
        {fixture.result ? (
          <span className="font-heading text-xs font-bold text-primary-foreground bg-primary-foreground/10 px-2 py-0.5 rounded">
            {fixture.result}
          </span>
        ) : fixture.isNext ? (
          <span className="font-heading text-[10px] font-bold text-club-dark bg-club-gold px-2 py-0.5 rounded">
            NEXT
          </span>
        ) : (
          <span className="font-heading text-xs text-primary-foreground/40">vs</span>
        )}
        <span className={`font-heading text-xs uppercase tracking-wide ${
          !isWhitehawkHome ? "text-primary font-bold" : "text-primary-foreground/80"
        }`}>
          {fixture.away}
        </span>
      </div>
      <div className="w-px h-3 bg-primary-foreground/20" />
    </div>
  );
};

const FixturesTicker = () => {
  const items = [...tickerFixtures, ...tickerFixtures]; // duplicate for seamless loop

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-club-dark/95 backdrop-blur-sm border-b border-primary/20 overflow-hidden h-7 flex items-center">
      <motion.div
        className="flex items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {items.map((fixture, i) => (
          <TickerItem key={`${fixture.id}-${i}`} fixture={fixture} />
        ))}
      </motion.div>
    </div>
  );
};

export default FixturesTicker;
