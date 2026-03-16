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
    strapline: "A revived senior side with real room to grow.",
    overview:
      "Whitehawk Women were reformed by the club for the 2023/24 return of the women’s section and now compete in the Sussex County Women & Girls Football League Open Age Championship.",
    competition: "SCWGFL Open Age Championship",
    highlights: [
      "Historic women’s section brought back to create more opportunities for girls and women in East Brighton",
      "Competes in county women’s football with fixtures and table tracked via FA Full-Time",
      "Strong story for partners who want to back growth, visibility and community impact",
    ],
    image: heroFans,
    clubUrl: "https://whitehawkfc.com/team/whitehawk-women/",
    faUrl: "https://fulltime.thefa.com/index.html?divisionseason=87609080",
  },
  {
    id: "u18",
    name: "Whitehawk U18",
    shortLabel: "U18",
    strapline: "The final step before senior football.",
    overview:
      "The U18s are Whitehawk’s flagship youth side, competing in the Isthmian Youth League South Division and feeding the club’s senior pathway.",
    competition: "Isthmian Youth League South Division",
    lead: "Lead coach: Dale Hurley",
    highlights: [
      "Reached the FA Youth Cup second round for the first time in club history",
      "Positioned as the professional development phase within the Whitehawk pathway",
      "A clear sponsorship opportunity for businesses wanting to back future first-team players",
    ],
    image: heroMatch,
    clubUrl: "https://whitehawkfc.com/team/whitehawk-u18/",
    faUrl: "https://fulltime.thefa.com/displayTeam.html?id=264393933",
  },
  {
    id: "youth-pathway",
    name: "Youth Pathway",
    shortLabel: "Youth Pathway",
    strapline: "A structured route from U9s to senior football.",
    overview:
      "Whitehawk’s 2025/26 Youth Pathway covers U9s through U16s, plus additional U18 development, with a club-wide football DNA and clear progression into senior football.",
    competition: "Mid Sussex Youth League + additional U18 development football",
    lead: "Director of Youth: Ryan Gayler",
    highlights: [
      "Age groups listed by the club from U9 to U16, plus U18 recruitment",
      "Offer includes 3G and grass pitches, video analysis, strength & conditioning and Veo filming",
      "Useful for sponsors who want year-round reach across families, players and the wider community",
    ],
    image: heroGround,
    clubUrl: "https://whitehawkfc.com/whitehawk-fc-youth-pathway-register-your-interest-for-the-2025-26-season/",
    faUrl: "https://fulltime.thefa.com/displayTeam.html?id=376086366",
  },
  {
    id: "community",
    name: "Community & Walking Football",
    shortLabel: "Community",
    strapline: "Inclusive football with genuine local impact.",
    overview:
      "Through Hawks in the Community, Whitehawk uses football to support health, wellbeing, youth development and inclusive adult participation across East Brighton, including community-based formats such as walking football.",
    competition: "Community sessions, inclusive adult football and local programmes",
    highlights: [
      "Founded in 2019 to rebuild football opportunities in one of the country’s most deprived communities",
      "Built around health, wellbeing, youth provision and reconnecting residents with education and training",
      "Ideal for socially minded sponsors who want visible local impact beyond matchdays",
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
