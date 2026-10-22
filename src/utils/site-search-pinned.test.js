import { describe, expect, it } from 'vitest';

import { normalizePinnedQuery, pinnedSiteSearchHits, pinsAboveResults } from './site-search-pinned';
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

  it('answers changelog spellings with the changelog under any category filter', () => {
    for (const categories of [['docs', 'api'], ['postgresql'], ['guides'], ['changelog']]) {
      expect(pinnedSiteSearchHits('changelog', categories)?.map((hit) => hit.url)).toEqual([
        'https://neon.com/docs/changelog',
      ]);
    }
  });

  it('keeps other pinned hits to the selected categories', () => {
    expect(pinnedSiteSearchHits('pricing', ['postgresql'])).toEqual([]);
    expect(pinnedSiteSearchHits('dvdrental', ['docs'])?.map((hit) => hit.url)).toEqual([
      'https://neon.com/docs/import/import-sample-data',
    ]);
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

  it('pins the model catalog above search results under any category filter', () => {
    for (const query of ['models', 'Model', 'all models', 'AI Gateway models']) {
      expect(pinsAboveResults(query)).toBe(true);
      for (const categories of [undefined, ['docs', 'api'], ['blog']]) {
        expect(pinnedSiteSearchHits(query, categories)?.map((hit) => hit.url)).toEqual([
          'https://neon.com/ai-gateway#models',
        ]);
      }
    }
    for (const query of ['changelog', 'pricing', 'branching', 'models json']) {
      expect(pinsAboveResults(query)).toBe(false);
    }
  });

  it('leaves every other query to search, including longer queries that contain a pinned one', () => {
    expect(pinnedSiteSearchHits('changelog march 2026')).toBeNull();
    expect(pinnedSiteSearchHits('branching')).toBeNull();
    expect(pinnedSiteSearchHits('pricing for read replicas')).toBeNull();
  });

  it('returns hits the modal accepts', () => {
    for (const query of ['changelog', 'pricing', 'dvdrental', 'models']) {
      const hits = pinnedSiteSearchHits(query);
      expect(parseSiteSearchHits({ hits })).toEqual(hits);
    }
  });
});
