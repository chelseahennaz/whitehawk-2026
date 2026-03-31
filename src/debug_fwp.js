const fetchStats = async () => {
  const API_KEY = "385d2d0e-7118-4ad5-ad4d-baf8530b359d";
  const TEAM_ID = "468";
  const BASE_URL = "https://api.footballwebpages.co.uk/v2";

  try {
    const fetchFWP = async (endpoint) => {
      const resp = await fetch(`${BASE_URL}/${endpoint}`, {
        headers: { "FWP-API-Key": API_KEY, "Accept": "application/json" }
      });
      return resp.json();
    };

    const apps = await fetchFWP(`appearances.json?team=${TEAM_ID}`);
    if (apps.appearances?.players) {
      console.log("--- FIRST APPEARANCE PLAYER ---");
      const p = apps.appearances.players[0];
      console.log("Keys:", Object.keys(p));
      console.log(JSON.stringify(p, null, 2));
    }

    const goals = await fetchFWP(`goalscorers.json?team=${TEAM_ID}`);
    if (goals.goalscorers?.players) {
      console.log("--- FIRST GOALSCORER PLAYER ---");
      const p = goals.goalscorers.players[0];
       console.log("Keys:", Object.keys(p));
       // Only log some info as it might be long
       console.log("Name:", p.name || `${p["first-name"]} ${p["last-name"]}`);
       console.log("Goals Count:", p.goals?.length || 0);
    }

  } catch (e) {
    console.error(e);
  }
};

fetchStats();
