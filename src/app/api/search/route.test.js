// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OPTIONS, POST } from './route';

const CONSOLE_ORIGIN = 'https://console.neon.tech';
const ALLOWED_ORIGINS = [
  CONSOLE_ORIGIN,
  'https://dev.localhost:5173',
  'http://localhost:5173',
  'http://localhost:30000',
];
const SEARCH_BODY = { query: 'connection timeout', categories: ['docs'], limit: 3 };
const SEARCH_HIT = {
  url: 'https://neon.com/docs/connect/connection-errors',
  title: 'Connection errors',
  slug: 'connect/connection-errors',
  collection: 'docs',
  category: 'docs',
  breadcrumb: ['Docs', 'Connect'],
  heading: 'Connection timeout',
  excerpt: 'Troubleshoot connection errors.',
  score: 1,
};

function searchRequest(origin, body = JSON.stringify(SEARCH_BODY)) {
  return new Request('https://neon.com/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) },
    body,
  });
}

function preflightRequest(origin) {
  return new Request('https://neon.com/api/search', {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
}

describe('/api/search CORS', () => {
  beforeEach(() => {
    vi.stubEnv('NEON_AGENT_SITE_SEARCH_URL', 'https://search.example.com/search');
    // Keep route behavior real while avoiding a dependency on the live search service.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ hits: [SEARCH_HIT] }), {
          headers: { 'Server-Timing': 'search;dur=12' },
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each(ALLOWED_ORIGINS)('allows a JSON POST preflight from %s', async (origin) => {
    vi.stubEnv('NEON_AGENT_SITE_SEARCH_URL', '');
    const response = OPTIONS(preflightRequest(origin));

    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
    expect(response.headers.get('Allow')).toBe('OPTIONS, POST');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST');
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    expect(response.headers.get('Access-Control-Allow-Credentials')).toBeNull();
    expect(response.headers.get('Vary')).toBe('Origin');
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(ALLOWED_ORIGINS)('returns search results with CORS for %s', async (origin) => {
    const response = await POST(searchRequest(origin));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ hits: [SEARCH_HIT] });
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(response.headers.get('Server-Timing')).toMatch(/^search;dur=12, proxy;dur=/);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(response.headers.get('Access-Control-Allow-Credentials')).toBeNull();
    expect(response.headers.get('Vary')).toBe('Origin');
  });

  it.each([
    'https://example.com',
    'https://console.neon.tech.example.com',
    'http://console.neon.tech',
    'http://localhost:5174',
    'null',
  ])('does not grant cross-origin access to %s', async (origin) => {
    for (const response of [OPTIONS(preflightRequest(origin)), await POST(searchRequest(origin))]) {
      expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
      expect(response.headers.get('Vary')).toBe('Origin');
    }
  });

  it.each([undefined, 'https://neon.com'])('preserves search for origin %s', async (origin) => {
    const response = await POST(searchRequest(origin));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ hits: [SEARCH_HIT] });
  });

  it('includes CORS on pinned results without calling the search service', async () => {
    const response = await POST(
      searchRequest(CONSOLE_ORIGIN, JSON.stringify({ query: 'changelog', limit: 1 }))
    );

    expect(response.status).toBe(200);
    expect((await response.json()).hits.map((hit) => hit.url)).toEqual([
      'https://neon.com/docs/changelog',
    ]);
    expect(response.headers.get('Server-Timing')).toBe('pinned;dur=0');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(CONSOLE_ORIGIN);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['invalid JSON', '{', 400, 'Invalid JSON body'],
    ['invalid query', '{"query":""}', 400, 'query is required'],
    ['missing configuration', JSON.stringify(SEARCH_BODY), 503, 'Search is not configured'],
  ])('includes CORS on %s errors', async (scenario, body, status, error) => {
    if (scenario === 'missing configuration') vi.stubEnv('NEON_AGENT_SITE_SEARCH_URL', '');

    const response = await POST(searchRequest(CONSOLE_ORIGIN, body));

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ error });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(CONSOLE_ORIGIN);
    expect(response.headers.get('Vary')).toBe('Origin');
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(['network failure', 'upstream error', 'invalid JSON', 'invalid hits'])(
    'includes CORS for %s',
    async (scenario) => {
      if (scenario === 'network failure') fetch.mockRejectedValueOnce(new Error('Unavailable'));
      if (scenario === 'upstream error') {
        fetch.mockResolvedValueOnce(new Response(null, { status: 500 }));
      }
      if (scenario === 'invalid JSON') fetch.mockResolvedValueOnce(new Response('{'));
      if (scenario === 'invalid hits') {
        fetch.mockResolvedValueOnce(new Response(JSON.stringify({ hits: [{}] })));
      }

      const response = await POST(searchRequest(CONSOLE_ORIGIN));

      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({ error: 'Search failed.' });
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(CONSOLE_ORIGIN);
      expect(response.headers.get('Vary')).toBe('Origin');
    }
  );
});
