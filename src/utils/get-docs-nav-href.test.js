import { describe, expect, it } from 'vitest';

import getDocsNavHref, { getDocsHeaderLanes } from './get-docs-nav-href';

describe('getDocsNavHref', () => {
  it('prefixes relative slugs with the base path', () => {
    expect(getDocsNavHref('get-started', '/docs/')).toBe('/docs/get-started');
  });

  it('keeps site-absolute and external slugs as they are', () => {
    expect(getDocsNavHref('/guides', '/docs/')).toBe('/guides');
    expect(getDocsNavHref('https://neon.com/postgresql/tutorial', '/docs/')).toBe(
      'https://neon.com/postgresql/tutorial'
    );
  });

  it('returns undefined for lanes without a slug', () => {
    expect(getDocsNavHref(undefined, '/docs/')).toBeUndefined();
  });
});

describe('getDocsHeaderLanes', () => {
  it('drops external top-level links such as Learn PostgreSQL', () => {
    const lanes = getDocsHeaderLanes([
      { nav: 'Get started', slug: 'get-started' },
      { nav: 'Products', subnav: [] },
      { nav: 'Learn PostgreSQL', slug: 'https://neon.com/postgresql/tutorial' },
    ]);

    expect(lanes.map(({ nav }) => nav)).toEqual(['Get started', 'Products']);
  });

  it('tolerates a missing navigation', () => {
    expect(getDocsHeaderLanes(null)).toEqual([]);
  });
});
