#!/usr/bin/env node
/**
 * Verify that /models and /models.json describe the same models with the same core data.
 *
 * The two endpoints intentionally differ in shape — /models.json mirrors models.dev, /models is a
 * REST resource carrying code examples — but they must never disagree on the facts they share.
 * A model present in one and missing from the other, or priced differently in each, means one of
 * them is lying to whoever reads it.
 *
 * Structure is not compared. Only the model id set and the fields both endpoints carry.
 *
 * Usage:
 *   node src/scripts/check-models-endpoint-sync.js            # local files
 *   node src/scripts/check-models-endpoint-sync.js --live     # fetch from --base (default neon.com)
 *   node src/scripts/check-models-endpoint-sync.js --ci       # terse output for CI logs
 *
 * Exit codes: 0 in sync, 1 drift, 2 could not load an endpoint.
 */

const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const CI = args.includes('--ci') || (process.env.CI && !args.includes('--verbose'));
const JSON_OUT = args.includes('--json');
const baseIndex = args.indexOf('--base');
const BASE = baseIndex === -1 ? 'https://neon.com' : args[baseIndex + 1];

/** Fields both endpoints carry and must agree on. Anything else is shape, not fact. */
const SHARED_FIELDS = [
  'name',
  'provider',
  'family',
  'release_date',
  'last_updated',
  'knowledge',
  'reasoning',
  'tool_call',
  'structured_output',
  'temperature',
  'open_weights',
  'modalities',
  'limit',
  'cost',
];

const canonical = (value) => JSON.stringify(value ?? null);

async function loadLive(pathname) {
  const url = `${BASE}${pathname}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.json();
}

/**
 * Offline, the REST payload is rebuilt from the same modules the route uses rather than by
 * booting Next. That still catches what matters, because the drift lives in the data.
 */
async function loadModelsEndpoint() {
  if (LIVE) return loadLive('/models');
  const catalog = require(path.join(ROOT, 'src/app/models.json/data.json'));
  const capabilities = require(path.join(ROOT, 'src/app/models/capabilities.json'));
  const { resolveAll } = await import(
    require('url').pathToFileURL(path.join(ROOT, 'src/app/models/resolve.js')).href
  );
  const models = resolveAll(catalog, capabilities);
  return { probed_at: capabilities.probedAt, total: models.length, models };
}

async function loadModelsJson() {
  if (LIVE) return loadLive('/models.json');
  return require(path.join(ROOT, 'src/app/models.json/data.json'));
}

async function main() {
  let modelsEndpoint;
  let modelsJson;
  try {
    [modelsEndpoint, modelsJson] = await Promise.all([loadModelsEndpoint(), loadModelsJson()]);
  } catch (error) {
    console.error(`Could not load an endpoint: ${error.message}`);
    process.exit(2);
  }

  const catalogModels = modelsJson?.neon?.models ?? {};
  const restModels = new Map((modelsEndpoint?.models ?? []).map((m) => [m.id, m]));

  const catalogIds = new Set(Object.keys(catalogModels));
  const restIds = new Set(restModels.keys());

  // /models lists what the gateway serves; /models.json lists the published catalog. The published
  // catalog is allowed to be a superset — a model can be catalogued before it is enabled — but a
  // model the gateway serves and the catalog has never heard of is a real problem.
  const servedButUncatalogued = [...restIds].filter((id) => !catalogIds.has(id));
  const cataloguedButUnserved = [...catalogIds].filter((id) => !restIds.has(id));

  const fieldDrift = [];
  for (const id of [...restIds].filter((candidate) => catalogIds.has(candidate))) {
    const rest = restModels.get(id);
    const entry = catalogModels[id];
    for (const field of SHARED_FIELDS) {
      if (canonical(rest[field]) !== canonical(entry[field])) {
        fieldDrift.push({
          id,
          field,
          models: canonical(entry[field]),
          rest: canonical(rest[field]),
        });
      }
    }
  }

  const inSync = servedButUncatalogued.length === 0 && fieldDrift.length === 0;

  if (JSON_OUT) {
    console.log(
      JSON.stringify({ inSync, servedButUncatalogued, cataloguedButUnserved, fieldDrift }, null, 2)
    );
    process.exit(inSync ? 0 : 1);
  }

  const source = LIVE ? `${BASE}/models vs ${BASE}/models.json` : 'local /models vs /models.json';

  if (servedButUncatalogued.length) {
    console.error(
      `Served by /models but absent from /models.json: ${servedButUncatalogued.join(', ')}`
    );
  }

  if (fieldDrift.length) {
    console.error(`${fieldDrift.length} field(s) disagree between the endpoints:`);
    for (const drift of fieldDrift) {
      console.error(
        CI
          ? `  ${drift.id}.${drift.field}`
          : `  ${drift.id}.${drift.field}\n    /models.json: ${drift.models}\n    /models:      ${drift.rest}`
      );
    }
  }

  if (cataloguedButUnserved.length) {
    // Not a failure. The catalog legitimately runs ahead of what a branch is entitled to serve.
    console.log(
      `Note: catalogued but not served (${cataloguedButUnserved.length}): ${cataloguedButUnserved.join(', ')}`
    );
  }

  if (!inSync) {
    console.error(
      '\nRegenerate with `npm run generate:models`, then re-probe capabilities if the model set changed.'
    );
    process.exit(1);
  }

  console.log(`${source}: ${restIds.size} models in sync on ${SHARED_FIELDS.length} shared fields`);
}

main();
