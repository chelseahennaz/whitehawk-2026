import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { usePosts } from "@/hooks/useSupabase";
import { Link } from "react-router-dom";

const LatestNews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: newsItems, isLoading } = usePosts();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show major items, limited for the ticker
  const itemsToShow = newsItems?.slice(0, 8) || [];

  return (
    <section className="py-16 md:py-24 bg-[#141b2b] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-4xl md:text-6xl text-white uppercase tracking-wider leading-none">
              Latest News
            </h2>
            <div className="h-1 w-12 bg-club-gold mt-4" />
          </div>
          <div className="flex items-center gap-3 md:flex hidden">
            <button 
              onClick={() => scroll("left")} 
              className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative group/carousel">
          {/* Carousel Container */}
          <div 
            ref={scrollRef} 
            className="flex gap-8 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {itemsToShow.map((item, i) => {
              const dateObj = new Date(item.published_at || Date.now());
              const day = dateObj.getDate();
              const month = dateObj.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
              const year = dateObj.getFullYear();
              
              return (
                <Link 
                  key={item.id} 
                  to={`/news/${item.slug}`}
                  className="flex-shrink-0 snap-start w-full md:w-[calc(33.333%-1.35rem)] group/card"
                >
                  <article className="flex flex-col h-full bg-transparent">
                    {/* Image Container matching Videos */}
                    <div className="relative aspect-video overflow-hidden mb-5 border border-white/5 shadow-2xl">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 brightness-90 group-hover/card:brightness-100" 
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                           <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500" />
                    </div>

                    {/* Info matching Video style */}
                    <div className="px-1">
                      <div className="flex items-center gap-2 font-heading text-xs md:text-sm tracking-widest mb-2">
                        <span className="text-club-gold font-bold">CLUB NEWS</span>
                        <span className="text-white/20">•</span>
                        <span className="text-white/60 font-medium">{day} {month} {year}</span>
                      </div>
                      <h3 className="text-white font-heading text-xl md:text-2xl line-clamp-2 leading-[1.1] group-hover/card:text-primary transition-colors duration-300 drop-shadow-md uppercase">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mt-2 font-body">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* All News CTA - same arrow-button style as Fixtures & Results */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            to="/news"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              color: "#fff",
              textDecoration: "none",
              borderTop: "1px solid rgba(255,255,255,0.4)",
              borderBottom: "1px solid rgba(255,255,255,0.4)",
              padding: "12px 16px 10px",
              minWidth: "250px",
              justifyContent: "center",
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: "24px",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontSize: "28px", lineHeight: 1 }}>→</span>
            <span>ALL NEWS</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;

