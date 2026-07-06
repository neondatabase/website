import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export const DEFAULT_SPEC_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function defaultSpecCachePath(root) {
  return resolve(root, '.next/cache/api-reference/openapi-v2.json');
}

function readCache(cachePath) {
  if (!existsSync(cachePath)) return null;
  const parsed = JSON.parse(readFileSync(cachePath, 'utf8'));
  if (!parsed || typeof parsed !== 'object' || !parsed.spec || !parsed.fetchedAt) {
    throw new Error(`Invalid API spec cache shape at ${cachePath}`);
  }
  return parsed;
}

function isFresh(cache, nowMs, ttlMs) {
  const fetchedAt = Date.parse(cache.fetchedAt);
  return Number.isFinite(fetchedAt) && nowMs - fetchedAt <= ttlMs;
}

function writeCache(cachePath, { specUrl, spec, nowMs }) {
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(
    cachePath,
    `${JSON.stringify(
      {
        specUrl,
        fetchedAt: new Date(nowMs).toISOString(),
        spec,
      },
      null,
      2
    )}\n`
  );
}

function fetchErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

export async function loadOpenApiSpec({
  specUrl,
  cachePath,
  ttlMs = DEFAULT_SPEC_CACHE_TTL_MS,
  fetchImpl = fetch,
  now = () => Date.now(),
  log = (message) => process.stderr.write(message),
}) {
  log(`Fetching spec from ${specUrl}...\n`);
  const nowMs = now();

  try {
    const specRes = await fetchImpl(specUrl);
    if (!specRes.ok) {
      throw new Error(`Spec fetch failed: ${specRes.status} ${specRes.statusText}`);
    }
    const spec = await specRes.json();
    writeCache(cachePath, { specUrl, spec, nowMs });
    return spec;
  } catch (error) {
    let cache = null;
    try {
      cache = readCache(cachePath);
    } catch (cacheError) {
      throw new Error(
        `${fetchErrorMessage(error)}. Cache fallback failed: ${fetchErrorMessage(cacheError)}`
      );
    }

    if (cache && isFresh(cache, nowMs, ttlMs)) {
      log(
        `[api-ref] Spec fetch failed (${fetchErrorMessage(error)}). ` +
          `Using cached spec from ${cache.fetchedAt}.\n`
      );
      return cache.spec;
    }

    if (cache) {
      throw new Error(
        `${fetchErrorMessage(error)}. Cached API spec is stale: ` +
          `${cache.fetchedAt}; max age is ${ttlMs}ms.`
      );
    }

    throw new Error(`${fetchErrorMessage(error)}. No API spec cache available at ${cachePath}.`);
  }
}
