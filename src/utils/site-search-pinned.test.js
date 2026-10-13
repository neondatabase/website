import { describe, expect, it } from 'vitest';

import { normalizePinnedQuery, pinnedSiteSearchHits } from './site-search-pinned';
import { parseSiteSearchHits } from './site-search-request';

describe('normalizePinnedQuery', () => {
  it('lowercases, drops apostrophes, and turns punctuation into single spaces', () => {
    expect(normalizePinnedQuery('  Change   Log ')).toBe('change log');
    expect(normalizePinnedQuery('What’s new?')).toBe('whats new');
    expect(normalizePinnedQuery('dvdrental.zip')).toBe('dvdrental zip');
  });
});

describe('pinnedSiteSearchHits', () => {
  it('answers changelog spellings with only the changelog', () => {
    for (const query of [
      'changelog',
      'Changelog',
      'change log',
      'change-log',
      'changelogs',
      'release notes',
      "what's new",
    ]) {
      const hits = pinnedSiteSearchHits(query);
      expect(hits?.map((hit) => hit.url)).toEqual(['https://neon.com/docs/changelog']);
    }
  });

  it('pins pricing and the sample database', () => {
    expect(pinnedSiteSearchHits('pricing')?.map((hit) => hit.url)).toEqual([
      'https://neon.com/pricing',
      'https://neon.com/docs/introduction/plans',
    ]);
    expect(pinnedSiteSearchHits('dvdrental.zip')?.[0]?.url).toBe(
      'https://neon.com/postgresql/getting-started/sample-database'
    );
  });

  it('leaves every other query to search, including longer queries that contain a pinned one', () => {
    expect(pinnedSiteSearchHits('changelog march 2026')).toBeNull();
    expect(pinnedSiteSearchHits('branching')).toBeNull();
    expect(pinnedSiteSearchHits('pricing for read replicas')).toBeNull();
  });

  it('returns hits the modal accepts', () => {
    for (const query of ['changelog', 'pricing', 'dvdrental']) {
      const hits = pinnedSiteSearchHits(query);
      expect(parseSiteSearchHits({ hits })).toEqual(hits);
    }
  });
});
