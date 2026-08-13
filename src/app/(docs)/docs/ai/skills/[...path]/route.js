import { notFound } from 'next/navigation';

import { trackLLMPageview } from 'utils/llm-analytics';
import { markdownNotFoundResponse } from 'utils/markdown-404';

// Markdown 404 for missing skill files under /docs/ai/skills/**.
//
// Vendored skill files (SKILL.md, references) are real static assets under
// public/docs/ai/skills/**. Vercel serves those at routing step 5 (filesystem),
// before dynamic routes at step 7 — so a *present* file never reaches this
// handler. This more-specific catch-all only wins over the parent
// `docs/[...slug]` page on a genuine miss, the same way the existing
// `docs/mcp` and `docs/reference/api/[...slug]` handlers coexist with it.
//
// Because the file is resolved by the static layer, this needs no probe fetch
// and no existence manifest: the proxy still returns NextResponse.next() for
// these paths (zero-fetch passthrough contract intact), and only a real 404
// lands here.
export const dynamic = 'force-dynamic';

async function handler(request, { params }) {
  const { path = [] } = await params;
  const pathname = `/docs/ai/skills/${path.join('/')}`;

  // Only markdown requests get a markdown 404. Other missing assets (images,
  // etc.) fall through to the standard HTML not-found page.
  if (!pathname.endsWith('.md')) notFound();

  trackLLMPageview(request, { is404: true });
  return markdownNotFoundResponse(pathname, { source: 'skills-404' });
}

export const GET = handler;
export const HEAD = handler;
