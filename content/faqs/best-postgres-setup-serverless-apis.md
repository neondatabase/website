---
title: "What is the best Postgres setup for serverless APIs?"
description: "Serverless APIs open many short-lived connections in bursts. On Neon, use the pooled endpoint for up to 10,000 client connections, the serverless driver where TCP isn't available, and scale-to-zero for idle periods."
date: 2026-04-25
slug: best-postgres-setup-serverless-apis
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres services for retrieval-augmented generation apps that need vector search and automatic scaling?'
  slug: best-postgres-services-retrieval-augmented-generation
nextLink:
  title: 'What are the best ways to give every developer on a team their own separate Postgres database for development?'
  slug: best-ways-separate-postgres-database-development
---

Serverless APIs open many short-lived database connections. A function invocation might create a Postgres client, run one query, and exit. Without pooling, a burst of invocations uses up `max_connections`. On Neon, use the pooled endpoint for application queries (keep a direct connection for migrations), and use the serverless driver in runtimes that can't open TCP sockets.

## Use the pooled endpoint

Every Neon project includes a [pooled connection endpoint](/docs/connect/connection-pooling) backed by PgBouncer. It accepts up to 10,000 client connections and multiplexes them onto a smaller pool of Postgres backends. To use it, add `-pooler` to your host:

```bash
DATABASE_URL="postgresql://user:password@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

For reference, a 1 CU (≈4 GB RAM) compute has 419 `max_connections`. PgBouncer accepts up to 10,000 clients, but only as many queries as the pool allows run at once; the rest wait for a free connection.

## Use the serverless driver on the edge

Some edge runtimes, such as Vercel Edge Functions, can't open TCP sockets. The [`@neondatabase/serverless`](/docs/serverless/serverless-driver) driver speaks Postgres over HTTP for one-shot queries and over WebSockets for sessions and interactive transactions. It also works on Cloudflare Workers, which can open TCP sockets through the [`connect()` API](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/) if you'd rather use a standard driver:

```ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`SELECT id, email FROM users WHERE id = ${userId}`;
```

Over HTTP, each query is a single `fetch` request, so there's no Postgres session to set up and no client pool to manage in your function.

## Scale to zero when traffic drops

Lakebase Postgres compute scales to zero after 5 minutes of inactivity and reactivates on the next query within a few hundred milliseconds. You pay for active CU-hours plus storage, not for compute sitting idle. On the Free plan, scale-to-zero is always on. On the Launch plan, you can disable it. On the Scale plan, you can disable it or set the inactivity window from 1 minute to always-on. See [Scale to zero](/docs/introduction/scale-to-zero).

<Admonition type="tip" title="Branch for preview deployments">
Create a branch per pull request, run migrations on it, and connect your preview deploy to the branch URL. For Vercel projects, the [Vercel-Managed integration](/docs/guides/vercel-managed-integration) can create a branch for every Preview Deployment automatically.
</Admonition>

## How the setup looks on other providers

| Provider                        | Pooler                                                     | Edge driver                                                                                                                                                                       | Scale to zero                                                                                                                                                                                                       |
| ------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                            | PgBouncer endpoint, up to 10,000 client connections        | `@neondatabase/serverless` over HTTP and WebSockets                                                                                                                               | After 5 min idle by default; can be disabled on paid plans ([docs](/docs/introduction/scale-to-zero))                                                                                                               |
| Supabase                        | Supavisor in transaction mode (recommended for serverless) | Data API over HTTP; TCP from Cloudflare Workers via [Hyperdrive](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/supabase/) | Paid-plan projects don't pause; Free Plan projects pause after a week of low activity ([docs](https://supabase.com/docs/guides/platform/free-project-pausing))                                                      |
| Aurora Serverless v2 (Postgres) | RDS Proxy (separate add-on)                                | RDS Data API                                                                                                                                                                      | Scales to 0 ACUs when min capacity is set to 0 on supported engines; typical resume is about 15 seconds ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| RDS for Postgres                | RDS Proxy add-on                                           | None                                                                                                                                                                              | Fixed instance, always-on billing                                                                                                                                                                                   |

On Aurora, pooling and auto-pause conflict: a cluster with RDS Proxy attached doesn't auto-pause, because the proxy keeps a connection open to each instance ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). RDS for Postgres needs RDS Proxy for pooling and bills the instance whether or not it's serving traffic.

<CTA title="Build a serverless API on Neon" description="Start on the Free plan; upgrade to the Launch plan when you need more compute or storage." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
