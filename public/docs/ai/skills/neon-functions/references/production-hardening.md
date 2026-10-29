# Production hardening for Neon Functions

A Function has a public HTTPS URL. Authenticate the caller, then pick extra
protection from who actually calls it. This file is the production path; JWT
and trigger parsers stay in [SKILL.md](../SKILL.md) and
[function-triggers.md](function-triggers.md).

https://neon.com/docs/compute/functions/authentication.md

## Choose the caller shape

Pick a row before writing code. Mixed routes: apply the matching row per
path, not one middleware for the whole Function.

| Caller                                                                                                           | What to do                                                                                                                                                                                                                                        | Do not                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Trusted app server (Vercel/Netlify route, server action, queue worker) that finishes within that host's duration | The server calls the Function. Browser never sees the Function URL or the origin secret. Function returns 401 before any work.                                                                                                                    | Put the secret in client code. Proxy a long agent, WebSocket, or SSE stream through the app host without checking that host's duration. |
| Function Triggers only                                                                                           | `parseTriggerDelivery` (both types). Keep this path outside JWT and `X-Secret` middleware.                                                                                                                                                        | Require a user JWT or `X-Secret` on the trigger path. Invent `x-neon-invocation-id`. Treat `invocation_id` as a secret.                 |
| Public consumers (Open API, MCP, third-party HTTP)                                                               | A Cloudflare Worker Custom Domain you own, **not** registered as a Neon custom domain, proxies to the native invocation URL, sets `X-Secret`, and rate-limits at the edge. Function requires `X-Secret`, then the route's existing consumer auth. | Orange-cloud a Neon-registered custom-domain CNAME. Assume the native URL is closed. Put a human challenge in front of MCP.             |

Browser-direct JWT agents stay on the client-direct path in SKILL.md. They
are not the trusted-app-server row.

## Native URL

The native invocation URL stays reachable after you add a custom domain or a
Worker. Application checks reject work; the request still occupies a Function
invocation until the handler returns.

Neon also enforces a default account-wide cap of 100 concurrent invocations
(`429`, body `per-account concurrency limit reached`, `Retry-After` in
seconds). That is not per-client DDoS protection.
https://neon.com/docs/compute/functions/reference/runtime-limits.md

Functions docs do not document a customer-configurable WAF, a switch to
disable the native URL, or a Functions ingress IP allowlist. Do not invent
those.

## Trusted app server

Keep the Function URL and origin secret in **server** env on the app host and
in Function `env`. Authenticate the app route first. Then `fetch` the
Function.

Headers:

```text
X-Secret: <server-only origin secret>
Authorization: <existing consumer credential, unchanged>
```

`X-Secret` is application-defined. Use it for the server hop when
`Authorization` already carries a user or consumer bearer token.

If the Function currently only checks `Authorization: Bearer <API_KEY>` and
nothing forwards a user token, keep that check. Do not migrate that header.

Compare `X-Secret` before parsing the body or touching Postgres. Missing
`ORIGIN_SECRET` fails at startup. Do not add CORS if browsers must not call
this Function.

```typescript
import { timingSafeEqual } from "node:crypto";

const originSecret = process.env.ORIGIN_SECRET;
if (!originSecret) throw new Error("ORIGIN_SECRET is required");
const expected = Buffer.from(originSecret);

function hasOriginSecret(request: Request): boolean {
  const header = request.headers.get("x-secret");
  if (header === null) return false;
  const provided = Buffer.from(header);
  if (provided.byteLength !== expected.byteLength) return false;
  return timingSafeEqual(provided, expected);
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (!hasOriginSecret(request)) {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ ok: true });
  },
};
```

Declare `ORIGIN_SECRET` in `neon.ts` `env` and on the app host.

Buffer the incoming body on the app-server `fetch`. Node `fetch` throws
`duplex option is required when sending a body` if you pass a streamed
`request.body`. `duplex: "half"` is Node-only; this hop is short, so
buffer instead. `redirect: "manual"` keeps `X-Secret` from following a
cross-origin redirect.

`NEON_FUNCTION_URL` is `invocation_url` from `neon functions get`. It ends
with `/`. This example calls that root. For a Function path, concatenate
onto that slash (`new URL("orders?limit=2", functionUrl)`). Do not copy the
app request's host or pathname onto the Function; a Next.js `/api/...` route
is not the Function path.

