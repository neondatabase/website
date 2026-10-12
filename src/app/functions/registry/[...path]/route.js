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
export const dynamic = 'force-dynamic';

const notFound = () =>
  new Response('Not found\n', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `public, s-maxage=${REGISTRY_CACHE_SECONDS}`,
    },
  });

export async function GET(_request, { params }) {
  const { path: segments } = await params;
  const resolved = resolveRegistryPath(segments);
  if (!resolved) return notFound();

  let response;
  try {
    response = await fetch(registrySourceUrl(resolved.path), {
      headers: { 'User-Agent': 'neon-website-function-registry' },
      next: { revalidate: REGISTRY_CACHE_SECONDS },
    });
  } catch {
    response = null;
  }
  if (response?.status === 404) return notFound();
  if (!response?.ok) {
    return new Response('The Function Registry is temporarily unavailable.\n', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  return new Response(await response.text(), {
    headers: {
      'Content-Type': resolved.contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, s-maxage=${REGISTRY_CACHE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
}
