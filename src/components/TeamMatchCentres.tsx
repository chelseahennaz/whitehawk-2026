import { CalendarDays, ExternalLink, ListOrdered, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  featuredMatchCentres,
  youthMatchCentres,
  type MatchResource,
  type MatchResourceType,
  type TeamMatchCentre,
} from "@/data/teamMatchCentres";

const resourceMeta: Record<MatchResourceType, { title: string; Icon: typeof CalendarDays }> = {
  fixtures: { title: "Fixtures", Icon: CalendarDays },
  results: { title: "Results", Icon: Trophy },
  table: { title: "Table", Icon: ListOrdered },
};

const MatchResourceCard = ({ type, resource }: { type: MatchResourceType; resource: MatchResource }) => {
  const { title, Icon } = resourceMeta[type];

  return (
    <div className="rounded-2xl border border-border bg-background/80 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground">
            <Icon size={16} />
          </div>
          <div>
            <p className="font-heading text-sm uppercase tracking-wider text-foreground">{title}</p>
            <p className="font-body text-xs text-muted-foreground">{resource.label}</p>
          </div>
        </div>
        <Badge variant={resource.status === "live" ? "default" : "secondary"} className="font-heading uppercase tracking-wider">
          {resource.status === "live" ? "Live" : "Pending"}
        </Badge>
      </div>

      <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">{resource.note}</p>

      <Button asChild variant="outline" size="sm" className="font-heading uppercase tracking-wider">
        <a href={resource.href} target="_blank" rel="noreferrer noopener">
          Open <ExternalLink size={14} />
        </a>
      </Button>
    </div>
  );
};

const MatchCentreCard = ({ team }: { team: TeamMatchCentre }) => (
  <Card id={team.id} className="scroll-mt-36 border-border bg-card/95">
    <CardHeader>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="font-heading uppercase tracking-wider">
          {team.shortLabel}
        </Badge>
        <Badge variant="outline" className="font-heading uppercase tracking-wider">
          {team.competition}
        </Badge>
      </div>
      <CardTitle className="font-heading text-2xl uppercase text-foreground">{team.name}</CardTitle>
      <CardDescription className="font-body text-sm leading-relaxed text-muted-foreground">
        {team.summary}
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.entries(team.resources) as Array<[MatchResourceType, MatchResource]>).map(([type, resource]) => (
          <MatchResourceCard key={type} type={type} resource={resource} />
        ))}
      </div>

      {team.squadNote ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Users size={16} />
            </div>
            <div>
              <p className="font-heading text-sm uppercase tracking-wider text-foreground">Women&apos;s squad</p>
              <p className="font-body text-xs text-muted-foreground">Official placeholder</p>
            </div>
          </div>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">{team.squadNote}</p>
        </div>
      ) : null}
    </CardContent>
  </Card>
);

const TeamMatchCentres = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-widest text-primary">Match Centres</p>
          <h2 className="font-heading text-3xl font-bold uppercase text-foreground md:text-4xl">
            Fixtures, Results & Tables
          </h2>
          <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
            Competitive squads now have direct access to fixtures, results and league tables. Youth player names are intentionally not shown on the site.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {featuredMatchCentres.map((team) => (
            <MatchCentreCard key={team.id} team={team} />
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-muted/30 p-4 md:p-6">
          <div className="mb-6 max-w-3xl">
            <p className="mb-2 font-heading text-xs uppercase tracking-[0.3em] text-primary">Youth Pathway</p>
            <h3 className="font-heading text-2xl font-bold uppercase text-foreground md:text-3xl">U9 to U16 match centres</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
              Each age group has its own quick access to fixtures, results and tables. Where a public team page is not yet clearly surfaced, the league hub is linked until the club confirms the dedicated listing.
            </p>
          </div>

          <Tabs defaultValue={youthMatchCentres[0]?.id} className="w-full">
            <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
              {youthMatchCentres.map((team) => (
                <TabsTrigger
                  key={team.id}
                  value={team.id}
                  className="rounded-full border border-border bg-background px-4 py-2 font-heading text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {team.shortLabel}
                </TabsTrigger>
              ))}
            </TabsList>

            {youthMatchCentres.map((team) => (
              <TabsContent key={team.id} value={team.id} className="mt-0">
                <MatchCentreCard team={team} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TeamMatchCentres;
