import heroFans from "@/assets/hero-fans.jpg";
import heroMatch from "@/assets/hero-match.jpg";
import heroGround from "@/assets/hero-ground.jpg";
import heroAtmosphere from "@/assets/hero-atmosphere.jpg";

export interface ClubTeamInfo {
  id: string;
  name: string;
  shortLabel: string;
  strapline: string;
  overview: string;
  competition: string;
  lead?: string;
  highlights: string[];
  image: string;
  clubUrl?: string;
  faUrl?: string;
}

export const clubTeams: ClubTeamInfo[] = [
  {
    id: "women",
    name: "Whitehawk Women",
    shortLabel: "Women",
    strapline: "Senior women’s football back in Whitehawk colours.",
    overview:
      "Whitehawk Women are the club’s senior women’s side and compete in the Sussex County Women & Girls Football League Open Age Championship, with fixtures, results and league table tracked on FA Full-Time.",
    competition: "Sussex County Women & Girls League — Open Age Championship",
    highlights: [
      "Official senior women’s team on the club site with an FA Full-Time competition listing and live table",
      "Re-establishes a visible women’s football offer for East Brighton and strengthens the wider player pathway",
      "Strong option for sponsors who want community impact, women’s sport visibility and room to grow with the team",
    ],
    image: heroFans,
    clubUrl: "https://whitehawkfc.com/team/whitehawk-women/",
    faUrl: "https://fulltime.thefa.com/displayTeam.html?divisionseason=87609080&teamID=854369197",
  },
  {
    id: "u18",
    name: "Whitehawk U18",
    shortLabel: "U18",
    strapline: "The key bridge between academy football and the first team.",
    overview:
      "Whitehawk U18 compete in the Isthmian Youth League and sit at the top end of the club’s development ladder, giving young players a clearer route towards senior football at the club.",
    competition: "Isthmian Youth League South Division",
    lead: "Lead coach: Dale Hurley",
    highlights: [
      "Listed by the club as part of Whitehawk’s professional development phase for U17+ players",
      "Reached the FA Youth Cup second round for the first time in club history",
      "A sponsor-ready squad for businesses wanting association with future first-team talent and youth progression",
    ],
    image: heroMatch,
    clubUrl: "https://whitehawkfc.com/team/whitehawk-u18/",
    faUrl: "https://fulltime.thefa.com/displayTeam.html?id=264393933",
  },
  {
    id: "youth-pathway",
    name: "Youth Pathway",
    shortLabel: "Youth Pathway",
    strapline: "A structured route from U9s right through to senior football.",
    overview:
      "Whitehawk’s expanded 2025/26 Youth Pathway is designed as a club-wide development system, covering U9 to U16 age groups in the Mid Sussex Youth League alongside a dual U18 route and a clear football DNA linking the whole club together.",
    competition: "Mid Sussex Youth League (U9-U16) + dual U18 pathway",
    lead: "Director of Youth: Ryan Gayler",
    highlights: [
      "2025/26 structure includes U9, U10, U11, U12, U13, U14, U15 and U16 teams, plus U18 football",
      "Players benefit from 3G and grass pitches, video analysis, strength & conditioning and Veo filming",
      "A strong commercial story for sponsors wanting year-round visibility across players, parents and local families",
    ],
    image: heroGround,
    clubUrl: "https://whitehawkfc.com/whitehawk-fc-youth-pathway-register-your-interest-for-the-2025-26-season/",
    faUrl: "https://fulltime.thefa.com/index.html?divisionseason=972783774",
  },
  {
    id: "community",
    name: "Community & Walking Football",
    shortLabel: "Community",
    strapline: "Football used properly — for inclusion, health and local impact.",
    overview:
      "Hawks in the Community was founded in 2019 to rebuild football opportunities in East Brighton, using the club as a base for youth football, wellbeing programmes, inclusive adult participation and routes back into learning and training.",
    competition: "Community programmes, Crew Club Hawks FC and inclusive adult football",
    highlights: [
      "Building boys’ and girls’ football from under-6s to under-16s through Crew Club Hawks FC",
      "Hawks Heroes supports physical, mental and emotional wellbeing through football-led community sessions",
      "Creates a compelling partnership option for businesses that want visible social impact beyond matchday sponsorship",
    ],
    image: heroAtmosphere,
    clubUrl: "https://whitehawkfc.com/hawks-in-the-community/",
  },
];

export const teamNavItems = [
  { label: "Men's First Team", path: "/teams#mens-first-team" },
  { label: "Whitehawk Women", path: "/teams#women" },
  { label: "Whitehawk U18", path: "/teams#u18" },
  { label: "Youth Pathway", path: "/teams#youth-pathway" },
  { label: "Community Football", path: "/teams#community" },
];
