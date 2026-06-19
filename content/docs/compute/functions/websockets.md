---
title: WebSocket servers
subtitle: Host persistent WebSocket connections on Neon Functions.
summary: >-
  Neon Functions support long-lived WebSocket connections via an upgrade export.
  Use the ws package alongside your fetch handler to accept WebSocket clients,
  and Postgres LISTEN/NOTIFY to broadcast across isolates.
updatedOn: '2026-06-19T13:59:31.895Z'
---

<PrivatePreviewEnquire/>

Neon Functions stay alive as long as they have active connections, so a WebSocket server is a first-class use case. Your handler runs on the same branch as your Postgres database.

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
`neonctl dev` returns `200 OK` instead of `101 Switching Protocols` for WebSocket upgrade requests during the preview. Test WebSocket behavior against a deployed function (`neonctl deploy`).
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
    return new Response('This endpoint speaks WebSocket — send an Upgrade request.', {
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

app.get('/', (c) => c.text('WebSocket server — connect via wss://'));

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

app.get('/', (c) => c.text('Realtime chat — connect over WebSocket'));

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

process.on('SIGINT', () => {
  Promise.allSettled([pool.end(), listener.end()]).then(() => process.exit(0));
});
```

<Admonition type="note">
Use `DATABASE_URL_UNPOOLED` for the `LISTEN` client. The pooled `DATABASE_URL` routes through PgBouncer, which doesn't support `LISTEN/NOTIFY`.
</Admonition>

## Authentication

Browsers can't set custom headers on a WebSocket connection, so you can't use `Authorization`. Pass the token as a query parameter and verify it in `upgrade` before calling `wss.handleUpgrade`:

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
    // authenticated — identity is in scope
  });
},
```

For a complete example with JWT verification, Neon Auth integration, and client-side reconnection, see the [realtime chat example](https://github.com/neondatabase/examples/tree/main/with-realtime-chat).

## Eviction and shutdown

The platform sends `SIGINT` before evicting an isolate. Without a handler, open database connections are abandoned and stay open until they time out. The LISTEN/NOTIFY example above includes one: `Promise.allSettled([pool.end(), listener.end()])` drains the pool and listener before the process exits. Add equivalent cleanup for any other resources your function holds.

See [Runtime limits](/docs/compute/functions/reference/runtime-limits#lifecycle) for eviction behavior and the heartbeat timeout.

<NeedHelp/>
