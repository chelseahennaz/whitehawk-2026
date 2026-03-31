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
    <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-[#eee]">
      <div className="container mx-auto px-4">
        {/* Header matching Videos Style structure but with Light theme colors */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-4xl md:text-6xl text-[#141b2b] uppercase tracking-wider leading-none">
              Latest News
            </h2>
            <div className="h-1 w-12 bg-club-gold mt-4" />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll("left")} 
              className="w-12 h-12 flex items-center justify-center bg-neutral-100 border border-neutral-200 text-[#141b2b] hover:bg-neutral-200 transition-all rounded-full md:flex hidden"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className="w-12 h-12 flex items-center justify-center bg-neutral-100 border border-neutral-200 text-[#141b2b] hover:bg-neutral-200 transition-all rounded-full md:flex hidden"
            >
              <ChevronRight size={24} />
            </button>
            <Link to="/news" className="ml-4 font-heading text-sm uppercase tracking-wider text-[#8e160b] hover:opacity-80 border-b border-[#8e160b] pb-0.5 transition-all">
              All News
            </Link>
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
                    <div className="relative aspect-video overflow-hidden rounded-xl mb-5 shadow-2l border border-white/5 shadow-2xl">
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
                        <span className="text-[#8e160b] font-bold">CLUB NEWS</span>
                        <span className="text-neutral-200">•</span>
                        <span className="text-neutral-500 font-medium">{day} {month} {year}</span>
                      </div>
                      <h3 className="text-[#141b2b] font-heading text-xl md:text-2xl line-clamp-2 leading-[1.1] group-hover/card:text-[#8e160b] transition-colors duration-300 drop-shadow-sm uppercase">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2 mt-2 font-body">
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
      </div>
    </section>
  );
};

export default LatestNews;

