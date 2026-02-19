import { motion } from "framer-motion";
import { Calendar, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Whitehawk 3 Burgess Hill Town 1",
    excerpt: "The Hawks secured a convincing home victory at the TerraPura Ground with three goals to one.",
    date: "15 Feb 2026",
    category: "Match Report",
  },
  {
    id: 2,
    title: "Burgess Hill Flashback",
    excerpt: "A look back at some memorable encounters between the Hawks and Burgess Hill Town over the years.",
    date: "12 Feb 2026",
    category: "News",
  },
  {
    id: 3,
    title: "Hawks v Cheshunt Game Off Again",
    excerpt: "The Isthmian League fixture against Cheshunt has been postponed for a second time due to a waterlogged pitch.",
    date: "9 Jan 2026",
    category: "Men's Team",
  },
  {
    id: 4,
    title: "New Signing Announcement",
    excerpt: "Whitehawk FC is delighted to announce the signing of a promising young midfielder ahead of the second half of the season.",
    date: "5 Jan 2026",
    category: "Club",
  },
  {
    id: 5,
    title: "Community Day Success",
    excerpt: "Over 200 supporters attended our Community Day at the TerraPura Ground with activities for the whole family.",
    date: "20 Dec 2025",
    category: "Club",
  },
  {
    id: 6,
    title: "Manager's Press Conference",
    excerpt: "The gaffer gives his thoughts ahead of a busy festive period for the Hawks.",
    date: "15 Dec 2025",
    category: "First Team",
  },
];

const LatestNews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 bg-club-surface">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wide text-foreground">
            Latest News
          </h3>
          <div className="flex items-center gap-2">
            <a href="/news" className="text-xs font-heading uppercase tracking-wider text-primary hover:underline flex items-center gap-1 mr-4">
              All News <ExternalLink size={10} />
            </a>
            <button onClick={() => scroll("left")} className="w-8 h-8 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll("right")} className="w-8 h-8 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
          {newsItems.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer min-w-[280px] max-w-[300px] flex-shrink-0 rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="club-gradient h-36 flex items-end p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-club-dark/80 to-transparent" />
                <span className="relative z-10 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-[10px] font-heading uppercase tracking-widest px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-heading text-sm uppercase tracking-wide text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-xs mt-2 font-body line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-muted-foreground">
                  <Calendar size={10} />
                  <span className="text-[10px] font-body">{item.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
