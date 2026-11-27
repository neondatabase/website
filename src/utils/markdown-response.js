import { NextResponse } from 'next/server';

import { buildAgent404Response } from './ai-agent-detection';

// Markdown responses served to agents (docs, generated pages, blog posts),
// shared by the proxy and route handlers so every markdown URL gets the same
// headers.

// Short cache TTL for markdown and the redirects/404s around it, so cached
// responses still re-enter the proxy often and reads stay counted.
export const MARKDOWN_CACHE_CONTROL = 'public, max-age=60, s-maxage=300';

// A `text/markdown` response with the standard markdown headers. `source` sets
// X-Content-Source so logs distinguish which branch produced it.
export function markdownResponse(body, { status = 200, source = 'markdown' } = {}) {
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': MARKDOWN_CACHE_CONTROL,
      'X-Content-Source': source,
      'X-Robots-Tag': 'noindex',
    },
  });
}

// Single source of truth for a `text/markdown` 404 response: the agent-404 body
// plus the doc headers (Content-Type, Cache-Control, X-Content-Source,
// X-Robots-Tag, Vary, X-LLMs-Txt, Link). Used by the proxy's markdown branches
// and by route handlers (e.g. blog posts), so there is exactly one markdown-404
// format across the site.
export function markdownNotFoundResponse(
  pathname,
  { source, extraLinks = [], context = 'Neon documentation', llmsTxt = '/docs/llms.txt' } = {}
) {
  const response = markdownResponse(buildAgent404Response(pathname, { extraLinks, context }), {
    status: 404,
    source,
  });
  response.headers.append('Vary', 'Accept');
  response.headers.set('X-LLMs-Txt', llmsTxt);
  response.headers.append('Link', `<${llmsTxt}>; rel="llms-txt"`);
  response.headers.append('Link', '</docs/llms-full.txt>; rel="llms-full-txt"');
  return response;
}
