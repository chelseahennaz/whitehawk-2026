import ClubNavigation from "@/components/ClubNavigation";
import HeroSection from "@/components/HeroSection";
import FixturesWidget from "@/components/FixturesWidget";
import ClubStats from "@/components/ClubStats";
import LatestNews from "@/components/LatestNews";
import ClubFooter from "@/components/ClubFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <main className="pt-[60px] md:pt-[72px]">
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
