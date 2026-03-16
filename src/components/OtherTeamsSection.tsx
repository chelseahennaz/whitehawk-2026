import { ExternalLink, Shield, Target, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clubTeams } from "@/data/clubTeams";

const icons = {
  women: Shield,
  u18: Target,
  "youth-pathway": Users,
  community: Users,
} as const;

const OtherTeamsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-8">
          <p className="font-heading text-sm uppercase tracking-widest text-primary mb-2">Beyond the First Team</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase text-foreground mb-3">
            Women, Youth & Community Football
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
            Whitehawk’s wider football offer is a real growth engine for the club — bringing in players, families,
            volunteers and future supporters across women’s, youth and community football.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {clubTeams.map((team) => {
            const Icon = icons[team.id as keyof typeof icons] ?? Users;

            return (
              <Card
                key={team.id}
                id={team.id}
                className="overflow-hidden border-border bg-card/95 scroll-mt-36"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={team.image}
                    alt={team.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-3 font-heading uppercase tracking-wider">
                        {team.shortLabel}
                      </Badge>
                      <h3 className="font-heading text-2xl font-bold uppercase text-primary-foreground">{team.name}</h3>
                      <p className="mt-1 font-body text-sm text-primary-foreground/80">{team.strapline}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/20 bg-background/20 text-primary-foreground backdrop-blur-sm">
                      <Icon size={18} />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="font-heading uppercase tracking-wider text-xs">
                      {team.competition}
                    </Badge>
                    {team.lead ? (
                      <Badge variant="secondary" className="font-heading uppercase tracking-wider text-xs">
                        {team.lead}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">{team.overview}</p>

                  <ul className="space-y-2.5 mb-6">
                    {team.highlights.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-foreground/80">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    {team.clubUrl ? (
                      <a href={team.clubUrl} target="_blank" rel="noreferrer noopener">
                        <Button className="font-heading uppercase tracking-wider text-xs gap-2">
                          Club Page <ExternalLink size={14} />
                        </Button>
                      </a>
                    ) : null}
                    {team.faUrl ? (
                      <a href={team.faUrl} target="_blank" rel="noreferrer noopener">
                        <Button variant="outline" className="font-heading uppercase tracking-wider text-xs gap-2">
                          FA Full-Time <ExternalLink size={14} />
                        </Button>
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OtherTeamsSection;
