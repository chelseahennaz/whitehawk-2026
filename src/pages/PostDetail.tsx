import { useParams, Link } from "react-router-dom";
import { usePostBySlug, useSponsors } from "@/hooks/useSupabase";
import { Calendar, ArrowLeft, Loader2, Share2, Tag } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useParsedFixtures } from "@/hooks/useFWP";

const PostDetail = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = usePostBySlug(slug || "");
  const { data: sponsors } = useSponsors();
  const { fixtures, isLoading: isFixturesLoading } = useParsedFixtures();
  
  const eliteSponsors = sponsors?.filter(s => s.tier === 'Elite' && s.is_visible !== false) || [];
  const displaySponsors = eliteSponsors.slice(0, 3);
  const nextHomeMatch = fixtures?.find(m => m["home-team"]?.name?.toLowerCase()?.includes("whitehawk") || m["home-team"]?.id === 468) || null;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20">
        <h1 className="font-heading text-4xl font-bold uppercase mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been moved.</p>
        <Link to="/news">
          <Button className="font-heading uppercase tracking-widest text-xs gap-2">
            <ArrowLeft size={16} /> Back to News
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Header */}
      <section 
        className={post.image_url 
          ? "relative h-[65vh] min-h-[400px] w-full overflow-hidden" 
          : "bg-[#141b2b] pt-32 pb-16 w-full"
        }
      >
        {post.image_url && (
          <>
            <div className="absolute inset-0 club-gradient opacity-20" />
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: `center ${post.image_offset !== undefined && post.image_offset !== null ? post.image_offset : 50}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
          </>
        )}
        
        <div className={post.image_url ? "absolute bottom-0 left-0 right-0 p-4 md:p-12" : "container mx-auto px-4"}>
          <div className={post.image_url ? "container mx-auto" : ""}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-2 mb-4">
                 <Link to="/news">
                   <Button variant="ghost" size="sm" className="bg-white/10 text-white hover:bg-white/20 h-8 text-[10px] uppercase font-heading tracking-widest border border-white/20 backdrop-blur-md">
                     <ArrowLeft size={12} className="mr-1" /> Back
                   </Button>
                 </Link>
                 <span className="bg-primary text-white text-[10px] font-heading uppercase tracking-widest px-3 py-1 rounded-sm font-bold shadow-lg shadow-primary/20">
                   {post.category}
                 </span>
              </div>
              
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase text-white leading-[0.95] tracking-tight drop-shadow-2xl">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mt-8 text-white/80">
                 <div className="flex items-center gap-2">
                   <Calendar size={16} className="text-primary" />
                   <span className="text-sm font-body uppercase tracking-wider">
                     {format(new Date(post.published_at), "MMMM d, yyyy")}
                   </span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Tag size={16} className="text-primary" />
                   <span className="text-sm font-body uppercase tracking-wider">Whitehawk FC</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <article className="lg:col-span-8">
                 {/* Excerpt */}
                 {post.excerpt && (
                   <div className="mb-12 border-l-4 border-primary pl-8 py-2">
                     <p className="text-xl md:text-2xl font-body italic text-muted-foreground leading-relaxed">
                       {post.excerpt}
                     </p>
                   </div>
                 )}

                 {/* Main Body */}
                 <div 
                   className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:text-black prose-p:font-body prose-p:text-black/80 prose-a:text-[#8e160b] hover:prose-a:text-[#8e160b]/80 transition-colors"
                   dangerouslySetInnerHTML={{ __html: post.body }}
                 />

                 <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                       <span className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">Share this story:</span>
                       <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                             <Share2 size={16} />
                          </Button>
                       </div>
                    </div>
                    <Link to="/news">
                      <Button variant="link" className="font-heading uppercase tracking-widest text-xs h-9 underline decoration-primary decoration-2 underline-offset-8">
                         More News From Enclosed Ground
                      </Button>
                    </Link>
                 </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-12">
                 <div className="bg-muted/30 border border-border p-8 rounded-2xl">
                    <h4 className="font-heading text-lg font-bold uppercase mb-6 flex items-center gap-2 text-black">
                       <div className="w-2 h-2 bg-[#8e160b] rounded-full animate-pulse" />
                       Next Home Match
                    </h4>
                    {isFixturesLoading ? (
                      <div className="text-center py-6 bg-muted/50 rounded-xl text-muted-foreground shadow-sm flex justify-center">
                         <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : nextHomeMatch ? (
                      <div className="text-center py-6 bg-[#8e160b] rounded-xl text-white shadow-xl">
                         <p className="text-[10px] font-heading uppercase tracking-widest text-[#facc15] mb-3">{nextHomeMatch.venue || "Enclosed Ground"} • {format(parseISO(nextHomeMatch.date), "EEE d MMM")}</p>
                         <h5 className="font-heading text-2xl font-bold uppercase px-4 truncate">
                           {(nextHomeMatch["home-team"]?.name?.toLowerCase() === "whitehawk" ? "HAWKS" : (nextHomeMatch["home-team"]?.name?.split(" ")[0] || "TBD"))}
                           <span className="text-white/60 mx-2 text-lg">vs</span>
                           {(nextHomeMatch["away-team"]?.name?.toLowerCase() === "whitehawk" ? "HAWKS" : (nextHomeMatch["away-team"]?.name?.split(" ")[0] || "TBD"))}
                         </h5>
                        <a href="https://whitehawkfc.ktckts.com/" target="_blank" rel="noopener noreferrer">
                          <Button className="mt-6 font-heading uppercase text-xs h-9 tracking-widest w-4/5 mx-auto bg-club-gold text-black hover:bg-club-gold/90 transition-all shadow-lg active:scale-95">
                            Get Tickets
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-muted/50 rounded-xl text-muted-foreground shadow-sm">
                         <p className="font-heading uppercase text-sm">No upcoming home matches</p>
                      </div>
                    )}
                 </div>

                 {displaySponsors.length > 0 && (
                   <div className="space-y-6">
                      <h4 className="font-heading text-lg font-bold uppercase border-b border-border pb-3">Official Partners</h4>
                      <div className="grid grid-cols-3 gap-4">
                         {displaySponsors.map(s => (
                           <a key={s.id} href={s.website_url || "#"} target="_blank" rel="noreferrer" className="aspect-video bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center p-2 md:p-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                              {s.logo_url ? (
                                <img src={s.logo_url} alt={s.name} className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="font-heading text-[8px] uppercase text-center text-muted-foreground">{s.name}</span>
                              )}
                           </a>
                         ))}
                      </div>
                   </div>
                 )}
              </aside>
           </div>
        </div>
      </section>
    </>
  );
};

const Heart = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export default PostDetail;
