import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import HeroSection from "@/components/HeroSection";
import FixturesWidget from "@/components/FixturesWidget";
import LeagueTableWidget from "@/components/LeagueTableWidget";
import LatestNews from "@/components/LatestNews";
import VideosSection from "@/components/VideosSection";
import DiscoverSection from "@/components/DiscoverSection";
import SponsorsBar from "@/components/SponsorsBar";
import ClubFooter from "@/components/ClubFooter";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSupabase";

// Reusable scroll-reveal wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-160px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  const { data: layoutSettings } = useSettings("homepage_layout");
  const layout = Array.isArray(layoutSettings?.value) ? layoutSettings.value : ["fixtures", "news", "table", "videos", "discover", "sponsors"];

  const renderSection = (id: string, index: number) => {
    switch (id) {
      case "fixtures": return <ScrollReveal key={id} delay={index * 0.1}><FixturesWidget /></ScrollReveal>;
      case "news": return <ScrollReveal key={id} delay={index * 0.1}><LatestNews /></ScrollReveal>;
      case "table": return <ScrollReveal key={id} delay={index * 0.1}><LeagueTableWidget /></ScrollReveal>;
      case "videos": return <ScrollReveal key={id} delay={index * 0.1}><VideosSection /></ScrollReveal>;
      case "discover": return <ScrollReveal key={id} delay={index * 0.1}><DiscoverSection /></ScrollReveal>;
      case "sponsors": return <ScrollReveal key={id} delay={index * 0.1}><SponsorsBar /></ScrollReveal>;
      default: return null;
    }
  };

  return (
    <>
      <HeroSection />
      <div className="flex flex-col">
        {layout.map((sectionId: string, i: number) => renderSection(sectionId, i))}
      </div>
    </>
  );
};

export default Index;
