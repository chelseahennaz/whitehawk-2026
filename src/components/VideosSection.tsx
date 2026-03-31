import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSettingsHiddenVideos } from "@/hooks/useSupabase";

// Curated fallbacks in case the feed fails
const FALLBACK_VIDEOS = [
  {
    id: "RQvNaPxzIlg",
    title: "Tough Night at The Enclosed Ground | Whitehawk 1–3 Cheshunt",
    category: "MATCH HIGHLIGHTS",
    date: "27 MAR 2026",
    thumbnail: "https://img.youtube.com/vi/RQvNaPxzIlg/maxresdefault.jpg"
  },
  {
    id: "fOWziKNPTi0",
    title: "Defeat at Home | Whitehawk 0-3 Cray Wanderers Highlights",
    category: "MATCH HIGHLIGHTS",
    date: "17 MAR 2026",
    thumbnail: "https://img.youtube.com/vi/fOWziKNPTi0/maxresdefault.jpg"
  }
];

const fetchVideos = async () => {
  const CHANNEL_ID = "UCley7B4XSy1S-bd7Sed-SEw";
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
  
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch videos");
  const data = await response.json();
  
  return data.items.map((item: any) => {
    // Robust video ID extraction for standard videos and shorts
    const videoIdMatch = item.link.match(/(?:v=|\/shorts\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : item.link.split("/").pop()?.replace("watch?v=", "") || "";
    
    return {
      id: videoId,
      title: item.title,
      category: item.title.toUpperCase().includes("HIGHLIGHTS") ? "MATCH HIGHLIGHTS" : "CLUB TV",
      date: format(new Date(item.pubDate), "dd MMM yyyy").toUpperCase(),
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  });
};

const VideosSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: allVideos, isLoading: loadingFeed, isError } = useQuery({
    queryKey: ["youtube-videos"],
    queryFn: fetchVideos,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: hiddenVideos, isLoading: loadingSettings } = useSettingsHiddenVideos();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const isLoading = loadingFeed || loadingSettings;
  
  // Filter out any videos that are marked as hidden in Supabase
  const videos = allVideos?.filter(v => !hiddenVideos?.includes(v.id));
  const displayVideos = videos || FALLBACK_VIDEOS;

  return (
    <section className="py-16 md:py-24 bg-[#141b2b] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-4xl md:text-6xl text-white uppercase tracking-wider leading-none">
              Videos
            </h2>
            <div className="h-1 w-12 bg-club-gold mt-4" />
          </div>
          <div className="flex items-center gap-3">
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

        {/* Carousel / Loading State */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden py-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[300px] md:w-[420px] animate-pulse">
                <div className="aspect-video bg-white/5 mb-4" />
                <div className="h-4 w-1/3 bg-white/5 mb-2" />
                <div className="h-6 w-full bg-white/5" />
              </div>
            ))}
          </div>
        ) : (
          <div 
            ref={scrollRef} 
            className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayVideos.map((video: any, i: number) => (
              <motion.div
                key={video.id + i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-[300px] md:w-[420px] snap-start"
              >
                <a 
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video overflow-hidden mb-5 shadow-2xl border border-white/5">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100"
                      onError={(e) => {
                        // Fallback to hqdefault if maxres fails
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                      }}
                    />
                    {/* Overlay play button */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-full border border-white/30 text-white bg-black/20 backdrop-blur-md group-hover:scale-110 group-hover:border-white transition-all duration-500 shadow-xl">
                        <Play className="fill-white ml-1 w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-1">
                    <div className="flex items-center gap-2 font-heading text-xs md:text-sm tracking-widest mb-2">
                      <span className="text-club-gold font-bold">{video.category}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-white/60">{video.date}</span>
                    </div>
                    <h3 className="text-white font-heading text-xl md:text-2xl line-clamp-2 leading-[1.1] group-hover:text-primary transition-colors duration-300 drop-shadow-md uppercase">
                      {video.title}
                    </h3>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {isError && !videos && (
          <div className="text-center py-10">
            <p className="text-white/50 font-heading text-sm uppercase tracking-widest">
              Unable to load latest videos. Showing recent highlights.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideosSection;

