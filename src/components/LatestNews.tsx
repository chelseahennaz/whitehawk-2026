import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Dominant Display Sees Reds Through to Next Round",
    excerpt: "A commanding performance saw the club progress in the FA Vase with a 3-1 victory at The Red Ground.",
    date: "15 Feb 2026",
    category: "Match Report",
  },
  {
    id: 2,
    title: "New Signing Bolsters Midfield Options",
    excerpt: "The club is delighted to announce the signing of a new midfielder ahead of the busy fixture period.",
    date: "12 Feb 2026",
    category: "Transfers",
  },
  {
    id: 3,
    title: "Supporters' Club Annual Dinner Announced",
    excerpt: "Join us for the annual supporters' dinner at the clubhouse on March 15th. Tickets now available.",
    date: "10 Feb 2026",
    category: "Club News",
  },
];

const NewsCard = ({ item, index, featured }: { item: NewsItem; index: number; featured?: boolean }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
    className={`group cursor-pointer rounded-lg overflow-hidden border border-border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 ${
      featured ? "md:col-span-2 md:row-span-2" : ""
    }`}
  >
    <div className={`club-gradient ${featured ? "h-48 md:h-64" : "h-32 md:h-40"} flex items-end p-4 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-t from-club-dark/80 to-transparent" />
      <span className="relative z-10 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-[10px] font-heading uppercase tracking-widest px-2 py-1 rounded">
        {item.category}
      </span>
    </div>
    <div className="p-4 md:p-5">
      <h4 className={`font-heading uppercase tracking-wide text-foreground group-hover:text-primary transition-colors leading-tight ${
        featured ? "text-lg md:text-xl" : "text-sm md:text-base"
      }`}>
        {item.title}
      </h4>
      <p className="text-muted-foreground text-xs md:text-sm mt-2 font-body line-clamp-2">
        {item.excerpt}
      </p>
      <div className="flex items-center gap-1.5 mt-3 text-muted-foreground">
        <Calendar size={12} />
        <span className="text-xs font-body">{item.date}</span>
      </div>
    </div>
  </motion.article>
);

const LatestNews = () => {
  return (
    <section className="py-12 md:py-16 bg-club-surface">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground">
            Latest News
          </h3>
          <div className="h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {newsItems.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
