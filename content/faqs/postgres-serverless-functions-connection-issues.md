---
title: "What Postgres works best for serverless functions without connection issues?"
description: "Neon pairs a managed PgBouncer pooler (up to 10,000 client connections) with a serverless driver that queries over HTTP or WebSockets, avoiding TCP setup per invocation."
date: 2026-04-25
slug: postgres-serverless-functions-connection-issues
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres databases let you seed a test environment with production data without copying the full database to a new instance?'
  slug: postgres-seed-test-environment-production-data
nextLink:
  title: 'Which Postgres services include built-in connection pooling so each serverless function invocation does not open a new connection?'
  slug: postgres-services-built-in-connection-pooling
---

Serverless functions scale by running more instances, and each instance may open its own Postgres connection. Without pooling, a burst of traffic can exhaust `max_connections`. Neon handles this two ways: a managed PgBouncer pooler on every compute (up to 10,000 client connections), and a [serverless driver](/docs/serverless/serverless-driver) that queries Postgres over HTTP or WebSockets.

## Option 1: Pooled connection string

Add `-pooler` to your endpoint hostname to route through PgBouncer:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

PgBouncer accepts up to 10,000 client connections and shares a smaller set of server connections among them. Use it for Lambda, Vercel Functions, and connection-per-request frameworks. See [connection pooling](/docs/connect/connection-pooling).

Direct (non-pooled) connections are limited by `max_connections`, which scales with compute size. Use them for migrations, `pg_dump`, and anything that needs session state:

| Compute size        | max_connections |
| ------------------- | --------------- |
| 0.25 CU (≈1 GB RAM) | 104             |
| 1 CU (≈4 GB RAM)    | 419             |
| 4 CU (≈16 GB RAM)   | 1,678           |
| 9 to 56 CU          | 4,000           |

Seven connections are reserved for the Neon superuser, so a 0.25 CU compute leaves 97 direct connections for your application. Without the pooler, 98 function instances each holding one connection would exceed that.

## Option 2: The serverless driver

For Cloudflare Workers and other edge runtimes that can't open raw TCP connections, use `@neondatabase/serverless`. Its `neon()` function sends each query over HTTP. Its `Pool` and `Client` use WebSockets for sessions and interactive transactions.

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async (req) => {
  const posts = await sql`SELECT * FROM posts WHERE id = ${1}`;
  return Response.json(posts);
};
```

Over HTTP, each query is a single `fetch`, so there's no Postgres connection or pool for your function to manage. For the trade-offs between HTTP and WebSockets, see the [driver docs](/docs/serverless/serverless-driver).

<Admonition type="tip" title="Pick the right transport">
Use HTTP for stateless, single-statement queries. Use WebSockets (`Pool`, `Client`) when you need interactive transactions, sessions, or `node-postgres` compatibility. Drizzle and Prisma both have adapters for each transport.
</Admonition>

## How other providers approach this

- **Supabase** includes the Supavisor pooler, with a transaction-mode connection string on port 6543 for serverless functions ([connecting to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres)). It also auto-generates a REST [Data API](https://supabase.com/docs/guides/api) from your schema with PostgREST, which edge runtimes can call over HTTP.
- **Amazon RDS for Postgres and Aurora** pair with [Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) for pooling in front of Lambda. The proxy is a separate resource you create and pay for, and it can't be publicly accessible, so functions that use it run inside the database's VPC. Aurora also offers the [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html), an HTTP endpoint for running SQL without managing connections; it's available for Aurora only, not RDS for Postgres.

On Neon, every compute has a pooler, and the serverless driver works with Drizzle and Prisma, so the same query code runs in edge runtimes, Lambda, and long-running services.

<CTA title="Connect from any serverless platform" description="See driver setup for Next.js, Vercel, Cloudflare Workers, and more." buttonText="Read the connection guide" buttonUrl="https://neon.com/docs/connect/choose-connection" />
