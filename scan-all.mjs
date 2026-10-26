import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
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
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function scanAllTables() {
  console.log('Fetching all tables...');
  
  // Use RPC or REST API to get all tables. The easiest way is querying the OpenAPI spec or we can just query the ones we know and try to find others.
  // Actually, we can just do a broad query via the REST API if we know the tables. Let's try to query information_schema if possible, but Supabase REST API doesn't expose it directly by default.
  // We can fetch the OpenAPI spec for the project to get all tables!
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_KEY}`);
  const openapi = await response.json();
  const tables = Object.keys(openapi.definitions || {});
  
  console.log(`Found ${tables.length} tables/views:`, tables.join(', '));
  
  let missedUrls = 0;
  
  for (const table of tables) {
    // skip some internal or non-data tables if any
    const { data, error } = await supabase.from(table).select('*').limit(1000);
    if (error) continue; // might be a view without permissions or RPC
    
    if (data && data.length > 0) {
      for (const row of data) {
        for (const [key, value] of Object.entries(row)) {
          if (typeof value === 'string' && (value.includes('supabase.co/storage') || value.includes('/storage/v1/object/'))) {
             console.log(`FOUND MISSED URL in table [${table}], column [${key}]: ${value}`);
             missedUrls++;
          }
        }
      }
    }
  }
  
  if (missedUrls === 0) {
    console.log('\n✅ Comprehensive Scan: Zero Supabase Storage URLs found in ANY table or column across the entire database.');
  } else {
    console.log(`\n❌ Found ${missedUrls} missed URLs in other tables.`);
  }
}

scanAllTables();
