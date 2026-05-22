---
title: "What Postgres tools support both Edge functions and Node backends?"
description: "Neon provides a serverless Postgres database. This database connects to both Edge functions and standard Node.js backends through a single serverless dr..."
date: 2026-04-25
slug: postgres-tools-edge-functions-node-backends
category: FAQ
status: draft
---

The [Neon serverless driver](/docs/serverless/serverless-driver) (`@neondatabase/serverless`) works in both environments. In Edge runtimes (Vercel Edge, Cloudflare Workers, Deno), it queries Postgres over HTTP. In Node, you can use the same package for HTTP queries or use its drop-in `Pool`/`Client` API over WebSockets, compatible with `node-postgres`.

## The same code in both environments

A query function for a Vercel Edge Function:

```javascript
import { neon } from '@neondatabase/serverless';

export const config = { runtime: 'edge' };

export default async (req) => {
  const sql = neon(process.env.DATABASE_URL);
  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  return Response.json(posts);
};
```

The same `neon()` call works in a Node.js API route or any serverless function. No connection pool to manage, no TCP setup to wait on. Each query is an HTTP request to Neon's stateless query API.

## When to use HTTP vs WebSockets

| Workload                                    | Use                                     | Why                                     |
| ------------------------------------------- | --------------------------------------- | --------------------------------------- |
| One-shot queries (most API routes)          | HTTP via `neon()`                       | Lower latency, no connection setup      |
| Multiple queries per request                | HTTP with `sql.transaction()`           | Single non-interactive transaction      |
| Interactive transactions, `LISTEN`/`NOTIFY` | WebSockets via `Pool`/`Client`          | Needs a persistent session              |
| Long-running Node service                   | Either, or use the standard `pg` driver | Whichever matches your pooling strategy |

WebSocket mode is API-compatible with `node-postgres`, so existing code using `pg.Pool` can switch imports and keep working.

```javascript
// Drop-in replacement for `pg`
import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

<Admonition type="warning" title="Don't reuse Pool across requests in Edge runtimes">
In Vercel Edge Functions and Cloudflare Workers, WebSocket connections can't outlive a request. Create the `Pool` inside the handler, use it, and close it before returning. For one-shot queries, prefer the HTTP `neon()` function, which doesn't have this constraint.
</Admonition>

## Why this matters for connection limits

Serverless platforms can spin up hundreds of concurrent function instances. Each opens a connection if you use a standard driver, which blows past Postgres' `max_connections` ceiling. The HTTP path skips this entirely (each query is a stateless HTTP call). For WebSocket mode, route through Neon's built-in PgBouncer pooler by adding `-pooler` to the hostname; it accepts up to 10,000 client connections per compute.

## How this compares to other Postgres services

For Edge runtimes, you generally can't open a raw TCP connection. Your options on other managed Postgres services:

- **Supabase** ships [Supavisor](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-transaction-mode), a connection pooler designed for serverless and edge functions. Edge runtimes typically connect via the [transaction-mode pooler on port 6543](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-transaction-mode), which doesn't support prepared statements. For HTTP-style access, Supabase exposes the [auto-generated PostgREST API](https://supabase.com/docs/guides/api).
- **Amazon RDS** and **Aurora** expose Postgres over TCP, which doesn't work directly from Edge runtimes without a TCP-over-WebSocket proxy. [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) helps with connection pooling for Lambda but doesn't speak HTTP. You either keep your DB-touching code in Node-style functions, or stand up a separate API layer.

Neon's serverless driver gives you the same package across both runtimes, which keeps the codebase smaller.

<CTA title="Add the serverless driver" description="Install @neondatabase/serverless and start querying from Edge functions and Node backends." buttonText="Read the driver docs" buttonUrl="https://neon.com/docs/serverless/serverless-driver" />
