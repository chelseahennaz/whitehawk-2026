import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

function loadEnv(filePath) {
  const envFile = fs.readFileSync(filePath, 'utf-8');
  return envFile.split('\n').reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return acc;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return acc;
    acc[trimmed.substring(0, eqIdx).trim()] = trimmed.substring(eqIdx + 1).trim();
    return acc;
  }, {});
}

const env = loadEnv('.env.migration');
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Fetch FWP
  const API_KEY = '385d2d0e-7118-4ad5-ad4d-baf8530b359d';
  const TEAM_ID = '468';
  const BASE_URL = 'https://api.footballwebpages.co.uk/v2';

  const fetchFWP = async (endpoint) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: { 'FWP-API-Key': API_KEY, 'Accept': 'application/json' }
    });
    return res.json();
  };

  const [appsData, goalsData] = await Promise.all([
    fetchFWP(`appearances.json?team=${TEAM_ID}`),
    fetchFWP(`goalscorers.json?team=${TEAM_ID}`)
  ]);

  const fwpApps = appsData?.appearances?.players || [];
  const fwpGoals = goalsData?.goalscorers?.players || [];

  console.log(`FWP Appearances count: ${fwpApps.length}`);
  console.log('FWP Players:', fwpApps.map(p => `${p['first-name']} ${p['last-name']} (apps: ${p.appearances?.length || 0})`));

  console.log(`\nTotal DB players: ${players.length}`);
  fs.writeFileSync('all_db_players.json', JSON.stringify(players, null, 2));

  // Group DB players by normalized name
  const normalize = (s) => (s || '').trim().replace(/[‘’'']/g, "'").toLowerCase();
  const groups = {};
  for (const p of players) {
    const key = normalize(p.name);
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  console.log('\n--- DUPLICATES OR NEAR-DUPLICATES ---');
  for (const [key, list] of Object.entries(groups)) {
    if (list.length > 1) {
      console.log(`\nDuplicate group: "${key}" (${list.length} records):`);
      list.forEach(p => {
        console.log(`  - ID: ${p.id} | Name: "${p.name}" | Pos: ${p.position} | Apps: ${p.appearances} | Goals: ${p.goals} | Photo: ${p.photo_url || 'NONE'} | Active: ${p.is_active} | Team: ${p.team_slug}`);
      });
    }
  }

  // Also check names that might differ slightly (like "Junior Nkwonta " with trailing space, or "matty jones" vs "matt jones")
  console.log('\n--- CHECKING SIMILAR NAMES ---');
  const allNames = Object.keys(groups);
  for (let i = 0; i < allNames.length; i++) {
    for (let j = i + 1; j < allNames.length; j++) {
      const n1 = allNames[i];
      const n2 = allNames[j];
      if (n1 !== n2 && (n1.includes(n2) || n2.includes(n1) || (n1.replace('matty', 'matt') === n2) || (n2.replace('matty', 'matt') === n1))) {
        console.log(`Potential cross-match: "${n1}" vs "${n2}"`);
        console.log('  List 1:', groups[n1].map(p => `[${p.id}] "${p.name}" (apps: ${p.appearances}, photo: ${!!p.photo_url})`));
        console.log('  List 2:', groups[n2].map(p => `[${p.id}] "${p.name}" (apps: ${p.appearances}, photo: ${!!p.photo_url})`));
      }
    }
  }
}

main();
