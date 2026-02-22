import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import heroAtmosphere from "@/assets/hero-atmosphere.jpg";

const nextFixture = {
  competition: "Isthmian League South East",
  opponent: "Bowers & Pitsea",
  opponentShort: "B&P",
  date: "Saturday 1 March 2025",
  time: "3:00 PM",
  venue: "TerraPura Ground",
  homeAway: "H" as const
};

const getCountdown = () => {
  const target = new Date("2025-03-01T15:00:00");
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff % 86400000 / 3600000),
    mins: Math.floor(diff % 3600000 / 60000),
    secs: Math.floor(diff % 60000 / 1000)
  };
};

const CountdownDigit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="flex gap-1">
      {String(value).padStart(2, "0").split("").map((d, i) => (
        <span
          key={i}
          className="w-9 h-12 md:w-12 md:h-16 flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-md font-heading text-2xl md:text-3xl font-bold text-primary-foreground"
        >
          {d}
        </span>
      ))}
    </div>
    <span className="text-[10px] md:text-xs uppercase tracking-wider text-primary-foreground/60 mt-1.5 font-heading">
      {label}
    </span>
  </div>
);

const HeroSection = () => {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroAtmosphere}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      </div>

      <div className="relative container mx-auto px-4 py-14 md:py-20">
        {/* Competition */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-heading text-[10px] md:text-xs uppercase tracking-[0.3em] text-club-gold mb-2"
        >
          {nextFixture.competition}
        </motion.p>

        {/* Date & Time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-primary-foreground/50 font-body text-sm tracking-wide">{nextFixture.date}</p>
          <p className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground mt-1 text-shadow-heavy">
            {nextFixture.time}
          </p>
          <p className="text-primary-foreground/40 font-body text-xs md:text-sm mt-2 tracking-wide">{nextFixture.venue}</p>
        </motion.div>

        {/* Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-8 md:gap-20 mb-10 md:mb-14"
        >
          {/* Home team */}
          <div className="flex flex-col items-center gap-3 min-w-[100px] md:min-w-[160px]">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
              <img
                src="https://whitehawkfc.com/wp-content/uploads/2023/04/cropped-twitter-badge-round.png"
                alt="Whitehawk FC"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>
            <span className="font-heading text-xs md:text-sm uppercase tracking-wider text-primary-foreground font-semibold text-center leading-tight text-shadow">
              Whitehawk FC
            </span>
          </div>

          {/* VS */}
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-club-gold/30 flex items-center justify-center">
              <span className="font-heading text-lg md:text-xl font-bold text-club-gold">VS</span>
            </div>
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-3 min-w-[100px] md:min-w-[160px]">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl">
              <span className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground/40">
                {nextFixture.opponentShort}
              </span>
            </div>
            <span className="font-heading text-xs md:text-sm uppercase tracking-wider text-primary-foreground font-semibold text-center leading-tight text-shadow">
              {nextFixture.opponent}
            </span>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 md:gap-4 mb-10 md:mb-12"
        >
          <CountdownDigit value={countdown.days} label="Days" />
          <span className="text-primary-foreground/20 font-heading text-2xl md:text-3xl font-bold mt-[-16px]">:</span>
          <CountdownDigit value={countdown.hours} label="Hrs" />
          <span className="text-primary-foreground/20 font-heading text-2xl md:text-3xl font-bold mt-[-16px]">:</span>
          <CountdownDigit value={countdown.mins} label="Mins" />
          <span className="text-primary-foreground/20 font-heading text-2xl md:text-3xl font-bold mt-[-16px]">:</span>
          <CountdownDigit value={countdown.secs} label="Secs" />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            to="/matches"
            className="inline-flex items-center gap-3 bg-club-gold hover:bg-club-gold/90 text-club-dark font-heading text-sm md:text-base uppercase tracking-wider px-10 md:px-14 py-4 md:py-4.5 rounded-sm transition-all font-bold shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Ticket size={18} />
            Match Centre
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
