import fs from 'fs';

import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

import { getRouteLastmod } from './get-route-lastmod';

const frontmatterDate = (filePath) =>
  new Date(matter(fs.readFileSync(filePath, 'utf8')).data.updatedOn).toISOString();

describe('getRouteLastmod', () => {
  it('uses updatedOn from the source file', () => {
    expect(getRouteLastmod('/docs/cli')).toBe(frontmatterDate('content/docs/cli.md'));
    expect(getRouteLastmod('/postgresql/aggregate-functions')).toBe(
      frontmatterDate('content/postgresql/aggregate-functions.md')
    );
    expect(getRouteLastmod('/storage')).toBe(frontmatterDate('content/pages/storage.md'));
  });

  it('uses the filename date for changelog entries', () => {
    expect(getRouteLastmod('/docs/changelog/2026-01-16')).toBe('2026-01-16T00:00:00.000Z');
  });

  it('uses the newest guide by that author for author pages', () => {
    const authorDates = fs
      .readdirSync('content/guides')
      .filter((file) => file.endsWith('.md'))
      .map((file) => matter(fs.readFileSync(`content/guides/${file}`, 'utf8')).data)
      .filter((data) => [].concat(data.authors ?? data.author ?? []).includes('rishi-raj-jain'))
      .map((data) => new Date(data.updatedOn || data.createdAt).toISOString())
      .sort();

    expect(getRouteLastmod('/guides/authors/rishi-raj-jain')).toBe(authorDates.at(-1));
    expect(getRouteLastmod('/guides/authors/does-not-exist')).toBeUndefined();
  });

  it('uses the newest entry for index pages', () => {
    expect(getRouteLastmod('/docs/changelog') >= '2026-01-16T00:00:00.000Z').toBe(true);
    expect(getRouteLastmod('/guides')).toBeDefined();
  });

  it('is undefined for routes without markdown source', () => {
    expect(getRouteLastmod('/docs')).toBeUndefined();
    expect(getRouteLastmod('/')).toBeUndefined();
    expect(getRouteLastmod('/pricing')).toBeUndefined();
    expect(getRouteLastmod('/docs/does-not-exist')).toBeUndefined();
  });
});
