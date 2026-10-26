import { useQuery } from "@tanstack/react-query";
import { getFixtures, getLeagueTable, getMatchDetails, getCompetitionFixtures } from "@/lib/fwp";
import { parseISO, isAfter, startOfDay, format } from "date-fns";
import { supabase } from "@/lib/supabase";

const mapCustomFixtureToFWP = (cf: any) => {
  const isHome = cf.home_team_name?.toLowerCase() === "whitehawk";
  return {
    id: cf.id,
    date: cf.date,
    time: cf.time,
    attendance: cf.attendance || undefined,
    "home-team": {
      id: isHome ? 468 : 0,
      name: cf.home_team_name,
      score: cf.home_team_score !== null && cf.home_team_score !== undefined ? cf.home_team_score : undefined
    },
    "away-team": {
      id: !isHome ? 468 : 0,
      name: cf.away_team_name,
      score: cf.away_team_score !== null && cf.away_team_score !== undefined ? cf.away_team_score : undefined
    },
    venue: cf.venue,
    competition: {
      id: 0,
      name: cf.competition_name || "Pre-Season Friendly"
    },
    status: {
      short: cf.status_short || (cf.home_team_score !== null && cf.home_team_score !== undefined ? "FT" : "Upcoming"),
      full: cf.status_full || (cf.home_team_score !== null && cf.home_team_score !== undefined ? "Full Time" : "Upcoming")
    },
    match_report: cf.match_report
  };
};

export const useFWPFixtures = () => {
  return useQuery({
    queryKey: ["fwp-fixtures"],
    queryFn: async () => {
      const [fwpFixtures, { data: customFixtures, error }] = await Promise.all([
        getFixtures().catch((err) => {
          console.error("Failed to fetch FWP fixtures:", err);
          return [];
        }),
        supabase
          .from("custom_fixtures")
          .select("*")
          .order("date", { ascending: true })
      ]);

      if (error) {
        console.error("Failed to fetch custom fixtures:", error);
      }

      const fwpFixturesFiltered = (fwpFixtures || []).filter((f) => {
        const override = customFixtures?.find((cf) => cf.fwp_id === String(f.id));
        if (override) return false; // Will be added from mappedCustom
        return true;
      });

      const customVisible = (customFixtures || []).filter(cf => !cf.is_hidden);
      const mappedCustom = customVisible.map(mapCustomFixtureToFWP);
      
      const combined = [...fwpFixturesFiltered, ...mappedCustom];
      return combined.sort((a, b) => {
        try {
          const timeA = a.time && a.time.includes(":") ? a.time : "00:00";
          const timeB = b.time && b.time.includes(":") ? b.time : "00:00";
          const dateA = new Date(`${a.date}T${timeA}`);
          const dateB = new Date(`${b.date}T${timeB}`);
          return dateA.getTime() - dateB.getTime();
        } catch {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });
    },
    staleTime: 1000 * 60 * 2,   // 2 minutes
    gcTime: 1000 * 60 * 15,     // 15 minutes
    refetchInterval: (query) => {
      const matches = query.state.data;
      if (!matches) return false;
      const today = format(new Date(), 'yyyy-MM-dd');
      const hasMatchToday = matches.some(m => m.date === today);
      return hasMatchToday ? 1000 * 30 : false; // Poll every 30s if match today
    }
  });
};

export const useFWPMatchDetails = (matchId: string) => {
  return useQuery({
    queryKey: ["fwp-match", matchId],
    queryFn: async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(matchId);
      if (isUuid) {
        const { data, error } = await supabase
          .from("custom_fixtures")
          .select("*")
          .eq("id", matchId)
          .single();
        if (error) throw error;
        return mapCustomFixtureToFWP(data);
      }
      
      const fwpMatch = await getMatchDetails(matchId);
      
      // Also check if there's a custom fixture override to attach the match report
      const { data: override } = await supabase
        .from("custom_fixtures")
        .select("*")
        .eq("fwp_id", matchId)
        .maybeSingle();
        
      if (override && override.match_report) {
        fwpMatch.match_report = override.match_report;
      }
      
      return fwpMatch;
    },
    refetchInterval: (query) => {
      const match = query.state.data;
      if (!match) return false;
      
      const isFinished = 
        match.status?.short === "FT" || 
        match.status?.short === "AET" || 
        match.status?.short === "Pens" || 
        match.status?.full?.includes("Full Time");
        
      return isFinished ? false : 1000 * 30; // Poll every 30s if live
    },
    enabled: !!matchId,
  });
};

export const useFWPLeagueTable = () => {
  return useQuery({
    queryKey: ["fwp-league-table"],
    queryFn: getLeagueTable,
    staleTime: 1000 * 60 * 5,   // 5 minutes — standings rarely change
    gcTime: 1000 * 60 * 30,     // 30 minutes
  });
};

export const useFWPCompetitionFixtures = (compId: number) => {
  return useQuery({
    queryKey: ["fwp-competition-fixtures", compId],
    queryFn: () => getCompetitionFixtures(compId),
    staleTime: 1000 * 60 * 2,   // 2 minutes
    gcTime: 1000 * 60 * 15,     // 15 minutes
    refetchInterval: (query) => {
      const fixtures = query.state.data;
      if (!fixtures) return false;
      const today = format(new Date(), 'yyyy-MM-dd');
      const hasMatchToday = (fixtures as any[]).some((f) => f.date === today);
      return hasMatchToday ? 1000 * 30 : false; // Only poll every 30s on match day
    },
    enabled: !!compId && compId > 0,
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
  const { data: tableResponse, ...rest } = useFWPLeagueTable();
  const table = tableResponse?.teams || [];
  const teamId = Number(import.meta.env.VITE_FWP_TEAM_ID) || 468;

  if (table.length === 0) return { table: [], ...rest };

  const teamIndex = table.findIndex(row => row.id === teamId);
  if (teamIndex === -1) return { table: table.slice(0, 5), ...rest }; // Fallback to top 5

  const start = Math.max(0, teamIndex - padding);
  const end = Math.min(table.length, teamIndex + padding + 1);

  return { table: table.slice(start, end), ...rest };
};
