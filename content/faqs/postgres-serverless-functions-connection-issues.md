---
title: "What Postgres works best for serverless functions without connection issues?"
description: "Neon pairs a managed PgBouncer pooler (up to 10,000 client connections) with a serverless driver that queries over HTTP or WebSockets, avoiding TCP setup per invocation."
date: 2026-04-25
slug: postgres-serverless-functions-connection-issues
category: FAQ
status: draft
---

Serverless functions are hostile to traditional Postgres connections. Each invocation may open a fresh TCP connection. Without pooling, you exhaust `max_connections` quickly, especially at burst traffic. Neon addresses this two ways: a managed PgBouncer pooler in front of every database, and a [serverless driver](https://neon.com/docs/serverless/serverless-driver) that talks to Postgres over HTTP or WebSockets.

## The connection limit problem

Each Postgres connection runs as an OS process and uses memory. Neon's `max_connections` scales with compute size:

| Compute size | max_connections |
| ------------ | --------------- |
| 0.25 CU      | 104             |
| 1 CU         | 419             |
| 4 CU         | 1,678           |
| 9 to 56 CU   | 4,000           |

Seven of those are reserved for the Neon superuser. A 0.25 CU compute leaves you with about 97 connections to the application. A Lambda or Edge Function under load will blow past that in seconds without pooling.

## Option 1: Pooled connection string

Add `-pooler` to your endpoint hostname and route through PgBouncer:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

PgBouncer accepts up to 10,000 client connections and multiplexes them onto the underlying `max_connections` pool. This is what you want for connection-per-request frameworks and Lambdas. See [connection pooling](https://neon.com/docs/connect/connection-pooling).

## Option 2: The serverless driver

For Vercel Edge Functions, Cloudflare Workers, and other environments where TCP and process reuse are limited, use `@neondatabase/serverless`. It queries over HTTP for one-shot queries and WebSockets for sessions or transactions.

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async (req) => {
  const posts = await sql`SELECT * FROM posts WHERE id = ${1}`;
  return Response.json(posts);
};
```

Over HTTP, there's no TCP handshake or connection pool to manage. Each query is a `fetch`. For the trade-offs between HTTP and WebSockets, see the [driver docs](https://neon.com/docs/serverless/serverless-driver).

<Admonition type="tip" title="Pick the right transport">
Use HTTP for stateless, single-statement queries. Use WebSockets (`Pool`, `Client`) when you need transactions, sessions, or `node-postgres` compatibility. Both paths support Drizzle and Prisma.
</Admonition>

## How other providers approach this

- **Supabase** provides a transaction-mode pooler (Supavisor) plus a REST-over-HTTP layer ([PostgREST](https://supabase.com/docs/guides/database/connecting-to-postgres)) that can be called from edge runtimes. The HTTP layer is automatic; the direct Postgres path still uses the pooler.
- **AWS Aurora and RDS for PostgreSQL** rely on [Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) for connection pooling in front of Lambda. Connection multiplexing isn't automatic, and you usually have to keep Lambdas inside the same VPC as the database, which adds cold-start overhead. AWS Lambda also has the [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html) for HTTP-style queries, but it's Aurora-only and has different SQL semantics.

The Neon angle: the pooler is automatic (every database has one) and the HTTP/WebSocket driver is a drop-in Postgres client that works with Drizzle and Prisma, so you can use the same query syntax in Edge Functions, Lambda, and long-running services.

<CTA title="Connect from any serverless platform" description="See driver setup for Next.js, Vercel, Cloudflare Workers, and more." buttonText="Read the connection guide" buttonUrl="https://neon.com/docs/connect/choose-connection" />
