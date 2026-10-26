import { motion } from "framer-motion";
import { ExternalLink, Image, Camera, Facebook } from "lucide-react";

export default function MatchPhotos() {
  const galleries = [
    {
      title: "Flickr Match Album",
      photographer: "AG Schofield",
      description: "Official high-quality matchday action photography. Access comprehensive albums capturing recent games, player goals, and pitch-side drama.",
      url: "https://www.flickr.com/photos/agschofield/albums",
      icon: <Camera className="w-8 h-8 text-[#8e160b]" />,
      buttonText: "Open Flickr Album",
      tag: "Official Galleries"
    },
    {
      title: "Flickr Photo Archive",
      photographer: "Hawks Photos",
      description: "The official visual archive of Whitehawk FC. Browse historical match photos, squad portraits, and community events over the seasons.",
      url: "https://www.flickr.com/photos/hawksphotos/",
      icon: <Image className="w-8 h-8 text-[#8e160b]" />,
      buttonText: "Browse Photo Archive",
      tag: "Historical Archive"
    },
    {
      title: "Facebook Fan Group",
      photographer: "Hawks Community",
      description: "Connect with fellow Hawks fans. Share your own matchday photos, join discussions, and view fan-taken snapshots from the Enclosed Ground and away trips.",
      url: "https://www.facebook.com/groups/843349912463876",
      icon: <Facebook className="w-8 h-8 text-[#8e160b]" />,
      buttonText: "Visit Facebook Group",
      tag: "Community Hub"
    }
  ];

  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative text-black">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2100-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">Club</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Match <br className="hidden md:block" /> Photos
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              Explore match action, fan galleries, and historic snapshots captured across our official channels and community spaces.
            </p>
            <div className="h-2 w-24 bg-club-gold mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Gallery Cards Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {galleries.map((gallery, i) => (
              <motion.div
                key={gallery.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col justify-between p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/40 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-4 bg-[#8e160b]/5 border border-[#8e160b]/15 rounded-xl">
                      {gallery.icon}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e160b]/80 bg-[#8e160b]/5 px-3 py-1 rounded-full border border-[#8e160b]/10">
                      {gallery.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-black mb-1">
                    {gallery.title}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-widest font-medium mb-6">
                    By {gallery.photographer}
                  </p>

                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
                    {gallery.description}
                  </p>
                </div>

                <div>
                  <a
                    href={gallery.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#8e160b] text-white font-heading uppercase py-4 px-6 rounded-lg tracking-widest text-xs hover:bg-[#7a1309] transition-all duration-300 group-hover:shadow-md"
                  >
                    {gallery.buttonText}
                    <ExternalLink size={14} className="opacity-80" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fan Submissions Callout */}
      <section className="py-20 bg-[#141b2b] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight">Have photos to share?</h3>
            <p className="font-body text-sm text-white/70 leading-relaxed">
              We love seeing matchday through your eyes! Post your photos in the Facebook group or tag us on Twitter and Instagram using <span className="text-club-gold font-bold">#FNK</span>.
            </p>
            <div className="h-0.5 w-12 bg-club-gold mx-auto mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}
