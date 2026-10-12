import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  chunkReindexPages,
  mapCompareFiles,
  SITE_REINDEX_MAX_PAGES,
} = require('./site-reindex-map.js');

describe('mapCompareFiles', () => {
  it('maps a community guide and a changelog entry', () => {
    expect(
      mapCompareFiles([
        { filename: 'content/guides/drizzle.md', status: 'added' },
        { filename: 'content/changelog/2026-08-28.md', status: 'modified' },
      ])
    ).toEqual({
      pages: [
        { url: 'https://neon.com/guides/drizzle.md', deleted: false },
        { url: 'https://neon.com/docs/changelog/2026-08-28.md', deleted: false },
      ],
      skipped: {
        sharedContent: 0,
        excluded: 0,
        notSite: 0,
        notMarkdown: 0,
      },
    });
  });

  it('skips official docs pages', () => {
    const result = mapCompareFiles([
      { filename: 'content/docs/introduction/branching.md', status: 'modified' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.skipped.notSite).toBe(1);
  });

  it('skips GUIDE_TEMPLATE and README', () => {
    const result = mapCompareFiles([
      { filename: 'content/guides/GUIDE_TEMPLATE.md', status: 'modified' },
      { filename: 'content/guides/README.md', status: 'modified' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.skipped.excluded).toBe(2);
  });

  it('maps a delete', () => {
    const result = mapCompareFiles([
      { filename: 'content/guides/old-guide.md', status: 'removed' },
    ]);
    expect(result.pages).toEqual([{ url: 'https://neon.com/guides/old-guide.md', deleted: true }]);
  });

  it('maps a rename as delete old plus upsert new', () => {
    const result = mapCompareFiles([
      {
        filename: 'content/guides/new-name.md',
        status: 'renamed',
        previous_filename: 'content/guides/old-name.md',
      },
    ]);
    expect(result.pages).toEqual([
      { url: 'https://neon.com/guides/old-name.md', deleted: true },
      { url: 'https://neon.com/guides/new-name.md', deleted: false },
    ]);
  });
});

describe('chunkReindexPages', () => {
  it('keeps a full 200-page payload as one chunk', () => {
    const pages = Array.from({ length: SITE_REINDEX_MAX_PAGES }, (_, i) => ({
      url: `https://neon.com/guides/${i}.md`,
      deleted: false,
    }));
    expect(chunkReindexPages(pages).map((chunk) => chunk.length)).toEqual([SITE_REINDEX_MAX_PAGES]);
  });

  it('splits 201 pages into 200 and 1', () => {
    const pages = Array.from({ length: SITE_REINDEX_MAX_PAGES + 1 }, (_, i) => ({
      url: `https://neon.com/guides/${i}.md`,
      deleted: false,
    }));
    expect(chunkReindexPages(pages).map((chunk) => chunk.length)).toEqual([
      SITE_REINDEX_MAX_PAGES,
      1,
    ]);
  });
});
