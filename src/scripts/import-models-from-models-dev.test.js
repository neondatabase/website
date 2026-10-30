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
  // The committed catalog already has lab: xai. That does not prove labFor()
  // maps grok; deleting the prefix rule still leaves data.json and
  // model-rows.test.js green.
  it('assigns grok ids to the xai lab and keeps the committed provider', () => {
    const from = path.join(os.tmpdir(), `import-grok-${process.pid}.json`);
    temps.push(from);
    const grok = catalog.neon.models['grok-4-6'];
    fs.writeFileSync(
      from,
      JSON.stringify({
        neon: {
          models: { 'grok-4-6': { ...grok, lab: 'wrong-lab', provider: { npm: '@ai-sdk/xai' } } },
        },
      })
    );

    const stdout = execFileSync(
      process.execPath,
      [SCRIPT, '--from', from, '--models', 'grok-4-6', '--stdout'],
      {
        encoding: 'utf8',
      }
    );
    const merged = JSON.parse(stdout);

    expect(merged.neon.models['grok-4-6'].lab).toBe('xai');
    expect(merged.neon.models['grok-4-6'].provider).toBe(grok.provider);
  });

  it('keeps the catalog released flag on re-import and starts a new model unreleased', () => {
    const from = path.join(os.tmpdir(), `import-released-${process.pid}.json`);
    temps.push(from);
    const { released: _released, ...grok } = catalog.neon.models['grok-4-6'];
    fs.writeFileSync(
      from,
      JSON.stringify({
        neon: {
          models: {
            'grok-4-6': { ...grok, released: false },
            'grok-new': { ...grok, id: 'grok-new', name: 'Grok New' },
          },
        },
      })
    );

    const stdout = execFileSync(
      process.execPath,
      [SCRIPT, '--from', from, '--models', 'grok-4-6,grok-new', '--provider', 'xai', '--stdout'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    const { models } = JSON.parse(stdout).neon;

    expect(models['grok-4-6'].released).toBe(true);
    expect(models['grok-new'].released).toBe(false);
    expect(models['grok-new'].provider).toBe('xai');
  });

  it('refuses a new model without --provider and writes nothing', () => {
    const from = path.join(os.tmpdir(), `import-no-provider-${process.pid}.json`);
    temps.push(from);
    const grok = catalog.neon.models['grok-4-6'];
    fs.writeFileSync(
      from,
      JSON.stringify({
        neon: { models: { 'grok-4-6': grok, 'grok-new': { ...grok, id: 'grok-new' } } },
      })
    );

    let error;
    try {
      execFileSync(
        process.execPath,
        [SCRIPT, '--from', from, '--models', 'grok-4-6,grok-new', '--stdout'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
      );
    } catch (err) {
      error = err;
    }

    expect(error.status).toBe(3);
    expect(error.stdout).toBe('');
    expect(error.stderr).toContain('grok-new');
  });
});
