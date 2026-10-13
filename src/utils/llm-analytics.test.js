// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createLLMAnalytics, trackLLMPageview } from './llm-analytics';

const request = () =>
  new Request('https://neon.com/docs/introduction?token=query-secret', {
    headers: {
      'user-agent': 'ChatGPT-User/1.0 raw-user-agent-secret',
      'x-vercel-id': 'fra1::test-request',
      cookie: 'ajs_anonymous_id=cookie-secret',
      referer: 'https://example.com/?token=referrer-secret',
    },
  });

describe('LLM analytics delivery', () => {
  beforeEach(() => {
    vi.stubEnv('LLM_ANALYTICS_DEBUG', 'false');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 200 })));
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('preserves the payload and adds the Vercel request ID for correlation', async () => {
    await expect(trackLLMPageview(request(), { is404: true })).resolves.toEqual({
      outcome: 'accepted',
      http_status: 200,
    });
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('https://neonapi.io/t.js');
    expect(options.method).toBe('POST');
    expect(options.headers['User-Agent']).toBe('LLMAGENT: ChatGPT-User/1.0 raw-user-agent-secret');
    expect(JSON.parse(options.body)).toEqual({
      name: 'Pageview',
      data: { llm_agent: true, llm_404: true, llm_request_id: 'fra1::test-request' },
      zarazData: {
        c: 'ajs_anonymous_id=cookie-secret',
        l: 'https://neon.com/docs/introduction?token=query-secret',
        r: 'https://example.com/?token=referrer-secret',
      },
      system: { device: { ip: '192.168.0.1' } },
    });
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('generates a distinct ID when Vercel headers are unavailable', async () => {
    const req = new Request('https://neon.com/docs/introduction');
    await trackLLMPageview(req);
    await trackLLMPageview(req);
    const ids = fetch.mock.calls.map(([, options]) => JSON.parse(options.body).data.llm_request_id);
    expect(ids[0]).toMatch(/^[0-9a-f-]{36}$/);
    expect(ids[1]).not.toBe(ids[0]);
  });

  it.each([400, 429, 503])('reports HTTP %s even with diagnostics disabled', async (status) => {
    fetch.mockResolvedValue(new Response('', { status }));
    await expect(trackLLMPageview(request())).resolves.toEqual({
      outcome: 'http_error',
      http_status: status,
    });
    expect(JSON.parse(console.warn.mock.calls[0][0])).toMatchObject({
      type: 'llm_beacon',
      request_id: 'fra1::test-request',
      outcome: 'http_error',
      http_status: status,
    });
    expect(fetch).toHaveBeenCalledTimes(1); // No automatic retries or duplicate events.
  });

  it('resolves network failures and does not log the exception message', async () => {
    fetch.mockRejectedValue(new Error('Network failed: exception-secret'));
    await expect(trackLLMPageview(request())).resolves.toEqual({ outcome: 'network_error' });
    const log = console.warn.mock.calls[0][0];
    expect(log).not.toContain('exception-secret');
    expect(log).not.toContain('query-secret');
    expect(log).not.toContain('cookie-secret');
    expect(log).not.toContain('raw-user-agent-secret');
    expect(log).not.toContain('referrer-secret');
  });

  it('aborts a stalled request after five seconds and resolves the timeout', async () => {
    vi.useFakeTimers();
    fetch.mockImplementation(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new Error('Aborted')));
        })
    );
    const pending = trackLLMPageview(request());
    await vi.advanceTimersByTimeAsync(4999);
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await expect(pending).resolves.toEqual({ outcome: 'timeout' });
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    expect(JSON.parse(console.warn.mock.calls[0][0]).outcome).toBe('timeout');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the timeout after a completed beacon', async () => {
    vi.useFakeTimers();
    await trackLLMPageview(request());
    expect(vi.getTimerCount()).toBe(0);
  });

  it('sends only one beacon when handling falls through into a second branch', async () => {
    const analytics = createLLMAnalytics(request());
    const first = analytics.track({ branch: 'agent-markdown' });
    const second = analytics.track({ is404: true, branch: 'agent-fallback' });
    expect(second).toBe(first);
    await second;
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('correlates request and accepted-beacon diagnostics without raw request data', async () => {
    vi.stubEnv('LLM_ANALYTICS_DEBUG', 'true');
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', 'deployment-sha');
    const analytics = createLLMAnalytics(request());
    await analytics.track({ branch: 'agent-markdown' });
    analytics.logResponse(new Response('# Docs', { headers: { 'x-content-source': 'markdown' } }));
    const logs = console.info.mock.calls.map(([line]) => JSON.parse(line));
    expect(logs).toEqual([
      expect.objectContaining({
        type: 'llm_beacon',
        outcome: 'accepted',
        request_id: 'fra1::test-request',
      }),
      expect.objectContaining({
        type: 'llm_request',
        request_id: 'fra1::test-request',
        path: '/docs/introduction',
        agent_family: 'chatgpt-user',
        agent_detected: true,
        deployment_sha: 'deployment-sha',
        branch: 'markdown',
        proxy_status: 200,
        beacon_branch: 'agent-markdown',
        beacon_scheduled: true,
      }),
    ]);
    for (const secret of [
      'query-secret',
      'cookie-secret',
      'raw-user-agent-secret',
      'referrer-secret',
    ]) {
      expect(JSON.stringify(logs)).not.toContain(secret);
    }
  });

  it.each(['x-middleware-next', 'x-middleware-rewrite'])(
    'does not invent a final response status for %s',
    (header) => {
      vi.stubEnv('LLM_ANALYTICS_DEBUG', 'true');
      const analytics = createLLMAnalytics(request());
      analytics.logResponse(new Response(null, { headers: { [header]: '1' } }));
      expect(JSON.parse(console.info.mock.calls[0][0])).toMatchObject({
        proxy_status: null,
        beacon_scheduled: false,
      });
      expect(fetch).not.toHaveBeenCalled();
    }
  );
});
