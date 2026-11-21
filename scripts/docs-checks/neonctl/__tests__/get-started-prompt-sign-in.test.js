import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const { extractFromFile } = require('../extract-examples.js');

const PROMPT = path.join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  'public',
  'get-started',
  'prompt.md'
);

describe('get started prompt sign-in', () => {
  // `neon login` starts a browser sign-in even when NEON_API_KEY or a saved sign-in
  // works, so an agent that reaches it first waits on a browser it doesn't need.
  it('runs the neon me credential check before any instruction to run neon login', () => {
    const check = extractFromFile(PROMPT).find(
      (inv) => inv.source === 'fenced' && inv.argv[0] === 'me'
    );
    // A "don't run `neon login`" sentence is not a login step.
    const login = fs
      .readFileSync(PROMPT, 'utf8')
      .split(/\r?\n/)
      .findIndex((line) => /(?<!n't )\brun `neon (login|auth)`/i.test(line));

    expect(check, 'no fenced `neon me` credential check in the prompt').toBeDefined();
    expect(login, 'no instruction to run `neon login` in the prompt').not.toBe(-1);
    // `line` is 1-based; `login` is a 0-based index.
    expect(check.line - 1).toBeLessThan(login);
  });
});
