import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

import META from './meta';

const require = createRequire(import.meta.url);
const schema = require('../../../../../../scripts/docs-checks/neonctl/schema.json');

// Every curated example in meta.js must be a real invocation: the command
// path must resolve in the schema and every --flag must exist on the
// command (or a parent in its path, or globally). A neonctl release that
// renames a flag fails here instead of shipping a wrong example.
describe('cli-command-index meta', () => {
  const errors = [];

  for (const [name, meta] of Object.entries(META)) {
    if (name !== 'completion' && !schema.commands[name]) {
      errors.push(`meta entry "${name}" is not a schema command`);
    }
    for (const example of meta.examples || []) {
      const tokens = example
        .replace(/^npx neon(ctl)?@latest\s+/, '')
        .replace(/^neonctl\s+/, '')
        .replace(/^neon\s+/, '')
        .split(/\s+/);

      // Walk the command path, collecting option pools along the way.
      const pools = [schema.globalOptions];
      let pool = schema.commands;
      let i = 0;
      while (i < tokens.length && pool && pool[tokens[i]]) {
        pools.push(pool[tokens[i]].options || {});
        pool = pool[tokens[i]].commands;
        i += 1;
      }
      if (pools.length === 1) {
        errors.push(`"${example}": command path does not resolve`);
        continue;
      }
      for (let j = i; j < tokens.length; j += 1) {
        const token = tokens[j];
        if (token === '--') break; // passthrough args
        if (!token.startsWith('--')) continue; // positionals/values not checked
        const flag = token.slice(2).split('=')[0];
        if (!pools.some((p) => p[flag])) {
          errors.push(`"${example}": unknown option --${flag}`);
        }
      }
    }
    // Guard against schema-duplicating fields creeping back in: meta is
    // editorial copy only (desc + examples); enumerable data must derive
    // from the schema.
    const allowedKeys = Object.keys(meta).filter((k) => !['desc', 'examples'].includes(k));
    if (allowedKeys.length > 0) {
      errors.push(`meta "${name}" has non-editorial keys: ${allowedKeys.join(', ')}`);
    }
  }

  it('every curated example is valid and meta carries editorial copy only', () => {
    expect(errors).toEqual([]);
  });
});

// Coverage invariants (group mapping, doc page, nav entry per schema
// command) live in scripts/docs-checks/neonctl/__tests__/coverage.test.js so
// the refresh.js validation step runs them.
