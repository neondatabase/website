import { describe, expect, it, vi } from 'vitest';

import {
  createNeonTools,
  formatSearchResults,
  markdownHeadings,
  markdownUrl,
  matchSection,
  readMarkdown,
  resolveSitePath,
  TOOL_OUTPUT_MAX_CHARS,
} from './webmcp';

const ORIGIN = 'http://localhost:3000';

const PAGE = [
  '> This page location: Postgres > Branching > About branching',
  '',
  '# Branching',
  '',
  'Branch your data the same way you branch your code.',
  '',
  '## What is a branch?',
  '',
  'A branch is a copy-on-write clone of your data.',
  '',
  '```bash',
  '# not a heading',
  'neon branches create',
  '```',
  '',
  '## Branching workflows',
  '',
  '### Development',
  '',
  'Create a branch for each developer.',
  '',
  '### Testing',
  '',
  'Run tests against a branch.',
  '',
  '## Restore and recover data',
  '',
  'Restore a branch to an earlier state.',
].join('\n');

const LONG_PAGE = [
  '# Long page',
  '',
  ...Array.from(
    { length: 40 },
    (_, index) => `## Part ${index}\n\n${`Sentence ${index} about Postgres. `.repeat(8)}`
  ),
].join('\n\n');

const hit = (overrides = {}) => ({
  url: 'https://neon.com/docs/introduction/branching',
  title: 'Branching',
  slug: 'docs/introduction/branching',
  collection: 'docs',
  category: 'docs',
  breadcrumb: ['Docs', 'Branching'],
  heading: 'Branching > What is a branch?',
  excerpt: 'A branch is a copy-on-write clone of your data.',
  score: 1,
  ...overrides,
});

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const markdownResponse = (body, status = 200) =>
  new Response(body, { status, headers: { 'content-type': 'text/markdown; charset=utf-8' } });

const toolsWith = (fetch, openPage = vi.fn()) =>
  Object.fromEntries(
    createNeonTools({ origin: ORIGIN, fetch, openPage }).map((tool) => [tool.name, tool])
  );

describe('resolveSitePath', () => {
  it('accepts paths, bare paths, and neon.com URLs', () => {
    expect(resolveSitePath('/docs/introduction/', ORIGIN)).toEqual({
      pathname: '/docs/introduction',
      search: '',
      hash: '',
    });
    expect(resolveSitePath('docs/introduction', ORIGIN).pathname).toBe('/docs/introduction');
    expect(resolveSitePath('neon.com/pricing', ORIGIN).pathname).toBe('/pricing');
    expect(resolveSitePath('https://neon.tech/docs/x?y=1#Some%20heading', ORIGIN)).toEqual({
      pathname: '/docs/x',
      search: '?y=1',
      hash: 'Some heading',
    });
    expect(resolveSitePath(`${ORIGIN}/blog`, ORIGIN).pathname).toBe('/blog');
    expect(resolveSitePath('/', ORIGIN).pathname).toBe('/');
  });

  it('rejects other sites, internal routes, and empty input', () => {
    for (const input of [
      'https://example.com/docs',
      '//example.com/docs',
      'javascript:alert(1)',
      '/api/search',
      '/_next/static/x.js',
      '',
      undefined,
    ]) {
      expect(() => resolveSitePath(input, ORIGIN)).toThrow();
    }
  });
});

describe('markdownUrl', () => {
  it('maps a page to its Markdown mirror', () => {
    expect(markdownUrl('/')).toBe('/index.md');
    expect(markdownUrl('/docs/introduction')).toBe('/docs/introduction.md');
    expect(markdownUrl('/pricing.md')).toBe('/pricing.md');
  });
});

describe('markdownHeadings', () => {
  it('skips headings inside code fences and strips inline markup', () => {
    const headings = markdownHeadings('# Title\n```\n# no\n```\n## Use `neon` with [Prisma](/x)');
    expect(headings.map(({ level, text }) => [level, text])).toEqual([
      [1, 'Title'],
      [2, 'Use neon with Prisma'],
    ]);
  });
});

describe('matchSection', () => {
  const candidates = [{ text: 'What is a branch?' }, { text: 'Branching workflows', id: 'flows' }];

  it('matches heading text loosely, by anchor, then by containment', () => {
    expect(matchSection('what is a branch', candidates)).toBe(0);
    expect(matchSection('#what-is-a-branch', candidates)).toBe(0);
    expect(matchSection('flows', candidates)).toBe(1);
    expect(matchSection('workflows', candidates)).toBe(1);
    expect(matchSection('pricing', candidates)).toBe(-1);
    expect(matchSection('  ', candidates)).toBe(-1);
  });
});

