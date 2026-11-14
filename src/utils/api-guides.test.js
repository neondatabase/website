import { describe, expect, it } from 'vitest';

import { getAllGuides, getGuideAuthorIds, getGuideAuthors } from './api-guides';

describe('getGuideAuthorIds', () => {
  it('accepts a single author slug', () => {
    expect(getGuideAuthorIds({ author: 'rishi-raj-jain' })).toEqual(['rishi-raj-jain']);
  });

  it('accepts a list under author or authors', () => {
    expect(getGuideAuthorIds({ author: ['rishi-raj-jain', 'bobbyiliev'] })).toEqual([
      'rishi-raj-jain',
      'bobbyiliev',
    ]);
    expect(getGuideAuthorIds({ authors: ['rishi-raj-jain', 'bobbyiliev'] })).toEqual([
      'rishi-raj-jain',
      'bobbyiliev',
    ]);
  });

  it('returns an empty list when no author is set', () => {
    expect(getGuideAuthorIds({})).toEqual([]);
    expect(getGuideAuthorIds(undefined)).toEqual([]);
  });
});

describe('getGuideAuthors', () => {
  it('resolves each author from data.json in order, with a photo path', () => {
    const authors = getGuideAuthors({ authors: ['bobbyiliev', 'rishi-raj-jain'] });

    expect(authors.map(({ slug }) => slug)).toEqual(['bobbyiliev', 'rishi-raj-jain']);
    expect(authors[1]).toMatchObject({
      name: 'Rishi Raj Jain',
      photo: '/guides/authors/rishi-raj-jain.jpg',
    });
  });

  it('skips author slugs that are not in data.json', () => {
    expect(getGuideAuthors({ authors: ['does-not-exist', 'rishi-raj-jain'] })).toHaveLength(1);
  });
});

describe('getAllGuides', () => {
  it('gives every guide a list of resolved authors', async () => {
    const guides = await getAllGuides();

    expect(guides.length).toBeGreaterThan(0);
    guides.forEach((guide) => {
      expect(guide.authors.length).toBeGreaterThan(0);
      guide.authors.forEach((author) => expect(author.name).toEqual(expect.any(String)));
    });
  });
});
