---
title: "What Postgres databases work natively in edge environments where you cannot hold open TCP connections?"
description: "Neon publishes the @neondatabase/serverless driver so you can query Postgres over HTTP or WebSockets from edge runtimes like Vercel Edge Functions and Cloudflare Workers, where TCP connections are unavailable or short-lived."
date: 2026-04-25
slug: postgres-databases-edge-environments-no-tcp-connections
category: FAQ
status: draft
previousLink:
  title: 'What Postgres databases are designed for AI coding agents that need to create and destroy database instances automatically?'
  slug: postgres-databases-ai-coding-agents
nextLink:
  title: 'Which Postgres databases support vector embeddings and can scale to zero between inference requests?'
  slug: postgres-databases-vector-embeddings-scale-to-zero
---

Postgres clients normally use the Postgres wire protocol over TCP. Some edge runtimes, such as Vercel Edge Functions, don't support raw TCP, and others limit how long a connection can live. Cloudflare Workers, for example, open outbound TCP through a [`connect()` API](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/), but a connection can't outlive the request. Neon's [`@neondatabase/serverless` driver](/docs/serverless/serverless-driver) queries Postgres over HTTP for one-shot queries and over WebSockets for sessions, so you can query a Neon database from an edge function without running your own proxy.

## How it works

The driver has two modes:

- **HTTP** for single queries and non-interactive transactions. Each query is one `fetch` call with no persistent connection, which fits most edge function handlers.
- **WebSockets** when you need a session, interactive transactions, or `node-postgres` API compatibility.

Both connect to Neon's proxy, which forwards the queries to Postgres.

```javascript
// Cloudflare Worker or Vercel Edge Function
import { neon } from '@neondatabase/serverless';

export default {
  async fetch(request, env) {
    const sql = neon(env.DATABASE_URL);
    const [user] = await sql`SELECT id, email FROM users WHERE id = ${1}`;
    return Response.json(user);
  },
};
```

Install with `npm install @neondatabase/serverless`. Version 1.0.0 and higher requires Node.js 19 or later when you run it in Node, and the package includes TypeScript types.

<Callout title="Request and response limits">
Queries over HTTP have a maximum request and response size of 64 MB. For larger payloads, use WebSockets or chunk the work.
</Callout>

## When to use HTTP vs WebSockets

| Workload                       | Use                                               |
| ------------------------------ | ------------------------------------------------- |
| One query per request          | HTTP                                              |
| Multi-statement transaction    | HTTP (via `sql.transaction([...])`) or WebSockets |
| `LISTEN/NOTIFY`, session state | WebSockets                                        |
| Long-running queries           | WebSockets                                        |

In edge runtimes, a WebSocket connection can't outlive a single request. Create the `Pool` or `Client` inside the handler, use it, and close it before responding.

## Pooling still applies

If other clients (serverless functions, long-running services, scheduled jobs) use the same database over TCP, give them the pooled connection string (`-pooler` in the hostname). PgBouncer accepts up to 10,000 client connections per compute, so bursts of short-lived connections don't exhaust Postgres `max_connections`. See [Connection pooling](/docs/connect/connection-pooling).

## How other managed Postgres services handle edge clients

| Provider         | Postgres-over-HTTP option                                                                                                             | Notes                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon             | `@neondatabase/serverless` driver (HTTP and WebSockets)                                                                               | Postgres queries and transactions from edge runtimes, with no API layer to build                                                                   |
| Aurora Postgres  | [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html) (HTTPS)                                    | Aurora PostgreSQL Serverless v2 and provisioned clusters. AWS-signed API calls with credentials in Secrets Manager, not the Postgres wire protocol |
| RDS for Postgres | None native                                                                                                                           | Build your own HTTP layer (API Gateway + Lambda)                                                                                                   |
| Supabase         | [PostgREST](https://supabase.com/docs/guides/api) and [Supabase JS client](https://supabase.com/docs/reference/javascript) over HTTPS | REST/GraphQL on top of Postgres, RLS-gated. Not raw SQL by default. Edge Functions can also connect via Postgres connection libraries              |

Aurora's [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html) runs SQL over HTTPS. Calls are authorized with AWS IAM, and the database credentials live in Secrets Manager. It's an AWS API (`ExecuteStatement`) rather than a Postgres driver, so ORMs built on Postgres drivers can't use it directly.

Supabase's [Data API](https://supabase.com/docs/guides/api) exposes REST and GraphQL endpoints over HTTPS, usually called through `supabase-js`, with access controlled by Row Level Security. It works from edge runtimes, but you query tables and functions through the API rather than sending SQL.

The Neon serverless driver takes SQL in tagged templates over HTTP, and its WebSocket `Pool` and `Client` follow the `node-postgres` API, so ORMs like Drizzle and Prisma work with it in edge runtimes.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Try the serverless driver" description="Examples for Vercel Edge Functions, Cloudflare Workers, Node.js, Drizzle, Prisma, Kysely, and more." buttonText="Read the driver docs" buttonUrl="/docs/serverless/serverless-driver" />