describe('readMarkdown', () => {
  it('returns a short page whole, with its sections listed', () => {
    const result = readMarkdown({ markdown: PAGE, path: '/docs/introduction/branching' });
    expect(result).toContain('Branching (/docs/introduction/branching)');
    expect(result).toContain(
      'Sections: What is a branch? · Branching workflows · Restore and recover data'
    );
    expect(result).toContain('Restore a branch to an earlier state.');
    expect(result.endsWith('[End of page.]')).toBe(true);
  });

  it('reads one section, including its subsections', () => {
    const result = readMarkdown({ markdown: PAGE, path: '/x', section: 'branching-workflows' });
    expect(result).toContain('Branching > Branching workflows (/x)');
    expect(result).toContain('Run tests against a branch.');
    expect(result).not.toContain('Restore a branch');
    expect(result.endsWith('[End of section.]')).toBe(true);
  });

  it('lists the sections when the requested one is missing', () => {
    expect(readMarkdown({ markdown: PAGE, path: '/x', section: 'Pricing' })).toMatch(
      /^\/x has no section matching "Pricing"\. Sections: What is a branch\?/
    );
  });

  it('pages through a long page within the output budget without losing text', () => {
    let offset = 0;
    let text = '';
    for (let calls = 0; calls < 50; calls += 1) {
      const result = readMarkdown({ markdown: LONG_PAGE, path: '/long', offset });
      expect(result.length).toBeLessThanOrEqual(TOOL_OUTPUT_MAX_CHARS);
      const [, ...rest] = result.split('\n\n');
      const footer = rest.pop();
      text += `${rest.join('\n\n')} `;
      const next = footer.match(/offset (\d+)/);
      if (!next) break;
      expect(Number(next[1])).toBeGreaterThan(offset);
      offset = Number(next[1]);
    }
    expect(text).toContain('Sentence 39 about Postgres.');
    expect(text.replace(/\s+/g, '')).toBe(LONG_PAGE.replace(/\s+/g, ''));
  });

  it('explains an offset past the end', () => {
    expect(readMarkdown({ markdown: PAGE, path: '/x', offset: 99999 })).toMatch(
      /past the end of \/x/
    );
  });
});

describe('formatSearchResults', () => {
  it('lists each hit with its section, category, and path', () => {
    const result = formatSearchResults({ query: 'branch', hits: [hit()] });
    expect(result).toContain(
      '1. Branching > What is a branch? (Docs): /docs/introduction/branching'
    );
    expect(result).toContain('   A branch is a copy-on-write clone of your data.');
  });

  it('stays within the output budget with long excerpts', () => {
    const hits = Array.from({ length: 10 }, () => hit({ excerpt: 'x '.repeat(500) }));
    expect(formatSearchResults({ query: 'branch', hits }).length).toBeLessThanOrEqual(
      TOOL_OUTPUT_MAX_CHARS
    );
  });
});

