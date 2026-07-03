#!/usr/bin/env node
/**
 * Generate src/app/models.json/data.json (the data behind /models.json) from the
 * upstream models.dev `neon` provider.
 *
 * The Neon AI Gateway catalog is maintained as the `neon` provider on models.dev.
 * models.dev resolves each model's `base_model` inheritance at build time, so its
 * public API (https://models.dev/api.json) already contains every inherited value
 * (capabilities, modalities, limits, dates). This script fetches that resolved
 * `neon` entry and reshapes it into what /models.json serves:
 *   - keeps the models.dev api.json shape (`{ "neon": { ...provider, models } }`)
 *   - adds a per-model `provider` (the underlying model provider), derived from
 *     `family`/`id` — the one field /models.json adds on top of models.dev
 *   - drops fields that aren't part of the capability catalog and can describe the
 *     canonical (not Neon-served) model: `description`, `benchmarks`, `weights`, `links`
 *   - points `doc` at the AI Gateway models page
 *
 * The `check-models-sync.js` job verifies the committed data.json matches upstream;
 * run this to regenerate it whenever the models.dev `neon` provider changes.
 *
 * NOTE: output reflects the *deployed* models.dev api.json. If a models.dev PR was
 * merged but api.json hasn't redeployed yet, regenerating will lag until it does.
 *
 * Usage:
 *   node src/scripts/generate-models-json.js            # write data.json
 *   node src/scripts/generate-models-json.js --stdout   # print instead of writing
 *   MODELS_DEV_URL=... node src/scripts/generate-models-json.js
 */

const fs = require('fs');
const path = require('path');

const MODELS_DEV_URL = process.env.MODELS_DEV_URL || 'https://models.dev/api.json';
const OUT_PATH = path.resolve(__dirname, '../app/models.json/data.json');
const DOC_URL = 'https://neon.com/docs/ai-gateway/models';

// Fields dropped from each model (not part of the /models.json capability catalog).
const STRIP = new Set(['description', 'benchmarks', 'weights', 'links']);

// Stable, human-friendly key order per model.
const KEY_ORDER = [
  'id',
  'name',
  'provider',
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

// Sort order for providers in the output.
const PROVIDER_ORDER = ['anthropic', 'openai', 'google', 'meta', 'alibaba'];

// Derive the underlying model provider from family (falling back to id).
function providerFor(model) {
  const family = typeof model.family === 'string' ? model.family : '';
  const id = typeof model.id === 'string' ? model.id : '';
  const match = (s) =>
    s.startsWith('claude')
      ? 'anthropic'
      : s.startsWith('gpt') || s === 'o' || s.startsWith('o-')
        ? 'openai'
        : s.startsWith('gemini') || s.startsWith('gemma')
          ? 'google'
          : s.startsWith('llama')
            ? 'meta'
            : s.startsWith('qwen')
              ? 'alibaba'
              : undefined;
  return match(family) || match(id) || (id.includes('llama') ? 'meta' : undefined);
}

function orderKeys(model) {
  const out = {};
  for (const key of KEY_ORDER) if (key in model) out[key] = model[key];
  for (const key of Object.keys(model)) if (!(key in out)) out[key] = model[key];
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const toStdout = args.includes('--stdout');

  const res = await fetch(MODELS_DEV_URL, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    console.error(`Failed to fetch ${MODELS_DEV_URL}: ${res.status} ${res.statusText}`);
    process.exit(2);
  }
  const api = await res.json();
  const neon = api && api.neon;
  if (!neon || typeof neon !== 'object' || !neon.models || typeof neon.models !== 'object') {
    console.error(`No "neon" provider (with models) found in ${MODELS_DEV_URL}`);
    process.exit(2);
  }

  const models = {};
  const unknownProvider = [];
  for (const [id, raw] of Object.entries(neon.models)) {
    const model = { id, ...raw };
    const provider = providerFor(model);
    if (!provider) unknownProvider.push(id);

    const clean = { id };
    if (provider) clean.provider = provider;
    for (const [k, v] of Object.entries(raw)) {
      if (k === 'id' || STRIP.has(k)) continue;
      clean[k] = v;
    }
    models[id] = orderKeys(clean);
  }

  if (unknownProvider.length) {
    console.error(`Could not derive provider for: ${unknownProvider.join(', ')}`);
    console.error('Extend providerFor() with the new family before regenerating.');
    process.exit(2);
  }

  const sortedIds = Object.keys(models).sort((a, b) => {
    const pa = PROVIDER_ORDER.indexOf(models[a].provider);
    const pb = PROVIDER_ORDER.indexOf(models[b].provider);
    if (pa !== pb) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    return String(models[a].name).localeCompare(String(models[b].name));
  });
  const sortedModels = {};
  for (const id of sortedIds) sortedModels[id] = models[id];

  const output = {
    neon: {
      id: 'neon',
      name: typeof neon.name === 'string' ? neon.name : 'Neon',
      npm: neon.npm,
      api: neon.api,
      env: neon.env,
      doc: DOC_URL,
      models: sortedModels,
    },
  };

  const json = JSON.stringify(output, null, 2) + '\n';
  if (toStdout) {
    process.stdout.write(json);
  } else {
    fs.writeFileSync(OUT_PATH, json);
    console.log(`Wrote ${path.relative(process.cwd(), OUT_PATH)} — ${sortedIds.length} models`);
  }
}

main();
