import { createRequire } from 'module';

import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const { generateIndexText, generateUnlinkedIndexText } = require('./generate-llms-index');
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

  it('does not link unlinked site-search indexes from the parent docs index', () => {
    const text = generateIndexText(buildMinimalOrganized(), [
      { title: 'Community Guides', url: 'https://neon.com/guides', description: 'tutorials' },
      { title: 'Changelog', url: 'https://neon.com/docs/changelog', description: 'releases' },
    ]);
    expect(text).not.toContain('https://neon.com/guides/llms.txt');
    expect(text).not.toContain('https://neon.com/docs/changelog/llms.txt');
    expect(config.unlinkedIndexes.map((index) => index.outputPath)).toEqual([
      'public/guides/llms.txt',
      'public/docs/changelog/llms.txt',
    ]);
  });
});

describe('generateUnlinkedIndexText', () => {
  it('lists markdown urls without linking the parent docs index', () => {
    const text = generateUnlinkedIndexText(
      { title: 'Neon Changelog', intro: 'Latest updates and releases.' },
      [
        {
          title: 'August 28',
          url: 'https://neon.com/docs/changelog/2026-08-28.md',
          subtitle: '',
        },
      ]
    );
    expect(text).toContain('# Neon Changelog');
    expect(text).toContain('[August 28](https://neon.com/docs/changelog/2026-08-28.md)');
    expect(text).not.toContain('https://neon.com/docs/llms.txt');
  });
});
