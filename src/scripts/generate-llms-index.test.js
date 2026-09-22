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

describe('generateIndexText — Get started', () => {
  const organizedWithGetStarted = () => ({
    ...buildMinimalOrganized(),
    'Get Started': {
      _files: [
        {
          title: 'Get started with your AI agent',
          url: 'https://neon.com/docs/get-started/with-an-agent.md',
          subtitle: 'Set up Neon in your project using your AI coding assistant',
        },
      ],
      _subsections: {},
    },
  });

  it('places the Get started block after the tagline and before intro', () => {
    const text = generateIndexText(organizedWithGetStarted(), []);
    expect(text).toContain(`> ${config.tagline}\n\n${config.getStarted}\n\n${config.intro}`);
    expect(text.split(config.getStarted)).toHaveLength(2);

    const apiKeyPath = config.getStarted.slice(
      0,
      config.getStarted.indexOf('https://neon.com/auth.md')
    );
    expect(apiKeyPath).toContain('NEON_API_KEY');
    expect(apiKeyPath).toContain('npm i -g neon');
    expect(apiKeyPath).not.toMatch(/neon@\d/);
    expect(apiKeyPath).toContain('neon projects create');
    expect(apiKeyPath).toContain('--set-context');
    expect(apiKeyPath).toContain('--no-secrets');
    expect(apiKeyPath).toContain('--context-file "$PWD/.neon"');
    expect(apiKeyPath).toContain('replacing that file if present');
    expect(apiKeyPath).toContain('(`active` is `*`)');
    expect(apiKeyPath).not.toContain('new directory');
    expect(apiKeyPath).toContain(
      'DATABASE_URL="$(neon connection-string --pooled --database-name neondb)"'
    );
    expect(apiKeyPath).toContain('export DATABASE_URL');
    expect(apiKeyPath).toContain('npm install @neondatabase/serverless');
    expect(apiKeyPath).not.toMatch(/^neon auth$/m);
    expect(apiKeyPath).not.toMatch(/^neon init$/m);

    expect(config.getStarted).toContain('https://neon.com/auth.md');
    expect(config.getStarted.indexOf('neon projects create')).toBeLessThan(
      config.getStarted.indexOf('https://neon.com/auth.md')
    );
  });

  it('keeps a single "## Get Started" docs heading after the intro block', () => {
    const text = generateIndexText(organizedWithGetStarted(), []);
    expect(text.match(/^## Get Started$/gm)).toHaveLength(1);
    expect(text).toContain(
      '[Get started with your AI agent](https://neon.com/docs/get-started/with-an-agent.md)'
    );
    expect(text.indexOf(config.getStarted)).toBeLessThan(text.indexOf('## Get Started'));
  });
});

describe('generateIndexText — Common tasks', () => {
  it('renders a "## Common tasks" section with markdown links', () => {
    const text = generateIndexText(buildMinimalOrganized(), []);
    expect(text).toContain('## Common tasks');
    // At least one task renders as a markdown link
    expect(text).toMatch(/## Common tasks\n\n- \[.+\]\(.+\)/);
    const commonStart = text.indexOf('## Common tasks');
    const nextHeading = text.indexOf('\n## ', commonStart + 1);
    const commonTasks = text.slice(commonStart, nextHeading);
    expect(commonTasks).toContain('https://neon.com/auth.md');
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
