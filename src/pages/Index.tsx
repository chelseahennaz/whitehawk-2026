import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import HeroSection from "@/components/HeroSection";
import FixturesWidget from "@/components/FixturesWidget";
import LatestNews from "@/components/LatestNews";
import DiscoverSection from "@/components/DiscoverSection";
import SponsorsBar from "@/components/SponsorsBar";
import ClubFooter from "@/components/ClubFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <FixturesTicker />
      <main className="pt-[84px] md:pt-[124px]">
        <HeroSection />
        <FixturesWidget />
        <LatestNews />
        <DiscoverSection />
        <SponsorsBar />
      </main>
      <ClubFooter />
    </div>
  );
};

export default Index;
