import { after } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getBlogPostRawBySlug } from 'utils/api-blog';

import { GET } from './route';

vi.mock('next/server', () => ({ after: vi.fn() }));
vi.mock('utils/api-blog', () => ({ getBlogPostRawBySlug: vi.fn() }));

const request = () =>
  new Request('https://neon.com/blog/example-post/md?token=query-secret', {
    headers: { 'x-vercel-id': 'fra1::blog-request', 'user-agent': 'ChatGPT-User/1.0' },
  });
const params = { params: Promise.resolve({ slug: 'example-post' }) };

describe('Blog Markdown analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('LLM_ANALYTICS_DEBUG', 'false');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 200 })));
    getBlogPostRawBySlug.mockResolvedValue('# Blog post');
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([
    ['# Blog post', 200, false],
    [null, 404, true],
  ])('uses after() for a %s post and preserves HTTP %s', async (content, status, is404) => {
    getBlogPostRawBySlug.mockResolvedValue(content);
    let acceptBeacon;
    fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          acceptBeacon = resolve;
        })
    );
    const response = await GET(request(), params);
    expect(response.status).toBe(status);
    expect(after).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(fetch.mock.calls[0][1].body);
    expect(payload.zarazData.l).toBe('https://neon.com/blog/example-post.md');
    expect(payload.data).toMatchObject({ llm_404: is404, llm_request_id: 'fra1::blog-request' });
    acceptBeacon({ ok: true, status: 200 });
    await after.mock.calls[0][0];
  });

  it('reports collector failure while serving the original blog content', async () => {
    fetch.mockResolvedValue(new Response('', { status: 429 }));
    const response = await GET(request(), params);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('# Blog post');
    await expect(after.mock.calls[0][0]).resolves.toMatchObject({ outcome: 'http_error' });
    expect(JSON.parse(console.warn.mock.calls[0][0]).http_status).toBe(429);
  });

  it('preserves the untracked 502 when the blog snapshot cannot be read', async () => {
    getBlogPostRawBySlug.mockRejectedValue(new Error('Snapshot unavailable'));
    const response = await GET(request(), params);
    expect(response.status).toBe(502);
    expect(after).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('uses the public Markdown path and shared Vercel ID in diagnostics', async () => {
    vi.stubEnv('LLM_ANALYTICS_DEBUG', 'true');
    await GET(request(), params);
    await after.mock.calls[0][0];
    const logs = console.info.mock.calls.map(([line]) => JSON.parse(line));
    expect(logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'llm_request', proxy_status: 200, beacon_scheduled: true }),
        expect.objectContaining({ type: 'llm_beacon', outcome: 'accepted' }),
      ])
    );
    for (const log of logs) {
      expect(log.request_id).toBe('fra1::blog-request');
      expect(log.path).toBe('/blog/example-post.md');
    }
    expect(JSON.stringify(logs)).not.toContain('query-secret');
  });
});
