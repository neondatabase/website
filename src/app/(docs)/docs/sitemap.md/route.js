import { getSitemapMarkdown } from 'utils/sitemap-md';

// Built once per deploy from the content sources (see utils/sitemap-md.js), so
// it picks up new pages without manual edits. Canonical path, like
// /docs/llms.txt: next.config.js rewrites /sitemap.md and /.well-known/sitemap.md
// here.
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  return new Response(await getSitemapMarkdown(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
