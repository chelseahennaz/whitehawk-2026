import { useState } from "react";
import { getAppearances, getGoalscorers } from "@/lib/fwp";
import { supabase } from "@/lib/supabase";
import { usePlayers } from "./useSupabase";
import { toast } from "sonner";

export const useFWPSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { refetch } = usePlayers("mens-first-team");

  const syncStats = async () => {
    setIsSyncing(true);
    const loadingToast = toast.loading("Syncing statistics with FWP API...");

    try {
      // 1. Fetch current players from Supabase
      const { data: currentPlayers, error: fetchError } = await supabase
        .from("players")
        .select("*")
        .eq("team_slug", "mens-first-team");

      if (fetchError) throw fetchError;

      // 2. Fetch data from FWP
      const [fwpApps, fwpGoals] = await Promise.all([
        getAppearances(),
        getGoalscorers()
      ]);

      // 3. Create a unified map of FWP stats by player name
      // Normalize names to handle differing apostrophe styles and whitespace
      const normalizeName = (name: string) => 
        name.trim().replace(/[‘’'']/g, "'").toLowerCase();

      const statsMap: Record<string, { appearances: number; goals: number; originalName: string }> = {};

      fwpApps.forEach((p) => {
        const fullName = `${p["first-name"]} ${p["last-name"]}`;
        const normName = normalizeName(fullName);
        statsMap[normName] = { 
          appearances: p.appearances?.length || 0, 
          goals: 0,
          originalName: fullName
        };
      });

      fwpGoals.forEach((p) => {
        const fullName = `${p["first-name"]} ${p["last-name"]}`;
        const normName = normalizeName(fullName);
        if (statsMap[normName]) {
          statsMap[normName].goals = p.goals?.length || 0;
        } else {
          statsMap[normName] = { 
            appearances: 0, 
            goals: p.goals?.length || 0,
            originalName: fullName
          };
        }
      });

      // 4. Determine updates and new players
      const allToUpsert: any[] = [];
      const handledNames = new Set<string>();
      
      // First, handle existing players to ensure we preserve their current position & metadata
      currentPlayers.forEach((player) => {
        const normPlayerName = normalizeName(player.name);
        if (statsMap[normPlayerName]) {
          allToUpsert.push({
            name: statsMap[normPlayerName].originalName, // Update to the FWP name format
            team_slug: player.team_slug,
            position: player.position,
            appearances: statsMap[normPlayerName].appearances,
            goals: statsMap[normPlayerName].goals,
            assists: player.assists // Preserve assists
          });
          handledNames.add(normPlayerName);
          delete statsMap[normPlayerName];
        }
      });

      // Add remaining FWP players as new players
      Object.entries(statsMap).forEach(([name, stats]) => {
        allToUpsert.push({
          name,
          position: "MID", // Default position for new players
          appearances: stats.appearances,
          goals: stats.goals,
          assists: 0,
          team_slug: "mens-first-team"
        });
      });

      // 5. Perform upsert
      if (allToUpsert.length > 0) {
        const { error: upsertError } = await supabase
          .from("players")
          .upsert(allToUpsert, { onConflict: "name, team_slug" });

        if (upsertError) throw upsertError;
      }

      toast.success(`Sync complete! Statistics updated for ${allToUpsert.length} players.`, {
        id: loadingToast
      });
      
      refetch();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error(`Sync failed: ${error.message}`, { id: loadingToast });
    } finally {
      setIsSyncing(false);
    }
  };

  return { syncStats, isSyncing };
};
