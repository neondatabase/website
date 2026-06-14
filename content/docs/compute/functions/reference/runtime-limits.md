---
title: Runtime limits
subtitle: Hard constraints for Neon Functions.
summary: >-
  Hard limits for Neon Functions: lifecycle and eviction behavior, 15-minute
  timeouts, slug constraints, and the Node.js 24 runtime. Functions are
  long-running but still serverless.
enableTableOfContents: true
updatedOn: '2026-06-14T04:15:20.563Z'
---

<PrivatePreviewEnquire/>

Neon Functions run on Node.js 24 in isolated microVMs.

## Lifecycle

Neon Functions are long-running. You can host WebSocket servers, SSE endpoints, and agents that stream responses over HTTP without hitting a short execution timeout. They're still serverless: if your function has no active connections, the platform shuts it down.

The platform may also evict and restart your function for operational reasons. Active functions can run for hours before eviction occurs. Treat eviction like a process restart: WebSocket and SSE clients need to reconnect when the connection drops.

The platform sends `SIGINT` before evicting to allow graceful shutdown. Register a handler to close open connections and flush in-flight work before the process exits:

```ts
// pool is your module-scope pg.Pool
process.on('SIGINT', () => {
  pool.end().then(() => process.exit(0));
});
```

Without it, open connections are abandoned on eviction and remain open until they time out.

## Timeouts

**Time to first byte: 15 minutes.** Your handler must begin returning a response within 15 minutes of receiving a request. This is a request-response runtime, not a background task runner. The limit prevents runaway functions that hold resources indefinitely with no way to cancel them. In practice most handlers complete in seconds. The 15-minute limit gives agent workloads like image or video generation enough time to finish.

**Heartbeat: 15 minutes.** Active WebSocket connections and HTTP streams stay open as long as data flows. The timeout only fires when the connection goes silent. Send at least one byte every 15 minutes to keep a quiet stream alive.

**`waitUntil`: 15 minutes.** Work registered with `waitUntil` continues after the response is sent. It's for cleanup: analytics writes, audit logs, short follow-up calls. It's not a background job runner. Use a dedicated system for work that needs its own lifecycle or cancellation.

```ts
import { Hono } from 'hono';
import { waitUntil } from '@neondatabase/functions/v1';

const app = new Hono();

app.post('/event', async (c) => {
  const wait = waitUntil(); // returns the waitUntil function for this invocation
  wait(writeAnalytics(c.req.raw)); // your async follow-up work
  return c.json({ ok: true });
});

export default app;
```

`waitUntil()` returns a function for the current invocation; pass that function a promise and the invocation stays alive until the promise settles, up to the 15-minute cap. The registered work is the same shape as `waitUntil` on [Vercel](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package#waituntil) and Cloudflare Workers, and it's safe to call in `neonctl dev`.

## Concurrency

Each isolate is a Node.js process. Requests are interleaved on the event loop, so multiple requests can be in flight on the same isolate concurrently. The platform adds isolates on demand under load: requests that can't be placed on an existing isolate are routed to a newly booted one or queued briefly.

Because each isolate is its own process and handles concurrent requests, module-scope state behaves as follows:

- **Shared within an isolate**: module-scope objects (a `pg` pool, an in-memory cache) are shared across all requests on the same isolate. Create connection pools once at module scope and reuse them.
- **Not shared across isolates**: each isolate has its own copy of module state. Keep `max` small on `pg` pools (for example, 5) — effective connection count is `max` × the number of live isolates. Module-scope initialization (seeding, migrations) runs once per isolate; make it idempotent or serialize with a Postgres advisory lock.
- **Lost on eviction**: in-memory state disappears when an isolate is evicted. Persist anything that matters in Postgres.

## Slug constraints

Slugs must match `^[a-z0-9]{1,20}$` and are immutable after the first deployment. See [Slugs](/docs/compute/functions/deploy#slugs) for the full rules.

## Runtime

| Property    | Value                                                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime     | Node.js 24                                                                                                                                      |
| Isolation   | microVM per isolate                                                                                                                             |
| Concurrency | Multiple requests in flight per isolate (interleaved on the event loop), scaling out with additional isolates. See [Concurrency](#concurrency). |
| Memory      | 2048 MiB (fixed during the private preview, not configurable)                                                                                   |

## Environment variables

See [Environment variables](/docs/compute/functions/environment-variables#constraints) for limits on variable count, total size, and the reserved `NEON_` prefix.

<NeedHelp/>
