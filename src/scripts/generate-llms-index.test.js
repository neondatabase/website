import { createRequire } from 'module';

import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const { generateIndexText } = require('./generate-llms-index');
const config = require('./llms-index-config');

// getSectionOrder (in the generator) includes any configured section that has a
// subIndex and then dereferences organized[section], so those sections must be
// present even with no files. Derive the fixture from the config so adding a new
// subIndex section can't silently break this test.
const buildMinimalOrganized = () =>
  Object.fromEntries(
    config.sections.filter((s) => s.subIndex).map((s) => [s.name, { _files: [], _subsections: {} }])
  );

describe('generateIndexText — Common tasks', () => {
  it('renders a "## Common tasks" section with markdown links', () => {
    const text = generateIndexText(buildMinimalOrganized(), []);
    expect(text).toContain('## Common tasks');
    // At least one task renders as a markdown link
    expect(text).toMatch(/## Common tasks\n\n- \[.+\]\(.+\)/);
    // The claimable-provisioning task is present
    expect(text).toContain('https://neon.com/auth.md');
  });

  it('no longer renders the old "When to use Neon" or "Common Queries" headings', () => {
    const text = generateIndexText(buildMinimalOrganized(), []);
    expect(text).not.toContain('## When to use Neon');
    expect(text).not.toContain('## Common Queries');
  });
});
