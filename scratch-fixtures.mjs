import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: customFixtures } = await supabase.from("custom_fixtures").select("*");
  console.log("CUSTOM FIXTURES:", JSON.stringify(customFixtures, null, 2));

  const fwpResponse = await fetch(`https://api.footballwebpages.co.uk/fixtures-results.json?team=468`, {
    headers: {
      "FWP-API-Key": process.env.VITE_FWP_API_KEY,
      "Accept": "application/json"
    }
  });
  const data = await fwpResponse.json();
  const fwpFixtures = data["fixtures-results"]?.matches || [];
  
  const charlton = fwpFixtures.filter(f => JSON.stringify(f).includes("Charlton"));
  console.log("FWP CHARLTON FIXTURES:", JSON.stringify(charlton, null, 2));
}
check();
