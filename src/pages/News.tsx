import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePosts } from "@/hooks/useSupabase";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const News = () => {
  const { data: articles, isLoading } = usePosts();
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    if (!articles) return ["All"];
    return ["All", ...Array.from(new Set(articles.map((a) => a.category)))];
  }, [articles]);

  const filtered = useMemo(() => {
    if (!articles) return [];
    return articles.filter((a) => {
      const matchCat = active === "All" || a.category === active;
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, active, search]);

  const featured = useMemo(() => filtered.find((a) => a.featured), [filtered]);
  const rest = useMemo(() => filtered.filter((a) => a.id !== featured?.id), [filtered, featured]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <section className="bg-club-dark py-16 md:py-24">
        <div className="container mx-auto px-4">
          <p className="mb-2 font-heading text-sm uppercase tracking-widest text-club-gold">
            Whitehawk FC
          </p>
          <h1 className="font-heading text-4xl font-bold uppercase leading-none text-primary-foreground md:text-6xl">
            News
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base text-primary-foreground/70">
            The latest match reports, club updates, transfer news and more from across the Hawks.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-muted/40">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-1.5 font-heading text-xs uppercase tracking-wider transition-colors ${
                  active === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news…"
              className="h-9 pl-9 font-body text-sm"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="py-10 md:py-14 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <Link to={`/news/${featured.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 h-[450px] md:h-[550px]"
              >
                {/* Background Image */}
                {featured.image_url ? (
                  <img src={featured.image_url} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90" />
                ) : (
                  <div className="absolute inset-0 club-gradient opacity-30" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end max-w-4xl">
                  <span className="mb-4 inline-block w-fit rounded bg-club-gold px-3 py-1 font-heading text-xs font-bold uppercase tracking-widest text-club-dark">
                    Featured: {featured.category}
                  </span>
                  <h2 className="font-heading text-3xl font-bold uppercase leading-[1.1] text-white group-hover:text-primary transition-colors md:text-5xl drop-shadow-xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 font-body text-base leading-relaxed text-white/70 line-clamp-2 max-w-2xl">
                    {featured.excerpt}
                  </p>
                  
                  <div className="mt-8 w-fit bg-white text-black font-heading py-3 px-10 text-center uppercase tracking-wider text-sm transition-all duration-300 transform group-hover:bg-primary group-hover:text-white">
                    Read Full Article
                  </div>
                </div>
              </motion.article>
            </Link>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="pb-16 md:pb-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          {rest.length === 0 && !featured ? (
            <p className="py-20 text-center font-body text-muted-foreground">
              No articles match your search.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {rest.map((article, i) => (
                  <Link key={article.id} to={`/news/${article.slug}`}>
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900 h-[450px] md:h-[500px]"
                    >
                      {/* Background Image */}
                      {article.image_url ? (
                        <img src={article.image_url} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100" />
                      ) : (
                        <div className="absolute inset-0 club-gradient opacity-30" />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                
                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end min-h-[50%]">
                        <span className="mb-3 inline-block w-fit rounded bg-club-gold/90 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-widest text-club-dark">
                          {article.category}
                        </span>
                        <h3 className="font-heading text-2xl text-white uppercase leading-[1.1] mb-6 drop-shadow-lg group-hover:text-primary transition-colors duration-300 line-clamp-3">
                          {article.title}
                        </h3>
                        
                        <div className="w-full bg-white text-black font-heading py-3 text-center uppercase tracking-wider text-sm transition-all duration-300 transform group-hover:bg-primary group-hover:text-white">
                          Read Article
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default News;
