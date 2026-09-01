---
title: WebSockets and SSE on Neon Functions
subtitle: Hold long-lived connections open for real-time apps.
summary: >-
  Neon Functions stay alive while data flows, so they can host real-time
  backends. Use WebSockets for two-way connections, either with upgradeWebSocket
  from @neon/functions or a lower-level upgrade export, server-sent events for
  one-way streams, and Postgres to broadcast across isolates.
enableTableOfContents: true
updatedOn: '2026-09-01T17:54:30.907Z'
---

<FeatureBetaProps feature_name="Neon Functions" />

Real-time backends on Neon Functions still follow the request/response model: one request opens a connection, and the handler keeps a streamed response open while data keeps moving. Because the function keeps running for the life of that connection, it can host a real-time backend on the same branch as your Postgres database, using Postgres itself for cross-isolate messaging (polling, or `LISTEN/NOTIFY`) instead of a separate broker like Redis.

Two options, depending on direction:

- **[WebSockets](#serve-a-websocket)**: two-way, low-latency frames. Reach for these when the client also sends messages (chat, presence, collaborative editing).
- **[Server-sent events (SSE)](#server-sent-events-sse)**: one-way, server to client. Simpler to run (plain HTTP, no upgrade, no library), and the browser's `EventSource` reconnects automatically. Reach for these for live counters, notifications, progress, and token streams.

## Serve a WebSocket

There are two ways to accept a WebSocket connection:

- **`upgradeWebSocket` from `@neon/functions`** opens the connection from inside your normal `fetch` handler and returns a standard [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). No extra export and no `ws` dependency. Start here for new functions.
- **An `upgrade` export** gives you the raw socket to drive with the [`ws`](https://github.com/websockets/ws) library. It's lower level and needs the `ws` dependency. Use it when you need `ws` features directly, such as `ws.ping()` for a [heartbeat](#heartbeat) or a `WebSocketServer` shared across clients for [broadcast](#cross-isolate-messaging).

If a function has both, the `upgrade` export takes precedence.

### With upgradeWebSocket

`upgradeWebSocket(request)` turns a handshake into a live connection and returns `{ socket, response }`. Return `response` from your handler to complete the upgrade; `socket` is a standard `WebSocket`. The API mirrors [`Deno.upgradeWebSocket`](https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket).

```ts filename="functions/echo.ts"
import { upgradeWebSocket } from '@neon/functions';

export default {
  fetch(request: Request) {
    if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('This endpoint speaks WebSocket. Send an Upgrade request.', {
        status: 426,
      });
    }

    const { socket, response } = upgradeWebSocket(request);
    socket.addEventListener('message', (event) => {
      socket.send(`echo: ${event.data}`);
    });
    return response;
  },
};
```

Install the dependency:

```bash
npm install @neon/functions
```

Note:

- **Return `response` unchanged.** The runtime writes the `101 Switching Protocols` only when your handler returns it, and the socket opens (firing `open`) at that point. Cloning or rebuilding the response (`new Response(res.body, res)`, which response-rewriting middleware does) discards the upgrade, and the runtime fails the request with a `500` rather than leaving the client hanging.
- **`socket` is a standard `WebSocket`.** Both `addEventListener` and the `onmessage`/`onopen`/`onclose`/`onerror` properties work. It's still `CONNECTING` when you get it, and its `binaryType` defaults to `'arraybuffer'` rather than the browser's `'blob'`, so `event.data` is a `string` for text frames and an `ArrayBuffer` (not a `Blob`) for binary ones.
- **It throws instead of degrading.** `upgradeWebSocket` raises a `TypeError` whenever it can't produce a real socket: off-platform (outside a Neon Functions runtime), on a request that isn't a WebSocket handshake, or if you call it twice for the same request. That second case is why the example above returns `426` before calling it, so guard any handler that also serves plain HTTP. On-platform it works both locally under `neon dev` and when deployed, so there's nothing extra to do to test it.

To select a subprotocol, pass `protocol`, but only one the client actually offered: per [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455#section-4.2.2) a server may only select from the client's list, so passing one it didn't offer throws a `TypeError`. The client's offers are in the `Sec-WebSocket-Protocol` request header, so read them inside `fetch` and select conditionally before calling `upgradeWebSocket`:

```ts
const offered = request.headers.get('sec-websocket-protocol')?.split(',').map((s) => s.trim());
const protocol = offered?.includes('chat.v2') ? 'chat.v2' : undefined;
const { socket, response } = upgradeWebSocket(request, protocol ? { protocol } : undefined);
```

Test it with [`wscat`](https://github.com/websockets/wscat):

```bash
npm install -g wscat
wscat --connect ws://localhost:<port>   # local; use the URL `neon dev` prints
wscat --connect wss://<your-function-url>   # deployed
```

Type a message and press Enter. The server echoes it back.

### With an upgrade export

Export an `upgrade` method alongside `fetch`. The runtime calls `upgrade` for WebSocket upgrade requests and `fetch` for everything else. This pattern uses the [`ws`](https://github.com/websockets/ws) library, which gives you the raw socket and features like `ws.ping()`. `noServer: true` prevents `ws` from starting its own HTTP server; the runtime owns the server and passes the raw socket to `handleUpgrade`.

```ts filename="functions/echo-ws.ts"
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true });

export default {
  fetch(request: Request) {
    return new Response('This endpoint speaks WebSocket. Send an Upgrade request.', {
      status: 426,
    });
  },

  upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.on('message', (data) => ws.send(data));
    });
  },
};
```

Install the dependency (`ws` version 8 or later, which exports `WebSocketServer`):

```bash
npm install ws
npm install --save-dev @types/ws
```

`fetch` is required even if you only plan to serve WebSocket clients.

## Hono app with WebSocket

With `upgradeWebSocket`, the handshake is a normal request to your Hono app, so it flows through routing and middleware like any other. Call `upgradeWebSocket(c.req.raw)` in the route handler and return the `response`. This is the main advantage over the `upgrade` export: auth is just route middleware, not something you reimplement on the raw socket.

<Admonition type="note" title="Two different upgradeWebSocket functions">
Watch the package name. This page recommends `upgradeWebSocket` from `@neon/functions`, which works with Neon Functions. The similarly named `upgradeWebSocket` from `@hono/node-server` does not: it requires Hono's own `serve()` wrapper, which the runtime doesn't use. For a Hono app, call the `@neon/functions` `upgradeWebSocket` inside a route, as shown below.
</Admonition>

```ts filename="functions/hono-echo.ts"
import { Hono } from 'hono';
import { upgradeWebSocket } from '@neon/functions';

const app = new Hono();

app.get('/', (c) => c.text('WebSocket server. Connect via wss://'));

app.get(
  '/ws',
  async (c, next) => {
    // Normal Hono middleware, applied to the handshake. verifyToken is your own
    // JWT or API-key check; see Authentication below.
    if (!(await verifyToken(c.req.query('token')))) return c.text('unauthorized', 401);
    await next();
  },
  (c) => {
    const { socket, response } = upgradeWebSocket(c.req.raw);
    socket.addEventListener('message', (event) => socket.send(`echo: ${event.data}`));
    return response;
  },
);

export default {
  fetch: (request: Request) => app.fetch(request),
};
```

The `/ws` route is WebSocket-only: a plain (non-upgrade) GET reaches `upgradeWebSocket` on a request that isn't a handshake and returns `500`. That's fine for a dedicated socket route; add the `426` guard from the [echo example](#with-upgradewebsocket) to any route that also serves normal HTTP.

If you use the `upgrade` export instead, Hono never sees the handshake: the runtime routes WebSocket upgrades directly to `upgrade`, so Hono middleware and route guards don't apply and you handle auth in `upgrade` directly.

```ts filename="functions/hono-echo-ws.ts"
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

## Cross-isolate messaging

WebSocket connections are local to the isolate they land on, so clients on different isolates can't communicate through shared memory. Under load the runtime spreads connections across several isolates, each with its own `Set` of clients, so broadcasting to only the local set means a client on one isolate never sees a message produced on another. `neon dev` runs a single isolate, so this looks fine locally and only shows up in production.

Postgres is the shared source of truth. Start with polling, which keeps [scale to zero](/docs/introduction/scale-to-zero); use `LISTEN/NOTIFY` only on always-on compute that needs sub-second latency; for very large or multi-region fan-out, reach for a dedicated broker like [Upstash](https://upstash.com) Redis instead.

### Poll Postgres (default)

Each isolate polls for rows past a cursor and pushes them to its own clients. Polling stops when the isolate has no clients, so an idle compute still suspends and scale to zero keeps working.

Create a table for writers to `INSERT` into (no `pg_notify` needed):

```sql
CREATE TABLE messages (id bigserial PRIMARY KEY, body text);
```

Then each isolate polls it:

```ts filename="functions/feed.ts"
import { upgradeWebSocket, attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool); // add a pool error handler; without one, node-postgres crashes the process on a pool error

const clients = new Set<WebSocket>();
let cursor = '0'; // highest message id seen; a bigint, so a string
let polling = false;

async function poll() {
  if (polling || clients.size === 0) return; // guard against overlap; skip when no clients so the compute can idle out
  polling = true;
  try {
    const { rows } = await pool.query('SELECT id, body FROM messages WHERE id > $1 ORDER BY id', [cursor]);
    for (const row of rows) {
      cursor = row.id;
      for (const socket of clients) {
        if (socket.readyState === socket.OPEN) socket.send(row.body); // skip a socket mid-close
      }
    }
  } catch (err) {
    console.error('[poll]', err);
  } finally {
    polling = false;
  }
}

// Seed the cursor with the latest id so a fresh isolate sends only new rows, then poll.
pool
  .query('SELECT coalesce(max(id), 0)::text AS id FROM messages')
  .then(({ rows }) => { cursor = rows[0].id; })
  .catch((err) => console.error('[seed]', err))
  .finally(() => setInterval(poll, 1000).unref?.());

export default {
  fetch(request: Request) {
    if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('This endpoint speaks WebSocket. Send an Upgrade request.', { status: 426 });
    }
    const { socket, response } = upgradeWebSocket(request);
    socket.addEventListener('open', () => clients.add(socket)); // add once the 101 is written
    socket.addEventListener('close', () => clients.delete(socket));
    return response;
  },
};
```

Install the dependencies:

```bash
npm install @neon/functions pg
npm install --save-dev @types/pg
```

Between messages a quiet feed sends nothing, so pair it with a [heartbeat](#heartbeat) to keep idle clients from being dropped.

<Admonition type="note">
`WHERE id > cursor` can skip a row that commits out of sequence: a transaction that took a lower id but commits after a higher one is already behind the cursor, so the poll never returns it. For a broadcast feed occasional loss is usually acceptable; when you need every row, use `LISTEN/NOTIFY` (below, on always-on compute) or poll by `created_at` with a small overlap window and dedupe by id.
</Admonition>

### LISTEN/NOTIFY (lowest latency, always-on compute only)

For sub-second latency, each isolate holds one `LISTEN` connection at module scope and broadcasts with `NOTIFY`, so every isolate re-pushes to its own clients.

<Admonition type="warning" title="LISTEN/NOTIFY disables scale to zero">
The `LISTEN` client holds an idle connection open on every isolate, and an idle connection doesn't count as active traffic. [Scale to zero](/docs/introduction/scale-to-zero) suspends the compute on its normal timer and drops that connection, silently killing the feed. Only use `LISTEN`/`NOTIFY` on an always-on compute, with scale to zero disabled (a paid-plan setting).
</Admonition>

The example below uses the `upgrade` export because it shares one `WebSocketServer` across clients. The same `Set`-of-connections pattern works with `upgradeWebSocket`: add the `socket` it returns to the `Set` on `open`, remove it on `close`, and call `socket.send()` on each to broadcast.

Install the additional dependencies:

```bash
npm install @neon/functions pg
npm install --save-dev @types/pg
```

```ts filename="functions/chat.ts"
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { Hono } from 'hono';
import { attachDatabasePool } from '@neon/functions';
import { WebSocketServer, type WebSocket } from 'ws';
import { Pool, Client } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

// One dedicated LISTEN client per isolate. Don't call attachDatabasePool on it:
// that would swallow the idle drop that kills the feed. The error listener keeps
// the process alive; in production, reconnect the client on error (omitted here).
const listener = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
listener.on('error', (err) => console.error('[listen]', err));
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
```

<Admonition type="note">
Use `DATABASE_URL_UNPOOLED` for the `LISTEN` client. The pooled `DATABASE_URL` routes through PgBouncer, which doesn't support `LISTEN/NOTIFY`.
</Admonition>

## Heartbeat

The connection only lives while data moves across it. Neon's idle timeout is 15 minutes, but the proxies and load balancers in between usually drop an idle socket much sooner, sometimes within tens of seconds. Rather than rely on steady app traffic, send a keepalive on a timer.

The standard `WebSocket` from `upgradeWebSocket` has no `ping()` method, so send an application-level message. It arrives as an ordinary message, so the client has to filter it out (for example, ignore a message whose data is `'ping'`):

```ts
const HEARTBEAT_MS = 25_000; // under typical proxy idle timeouts

const beat = setInterval(() => {
  for (const socket of clients) {
    if (socket.readyState === socket.OPEN) socket.send('ping');
  }
}, HEARTBEAT_MS);
beat.unref?.(); // don't hold the process open on the timer alone

process.on('SIGINT', () => clearInterval(beat));
```

`clients` is this isolate's `Set` of live connections, populated where you accept a socket (the feed and chat examples above).

With the `upgrade` export you get a `ws` socket instead, which has `ws.ping()`: it sends a real WebSocket ping frame that browsers and the `ws` library (so also `wscat`) answer with a pong automatically, below your message handlers, so nothing reaches application code. Swap `socket.send('ping')` for `ws.ping()` on the same timer and drop the client-side filtering.

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

An SSE frame is `data: <payload>\n\n`. Send a `: ping\n\n` comment every 25 to 30 seconds, the SSE equivalent of the WebSocket [heartbeat](#heartbeat), so idle streams stay alive, and set `Cache-Control: no-cache, no-transform` so proxies don't cache or buffer the stream.

On the client, `EventSource` reads the stream and handles reconnection for you, so there's no backoff logic to write:

```ts
const source = new EventSource(`${FUNCTION_URL}/events`); // GET only
source.onmessage = (e) => console.log('update', e.data);
source.onerror = () => {}; // EventSource auto-reconnects
```

Reconnection doesn't replay what it missed: `EventSource` only resumes from a point if you emit an `id:` on each event and read the `Last-Event-ID` request header on reconnect. Without that, events sent during a disconnect are lost, which is fine for a live counter (the next update is current) but not for a feed where every item matters.

To push to every client, fan out across isolates exactly as with WebSockets: hold a `Set` of stream controllers and `enqueue` to each when a new row appears (poll or `NOTIFY`; see [Cross-isolate messaging](#cross-isolate-messaging)). `EventSource` is GET-only and can't set headers, so authenticate it with a query parameter or cookie, the same as a WebSocket (see [Authentication](#authentication)).

For a complete SSE backend (Hono endpoint, `LISTEN`/`NOTIFY` fan-out, a counter persisted in Postgres, and a client-only SPA), see the [realtime SSE example](https://github.com/neondatabase/examples/tree/main/with-realtime-sse).

## Authentication

A function has a public URL, so authenticate the caller before accepting a connection. See [Authentication](/docs/compute/functions/authentication) for the full picture (JWT verification, API keys, CORS).

Browsers can't set custom headers on a WebSocket or an `EventSource`, so you can't use `Authorization`. Pass the token as a query parameter and verify it before accepting the connection. Refusing an unauthenticated connection is the normal case for a WebSocket endpoint.

Whichever pattern you use, a browser client can't read why a handshake was refused; it sees only a generic connection failure, not the status or body you returned. Refuse to keep unauthenticated clients out, but send any detail the client needs over a separate authenticated request.

In the snippets below (and in the Hono example above), `verifyToken(token)` is your own check: verify a JWT with `jose`'s `jwtVerify`, or look up an API key, returning the caller's identity or `null`.

With `upgradeWebSocket`, refuse the handshake by returning an ordinary `Response` from `fetch` before you upgrade, so you don't call `upgradeWebSocket` at all until the caller checks out:

```ts
async fetch(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const identity = token ? await verifyToken(token) : null; // e.g. jwtVerify with jose

  if (!identity) {
    return new Response('unauthorized', { status: 401 });
  }

  const { socket, response } = upgradeWebSocket(request);
  // authenticated; identity is in scope
  return response;
},
```

With an `upgrade` export, verify the token before calling `wss.handleUpgrade` and write the refusal to the raw socket:

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

On shutdown the platform sends `SIGINT`, then forcibly stops the function 5 seconds later. You don't need to drain the `pg` pool: when the process exits, the OS closes its sockets and Neon's pooler reclaims those connections. Use a `SIGINT` handler only to flush in-flight work that would otherwise be lost, such as clearing the heartbeat timer above.

When the function stops or is evicted, connected clients see their socket drop, and no clean close frame is guaranteed, so build reconnection into the client. The browser's `EventSource` reconnects on its own; a WebSocket client needs its own retry loop, re-minting its token on each attempt since tokens are short-lived.

See [Runtime limits](/docs/compute/functions/reference/runtime-limits) for eviction and timeout behavior.

<NeedHelp/>
