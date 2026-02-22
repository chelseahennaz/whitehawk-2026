import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const DiscoverSection = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
            Discover
          </h3>
          <div className="h-1 w-12 bg-primary rounded-full mt-2" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* About the club */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-lg bg-club-dark p-8 md:p-10 min-h-[280px] flex flex-col justify-end"
          >
            <div className="absolute inset-0 club-gradient opacity-15 group-hover:opacity-25 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h4 className="font-heading text-xl uppercase tracking-wide text-primary-foreground mb-3 font-bold">
                About The Club
              </h4>
              <p className="text-primary-foreground/60 text-sm font-body mb-5 max-w-md leading-relaxed">
                The club sits within the heart of East Brighton, a community club since 1945. Football brings everyone together — we look forward to seeing you at the TerraPura Ground!
              </p>
              <div className="text-primary-foreground/50 text-xs font-body space-y-1.5 mb-6">
                <p><strong className="text-primary-foreground/80">Adults</strong> – £10</p>
                <p><strong className="text-primary-foreground/80">Concessions</strong> – £6</p>
                <p><strong className="text-primary-foreground/80">Under 16s</strong> – FREE</p>
              </div>
              <a href="/club" className="inline-flex items-center gap-2 bg-club-gold text-club-dark font-heading text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm font-bold hover:bg-club-gold/90 transition-all hover:gap-3">
                About <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* Volunteers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-lg bg-club-dark p-8 md:p-10 min-h-[280px] flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent group-hover:from-primary/25 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-club-gold/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h4 className="font-heading text-xl uppercase tracking-wide text-primary-foreground mb-3 font-bold">
                Volunteers Needed
              </h4>
              <p className="text-primary-foreground/60 text-sm font-body mb-5 max-w-md leading-relaxed">
                Whitehawk FC are always on the lookout for additional sets of hands to help with the day to day running of the club.
              </p>
              <div className="text-primary-foreground/50 text-xs font-body space-y-1.5 mb-6">
                <p>• Matchday Stewards</p>
                <p>• Matchday Support Staff</p>
                <p>• 50:50 Raffle Lead</p>
              </div>
              <a href="/contact" className="inline-flex items-center gap-2 bg-club-gold text-club-dark font-heading text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm font-bold hover:bg-club-gold/90 transition-all hover:gap-3">
                More Info <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
