import { registrySourceUrl, resolveRegistryPath } from 'utils/function-registry';

// Next only accepts a literal here.
export const revalidate = 3600;

const notFound = () =>
  new Response('Not found\n', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, s-maxage=${revalidate}`,
    },
  });

// 502s must not be cached.
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
      next: { revalidate },
    });
    if (!response.ok) return unavailable();
    const text = await response.text();
    JSON.parse(text); // reject non-JSON before serving
    return new Response(text, {
      headers: {
        'Content-Type': resolved.contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=86400`,
      },
    });
  } catch {
    return unavailable();
  }
}
