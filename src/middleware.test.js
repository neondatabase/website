import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock the modules - must be at the top before imports
vi.mock('next/server', () => ({
  NextResponse: class MockNextResponse extends Response {
    constructor(body, init) {
      super(body, init);
      this.type = 'response';
    }

    static next() {
      return { type: 'next', headers: new Headers() };
    }

    static redirect(url) {
      return { type: 'redirect', url, headers: new Headers() };
    }
  },
}));

vi.mock('app/actions', () => ({
  checkCookie: vi.fn(() => Promise.resolve(false)),
  getReferer: vi.fn(() => Promise.resolve('')),
}));

// Mock fetch globally — default returns a safe no-op response so
// trackLLMPageview's fire-and-forget fetch never throws or consumes
// the targeted mockResolvedValueOnce set up by individual tests.
global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

// Ensure SITE_URL is defined so the error-fallback redirect doesn't throw
process.env.NEXT_PUBLIC_DEFAULT_SITE_URL = 'https://neon.com';

// Now import middleware after all mocks are set up
let middleware;

describe('Middleware - AI Agent Integration Tests', () => {
  beforeAll(async () => {
    const middlewareModule = await import('./proxy.js');
    middleware = middlewareModule.proxy;
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (pathname, userAgent = '', accept = '') => ({
    nextUrl: {
      pathname,
      origin: 'https://neon.com',
      href: `https://neon.com${pathname}`,
    },
    url: `https://neon.com${pathname}`,
    headers: new Map([
      ['user-agent', userAgent],
      ['accept', accept],
    ]),
  });

  // Helper to mock a successful markdown fetch.
  // The markdown fetch fires first, then trackLLMPageview fires after
  // (on the success early-return path), so mocks must be in that order.
  const mockMarkdownFetch = (content = '# Test Markdown') => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(content),
      }) // markdown fetch (first call)
      .mockResolvedValueOnce({ ok: true }); // analytics (trackLLMPageview, second call)
  };

  // Route fetches by URL instead of by call order, so tests don't depend on the
  // exact sequence of markdown fetch / analytics / redirect probe. `md` is the
  // response for the /md/... static fetch; `probe` is the response for the HTML
  // sibling redirect probe. Analytics (/t.js) always resolves ok.
  const mockFetchByUrl = ({ md, probe }) => {
    global.fetch.mockImplementation((url, opts) => {
      if (url === 'https://neonapi.io/t.js') return Promise.resolve({ ok: true });
      if (opts?.redirect === 'manual') return Promise.resolve(probe);
      return Promise.resolve(md);
    });
  };

  describe('Content routes - AI Agents should get markdown', () => {
    const testCases = [
      { name: 'Docs', path: '/docs/introduction' },
      { name: 'PostgreSQL', path: '/postgresql/tutorial' },
      { name: 'Guides', path: '/guides/neon-sst' },
      { name: 'Branching', path: '/branching/introduction' },
      { name: 'Programs', path: '/programs/agents' },
      { name: 'Use Cases', path: '/use-cases/ai-agents' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'FAQs', path: '/faqs/connect-application-using-connection-string' },
    ];

    testCases.forEach(({ name, path }) => {
      it(`should serve markdown for ${name} (${path}) with AI User-Agent`, async () => {
        const req = createMockRequest(path, 'Claude/1.0', 'text/html');
        mockMarkdownFetch(`# ${name} Content`);

        const response = await middleware(req);

        expect(global.fetch).toHaveBeenCalled();
        expect(response).toBeInstanceOf(Response);
        const text = await response.text();
        expect(text).toContain(`# ${name} Content`);
        expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
        expect(response.headers.get('X-Content-Source')).toBe('markdown');
      });

      it(`should serve markdown for ${name} (${path}) with Accept: text/plain`, async () => {
        const req = createMockRequest(path, 'Mozilla/5.0', 'text/plain');
        mockMarkdownFetch(`# ${name} Content`);

        const response = await middleware(req);

        expect(global.fetch).toHaveBeenCalled();
        expect(response).toBeInstanceOf(Response);
        const text = await response.text();
        expect(text).toContain(`# ${name} Content`);
      });

      it(`should NOT serve markdown for ${name} (${path}) with regular browser request`, async () => {
        const req = createMockRequest(
          path,
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'text/html'
        );

        const response = await middleware(req);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(response.type).toBe('next');
      });
    });
  });

  describe('Bare /docs root', () => {
    it('serves llms.txt markdown for AI User-Agent', async () => {
      const req = createMockRequest('/docs', 'Claude/1.0', 'text/html');
      mockMarkdownFetch('# Neon Postgres');

      const response = await middleware(req);

      expect(global.fetch).toHaveBeenCalledWith('https://neon.com/docs/llms.txt');
      const text = await response.text();
      expect(text).toContain('# Neon Postgres');
      expect(response.headers.get('X-Content-Source')).toBe('markdown');
    });

    it('serves llms.txt markdown for Accept: text/markdown', async () => {
      const req = createMockRequest('/docs', 'Mozilla/5.0', 'text/markdown');
      mockMarkdownFetch('# Neon Postgres');

      const response = await middleware(req);

      expect(global.fetch).toHaveBeenCalledWith('https://neon.com/docs/llms.txt');
      const text = await response.text();
      expect(text).toContain('# Neon Postgres');
    });

    it('redirects browsers to /docs/introduction without fetching markdown', async () => {
      const req = createMockRequest(
        '/docs',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'text/html'
      );

      const response = await middleware(req);

      expect(response.type).toBe('redirect');
      expect(response.url.toString()).toContain('/docs/introduction');
      expect(response.headers.get('Vary')).toBe('Accept');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Excluded routes - no index markdown available, return HTML', () => {
    const excludedCases = [
      { name: 'Index /guides', path: '/guides', reason: 'index page without markdown' },
      { name: 'Index /branching', path: '/branching', reason: 'index page without markdown' },
      { name: 'Index /faqs', path: '/faqs', reason: 'index page without markdown' },
      {
        name: 'Use case multi-tb',
        path: '/use-cases/multi-tb',
        reason: 'no markdown available',
      },
      {
        name: 'Use case serverless-apps',
        path: '/use-cases/serverless-apps',
        reason: 'no markdown available',
      },
      { name: 'RSS file', path: '/guides/rss.xml', reason: 'RSS file' },
    ];

    excludedCases.forEach(({ name, path, reason }) => {
      it(`should return HTML for ${name} (${path}) even with AI User-Agent - ${reason}`, async () => {
        const req = createMockRequest(path, 'Claude/1.0', 'text/html');

        const response = await middleware(req);

        // Analytics fetch fires (trackLLMPageview), but no markdown fetch
        const markdownFetchCalls = global.fetch.mock.calls.filter(
          ([url]) => url !== 'https://neonapi.io/t.js'
        );
        expect(markdownFetchCalls).toHaveLength(0);
        expect(response.type).toBe('next');
      });

      it(`should return HTML for ${name} (${path}) with Accept: text/plain - ${reason}`, async () => {
        const req = createMockRequest(path, 'Mozilla/5.0', 'text/plain');

        const response = await middleware(req);

        const markdownFetchCalls = global.fetch.mock.calls.filter(
          ([url]) => url !== 'https://neonapi.io/t.js'
        );
        expect(markdownFetchCalls).toHaveLength(0);
        expect(response.type).toBe('next');
      });
    });
  });

  describe('Error handling', () => {
    it('should return agent-friendly 404 markdown when markdown fetch returns 404', async () => {
      const req = createMockRequest('/docs/non-existent', 'Claude/1.0', 'text/html');

      // Non-.md path: markdown 404, no redirect probe (bare moved paths are
      // handled by next.config before middleware).
      mockFetchByUrl({ md: { ok: false, status: 404 } });

      const response = await middleware(req);

      expect(global.fetch).toHaveBeenCalled();
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(404);
      expect(response.headers.get('X-Content-Source')).toBe('agent-404');
      const text = await response.text();
      expect(text).toContain('/docs/non-existent');
      expect(text).toContain('/docs/llms.txt');
      expect(text).toContain('/docs/cli.md');
    });

    it('should use shorter cache TTL for agent 404 responses', async () => {
      const req = createMockRequest('/docs/non-existent', 'Claude/1.0', 'text/html');

      // Non-.md path: no redirect probe (bare moved paths are handled by
      // next.config before middleware).
      mockFetchByUrl({ md: { ok: false, status: 404 } });

      const response = await middleware(req);

      expect(response.status).toBe(404);
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=300');
    });

    it('should track an agent .md request only once when the backend errors (5xx)', async () => {
      const req = createMockRequest('/docs/cli/login.md', 'Claude/1.0', 'text/html');

      // Markdown backend returns 500: the agent branch tracks once and falls
      // through to the .md content branch, which must NOT track again.
      mockFetchByUrl({ md: { ok: false, status: 500 } });

      await middleware(req);

      const analyticsCalls = global.fetch.mock.calls.filter(
        ([url]) => url === 'https://neonapi.io/t.js'
      );
      expect(analyticsCalls).toHaveLength(1);
    });

    it('should redirect agents to the target .md when a moved page 404s', async () => {
      const req = createMockRequest('/docs/cli/login.md', 'Claude/1.0', 'text/html');

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: { ok: false, status: 308, headers: new Headers({ location: '/docs/cli/auth' }) },
      });

      const response = await middleware(req);

      expect(response.type).toBe('redirect');
      expect(response.url.toString()).toBe('https://neon.com/docs/cli/auth.md');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=86400');
      // The agent hit is still tracked before the redirect returns.
      expect(global.fetch).toHaveBeenCalledWith(
        'https://neonapi.io/t.js',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should not redirect when the moved page targets an off-origin URL', async () => {
      const req = createMockRequest('/docs/legacy.md', 'Claude/1.0', 'text/html');

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: {
          ok: false,
          status: 308,
          headers: new Headers({ location: 'https://example.com/somewhere' }),
        },
      });

      const response = await middleware(req);

      // Off-origin has no .md equivalent, so fall through to the agent 404.
      expect(response.status).toBe(404);
      expect(response.headers.get('X-Content-Source')).toBe('agent-404');
    });

    it('should not mirror a temporary (307) redirect as a permanent .md redirect', async () => {
      const req = createMockRequest('/docs/temporary.md', 'Claude/1.0', 'text/html');

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: { ok: false, status: 307, headers: new Headers({ location: '/docs/elsewhere' }) },
      });

      const response = await middleware(req);

      // Temporary redirects must not become a hard-cached 308, so fall through.
      expect(response.status).toBe(404);
      expect(response.headers.get('X-Content-Source')).toBe('agent-404');
    });

    it('should mirror a permanent 301 redirect (not just 308)', async () => {
      const req = createMockRequest('/docs/cli/login.md', 'Claude/1.0', 'text/html');

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: { ok: false, status: 301, headers: new Headers({ location: '/docs/cli/auth' }) },
      });

      const response = await middleware(req);

      expect(response.type).toBe('redirect');
      expect(response.url.toString()).toBe('https://neon.com/docs/cli/auth.md');
    });

    it('should not redirect when the moved page targets the site root', async () => {
      const req = createMockRequest('/docs/legacy.md', 'Claude/1.0', 'text/html');

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: { ok: false, status: 308, headers: new Headers({ location: '/' }) },
      });

      const response = await middleware(req);

      // Root has no .md equivalent, so fall through to the agent 404.
      expect(response.status).toBe(404);
      expect(response.headers.get('X-Content-Source')).toBe('agent-404');
    });

    it('should fallback to next() when markdown fetch throws error', async () => {
      const req = createMockRequest('/docs/introduction', 'Claude/1.0', 'text/html');
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      global.fetch
        .mockRejectedValueOnce(new Error('Network error')) // markdown fetch throws
        .mockResolvedValueOnce({ ok: true }); // analytics (still fires after catch)

      const response = await middleware(req);
      spy.mockRestore();

      expect(global.fetch).toHaveBeenCalled();
      expect(response.type).toBe('next');
    });
  });

  // Direct .md URL requests (any UA). .md is agent-shaped traffic, so these are
  // served as markdown and tracked as LLM pageviews regardless of User-Agent.
  describe('Direct .md URL handling', () => {
    it('should serve markdown directly for existing .md URLs', async () => {
      const req = createMockRequest(
        '/docs/introduction/existing-doc.md',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'text/html'
      );

      mockFetchByUrl({
        md: { ok: true, text: () => Promise.resolve('# Existing doc') },
      });

      const response = await middleware(req);

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
      expect(response.headers.get('X-Content-Source')).toBe('markdown');
      expect(await response.text()).toContain('# Existing doc');
      // .md requests are treated as agent traffic, so a pageview is tracked.
      expect(global.fetch).toHaveBeenCalledWith(
        'https://neonapi.io/t.js',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should return markdown 404 page for .md URLs that do not exist', async () => {
      const req = createMockRequest(
        '/docs/introduction/foobar.md',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'text/html'
      );

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: { ok: false, status: 404, headers: new Headers() }, // no location → no redirect
      });

      const response = await middleware(req);

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(404);
      expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
      expect(response.headers.get('X-Content-Source')).toBe('md-404');
      expect(await response.text()).toContain('/docs/introduction/foobar.md');
      // .md 404s are also tracked as agent traffic.
      expect(global.fetch).toHaveBeenCalledWith(
        'https://neonapi.io/t.js',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should redirect to the target .md when a moved .md page 404s', async () => {
      const req = createMockRequest(
        '/docs/cli/login.md',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'text/html'
      );

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: { ok: false, status: 308, headers: new Headers({ location: '/docs/cli/auth' }) },
      });

      const response = await middleware(req);

      // Probe fired against the HTML sibling with a neutral (non-agent) UA.
      expect(global.fetch).toHaveBeenCalledWith('https://neon.com/docs/cli/login', {
        headers: { Accept: 'text/html', 'User-Agent': 'neon-md-redirect-probe' },
        redirect: 'manual',
      });
      expect(response.type).toBe('redirect');
      expect(response.url.toString()).toBe('https://neon.com/docs/cli/auth.md');
    });

    it('should append .md to a collapsing subpath redirect target', async () => {
      // e.g. next.config: /docs/use-cases/:path* → /use-cases
      const req = createMockRequest(
        '/docs/use-cases/ai-agents.md',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'text/html'
      );

      mockFetchByUrl({
        md: { ok: false, status: 404 },
        probe: { ok: false, status: 308, headers: new Headers({ location: '/use-cases' }) },
      });

      const response = await middleware(req);

      expect(response.type).toBe('redirect');
      expect(response.url.toString()).toBe('https://neon.com/use-cases.md');
    });

    it('should pass through static .md files under docs/ai/ without rewriting', async () => {
      const req = createMockRequest(
        '/docs/ai/skills/neon-postgres/references/neon-sdk.md',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'text/html'
      );

      const response = await middleware(req);

      const markdownFetchCalls = global.fetch.mock.calls.filter(
        ([url]) => url !== 'https://neonapi.io/t.js'
      );
      expect(markdownFetchCalls).toHaveLength(0);
      expect(response.type).toBe('next');
    });

    it('should pass through static .md files under docs/ai/ for AI agents too', async () => {
      const req = createMockRequest(
        '/docs/ai/skills/neon-postgres/references/neon-sdk.md',
        'Claude/1.0',
        'text/html'
      );

      const response = await middleware(req);

      const markdownFetchCalls = global.fetch.mock.calls.filter(
        ([url]) => url !== 'https://neonapi.io/t.js'
      );
      expect(markdownFetchCalls).toHaveLength(0);
      expect(response.type).toBe('next');
    });

    it.each(['/docs/reference/api/llms.txt', '/docs/reference/api/llms-full.txt'])(
      'should pass through static API reference indexes for AI agents: %s',
      async (path) => {
        const req = createMockRequest(path, 'curl/8.0', '*/*');

        const response = await middleware(req);

        const markdownFetchCalls = global.fetch.mock.calls.filter(
          ([url]) => url !== 'https://neonapi.io/t.js'
        );
        expect(markdownFetchCalls).toHaveLength(0);
        expect(response.type).toBe('next');
      }
    );
  });

  describe('Response headers validation', () => {
    it('should include correct cache headers for markdown responses', async () => {
      const req = createMockRequest('/docs/introduction', 'Claude/1.0', 'text/html');
      mockMarkdownFetch('# Test');

      const response = await middleware(req);

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=86400');
      expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
    });

    it('should set correct content type for markdown', async () => {
      const req = createMockRequest('/docs/introduction', 'Claude/1.0', 'text/html');
      mockMarkdownFetch('# Test');

      const response = await middleware(req);

      expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    });
  });

  describe('AI Agent patterns detection', () => {
    const aiAgents = [
      'ChatGPT-User',
      'OpenAI',
      'Claude',
      'Anthropic',
      'Cursor',
      'Windsurf',
      'Perplexity',
      'GitHub-Copilot',
    ];

    aiAgents.forEach((agent) => {
      it(`should detect ${agent} as AI agent`, async () => {
        const req = createMockRequest('/docs/introduction', agent, 'text/html');
        mockMarkdownFetch('# Test');

        const response = await middleware(req);

        expect(global.fetch).toHaveBeenCalled();
        expect(response).toBeInstanceOf(Response);
      });
    });
  });

  describe('Accept header variations', () => {
    const nonHtmlAccepts = ['text/plain', 'application/json', 'application/xml'];

    nonHtmlAccepts.forEach((accept) => {
      it(`should serve markdown with Accept: ${accept}`, async () => {
        const req = createMockRequest('/docs/introduction', 'Mozilla/5.0', accept);
        mockMarkdownFetch('# Test');

        const response = await middleware(req);

        expect(global.fetch).toHaveBeenCalled();
        expect(response).toBeInstanceOf(Response);
      });
    });

    it('should NOT serve markdown with Accept: text/html', async () => {
      const req = createMockRequest('/docs/introduction', 'Mozilla/5.0', 'text/html');

      const response = await middleware(req);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(response.type).toBe('next');
    });

    it('should NOT serve markdown with Accept: */*', async () => {
      const req = createMockRequest('/docs/introduction', 'Mozilla/5.0', '*/*');

      const response = await middleware(req);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(response.type).toBe('next');
    });
  });
});
