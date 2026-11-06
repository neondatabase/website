import { isAIAgentRequest } from './ai-agent-detection';

const BEACON_URL = 'https://neonapi.io/t.js';
const BEACON_TIMEOUT_MS = 5000;

// Fixed labels for diagnostics only. Keep the existing traffic classifier intact.
function agentFamily(userAgent) {
  const ua = userAgent.toLowerCase();
  const families = [
    'chatgpt-user',
    'oai-searchbot',
    'gptbot',
    'claude-user',
    'claude-searchbot',
    'claudebot',
    'perplexity',
    'cursor',
    'windsurf',
    'copilot',
    'curl',
    'axios',
    'got',
  ];
  return families.find((family) => ua.includes(family)) || 'other';
}

async function sendPageview(req, context, { is404, branch, debug }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BEACON_TIMEOUT_MS);
  const startedAt = Date.now();
  let result;

  try {
    // Preserve the Zaraz payload and identity cookies; only add the correlation ID.
    const payload = {
      name: 'Pageview',
      data: { llm_agent: true, llm_404: is404, llm_request_id: context.request_id },
      zarazData: {
        c: req.headers.get('cookie') || '',
        l: req.nextUrl?.href ?? req.url,
        r: req.headers.get('referer') || '',
      },
      system: { device: { ip: '192.168.0.1' } },
    };

    const response = await fetch(BEACON_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `LLMAGENT: ${req.headers.get('user-agent') || ''}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    result = {
      outcome: response.ok ? 'accepted' : 'http_error',
      http_status: response.status,
    };
    // The collector's response body isn't used. Release it without changing
    // whether the HTTP request was accepted.
    await response.body?.cancel().catch(() => {});
  } catch (_error) {
    // Error messages can contain URLs or other request data. Log a fixed category.
    result = { outcome: controller.signal.aborted ? 'timeout' : 'network_error' };
  } finally {
    clearTimeout(timer);
  }

  const log = {
    type: 'llm_beacon',
    timestamp: new Date().toISOString(),
    ...context,
    branch,
    llm_404: is404,
    ...result,
    duration_ms: Date.now() - startedAt,
  };
  if (result.outcome !== 'accepted') {
    console.warn(JSON.stringify(log));
  } else if (debug) {
    console.info(JSON.stringify(log));
  }
  // Always resolve: analytics failures must not change the page response.
  return result;
}

// One tracker per incoming request, shared by every proxy branch. The promise
// must be registered with event.waitUntil() (proxy) or after() (route handlers).
export function createLLMAnalytics(req) {
  const debug = process.env.LLM_ANALYTICS_DEBUG === 'true';
  const context = {
    // Vercel supplies this ID to both the proxy and a rewritten route handler.
    request_id: req.headers.get('x-vercel-id') || crypto.randomUUID(),
    path: new URL(req.nextUrl?.href ?? req.url).pathname,
    method: req.method || 'GET',
    agent_family: agentFamily(req.headers.get('user-agent') || ''),
    agent_detected: isAIAgentRequest(req),
    deployment_sha: process.env.VERCEL_GIT_COMMIT_SHA || null,
  };
  let beacon = null;
  let beaconBranch = null;

  return {
    track({ is404 = false, branch = 'unspecified' } = {}) {
      // A failed markdown read can fall through into another branch. Never send
      // a second pageview for the same incoming request.
      if (!beacon) {
        beaconBranch = branch;
        beacon = sendPageview(req, context, { is404, branch, debug });
      }
      return beacon;
    },
    get beacon() {
      return beacon;
    },
    logResponse(response) {
      if (!debug) return;
      const passThrough = response.headers.get('x-middleware-next') === '1';
      const rewrite = response.headers.has('x-middleware-rewrite');
      const contentSource = response.headers.get('x-content-source');
      const branch = passThrough
        ? 'pass-through'
        : rewrite
          ? 'rewrite'
          : response.headers.has('location')
            ? 'redirect'
            : contentSource || 'response';

      console.info(
        JSON.stringify({
          type: 'llm_request',
          timestamp: new Date().toISOString(),
          ...context,
          branch,
          // next()/rewrite() do not know the downstream response's final status.
          proxy_status: passThrough || rewrite ? null : response.status,
          content_source: contentSource,
          beacon_scheduled: beacon !== null,
          beacon_branch: beaconBranch,
        })
      );
    },
  };
}

// For callers that only need a beacon, including plain Web Requests.
export function trackLLMPageview(req, options) {
  return createLLMAnalytics(req).track(options);
}
