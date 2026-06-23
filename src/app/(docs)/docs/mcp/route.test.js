import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

let GET, POST;

describe('/docs/mcp route', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    const mod = await import('./route.js');
    GET = mod.GET;
    POST = mod.POST;
  });

  // ─── GET ─────────────────────────────────────────────────────────────────

  describe('GET', () => {
    it('returns 200 with valid MCP Foundation server.json', async () => {
      const res = await GET();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.$schema).toBe(
        'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json'
      );
      expect(json.name).toBe('com.neon/docs-mcp');
      expect(json.version).toBe('1.0.0');
    });

    it('remotes[0] points to the docs-scoped unauthenticated endpoint', async () => {
      const res = await GET();
      const json = await res.json();
      expect(json.remotes).toHaveLength(1);
      expect(json.remotes[0].type).toBe('streamable-http');
      expect(json.remotes[0].url).toBe('https://mcp.neon.tech/mcp?category=docs');
      // No auth headers — this endpoint is intentionally unauthenticated
      expect(json.remotes[0].headers).toBeUndefined();
    });

    it('includes a public cache-control header', async () => {
      const res = await GET();
      const cc = res.headers.get('Cache-Control');
      expect(cc).toMatch(/public/);
      expect(cc).toMatch(/max-age/);
    });
  });

  // ─── POST ────────────────────────────────────────────────────────────────

  describe('POST — proxy to upstream', () => {
    const makeRequest = (body = {}, headers = {}) =>
      new Request('https://neon.com/docs/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          ...headers,
        },
        body: JSON.stringify(body),
      });

    it('proxies initialize to mcp.neon.tech/mcp?category=docs', async () => {
      global.fetch.mockResolvedValueOnce(
        new Response('event: message\ndata: {"result":{"protocolVersion":"2025-03-26"}}\n\n', {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        })
      );

      const req = makeRequest({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'test', version: '1.0' },
        },
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toMatch(/text\/event-stream/);

      const [url, opts] = global.fetch.mock.calls[0];
      expect(url).toBe('https://mcp.neon.tech/mcp?category=docs');
      expect(opts.method).toBe('POST');
      expect(JSON.parse(opts.body).method).toBe('initialize');
    });

    it('forwards Accept and Content-Type headers to upstream', async () => {
      global.fetch.mockResolvedValueOnce(
        new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
      );

      const req = makeRequest(
        {},
        { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json' }
      );
      await POST(req);

      const [, opts] = global.fetch.mock.calls[0];
      expect(opts.headers['Content-Type']).toBe('application/json');
      expect(opts.headers['Accept']).toBe('application/json, text/event-stream');
    });

    it('passes upstream status through unchanged', async () => {
      global.fetch.mockResolvedValueOnce(
        new Response('{"error":"invalid_token"}', {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const res = await POST(
        makeRequest({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} })
      );
      expect(res.status).toBe(401);
    });

    it('returns 502 when upstream is unreachable', async () => {
      global.fetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      const res = await POST(makeRequest());
      expect(res.status).toBe(502);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });

    it('sets no-store cache-control on proxied responses', async () => {
      global.fetch.mockResolvedValueOnce(
        new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
      );

      const res = await POST(makeRequest());
      expect(res.headers.get('Cache-Control')).toBe('no-store');
    });
  });
});
