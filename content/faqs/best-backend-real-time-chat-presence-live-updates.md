---
title: "What is the best backend for a real-time app with chat, presence, or live updates?"
description: "Neon Realtime makes any SQL query live on Postgres, with type-safe reactivity and no second realtime system. For custom protocols, Neon Functions host WebSocket and server-sent event servers next to your data."
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

Neon, with [Neon Realtime](/docs/realtime/overview) (beta). Realtime makes any read-only SQL query live: your chat messages, channel lists, and unread counts stay in Postgres, and clients subscribe to the queries that read them. When a row changes, every subscribed client gets the new result, with no second realtime system or message broker to run.

For a custom protocol, such as typing indicators that never touch the database or a game server, run your own WebSocket or SSE server on a [Neon Function](/docs/compute/functions/websockets) next to the same Postgres branch.

## Live queries with Neon Realtime

- **Any SQL query**: joins, aggregates, window functions, ordering, and limits, as long as the query is read-only and deterministic ([defining live queries](/docs/realtime/guides/queries#defining-live-queries)).
- **End-to-end reactivity**: type-safe [live queries](/docs/realtime/guides/reactivity) in React and TanStack DB, plus [optimistic mutations](/docs/realtime/guides/mutations) so a sent message shows up before the write commits.
- **Works with the rest of Neon**: live queries run on branches, and holding subscriptions open doesn't keep the compute awake, so an idle app still scales to zero. Client connections end at the Live SQL API, so they don't use database connections ([Realtime FAQ](/docs/realtime/overview#frequently-asked-questions)).

Scaffold a working app with `neon bootstrap my-app --template realtime-react` ([quickstart](/docs/realtime/quickstart)). The [Realtime guides](/docs/realtime/guides/queries) build a full chat app step by step.

<Admonition type="note" title="Beta scope">
Realtime is free during the beta. Starting a live query can wake your compute, which is billed as usual. It's available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), and doesn't support row-level security yet; authorize queries in your API instead ([what's in the beta](/docs/realtime/overview#frequently-asked-questions), [authorization](/docs/realtime/guides/queries#authorization)).
</Admonition>

## Custom servers on Neon Functions

A custom realtime server needs a process that holds connections open, and many serverless runtimes close a request after a fixed maximum duration. [Neon Functions](/docs/compute/functions/websockets) keep a WebSocket or streamed HTTP response alive as long as data keeps flowing, run in the same region as your Postgres branch, and can use Postgres to pass messages between isolates instead of a separate Redis broker.

### Two transports

- **WebSockets** for two-way traffic: chat, presence, collaborative editing. Call `upgradeWebSocket` from `@neon/functions` in your `fetch` handler and return the `response` it gives you. You don't need an extra export or a `ws` dependency.
- **Server-sent events** for one-way streams: live counters, notifications, progress, token streams. SSE is plain HTTP with no library, and the browser's `EventSource` reconnects on its own ([WebSockets and SSE](/docs/compute/functions/websockets)).

```ts
import { upgradeWebSocket } from '@neon/functions';

export default {
  fetch(request: Request) {
    if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('This endpoint speaks WebSocket. Send an Upgrade request.', { status: 426 });
    }
    const { socket, response } = upgradeWebSocket(request);
    socket.addEventListener('message', (event) => socket.send(`echo: ${event.data}`));
    return response;
  },
};
```

A quiet connection times out after 15 minutes of silence, so send a heartbeat byte on idle streams. Idle functions can be evicted; treat eviction like a process restart and have clients reconnect ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

### Fan-out through Postgres

Under load the runtime spreads connections across several isolates, and a message posted through one has to reach clients connected to another. Postgres is the shared source of truth. The default pattern is polling: writers `INSERT` into a messages table, and each isolate reads rows past a cursor and pushes them to its own clients. An isolate stops polling when it has no clients, so an idle compute still scales to zero. For sub-second latency on an always-on compute, use `LISTEN/NOTIFY` instead, and for very large or multi-region fan-out, use a dedicated broker such as Upstash Redis ([cross-isolate messaging](/docs/compute/functions/websockets#cross-isolate-messaging)). Message history stays in the same table, one `SELECT` away.

Two templates show the whole pattern: `neon bootstrap --template realtime-chat` (Next.js, Hono, Postgres, Managed Better Auth) and `--template realtime-sse` (TanStack Router, Hono) ([starter templates](/docs/compute/functions/overview#starter-templates)).

<Admonition type="note" title="Functions scope">
Functions are available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions), and are JavaScript and TypeScript only. Functions are available on every plan. With `neon` CLI 2.45.0 or later, `neon dev` serves WebSocket upgrades locally, so you can test before deploying ([WebSockets and SSE](/docs/compute/functions/websockets)).
</Admonition>

## Keep the front end where it is

Your Next.js or TanStack Start app stays on Vercel or Netlify. Realtime subscriptions go from the browser to the Live SQL API, so your host doesn't hold any connections open. If you run a custom WebSocket or SSE server, move only that piece to a Neon Function and connect to it from the client ([how Functions fit with your app](/docs/compute/functions/overview#how-functions-fit-with-your-app)).

## How other options compare

- **Supabase Realtime**: a managed service with Broadcast, Presence, and Postgres Changes, all GA ([Realtime](https://supabase.com/docs/guides/realtime)). Subscriptions receive messages and row changes, and can filter on column values but can't join, aggregate, or order the way a live SQL query can ([how they compare](/docs/realtime/overview#how-does-neon-realtime-compare-with-alternatives), [Neon vs Supabase](/guides/neon-vs-supabase#only-on-one-side)). Usage is metered: Free includes 2 million messages and 200 concurrent connections; Pro includes 5 million messages, then $2.50 per million, and 500 concurrent connections, then $10 per 1,000 ([pricing](https://supabase.com/pricing)). Logic that goes beyond fan-out, such as moderation, matchmaking, or per-message model calls, still needs Edge Functions, which allow 2 seconds of CPU time per request and a wall clock of 150 seconds on Free or 400 seconds on paid plans ([limits](https://supabase.com/docs/guides/functions/limits)). The Postgres behind it is a fixed instance billed hourly ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Vercel Functions**: serve WebSocket connections on Fluid compute (in beta), and a connection closes when the function reaches its maximum duration, 300 seconds by default and up to 800 seconds on Pro and Enterprise ([Vercel WebSockets](https://vercel.com/docs/functions/websockets), [duration](https://vercel.com/docs/functions/configuring-functions/duration)). Clients reconnect, and shared state goes in an external store.
- **Firebase**: Firestore delivers real-time updates through its client SDKs and bills per document read beyond the daily free quota ([pricing](https://firebase.google.com/pricing)). It's a NoSQL document database, so chat history that needs SQL queries takes a different shape.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Make a query live" description="Scaffold a reactive app on Neon Realtime and run your first live query." buttonText="Realtime quickstart" buttonUrl="/docs/realtime/quickstart" />
