import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

interface Fixture {
  id: number;
  date: string;
  time: string;
  home: string;
  away: string;
  venue: string;
  competition: string;
  result?: string;
  isNext?: boolean;
}

const fixtures: Fixture[] = [
  {
    id: 1,
    date: "SAT 15 FEB",
    time: "15:00",
    home: "Whitehawk",
    away: "Burgess Hill Town",
    venue: "TerraPura Ground",
    competition: "Isthmian League",
    result: "3 - 1",
  },
  {
    id: 2,
    date: "SAT 22 FEB",
    time: "15:00",
    home: "Whitehawk",
    away: "Cheshunt",
    venue: "TerraPura Ground",
    competition: "Isthmian League",
    result: "P - P",
  },
  {
    id: 3,
    date: "SAT 1 MAR",
    time: "15:00",
    home: "Whitehawk",
    away: "Bowers & Pitsea",
    venue: "TerraPura Ground",
    competition: "Isthmian League",
    isNext: true,
  },
  {
    id: 4,
    date: "SAT 8 MAR",
    time: "15:00",
    home: "Horsham",
    away: "Whitehawk",
    venue: "The Camping World Community Stadium",
    competition: "Isthmian League",
  },
];

const FixtureCard = ({ fixture, index }: { fixture: Fixture; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className={`rounded-lg border p-4 transition-all ${
      fixture.isNext
        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
        : "border-border bg-card"
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
        {fixture.competition}
      </span>
      {fixture.isNext && (
        <span className="bg-primary text-primary-foreground text-[10px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-sm">
          Next Match
        </span>
      )}
      {fixture.result && (
        <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
          Full Time
        </span>
      )}
    </div>

    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 text-right">
        <p className={`font-heading text-sm uppercase tracking-wide ${
          fixture.home === "Whitehawk" ? "text-primary font-bold" : "text-foreground"
        }`}>
          {fixture.home}
        </p>
      </div>
      <div className="flex-shrink-0 w-20 text-center">
        {fixture.result ? (
          <span className="font-heading text-lg font-bold text-foreground">{fixture.result}</span>
        ) : (
          <div>
            <p className="font-heading text-xs text-muted-foreground">{fixture.date}</p>
            <p className="font-heading text-lg font-bold text-foreground">{fixture.time}</p>
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className={`font-heading text-sm uppercase tracking-wide ${
          fixture.away === "Whitehawk" ? "text-primary font-bold" : "text-foreground"
        }`}>
          {fixture.away}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3 mt-3 text-muted-foreground">
      <div className="flex items-center gap-1">
        <MapPin size={12} />
        <span className="text-xs font-body">{fixture.venue}</span>
      </div>
      {!fixture.result && (
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span className="text-xs font-body">{fixture.time} KO</span>
        </div>
      )}
    </div>
  </motion.div>
);

const FixturesWidget = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
              Fixtures & Results
            </h3>
            <div className="h-1 w-16 bg-primary rounded-full mt-2" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {fixtures.map((fixture, i) => (
            <FixtureCard key={fixture.id} fixture={fixture} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FixturesWidget;
