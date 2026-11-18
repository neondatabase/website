import { createRequire } from 'module';
import path from 'path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const { extractFromFile } = require('../extract-examples.js');
const { loadSchema } = require('../schema.js');
const { validateInvocation } = require('../validate.js');

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

  // An agent that can't finish a browser sign-in has no account to link with,
  // so the prompt has to give it a command that works without one.
  it('offers a claimable neon init for agents that cannot sign in', () => {
    const claimable = invocations.filter(
      (inv) => inv.argv[0] === 'init' && inv.argv.includes('--claimable')
    );

    expect(claimable, 'no `neon init --claimable` command in the prompt').toHaveLength(1);
    expect(validateInvocation(claimable[0], { schema: loadSchema() })).toEqual([]);
  });

  // The agent has to hand the claim URL to the user; a browser opened on the
  // agent's machine reaches nobody.
  it('hands off the claim with neon claim accept --no-open', () => {
    const accept = invocations.filter(
      (inv) => inv.source === 'fenced' && inv.argv[0] === 'claim' && inv.argv[1] === 'accept'
    );

    expect(accept, 'no fenced `neon claim accept` command in the prompt').toHaveLength(1);
    expect(accept[0].argv).toContain('--no-open');
    expect(validateInvocation(accept[0], { schema: loadSchema() })).toEqual([]);
  });
});
