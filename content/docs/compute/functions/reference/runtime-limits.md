---
title: Runtime limits
subtitle: Hard constraints for Neon Functions.
summary: >-
  Hard limits for Neon Functions: lifecycle and eviction behavior, 15-minute
  timeouts, slug constraints, and the Node.js 24 runtime. Functions are
  long-running but still serverless.
enableTableOfContents: true
updatedOn: '2026-06-10T12:55:19.407Z'
---

<Admonition type="note" title="Private Preview">
Neon Functions is currently in Private Preview, available for new projects in the AWS us-east-2 region only. To request access, sign up at [We're building backends](https://neon.com/blog/were-building-backends).
</Admonition>

Neon Functions run on Node.js 24 in isolated microVMs.

## Lifecycle

Neon Functions are long-running. You can host WebSocket servers, SSE endpoints, and agents that stream responses over HTTP without hitting a short execution timeout. They're still serverless: if your function has no active connections, the platform shuts it down.

The platform may also evict and restart your function for operational reasons. Active functions can run for hours before eviction occurs. Treat eviction like a process restart: WebSocket and SSE clients need to reconnect when the connection drops.

The platform sends `SIGINT` before evicting to allow graceful shutdown. Register a handler to close open connections and flush in-flight work before the process exits:

```ts
process.on('SIGINT', () => {
  pool.end().then(() => process.exit(0));
});
```

Without it, open connections are abandoned on eviction and remain open until they time out.

## Timeouts

**Time to first byte: 15 minutes.** Your handler must begin returning a response within 15 minutes of receiving a request. This is a request-response runtime, not a background task runner. The limit prevents runaway functions that hold resources indefinitely with no way to cancel them. In practice most handlers complete in seconds. The 15-minute limit gives agent workloads like image or video generation enough time to finish.

**Heartbeat: 15 minutes.** Active WebSocket connections and HTTP streams stay open as long as data flows. The timeout only fires when the connection goes silent. Send at least one byte every 15 minutes to keep a quiet stream alive.

**`waitUntil`: 15 minutes.** Work registered with `waitUntil` runs after the response is sent. It's for cleanup: analytics writes, audit logs, short follow-up calls. It's not a background job runner. Use a dedicated system for work that needs its own lifecycle or cancellation.

```ts
import { Hono } from 'hono';
import { waitUntil } from '@neondatabase/functions/v1';

const app = new Hono();

app.post('/event', async (c) => {
  const defer = waitUntil();
  defer(writeAnalytics(c.req.raw)); // your async follow-up work
  return c.json({ ok: true });
});

export default app;
```

<Admonition type="note">
`waitUntil` is currently a stub. The deferred promise is accepted but not yet wired to the host runtime. The API is stable. Use it now and it will work automatically once the runtime support ships.
</Admonition>

## Slug constraints

Slugs must match `^[a-z0-9]{1,20}$` and are immutable after the first deployment. See [Slugs](/docs/compute/functions/deploy#slugs) for the full rules.

## Runtime

| Property    | Value                                                                        |
| ----------- | ---------------------------------------------------------------------------- |
| Runtime     | Node.js 24                                                                   |
| Isolation   | microVM per isolate                                                          |
| Concurrency | 1 request at a time per isolate. Additional requests queue, they don't fail. |
| Memory      | 2048 MiB (fixed during the private preview, not configurable)                |

## Environment variables

See [Environment variables](/docs/compute/functions/environment-variables#constraints) for limits on variable count, total size, and the reserved `NEON_` prefix.

<NeedHelp/>
