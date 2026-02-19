import { motion } from "framer-motion";
import heroImage from "@/assets/hero-stadium.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-club-dark via-club-dark/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-club-dark/40 to-transparent" />

      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-12 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-block bg-primary px-3 py-1 rounded-sm mb-4">
              <span className="font-heading text-xs uppercase tracking-widest text-primary-foreground font-semibold">
                Match Day
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase text-primary-foreground text-shadow leading-tight">
              Welcome to
              <br />
              <span className="text-primary">Whitehawk FC</span>
            </h2>
            <p className="mt-4 text-primary-foreground/80 font-body text-sm md:text-base max-w-md">
              The Hawks. Pride, passion, and community in East Brighton since 1945.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
