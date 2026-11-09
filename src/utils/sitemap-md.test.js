import { beforeAll, describe, expect, it } from 'vitest';

import { DOCS_DIR_PATH } from 'constants/content';
import { getPostBySlug, getPostSlugs } from 'utils/api-content';
import { getNavigation } from 'utils/api-docs';
import {
  PAGE_TYPES,
  classifyPage,
  getSitemapMarkdown,
  isDocsPath,
  isExcludedPath,
  navigationToSections,
  navSlugToPathname,
  renderSitemapMarkdown,
  shortDescription,
  typeOverride,
  withoutRedirectSources,
} from 'utils/sitemap-md';

describe('shortDescription', () => {
  it('returns the first sentence of the first non-empty candidate on one line', () => {
    expect(shortDescription('', 'Create a branch.\nThen  connect to it.')).toBe('Create a branch.');
  });

  it('caps long text at a word boundary', () => {
    const description = shortDescription(`${'word '.repeat(80)}end`);
    expect(description.length).toBeLessThanOrEqual(200);
    expect(description.endsWith('word…')).toBe(true);
  });

  it('returns an empty string when there is nothing to describe', () => {
    expect(shortDescription(undefined, null, '  ')).toBe('');
  });
});

describe('isExcludedPath', () => {
  it.each([
    ['/docs/changelog', true],
    ['/docs/changelog/2026-10-30', true],
    ['/docs/changelogs', false],
    ['/docs/introduction/roadmap', false],
  ])('treats %s as excluded: %s', (pathname, excluded) => {
    expect(isExcludedPath(pathname)).toBe(excluded);
  });
});

describe('navSlugToPathname', () => {
  it.each([
    ['get-started/why-neon', '/docs/get-started/why-neon'],
    ['/docs', '/docs'],
    ['https://neon.com/guides/convex-neon', '/guides/convex-neon'],
    ['https://neon.com/postgresql/tutorial/', '/postgresql/tutorial'],
    ['https://github.com/neondatabase/examples', null],
    [undefined, null],
  ])('maps %s to %s', (slug, pathname) => {
    expect(navSlugToPathname(slug)).toBe(pathname);
  });
});

