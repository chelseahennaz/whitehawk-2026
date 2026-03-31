import { motion } from "framer-motion";

const DiscoverSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#f0f0f0]">
      <div className="container mx-auto px-4">
        {/* Header — same large style as League Table */}
        <div className="mb-12">
          <h2 className="font-heading text-4xl md:text-6xl text-[#141b2b] uppercase tracking-wider leading-none">
            Discover
          </h2>
          <div className="h-1 w-12 bg-club-gold mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* About the club */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden bg-[#f8f8f8] border-l-4 border-[#8e160b] p-8 md:p-10 min-h-[300px] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-[#141b2b] mb-4 leading-none">
                About The Club
              </h3>
              <p className="text-[#555] text-sm font-body mb-5 max-w-md leading-relaxed">
                The club sits within the heart of East Brighton, a community club since 1945. Football brings everyone together — we look forward to seeing you at the TerraPura Ground!
              </p>
              <div className="text-[#777] text-sm font-heading tracking-widest space-y-1.5">
                <p><span className="text-[#333]">Adults</span> – £10</p>
                <p><span className="text-[#333]">Concessions</span> – £6</p>
                <p><span className="text-[#333]">Under 16s</span> – FREE</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#e5e5e5] flex justify-end">
              <a
                href="/club"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "14px",
                  color: "#111",
                  textDecoration: "none",
                  borderTop: "1px solid #292929",
                  borderBottom: "1px solid #292929",
                  padding: "12px 16px 10px",
                  minWidth: "180px",
                  justifyContent: "center",
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: "24px",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <span style={{ fontSize: "28px", lineHeight: "1" }}>→</span>
                <span>ABOUT</span>
              </a>
            </div>
          </motion.div>

          {/* Volunteers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden bg-[#f8f8f8] border-l-4 border-[#8e160b] p-8 md:p-10 min-h-[300px] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-[#141b2b] mb-4 leading-none">
                Volunteers Needed
              </h3>
              <p className="text-[#555] text-sm font-body mb-5 max-w-md leading-relaxed">
                Whitehawk FC are always on the lookout for additional sets of hands to help with the day to day running of the club.
              </p>
              <div className="text-[#777] text-sm font-heading tracking-widest space-y-1.5">
                <p>Matchday Stewards</p>
                <p>Matchday Support Staff</p>
                <p>50:50 Raffle Lead</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#e5e5e5] flex justify-end">
              <a
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "14px",
                  color: "#111",
                  textDecoration: "none",
                  borderTop: "1px solid #292929",
                  borderBottom: "1px solid #292929",
                  padding: "12px 16px 10px",
                  minWidth: "180px",
                  justifyContent: "center",
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: "24px",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <span style={{ fontSize: "28px", lineHeight: "1" }}>→</span>
                <span>MORE INFO</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
