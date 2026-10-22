import { beforeAll, describe, expect, it } from 'vitest';

import nextConfig from '../next.config';

// The docs front page moved from /docs/introduction to /docs. These guard the
// next.config side of that move; src/middleware.test.js covers /docs itself.
describe('docs home redirects', () => {
  let redirects;

  beforeAll(async () => {
    redirects = await nextConfig.redirects();
  });

  it('permanently redirects /docs/introduction to /docs', () => {
    expect(redirects).toContainEqual({
      source: '/docs/introduction',
      destination: '/docs',
      permanent: true,
    });
  });

  it('does not redirect bare /docs or /docs/introduction subpages', () => {
    const sources = redirects.map(({ source }) => source);

    expect(sources).not.toContain('/docs');
    expect(sources.filter((source) => source.startsWith('/docs/introduction/:'))).toEqual([]);
  });

  it('permanently redirects /docs/get-started to /docs', () => {
    expect(redirects).toContainEqual({
      source: '/docs/get-started',
      destination: '/docs',
      permanent: true,
    });
  });

  it('does not redirect /docs/get-started subpages', () => {
    const sources = redirects.map(({ source }) => source);

    expect(sources.filter((source) => source.startsWith('/docs/get-started/:'))).toEqual([]);
  });

  it('sends no redirect to the old /docs/introduction home', () => {
    const toOldHome = redirects.filter(({ destination }) =>
      /^\/docs\/introduction(?:#.*)?$/.test(destination)
    );

    expect(toOldHome).toEqual([]);
  });
});
