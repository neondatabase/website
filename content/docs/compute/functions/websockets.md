---
title: WebSockets and SSE on Neon Functions
subtitle: Hold long-lived connections open for real-time apps.
summary: >-
  Neon Functions stay alive while data flows, so they can host real-time
  backends. Use WebSockets for two-way connections with upgradeWebSocket from
  @neon/functions, server-sent events for one-way streams, and Postgres to
  broadcast across isolates.
enableTableOfContents: true
updatedOn: '2026-09-11T20:58:44.264Z'
---

<FeatureBetaProps feature_name="Neon Functions" />

Real-time backends on Neon Functions still follow the request/response model: one request opens a connection, and the handler keeps a streamed response open while data keeps moving. Because the function keeps running for the life of that connection, it can host a real-time backend on the same branch as your Postgres database, using Postgres itself for cross-isolate messaging (polling, or `LISTEN/NOTIFY`) instead of a separate broker like Redis.

Two options, depending on direction:

- **[WebSockets](#serve-a-websocket)**: two-way, low-latency frames. Reach for these when the client also sends messages (chat, presence, collaborative editing).
- **[Server-sent events (SSE)](#server-sent-events-sse)**: one-way, server to client. Simpler to run (plain HTTP, no upgrade, no library), and the browser's `EventSource` reconnects automatically. Reach for these for live counters, notifications, progress, and token streams.

## Serve a WebSocket

Accept a WebSocket connection with `upgradeWebSocket` from `@neon/functions` (0.7.0 or later). Called inside your normal `fetch` handler, `upgradeWebSocket(request)` turns a handshake into a live connection and returns `{ socket, response }`: return `response` to complete the upgrade, and `socket` is a standard [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket), with no `ws` dependency. The API mirrors [`Deno.upgradeWebSocket`](https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket).

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

Install the dependency (`@neon/functions` 0.7.0 or later):

```bash
npm install @neon/functions
```

Local WebSocket support needs the `neon` CLI 2.45.0 or later. With an earlier CLI, `neon dev` returns `200 OK` instead of `101 Switching Protocols` for upgrade requests, so test against a deployed function or upgrade the CLI. Installing `@neon/functions` does not upgrade the CLI; they version independently.

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

## Hono app with WebSocket

For a Hono app, use `upgradeWebSocket` from `@neon/functions/hono` (needs `@neon/functions` 0.9.0 or later). It's a Hono route helper: pass a function that returns `onOpen`, `onMessage`, `onClose`, and `onError` handlers. The handshake is a normal request to your app, so it flows through routing and middleware like any other, and auth is just route middleware, not something you reimplement on a raw socket.

Watch the import path. The similarly named `upgradeWebSocket` from `@hono/node-server` is a different function that does not work here, because it requires Hono's own `serve()` wrapper, which the runtime doesn't use.

```ts filename="functions/hono-echo.ts"
import { Hono } from 'hono';
import { upgradeWebSocket } from '@neon/functions/hono';

const app = new Hono();

app.get('/', (c) => c.text('WebSocket server. Connect via wss://'));

app.get(
  '/ws',
  // Normal Hono middleware, applied to the handshake. verifyToken is your own
  // JWT or API-key check; see Authentication below.
  async (c, next) => {
    if (!(await verifyToken(c.req.query('token')))) return c.text('unauthorized', 401);
    await next();
  },
  upgradeWebSocket(() => ({
    onOpen: (_event, ws) => ws.send('welcome'),
    onMessage: (event, ws) => ws.send(`echo: ${event.data}`),
    onClose: () => console.log('client disconnected'),
  })),
);

export default {
  fetch: (request: Request) => app.fetch(request),
};
```

Install the dependencies (`@neon/functions` 0.9.0 or later, plus Hono):

```bash
npm install @neon/functions hono
```

The `ws` handle passed to each callback is Hono's [`WSContext`](https://hono.dev/docs/helpers/websocket): use `ws.send()`, `ws.close()`, and `ws.readyState`, and reach the underlying standard `WebSocket` through `ws.raw`. A non-upgrade request on the same path is left alone and passed to the next handler, so a plain `GET /ws` still reaches any route you define below it.

<Admonition type="warning" title="Middleware that rebuilds the response breaks the upgrade">
The upgrade completes only when the runtime writes the handler's `response` unchanged, so Hono middleware that reads or rebuilds the response defeats it. In particular, `app.use('*', cors())` on an upgrade route fails the handshake with HTTP `500` and `websocket_upgrade_response_lost`; the same happens when middleware reads `c.res` before calling `next()` and sets headers afterward. Scope response-rewriting middleware to your non-WebSocket routes, not the upgrade route.
</Admonition>

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

`WHERE id > cursor` can skip a row that commits out of sequence: a transaction that took a lower id but commits after a higher one is already behind the cursor, so the poll never returns it. For a broadcast feed occasional loss is usually acceptable; when you need every row, use `LISTEN/NOTIFY` (below, on always-on compute) or poll by `created_at` with a small overlap window and dedupe by id.

### LISTEN/NOTIFY (lowest latency, always-on compute only)

For sub-second latency, each isolate holds one `LISTEN` connection at module scope and broadcasts with `NOTIFY`, so every isolate re-pushes to its own clients.

<Admonition type="warning" title="LISTEN/NOTIFY disables scale to zero">
The `LISTEN` client holds an idle connection open on every isolate, and an idle connection doesn't count as active traffic. [Scale to zero](/docs/introduction/scale-to-zero) suspends the compute on its normal timer and drops that connection, silently killing the feed. Only use `LISTEN`/`NOTIFY` on an always-on compute, with scale to zero disabled (a paid-plan setting).
</Admonition>

Each isolate keeps a `Set` of the `upgradeWebSocket` sockets it accepted, one `LISTEN` client to receive `NOTIFY`, and a pool to `pg_notify` when a client sends a message.

Install the additional dependencies:

```bash
npm install @neon/functions pg
npm install --save-dev @types/pg
```

```ts filename="functions/chat.ts"
import { upgradeWebSocket, attachDatabasePool } from '@neon/functions';
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

// Re-push every NOTIFY to this isolate's own clients.
listener.on('notification', (msg) => {
  if (!msg.payload) return;
  for (const socket of clients) {
    if (socket.readyState === socket.OPEN) socket.send(msg.payload);
  }
});

export default {
  fetch(request: Request) {
    if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('This endpoint speaks WebSocket. Send an Upgrade request.', { status: 426 });
    }
    const { socket, response } = upgradeWebSocket(request);
    socket.addEventListener('open', () => clients.add(socket)); // add once the 101 is written
    socket.addEventListener('close', () => clients.delete(socket));
    socket.addEventListener('message', async (event) => {
      const body = String(event.data).trim();
      if (!body) return;
      await pool.query('SELECT pg_notify($1, $2)', [CHANNEL, body]);
    });
    return response;
  },
};
```

Use `DATABASE_URL_UNPOOLED` for the `LISTEN` client. The pooled `DATABASE_URL` routes through PgBouncer, which doesn't support `LISTEN/NOTIFY`.

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

## Server-sent events (SSE)

When you only need server-to-client updates, SSE is simpler than a WebSocket. There's no upgrade handshake and no library to install. A plain `fetch` handler returns a `Response` whose body is a `ReadableStream`, with the `Content-Type` set to `text/event-stream`. The runtime keeps that response open while the stream keeps writing.

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

A browser client can't read why a handshake was refused; it sees only a generic connection failure, not the status or body you returned. Refuse to keep unauthenticated clients out, but send any detail the client needs over a separate authenticated request.

In the snippet below (and in the Hono example above), `verifyToken(token)` is your own check: verify a JWT with `jose`'s `jwtVerify`, or look up an API key, returning the caller's identity or `null`.

Refuse the handshake by returning an ordinary `Response` from `fetch` before you upgrade, so you don't call `upgradeWebSocket` at all until the caller checks out. In a Hono app, do the same as route middleware ahead of the `upgradeWebSocket` helper, as in the [Hono example](#hono-app-with-websocket).

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

For a complete example with JWT verification, Managed Better Auth integration, and client-side reconnection, see the [realtime chat example](https://github.com/neondatabase/examples/tree/main/with-realtime-chat).

## Eviction and shutdown

On shutdown the platform sends `SIGINT`, then forcibly stops the function 5 seconds later. You don't need to drain the `pg` pool: when the process exits, the OS closes its sockets and Neon's pooler reclaims those connections. Use a `SIGINT` handler only to flush in-flight work that would otherwise be lost, such as clearing the heartbeat timer above.

When the function stops or is evicted, connected clients see their socket drop, and no clean close frame is guaranteed, so build reconnection into the client. The browser's `EventSource` reconnects on its own; a WebSocket client needs its own retry loop, re-minting its token on each attempt since tokens are short-lived.

See [Runtime limits](/docs/compute/functions/reference/runtime-limits) for eviction and timeout behavior.

<NeedHelp/>
