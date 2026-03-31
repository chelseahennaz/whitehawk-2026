import { useQuery } from "@tanstack/react-query";
import { getFixtures, getLeagueTable } from "@/lib/fwp";
import { parseISO, isAfter, startOfDay } from "date-fns";

export const useFWPFixtures = () => {
  return useQuery({
    queryKey: ["fwp-fixtures"],
    queryFn: getFixtures,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useFWPLeagueTable = () => {
  return useQuery({
    queryKey: ["fwp-league-table"],
    queryFn: getLeagueTable,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Helper hook to split fixtures and results
export const useParsedFixtures = () => {
  const { data: allMatches, ...rest } = useFWPFixtures();

  if (!allMatches) {
    return { fixtures: [], results: [], nextMatch: null, ...rest };
  }

  const today = startOfDay(new Date());

  // We can sort matches by date. Results are past matches, fixtures are future matches.
  // We also check "status" (if it contains 'FT' or 'A', etc.)
  const results = allMatches
    .filter((m) => m.status?.short === "FT" || m.status?.short === "AET" || m.status?.short === "Pens" || m.status?.full?.includes("Full Time") || isAfter(today, parseISO(m.date)))
    // Ensure we sort results descending (newest first)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const fixtures = allMatches
    .filter((m) => m.status?.short !== "FT" && m.status?.short !== "AET" && m.status?.short !== "Pens" && !m.status?.full?.includes("Full Time") && !m.abandoned && !isAfter(today, parseISO(m.date)))
    // Sort fixtures ascending (closest first)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextMatch = fixtures.length > 0 ? fixtures[0] : null;

  return { fixtures, results, nextMatch, ...rest };
};

export const useCenteredLeagueTable = (padding = 2) => {
  const { data: table = [], ...rest } = useFWPLeagueTable();
  const teamId = Number(import.meta.env.VITE_FWP_TEAM_ID) || 468;

  if (table.length === 0) return { table: [], ...rest };

  const teamIndex = table.findIndex(row => row.id === teamId);
  if (teamIndex === -1) return { table: table.slice(0, 5), ...rest }; // Fallback to top 5

  const start = Math.max(0, teamIndex - padding);
  const end = Math.min(table.length, teamIndex + padding + 1);

  return { table: table.slice(start, end), ...rest };
};
