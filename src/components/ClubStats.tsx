import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, Shield } from "lucide-react";

const stats = [
  { label: "League Position", value: "3rd", icon: Trophy, sub: "Northern Premier" },
  { label: "Played", value: "28", icon: Shield, sub: "W18 D5 L5" },
  { label: "Goals Scored", value: "54", icon: Target, sub: "Top scorers in division" },
  { label: "Form", value: "WWDWW", icon: TrendingUp, sub: "Last 5 matches" },
];

const ClubStats = () => {
  return (
    <section className="py-12 md:py-16 bg-club-dark">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary-foreground">
            Season Stats
          </h3>
          <div className="h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-5 rounded-lg border border-primary/20 bg-primary/5"
            >
              <stat.icon className="mx-auto mb-2 text-primary" size={24} />
              <p className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">
                {stat.value}
              </p>
              <p className="font-heading text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">
                {stat.label}
              </p>
              <p className="text-[10px] text-primary-foreground/50 font-body mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubStats;
