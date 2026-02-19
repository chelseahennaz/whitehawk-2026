import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import heroImage from "@/assets/hero-stadium.jpg";

interface Slide {
  id: number;
  subtitle: string;
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  image: string;
}

const slides: Slide[] = [
{
  id: 1,
  subtitle: "Welcome to",
  title: "Whitehawk FC",
  description: "Pride, passion, and community in East Brighton since 1945",
  cta: "First Team",
  ctaLink: "/teams",
  image: heroImage
},
{
  id: 2,
  subtitle: "The Hawks",
  title: "A Club For All",
  description: "Men's, Women's, Youth and Walking Football — everyone is welcome",
  cta: "Club History",
  ctaLink: "/club",
  image: heroImage
},
{
  id: 3,
  subtitle: "Match Day",
  title: "TerraPura Ground",
  description: "Come and support the Hawks at our East Brighton home",
  cta: "Tickets",
  ctaLink: "/tickets",
  image: heroImage
}];


const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-club-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }} />

      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-club-dark/80 via-club-dark/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-club-dark/60 via-transparent to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl">

              <p className="font-heading text-base md:text-lg uppercase tracking-widest text-club-gold text-shadow mb-2">
                {slide.subtitle}
              </p>
              <h2 className="font-Poppins text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-primary-foreground text-shadow-heavy leading-none">
                {slide.title}
              </h2>
              <p className="mt-4 text-primary-foreground/80 font-body text-sm md:text-lg max-w-md">
                {slide.description}
              </p>
              <a
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 mt-6 bg-club-gold text-club-dark font-heading text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-primary-foreground transition-colors font-semibold">

                {slide.cta}
                <ExternalLink size={14} />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 left-4 md:left-8 flex items-center gap-2">
        <button
          onClick={prev}
          className="w-10 h-10 flex items-center justify-center border border-primary-foreground/30 text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors rounded-sm">

          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="w-10 h-10 flex items-center justify-center border border-primary-foreground/30 text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors rounded-sm">

          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-4 md:right-8 flex items-center gap-2">
        {slides.map((_, i) =>
        <button
          key={i}
          onClick={() => setCurrent(i)}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
          i === current ? "bg-club-gold" : "bg-primary-foreground/30"}`
          } />

        )}
      </div>
    </section>);

};

export default HeroSection;