import { NextResponse } from 'next/server';

import { buildAgent404Response } from './ai-agent-detection';

// Single source of truth for a `text/markdown` 404 response: the agent-404 body
// plus the doc headers (Content-Type, Cache-Control, X-Content-Source,
// X-Robots-Tag, Vary, X-LLMs-Txt, Link). Used by the proxy's markdown branches
// and by route handlers (e.g. the skills catch-all), so there is exactly one
// markdown-404 format across the site.
//
// `source` sets X-Content-Source so logs distinguish which branch produced it.
export function markdownNotFoundResponse(
  pathname,
  { source, extraLinks = [], context = 'Neon documentation', llmsTxt = '/docs/llms.txt' } = {}
) {
  const response = new NextResponse(buildAgent404Response(pathname, { extraLinks, context }), {
    status: 404,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
      'X-Content-Source': source,
      'X-Robots-Tag': 'noindex',
    },
  });
  response.headers.append('Vary', 'Accept');
  response.headers.set('X-LLMs-Txt', llmsTxt);
  response.headers.append('Link', `<${llmsTxt}>; rel="llms-txt"`);
  response.headers.append('Link', '</docs/llms-full.txt>; rel="llms-full-txt"');
  return response;
}
