import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import HeroSection from "@/components/HeroSection";
import FixturesWidget from "@/components/FixturesWidget";
import LatestNews from "@/components/LatestNews";
import VideosSection from "@/components/VideosSection";
import DiscoverSection from "@/components/DiscoverSection";
import SponsorsBar from "@/components/SponsorsBar";
import ClubFooter from "@/components/ClubFooter";

const Index = () => {
  return (
    <>
      <HeroSection />
      <LatestNews />
      <FixturesWidget />
      <VideosSection />
      <DiscoverSection />
      <SponsorsBar />
    </>
  );
};

export default Index;
