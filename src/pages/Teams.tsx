import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import ClubFooter from "@/components/ClubFooter";
import { Users, Trophy, Heart } from "lucide-react";

interface TeamCard {
  name: string;
  description: string;
  manager: string;
  league?: string;
  icon: React.ReactNode;
  image: string;
}

const teams: TeamCard[] = [
  {
    name: "Men's First Team",
    description: "Competing in the Isthmian League South East Division, the first team represents the pride of East Brighton every matchday at the TerraPura Ground.",
    manager: "TBC",
    league: "Isthmian League South East",
    icon: <Trophy size={20} />,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop",
  },
  {
    name: "Women's First Team",
    description: "Our women's team continues to grow and compete, providing opportunities for female players across Brighton and beyond.",
    manager: "TBC",
    league: "Women's League",
    icon: <Trophy size={20} />,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop",
  },
  {
    name: "Under 23s",
    description: "The development squad bridges the gap between youth and senior football, preparing the next generation of Hawks.",
    manager: "TBC",
    icon: <Users size={20} />,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
  },
  {
    name: "Under 18s",
    description: "Our U18s compete in local youth leagues, developing technical ability and tactical understanding in a competitive environment.",
    manager: "TBC",
    icon: <Users size={20} />,
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=400&fit=crop",
  },
  {
    name: "Youth Academy",
    description: "From U7s to U16s, our youth setup provides coaching pathways for boys and girls across all age groups in the community.",
    manager: "Various",
    icon: <Users size={20} />,
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&h=400&fit=crop",
  },
  {
    name: "Walking Football",
    description: "A welcoming, inclusive programme for over-50s to stay active and enjoy the beautiful game at a gentler pace.",
    manager: "TBC",
    icon: <Heart size={20} />,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&h=400&fit=crop",
  },
];

const Teams = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <FixturesTicker />
      <main className="pt-[90px] md:pt-[124px]">
        {/* Hero banner */}
        <section className="bg-club-dark py-16 md:py-24">
          <div className="container mx-auto px-4">
            <p className="font-heading text-sm uppercase tracking-widest text-club-gold mb-2">Our Squads</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase text-primary-foreground leading-none">
              Teams
            </h1>
            <p className="mt-4 text-primary-foreground/70 font-body text-base max-w-lg">
              From the first team to walking football, Whitehawk FC is a club for everyone.
            </p>
          </div>
        </section>

        {/* Team cards grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div
                  key={team.name}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-club-dark/70 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2 text-primary-foreground">
                      {team.icon}
                      <h3 className="font-heading text-lg font-bold uppercase tracking-wide">
                        {team.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {team.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-heading uppercase tracking-wider">
                      <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-sm">
                        Manager: {team.manager}
                      </span>
                      {team.league && (
                        <span className="bg-club-gold/20 text-club-gold px-2.5 py-1 rounded-sm">
                          {team.league}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ClubFooter />
    </div>
  );
};

export default Teams;
