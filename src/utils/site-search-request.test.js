import { describe, expect, it } from 'vitest';

import {
  hrefFromSearchHit,
  parseSiteSearchHits,
  parseSiteSearchRequest,
  searchHitHref,
  SEARCH_QUERY_MAX_CHARS,
  composeServerTiming,
} from './site-search-request';

describe('parseSiteSearchRequest', () => {
  it('accepts categories, dedupes them, and rejects empty or unknown ones', () => {
    expect(
      parseSiteSearchRequest({ query: 'branching', categories: ['docs', 'api', 'docs'] })
    ).toEqual({ query: 'branching', categories: ['docs', 'api'] });
    for (const categories of [[], ['faq'], 'docs']) {
      expect(() => parseSiteSearchRequest({ query: 'branching', categories })).toThrow(
        /categories must list/
      );
    }
  });

  it('trims query and accepts an optional limit', () => {
    expect(parseSiteSearchRequest({ query: '  branches  ', limit: 10 })).toEqual({
      query: 'branches',
      limit: 10,
    });
  });

  it('rejects a blank query, extra fields, and a bad limit', () => {
    expect(() => parseSiteSearchRequest({ query: '   ' })).toThrow(/query is required/);
    expect(() => parseSiteSearchRequest({ query: 'hello', prompt: 'nope' })).toThrow(
      /Unexpected field/
    );
    expect(() => parseSiteSearchRequest({ query: 'hello', limit: 41 })).toThrow(/1 to 40/);
    expect(() => parseSiteSearchRequest({ query: 'x'.repeat(SEARCH_QUERY_MAX_CHARS + 1) })).toThrow(
      /too long/
    );
  });
});

describe('hrefFromSearchHit', () => {
  it('returns the neon.com path', () => {
    expect(hrefFromSearchHit('https://neon.com/docs/introduction/branching')).toBe(
      '/docs/introduction/branching'
    );
  });

  it('rejects another host', () => {
    expect(() => hrefFromSearchHit('https://evil.com/docs/x')).toThrow(/neon.com url/);
  });

  it('keeps the query string and anchor', () => {
    expect(hrefFromSearchHit('https://neon.com/docs/auth/overview?tab=next#setup')).toBe(
      '/docs/auth/overview?tab=next#setup'
    );
  });

  it('rejects a path that would resolve to another host', () => {
    expect(() => hrefFromSearchHit('https://neon.com//example.com/#sign-in')).toThrow(
      /neon.com url/
    );
  });
});

describe('searchHitHref', () => {
  const glossary = 'https://neon.com/docs/reference/glossary';

  it('links to the matched section with the id the page renders', () => {
    expect(searchHitHref({ url: glossary, heading: 'Glossary > LSN' })).toBe(
      '/docs/reference/glossary#lsn'
    );
    expect(searchHitHref({ url: glossary, heading: 'Glossary > compute size' })).toBe(
      '/docs/reference/glossary#compute-size'
    );
    expect(
      searchHitHref({
        url: 'https://neon.com/docs/introduction/plans',
        heading: "Neon plans > Frequently asked questions > What's a CU?",
      })
    ).toBe('/docs/introduction/plans#whats-a-cu');
  });

  it('links to the page when the hit is the page itself', () => {
    expect(searchHitHref({ url: glossary, heading: 'Glossary' })).toBe('/docs/reference/glossary');
    expect(searchHitHref({ url: 'https://neon.com/pricing', heading: '' })).toBe('/pricing');
  });

  it('keeps an anchor the hit url already has', () => {
    expect(searchHitHref({ url: `${glossary}#branch`, heading: 'Glossary > LSN' })).toBe(
      '/docs/reference/glossary#branch'
    );
  });
});

describe('parseSiteSearchHits', () => {
  const hit = {
    url: 'https://neon.com/docs/introduction/branching',
    title: 'Branching',
    slug: 'docs/introduction/branching',
    collection: 'docs',
    category: 'docs',
    breadcrumb: ['Docs', 'Postgres', 'Branching'],
    heading: 'How branching works',
    excerpt: 'Copy-on-write branches.',
    score: 1.2,
  };

  it('keeps only the documented hit fields', () => {
    expect(parseSiteSearchHits({ hits: [{ ...hit, extra: 'nope' }] })).toEqual([hit]);
  });

  it('rejects an unknown category', () => {
    expect(() => parseSiteSearchHits({ hits: [{ ...hit, category: 'faq' }] })).toThrow(
      /Search failed/
    );
  });

  it('accepts an empty breadcrumb and rejects a malformed one', () => {
    expect(parseSiteSearchHits({ hits: [{ ...hit, breadcrumb: [] }] })[0].breadcrumb).toEqual([]);
    for (const breadcrumb of [undefined, 'Docs', ['Docs', ''], ['Docs', 1], Array(11).fill('x')]) {
      expect(() => parseSiteSearchHits({ hits: [{ ...hit, breadcrumb }] })).toThrow(
        /Search failed/
      );
    }
  });

  it('rejects a host that is not neon.com and an unknown collection', () => {
    expect(() =>
      parseSiteSearchHits({ hits: [{ ...hit, url: 'https://evil.com/docs/x' }] })
    ).toThrow(/neon.com url/);
    expect(() => parseSiteSearchHits({ hits: [{ ...hit, collection: 'nope' }] })).toThrow(
      /Search failed/
    );
  });
});

describe('composeServerTiming', () => {
  it('appends proxy dur to the upstream Server-Timing header', () => {
    expect(composeServerTiming('bm25;dur=12.3, total;dur=13.0', 48.21)).toBe(
      'bm25;dur=12.3, total;dur=13.0, proxy;dur=48.2'
    );
  });

  it('emits proxy alone when upstream is missing', () => {
    expect(composeServerTiming(null, 10)).toBe('proxy;dur=10.0');
    expect(composeServerTiming('', 10)).toBe('proxy;dur=10.0');
  });
});
