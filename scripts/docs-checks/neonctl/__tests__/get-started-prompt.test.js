import { createRequire } from 'module';
import path from 'path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const { extractFromFile } = require('../extract-examples.js');
const { loadSchema } = require('../schema.js');
const { validate } = require('../validate.js');

const REPO_ROOT = path.join(import.meta.dirname, '..', '..', '..', '..');
const PROMPT_DIR = path.join(REPO_ROOT, 'public', 'get-started');
const PROMPT = path.join(PROMPT_DIR, 'prompt.md');

// The console hands this prompt to coding agents, and the default validation
// only scans content/, so its commands are checked here.
describe('get-started prompt', () => {
  it('uses real neon commands and options', () => {
    const { errors } = validate({ root: PROMPT_DIR, schema: loadSchema() });

    expect(errors.map((e) => `${e.line}: ${e.message}`)).toEqual([]);
  });

  it('creates a separate branch with neon checkout --create', () => {
    const invocations = extractFromFile(PROMPT).filter(
      (inv) => inv.source === 'fenced' && inv.argv[0] === 'checkout'
    );

    expect(invocations.map((inv) => inv.argv)).toContainEqual(expect.arrayContaining(['--create']));
  });
});