describe('classifyPage', () => {
  it.each([
    [{ pathname: '/docs/reference/api/projects/list-projects', title: 'List' }, 'Reference'],
    [{ pathname: '/docs/auth/quick-start/nextjs', title: 'Next.js quickstart' }, 'Tutorial'],
    [{ pathname: '/docs/manage/part-1', title: 'Part 1 - Create an S3 bucket' }, 'Tutorial'],
    // A section name decides when the title doesn't.
    [
      {
        pathname: '/docs/auth/x',
        title: 'React',
        summary: 'Build your own auth UI',
        trail: ['Auth', 'Quickstarts'],
      },
      'Tutorial',
    ],
    // Non-task pages in a "Get started" section aren't tutorials.
    [
      {
        pathname: '/docs/ai-gateway/prepaid-credits',
        title: 'Prepaid credits',
        summary: 'Credits, pricing, and limits',
        trail: ['AI Gateway', 'Get started'],
      },
      'Conceptual',
    ],
    [
      {
        pathname: '/docs/storage/overview',
        title: 'Overview',
        trail: ['Object Storage', 'Get started'],
      },
      'Conceptual',
    ],
    [{ pathname: '/docs', title: 'Get started' }, 'Conceptual'],
    // Section names match whole: "Data API" is a product, not an API reference section.
    [
      {
        pathname: '/docs/data-api/access-control',
        title: 'Access control & security',
        summary: 'Understand how the Data API authenticates requests',
        trail: ['Postgres', 'Data API', 'Guides'],
      },
      'Conceptual',
    ],
    // A task verb in the title or summary beats an API/CLI/SDK keyword or section.
    [
      {
        pathname: '/docs/guides/branching-neon-cli',
        title: 'Branching with the CLI',
        summary: 'Learn how to create and delete branches with the Neon CLI',
      },
      'How-to',
    ],
    [
      {
        pathname: '/docs/reference/migrate-api-client-to-sdk',
        title: 'Migrate to @neon/sdk',
        trail: ['APIs & SDKs', 'SDKs'],
      },
      'How-to',
    ],
    // Command names are identifiers, not imperative titles.
    [{ pathname: '/docs/cli/deploy', title: 'deploy', trail: ['APIs & SDKs', 'CLI'] }, 'Reference'],
    // "reference" in the title wins over a task verb.
    [{ pathname: '/docs/postgresql/query-reference', title: 'Query reference' }, 'Reference'],
    [
      {
        pathname: '/docs/guides/logical-replication-manage',
        title: 'Commands',
        summary: 'Commands for managing your logical replication configuration',
      },
      'Reference',
    ],
    [{ pathname: '/docs/cli/login', title: 'login', trail: ['APIs & SDKs', 'CLI'] }, 'Reference'],
    [
      {
        pathname: '/docs/extensions/pg_trgm',
        title: 'pg_trgm',
        trail: ['Postgres', 'Extensions & guides', 'Postgres extensions'],
      },
      'Reference',
    ],
    [{ pathname: '/docs/introduction/branching', title: 'About branching' }, 'Conceptual'],
    [{ pathname: '/docs/guides/drizzle', title: 'Connect from Drizzle' }, 'How-to'],
    [
      { pathname: '/docs/connect/psql', title: 'psql', summary: 'Learn how to connect using psql' },
      'How-to',
    ],
    [{ pathname: '/docs/x', title: 'Branch reset', hasSteps: true }, 'How-to'],
    // Postgres catalog pages are reference unless the title is a task.
    [{ pathname: '/docs/functions/array_agg', title: 'Aggregate functions' }, 'Reference'],
    [{ pathname: '/docs/extensions/migrate-pg-search', title: 'Migrate from pg_search' }, 'How-to'],
    // A page with child pages is an overview, unless it's in a how-to section.
    [
      {
        pathname: '/docs/introduction/read-replicas',
        title: 'Read replicas',
        summary: 'Scale your app with read replicas',
        hasChildren: true,
      },
      'Conceptual',
    ],
    [
      {
        pathname: '/docs/guides/cloudflare-pages',
        title: 'Cloudflare',
        summary: 'Connect a Lakebase Postgres database to your Cloudflare Pages app',
        trail: ['Integrations & tooling', 'Deploy'],
        hasChildren: true,
      },
      'How-to',
    ],
    // Explanatory summaries beat <Steps>.
    [
      {
        pathname: '/docs/auth/authentication-flow',
        title: 'Authentication Flow',
        summary: 'Understanding the complete sign-in and sign-up process',
        hasSteps: true,
      },
      'Conceptual',
    ],
    [
      {
        pathname: '/docs/ai/semantic-kernel',
        title: 'Semantic Kernel',
        summary: 'Quickly build AI RAG and Agentic workflows',
      },
      'How-to',
    ],
    [
      {
        pathname: '/docs/connect/connection-pooling',
        title: 'Connection pooling',
        summary: 'Learn how connection pooling works in Neon',
      },
      'Conceptual',
    ],
  ])('classifies %o as %s', (page, type) => {
    expect(classifyPage(page)).toBe(type);
  });
});

describe('navigationToSections', () => {
  const navigation = [
    {
      nav: 'Get started',
      slug: '/docs',
      title: 'Get started',
      items: [
        { title: 'Overview', slug: '/docs' },
        {
          section: 'Why Neon?',
          items: [
            { title: 'Our mission', slug: 'get-started/why-neon', tag: 'new' },
            {
              title: 'Frameworks',
              slug: 'get-started/frameworks',
              items: [
                { title: 'Astro', slug: 'guides/astro' },
                { title: 'Community guide', slug: 'https://neon.com/guides/convex-neon' },
              ],
            },
          ],
        },
      ],
    },
    {
      nav: 'Products',
      title: 'Products',
      subnav: [
        {
          title: 'Postgres',
          slug: 'postgres/overview',
          items: [
            {
              section: 'Connect',
              items: [
                {
                  section: 'Too deep',
                  items: [{ title: 'Pooling', slug: 'connect/connection-pooling' }],
                },
                {
                  title: 'Getting started',
                  items: [{ title: 'Install', slug: 'connect/install' }],
                },
              ],
            },
          ],
        },
        { section: 'Starter code', items: [{ title: 'Examples', slug: 'https://github.com/x' }] },
      ],
    },
  ];

  const sections = navigationToSections(navigation, (pathname) =>
    pathname === '/docs/get-started/why-neon'
      ? { description: 'The mission.', lastmod: '2026-10-01' }
      : undefined
  );

  // [title or label, children] trees, for asserting structure.
  const shape = (items) =>
    items.map((item) =>
      item.children.length ? [item.title || item.label, shape(item.children)] : item.title
    );
  const summary = sections.map(({ title, depth, items }) => [depth, title, shape(items)]);

  it('maps nav areas, subnav entries, and sections to headings, and child pages to nesting', () => {
    expect(summary).toEqual([
      [2, 'Get started', ['Get started']],
      // On-site links outside /docs (the community guide) are dropped.
      [3, 'Why Neon?', ['Our mission', ['Frameworks', ['Astro']]]],
      [2, 'Products', []],
      [3, 'Postgres', ['Postgres']],
      // Sections below H4 and slugless grouping items become labels.
      [
        4,
        'Connect',
        [
          ['Too deep', ['Pooling']],
          ['Getting started', ['Install']],
        ],
      ],
      // Bare subnav sections use their section name; off-site links are dropped.
      [3, 'Starter code', []],
    ]);
  });

  it('attaches type, status, lastmod, and summary to each entry', () => {
    expect(sections[1].items[0]).toMatchObject({
      title: 'Our mission',
      url: 'https://neon.com/docs/get-started/why-neon.md',
      type: 'Conceptual',
      status: 'new',
      lastmod: '2026-10-01',
      description: 'The mission.',
    });
  });
});

