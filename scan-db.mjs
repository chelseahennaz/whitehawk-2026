import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${filePath}.`);
    process.exit(1);
  }
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

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.migration');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TABLES = [
  { name: 'posts',     field: 'image_url' },
  { name: 'sponsors',  field: 'logo_url'  },
  { name: 'personnel', field: 'image_url' },
  { name: 'products',  field: 'image'     },
];

async function scan() {
  let foundLeakedUrls = 0;
  for (const table of TABLES) {
    const { data, error } = await supabase.from(table.name).select('*');
    if (error) {
      console.error(`Error querying ${table.name}:`, error);
      continue;
    }
    for (const row of data) {
      const url = row[table.field];
      if (url && (url.includes('supabase.co/storage') || url.includes('/storage/v1/object/'))) {
        console.log(`Leaked URL found in ${table.name} (id: ${row.id}): ${url}`);
        foundLeakedUrls++;
      }
    }
  }
  
  if (foundLeakedUrls === 0) {
    console.log('✅ DB Scan completed: No Supabase Storage URLs found.');
  } else {
    console.log(`❌ DB Scan completed: ${foundLeakedUrls} Supabase Storage URLs found.`);
  }
}

scan();
