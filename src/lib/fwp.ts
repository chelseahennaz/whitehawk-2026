export interface FWPTeam {
  id: number;
  name: string;
  score?: number;
  "half-time-score"?: number;
  "penalties-score"?: number;
}

export interface FWPFixture {
  id: number;
  date: string;
  time: string;
  attendance?: number;
  abandoned?: boolean;
  "home-team": FWPTeam;
  "away-team": FWPTeam;
  venue: string;
  competition: {
    id: number;
    name: string;
  };
  status?: {
    full: string;
    short: string;
  };
}

export interface FWPLeagueTableRow {
  id: number;
  name: string;
  position: number;
  "total-points": number;
  zone?: string;
  "all-matches": {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    for: number;
    against: number;
    "goal-difference": number;
  };
}

export interface FWPAppearance {
  id: number;
  "first-name": string;
  "last-name": string;
  appearances?: any[]; // Array of match objects
}

export interface FWPGoalscorer {
  id: number;
  "first-name": string;
  "last-name": string;
  goals?: any[]; // Array of goal objects
}

const API_KEY = import.meta.env.VITE_FWP_API_KEY;
const TEAM_ID = import.meta.env.VITE_FWP_TEAM_ID;
// Route through local Vite proxy in dev, or public CORS proxy in prod if deployed statically
const BASE_URL = import.meta.env.DEV 
  ? "/fwp-api/v2" 
  : "https://corsproxy.io/?" + encodeURIComponent("https://api.footballwebpages.co.uk/v2");

const fetchFWP = async (endpoint: string) => {
  if (!API_KEY) {
    throw new Error("Missing VITE_FWP_API_KEY environment variable");
  }

  const url = `${BASE_URL}/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "FWP-API-Key": API_KEY,
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`FWP API error: ${response.statusText}`);
  }

  return response.json();
};

export const getFixtures = async (): Promise<FWPFixture[]> => {
  if (!TEAM_ID) throw new Error("Missing VITE_VITE_FWP_TEAM_ID environment variable");
  
  const data = await fetchFWP(`fixtures-results.json?team=${TEAM_ID}`);
  return data["fixtures-results"]?.matches || [];
};

export const getLeagueTable = async (): Promise<FWPLeagueTableRow[]> => {
  if (!TEAM_ID) throw new Error("Missing VITE_VITE_FWP_TEAM_ID environment variable");
  
  // To get the league table for the team's competition, we still query by team
  const data = await fetchFWP(`league-table.json?team=${TEAM_ID}`);
  return data["league-table"]?.teams || [];
};

export const getAppearances = async (): Promise<FWPAppearance[]> => {
  if (!TEAM_ID) throw new Error("Missing VITE_VITE_FWP_TEAM_ID environment variable");
  
  const data = await fetchFWP(`appearances.json?team=${TEAM_ID}`);
  return data.appearances?.players || [];
};

export const getGoalscorers = async (): Promise<FWPGoalscorer[]> => {
  if (!TEAM_ID) throw new Error("Missing VITE_VITE_FWP_TEAM_ID environment variable");
  
  const data = await fetchFWP(`goalscorers.json?team=${TEAM_ID}`);
  return data.goalscorers?.players || [];
};

// Helper for team logo URLs
export const getTeamBadgeUrl = (teamId: number) => {
  // Football Web Pages often uses this pattern for logos/badges
  // If it fails, we fall back to text initials in the UI
  return `https://www.footballwebpages.co.uk/images/logos/${teamId}.png`;
};
