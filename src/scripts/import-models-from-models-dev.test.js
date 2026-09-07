import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import catalog from '../app/models.json/data.json';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(DIRNAME, 'import-models-from-models-dev.mjs');
const temps = [];

afterEach(() => {
  for (const file of temps.splice(0)) fs.rmSync(file, { force: true });
});

describe('import-models-from-models-dev', () => {
  // The committed catalog already has provider: xai. That does not prove
  // providerFor() maps grok; deleting the prefix rule still leaves data.json
  // and model-rows.test.js green.
  it('assigns grok ids to xai even when the upstream entry names another maker', () => {
    const from = path.join(os.tmpdir(), `import-grok-${process.pid}.json`);
    temps.push(from);
    const grok = catalog.neon.models['grok-4-6'];
    fs.writeFileSync(
      from,
      JSON.stringify({
        neon: { models: { 'grok-4-6': { ...grok, provider: 'wrong-upstream-host' } } },
      })
    );

    const stdout = execFileSync(process.execPath, [SCRIPT, '--from', from, '--models', 'grok-4-6', '--stdout'], {
      encoding: 'utf8',
    });
    const merged = JSON.parse(stdout);

    expect(merged.neon.models['grok-4-6'].provider).toBe('xai');
  });
});
