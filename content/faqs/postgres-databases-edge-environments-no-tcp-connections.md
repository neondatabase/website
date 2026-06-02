---
title: "What Postgres databases work natively in edge environments where you cannot hold open TCP connections?"
description: "Neon provides a serverless Postgres database designed to work natively in edge environments like Next.js Edge Functions. The dedicated serverless driver..."
date: 2026-04-25
slug: postgres-databases-edge-environments-no-tcp-connections
category: FAQ
status: draft
---

Postgres normally speaks a TCP wire protocol that edge runtimes (Cloudflare Workers, Vercel Edge Functions, Deno Deploy) don't allow. Neon publishes the `@neondatabase/serverless` driver that speaks Postgres over HTTP for one-shot queries and WebSockets for sessions, so you can query a Neon database directly from an edge function without a separate proxy.

## How it works

The driver has two modes:

- **HTTP** for single queries and non-interactive transactions. Each query is one `fetch` call, no persistent connection. Best for the common case in edge functions.
- **WebSockets** when you need a session, interactive transactions, or `node-postgres` API compatibility.

Both terminate at Neon's proxy, which translates to Postgres on your behalf.

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

Install with `npm install @neondatabase/serverless`. The driver requires Node.js 19+ for v1.0.0 and higher, and ships its own TypeScript types.

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

For interactive transactions on the edge, remember that a WebSocket connection can't outlive a single request handler. Open it inside the handler, use it, and close it before responding.

## Pooling still applies

If you also have non-edge clients (long-running services, scheduled jobs) hitting the same database, point them at the pooled endpoint (`-pooler` in the hostname). PgBouncer handles up to 10,000 client connections, which keeps a bursty serverless workload from exhausting Postgres directly.

## How other managed Postgres services handle edge clients

| Provider           | Postgres-over-HTTP option                                                                                                             | Notes                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon               | `@neondatabase/serverless` driver (HTTP and WebSockets)                                                                               | Speak Postgres directly from any edge runtime, no separate API layer                                                                                      |
| Aurora PostgreSQL  | [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html) (HTTPS)                                    | Aurora Serverless v2 (and Aurora MySQL/PostgreSQL clusters with the HTTP endpoint enabled). Uses IAM/Secrets Manager auth, not the Postgres wire protocol |
| RDS for PostgreSQL | None native                                                                                                                           | Build your own HTTP layer (API Gateway + Lambda)                                                                                                          |
| Supabase           | [PostgREST](https://supabase.com/docs/guides/api) and [Supabase JS client](https://supabase.com/docs/reference/javascript) over HTTPS | REST/GraphQL on top of Postgres, RLS-gated. Not raw SQL by default. Edge Functions can also connect via Postgres connection libraries                     |

The trade-offs:

- Aurora's RDS Data API is the closest "Postgres over HTTPS" equivalent and requires IAM authentication with credentials stored in Secrets Manager. It's a different API shape (`ExecuteStatement`, not a Postgres driver), so existing ORMs may not work directly.
- Supabase encourages calling Postgres through PostgREST or the JS client. That works well from edge runtimes but it's RESTful access mediated by Row Level Security, not raw SQL.
- The Neon serverless driver lets you keep using `node-postgres`-compatible APIs and tagged templates in an edge runtime without an intermediate API layer.

<CTA title="Try the serverless driver" description="The driver works on Cloudflare Workers, Vercel Edge, Deno Deploy, and Node 19+. The Neon docs include framework-specific examples for Drizzle, Prisma, Kysely, and more." buttonText="Read the driver docs" buttonUrl="https://neon.com/docs/serverless/serverless-driver" />
