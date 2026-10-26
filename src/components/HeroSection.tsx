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
import { useIsMobile } from "@/hooks/use-mobile";
import { getTeamBadgeUrl, isMatchLive } from "@/lib/fwp";
import { format, parseISO, differenceInSeconds } from "date-fns";

export const getResponsiveHeroHeightClass = (mobileSize?: string, desktopSize?: string) => {
  const getMobileHeight = (s?: string) => {
    switch (s) {
      case "compact": return "h-[350px]";
      case "large": return "h-[750px]";
      case "fullscreen": return "h-[100svh]";
      default: return "h-[420px]";
    }
  };
  const getDesktopHeight = (s?: string) => {
    switch (s) {
      case "compact": return "md:h-[450px]";
      case "large": return "md:h-[900px]";
      case "fullscreen": return "md:h-[100svh]";
      default: return "md:h-[88vh]";
    }
  };
  return `${getMobileHeight(mobileSize)} ${getDesktopHeight(desktopSize)}`;
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

const letterVariants = {
  hidden: { opacity: 0, x: -2 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.01 }
  },
};

const typedLineVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // Slower typing
    },
  },
};

const restVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 2.8, // Wait for line 1 + line 2 to finish typing
    } as any,
  },
};

const line2Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 1.4, // Start after Home Team Name finishes
    },
  },
};

const formatHeroTeamName = (rawName?: string, isMobile: boolean = false) => {
  if (!rawName) return "TBD";
  if (rawName.toLowerCase().includes("whitehawk")) return "HAWKS";

  const cleaned = rawName.trim();
  
  if (isMobile) {
    if (cleaned.length <= 12) return cleaned;
    const words = cleaned.split(" ");
    if (words[0].toLowerCase() === "st" && words.length > 1) {
      return `${words[0]} ${words[1]}`;
    }
    return words[0].length >= 4 ? words[0] : cleaned.substring(0, 12);
  }

  // Desktop / Laptop: fit full name up to 18 characters
  if (cleaned.length <= 18) {
    return cleaned;
  }

  // Abbreviate common long suffixes if over 18 characters
  const abbreviated = cleaned
    .replace(/Athletic/gi, "Ath")
    .replace(/Borough/gi, "Boro")
    .replace(/Community/gi, "Comm");
    
  if (abbreviated.length <= 18) {
    return abbreviated;
  }

  return cleaned.substring(0, 18).trim();
};

