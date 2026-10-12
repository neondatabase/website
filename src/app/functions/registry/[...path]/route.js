import {
  REGISTRY_CACHE_SECONDS,
  registrySourceUrl,
  resolveRegistryPath,
} from 'utils/function-registry';

// Serves the Function Registry catalog and schemas (registry.json and
// schemas/*.json) at https://neon.com/functions/registry/<path>, the way
// bootstrap/templates.yaml serves the `neon bootstrap` manifest. Modules are
// not served here. See utils/function-registry.js.
//
// There is deliberately no bundled fallback: a copy here would drift from the
// examples repo. When GitHub is unreachable this answers 502 uncached, and the
// CLI falls back to raw GitHub itself.
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
