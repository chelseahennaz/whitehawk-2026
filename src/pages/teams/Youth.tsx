import { motion } from "framer-motion";

const YouthPathway = () => {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A2100-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">Growing Together</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Youth <br className="hidden md:block" /> Pathway
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
               More than just football. Our youth pathway provides a structured, supportive environment for boys and girls to develop their skills, build friendships, and be part of the Hawks community.
            </p>
            <div className="h-2 w-24 bg-club-gold mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            <div className="lg:col-span-7">
              <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-10">
                Football for Brighton
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground font-body leading-relaxed">
                <p>
                  From Under 7s up to Under 16s, our youth setup is at the heart of Whitehawk FC. We focus on fun, development, and community impact. Our coaches are FA qualified and committed to providing a safe, inclusive environment for all young players.
                </p>
                <p className="mt-6">
                  Whether your child is just starting their football journey or looking to take their game to the next level, Whitehawk offers a pathway that prioritises enjoyment and long-term growth.
                </p>
              </div>

               <div className="mt-16 space-y-8">
                  <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors">
                     <h3 className="font-heading text-xl font-bold uppercase mb-4">Ages 7-11: Foundation Phase</h3>
                     <p className="font-body text-sm text-muted-foreground">Focus on ball mastery, creative play, and falling in love with the game.</p>
                  </div>
                  <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors">
                     <h3 className="font-heading text-xl font-bold uppercase mb-4">Ages 12-16: Development Phase</h3>
                     <p className="font-body text-sm text-muted-foreground">Tactical understanding, position-specific training, and competitive league experience.</p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-5">
               <div className="p-10 bg-white border border-[#8e160b]/20 rounded-2xl shadow-sm">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-black">Interested?</h3>
                  <p className="font-body text-sm text-muted-foreground mb-8">Want to learn more about our youth teams or trial for the upcoming season?</p>
                  <a href="mailto:club@whitehawkfc.com" className="bg-[#8e160b] text-white font-heading uppercase py-4 px-8 rounded-lg tracking-widest text-sm inline-block w-full text-center hover:bg-[#7a1309] transition-colors">
                    Email Our Youth Secretary
                  </a>
               </div>

               <div className="mt-12 p-10 border border-border/50 rounded-2xl">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-black">Volunteering</h3>
                  <p className="font-body text-sm text-muted-foreground mb-6">Our youth setup is run by passionate volunteers. If you're a parent or local resident interested in helping, we'd love to hear from you.</p>
                  <div className="h-0.5 w-12 bg-club-gold" />
               </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default YouthPathway;
