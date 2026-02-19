import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import HeroSection from "@/components/HeroSection";
import FixturesWidget from "@/components/FixturesWidget";
import ClubStats from "@/components/ClubStats";
import LatestNews from "@/components/LatestNews";
import ClubFooter from "@/components/ClubFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FixturesTicker />
      <ClubNavigation />
      <main className="pt-[88px] md:pt-[100px]">
        <HeroSection />
        <FixturesWidget />
        <ClubStats />
        <LatestNews />
      </main>
      <ClubFooter />
    </div>
  );
};

export default Index;
