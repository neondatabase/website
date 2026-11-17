import { describe, expect, it } from 'vitest';

import getArticleSchema from './get-article-schema';

describe('Article dates', () => {
  it('does not present the modification date as the publication date', () => {
    const schema = getArticleSchema({ title: 'Docs', dateModified: '2026-10-09T12:00:00Z' });
    const serialized = JSON.parse(JSON.stringify(schema));

    expect(serialized.dateModified).toBe('2026-10-09T12:00:00Z');
    expect(serialized).not.toHaveProperty('datePublished');
    expect(serialized).not.toHaveProperty('image');
  });

  it('preserves known publication and modification dates independently', () => {
    const schema = getArticleSchema({
      title: 'Guide',
      datePublished: '2024-05-24',
      dateModified: new Date('2026-10-09T12:00:00Z'),
    });

    expect(schema.datePublished).toBe('2024-05-24');
    expect(schema.dateModified).toBe('2026-10-09T12:00:00.000Z');
  });

  it('omits human-readable and invalid dates instead of emitting invalid structured data', () => {
    const schema = getArticleSchema({
      title: 'Changelog',
      datePublished: 'May 24, 2024',
      dateModified: 'not a date',
    });

    expect(schema.datePublished).toBeUndefined();
    expect(schema.dateModified).toBeUndefined();
  });
});
