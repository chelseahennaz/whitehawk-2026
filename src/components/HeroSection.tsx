import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Loader2, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import heroAtmosphere from "@/assets/hero-atmosphere.jpg";
import clubBadge from "@/assets/club-badge.png";
import { useParsedFixtures } from "@/hooks/useFWP";
import { useSettings, usePosts } from "@/hooks/useSupabase";
import { getTeamBadgeUrl } from "@/lib/fwp";
import { format, parseISO, differenceInSeconds } from "date-fns";

export const getHeroHeightClass = (size?: string) => {
  switch (size) {
    case "compact": return "h-[500px] md:h-[650px]";
    case "large": return "h-[800px] md:h-[1000px]";
    case "fullscreen": return "h-[100svh]";
    case "standard":
    default: return "h-[700px] md:h-[850px]";
  }
};

const CountdownDigit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="flex gap-1">
      {String(Math.max(0, value)).padStart(2, "0").split("").map((d, i) => (
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

const MatchHero = ({ customImage, bgType = "image", bgColor = "#8e160b", imagePosition = 50 }: { customImage?: string | null, bgType?: string, bgColor?: string, imagePosition?: number }) => {
  const { nextMatch, isLoading } = useParsedFixtures();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    if (!nextMatch) return { days: 0, hours: 0, mins: 0, secs: 0 };
    const target = parseISO(`${nextMatch.date}T${nextMatch.time}:00`);
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      mins: Math.floor((diff % 3600) / 60),
      secs: diff % 60
    };
  }, [nextMatch, now]);

  if (isLoading) return (
    <div className="h-full w-full flex items-center justify-center bg-club-dark">
      <Loader2 className="w-8 h-8 text-[#8e160b] animate-spin" />
    </div>
  );

  if (!nextMatch) return null;

  const homeTeam = nextMatch["home-team"];
  const awayTeam = nextMatch["away-team"];
  const competition = nextMatch.competition.name.includes("Isthmian") ? "Isthmian League Premier" : nextMatch.competition.name;

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col justify-end pt-14 pb-16 md:pb-24">
      <div className="absolute inset-0">
        {bgType === "color" ? (
          <div className="w-full h-full" style={{ backgroundColor: bgColor }} />
        ) : (
          <>
            <img 
              src={customImage || heroAtmosphere} 
              alt="" 
              className="w-full h-full object-cover" 
              style={{ objectPosition: `center ${imagePosition}%` }}
            />
            {/* Gradient fades from left-to-right to give text on the left perfect contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-club-dark via-club-dark/90 to-black/40 md:bg-gradient-to-r md:from-black/95 md:via-black/70 md:to-transparent" />
          </>
        )}
      </div>

      <div className="relative container mx-auto px-4 md:px-12 flex flex-col justify-end h-full max-w-7xl">
        
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-stretch gap-6 md:gap-10 mb-10 md:mb-14">
          
          {/* Gigantic Date Box aligned left */}
          <div className="bg-[#8e160b] flex flex-col items-center justify-start pt-4 md:pt-6 px-4 md:px-6 border-l-[6px] border-[#141b2b] shadow-2xl min-w-[80px] md:min-w-[110px]">
            <span className="font-heading text-4xl md:text-[60px] text-white leading-none">{format(parseISO(nextMatch.date), "dd")}</span>
            <span className="font-heading text-xl md:text-[24px] text-white/70 mt-2 md:mt-3">{format(parseISO(nextMatch.date), "MMM")}</span>
          </div>

          {/* Teams Text Block */}
          <div className="flex flex-col justify-center">
            <p className="font-heading text-xs md:text-lg text-[#facc15] tracking-[0.2em] mb-2 md:mb-4 uppercase">
              {competition} · {nextMatch.time}
            </p>
            <div className="font-heading text-4xl md:text-[70px] lg:text-[85px] leading-[0.9] text-white drop-shadow-xl uppercase">
              <span className="block truncate">{homeTeam.name}</span>
              <span className="block truncate">{awayTeam.name}</span>
            </div>
          </div>

        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center gap-6 md:gap-10">
          
          <Link to="/matches" className="bg-transparent border border-white/60 hover:bg-white hover:text-black text-white font-heading text-lg md:text-xl uppercase tracking-wider px-8 py-3 transition-all whitespace-nowrap">
            Match Centre
          </Link>

          {/* Simple Inline Countdown */}
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 border border-white/10">
             <div className="text-center"><span className="font-heading text-2xl md:text-3xl text-white">{String(countdown.days).padStart(2,'0')}</span><span className="block text-[8px] md:text-[10px] text-white/50 font-heading tracking-widest mt-0.5">DAYS</span></div>
             <span className="font-heading text-xl md:text-2xl text-white/20 mb-3">:</span>
             <div className="text-center"><span className="font-heading text-2xl md:text-3xl text-white">{String(countdown.hours).padStart(2,'0')}</span><span className="block text-[8px] md:text-[10px] text-white/50 font-heading tracking-widest mt-0.5">HRS</span></div>
             <span className="font-heading text-xl md:text-2xl text-white/20 mb-3">:</span>
             <div className="text-center"><span className="font-heading text-2xl md:text-3xl text-white">{String(countdown.mins).padStart(2,'0')}</span><span className="block text-[8px] md:text-[10px] text-white/50 font-heading tracking-widest mt-0.5">MIN</span></div>
             <span className="font-heading text-xl md:text-2xl text-white/20 mb-3">:</span>
             <div className="text-center"><span className="font-heading text-2xl md:text-3xl text-white">{String(countdown.secs).padStart(2,'0')}</span><span className="block text-[8px] md:text-[10px] text-white/50 font-heading tracking-widest mt-0.5">SEC</span></div>
          </div>
          
        </motion.div>

      </div>
    </div>
  );
};

const LatestPostsHero = () => {
  const { data: posts, isLoading } = usePosts();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  const items = useMemo(() => posts?.slice(0, 3) || [], [posts]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (isLoading) return (
    <div className="h-full w-full flex items-center justify-center bg-club-dark">
      <Loader2 className="w-8 h-8 text-[#8e160b] animate-spin" />
    </div>
  );

  return (
    <div className="relative h-full w-full group overflow-hidden">
      <div className="embla overflow-hidden h-full" ref={emblaRef}>
        <div className="embla__container h-full [&>div]:h-full flex">
          {items.map((post) => (
            <div key={post.id} className="embla__slide flex-[0_0_100%] h-full relative">
              <div className="absolute inset-0">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/90" />
              </div>
              <div className="relative h-full flex flex-col justify-center px-4 md:px-20 max-w-5xl mx-auto">
                 <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-4">
                    <span className="bg-[#8e160b] text-white text-[10px] font-heading uppercase tracking-[0.3em] px-3 py-1 rounded font-bold inline-block mb-2">
                       {post.category}
                    </span>
                    <h2 className="font-heading text-4xl md:text-7xl font-bold uppercase text-primary-foreground leading-none tracking-tight">
                       {post.title}
                    </h2>
                    <p className="text-primary-foreground/70 font-body text-base md:text-lg max-w-xl line-clamp-2">
                       {post.excerpt}
                    </p>
                    <div className="pt-6">
                       <Link to={`/news/${post.slug}`} className="group/btn inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-primary-foreground font-heading text-sm uppercase tracking-widest px-8 py-4 rounded-sm transition-all border-b-2 border-b-[#8e160b]">
                          Read Story <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
         <ChevronLeft size={24} />
      </button>
      <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
         <ChevronRight size={24} />
      </button>

      {/* Progress indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
         {items.map((_, i) => (
           <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
         ))}
      </div>
    </div>
  );
};

const CombinedHero = ({ customImage, bgType, bgColor, imagePosition }: { customImage?: string | null, bgType?: string, bgColor?: string, imagePosition?: number }) => {
  const [step, setStep] = useState<"match" | "posts">("match");

  useEffect(() => {
    const timer = setTimeout(() => setStep("posts"), 8000); // Show match for 8s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        {step === "match" ? (
          <motion.div key="match" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 1 }} className="h-full">
            <MatchHero customImage={customImage} bgType={bgType} bgColor={bgColor} imagePosition={imagePosition} />
          </motion.div>
        ) : (
          <motion.div key="posts" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="h-full">
            <LatestPostsHero />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroSection = () => {
  const { data: settings, isLoading } = useSettings("homepage_hero");

  if (isLoading) return (
    <section className="relative h-[700px] md:h-[850px] bg-club-dark flex items-center justify-center">
       <Loader2 className="w-10 h-10 animate-spin text-[#8e160b]" />
    </section>
  );

  const mode = settings?.value?.mode || "match";
  const customImage = settings?.value?.custom_image_url;
  const bgType = settings?.value?.background_type || "image";
  const bgColor = settings?.value?.background_color || "#8e160b";
  const imagePosition = settings?.value?.image_position !== undefined ? settings?.value?.image_position : 50;
  const heroSize = settings?.value?.hero_size || "standard";
  const heightClass = getHeroHeightClass(heroSize);

  return (
    <section className={`relative ${heightClass} bg-club-dark overflow-hidden`}>
      {/* Top Overlay for Black Fade Transition */}
      {bgType === "image" && (
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/40 to-transparent z-10 pointer-events-none" />
      )}
      
      {mode === "match" && <MatchHero customImage={customImage} bgType={bgType} bgColor={bgColor} imagePosition={imagePosition} />}
      {mode === "posts" && <LatestPostsHero />}
      {mode === "combined" && <CombinedHero customImage={customImage} bgType={bgType} bgColor={bgColor} imagePosition={imagePosition} />}
    </section>
  );
};

export default HeroSection;
