import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import HeroSection from "@/components/HeroSection";
import FixturesWidget from "@/components/FixturesWidget";
import LatestNews from "@/components/LatestNews";
import VideosSection from "@/components/VideosSection";
import DiscoverSection from "@/components/DiscoverSection";
import SponsorsBar from "@/components/SponsorsBar";
import ClubFooter from "@/components/ClubFooter";
import { motion } from "framer-motion";

// Reusable scroll-reveal wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  return (
    <>
      <HeroSection />
      <ScrollReveal><LatestNews /></ScrollReveal>
      <ScrollReveal><FixturesWidget /></ScrollReveal>
      <ScrollReveal><VideosSection /></ScrollReveal>
      <ScrollReveal><DiscoverSection /></ScrollReveal>
      <ScrollReveal><SponsorsBar /></ScrollReveal>
    </>
  );
};

export default Index;
