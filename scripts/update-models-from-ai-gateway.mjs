#!/usr/bin/env node
// Refreshes src/app/models.json/data.json from the Neon AI Gateway models listing.
// Never fails the build: on a missing env, a fetch error or an invalid result it
// warns and keeps the committed file, exiting 0 (same policy as update-github-stars.js).

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { buildCatalog, fetchAiGatewayModels } from './lib/ai-gateway-models.mjs';
import { validateCatalog } from './lib/models-catalog.mjs';

dotenv.config({ path: '.env' });

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(DIRNAME, '../src/app/models.json/data.json');
const PREFIX = 'AI Gateway models:';

async function main() {
  const baseUrl = process.env.NEON_AI_GATEWAY_BASE_URL;
  const token = process.env.NEON_AI_GATEWAY_TOKEN;
  if (!baseUrl || !token) {
    console.log(`${PREFIX} AI Gateway env not set; keeping committed models data`);
    return;
  }

  const committed = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  const committedModels = committed.neon.models;
  const committedCount = Object.keys(committedModels).length;

  const items = await fetchAiGatewayModels({ baseUrl, token });
  if (items.length === 0 || items.length < committedCount / 2) {
    console.warn(
      `${PREFIX} listing has ${items.length} models vs ${committedCount} committed; ` +
        'looks partial, keeping committed models data'
    );
    return;
  }

  const catalog = buildCatalog(items, committed);
  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    console.warn(`${PREFIX} generated catalog is invalid; keeping committed models data`);
    for (const err of errors.slice(0, 5)) console.warn(`  ${err}`);
    return;
  }

  // Write-then-rename: a crash mid-write must not leave a truncated catalog.
  const tmp = `${OUT_PATH}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(catalog, null, 2)}\n`);
  fs.renameSync(tmp, OUT_PATH);

  const models = catalog.neon.models;
  const ids = Object.keys(models);
  const added = ids.filter((id) => !(id in committedModels));
  const dropped = Object.keys(committedModels).filter((id) => !(id in models));
  const changed = ids.filter(
    (id) =>
      id in committedModels && JSON.stringify(models[id]) !== JSON.stringify(committedModels[id])
  );
  console.log(
    `${PREFIX} updated ${ids.length} models (${changed.length} changed, ` +
      `added [${added.join(', ')}], dropped [${dropped.join(', ')}])`
  );
}

main().catch((error) => {
  console.warn(`${PREFIX} ${error.message}; keeping committed models data`);
});
