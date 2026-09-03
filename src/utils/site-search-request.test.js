import { describe, expect, it } from 'vitest';

import {
  hrefFromSearchHit,
  parseSiteSearchHits,
  parseSiteSearchRequest,
} from './site-search-request';

describe('parseSiteSearchRequest', () => {
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
});

describe('parseSiteSearchHits', () => {
  const hit = {
    url: 'https://neon.com/docs/introduction/branching',
    title: 'Branching',
    slug: 'docs/introduction/branching',
    collection: 'docs',
    heading: 'How branching works',
    excerpt: 'Copy-on-write branches.',
    score: 1.2,
  };

  it('keeps only the documented hit fields', () => {
    expect(parseSiteSearchHits({ hits: [{ ...hit, extra: 'nope' }] })).toEqual([hit]);
  });

  it('rejects a host that is not neon.com and an unknown collection', () => {
    expect(() =>
      parseSiteSearchHits({ hits: [{ ...hit, url: 'https://evil.com/docs/x' }] })
    ).toThrow(/neon.com url/);
    expect(() => parseSiteSearchHits({ hits: [{ ...hit, collection: 'faqs' }] })).toThrow(
      /Search failed/
    );
  });
});
