import { after } from 'next/server';

import { buildAgent404Response } from 'utils/ai-agent-detection';
import { getBlogPostRawBySlug } from 'utils/api-blog';
import { createLLMAnalytics } from 'utils/llm-analytics';

// Serves a blog post's raw markdown for the public `/blog/[slug].md` URL. The
// proxy (src/proxy.js) rewrites `/blog/[slug].md` here. This handler reads
// the same in-repo snapshot the HTML page renders from,
// so the markdown can never drift from the published post.
export const dynamic = 'force-dynamic';

// The public `.md` URL, not the internal rewrite target, is what the read
// beacon should record.
const canonicalUrlFor = (req, slug) => new URL(`/blog/${slug}.md`, req.url).href;

export async function GET(req, { params }) {
  const { slug } = await params;
  const beaconReq = { url: canonicalUrlFor(req, slug), headers: req.headers, method: req.method };
  const analytics = createLLMAnalytics(beaconReq);
  const respond = (response) => {
    analytics.logResponse(response);
    return response;
  };

  let raw;
  try {
    raw = await getBlogPostRawBySlug(slug);
  } catch (error) {
    console.error('[blog .md] Failed to read blog snapshot', { slug, error: error?.message });
    return respond(
      new Response(`# Service Unavailable\n\nCould not load /blog/${slug}.md.\n`, {
        status: 502,
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      })
    );
  }

  if (raw == null) {
    // after(): the response returns immediately; the runtime keeps the function
    // alive while the bounded beacon attempt completes.
    after(analytics.track({ is404: true, branch: 'blog-markdown' }));
    return respond(
      new Response(
        buildAgent404Response(`/blog/${slug}.md`, {
          context: 'Neon Blog',
          extraLinks: [
            { label: 'Blog index', href: '/blog/llms.txt', description: 'All Neon blog posts' },
          ],
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=60, s-maxage=300',
            'X-Content-Source': 'agent-404',
            'X-LLMs-Txt': '/blog/llms.txt',
          },
        }
      )
    );
  }

  after(analytics.track({ branch: 'blog-markdown' }));
  return respond(
    new Response(raw, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        // Preserve the existing short Markdown cache policy.
        'Cache-Control': 'public, max-age=60, s-maxage=300',
        'X-Content-Source': 'markdown',
        'X-Robots-Tag': 'noindex',
        'X-LLMs-Txt': '/blog/llms.txt',
      },
    })
  );
}
