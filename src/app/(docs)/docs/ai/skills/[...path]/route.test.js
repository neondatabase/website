import { describe, it, expect, vi, beforeEach } from 'vitest';

// notFound() throws a framework sentinel; assert we reach it for non-.md misses.
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

describe('skills markdown 404 route handler', () => {
  beforeEach(() => {
    // trackLLMPageview fires a fire-and-forget beacon; stub so it never hits network.
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  it('returns a text/markdown 404 for a missing .md path', async () => {
    const { GET } = await import('./route.js');
    const req = new Request('https://neon.com/docs/ai/skills/neon-postgres/references/gone.md');
    const res = await GET(req, {
      params: Promise.resolve({ path: ['neon-postgres', 'references', 'gone.md'] }),
    });

    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('text/markdown');
    expect(res.headers.get('x-content-source')).toBe('skills-404');
    expect(res.headers.get('x-robots-tag')).toBe('noindex');
    expect(res.headers.get('x-llms-txt')).toBe('/docs/llms.txt');

    const body = await res.text();
    expect(body).toContain('Page Not Found');
    expect(body).toContain('/docs/ai/skills/neon-postgres/references/gone.md');
  });

  it('fires the LLM 404 beacon', async () => {
    const { GET } = await import('./route.js');
    const req = new Request('https://neon.com/docs/ai/skills/foo.md');
    await GET(req, { params: Promise.resolve({ path: ['foo.md'] }) });

    const beacon = global.fetch.mock.calls.find(([url]) => url === 'https://neonapi.io/t.js');
    expect(beacon).toBeTruthy();
    expect(JSON.parse(beacon[1].body).data.llm_404).toBe(true);
  });

  it('delegates non-.md misses to the HTML not-found page', async () => {
    const { GET } = await import('./route.js');
    const req = new Request('https://neon.com/docs/ai/skills/foo/diagram.png');
    await expect(
      GET(req, { params: Promise.resolve({ path: ['foo', 'diagram.png'] }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
