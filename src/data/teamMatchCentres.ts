export type MatchResourceType = "fixtures" | "results" | "table";

export interface MatchResource {
  href: string;
  label: string;
  note: string;
  status: "live" | "pending";
}

export interface TeamMatchCentre {
  id: string;
  name: string;
  shortLabel: string;
  competition: string;
  summary: string;
  squadNote?: string;
  resources: Record<MatchResourceType, MatchResource>;
}

const youthLeagueHub = "https://fulltime.thefa.com/index.html?divisionseason=972783774";
const womenTeamPage = "https://fulltime.thefa.com/displayTeam.html?divisionseason=87609080&teamID=854369197";
const womenLeaguePage = "https://fulltime.thefa.com/index.html?divisionseason=87609080";
const u18TeamPage = "https://fulltime.thefa.com/displayTeam.html?id=264393933";
const u18LeaguePage = "https://fulltime.thefa.com/index.html?divisionseason=416411432";
const u9TeamPage = "https://fulltime.thefa.com/displayTeam.html?divisionseason=31846022&teamID=15372412";
const u13TeamPage = "https://fulltime.thefa.com/displayTeam.html?id=532538326";

const pendingYouthResource = (label: string): MatchResource => ({
  href: youthLeagueHub,
  label,
  status: "pending",
  note:
    "Whitehawk list this age group in the 2025/26 pathway, but a dedicated FA Full-Time team page has not surfaced yet. Use the league hub until the club confirms the published listing.",
});

export const featuredMatchCentres: TeamMatchCentre[] = [
  {
    id: "women-match-centre",
    name: "Whitehawk Women",
    shortLabel: "Women",
    competition: "Sussex County Women & Girls League — Open Age Championship",
    summary:
      "Senior women’s fixtures, results and league standing are tracked through FA Full-Time, matching the official club page setup.",
    squadNote:
      "The official Whitehawk Women page currently marks the squad section as coming soon. I’ve left this as an intentional placeholder until the club publishes the player list.",
    resources: {
      fixtures: {
        href: womenTeamPage,
        label: "Upcoming fixtures",
        status: "live",
        note: "Open the FA Full-Time team page to see the latest scheduled matches for Whitehawk Women.",
      },
      results: {
        href: womenTeamPage,
        label: "Latest results",
        status: "live",
        note: "Use the same FA Full-Time team page for completed match results and form updates.",
      },
      table: {
        href: womenLeaguePage,
        label: "League table",
        status: "live",
        note: "View the current Open Age Championship standings on the league page used by the club site.",
      },
    },
  },
  {
    id: "u18-match-centre",
    name: "Whitehawk U18",
    shortLabel: "U18",
    competition: "Isthmian Youth League South Division",
    summary:
      "The U18s sit at the top of the pathway, with fixtures and results published on FA Full-Time and linked from the official Whitehawk team page.",
    resources: {
      fixtures: {
        href: u18TeamPage,
        label: "Upcoming fixtures",
        status: "live",
        note: "Open the FA Full-Time U18 page for upcoming matches and the current schedule.",
      },
      results: {
        href: u18TeamPage,
        label: "Latest results",
        status: "live",
        note: "Use the same FA Full-Time U18 page for completed results and recent match outcomes.",
      },
      table: {
        href: u18LeaguePage,
        label: "League table",
        status: "live",
        note: "Open the Isthmian Youth League competition page for standings and broader league context.",
      },
    },
  },
];

