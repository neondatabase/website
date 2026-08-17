import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { GUIDES_DIR_PATH } from 'constants/content';

import { getPostBySlug } from './api-content';
import getMetadata from './get-metadata';

describe('getMetadata', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
  const originalVercelEnv = process.env.VERCEL_ENV;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = 'https://neon.com';
    delete process.env.VERCEL_ENV;
  });

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = originalSiteUrl;
    }

    if (originalVercelEnv === undefined) {
      delete process.env.VERCEL_ENV;
    } else {
      process.env.VERCEL_ENV = originalVercelEnv;
    }
  });

  it('defaults canonical to the Neon page URL', () => {
    const metadata = getMetadata({ pathname: '/guides/sentry-neon-mcp' });

    expect(metadata.alternates.canonical).toBe('https://neon.com/guides/sentry-neon-mcp');
    expect(metadata.openGraph.url).toBe('https://neon.com/guides/sentry-neon-mcp');
  });

  it('uses an absolute external canonical and keeps og:url on Neon', () => {
    const metadata = getMetadata({
      pathname: '/guides/sentry-neon-functions',
      canonical: 'https://sentry.io/cookbook/monitor-neon-functions-sentry/',
    });

    expect(metadata.alternates.canonical).toBe(
      'https://sentry.io/cookbook/monitor-neon-functions-sentry/'
    );
    expect(metadata.openGraph.url).toBe('https://neon.com/guides/sentry-neon-functions');
  });

  it('rejects a relative canonical', () => {
    expect(() =>
      getMetadata({ pathname: '/guides/sentry-neon-functions', canonical: '/elsewhere' })
    ).toThrow('canonical must be an absolute HTTP(S) URL, got "/elsewhere"');
  });

  it('rejects an empty canonical', () => {
    expect(() => getMetadata({ pathname: '/guides/sentry-neon-functions', canonical: '' })).toThrow(
      'canonical must be an absolute HTTP(S) URL, got ""'
    );
  });

  it('rejects a non-HTTP canonical', () => {
    expect(() =>
      getMetadata({
        pathname: '/guides/sentry-neon-functions',
        canonical: 'ftp://example.com/guide',
      })
    ).toThrow('canonical must be an absolute HTTP(S) URL, got "ftp://example.com/guide"');
  });

  it('still points postgres pages at postgresql.org when isPostgres is set', () => {
    const metadata = getMetadata({
      pathname: '/postgresql/tutorial',
      isPostgres: true,
      currentSlug: 'tutorial',
    });

    expect(metadata.alternates.canonical).toBe('https://www.postgresql.org/docs/16/tutorial.html');
    expect(metadata.openGraph.url).toBe('https://neon.com/postgresql/tutorial');
  });
});

describe('guide canonical frontmatter', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
  const originalVercelEnv = process.env.VERCEL_ENV;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = 'https://neon.com';
    delete process.env.VERCEL_ENV;
  });

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = originalSiteUrl;
    }

    if (originalVercelEnv === undefined) {
      delete process.env.VERCEL_ENV;
    } else {
      process.env.VERCEL_ENV = originalVercelEnv;
    }
  });

  it('reads the Sentry Functions guide canonical and emits it', () => {
    const post = getPostBySlug('sentry-neon-functions', GUIDES_DIR_PATH);

    expect(post.data.canonical).toBe('https://sentry.io/cookbook/monitor-neon-functions-sentry/');

    const metadata = getMetadata({
      pathname: '/guides/sentry-neon-functions',
      canonical: post.data.canonical,
    });

    expect(metadata.alternates.canonical).toBe(post.data.canonical);
    expect(metadata.openGraph.url).toBe('https://neon.com/guides/sentry-neon-functions');
  });

  it('leaves a guide without canonical on the Neon URL', () => {
    const post = getPostBySlug('sentry-neon-mcp', GUIDES_DIR_PATH);

    expect(post.data.canonical).toBeUndefined();

    const metadata = getMetadata({
      pathname: '/guides/sentry-neon-mcp',
      canonical: post.data.canonical,
    });

    expect(metadata.alternates.canonical).toBe('https://neon.com/guides/sentry-neon-mcp');
  });
});
