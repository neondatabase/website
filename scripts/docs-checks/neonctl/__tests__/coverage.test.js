import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { load as loadYaml } from 'js-yaml';
import { describe, expect, it } from 'vitest';

import {
  GROUPS,
  GROUP_OF,
  HREF_OVERRIDES,
} from '../../../../src/components/pages/doc/cli-reference/cli-command-index/groups';
import schema from '../schema.json';

// Invariants the overview index relies on: every schema command must have a
// group mapping (buildRows throws at build otherwise), a doc page, and a
// navigation entry. This lives with the schema checks (not next to the
// component) so `npm run check:docs:neonctl` (which refresh.js runs after
// regenerating schema.json) fails here with a clear message instead of
// failing mid-build or shipping an orphan page.
describe('cli command coverage invariants', () => {
  const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
  const nav = fs.readFileSync(path.join(repoRoot, 'content/docs/navigation.yaml'), 'utf8');

  it('every schema command has a group mapping', () => {
    const unmapped = Object.keys(schema.commands).filter((name) => !GROUP_OF[name]);
    expect(unmapped).toEqual([]);
  });

  it('sidebar grouping matches the overview index grouping', () => {
    // The editorial grouping lives in two places by necessity (groups.js
    // for the index component, navigation.yaml for the sidebar); this pins
    // them together so they can't drift.
    const tree = loadYaml(nav);
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