const MatchHero = ({ settings }: { settings: any }) => {
  const { 
    custom_image_url: customImage, 
    background_type: bgType = "image", 
    background_color: bgColor = "#8e160b", 
    image_position: imagePosition = 50 
  } = settings || {};

  const { fixtures, results, isLoading } = useParsedFixtures();

  // Priority 1: Any live Whitehawk match (home or away)
  const allKnown = [...(fixtures || []), ...(results || [])];
  const liveMatch = allKnown.find(m => {
    const isWhk = m["home-team"]?.id === 468 || m["away-team"]?.id === 468 ||
                  m["home-team"]?.name?.toLowerCase()?.includes("whitehawk") ||
                  m["away-team"]?.name?.toLowerCase()?.includes("whitehawk");
    return isWhk && isMatchLive(m);
  }) || null;

  // Priority 2: Next home match
  const nextHomeMatch = !liveMatch
    ? (fixtures?.find(m => m["home-team"]?.name?.toLowerCase()?.includes("whitehawk") || m["home-team"]?.id === 468) || null)
    : null;

  const displayMatch = liveMatch || nextHomeMatch || (results && results.length > 0 ? results[0] : null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    if (!nextHomeMatch) return { days: 0, hours: 0, mins: 0, secs: 0 };
    const target = parseISO(`${nextHomeMatch.date}T${nextHomeMatch.time}:00`);
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      mins: Math.floor((diff % 3600) / 60),
      secs: diff % 60
    };
  }, [nextHomeMatch, now]);

  if (isLoading) return (
    <div className="h-full w-full flex items-center justify-center bg-club-dark">
      <Loader2 className="w-8 h-8 text-[#8e160b] animate-spin" />
    </div>
  );

  if (!displayMatch) return null;
  const isPastMatch = !nextHomeMatch && !!displayMatch;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  
  const statusShort = displayMatch.status?.short || "";
  const isLive = isMatchLive(displayMatch);
  const matchTime = displayMatch.status?.full || "";
  const isPostponed = statusShort === "P-P";
  const isCancelled = statusShort === "CANC";

  return (
    <div className={`relative h-full w-full overflow-hidden flex flex-col justify-center md:justify-end pb-6 md:pb-12 pt-14`}>
      <div className="absolute inset-0">
        {bgType === "color" ? (
          <div className="w-full h-full relative" style={{ backgroundColor: bgColor }}>
            {/* Super subtle branding accent */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${isMobile ? "opacity-[0.02] -right-1/4 scale-150" : "opacity-[0.03]"}`}>
              <img src={clubBadge} alt="" className="w-full max-w-none grayscale brightness-0 invert" />
            </div>
          </div>
        ) : (
          <>
            <img 
              src={customImage || heroAtmosphere} 
              alt="" 
              className="w-full h-full object-cover" 
              style={{ objectPosition: `center ${imagePosition}%` }}
            />
            {/* Gradient fades from top-to-bottom and left-to-right for desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-club-dark via-club-dark/80 to-black/40 md:bg-gradient-to-r md:from-black/95 md:via-black/70 md:to-transparent" />
            {isLive && (
              <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse-slow" />
            )}
            {isCancelled && (
              <div className="absolute inset-0 bg-red-950/30 pointer-events-none" />
            )}
            {isPostponed && (
              <div className="absolute inset-0 bg-amber-950/20 pointer-events-none" />
            )}
          </>
        )}
      </div>

      <div className="relative container mx-auto px-6 md:px-12 flex flex-col h-full max-w-7xl justify-center md:justify-end">
        
        {/* Typographic Hero Reveal (Unified Style) */}
        <div className="flex flex-col items-start gap-0">
          <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.5 }}
             className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-4"
          >
             {isCancelled ? (
               <span className="bg-red-600 text-white font-heading font-black text-xs md:text-sm px-3 py-1 rounded uppercase tracking-widest shadow-lg">
                 ⚠️ MATCH CANCELLED
               </span>
             ) : isPostponed ? (
               <span className="bg-amber-500 text-white font-heading font-black text-xs md:text-sm px-3 py-1 rounded uppercase tracking-widest shadow-lg">
                 ⚠️ MATCH POSTPONED
               </span>
             ) : (
               <span className="font-heading text-sm md:text-base uppercase tracking-[0.2em] text-white/70">
                 {isLive ? "Live Match" : isPastMatch ? "Latest Result" : "Next Home Match"}
               </span>
             )}
             <span className="font-heading text-sm md:text-base uppercase tracking-[0.2em] text-white/70">
               : {format(parseISO(displayMatch.date), "EEEE do MMMM yyyy")}
             </span>
          </motion.div>
          {(() => {
            const homeFormatted = formatHeroTeamName(displayMatch["home-team"]?.name, isMobile);
            const awayFormatted = formatHeroTeamName(displayMatch["away-team"]?.name, isMobile);
            const maxLen = Math.max(homeFormatted.length, awayFormatted.length);
            const sizeClass = maxLen > 14 
              ? "text-[24vw] md:text-[6.8vw] lg:text-[7.6vw] xl:text-[8.4vw]" 
              : maxLen > 10 
              ? "text-[28vw] md:text-[7.5vw] lg:text-[8.2vw] xl:text-[9vw]" 
              : "text-[30vw] md:text-[9vw]";

            return (
              <div className={`font-heading ${sizeClass} leading-[0.75] text-white uppercase tracking-tighter`}>
                {/* Motion 1: Home Team Name */}
                <motion.div 
                  variants={typedLineVariants}
                  initial="hidden"
                  animate="visible"
                  key={isLive ? "live-home" : "next-home"}
                  className="block"
                >
                  {homeFormatted
                    .split("")
                    .concat(isLive || isPastMatch ? [" ", String(displayMatch["home-team"]?.score || 0)] : [" ", "-"])
                    .map((char, index) => (
                    <motion.span key={index} variants={letterVariants} className="inline-block whitespace-pre">
                      {char}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Motion 2: Away Team Name (Delayed) */}
                <motion.div 
                  variants={line2Variants}
                  initial="hidden"
                  animate="visible"
                  key={isLive ? "live-away" : "next-away"}
                  className="block"
                >
                  {awayFormatted
                    .split("")
                    .concat(isLive || isPastMatch ? [" ", String(displayMatch["away-team"]?.score || 0)] : [":"])
                    .map((char, index) => (
                    <motion.span key={index} variants={letterVariants} className="inline-block whitespace-pre">
                      {char}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            );
          })()}

          {/* Motion 3: The Rest (Countdown, Line, Ticket) */}
          <motion.div
            variants={restVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col items-start"
          >
            {/* Simplified Countdown or LIVE status or Postponed/Cancelled alert */}
            <div className="font-heading text-3xl sm:text-5xl text-white/90 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-2 mb-4 flex flex-wrap items-center gap-4">
              {isCancelled ? (
                <div className="bg-red-600/90 text-white border border-red-400 px-4 py-1.5 rounded text-lg sm:text-2xl font-black tracking-widest flex items-center gap-2">
                  <span>MATCH CANCELLED — DO NOT TRAVEL</span>
                </div>
              ) : isPostponed ? (
                <div className="bg-amber-500/90 text-white border border-amber-300 px-4 py-1.5 rounded text-lg sm:text-2xl font-black tracking-widest flex items-center gap-2">
                  <span>POSTPONED — NEW DATE TBC</span>
                </div>
              ) : isLive ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-red-500 font-black">Live</span>
                  <span className="opacity-60">{matchTime}</span>
                </>
              ) : isPastMatch ? (
                <span className="opacity-60">Full Time</span>
              ) : (
                <>{countdown.days}D {String(countdown.hours).padStart(2, '0')}H {String(countdown.mins).padStart(2, '0')}M {String(countdown.secs).padStart(2, '0')}S</>
              )}
            </div>
            
            {/* Thick Minimalist Divider */}
            <div className="w-full h-4 bg-white mt-4 mb-10" />

            {isCancelled ? (
              <div className="flex flex-col items-start gap-1">
                <span className="font-heading text-xl sm:text-2xl text-red-400 uppercase tracking-widest flex items-center gap-3">
                  ⚠️ Match Cancelled — No Admission
                </span>
                <div className="h-0.5 w-24 bg-red-500" />
              </div>
            ) : isPostponed ? (
              <div className="flex flex-col items-start gap-1">
                <span className="font-heading text-xl sm:text-2xl text-amber-400 uppercase tracking-widest flex items-center gap-3">
                  ⚠️ Match Postponed — Check Back For Updates
                </span>
                <div className="h-0.5 w-24 bg-amber-400" />
              </div>
            ) : (
              <Link to={isLive ? `/match-center/${displayMatch.id}` : isPastMatch ? `/match-report/${displayMatch.id}` : "https://whitehawkfc.ktckts.com/"} target={isLive || isPastMatch ? "_self" : "_blank"} className="group flex flex-col items-start gap-1">
                <span className="font-heading text-2xl text-club-gold uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-3">
                  {isLive ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      Match Center — LIVE
                    </>
                  ) : isPastMatch ? "Match Report" : "Get Tickets"}
                </span>
                <div className="h-0.5 w-12 bg-club-gold group-hover:w-full transition-all duration-300" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const LatestPostsHero = () => {
  const { data: posts, isLoading } = usePosts(true);
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
                {post.image_url ? (
                  <>
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover" 
                      style={{ objectPosition: `center ${post.image_offset !== undefined && post.image_offset !== null ? post.image_offset : 50}%` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/90" />
                  </>
                ) : (
                  <div className="w-full h-full bg-[#8e160b]" />
                )}
              </div>
              <div className="relative h-full flex flex-col justify-end pb-24 md:pb-32 px-4 md:px-20 max-w-5xl mx-auto">
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

const CombinedHero = ({ settings }: { settings: any }) => {
  const [step, setStep] = useState<"match" | "posts">("match");

  useEffect(() => {
    const timer = setTimeout(() => setStep("posts"), 12000); // Show match for 12s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        {step === "match" ? (
          <motion.div key="match" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 1 }} className="h-full">
            <MatchHero settings={settings} />
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
  const { fixtures, results } = useParsedFixtures();
  const isMobile = useIsMobile();

  // Detect any live Whitehawk match to force the match hero
  const hasLiveMatch = useMemo(() => {
    const allKnown = [...(fixtures || []), ...(results || [])];
    return allKnown.some(m => {
      const isWhk = m["home-team"]?.id === 468 || m["away-team"]?.id === 468 ||
                    m["home-team"]?.name?.toLowerCase()?.includes("whitehawk") ||
                    m["away-team"]?.name?.toLowerCase()?.includes("whitehawk");
      return isWhk && isMatchLive(m);
    });
  }, [fixtures, results]);

  if (isLoading) return (
    <section className="relative h-[420px] md:h-[88vh] bg-club-dark flex items-center justify-center">
       <Loader2 className="w-10 h-10 animate-spin text-[#8e160b]" />
    </section>
  );

  const configuredMode = settings?.value?.mode || "match";
  // Override: always show the match hero when a match is live
  const mode = hasLiveMatch ? "match" : configuredMode;
  
  // Get device-specific settings with migration/fallback
  const getDeviceSettings = (device: "mobile" | "desktop") => {
    const raw = settings?.value?.[device];
    if (raw) return raw;
    
    // Fallback/Migration to top-level settings
    return {
      background_type: settings?.value?.background_type || "image",
      background_color: settings?.value?.background_color || "#8e160b",
      custom_image_url: settings?.value?.custom_image_url || "",
      image_position: settings?.value?.image_position !== undefined ? settings?.value?.image_position : 50,
      hero_size: settings?.value?.hero_size || (device === "mobile" ? "compact" : "standard")
    };
  };

  const mobileSettings = getDeviceSettings("mobile");
  const desktopSettings = getDeviceSettings("desktop");
  
  const currentSettings = isMobile ? mobileSettings : desktopSettings;
  
  const heightClass = currentSettings.background_type === "color" 
    ? "h-[100svh]" 
    : getResponsiveHeroHeightClass(mobileSettings.hero_size, desktopSettings.hero_size);

  return (
    <section className={`relative ${heightClass} bg-club-dark overflow-hidden transition-all duration-700`}>
      {/* Top Overlay for Black Fade Transition */}
      {currentSettings.background_type === "image" && (
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/40 to-transparent z-10 pointer-events-none" />
      )}
      
      {mode === "match" && <MatchHero settings={currentSettings} />}
      {mode === "posts" && <LatestPostsHero />}
      {mode === "combined" && <CombinedHero settings={currentSettings} />}
    </section>
  );
};

export default HeroSection;
