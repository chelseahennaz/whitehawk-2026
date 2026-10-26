import { motion } from "framer-motion";

const CommunityFootball = () => {
  return (
    <>
      {/* Hero Header */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://thehawksfc.com/wp-content/uploads/2023/10/E8A1550-scaled.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 font-heading text-sm uppercase tracking-[0.4em] font-bold text-[#8e160b]">Heart of Brighton</p>
            <h1 className="font-heading text-5xl font-bold uppercase leading-tight text-black md:text-8xl tracking-tighter">
              Community <br className="hidden md:block" /> Football
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg text-muted-foreground leading-relaxed">
              Whitehawk FC is committed to providing a space where everyone, regardless of age or ability, can enjoy the game and be part of our unique community.
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
                Football for Everyone
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground font-body leading-relaxed">
                <p>
                  Our community football initiatives go beyond the pitch. We are proud of our diversity and inclusivity, offering sessions that bring together different parts of the Brighton community. From walking football for seniors to open-age community sessions, we aim to make the Hawks a welcoming space for all.
                </p>
                <p className="mt-6">
                  Our impact is built on the belief that football can change lives, reduce isolation, and create lasting connections.
                </p>
              </div>

               <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors group">
                     <h3 className="font-heading text-xl font-bold uppercase mb-4 transition-colors group-hover:text-[#8e160b]">Hawks Together</h3>
                     <p className="font-body text-sm text-muted-foreground">Inclusion sessions providing a supportive environment for players with diverse needs.</p>
                  </div>
                   <div className="p-8 border border-border/50 rounded-2xl hover:border-[#8e160b]/30 transition-colors group">
                     <h3 className="font-heading text-xl font-bold uppercase mb-4 transition-colors group-hover:text-[#8e160b]">Over 50s</h3>
                     <p className="font-body text-sm text-muted-foreground">Walking football and senior sessions focused on health, fitness, and socialising.</p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-5 space-y-12">
               <div className="bg-[#141b2b] p-10 rounded-2xl text-white">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight">Our Mission</h3>
                  <div className="space-y-4 font-body text-sm opacity-90 leading-relaxed">
                    <p>To use football as a vehicle for positive social change in the Whitehawk and wider Brighton area.</p>
                    <p>To ensure financial barriers never prevent a child or adult from playing the game they love.</p>
                    <p>To create a safe, supportive, and celebratory space for all people.</p>
                  </div>
               </div>

               <div className="p-10 border border-border/50 rounded-2xl">
                  <h3 className="font-heading text-2xl font-bold uppercase mb-6 tracking-tight text-black">Get Involved</h3>
                  <p className="font-body text-sm text-muted-foreground mb-6">Want to join one of our community sessions or volunteer your time?</p>
                  <a href="mailto:club@whitehawkfc.com" className="font-heading uppercase tracking-widest text-sm text-[#8e160b] hover:text-[#7a1309] flex items-center gap-2">
                    Enquire Now <div className="h-0.5 w-6 bg-club-gold" />
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunityFootball;
