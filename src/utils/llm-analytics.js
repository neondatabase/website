// Fire-and-forget LLM/agent pageview beacon to the Zaraz-compatible endpoint.
//
// Shared by the proxy (src/proxy.js, NextRequest) and by route handlers
// (Web Request). NextRequest exposes `nextUrl.href`; a plain Request only has
// `url`, so resolve the URL from whichever is present.
//
// Returns the (already-caught) beacon promise. Edge middleware callers ignore
// it — the runtime keeps them alive long enough for the request. A Node route
// handler can be frozen right after it returns its response, so those callers
// pass the returned promise to `after()` (next/server) to guarantee delivery.
export function trackLLMPageview(req, { is404 = false } = {}) {
  const url = req.nextUrl?.href ?? req.url;
  const referrer = req.headers.get('referer') || '';
  const cookies = req.headers.get('cookie') || '';
  const userAgent = req.headers.get('user-agent') || '';

  // Match the payload shape the Zaraz JS tag sends to this endpoint
  const payload = {
    name: 'Pageview',
    data: { llm_agent: true, llm_404: is404 },
    zarazData: {
      c: cookies, // raw cookie string — Zaraz extracts ajs_anonymous_id / ajs_user_id from here
      l: url,
      r: referrer,
    },
    system: {
      device: {
        ip: '192.168.0.1',
      },
    },
  };

  // Do not await here — that would block the response. Callers that need
  // delivery guaranteed (Node route handlers) defer the returned promise with
  // `after()`; middleware callers simply drop it.
  return fetch('https://neonapi.io/t.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': `LLMAGENT: ${userAgent}` },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
