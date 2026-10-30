#!/usr/bin/env node
/**
 * Import model entries into src/app/models.json/data.json from a resolved
 * models.dev catalog.
 *
 * Production builds refresh data.json from the Neon AI Gateway
 * (scripts/update-models-from-ai-gateway.mjs), which overwrites every field the
 * gateway supplies. What an import contributes past a build is only what the
 * gateway lacks: `released`, `last_updated` and `cost.input_audio`. Use it to
 * fill those for a new model, or to populate the committed fallback offline.
 *
 * It merges the models you name and leaves every other entry untouched, because
 * this file can hold models that models.dev does not have yet.
 *
 * `--from` takes a local file, so you do not have to wait for an upstream PR to
 * merge and redeploy. Build the resolved catalog from a models.dev checkout with
 * your entries already in it:
 *
 *   cd <models.dev checkout> && bun validate > /tmp/api.json
 *   node src/scripts/import-models-from-models-dev.mjs --from /tmp/api.json --models kimi-k3
 *
 * There is no "refresh everything" mode. The mirror lags this file by design, so
 * a bulk refresh would quietly replace corrected prices and locally added models
 * with older upstream values — the exact damage this file exists to prevent.
 *
 * Usage:
 *   --models <a,b,c>   import exactly these ids (required)
 *   --from <file|url>  resolved catalog (default https://models.dev/api.json)
 *   --provider <id>    provider (host) for ids new to the catalog; models.dev
 *                      has no per-model host, so re-imports keep the catalog's
 *                      value
 *   --stdout           print the merged catalog instead of writing it
 *
 * Exit codes: 0 written, 2 could not load, 3 bad selection or invalid result.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { validateCatalog } from '../../scripts/lib/models-catalog.mjs';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(DIRNAME, '../app/models.json/data.json');
const DOC_URL = 'https://neon.com/docs/ai-gateway/models';

// Not part of the capability catalog, or describing the canonical model rather
// than the one Neon serves. models.dev's per-model `provider` is an SDK override;
// our `lab` and `provider` are set below.
const STRIP = new Set([
  'description',
  'benchmarks',
  'weights',
  'links',
  'experimental',
  'lab',
  'provider',
]);

const KEY_ORDER = [
  'id',
  'name',
  'lab',
  'provider',
  'family',
  'released',
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

const LAB_ORDER = [
  'anthropic',
  'openai',
  'google',
  'meta',
  'alibaba',
  'zhipuai',
  'thinkingmachines',
  'moonshotai',
  'xai',
];

// The organisation that made the model, matching models.dev lab ids and the
// gateway's `owned_by`.
function labFor(model) {
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
                : s.startsWith('kimi')
                  ? 'moonshotai'
                  : s.startsWith('grok')
                    ? 'xai'
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

function shape(id, raw, provider) {
  const lab = labFor({ id, ...raw });
  if (!lab) return { error: id };
  const clean = { id, lab, provider };
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

const KNOWN_FLAGS = new Set(['--models', '--from', '--provider', '--stdout']);

// A flag whose value is missing swallows the next flag, or nothing at all, and
// the run looks like it worked. Refuse both that and an unrecognised flag.
function argValue(args, flag) {
  const i = args.indexOf(flag);
  if (i === -1) return null;
  const value = args[i + 1];
  if (value === undefined || value.startsWith('-')) {
    console.error(`${flag} needs a value.`);
    process.exit(3);
  }
  return value;
}

function rejectUnknownFlags(args) {
  const unknown = args.filter((a) => a.startsWith('-') && !KNOWN_FLAGS.has(a));
  if (unknown.length > 0) {
    console.error(`Unknown option(s): ${unknown.join(', ')}`);
    console.error(`Known options: ${[...KNOWN_FLAGS].join(', ')}`);
    process.exit(3);
  }
}

async function main() {
  const args = process.argv.slice(2);
  rejectUnknownFlags(args);
  const toStdout = args.includes('--stdout');
  const from = argValue(args, '--from') || 'https://models.dev/api.json';
  const newProvider = argValue(args, '--provider');
  const requested = (argValue(args, '--models') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
  const current = existing.neon.models;

  if (requested.length === 0) {
    console.error(
      'Nothing selected. Pass --models <a,b,c>. There is no bulk mode: this file is the source\n' +
        'of truth and holds models and corrected prices the mirror does not have, so refreshing\n' +
        'everything from models.dev would quietly revert them.'
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

  const ids = requested;
  const unusable = ids.filter((id) => {
    const model = upstream[id];
    return (
      id in upstream &&
      (!model ||
        typeof model !== 'object' ||
        Array.isArray(model) ||
        Object.keys(model).length === 0)
    );
  });
  if (unusable.length) {
    console.error(`Empty or malformed in ${from}: ${unusable.join(', ')}`);
    process.exit(2);
  }

  const unknown = ids.filter((id) => !(id in upstream));
  if (unknown.length) {
    console.error(`Not present in ${from}: ${unknown.join(', ')}`);
    console.error(
      'Add the entry to your models.dev checkout and rebuild, or pass --from a catalog that has it.'
    );
    process.exit(3);
  }

  const noHost = ids.filter((id) => !(id in current) && !newProvider);
  if (noHost.length) {
    console.error(`New to the catalog, so no provider (host) to keep: ${noHost.join(', ')}`);
    console.error('Pass --provider <id> with the provider the gateway lists for them.');
    process.exit(3);
  }

  const merged = { ...current };
  const noLab = [];
  const unreleased = [];
  for (const id of ids) {
    const isNew = !(id in current);
    const { model, error } = shape(id, upstream[id], isNew ? newProvider : current[id].provider);
    if (error) {
      noLab.push(error);
      continue;
    }
    // models.dev has no `released`. A re-import keeps the catalog's flag; a model new to the
    // catalog starts unreleased, because importing it is not announcing it.
    if (isNew) unreleased.push(id);
    merged[id] = orderKeys({ ...model, released: isNew ? false : current[id].released });
  }
  if (unreleased.length) {
    console.error(
      `Imported as released: false: ${unreleased.join(', ')}. Set it to true once announced.`
    );
  }
  if (noLab.length) {
    console.error(`Could not derive lab for: ${noLab.join(', ')}`);
    console.error('Extend labFor() with the new family before importing.');
    process.exit(3);
  }

  const sortedIds = Object.keys(merged).sort((a, b) => {
    const pa = LAB_ORDER.indexOf(merged[a].lab);
    const pb = LAB_ORDER.indexOf(merged[b].lab);
    if (pa !== pb) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    return String(merged[a].name).localeCompare(String(merged[b].name));
  });
  const models = {};
  for (const id of sortedIds) models[id] = merged[id];

  const output = { neon: { ...existing.neon, doc: DOC_URL, models } };

  // The mirror is not authoritative, so what it hands back is checked against
  // the same rules an authored edit is, before it can reach the file consumers
  // read.
  const errors = validateCatalog(output);
  if (errors.length > 0) {
    console.error(`Refusing to write: the merged catalog is invalid.`);
    for (const err of errors.slice(0, 20)) console.error(`  ${err}`);
    process.exit(3);
  }

  const json = `${JSON.stringify(output, null, 2)}\n`;

  if (toStdout) {
    process.stdout.write(json);
    return;
  }
  // Write-then-rename: a crash mid-write must not leave a truncated catalog.
  const tmp = `${OUT_PATH}.tmp`;
  fs.writeFileSync(tmp, json);
  fs.renameSync(tmp, OUT_PATH);
  const added = ids.filter((id) => !(id in current));
  console.log(
    `Merged ${ids.length} model(s) into ${path.relative(process.cwd(), OUT_PATH)} ` +
      `(${added.length} new, ${ids.length - added.length} refreshed); ${sortedIds.length} total.`
  );
}

main();
