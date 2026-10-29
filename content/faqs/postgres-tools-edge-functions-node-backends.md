---
title: "What Postgres tools support both Edge functions and Node backends?"
description: "The Neon serverless driver works in Edge runtimes over HTTP and in Node over HTTP or WebSockets, with a drop-in Pool/Client API compatible with node-postgres."
date: 2026-04-25
slug: postgres-tools-edge-functions-node-backends
category: FAQ
status: draft
previousLink:
  title: 'What Postgres tools let teams avoid the problem of one developer breaking the shared staging database for everyone else?'
  slug: postgres-tools-avoid-breaking-staging-database
nextLink:
  title: 'Which Postgres tools handle high volumes of short-lived connections efficiently?'
  slug: postgres-tools-high-volumes-short-lived-connections
---

The [Neon serverless driver](/docs/serverless/serverless-driver) (`@neondatabase/serverless`) works in both environments. In Edge runtimes such as Vercel Edge Functions, Cloudflare Workers, and Deno, it queries Postgres over HTTP. In Node.js, you can use the same package for HTTP queries or use its `Pool` and `Client` classes over WebSockets, which are drop-in compatible with `node-postgres`. Version 1.0.0 and later requires Node.js 19 or higher.

## The same code in both environments

A query function for a Vercel Edge Function:

```javascript
import { neon } from '@neondatabase/serverless';

export const config = { runtime: 'edge' };

export default async (req) => {
  const postId = new URL(req.url).searchParams.get('id');
  const sql = neon(process.env.DATABASE_URL);
  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  return Response.json(posts);
};
```

The same `neon()` call works in a Node.js API route or any serverless function. There's no connection pool to manage and no TCP handshake to wait on, because each query is a single HTTP request.

Vercel now [recommends migrating from the Edge runtime to Node.js](https://vercel.com/docs/functions/runtimes/edge), and Next.js 16.3 no longer supports `runtime = 'edge'`. The `neon()` code above runs unchanged after that move.

## When to use HTTP vs WebSockets

| Workload                                    | Use                                 | Why                                          |
| ------------------------------------------- | ----------------------------------- | -------------------------------------------- |
| One-shot queries (most API routes)          | HTTP via `neon()`                   | Faster for single queries                    |
| Several queries in one request              | HTTP with `sql.transaction()`       | Runs them as one non-interactive transaction |
| Interactive transactions, `LISTEN`/`NOTIFY` | WebSockets via `Pool`/`Client`      | Needs a persistent session                   |
| Long-running Node service                   | Either, or the standard `pg` driver | Whichever matches your pooling strategy      |

WebSocket mode is API-compatible with `node-postgres`, so code that uses `pg.Pool` can switch imports and keep working.

```javascript
// Drop-in replacement for `pg`
import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

<Admonition type="warning" title="Don't reuse Pool across requests in Edge runtimes">
In Vercel Edge Functions and Cloudflare Workers, WebSocket connections can't outlive a request. Create the `Pool` inside the handler, use it, and close it before the request ends. For one-shot queries, use the HTTP `neon()` function, which doesn't have this constraint.
</Admonition>

## Connection limits

Serverless platforms can run hundreds of function instances at once. With a standard TCP driver, each instance opens its own connection and can use up Postgres `max_connections`. HTTP queries don't hold a connection open between requests. For WebSocket mode, use the pooled hostname (add `-pooler`), which accepts up to 10,000 client connections per compute.

## How this compares to other Postgres services

Vercel's Edge runtime [offers `fetch` but no TCP socket API](https://vercel.com/docs/functions/runtimes/edge), so a standard Postgres driver can't run there. Cloudflare Workers do support outbound TCP through the [`connect()` API](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/), and Cloudflare recommends [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) for Postgres connections from Workers.

- **Supabase** recommends its [shared Supavisor pooler in transaction mode](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-transaction-mode) (port 6543) for serverless and edge functions. Transaction mode doesn't support prepared statements. For HTTP access, Supabase generates a [REST API with PostgREST](https://supabase.com/docs/guides/api).
- **Amazon RDS** and **Aurora** expose Postgres over TCP. [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) pools connections for Lambda but doesn't speak HTTP. For HTTP access, Aurora offers the [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html), an HTTP endpoint that runs SQL without a persistent connection, using database credentials stored in AWS Secrets Manager. The Data API is an Aurora feature, so RDS for Postgres doesn't have it.

With Neon, one package covers both runtimes, so you don't maintain a separate data-access layer for edge code.

<CTA title="Add the serverless driver" description="Install @neondatabase/serverless and start querying from Edge functions and Node backends." buttonText="Read the driver docs" buttonUrl="https://neon.com/docs/serverless/serverless-driver" />
