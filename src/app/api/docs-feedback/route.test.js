import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, init) =>
      new Response(JSON.stringify(body), {
        status: init?.status || 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  },
}));

global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

let GET, POST;

describe('/api/docs-feedback', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('./route.js');
    GET = mod.GET;
    POST = mod.POST;
  });

  const makeRequest = (body, headers = {}) =>
    new Request('https://neon.com/api/docs-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });

  describe('GET', () => {
    it('returns self-documenting JSON with cache header', async () => {
      const res = await GET();
      expect(res.status).toBe(200);
      expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400');

      const json = await res.json();
      expect(json.endpoint).toBe('POST /api/docs-feedback');
      expect(json.body.feedback).toBeDefined();
      expect(json.example).toBeDefined();
    });
  });

  describe('POST — validation', () => {
    it('returns 400 for invalid JSON', async () => {
      const req = new Request('https://neon.com/api/docs-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toMatch(/Invalid JSON/i);
    });

    it('returns 400 when feedback is missing', async () => {
      const res = await POST(makeRequest({}));
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toMatch(/feedback is required/);
    });

    it('returns 400 when feedback is empty/whitespace', async () => {
      const res = await POST(makeRequest({ feedback: '   ' }));
      expect(res.status).toBe(400);
    });

    it('truncates feedback exceeding max length instead of rejecting', async () => {
      await POST(makeRequest({ feedback: 'x'.repeat(5000) }));
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.data.feedback.length).toBe(3000);
    });

    it('truncates path exceeding max length instead of rejecting', async () => {
      await POST(makeRequest({ feedback: 'test', path: '/docs/' + 'x'.repeat(600) }));
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.data.path.length).toBe(500);
    });

    it('ignores unknown fields without error', async () => {
      const res = await POST(
        makeRequest({ feedback: 'test', category: 'incorrect', source: 'cursor', extra: 'data' })
      );
      expect(res.status).toBe(204);
    });
  });

  describe('POST — success', () => {
    it('returns 204 with minimal payload', async () => {
      const res = await POST(makeRequest({ feedback: 'Something is wrong' }));
      expect(res.status).toBe(204);
    });

    it('returns 204 with path', async () => {
      const res = await POST(
        makeRequest({
          feedback: 'Connection string is wrong',
          path: '/docs/auth/overview',
        })
      );
      expect(res.status).toBe(204);
    });

    it('fires fetch to neonapi.io with correct payload shape', async () => {
      await POST(
        makeRequest({
          feedback: 'test feedback',
          path: '/docs/auth/overview',
        })
      );

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, opts] = global.fetch.mock.calls[0];
      expect(url).toBe('https://neonapi.io/t.js');
      expect(opts.method).toBe('POST');

      const payload = JSON.parse(opts.body);
      expect(payload.name).toBe('Agent Feedback Submitted');
      expect(payload.data.feedback).toBe('test feedback');
      expect(payload.data.path).toBe('/docs/auth/overview');
      expect(payload.zarazData).toBeDefined();
      expect(payload.system.device.ip).toBe('192.168.0.1');
    });

    it('strips unknown fields from data', async () => {
      await POST(makeRequest({ feedback: 'test', malicious: 'injected', foo: 'bar' }));

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.data.malicious).toBeUndefined();
      expect(payload.data.foo).toBeUndefined();
      expect(payload.data.feedback).toBe('test');
    });

    it('skips fetch when dry_run is set', async () => {
      const res = await POST(makeRequest({ feedback: 'test', dry_run: true }));
      expect(res.status).toBe(204);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('constructs page URL from path', async () => {
      await POST(makeRequest({ feedback: 'test', path: '/docs/auth/overview' }));

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.zarazData.l).toBe('https://neon.com/docs/auth/overview');
    });

    it('falls back to Referer when path is omitted', async () => {
      const headerMap = new Map([
        ['content-type', 'application/json'],
        ['referer', 'https://neon.com/docs/intro'],
        ['cookie', ''],
        ['user-agent', ''],
      ]);
      const req = {
        json: () => Promise.resolve({ feedback: 'test' }),
        headers: { get: (name) => headerMap.get(name.toLowerCase()) || '' },
      };
      await POST(req);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.zarazData.l).toBe('https://neon.com/docs/intro');
    });
  });
});
