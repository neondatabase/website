#!/usr/bin/env node
/**
 * Import model entries into src/app/models.json/data.json from a resolved
 * models.dev catalog.
 *
 * data.json is the source of truth and is authored here. This is a convenience
 * for the one thing models.dev genuinely does for us: it resolves `base_model`
 * inheritance, so an entry that only declares a base model and a price comes
 * back with the modalities, limits and dates filled in. Pulling that in beats
 * copying twenty fields by hand.
 *
 * It merges the models you name and leaves every other entry untouched. That is
 * the difference that matters: this file routinely holds models and prices that
 * models.dev does not have yet, and a wholesale regenerate would delete them.
 *
 * `--from` takes a local file, so you do not have to wait for an upstream PR to
 * merge and redeploy. Build the resolved catalog from a models.dev checkout with
 * your entries already in it:
 *
 *   cd <models.dev checkout> && bun validate > /tmp/api.json
 *   node src/scripts/import-models-from-models-dev.mjs --from /tmp/api.json --models kimi-k3
 *
 * Usage:
 *   --models <a,b,c>   import exactly these ids (required unless --all)
 *   --all              refresh every id already present in data.json
 *   --from <file|url>  resolved catalog (default https://models.dev/api.json)
 *   --stdout           print the merged catalog instead of writing it
 *
 * Exit codes: 0 written, 2 could not load, 3 nothing selected or unknown id.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(DIRNAME, '../app/models.json/data.json');
const DOC_URL = 'https://neon.com/docs/ai-gateway/models';

// Not part of the capability catalog, or describing the canonical model rather
// than the one Neon serves. `provider` is re-added below as the model's maker.
const STRIP = new Set([
  'description',
  'benchmarks',
  'weights',
  'links',
  'experimental',
  'provider',
]);

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

const PROVIDER_ORDER = [
  'anthropic',
  'openai',
  'google',
  'meta',
  'alibaba',
  'zhipuai',
  'thinkingmachines',
];

// The organisation that made the model, matching models.dev provider ids — not
// the `owned_by` the gateway reports, which names whoever hosts it (`inkling`
// comes back as `databricks`, `glm-5-2` as `zhipu`). Both are published: this on
// /models.json, `owned_by` on /v1/models.
function providerFor(model) {
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
              : s.startsWith('glm')
                ? 'zhipuai'
                : s === 'ling' || s.startsWith('inkling')
                  ? 'thinkingmachines'
                  : undefined;
  const family = typeof model.family === 'string' ? model.family : '';
  const id = typeof model.id === 'string' ? model.id : '';
  return match(family) || match(id) || (id.includes('llama') ? 'meta' : undefined);
}

function orderKeys(model) {
  const out = {};
  for (const key of KEY_ORDER) if (key in model) out[key] = model[key];
  for (const key of Object.keys(model)) if (!(key in out)) out[key] = model[key];
  return out;
}

function shape(id, raw) {
  const provider = providerFor({ id, ...raw });
  if (!provider) return { error: id };
  const clean = { id, provider };
  for (const [k, v] of Object.entries(raw)) {
    if (k === 'id' || STRIP.has(k)) continue;
    clean[k] = v;
  }
  return { model: orderKeys(clean) };
}

async function loadResolved(from) {
  if (/^https?:\/\//.test(from)) {
    const res = await fetch(from, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`GET ${from} -> ${res.status} ${res.statusText}`);
    return res.json();
  }
  return JSON.parse(fs.readFileSync(from, 'utf-8'));
}

function argValue(args, flag) {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
}

async function main() {
  const args = process.argv.slice(2);
  const toStdout = args.includes('--stdout');
  const all = args.includes('--all');
  const from = argValue(args, '--from') || 'https://models.dev/api.json';
  const requested = (argValue(args, '--models') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
  const current = existing.neon.models;

  if (!all && requested.length === 0) {
    console.error(
      'Nothing selected. Pass --models <a,b,c> to import specific models, or --all to refresh\n' +
        'every id already in data.json. There is no default: this file is the source of truth and\n' +
        'holds entries models.dev does not have yet, so an unscoped overwrite would delete them.'
    );
    process.exit(3);
  }

  let api;
  try {
    api = await loadResolved(from);
  } catch (err) {
    console.error(`Failed to load ${from}: ${err.message}`);
    process.exit(2);
  }
  const upstream = api?.neon?.models;
  if (!upstream || typeof upstream !== 'object') {
    console.error(`No "neon.models" map found in ${from}`);
    process.exit(2);
  }

  const ids = all ? Object.keys(current).filter((id) => id in upstream) : requested;
  const unknown = ids.filter((id) => !(id in upstream));
  if (unknown.length) {
    console.error(`Not present in ${from}: ${unknown.join(', ')}`);
    console.error(
      'Add the entry to your models.dev checkout and rebuild, or pass --from a catalog that has it.'
    );
    process.exit(3);
  }

  const merged = { ...current };
  const noProvider = [];
  for (const id of ids) {
    const { model, error } = shape(id, upstream[id]);
    if (error) {
      noProvider.push(error);
      continue;
    }
    merged[id] = model;
  }
  if (noProvider.length) {
    console.error(`Could not derive provider for: ${noProvider.join(', ')}`);
    console.error('Extend providerFor() with the new family before importing.');
    process.exit(3);
  }

  const sortedIds = Object.keys(merged).sort((a, b) => {
    const pa = PROVIDER_ORDER.indexOf(merged[a].provider);
    const pb = PROVIDER_ORDER.indexOf(merged[b].provider);
    if (pa !== pb) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    return String(merged[a].name).localeCompare(String(merged[b].name));
  });
  const models = {};
  for (const id of sortedIds) models[id] = merged[id];

  const output = { neon: { ...existing.neon, doc: DOC_URL, models } };
  const json = `${JSON.stringify(output, null, 2)}\n`;

  if (toStdout) {
    process.stdout.write(json);
    return;
  }
  fs.writeFileSync(OUT_PATH, json);
  const added = ids.filter((id) => !(id in current));
  console.log(
    `Merged ${ids.length} model(s) into ${path.relative(process.cwd(), OUT_PATH)} ` +
      `(${added.length} new, ${ids.length - added.length} refreshed); ${sortedIds.length} total.`
  );
}

main();
