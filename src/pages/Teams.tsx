import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import ClubFooter from "@/components/ClubFooter";
import ClubPersonnel from "@/components/ClubPersonnel";
import OtherTeamsSection from "@/components/OtherTeamsSection";
import TeamMatchCentres from "@/components/TeamMatchCentres";

interface Player {
  name: string;
  position: string;
  appearances: number;
  goals: number;
  assists: number;
}

const squad: Player[] = [
  { name: "Lennon MacLorg", position: "GK", appearances: 5, goals: 0, assists: 0 },
  { name: "Mark Wade", position: "GK", appearances: 0, goals: 0, assists: 0 },
  { name: "Stefan Wright", position: "DEF", appearances: 32, goals: 0, assists: 2 },
  { name: "Hugo Odogwu-Atkinson", position: "DEF", appearances: 31, goals: 3, assists: 1 },
  { name: "Nathan Cooper", position: "DEF", appearances: 28, goals: 3, assists: 1 },
  { name: "Grant Hall", position: "DEF", appearances: 19, goals: 2, assists: 1 },
  { name: "Joel Daly", position: "MID", appearances: 31, goals: 2, assists: 3 },
  { name: "Charlie Harris", position: "MID", appearances: 27, goals: 2, assists: 6 },
  { name: "Andrew Briggs", position: "MID", appearances: 24, goals: 1, assists: 5 },
  { name: "Florian Kastrati", position: "MID", appearances: 8, goals: 0, assists: 1 },
  { name: "Taufee Skandari", position: "MID", appearances: 6, goals: 0, assists: 1 },
  { name: "Ikechi Eze", position: "MID", appearances: 4, goals: 1, assists: 0 },
  { name: "Archie McGonigle", position: "MID", appearances: 4, goals: 0, assists: 0 },
  { name: "Jude Robertson", position: "MID", appearances: 4, goals: 0, assists: 0 },
  { name: "Will Dupray", position: "MID", appearances: 2, goals: 0, assists: 0 },
  { name: "Charlie Lambert", position: "FWD", appearances: 32, goals: 15, assists: 4 },
  { name: "Rob O'Toole", position: "FWD", appearances: 23, goals: 2, assists: 0 },
  { name: "Destiny Ojo", position: "FWD", appearances: 16, goals: 3, assists: 5 },
  { name: "Harry Lodovica", position: "FWD", appearances: 13, goals: 5, assists: 2 },
  { name: "Josh Nandhra", position: "FWD", appearances: 9, goals: 1, assists: 1 },
  { name: "Nii-Quaye Fate Kotey", position: "FWD", appearances: 3, goals: 0, assists: 0 },
  { name: "Jay Emmanuel-Thomas", position: "FWD", appearances: 1, goals: 0, assists: 0 },
];

const positionLabel: Record<string, string> = {
  GK: "Goalkeepers",
  DEF: "Defenders",
  MID: "Midfielders",
  FWD: "Forwards",
};

const positionTone: Record<string, string> = {
  GK: "bg-secondary text-secondary-foreground",
  DEF: "bg-primary/10 text-primary",
  MID: "bg-accent text-accent-foreground",
  FWD: "bg-muted text-foreground",
};

const Teams = () => {
  const grouped = ["GK", "DEF", "MID", "FWD"].map((pos) => ({
    position: pos,
    label: positionLabel[pos],
    players: squad.filter((p) => p.position === pos),
  }));

  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <FixturesTicker />
      <main className="pt-[90px] md:pt-[124px]">
        <section className="bg-club-dark py-16 md:py-24">
          <div className="container mx-auto px-4">
            <p className="mb-2 font-heading text-sm uppercase tracking-widest text-club-gold">Our Squads</p>
            <h1 className="font-heading text-4xl font-bold uppercase leading-none text-primary-foreground md:text-6xl">
              Teams
            </h1>
            <p className="mt-4 max-w-2xl font-body text-base text-primary-foreground/70">
              From the men’s first team to women’s football, U18s and a growing youth pathway, Whitehawk is building a wider football programme that brings more players, families and energy into the club.
            </p>
          </div>
        </section>

        <section id="mens-first-team" className="scroll-mt-36 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-1 font-heading text-sm uppercase tracking-widest text-club-gold">2025-26 Season</p>
                <h2 className="font-heading text-3xl font-bold uppercase text-foreground md:text-4xl">
                  Men&apos;s First Team Squad
                </h2>
                <p className="mt-1 font-body text-sm text-muted-foreground">Isthmian League South East Division</p>
              </div>
            </div>

            {grouped.map((group) => (
              <div key={group.position} className="mb-8">
                <h3 className="mb-3 border-b border-border pb-2 font-heading text-lg uppercase tracking-wide text-foreground">
                  {group.label}
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.players.map((player) => (
                    <div
                      key={player.name}
                      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                        <span className="font-heading text-sm font-bold text-muted-foreground">
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-heading text-sm font-bold text-foreground">{player.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`rounded-sm px-1.5 py-0.5 font-heading text-[9px] uppercase tracking-widest ${positionTone[player.position]}`}>
                            {player.position}
                          </span>
                          <span className="font-body text-[10px] text-muted-foreground">
                            {player.appearances} apps · {player.goals} goals
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <OtherTeamsSection />
        <TeamMatchCentres />
        <ClubPersonnel />
      </main>
      <ClubFooter />
    </div>
  );
};

export default Teams;
