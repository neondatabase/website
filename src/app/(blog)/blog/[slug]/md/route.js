import { getBlogPostRawBySlug } from 'utils/api-blog';
import { markdownNotFoundResponse, markdownResponse } from 'utils/markdown-response';

// Serves a blog post's raw markdown from the same in-repo snapshot the HTML
// page renders from, so the markdown can never drift from the published post.
// The proxy (src/proxy.js) fetches this route for `/blog/[slug].md` and for AI
// agents on `/blog/[slug]`, then returns the body and counts the read itself,
// before any cache. This route doesn't count reads, so the CDN may cache it.
export const dynamic = 'force-dynamic';

const BLOG_LLMS_TXT = '/blog/llms.txt';

export async function GET(req, { params }) {
  const { slug } = await params;

  let raw;
  try {
    raw = await getBlogPostRawBySlug(slug);
  } catch (error) {
    console.error('[blog .md] Failed to read blog snapshot', { slug, error: error?.message });
    return new Response(`# Service Unavailable\n\nCould not load /blog/${slug}.md.\n`, {
      status: 502,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  if (raw == null) {
    return markdownNotFoundResponse(`/blog/${slug}.md`, {
      source: 'agent-404',
      context: 'Neon Blog',
      extraLinks: [
        { label: 'Blog index', href: BLOG_LLMS_TXT, description: 'All Neon blog posts' },
      ],
      llmsTxt: BLOG_LLMS_TXT,
    });
  }

  const response = markdownResponse(raw);
  response.headers.set('X-LLMs-Txt', BLOG_LLMS_TXT);
  return response;
}
