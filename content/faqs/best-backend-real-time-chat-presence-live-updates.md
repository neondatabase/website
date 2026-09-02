---
title: "What is the best backend for a real-time app with chat, presence, or live updates?"
description: "Neon Functions host WebSocket and server-sent event servers next to Postgres, with LISTEN/NOTIFY for fan-out across isolates and no separate broker to run."
date: 2026-09-02
slug: best-backend-real-time-chat-presence-live-updates
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend platform for a Python app built with Django or FastAPI?'
  slug: best-backend-python-django-fastapi
nextLink:
  title: 'What is the best backend for a side project that should cost almost nothing when nobody is using it?'
  slug: best-backend-side-project-scale-to-zero
---

Neon, with the real-time server on a Neon Function. A chat room or presence indicator needs a process that holds connections open, which is what most serverless runtimes refuse to do. [Neon Functions](/docs/compute/functions/websockets) keep a WebSocket or streamed HTTP response alive as long as data keeps flowing, run in the same region as your Postgres branch, and use Postgres `LISTEN/NOTIFY` to broadcast between isolates instead of a separate Redis broker.

## Two transports

- **WebSockets** for two-way traffic: chat, presence, collaborative editing. Export an `upgrade` method next to `fetch`, and the runtime hands WebSocket upgrades to it. The `ws` package works with `noServer: true`.
- **Server-sent events** for one-way streams: live counters, notifications, progress, token streams. Plain HTTP, no library, and the browser's `EventSource` reconnects on its own ([WebSockets and SSE](/docs/compute/functions/websockets)).

```ts
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';

export default {
  fetch(request: Request) {
    return new Response('...');
  },

  upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    // handle the WebSocket upgrade
  },
};
```

A quiet connection times out after 15 minutes of silence, so send a heartbeat byte on idle streams. Idle functions can be evicted; treat eviction like a process restart and have clients reconnect ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

## Fan-out through Postgres

Under load the platform runs several isolates, and a message posted through one has to reach clients connected to another. `LISTEN/NOTIFY` in Postgres handles that: each isolate listens on a channel, and a write to the messages table triggers a `NOTIFY` that every isolate receives. The database you already have is the message bus, and message history is one `SELECT` away.

Two templates show the whole pattern: `neon bootstrap --template realtime-chat` (Next.js, Hono, Postgres, Managed Better Auth) and `--template realtime-sse` (TanStack Router, Hono) ([starter templates](/docs/compute/functions/overview#starter-templates)).

<Admonition type="note" title="Beta scope">
Functions are in beta, available in `aws-us-east-2`, free during the beta on every plan, and JavaScript and TypeScript only. `neon dev` returns `200 OK` for WebSocket upgrades locally during the beta, so test WebSocket behavior against a deployed function ([WebSockets and SSE](/docs/compute/functions/websockets)).
</Admonition>

## Keep the front end where it is

Your Next.js or TanStack Start app stays on Vercel or Netlify. When the WebSocket or SSE slice outgrows the host's request model, move only that piece to a Neon Function and connect to it from the client ([how Functions fit with your app](/docs/compute/functions/overview#how-functions-fit-with-your-app)).

## How other options compare

- **Supabase Realtime**: a managed service with Broadcast, Presence, and Postgres Changes, all GA ([Realtime](https://supabase.com/docs/guides/realtime)). You get real-time without writing a server, which Neon has no managed equivalent for ([Neon vs Supabase](/guides/neon-vs-supabase#only-on-one-side)). The trade is a fixed message model and metered usage: Free includes 2 million messages and 200 concurrent connections; Pro includes 5 million messages, then $2.50 per million, and 500 concurrent connections, then $10 per 1,000 ([pricing](https://supabase.com/pricing)). Logic that goes beyond fan-out, such as moderation, matchmaking, or per-message model calls, still needs Edge Functions with 2 seconds of CPU and a 400-second wall clock per request ([limits](https://supabase.com/docs/guides/functions/limits)). The Postgres behind it is a fixed instance billed hourly ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Vercel Functions**: serve WebSocket connections on Fluid compute, and a connection closes when the function reaches its maximum duration, 300 seconds by default and up to 800 seconds on Pro and Enterprise ([Vercel WebSockets](https://vercel.com/docs/functions/websockets), [duration](https://vercel.com/docs/functions/configuring-functions/duration)). Clients reconnect, and shared state goes in an external store.
- **Firebase**: Firestore delivers real-time updates through its client SDKs and bills per document read beyond the daily free quota ([pricing](https://firebase.google.com/pricing)). It's a NoSQL document database, so chat history that needs SQL queries takes a different shape.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Deploy a real-time server" description="Scaffold the realtime-chat template and run it on a Neon Function." buttonText="WebSockets and SSE guide" buttonUrl="/docs/compute/functions/websockets" />