describe('navigationToSections with repeated pages', () => {
  const navigation = [
    {
      nav: 'Build',
      title: 'Build',
      subnav: [
        {
          title: 'Building on Neon',
          slug: 'guides/platform',
          items: [
            // The landing page again, as its own section's first item.
            { section: 'Overview', items: [{ title: 'Integrating', slug: 'guides/platform' }] },
            {
              section: 'Drivers',
              items: [
                {
                  title: 'Serverless driver',
                  slug: 'serverless/driver',
                  items: [{ title: 'Pooling', slug: 'serverless/pooling' }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      nav: 'Reference',
      title: 'Reference',
      items: [
        {
          section: 'Libraries',
          items: [{ title: 'Serverless driver', slug: 'serverless/driver' }],
        },
        { title: 'Connect', slug: 'connect/intro', summary: 'Connect to Neon' },
      ],
    },
  ];
  const sections = navigationToSections(navigation, (pathname) =>
    pathname === '/docs/connect/intro'
      ? { description: 'Everything you need to connect.', type: 'Conceptual' }
      : undefined
  );
  const entries = sections.flatMap(({ items }) => {
    const flat = [];
    const walk = (nodes) =>
      nodes.forEach((node) => {
        if (node.url) flat.push(node);
        walk(node.children || []);
      });
    walk(items);
    return flat;
  });
  const entriesFor = (pathname) =>
    entries.filter(({ url }) => url === `https://neon.com/docs/${pathname}.md`);

  it('lists a landing page once, not again under its own child heading', () => {
    expect(entriesFor('guides/platform')).toHaveLength(1);
    expect(sections.find(({ title }) => title === 'Overview').items).toEqual([]);
  });

  it('still lists a page under separate top-level areas', () => {
    expect(entriesFor('serverless/driver')).toHaveLength(2);
  });

  it('gives a page listed in several places the same type everywhere', () => {
    // One entry has child pages, the other doesn't; both are typed as the overview.
    expect(entriesFor('serverless/driver').map(({ type }) => type)).toEqual([
      'Conceptual',
      'Conceptual',
    ]);
  });

  it('uses the frontmatter type override over the inferred type', () => {
    expect(entriesFor('connect/intro')[0].type).toBe('Conceptual');
  });

  it('leaves no classification internals on entries', () => {
    for (const entry of entries) {
      expect(entry).not.toHaveProperty('signals');
      expect(entry).not.toHaveProperty('typeOverride');
    }
  });
});

describe('typeOverride', () => {
  it('accepts a known type and treats a missing value as no override', () => {
    expect(typeOverride('Reference', '/docs/a')).toBe('Reference');
    expect(typeOverride(undefined, '/docs/a')).toBeUndefined();
  });

  it('fails on an unknown type', () => {
    expect(() => typeOverride('Guide', '/docs/a')).toThrow(/Invalid docType "Guide" in \/docs\/a/);
  });
});

describe('withoutRedirectSources', () => {
  it("drops pages whose path is another page's redirectFrom", () => {
    const filtered = withoutRedirectSources(
      new Map([
        [
          'docs/',
          new Map([
            ['/docs/get-started/built-to-scale', { redirectFrom: ['/docs/get-started/old'] }],
            ['/docs/get-started/old', { redirectFrom: [] }],
          ]),
        ],
      ])
    );
    expect([...filtered.get('docs/').keys()]).toEqual(['/docs/get-started/built-to-scale']);
  });
});

describe('renderSitemapMarkdown', () => {
  const entry = (title, url, fields = {}, children = []) => ({
    title,
    url,
    children,
    ...fields,
  });
  const markdown = renderSitemapMarkdown([
    { title: 'Products', depth: 2, items: [] },
    {
      title: 'Postgres',
      depth: 3,
      items: [
        entry(
          'Use [brackets]',
          'https://neon.com/docs/a.md',
          { type: 'How-to', description: 'A | B.' },
          [entry('Child', 'https://neon.com/docs/a/child.md', { type: 'Reference' })]
        ),
        { label: 'Grouping', children: [entry('Grouped', 'https://neon.com/docs/g.md')] },
        { label: 'Empty group', children: [] },
      ],
    },
    { title: 'Empty', depth: 2, items: [] },
  ]);

  it('renders the header, nested headings, and indented entries with fields', () => {
    expect(markdown).toMatch(/^# Neon Documentation Sitemap\n\n## Purpose\n/);
    expect(markdown).toContain(
      [
        '## Products',
        '',
        '### Postgres',
        '',
        '- [Use \\[brackets\\]](https://neon.com/docs/a.md) | Type: How-to | Summary: A \\| B.',
        '  - [Child](https://neon.com/docs/a/child.md) | Type: Reference',
        '- Grouping',
        '  - [Grouped](https://neon.com/docs/g.md)',
        '',
      ].join('\n')
    );
  });

  it('ends with the feedback instructions', () => {
    expect(markdown).toMatch(
      /\n---\n\nIf you encounter incorrect information, .+ following the instructions at https:\/\/neon\.com\/feedback\.md\.\n$/
    );
  });

  it('leaves placement to headings and nesting, with no Section field', () => {
    expect(markdown).not.toContain('Section:');
    expect(markdown).not.toContain('`Section`');
  });

  it('drops headings and labels with no entries under them', () => {
    expect(markdown).not.toContain('## Empty');
    expect(markdown).not.toContain('Empty group');
  });
});

// Runs against the real content tree: these are the guarantees that keep the
// sitemap complete without hand edits.
describe('getSitemapMarkdown', () => {
  let markdown;
  let entries;

  beforeAll(async () => {
    markdown = await getSitemapMarkdown();
    const body = markdown.slice(markdown.indexOf('\n---\n'));
    entries = [...body.matchAll(/^( *)- \[.+?\]\((.+?)\)(.*)$/gm)].map(
      ([, indent, url, fields]) => ({ indent: indent.length, url, fields })
    );
  });

  it('leaves out /docs/changelog and everything under it', () => {
    expect(markdown).not.toContain('/docs/changelog');
    expect(markdown).not.toContain('\n## Changelog\n');
  });

  it('links every /docs page in the docs navigation', () => {
    const slugs = [];
    const collect = (nodes) =>
      (nodes || []).forEach((node) => {
        if (node.slug && !node.section) slugs.push(node.slug);
        collect(node.items);
        collect(node.subnav);
      });
    collect(getNavigation());

    for (const slug of slugs) {
      const pathname = navSlugToPathname(slug);
      if (!pathname || !isDocsPath(pathname) || isExcludedPath(pathname)) continue;
      expect(
        entries.some(({ url }) => new URL(url).pathname.replace(/\.md$/, '') === pathname),
        `navigation slug ${slug} is missing from sitemap.md`
      ).toBe(true);
    }
  });

  it('only links absolute /docs URLs', () => {
    expect(entries.length).toBeGreaterThan(800);
    for (const { url } of entries) {
      expect(url).toMatch(/^https:\/\/neon\.com\/docs[/.]/);
    }
  });

  it("leaves out pages whose path is another page's redirectFrom", async () => {
    const linked = new Set(entries.map(({ url }) => new URL(url).pathname.replace(/\.md$/, '')));
    for (const slug of await getPostSlugs(DOCS_DIR_PATH)) {
      for (const source of getPostBySlug(slug, DOCS_DIR_PATH)?.data.redirectFrom || []) {
        const pathname = source.replace(/\/+$/, '');
        expect(linked.has(pathname), `${pathname} redirects but is linked`).toBe(false);
      }
    }
  });

  it('gives each page one type wherever it appears', () => {
    const types = new Map();
    for (const { url, fields } of entries) {
      const type = fields.match(/ \| Type: ([^|]+?)(?: \||$)/)?.[1];
      expect(types.get(url) ?? type, `${url} has more than one type`).toBe(type);
      types.set(url, type);
    }
  });

  it('gives every entry a known type and nests child pages', () => {
    for (const { fields } of entries) {
      const type = fields.match(/ \| Type: ([^|]+?)(?: \||$)/)?.[1];
      expect(PAGE_TYPES).toContain(type);
    }
    expect(entries.some(({ indent }) => indent > 0)).toBe(true);
  });
});
