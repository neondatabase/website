#!/usr/bin/env node
/**
 * AI Gateway model catalog sync check
 *
 * Verifies the Neon AI Gateway catalog served at /models.json (backed by
 * src/app/models.json/data.json) stays in sync with the upstream source of
 * truth — the `neon` provider entry in the models.dev API
 * (https://models.dev/api.json). Neon maintains that provider, and this
 * endpoint mirrors it, so the two must not drift.
 *
 * Comparison is capability-scoped: model ID set + a fixed set of capability
 * fields per model (name, family, attachment, reasoning, reasoning_options,
 * tool_call, temperature, structured_output, open_weights, knowledge,
 * release_date, last_updated, modalities, limit, cost, status). Fields that
 * are intentionally endpoint-specific are ignored on both sides:
 *   - `provider` (added by /models.json as a convenience) — dropped
 *   - `description`, `benchmarks`, `weights`, `links` — not part of the
 *     capability catalog (and models.dev's api.json omits weights/benchmarks)
 *
 * Exits non-zero on any difference (missing/extra models or field drift).
 *
 * Usage:
 *   node src/scripts/check-models-sync.js                 # local file vs models.dev
 *   node src/scripts/check-models-sync.js --ci            # terse output for CI
 *   node src/scripts/check-models-sync.js --json          # machine-readable
 *   NEON_MODELS_URL=https://neon.com/models.json \
 *     node src/scripts/check-models-sync.js               # compare the live endpoint
 *   MODELS_DEV_URL=https://models.dev/api.json \
 *     node src/scripts/check-models-sync.js               # override upstream URL
 */

const fs = require('fs');
const path = require('path');

const MODELS_DEV_URL = process.env.MODELS_DEV_URL || 'https://models.dev/api.json';
const NEON_MODELS_URL = process.env.NEON_MODELS_URL || null; // null => read local file
const LOCAL_DATA_PATH = path.resolve(__dirname, '../app/models.json/data.json');

// Fields compared per model. Everything else is ignored.
const COMPARE_KEYS = [
  'name',
  'family',
  'attachment',
  'reasoning',
  'reasoning_options',
  'tool_call',
  'temperature',
  'structured_output',
  'open_weights',
  'knowledge',
  'release_date',
  'last_updated',
  'modalities',
  'limit',
  'cost',
  'status',
];

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  return res.json();
}

function extractNeonModels(apiJson, source) {
  const neon = apiJson && apiJson.neon;
  if (!neon || typeof neon !== 'object') {
    throw new Error(`No "neon" provider found in ${source}`);
  }
  const models = neon.models;
  if (!models || typeof models !== 'object') {
    throw new Error(`No "neon.models" map found in ${source}`);
  }
  return models;
}

async function loadNeon() {
  if (NEON_MODELS_URL) {
    return { source: NEON_MODELS_URL, models: extractNeonModels(await fetchJson(NEON_MODELS_URL), NEON_MODELS_URL) };
  }
  const raw = fs.readFileSync(LOCAL_DATA_PATH, 'utf-8');
  return { source: path.relative(process.cwd(), LOCAL_DATA_PATH), models: extractNeonModels(JSON.parse(raw), LOCAL_DATA_PATH) };
}

async function loadUpstream() {
  return { source: MODELS_DEV_URL, models: extractNeonModels(await fetchJson(MODELS_DEV_URL), MODELS_DEV_URL) };
}

// ---------------------------------------------------------------------------
// Normalization + comparison
// ---------------------------------------------------------------------------

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = canonical(value[key]);
    return out;
  }
  return value;
}

// Pick only the comparable capability keys, canonicalized for stable equality.
function normalizeModel(model) {
  const picked = {};
  for (const key of COMPARE_KEYS) {
    if (model[key] !== undefined) picked[key] = model[key];
  }
  return canonical(picked);
}

function diffModels(upstream, neon) {
  const upstreamIds = new Set(Object.keys(upstream));
  const neonIds = new Set(Object.keys(neon));

  const missingFromNeon = [...upstreamIds].filter((id) => !neonIds.has(id)).sort();
  const extraInNeon = [...neonIds].filter((id) => !upstreamIds.has(id)).sort();

  const fieldDiffs = [];
  for (const id of [...upstreamIds].filter((x) => neonIds.has(x)).sort()) {
    const u = JSON.stringify(normalizeModel(upstream[id]));
    const n = JSON.stringify(normalizeModel(neon[id]));
    if (u !== n) {
      const fields = [];
      const um = normalizeModel(upstream[id]);
      const nm = normalizeModel(neon[id]);
      for (const key of new Set([...Object.keys(um), ...Object.keys(nm)])) {
        if (JSON.stringify(um[key]) !== JSON.stringify(nm[key])) {
          fields.push({ field: key, modelsDev: um[key], neon: nm[key] });
        }
      }
      fieldDiffs.push({ id, fields });
    }
  }

  return { missingFromNeon, extraInNeon, fieldDiffs };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  const verbose = args.includes('--verbose') ? true : args.includes('--ci') ? false : !process.env.CI;

  let upstream, neon;
  try {
    [upstream, neon] = await Promise.all([loadUpstream(), loadNeon()]);
  } catch (err) {
    console.error(`Failed to load model catalogs: ${err.message}`);
    process.exit(2);
  }

  const diff = diffModels(upstream.models, neon.models);
  const inSync =
    diff.missingFromNeon.length === 0 && diff.extraInNeon.length === 0 && diff.fieldDiffs.length === 0;

  if (jsonMode) {
    console.log(JSON.stringify({ upstream: upstream.source, neon: neon.source, inSync, ...diff }, null, 2));
    process.exit(inSync ? 0 : 1);
  }

  console.log(`AI Gateway model catalog sync check`);
  console.log(`  upstream (models.dev): ${upstream.source} — ${Object.keys(upstream.models).length} models`);
  console.log(`  neon (/models.json):   ${neon.source} — ${Object.keys(neon.models).length} models\n`);

  if (inSync) {
    console.log(`[OK] In sync — ${Object.keys(neon.models).length} models match.`);
    process.exit(0);
  }

  console.log(`[FAIL] Catalog drift detected between models.dev and /models.json\n`);

  if (diff.missingFromNeon.length) {
    console.log(`In models.dev but missing from /models.json (${diff.missingFromNeon.length}):`);
    diff.missingFromNeon.forEach((id) => console.log(`  - ${id}`));
    console.log('');
  }
  if (diff.extraInNeon.length) {
    console.log(`In /models.json but not in models.dev (${diff.extraInNeon.length}):`);
    diff.extraInNeon.forEach((id) => console.log(`  + ${id}`));
    console.log('');
  }
  if (diff.fieldDiffs.length) {
    console.log(`Field drift (${diff.fieldDiffs.length} model${diff.fieldDiffs.length === 1 ? '' : 's'}):`);
    for (const { id, fields } of diff.fieldDiffs) {
      console.log(`  ${id}:`);
      for (const f of fields) {
        if (verbose) {
          console.log(`    ${f.field}:`);
          console.log(`      models.dev: ${JSON.stringify(f.modelsDev)}`);
          console.log(`      neon:       ${JSON.stringify(f.neon)}`);
        } else {
          console.log(`    ${f.field}`);
        }
      }
    }
    console.log('');
  }

  console.log('Run `npm run generate:models` to regenerate data.json from the models.dev neon provider.');
  process.exit(1);
}

main();
