---
title: Neon Functions runtime limits
subtitle: Hard constraints for Neon Functions.
summary: >-
  Hard limits for Neon Functions: lifecycle and eviction behavior, 15-minute
  timeouts, slug constraints, and the Node.js 24 runtime. Functions are
  long-running but still serverless.
enableTableOfContents: true
updatedOn: '2026-06-24T23:12:20.545Z'
---

<PrivatePreviewEnquire/>

Neon Functions run on Node.js 24.

## Lifecycle

Neon Functions are long-running: you can host WebSocket servers, SSE endpoints, and agents that stream over HTTP without hitting a short execution timeout. They're still serverless. The platform shuts a function down when it's idle, with no open connections or pending `waitUntil` work, and can also evict and restart it for operational reasons. Treat eviction like a process restart: clients should reconnect when a connection drops.

When the platform stops a function, it sends `SIGINT`. If the process is still running 5 seconds later, the platform forcibly stops the function. Handle `SIGINT` with `process.on('SIGINT', ...)` to close connections and flush in-flight work within that window. When the process exits, the OS closes its sockets, so dropped connections are usually detected without extra handling.

## Timeouts

**Time to first byte: 15 minutes.** Your handler must begin returning a response within 15 minutes of receiving a request. The limit prevents runaway functions that hold resources indefinitely with no way to cancel them. In practice most handlers complete in seconds. The 15-minute limit gives agent workloads like image or video generation enough time to finish.

**Heartbeat: 15 minutes.** Active WebSocket connections and HTTP streams stay open as long as data flows. The timeout only fires when the connection goes silent. Send at least one byte every 15 minutes to keep a quiet stream alive.

**`waitUntil`: 15 minutes.** Work registered with `waitUntil` continues after the response is sent. It's for short post-response work: analytics writes, audit logs, webhook fan-outs, agent callbacks, and other short follow-up calls. It's not a background job runner. Use a dedicated system for work that needs its own lifecycle or cancellation.

```ts
import { Hono } from 'hono';
import { waitUntil } from '@neondatabase/functions';

const app = new Hono();

app.post('/event', async (c) => {
  waitUntil(writeAnalytics(c.req.raw)); // writeAnalytics returns Promise
  return c.json({ ok: true });
});

export default app;
```

Pass `waitUntil` a promise and the invocation stays alive until the promise settles, up to the 15-minute cap. The API follows the same shape as `waitUntil` on [Vercel](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package#waituntil) and other serverless platforms. Off the Neon runtime (local dev, tests) it's a no-op: the promise still runs but isn't tracked, so the same code is safe to call in `neonctl dev`.

## Concurrency

Each isolate is a Node.js process. Because work runs on the event loop, a single isolate can handle several requests at once, interleaving them. Under load the platform starts more isolates on demand: a request that doesn't fit on an existing isolate goes to a freshly booted one or waits briefly in a queue.

Because each isolate is its own process and handles concurrent requests, module-scope state behaves as follows:

- **Shared within an isolate**: module-scope objects (a `pg` pool, an in-memory cache) are shared across all requests on the same isolate. Create connection pools once at module scope and reuse them.
- **Not shared across isolates**: every isolate holds its own module state. Keep `max` small on `pg` pools (for example, 5). The effective connection count is `max` × the number of live isolates. Any module-scope setup (seeding, migrations) runs once per isolate, so make it safe to repeat or guard it with a Postgres advisory lock.
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
