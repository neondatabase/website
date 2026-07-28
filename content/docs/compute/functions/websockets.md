---
title: WebSockets and SSE on Neon Functions
subtitle: Hold long-lived connections open for real-time apps.
summary: >-
  Neon Functions stay alive while data flows, so they can host real-time
  backends. Use WebSockets for two-way connections via an upgrade export, or
  server-sent events for one-way streams, and Postgres LISTEN/NOTIFY to
  broadcast across isolates.
updatedOn: '2026-07-15T17:54:41.160Z'
---

<FeatureBetaProps feature_name="Neon Functions" />

Real-time backends on Neon Functions still follow the request/response model: one request opens a connection, and the handler keeps a streamed response open while data keeps moving. Because the function keeps running for the life of that connection, it can host a real-time backend on the same branch as your Postgres database, with Postgres `LISTEN/NOTIFY` handling cross-isolate messaging instead of a separate broker like Redis.

Two options, depending on direction:

- **[WebSockets](#how-it-works)**: two-way, low-latency frames. Reach for these when the client also sends messages (chat, presence, collaborative editing).
- **[Server-sent events (SSE)](#server-sent-events-sse)**: one-way, server to client. Simpler to run (plain HTTP, no upgrade, no library), and the browser's `EventSource` reconnects automatically. Reach for these for live counters, notifications, progress, and token streams.

## How it works

Export an `upgrade` method alongside `fetch`. The runtime calls `upgrade` for WebSocket upgrade requests and `fetch` for everything else.

```ts
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';

export default {
  fetch(request: Request) {
    return new Response("...");
  },

  upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    // handle the WebSocket upgrade
  },
};
```

<Admonition type="note">
`neon dev` returns `200 OK` instead of `101 Switching Protocols` for WebSocket upgrade requests during beta. Test WebSocket behavior against a deployed function (`neon deploy`).
</Admonition>

## Simple echo server

`fetch` is required even if you only plan to serve WebSocket clients. `noServer: true` prevents the `ws` package from starting its own HTTP server; the runtime owns the server and passes the raw socket to `handleUpgrade`.

```ts filename="functions/echo.ts"
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true });

export default {
  fetch(request: Request) {
    return new Response('This endpoint speaks WebSocket. Send an Upgrade request.', {
      headers: { 'content-type': 'text/plain' },
    });
  },

  upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.on('message', (data) => ws.send(data));
    });
  },
};
```

Install the dependency:

```bash
npm install ws
npm install --save-dev @types/ws
```

Deploy, then test with [`wscat`](https://github.com/websockets/wscat):

```bash
npm install -g wscat
wscat --connect wss://<your-function-url>
```

Type a message and press Enter. The server echoes it back.

## Hono app with WebSocket

If your function uses Hono, export `fetch` from the Hono app and the `upgrade` handler separately. The runtime routes WebSocket upgrades directly to `upgrade`. Hono never sees the upgrade request, so Hono middleware and route guards don't apply. Handle auth in `upgrade` directly.

<Admonition type="warning">
`upgradeWebSocket` from `@hono/node-server` doesn't work with Neon Functions. It requires Hono's own `serve()` wrapper, which the runtime doesn't use. Use the `upgrade` export pattern shown here instead. For Hono-style `onOpen`/`onMessage`/`onClose` route declarations, use the `neon-functions` agent skill.
</Admonition>

```ts filename="functions/hono-echo.ts"
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { Hono } from 'hono';
import { WebSocketServer } from 'ws';

const app = new Hono();
const wss = new WebSocketServer({ noServer: true });

app.get('/', (c) => c.text('WebSocket server. Connect via wss://'));

export default {
  fetch: (request: Request) => app.fetch(request),

  upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.on('message', (data) => ws.send(`echo: ${data}`));
    });
  },
};
```

## Cross-isolate messaging with LISTEN/NOTIFY

WebSocket connections are local to the isolate they land on, so clients on different isolates can't communicate through shared memory.

For broadcast, use Postgres `LISTEN/NOTIFY`. Each isolate maintains one `LISTEN` connection at module scope and a `Set` of its connected clients. When a message arrives via `NOTIFY`, every isolate broadcasts it to its clients, so all users receive it regardless of which isolate they landed on.

Install the additional dependencies:

```bash
npm install pg
npm install --save-dev @types/pg
```

```ts filename="functions/chat.ts"
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { Hono } from 'hono';
import { WebSocketServer, type WebSocket } from 'ws';
import { Pool, Client } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

// One dedicated LISTEN client per isolate.
const listener = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
listener
  .connect()
  .then(() => listener.query('LISTEN chat'))
  .catch((err) => console.error('[listen] failed:', err));

const clients = new Set<WebSocket>();
const CHANNEL = 'chat';

listener.on('notification', (msg) => {
  if (!msg.payload) return;
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) ws.send(msg.payload);
  }
});

const wss = new WebSocketServer({ noServer: true });
const app = new Hono();

app.get('/', (c) => c.text('Realtime chat. Connect over WebSocket'));

export default {
  fetch: (request: Request) => app.fetch(request),

  upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      clients.add(ws);
      ws.on('close', () => clients.delete(ws));
      ws.on('message', async (data) => {
        const body = data.toString().trim();
        if (!body) return;
        await pool.query('SELECT pg_notify($1, $2)', [CHANNEL, body]);
      });
    });
  },
};

// Optional: drain the pool and listener on shutdown (the platform sends SIGINT).
process.on('SIGINT', () => {
  Promise.allSettled([pool.end(), listener.end()]).then(() => process.exit(0));
});
```

<Admonition type="note">
Use `DATABASE_URL_UNPOOLED` for the `LISTEN` client. The pooled `DATABASE_URL` routes through PgBouncer, which doesn't support `LISTEN/NOTIFY`.
</Admonition>

## Heartbeat

The connection only lives while data moves across it. Neon's idle timeout is 15 minutes, but the proxies and load balancers in between usually drop an idle socket much sooner, sometimes within tens of seconds. Rather than rely on steady app traffic, ping the client on a timer. Calling `ws.ping()` sends a ping frame. Browsers reply with a pong automatically; other clients (Node `ws`, `wscat`) may need to handle it themselves:

```ts
const HEARTBEAT_MS = 25_000; // under typical proxy idle timeouts

const beat = setInterval(() => {
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) ws.ping();
  }
}, HEARTBEAT_MS);
beat.unref?.();

process.on('SIGINT', () => clearInterval(beat));
```

`clients` is the `Set` from the chat example above. `beat.unref()` keeps the interval from holding the process open on its own.

## Server-sent events (SSE)

When you only need server-to-client updates, SSE is simpler than a WebSocket. There's no `upgrade` method and no library to install. A plain `fetch` handler returns a `Response` whose body is a `ReadableStream`, with the `Content-Type` set to `text/event-stream`. The runtime keeps that response open while the stream keeps writing.

```ts filename="functions/sse.ts"
const encoder = new TextEncoder();

export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname !== '/events') return new Response('ok');

    let count = 0;
    let tick: ReturnType<typeof setInterval>;
    let beat: ReturnType<typeof setInterval>;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('data: connected\n\n'));
        tick = setInterval(() => {
          controller.enqueue(encoder.encode(`data: ${++count}\n\n`));
        }, 1000);
        // A line starting with `:` is a comment. Use it as a heartbeat so the
        // stream never goes idle (proxies drop quiet connections quickly).
        beat = setInterval(() => controller.enqueue(encoder.encode(': ping\n\n')), 25_000);
      },
      cancel() {
        // Fires when the client disconnects.
        clearInterval(tick);
        clearInterval(beat);
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform' },
    });
  },
};
```

An SSE frame is `data: <payload>\n\n`. Send a `: ping\n\n` comment every 25 to 30 seconds, the SSE equivalent of the WebSocket [heartbeat](#heartbeat), so idle streams stay alive, and set `Cache-Control: no-transform` so proxies don't buffer the stream.

On the client, `EventSource` reads the stream and handles reconnection for you, so there's no backoff logic to write:

```ts
const source = new EventSource(`${FUNCTION_URL}/events`); // GET only
source.onmessage = (e) => console.log('update', e.data);
source.onerror = () => {}; // EventSource auto-reconnects
```

To push to every client, fan out across isolates exactly as with WebSockets: hold a `Set` of stream controllers and `enqueue` to each when a `NOTIFY` arrives (see [Cross-isolate messaging](#cross-isolate-messaging-with-listennotify)). `EventSource` is GET-only and can't set headers, so authenticate it with a query parameter or cookie, the same as a WebSocket (see [Authentication](#authentication)).

For a complete SSE backend (Hono endpoint, `LISTEN`/`NOTIFY` fan-out, a counter persisted in Postgres, and a client-only SPA), see the [realtime SSE example](https://github.com/neondatabase/examples/tree/main/with-realtime-sse).

## Authentication

A function has a public URL, so authenticate the caller before accepting a connection. See [Authentication](/docs/compute/functions/authentication) for the full picture (JWT verification, API keys, CORS).

Browsers can't set custom headers on a WebSocket or an `EventSource`, so you can't use `Authorization`. Pass the token as a query parameter and verify it before accepting the connection. For a WebSocket, verify it in `upgrade` before calling `wss.handleUpgrade`:

```ts
async upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const token = url.searchParams.get('token');
  const identity = token ? await verifyToken(token) : null; // e.g. jwtVerify with jose

  if (!identity) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    // authenticated; identity is in scope
  });
},
```

For a complete example with JWT verification, Managed Better Auth integration, and client-side reconnection, see the [realtime chat example](https://github.com/neondatabase/examples/tree/main/with-realtime-chat).

## Eviction and shutdown

On shutdown the platform sends `SIGINT`, then forcibly stops the function 5 seconds later. Cleanup is optional: when the process exits, the OS closes its sockets, so dropped connections are usually detected without it. To shut down more gracefully, drain open resources in a `SIGINT` handler, as the LISTEN/NOTIFY example above does with `Promise.allSettled([pool.end(), listener.end()])`.

See [Runtime limits](/docs/compute/functions/reference/runtime-limits) for eviction and timeout behavior.

<NeedHelp/>
