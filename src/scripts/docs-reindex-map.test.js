import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { mapCompareFiles, toWebhookPayload } = require('./docs-reindex-map.js');

describe('mapCompareFiles', () => {
  it('maps a docs page add and modify', () => {
    expect(
      mapCompareFiles([
        { filename: 'content/docs/introduction/branching.md', status: 'added' },
        { filename: 'content/docs/connect/choose-connection.md', status: 'modified' },
      ])
    ).toEqual({
      pages: [
        { url: 'https://neon.com/docs/introduction/branching.md', deleted: false },
        { url: 'https://neon.com/docs/connect/choose-connection.md', deleted: false },
      ],
      skipped: {
        sharedContent: 0,
        collapsed: 0,
        excluded: 0,
        notContent: 0,
        notMarkdown: 0,
      },
      sync: false,
    });
  });

  it('includes branching pages and glossary', () => {
    const result = mapCompareFiles([
      { filename: 'content/branching/reset-from-parent.md', status: 'modified' },
      { filename: 'content/docs/reference/glossary.md', status: 'modified' },
    ]);
    expect(result.pages).toEqual([
      { url: 'https://neon.com/branching/reset-from-parent.md', deleted: false },
      { url: 'https://neon.com/docs/reference/glossary.md', deleted: false },
    ]);
  });

  it('skips shared-content', () => {
    const result = mapCompareFiles([
      { filename: 'content/docs/shared-content/mcp-tools.md', status: 'modified' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.skipped.sharedContent).toBe(1);
  });

  it('skips collapsed changelog files', () => {
    const result = mapCompareFiles([
      { filename: 'content/changelog/2026-09-01.md', status: 'added' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.skipped.collapsed).toBe(1);
  });

  it('skips excludePaths such as introduction.md', () => {
    const result = mapCompareFiles([
      { filename: 'content/docs/introduction.md', status: 'modified' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.skipped.excluded).toBe(1);
  });

  it('maps a delete', () => {
    const result = mapCompareFiles([
      { filename: 'content/docs/connect/old-driver.md', status: 'removed' },
    ]);
    expect(result.pages).toEqual([
      { url: 'https://neon.com/docs/connect/old-driver.md', deleted: true },
    ]);
  });

  it('maps a rename as delete old plus upsert new', () => {
    const result = mapCompareFiles([
      {
        filename: 'content/docs/connect/new-name.md',
        status: 'renamed',
        previous_filename: 'content/docs/connect/old-name.md',
      },
    ]);
    expect(result.pages).toEqual([
      { url: 'https://neon.com/docs/connect/old-name.md', deleted: true },
      { url: 'https://neon.com/docs/connect/new-name.md', deleted: false },
    ]);
  });

  it('deletes the old url when a catalog page is renamed into shared-content', () => {
    const result = mapCompareFiles([
      {
        filename: 'content/docs/shared-content/moved.md',
        status: 'renamed',
        previous_filename: 'content/docs/connect/moved.md',
      },
    ]);
    expect(result.pages).toEqual([
      { url: 'https://neon.com/docs/connect/moved.md', deleted: true },
    ]);
    expect(result.skipped.sharedContent).toBe(1);
  });

  it('upserts the new url when a collapsed file is renamed into docs', () => {
    const result = mapCompareFiles([
      {
        filename: 'content/docs/guides/from-changelog.md',
        status: 'renamed',
        previous_filename: 'content/changelog/from-changelog.md',
      },
    ]);
    expect(result.pages).toEqual([
      { url: 'https://neon.com/docs/guides/from-changelog.md', deleted: false },
    ]);
    expect(result.skipped.collapsed).toBe(1);
  });

  it('skips non-content files', () => {
    const result = mapCompareFiles([
      { filename: 'src/app/page.md', status: 'modified' },
      { filename: 'package.json', status: 'modified' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.skipped.notContent).toBe(1);
    expect(result.skipped.notMarkdown).toBe(1);
    expect(result.sync).toBe(false);
  });

  it('sets catalog sync when content.js routes change', () => {
    const result = mapCompareFiles([
      { filename: 'src/constants/content.js', status: 'modified' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.sync).toBe(true);
    expect(toWebhookPayload(result)).toEqual({ sync: 'docs' });
  });

  it('sets catalog sync when llms-index-config.js changes', () => {
    const result = mapCompareFiles([
      { filename: 'src/scripts/llms-index-config.js', status: 'modified' },
    ]);
    expect(result.pages).toEqual([]);
    expect(result.sync).toBe(true);
    expect(result.skipped.notMarkdown).toBe(1);
    expect(toWebhookPayload(result)).toEqual({ sync: 'docs' });
  });

  it('sets catalog sync when the API-ref generator changes', () => {
    const result = mapCompareFiles([
      { filename: 'scripts/generate-api-ref.mjs', status: 'modified' },
    ]);
    expect(result.sync).toBe(true);
    expect(toWebhookPayload(result)).toEqual({ sync: 'docs' });
  });

  it('combines mapped pages with catalog sync', () => {
    const result = mapCompareFiles([
      { filename: 'content/docs/reference/api.md', status: 'modified' },
      { filename: 'src/scripts/llms-index-config.js', status: 'modified' },
    ]);
    expect(result.pages).toEqual([
      { url: 'https://neon.com/docs/reference/api.md', deleted: false },
    ]);
    expect(result.sync).toBe(true);
    expect(toWebhookPayload(result)).toEqual({
      pages: [{ url: 'https://neon.com/docs/reference/api.md', deleted: false }],
      sync: 'docs',
    });
  });

  it('sets catalog sync when a catalog-shaping file is renamed away', () => {
    const result = mapCompareFiles([
      {
        filename: 'src/scripts/renamed-llms-index-config.js',
        status: 'renamed',
        previous_filename: 'src/scripts/llms-index-config.js',
      },
    ]);
    expect(result.sync).toBe(true);
    expect(toWebhookPayload(result)).toEqual({ sync: 'docs' });
  });
});
