export interface FWPTeam {
  id: number;
  name: string;
  score?: number;
  "half-time-score"?: number;
  "penalties-score"?: number;
}

export interface FWPFixture {
  id: number | string;
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

export interface FWPGoal {
  minute: number;
  description: string;
  player: {
    id: number;
    "first-name": string;
    "last-name": string;
  };
  sort: number;
}

export interface FWPLineupPlayer {
  shirt: number;
  captain?: boolean;
  cautioned?: { minute: number };
  "sent-off"?: { minute: number };
  "substituted-off"?: { minute: number };
  "substituted-on"?: { minute: number };
  player: {
    id: number;
    "first-name": string;
    "last-name": string;
  };
  sort: number;
}

export interface FWPMatchDetails extends FWPFixture {
  referee?: string;
  match_report?: string;
  "home-team": FWPTeam & {
    goals?: FWPGoal[];
    "line-up"?: FWPLineupPlayer[];
    substitutes?: FWPLineupPlayer[];
  };
  "away-team": FWPTeam & {
    goals?: FWPGoal[];
    "line-up"?: FWPLineupPlayer[];
    substitutes?: FWPLineupPlayer[];
  };
}

const API_KEY = import.meta.env.VITE_FWP_API_KEY;
const TEAM_ID = import.meta.env.VITE_FWP_TEAM_ID;
// Route through local Vite proxy in dev, or public CORS proxy in prod if deployed statically
const BASE_URL = import.meta.env.DEV 
  ? "/fwp-api/v2" 
  : "/api-proxy.php?endpoint=";

const fetchFWP = async (endpoint: string) => {
  if (!API_KEY) {
    throw new Error("Missing VITE_FWP_API_KEY environment variable");
  }

  // In dev, use the Vite proxy; in prod, route through the PHP proxy
  const url = import.meta.env.DEV 
    ? `${BASE_URL}/${endpoint}`
    : `${BASE_URL}${encodeURIComponent(endpoint)}`;
    
  const response = await fetch(url, {
    headers: {
      "FWP-API-Key": API_KEY,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`FWP API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getFixtures = async (): Promise<FWPFixture[]> => {
  if (!TEAM_ID) throw new Error("Missing VITE_VITE_FWP_TEAM_ID environment variable");
  
  const data = await fetchFWP(`fixtures-results.json?team=${TEAM_ID}`);
  return data["fixtures-results"]?.matches || [];
};

export const getMatchDetails = async (matchId: string): Promise<FWPMatchDetails> => {
  const data = await fetchFWP(`match.json?match=${matchId}`);
  if (!data.match) throw new Error("Match details not found in response");
  return data.match;
};

export interface FWPLeagueTableResponse {
  competition: {
    id: number;
    name: string;
  };
  teams: FWPLeagueTableRow[];
}

export const getLeagueTable = async (): Promise<FWPLeagueTableResponse> => {
  if (!TEAM_ID) throw new Error("Missing VITE_VITE_FWP_TEAM_ID environment variable");
  
  // To get the league table for the team's competition, we still query by team
  const data = await fetchFWP(`league-table.json?team=${TEAM_ID}`);
  return {
    competition: data["league-table"]?.competition || { id: 0, name: "Unknown" },
    teams: data["league-table"]?.teams || []
  };
};

export const getCompetitionFixtures = async (compId: number): Promise<FWPFixture[]> => {
  const data = await fetchFWP(`fixtures-results.json?comp=${compId}`);
  return data["fixtures-results"]?.matches || [];
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

/**
 * Robust check if a match is currently in progress.
 * Uses a whitelist of active play statuses to avoid false positives
 * from postponed (P-P) or recently finished matches.
 */
export const isMatchLive = (fixture: FWPFixture | null | undefined): boolean => {
  if (!fixture || !fixture.status || fixture.abandoned) return false;
  
  const statusShort = fixture.status.short || "";
  const liveStatuses = ["1st", "2nd", "HT", "ET", "Live", "Late", "Pen", "Pens", "Half"];
  
  // FWP sometimes returns just the minute number, optionally with an apostrophe or stoppage time like "45", "45'", "45+2"
  const isNumericMinute = /^(\d+)'?(\+\d+'?)?$/.test(statusShort.trim());
  
  // Basic whitelist check
  const inWhitelist = liveStatuses.some(s => statusShort.includes(s));
  
  // Double check that it's not actually finished (sometimes FWP is ambiguous)
  const isFinished = 
    statusShort === "FT" || 
    statusShort === "AET" || 
    statusShort === "P-P" ||
    fixture.status.full?.includes("Full Time");

  return (inWhitelist || isNumericMinute) && !isFinished;
};