```typescript
const functionUrl = process.env.NEON_FUNCTION_URL;
const originSecret = process.env.ORIGIN_SECRET;
if (!functionUrl || !originSecret) {
  throw new Error("NEON_FUNCTION_URL and ORIGIN_SECRET are required");
}

const headers = new Headers({ "x-secret": originSecret });
const contentType = request.headers.get("content-type");
if (contentType) headers.set("content-type", contentType);
const authorization = request.headers.get("authorization");
if (authorization) headers.set("authorization", authorization);

return fetch(functionUrl, {
  method: request.method,
  headers,
  body: request.body ? await request.arrayBuffer() : undefined,
  redirect: "manual",
});
```

## Function Triggers only

Use the parsers in [function-triggers.md](function-triggers.md).
`parseTriggerDelivery` covers `schedule` and `storage_object_created`.
Hono `parseTrigger` and `parseTriggerInvocation` are schedule-only.

Neon POSTs to the native URL and does not send `X-Secret` or a user JWT. A
trigger path that requires those credentials drops real deliveries.

`invocation_id` is a correlation id. Presence of `x-neon-trigger-invocation-id`
after Neon strips client `x-neon-*` headers is the provenance check; matching
the body is consistency. https://neon.com/docs/compute/functions/triggers/overview.md

Local `neon dev` can send that header to simulate a tick. On the deployed
Function a client-supplied `x-neon-*` header is stripped.

## Public consumers through a Worker

Consumers call a hostname you control. Volumetric filtering happens there.
The Function still authenticates.

DNS:

- A Neon Function custom-domain CNAME must be DNS-only (grey cloud). A proxied
  (orange-cloud) record blocks Neon domain validation.
  https://neon.com/docs/compute/functions/custom-domains.md
- Attach a [Cloudflare Worker Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
  that is **not** registered with Neon. The Worker fetches the **native**
  invocation URL.

Worker:

- Preserve method, pathname, query, body, and consumer `Authorization`.
- Set `X-Secret`. Do not use it as the consumer credential.
- Build the upstream URL from a fixed origin. Assign `pathname` and `search`
  separately so a request path cannot change the authority.
- Apply Cloudflare DDoS / WAF / rate-limiting rules on that Worker hostname.
  The forwarding snippet does not configure those rules.
- Disable the Worker's `workers.dev` route and Preview URLs. Hostname-scoped
  rules do not apply to those endpoints, and they still run this forwarding
  code. Inventory clients on those URLs first.
  https://developers.cloudflare.com/workers/configuration/routing/workers-dev.md
  Dashboard: Worker → Settings → Domains & Routes. A later Wrangler deploy
  without `workers_dev: false` turns `workers.dev` back on.
- Do not buffer a streaming body. Do not add a browser challenge MCP or API
  clients cannot pass.

Wrangler:

```jsonc
{
  "workers_dev": false,
  "preview_urls": false
}
```

```typescript
const FUNCTION_ORIGIN = "https://<invocation-host>"; // neon functions get

export default {
  async fetch(
    request: Request,
    env: { ORIGIN_SECRET: string },
  ): Promise<Response> {
    const incoming = new URL(request.url);
    const upstream = new URL(FUNCTION_ORIGIN);
    upstream.pathname = incoming.pathname;
    upstream.search = incoming.search;

    const headers = new Headers(request.headers);
    headers.set("x-secret", env.ORIGIN_SECRET);
    headers.delete("host");

    return fetch(upstream, {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });
  },
};
```

Function: require `X-Secret` first (same helper as above), then apply **that
route's existing** consumer authentication. Browser preflight, OAuth
discovery, and intentionally public routes keep their current behavior. An
origin secret is not a user API key.

Requiring `X-Secret` on the native URL is a migration. Move legitimate
native-URL clients to the Worker first. Anyone who still hits the native URL
without the secret gets 401 after the request has reached Function compute.

HTTP-triggered Workers have no documented hard wall-clock duration while the
client stays connected. Still verify WebSocket, SSE, and long agent streams
against the chosen Worker before using this row for those workloads. If the
edge cannot hold the stream, keep client-direct JWT.

MCP: after switching consumers to the Worker hostname, confirm advertised
resource URLs, token audiences, existing client registrations, and one live
session as well as a fresh authorization. https://developers.cloudflare.com/workers/platform/limits/

## Limit authenticated application work

Edge rate limiting drops traffic before Neon. A limiter **inside** the
Function runs after the request arrived. Use it to cap expensive work for a
**verified** principal (user id, org id, API-key hash). Never use a
caller-supplied id. A global budget can cap total capacity; one caller can
consume it for everyone.

Request-rate limits do not cap simultaneous long-running work. Bound in-flight
expensive operations separately, in a shared store, not in module-scope
counters (those are per-isolate and vanish on eviction).

A query to Postgres on every anonymous request adds database work to a flood.
Postgres can hold per-principal counters at low-to-moderate authenticated
volume when you already have it; measure before relying on it. Prefer Redis
or edge limits when a database round trip per request is too expensive.

Optional Upstash quota after credential checks, before expensive work.
`60` per minute and `timeout: 1_000` are example policy. `RATE_LIMIT_PREFIX`
is the application + environment + quota name; `NEON_BRANCH` (a branch
**name**) is appended so branches do not share counters.

`Redis.fromEnv()` reads `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
Upstash `reset` is milliseconds since epoch. Upstash can report a timeout as
a successful `limit()` result; check `reason` before `success`. Await the
admission decision; pass `pending` to `waitUntil` so background writes do not
delay the response.

```typescript
import { waitUntil } from "@neon/functions";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const namespace = process.env.RATE_LIMIT_PREFIX;
if (!namespace) throw new Error("RATE_LIMIT_PREFIX is required");

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: `${namespace}:${process.env.NEON_BRANCH ?? "local"}`,
  timeout: 1_000,
  analytics: false,
});

