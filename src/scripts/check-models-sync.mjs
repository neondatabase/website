#!/usr/bin/env node
/**
 * models.dev mirror sync check
 *
 * `src/app/models.json/data.json` is the source of truth for the Neon AI Gateway
 * catalog. The `neon` provider on models.dev is a mirror of it that we maintain
 * in a repo we do not control, so it lags by however long an upstream PR takes.
 *
 * This reports that lag. It does not fail on it — a model we publish before the
 * upstream PR merges is an in-flight change, not a fault. Two things do fail:
 * models.dev listing a `neon` model we do not publish, and being unable to read
 * either catalog at all.
 *
 * Usage:
 *   node src/scripts/check-models-sync.mjs                # local data.json vs models.dev
 *   node src/scripts/check-models-sync.mjs --ci           # terse output
 *   node src/scripts/check-models-sync.mjs --json         # machine-readable
 *   node src/scripts/check-models-sync.mjs --strict       # also fail on sync debt
 *   NEON_MODELS_URL=https://neon.com/models.json \
 *     node src/scripts/check-models-sync.mjs              # compare the deployed endpoint
 *   MODELS_DEV_URL=... node src/scripts/check-models-sync.mjs
 *
 * Exit codes: 0 in sync or sync debt only, 1 fault, 2 could not load a catalog.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { classifyDrift } from '../../scripts/lib/models-catalog.mjs';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DEV_URL = process.env.MODELS_DEV_URL || 'https://models.dev/api.json';
const NEON_MODELS_URL = process.env.NEON_MODELS_URL || null; // null => read the committed file
const LOCAL_DATA_PATH = path.resolve(DIRNAME, '../app/models.json/data.json');

const UPSTREAM_PR_HINT =
  'Open a PR on anomalyco/models.dev updating providers/neon/ to match. See the ' +
  '`add-model-to-ai-gateway` skill for the entry format.';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  return res.json();
}

// A mirror that answers with an empty or malformed catalog is a broken read, not
// a catalog that happens to differ. Classifying it would report every model we
// publish as ordinary sync debt and exit 0 on a payload nobody can trust.
function extractNeonModels(apiJson, source) {
  const models = apiJson?.neon?.models;
  if (!models || typeof models !== 'object' || Array.isArray(models)) {
    throw new Error(`No "neon.models" map found in ${source}`);
  }
  const ids = Object.keys(models);
  if (ids.length === 0) {
    throw new Error(`"neon.models" in ${source} is empty`);
  }
  const malformed = ids.filter((id) => {
    const model = models[id];
    return (
      !model || typeof model !== 'object' || Array.isArray(model) || Object.keys(model).length === 0
    );
  });
  if (malformed.length > 0) {
    throw new Error(
      `"neon.models" in ${source} has empty or non-object entries: ${malformed.join(', ')}`
    );
  }
  return models;
}

const KNOWN_FLAGS = new Set(['--ci', '--json', '--strict', '--verbose']);

function rejectUnknownFlags(args) {
  const unknown = args.filter((a) => a.startsWith('-') && !KNOWN_FLAGS.has(a));
  if (unknown.length > 0) {
    console.error(`Unknown option(s): ${unknown.join(', ')}`);
    console.error(`Known options: ${[...KNOWN_FLAGS].join(', ')}`);
    process.exit(2);
  }
}

async function loadWebsite() {
  if (NEON_MODELS_URL) {
    return {
      source: NEON_MODELS_URL,
      models: extractNeonModels(await fetchJson(NEON_MODELS_URL), NEON_MODELS_URL),
    };
  }
  return {
    source: path.relative(process.cwd(), LOCAL_DATA_PATH),
    models: extractNeonModels(
      JSON.parse(fs.readFileSync(LOCAL_DATA_PATH, 'utf-8')),
      LOCAL_DATA_PATH
    ),
  };
}

async function main() {
  const args = process.argv.slice(2);
  rejectUnknownFlags(args);
  const jsonMode = args.includes('--json');
  const strict = args.includes('--strict');
  const verbose = args.includes('--verbose') || (!args.includes('--ci') && !process.env.CI);

  let website, mirror;
  try {
    [website, mirror] = await Promise.all([
      loadWebsite(),
      fetchJson(MODELS_DEV_URL).then((api) => ({
        source: MODELS_DEV_URL,
        models: extractNeonModels(api, MODELS_DEV_URL),
      })),
    ]);
  } catch (err) {
    console.error(`Failed to load model catalogs: ${err.message}`);
    process.exit(2);
  }

  let drift;
  try {
    drift = classifyDrift(website.models, mirror.models);
  } catch (err) {
    console.error(`Could not compare the catalogs: ${err.message}`);
    process.exit(2);
  }
  const exitCode = drift.hasFault || (strict && drift.hasSyncDebt) ? 1 : 0;

  if (jsonMode) {
    console.log(
      JSON.stringify(
        { websiteSource: website.source, mirrorSource: mirror.source, ...drift },
        null,
        2
      )
    );
    process.exit(exitCode);
  }

  console.log('models.dev mirror sync check');
  console.log(
    `  source of truth: ${website.source} — ${Object.keys(website.models).length} models`
  );
  console.log(
    `  mirror:          ${mirror.source} — ${Object.keys(mirror.models).length} models\n`
  );

  if (drift.inSync) {
    console.log(`[OK] models.dev mirrors all ${Object.keys(website.models).length} models.`);
    process.exit(0);
  }

  if (drift.hasFault) {
    console.log(
      `[FAIL] models.dev lists ${drift.missingFromWebsite.length} \`neon\` model(s) that ` +
        `${website.source} does not publish. Either they were dropped here without an upstream ` +
        `removal, or the provider was edited upstream:\n`
    );
    drift.missingFromWebsite.forEach((id) => console.log(`  - ${id}`));
    console.log('');
  }

  if (drift.hasSyncDebt) {
    console.log('[SYNC DEBT] models.dev is behind. Expected while an upstream PR is open.\n');
    if (drift.awaitingUpstream.length) {
      console.log(`Published here, not yet on models.dev (${drift.awaitingUpstream.length}):`);
      drift.awaitingUpstream.forEach((id) => console.log(`  + ${id}`));
      console.log('');
    }
    if (drift.fieldDrift.length) {
      console.log(
        `Fields that differ (${drift.fieldDrift.length} model(s)) — direction is not inferable, ` +
          'so review which side is right:'
      );
      for (const { id, fields } of drift.fieldDrift) {
        console.log(`  ${id}:`);
        for (const f of fields) {
          if (verbose) {
            console.log(`    ${f.field}:`);
            console.log(`      here:       ${JSON.stringify(f.website)}`);
            console.log(`      models.dev: ${JSON.stringify(f.modelsDev)}`);
          } else {
            console.log(`    ${f.field}`);
          }
        }
      }
      console.log('');
    }
    console.log(UPSTREAM_PR_HINT);
  }

  process.exit(exitCode);
}

main();
