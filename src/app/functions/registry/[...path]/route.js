import {
  REGISTRY_CACHE_SECONDS,
  registrySourceUrl,
  resolveRegistryPath,
} from 'utils/function-registry';

// Serves the Function Registry catalog at
// https://neon.com/functions/registry/<path>, the way
// /bootstrap/templates.yaml serves the `neon bootstrap` manifest.
//
// Source of truth is neondatabase/examples/registry on `main`, cached for an
// hour. No bundled fallback: a copy here would drift from the examples repo.

// Re-generate (and re-fetch the upstream) at most once an hour.
export const revalidate = 3600;

const notFound = () =>
  new Response('Not found\n', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, s-maxage=${REGISTRY_CACHE_SECONDS}`,
    },
  });

const unavailable = () =>
  new Response('The Function Registry is temporarily unavailable.\n', {
    status: 502,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });

export async function GET(_request, { params }) {
  const { path: segments } = await params;
  const resolved = resolveRegistryPath(segments);
  if (!resolved) return notFound();

  try {
    const response = await fetch(registrySourceUrl(resolved.path), {
      headers: { 'User-Agent': 'neon-website-function-registry' },
      next: { revalidate: REGISTRY_CACHE_SECONDS },
    });
    if (!response.ok) return unavailable();
    const text = await response.text();
    JSON.parse(text);
    return new Response(text, {
      headers: {
        'Content-Type': resolved.contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, s-maxage=${REGISTRY_CACHE_SECONDS}, stale-while-revalidate=86400`,
      },
    });
  } catch {
    return unavailable();
  }
}