export async function checkQuota(
  authenticatedPrincipalId: string,
): Promise<Response | null> {
  let result: Awaited<ReturnType<typeof limiter.limit>>;
  try {
    result = await limiter.limit(authenticatedPrincipalId);
  } catch (error) {
    console.error("Rate-limit store failed", error);
    return new Response("Rate limiter unavailable", {
      status: 503,
      headers: { "Retry-After": "1" },
    });
  }

  waitUntil(result.pending);

  if (result.reason === "timeout") {
    console.error("Rate-limit store timed out");
    return new Response("Rate limiter unavailable", {
      status: 503,
      headers: { "Retry-After": "1" },
    });
  }

  if (result.success) return null;

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000),
  );
  return new Response("Too Many Requests", {
    status: 429,
    headers: {
      "Retry-After": String(retryAfterSeconds),
      "RateLimit-Limit": String(result.limit),
      "RateLimit-Remaining": String(result.remaining),
      "RateLimit-Reset": String(retryAfterSeconds),
    },
  });
}
```

Preserve CORS headers on these responses when the route already sets them.
Do not relabel limiter failures as `401` or as quota exhaustion. `Retry-After`
is required on `429`. `RateLimit-*` is optional metadata; `RateLimit-Reset`
here is seconds until the window renews.

Do not rate-limit in the Function by `X-Forwarded-For`. That header is not a
documented trustworthy client-IP on Functions. IP limits belong at the edge.

## Preserve existing clients

- Direct-client JWT agents keep their token, JWKS, issuer, and audience.
  Do not require `X-Secret` on those routes.
- CORS still has to succeed for legitimate browser origins, including on
  401/429. CORS is not authentication.
- Inventory production and preview origins before tightening an allowlist.
- WebSocket and SSE handshake, heartbeat, and reconnect stay as documented
  in SKILL.md.
- MCP OAuth discovery, tokens, methods, and streaming stay as documented in
  [mcp.md](mcp.md). Authenticate before the transport.
- Adding a Worker does not by itself change the API's consumer credentials.
- Stored rows stay authorized by the verified identity, not by a quota key.

## Reject these

- Orange-cloud proxying a **Neon-registered** custom-domain CNAME.
- Shipping a server origin secret to the browser.
- Putting a long stream behind a host or Worker whose duration or transport
  cannot hold it.
- Treating header/body equality as trigger provenance outside Neon's edge.
- In-memory counters as a cross-isolate quota.
- A Postgres lookup on every anonymous request as DDoS protection.
- Treating a native-URL `401` as traffic blocked before Function compute.
