import { describe, expect, it } from 'vitest';

import {
  checkGeneratedPages,
  diffGenerated,
  formatDrift,
} from './check-realtime-sdk-reference.mjs';

const expected = [
  { path: 'content/docs/shared-content/realtime-sdk-backend.md', contents: '# a\n' },
  { path: 'content/docs/shared-content/realtime-sdk-client.md', contents: '# b\n' },
];

const lookup = (overrides) => (pagePath) => {
  if (pagePath in overrides) return overrides[pagePath];
  return expected.find((page) => page.path === pagePath)?.contents ?? null;
};

describe('diffGenerated', () => {
  it('reports no drift when every committed partial matches the fresh output', () => {
    expect(diffGenerated(expected, lookup({}))).toEqual({ missing: [], drifted: [] });
  });

  it('names the mutated partial', () => {
    const result = diffGenerated(
      expected,
      lookup({ 'content/docs/shared-content/realtime-sdk-client.md': '# b, edited by hand\n' })
    );
    expect(result.drifted).toEqual(['content/docs/shared-content/realtime-sdk-client.md']);
    expect(result.missing).toEqual([]);
    expect(formatDrift(result)).toContain('content/docs/shared-content/realtime-sdk-client.md');
  });

  it('names a partial that is not committed at all', () => {
    const result = diffGenerated(
      expected,
      lookup({ 'content/docs/shared-content/realtime-sdk-backend.md': null })
    );
    expect(result.missing).toEqual(['content/docs/shared-content/realtime-sdk-backend.md']);
    expect(result.drifted).toEqual([]);
    expect(formatDrift(result)).toContain('content/docs/shared-content/realtime-sdk-backend.md');
  });

  it('detects a single-byte change', () => {
    const result = diffGenerated(
      expected,
      lookup({ 'content/docs/shared-content/realtime-sdk-backend.md': '# a' })
    );
    expect(result.drifted).toEqual(['content/docs/shared-content/realtime-sdk-backend.md']);
  });
});

describe('checkGeneratedPages', () => {
  it('passes against the committed pages', async () => {
    const result = await checkGeneratedPages();
    expect(result.missing).toEqual([]);
    expect(result.drifted).toEqual([]);
    expect(result.ok).toBe(true);
  });
});
