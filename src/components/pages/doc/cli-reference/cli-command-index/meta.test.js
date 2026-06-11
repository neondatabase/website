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
        .replace(/^npx neonctl@latest\s+/, '')
        .replace(/^neonctl\s+/, '')
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

// Invariants the overview index relies on: every schema command must have a
// group mapping (buildRows throws at build otherwise), a doc page, and a
// navigation entry. A neonctl release that adds a command fails here with a
// clear message instead of failing mid-build or shipping an orphan page.
describe('cli command coverage invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const { GROUP_OF, HREF_OVERRIDES } = require('./groups');
  const repoRoot = path.join(__dirname, '..', '..', '..', '..', '..', '..');
  const nav = fs.readFileSync(path.join(repoRoot, 'content/docs/navigation.yaml'), 'utf8');

  it('every schema command has a group mapping', () => {
    const unmapped = Object.keys(schema.commands).filter((name) => !GROUP_OF[name]);
    expect(unmapped).toEqual([]);
  });

  it('sidebar grouping matches the overview index grouping', () => {
    // The editorial grouping lives in two places by necessity (groups.js
    // for the index component, navigation.yaml for the sidebar); this pins
    // them together so they can't drift.
    const jsYaml = require('js-yaml');
    const { GROUPS } = require('./groups');
    const tree = jsYaml.load(nav);
    const titleById = Object.fromEntries(GROUPS.map((g) => [g.id, g.title]));

    let cliSection = null;
    const findCli = (node) => {
      if (Array.isArray(node)) return node.forEach(findCli);
      if (node && typeof node === 'object') {
        if (node.section === 'CLI') cliSection = node;
        return Object.values(node).forEach(findCli);
      }
    };
    findCli(tree);
    expect(cliSection).toBeTruthy();

    const mismatches = [];
    for (const entry of cliSection.items) {
      if (!entry.section) continue; // Overview/Install/Quickstart
      for (const item of entry.items) {
        const name = item.slug.replace('cli/', '');
        const expected = titleById[GROUP_OF[name]];
        if (entry.section !== expected) {
          mismatches.push(`${name}: nav "${entry.section}" vs groups.js "${expected}"`);
        }
      }
    }
    expect(mismatches).toEqual([]);
  });

  it('every schema command has a doc page and nav entry', () => {
    const missingPages = [];
    const missingNav = [];
    for (const name of Object.keys(schema.commands)) {
      const href = HREF_OVERRIDES[name] || `/docs/cli/${name}`;
      const slug = href.replace('/docs/', '').split('#')[0];
      const page = path.join(repoRoot, 'content/docs', `${slug}.md`);
      if (!fs.existsSync(page)) missingPages.push(name);
      if (!nav.includes(`slug: ${slug}`)) missingNav.push(name);
    }
    expect(missingPages).toEqual([]);
    expect(missingNav).toEqual([]);
  });
});
