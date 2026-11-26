import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getBlogPostRawBySlug } from 'utils/api-blog';

import { GET } from './route';

vi.mock('utils/api-blog', () => ({ getBlogPostRawBySlug: vi.fn() }));

const request = () =>
  new Request('https://neon.com/blog/example-post/md', {
    headers: { 'user-agent': 'neon-blog-markdown-proxy' },
  });
const params = { params: Promise.resolve({ slug: 'example-post' }) };

// The proxy fetches this route and counts the read (src/proxy.js,
// blogMarkdownResponse). The route only serves the post.
describe('Blog Markdown route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('serves the raw post with CDN-cacheable Markdown headers and sends no pageview', async () => {
    getBlogPostRawBySlug.mockResolvedValue('# Blog post');
    const response = await GET(request(), params);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('# Blog post');
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=300');
    expect(response.headers.get('X-Content-Source')).toBe('markdown');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
    expect(response.headers.get('X-LLMs-Txt')).toBe('/blog/llms.txt');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns a Markdown 404 for a missing post', async () => {
    getBlogPostRawBySlug.mockResolvedValue(null);
    const response = await GET(request(), params);

    expect(response.status).toBe(404);
    expect(await response.text()).toContain('/blog/example-post.md');
    expect(response.headers.get('X-Content-Source')).toBe('agent-404');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=300');
    // Same markdown-404 format as docs, pointing at the blog index.
    expect(response.headers.get('X-LLMs-Txt')).toBe('/blog/llms.txt');
    expect(response.headers.get('Link')).toContain('</blog/llms.txt>; rel="llms-txt"');
    expect(response.headers.get('Vary')).toContain('Accept');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns 502 when the blog snapshot cannot be read', async () => {
    getBlogPostRawBySlug.mockRejectedValue(new Error('Snapshot unavailable'));
    const response = await GET(request(), params);

    expect(response.status).toBe(502);
    expect(response.headers.get('Cache-Control')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});