export const youthMatchCentres: TeamMatchCentre[] = [
  {
    id: "u9-match-centre",
    name: "Crew Club Hawks U9",
    shortLabel: "U9",
    competition: "Mid Sussex Youth League",
    summary:
      "One of the youngest teams in the Whitehawk pathway, with a published FA Full-Time team listing.",
    resources: {
      fixtures: {
        href: u9TeamPage,
        label: "Upcoming fixtures",
        status: "live",
        note: "Open the FA Full-Time team page to see scheduled U9 fixtures.",
      },
      results: {
        href: u9TeamPage,
        label: "Latest results",
        status: "live",
        note: "Use the same FA Full-Time page for published match results.",
      },
      table: {
        href: youthLeagueHub,
        label: "League table",
        status: "live",
        note: "Open the Mid Sussex Youth League hub for the relevant age-group standings.",
      },
    },
  },
  {
    id: "u10-match-centre",
    name: "Whitehawk Youth U10",
    shortLabel: "U10",
    competition: "Mid Sussex Youth League",
    summary:
      "Listed by Whitehawk as part of the 2025/26 foundation phase pathway.",
    resources: {
      fixtures: pendingYouthResource("Fixtures hub"),
      results: pendingYouthResource("Results hub"),
      table: pendingYouthResource("League table hub"),
    },
  },
  {
    id: "u11-match-centre",
    name: "Whitehawk Youth U11",
    shortLabel: "U11",
    competition: "Mid Sussex Youth League",
    summary:
      "Listed by Whitehawk as part of the 2025/26 foundation phase pathway.",
    resources: {
      fixtures: pendingYouthResource("Fixtures hub"),
      results: pendingYouthResource("Results hub"),
      table: pendingYouthResource("League table hub"),
    },
  },
  {
    id: "u12-match-centre",
    name: "Whitehawk Youth U12",
    shortLabel: "U12",
    competition: "Mid Sussex Youth League",
    summary:
      "Listed by Whitehawk as part of the 2025/26 youth development phase.",
    resources: {
      fixtures: pendingYouthResource("Fixtures hub"),
      results: pendingYouthResource("Results hub"),
      table: pendingYouthResource("League table hub"),
    },
  },
  {
    id: "u13-match-centre",
    name: "Crew Club Hawks U13",
    shortLabel: "U13",
    competition: "Mid Sussex Youth League",
    summary:
      "This age group has a published FA Full-Time team page under the Crew Club Hawks name.",
    resources: {
      fixtures: {
        href: u13TeamPage,
        label: "Upcoming fixtures",
        status: "live",
        note: "Open the published U13 FA Full-Time team page for the latest schedule.",
      },
      results: {
        href: u13TeamPage,
        label: "Latest results",
        status: "live",
        note: "Use the same U13 team page for recorded results and recent outcomes.",
      },
      table: {
        href: youthLeagueHub,
        label: "League table",
        status: "live",
        note: "Open the Mid Sussex Youth League hub for the relevant division table.",
      },
    },
  },
  {
    id: "u14-match-centre",
    name: "Whitehawk Youth U14",
    shortLabel: "U14",
    competition: "Mid Sussex Youth League",
    summary:
      "Listed by Whitehawk as part of the 2025/26 youth development phase.",
    resources: {
      fixtures: pendingYouthResource("Fixtures hub"),
      results: pendingYouthResource("Results hub"),
      table: pendingYouthResource("League table hub"),
    },
  },
  {
    id: "u15-match-centre",
    name: "Whitehawk Youth U15",
    shortLabel: "U15",
    competition: "Mid Sussex Youth League",
    summary:
      "Listed by Whitehawk as part of the 2025/26 youth development phase.",
    resources: {
      fixtures: pendingYouthResource("Fixtures hub"),
      results: pendingYouthResource("Results hub"),
      table: pendingYouthResource("League table hub"),
    },
  },
  {
    id: "u16-match-centre",
    name: "Whitehawk Youth U16",
    shortLabel: "U16",
    competition: "Mid Sussex Youth League",
    summary:
      "Listed by Whitehawk as part of the 2025/26 youth development phase.",
    resources: {
      fixtures: pendingYouthResource("Fixtures hub"),
      results: pendingYouthResource("Results hub"),
      table: pendingYouthResource("League table hub"),
    },
  },
];