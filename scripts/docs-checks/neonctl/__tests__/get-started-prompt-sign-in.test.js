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
  const invocations = extractFromFile(PROMPT);
  const position = (matches) => invocations.findIndex((inv) => matches(inv.argv));

  // `neon login` starts a browser sign-in even when NEON_API_KEY or a stored profile
  // exists, so an agent that reaches it first waits on a browser it doesn't need.
  it('checks for an existing credential before telling the agent to run neon login', () => {
    const check = position((argv) => argv[0] === 'profile' && argv[1] === 'list');
    const login = position((argv) => argv[0] === 'login' || argv[0] === 'auth');

    expect(check, 'no `neon profile list` credential check in the prompt').not.toBe(-1);
    expect(login, 'no `neon login` step in the prompt').not.toBe(-1);
    expect(check).toBeLessThan(login);
  });
});
