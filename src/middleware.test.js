import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock the modules - must be at the top before imports
vi.mock('next/server', () => ({
  NextResponse: class MockNextResponse extends Response {
    constructor(body, init) {
      super(body, init);
      this.type = 'response';
    }

    static next() {
      return { type: 'next' };
    }

    static redirect(url) {
      return { type: 'redirect', url };
    }
  },
}));

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('app/actions', () => ({
  checkCookie: vi.fn(() => Promise.resolve(false)),
  getReferer: vi.fn(() => Promise.resolve('')),
}));

// Mock fetch globally
global.fetch = vi.fn();

// Now import middleware after all mocks are set up
let middleware;

describe('Middleware - AI Agent Integration Tests', () => {
  beforeAll(async () => {
    const middlewareModule = await import('./middleware.js');
    middleware = middlewareModule.middleware;
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to create mock request
  const createMockRequest = (pathname, userAgent = '', accept = '') => ({
    nextUrl: {
      pathname,
    },
    url: `https://neon.tech${pathname}`,
    headers: new Map([
      ['user-agent', userAgent],
      ['accept', accept],
    ]),
  });

  // Helper to mock successful GitHub markdown fetch
  const mockMarkdownFetch = (content = '# Test Markdown') => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(content),
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
        expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
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

  describe('Excluded routes - should always return HTML', () => {
    const excludedCases = [
      { name: 'Index /guides', path: '/guides', reason: 'index page without slug' },
      { name: 'Index /branching', path: '/branching', reason: 'index page without slug' },
      {
        name: 'Changelog',
        path: '/docs/changelog',
        reason: 'special changelog page',
      },
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

        expect(global.fetch).not.toHaveBeenCalled();
        expect(response.type).toBe('next');
      });

      it(`should return HTML for ${name} (${path}) with Accept: text/plain - ${reason}`, async () => {
        const req = createMockRequest(path, 'Mozilla/5.0', 'text/plain');

        const response = await middleware(req);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(response.type).toBe('next');
      });
    });
  });

  describe('Error handling', () => {
    it('should fallback to next() when markdown fetch fails with 404', async () => {
      const req = createMockRequest('/docs/non-existent', 'Claude/1.0', 'text/html');

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const response = await middleware(req);

      expect(global.fetch).toHaveBeenCalled();
      expect(response.type).toBe('next');
    });

    it('should fallback to next() when markdown fetch throws error', async () => {
      const req = createMockRequest('/docs/introduction', 'Claude/1.0', 'text/html');

      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await middleware(req);

      expect(global.fetch).toHaveBeenCalled();
      expect(response.type).toBe('next');
    });
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

      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
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
