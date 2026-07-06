import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_SPEC_CACHE_TTL_MS, loadOpenApiSpec } from './openapi-spec-source.mjs';

const NOW = Date.parse('2026-07-06T10:00:00.000Z');

function createTempCachePath() {
  const dir = mkdtempSync(join(tmpdir(), 'api-ref-spec-cache-'));
  return { dir, cachePath: join(dir, 'cache/spec.json') };
}

function writeCache(cachePath, fetchedAt, spec = { openapi: '3.0.0', paths: { cached: {} } }) {
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, `${JSON.stringify({ specUrl: 'cached-url', fetchedAt, spec })}\n`, {
    flag: 'w',
  });
}

function okFetch(spec = { openapi: '3.0.0', paths: { live: {} } }) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => spec,
  });
}

function failingFetch(error = new Error('network down')) {
  return vi.fn().mockRejectedValue(error);
}

describe('loadOpenApiSpec', () => {
  const tempDirs = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('fetches the live spec and writes a cache entry', async () => {
    const { dir, cachePath } = createTempCachePath();
    tempDirs.push(dir);
    const spec = { openapi: '3.0.0', paths: { live: {} } };

    const result = await loadOpenApiSpec({
      specUrl: 'https://example.com/spec.json',
      cachePath,
      fetchImpl: okFetch(spec),
      now: () => NOW,
      log: () => {},
    });

    expect(result).toBe(spec);
    const cache = JSON.parse(readFileSync(cachePath, 'utf8'));
    expect(cache.specUrl).toBe('https://example.com/spec.json');
    expect(cache.fetchedAt).toBe('2026-07-06T10:00:00.000Z');
    expect(cache.spec).toEqual(spec);
  });

  it('uses a fresh cache when the live fetch fails', async () => {
    const { dir, cachePath } = createTempCachePath();
    tempDirs.push(dir);
    writeCache(cachePath, new Date(NOW - 60000).toISOString());

    const result = await loadOpenApiSpec({
      specUrl: 'https://example.com/spec.json',
      cachePath,
      fetchImpl: failingFetch(),
      now: () => NOW,
      log: () => {},
    });

    expect(result).toEqual({ openapi: '3.0.0', paths: { cached: {} } });
  });

  it('fails when the live fetch fails and the cache is stale', async () => {
    const { dir, cachePath } = createTempCachePath();
    tempDirs.push(dir);
    writeCache(cachePath, new Date(NOW - DEFAULT_SPEC_CACHE_TTL_MS - 1).toISOString());

    await expect(
      loadOpenApiSpec({
        specUrl: 'https://example.com/spec.json',
        cachePath,
        fetchImpl: failingFetch(),
        now: () => NOW,
        log: () => {},
      })
    ).rejects.toThrow(/Cached API spec is stale/);
  });

  it('fails when the live fetch fails and no cache exists', async () => {
    const { dir, cachePath } = createTempCachePath();
    tempDirs.push(dir);

    await expect(
      loadOpenApiSpec({
        specUrl: 'https://example.com/spec.json',
        cachePath,
        fetchImpl: failingFetch(),
        now: () => NOW,
        log: () => {},
      })
    ).rejects.toThrow(/No API spec cache available/);
  });
});