describe('createNeonTools', () => {
  it('declares tools within Chrome’s recommended name and description lengths', () => {
    for (const tool of createNeonTools({ origin: ORIGIN, fetch: vi.fn(), openPage: vi.fn() })) {
      expect(tool.name).toMatch(/^[a-z_]{1,30}$/);
      expect(tool.description.length).toBeLessThanOrEqual(500);
      for (const [name, property] of Object.entries(tool.inputSchema.properties)) {
        expect(name.length).toBeLessThanOrEqual(30);
        expect(property.description.length).toBeLessThanOrEqual(150);
        // Ranges are validated in code so agents get a fixable error message.
        expect(property).not.toHaveProperty('minimum');
        expect(property).not.toHaveProperty('maximum');
      }
    }
  });

  it('search_neon_site posts to the site search API', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ hits: [hit()] }));
    const result = await toolsWith(fetch).search_neon_site.execute(
      { query: ' branching ', categories: ['docs'], limit: '3' },
      { signal: new AbortController().signal }
    );
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('/api/search');
    expect(init.headers['x-caller-source']).toBe('webmcp');
    expect(JSON.parse(init.body)).toEqual({ query: 'branching', limit: 3, categories: ['docs'] });
    expect(result).toContain('/docs/introduction/branching');
  });

  it('search_neon_site searches docs and the API reference unless told otherwise', async () => {
    const fetch = vi.fn().mockImplementation(async () => jsonResponse({ hits: [] }));
    const tools = toolsWith(fetch);
    const sent = () => JSON.parse(fetch.mock.calls.at(-1)[1].body);

    const empty = await tools.search_neon_site.execute({ query: 'create a branch endpoint' });
    expect(sent().categories).toEqual(['docs', 'api']);
    expect(empty).toMatch(/include other categories: changelog, blog, faqs, guides, postgresql/);

    await tools.search_neon_site.execute({ query: 'create a branch', categories: [] });
    expect(sent().categories).toEqual(['docs', 'api']);

    // Pinned queries answer from other categories, so they search everything.
    await tools.search_neon_site.execute({ query: 'changelog' });
    expect(sent()).not.toHaveProperty('categories');
  });

  it('search_neon_site returns guidance instead of rejecting', async () => {
    const tools = toolsWith(vi.fn().mockResolvedValue(jsonResponse({ hits: [] })));
    await expect(tools.search_neon_site.execute({ query: 'zzz' })).resolves.toMatch(/No results/);
    await expect(tools.search_neon_site.execute({})).resolves.toMatch(/query is required/);
    await expect(
      tools.search_neon_site.execute({ query: 'x', categories: ['nope'] })
    ).resolves.toMatch(/Unknown category nope/);
    await expect(tools.search_neon_site.execute({ query: 'x', limit: 50 })).resolves.toMatch(
      /limit must be/
    );

    const down = toolsWith(vi.fn().mockResolvedValue(jsonResponse({ error: 'x' }, 503)));
    await expect(down.search_neon_site.execute({ query: 'x' })).resolves.toMatch(
      /temporarily unavailable/
    );

    const limited = toolsWith(vi.fn().mockResolvedValue(jsonResponse({}, 429)));
    await expect(limited.search_neon_site.execute({ query: 'x' })).resolves.toMatch(
      /too many requests\. Wait a minute/
    );
  });

  it('resolves with guidance when the network fails, but rejects when cancelled', async () => {
    const offline = toolsWith(vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(offline.search_neon_site.execute({ query: 'x' })).resolves.toMatch(
      /couldn't be reached/
    );
    await expect(offline.read_neon_page.execute({ path: '/docs' })).resolves.toMatch(
      /couldn't be loaded/
    );

    const aborted = new DOMException('The operation was aborted.', 'AbortError');
    const cancelled = toolsWith(vi.fn().mockRejectedValue(aborted));
    await expect(cancelled.read_neon_page.execute({ path: '/docs' })).rejects.toBe(aborted);
  });

  it('read_neon_page fetches the Markdown mirror and uses the URL hash as the section', async () => {
    const fetch = vi.fn().mockResolvedValue(markdownResponse(PAGE));
    const result = await toolsWith(fetch).read_neon_page.execute({
      path: 'https://neon.com/docs/introduction/branching#restore-and-recover-data',
    });
    expect(fetch.mock.calls[0][0]).toBe('/docs/introduction/branching.md');
    expect(result).toContain('Branching > Restore and recover data');
  });

  it('read_neon_page explains missing pages and bad input', async () => {
    const tools = toolsWith(vi.fn().mockResolvedValue(markdownResponse('# Not found', 404)));
    await expect(tools.read_neon_page.execute({ path: '/about-us' })).resolves.toMatch(
      /\/about-us has no Markdown version/
    );
    await expect(tools.read_neon_page.execute({ path: 'https://example.com' })).resolves.toMatch(
      /isn't a neon.com page/
    );
    await expect(tools.read_neon_page.execute({ path: '/x', offset: -1 })).resolves.toMatch(
      /offset must be/
    );

    const limited = toolsWith(vi.fn().mockResolvedValue(markdownResponse('', 429)));
    await expect(limited.read_neon_page.execute({ path: '/pricing' })).resolves.toMatch(
      /too many requests\. Wait a minute before reading \/pricing/
    );
  });

  it('open_neon_page hands the resolved location to openPage', async () => {
    const openPage = vi.fn().mockResolvedValue('Opened');
    const signal = new AbortController().signal;
    await toolsWith(vi.fn(), openPage).open_neon_page.execute(
      { path: 'neon.com/contact-sales?message=azure-migration' },
      { signal }
    );
    expect(openPage).toHaveBeenCalledWith(
      { pathname: '/contact-sales', search: '?message=azure-migration', section: '' },
      { signal }
    );
  });
});
