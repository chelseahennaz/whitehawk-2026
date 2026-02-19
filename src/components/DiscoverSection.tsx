import { motion } from "framer-motion";

const DiscoverSection = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wide text-foreground mb-6">
          Discover
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* About the club */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-lg bg-club-dark p-8 min-h-[250px] flex flex-col justify-end"
          >
            <div className="absolute inset-0 club-gradient opacity-20" />
            <div className="relative z-10">
              <h4 className="font-heading text-lg uppercase tracking-wide text-primary-foreground mb-2">
                About The Club
              </h4>
              <p className="text-primary-foreground/70 text-sm font-body mb-4 max-w-md">
                The club sits within the heart of East Brighton, a community club since 1945. Football brings everyone together — we look forward to seeing you at the TerraPura Ground!
              </p>
              <div className="text-primary-foreground/50 text-xs font-body space-y-1 mb-4">
                <p><strong className="text-primary-foreground/80">Adults</strong> – £10</p>
                <p><strong className="text-primary-foreground/80">Concessions</strong> – £6</p>
                <p><strong className="text-primary-foreground/80">Under 16s</strong> – FREE</p>
              </div>
              <a href="/club" className="inline-flex items-center gap-2 bg-club-gold text-club-dark font-heading text-xs uppercase tracking-wider px-4 py-2 rounded-sm font-semibold hover:bg-primary-foreground transition-colors">
                About
              </a>
            </div>
          </motion.div>

          {/* Volunteers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-lg bg-club-dark p-8 min-h-[250px] flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="relative z-10">
              <h4 className="font-heading text-lg uppercase tracking-wide text-primary-foreground mb-2">
                Volunteers Needed
              </h4>
              <p className="text-primary-foreground/70 text-sm font-body mb-4 max-w-md">
                Whitehawk FC are always on the lookout for additional sets of hands to help with the day to day running of the club.
              </p>
              <div className="text-primary-foreground/50 text-xs font-body space-y-1 mb-4">
                <p>• Matchday Stewards</p>
                <p>• Matchday Support Staff</p>
                <p>• 50:50 Raffle Lead</p>
              </div>
              <a href="/contact" className="inline-flex items-center gap-2 bg-club-gold text-club-dark font-heading text-xs uppercase tracking-wider px-4 py-2 rounded-sm font-semibold hover:bg-primary-foreground transition-colors">
                More Info
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
