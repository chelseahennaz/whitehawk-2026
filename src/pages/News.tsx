import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, ChevronRight } from "lucide-react";
import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import ClubFooter from "@/components/ClubFooter";
import { Input } from "@/components/ui/input";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  category: string;
  featured?: boolean;
}

const articles: NewsArticle[] = [
  {
    id: 1,
    title: "Whitehawk 3 Burgess Hill Town 1",
    excerpt:
      "The Hawks secured a convincing home victory at the TerraPura Ground with three goals to one.",
    body: "A dominant display from the Hawks saw them cruise past Burgess Hill Town in front of a vocal home crowd at the TerraPura Ground. Two first-half strikes set the tone before a late third sealed an important three points.",
    date: "15 Feb 2026",
    category: "Match Report",
    featured: true,
  },
  {
    id: 2,
    title: "Burgess Hill Flashback",
    excerpt:
      "A look back at some memorable encounters between the Hawks and Burgess Hill Town over the years.",
    body: "From dramatic late winners to fierce derbies, the history between Whitehawk and Burgess Hill is packed with talking points. We revisit the best moments ahead of the next meeting.",
    date: "12 Feb 2026",
    category: "News",
  },
  {
    id: 3,
    title: "Hawks v Cheshunt Game Off Again",
    excerpt:
      "The Isthmian League fixture against Cheshunt has been postponed for a second time due to a waterlogged pitch.",
    body: "Persistent rain in recent weeks has left the away pitch unplayable, and the league has confirmed a second postponement. A new date will be announced in due course.",
    date: "9 Jan 2026",
    category: "Men's Team",
  },
  {
    id: 4,
    title: "New Signing Announcement",
    excerpt:
      "Whitehawk FC is delighted to announce the signing of a promising young midfielder ahead of the second half of the season.",
    body: "The club is pleased to confirm the arrival of an exciting talent to bolster the midfield options for the second half of the campaign. Full details and the player's first interview will follow shortly.",
    date: "5 Jan 2026",
    category: "Club",
  },
  {
    id: 5,
    title: "Community Day Success",
    excerpt:
      "Over 200 supporters attended our Community Day at the TerraPura Ground with activities for the whole family.",
    body: "The annual Community Day proved a huge hit once again. Face painting, coaching clinics, and meet-and-greets with the first team squad drew supporters of all ages to the TerraPura Ground for a fantastic afternoon.",
    date: "20 Dec 2025",
    category: "Club",
  },
  {
    id: 6,
    title: "Manager's Press Conference",
    excerpt:
      "The gaffer gives his thoughts ahead of a busy festive period for the Hawks.",
    body: "With three games in eight days over the holidays, the manager reflected on squad depth, injury updates, and what needs to improve going into a crucial run of fixtures.",
    date: "15 Dec 2025",
    category: "Men's Team",
  },
  {
    id: 7,
    title: "Youth Pathway Season Update",
    excerpt:
      "A round-up of results and progress across the U9 to U16 youth pathway teams this term.",
    body: "From the U9s finding their feet in competitive football to the U16s challenging for a league title, the youth pathway continues to grow. Coaches across every age group share their reflections on the season so far.",
    date: "8 Dec 2025",
    category: "Youth",
  },
  {
    id: 8,
    title: "Women's Team Launch Training Camp",
    excerpt:
      "Whitehawk Women begin pre-season preparations with a dedicated training camp ahead of the new league campaign.",
    body: "The Women's squad have been put through their paces in a focused pre-season camp, with fitness testing, tactical sessions, and a behind-closed-doors friendly rounding off an intense week of preparation.",
    date: "1 Dec 2025",
    category: "Women's Team",
  },
  {
    id: 9,
    title: "TerraPura Ground Improvements",
    excerpt:
      "The club outlines planned improvements to facilities at the TerraPura Ground for the 2025/26 season.",
    body: "New seating, upgraded floodlights, and improved accessibility are among the developments planned for the ground over the coming months, funded in part by the club's growing sponsor network.",
    date: "22 Nov 2025",
    category: "Club",
  },
];

const categories = ["All", ...Array.from(new Set(articles.map((a) => a.category)))];

const News = () => {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) => {
    const matchCat = active === "All" || a.category === active;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => a !== featured);

  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <FixturesTicker />

      <main className="pt-[90px] md:pt-[124px]">
        {/* Hero */}
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
          <section className="py-10 md:py-14">
            <div className="container mx-auto px-4">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative min-h-[240px] overflow-hidden">
                    <div className="absolute inset-0 club-gradient" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                    <div className="absolute bottom-5 left-5">
                      <span className="rounded bg-club-gold px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-widest text-club-dark">
                        {featured.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <p className="mb-1 font-heading text-xs uppercase tracking-widest text-primary">
                      Featured
                    </p>
                    <h2 className="font-heading text-2xl font-bold uppercase leading-tight text-foreground group-hover:text-primary transition-colors md:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                      {featured.body}
                    </p>
                    <div className="mt-5 flex items-center gap-1.5 text-muted-foreground">
                      <Calendar size={12} />
                      <span className="font-body text-xs">{featured.date}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            {rest.length === 0 && !featured ? (
              <p className="py-20 text-center font-body text-muted-foreground">
                No articles match your search.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {rest.map((article, i) => (
                    <motion.article
                      key={article.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <div className="absolute inset-0 club-gradient" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <span className="rounded bg-club-gold px-2.5 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-club-dark">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-heading text-sm font-semibold uppercase leading-tight tracking-wide text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="mt-2 font-body text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar size={10} />
                            <span className="font-body text-[10px]">{article.date}</span>
                          </div>
                          <span className="flex items-center gap-0.5 font-heading text-[10px] uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            Read <ChevronRight size={10} />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>

      <ClubFooter />
    </div>
  );
};

export default News;
