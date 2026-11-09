import { describe, expect, it } from 'vitest';

import { siteSearchHighlightRanges } from './site-search-highlight';

function highlighted(text, query) {
  return siteSearchHighlightRanges(text, query).map(({ start, end }) => text.slice(start, end));
}

describe('siteSearchHighlightRanges', () => {
  it('does not highlight letters inside words', () => {
    expect(
      highlighted(
        'See Cleaning up existing stale branches above, already accumulated.',
        'how do I reset a branch'
      )
    ).toEqual(['branch']);
  });

  it('highlights a term at the start of a word, case-insensitively', () => {
    expect(highlighted('Branching and sub-branches', 'branch')).toEqual(['Branch', 'branch']);
  });

  it('skips stopwords', () => {
    expect(highlighted('What is a branch in Neon?', 'what is a branch')).toEqual(['branch']);
    expect(highlighted('How to do it', 'how to')).toEqual([]);
  });

  it('matches a one-letter term as a whole word only', () => {
    expect(highlighted('Set x to 1 in example', 'x')).toEqual(['x']);
  });

  it('prefers the longest matching term', () => {
    expect(highlighted('Postgres branching', 'post postgres')).toEqual(['Postgres']);
  });

  it('matches words with non-ASCII letters and digits', () => {
    expect(highlighted('Größe of pg16 and pg17', 'größe pg16')).toEqual(['Größe', 'pg16']);
  });

  it('keeps combining marks inside a word', () => {
    expect(highlighted('cafe\u0301teria', 'ter')).toEqual([]);
    expect(highlighted('cafe\u0301teria', 'cafe\u0301')).toEqual(['cafe\u0301']);
  });

  it('matches letters whose lowercase form has a different length', () => {
    expect(highlighted('İstanbul region', 'İstanbul')).toEqual(['İstanbul']);
  });

  it('treats a letter outside the BMP as one letter', () => {
    expect(highlighted('𐐀bc and 𐐀', '𐐀')).toEqual(['𐐀']);
  });

  it('returns no ranges for a query with no words', () => {
    expect(siteSearchHighlightRanges('Branching', '  -- ')).toEqual([]);
  });
});
