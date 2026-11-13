---
title: Serverless driver vs node-postgres for TanStack Start
subtitle: Pick the Postgres driver for your TanStack Start deploy target
summary: >-
  Choose between node-postgres (pg) and the Neon serverless driver
  (@neondatabase/serverless) for a TanStack Start app on Lakebase Postgres. The
  choice follows the deploy target: long-running Node servers, Vercel Fluid
  compute, Cloudflare with Hyperdrive, and Neon Functions use pg; serverless and
  edge functions use the serverless driver over HTTP or WebSockets.
enableTableOfContents: true
noindex: true
updatedOn: '2026-11-13T06:40:29.274Z'
---

TanStack Start runs server functions wherever you deploy it, so the Postgres driver follows the deploy target rather than the framework. Keep the driver an existing app already uses.

## Quick reference

| Deploy target                                             | Driver                     | Notes                                                                            |
| --------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| Node server (Railway, Render, Docker, VPS)                | `pg`                       | One `Pool` per process, reused across requests                                   |
| Vercel with Fluid compute                                 | `pg`                       | Register the pool with `attachDatabasePool()` from `@vercel/functions`           |
| Cloudflare Workers                                        | `pg`                       | Connect through [Cloudflare Hyperdrive](/docs/guides/cloudflare-hyperdrive)      |
| Neon Functions                                            | `pg`                       | Functions are long-running and reuse the pool                                    |
| Other serverless or edge functions (for example, Netlify) | `@neondatabase/serverless` | `neon()` over HTTP for one-shot queries, `Pool` over WebSockets for transactions |

Use the pooled connection string (`-pooler` in the hostname) for application traffic in every case. See [Choosing your connection method](/docs/connect/choose-connection).

## node-postgres

```bash filename="Terminal"
npm install pg
npm install -D @types/pg
```

```ts filename="src/db.server.ts"
import { Pool } from 'pg';

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

```ts filename="src/todos.functions.ts"
import { createServerFn } from '@tanstack/react-start';

import { requireUser } from './auth.functions';
import { pool } from './db.server';

export const listTodos = createServerFn({ method: 'GET' })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const { rows } = await pool.query('SELECT id, title FROM todos WHERE user_id = $1 ORDER BY id', [
      context.user.id,
    ]);
    return rows;
  });
```

Create the pool once at module scope, not inside the handler. A new pool per request opens a new connection per request.

On Vercel Fluid compute, register the pool so idle clients are released before the instance suspends:

```ts filename="src/db.server.ts"
import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
attachDatabasePool(pool);
```

## Neon serverless driver

```bash filename="Terminal"
npm install @neondatabase/serverless
```

The [Neon serverless driver](/docs/serverless/serverless-driver) sends each query over HTTP, with no connection to open or keep alive:

```ts filename="src/todos.functions.ts"
import { neon } from '@neondatabase/serverless';
import { createServerFn } from '@tanstack/react-start';

import { requireUser } from './auth.functions';

const sql = neon(process.env.DATABASE_URL!);

export const listTodos = createServerFn({ method: 'GET' })
  .middleware([requireUser])
  .handler(
    ({ context }) => sql`SELECT id, title FROM todos WHERE user_id = ${context.user.id} ORDER BY id`
  );
```

The tagged template sends `context.user.id` as a query parameter, not as SQL text.

Every server function that reads private data needs session middleware such as `requireUser`, because server functions are reachable directly. See [Neon Auth with TanStack Start and Router](/docs/tanstack/auth).

For interactive transactions, use its `Pool` or `Client` over WebSockets, which is API-compatible with `pg`. Open and close it within the request in serverless environments.

## With Drizzle

Drizzle has an adapter for each driver:

| Driver                                  | Drizzle import                |
| --------------------------------------- | ----------------------------- |
| `pg`                                    | `drizzle-orm/node-postgres`   |
| `@neondatabase/serverless` (HTTP)       | `drizzle-orm/neon-http`       |
| `@neondatabase/serverless` (WebSockets) | `drizzle-orm/neon-serverless` |

See [Postgres with Drizzle for TanStack Start](/docs/tanstack/postgres-drizzle) for the full setup.

---

## Related docs (TanStack)

- [Postgres with Drizzle for TanStack Start](/docs/tanstack/postgres-drizzle)
- [Choosing your connection method](/docs/connect/choose-connection)
- [Neon serverless driver](/docs/serverless/serverless-driver)
- [Connection pooling](/docs/connect/connection-pooling)
- [Connect a TanStack Start application to Neon](/docs/guides/tanstack-start)
