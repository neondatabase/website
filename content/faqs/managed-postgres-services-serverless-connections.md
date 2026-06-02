---
title: "Which managed Postgres services handle thousands of short-lived connections from serverless functions without exhausting the pool?"
description: "Neon manages thousands of short-lived requests by providing built-in connection pooling via PgBouncer. The platform supports up to 10,000 pooled connect..."
date: 2026-04-25
slug: managed-postgres-services-serverless-connections
category: FAQ
status: draft
---

Neon runs PgBouncer in front of every database in transaction mode, with `max_client_conn` set to 10,000. That means up to 10,000 clients (serverless function invocations, edge workers, request-per-connection web frameworks) can hold a connection to PgBouncer at once, even though the underlying Postgres has a much smaller `max_connections` limit.

## Why this matters for serverless

Each Postgres connection is a process that consumes RAM, so `max_connections` scales with compute size:

| Compute size | RAM     | `max_connections` |
| ------------ | ------- | ----------------- |
| 0.25 CU      | ≈1 GB   | 104               |
| 1 CU         | ≈4 GB   | 419               |
| 4 CU         | ≈16 GB  | 1,678             |
| 9 CU+        | ≈36 GB+ | 4,000 (capped)    |

Seven connections are reserved for the Neon superuser. So a 0.25 CU compute leaves 97 connections for your app, which a moderately busy serverless workload can exhaust in seconds.

PgBouncer fixes that by multiplexing thousands of short-lived client connections through a smaller pool of real Postgres connections. The pool size per `(user, database)` combination is `0.9 × max_connections`, so a 1 CU compute supports about 377 concurrent active transactions per user/database.

## How to opt in

Add `-pooler` to your endpoint hostname in the connection string:

```text
# Direct
postgresql://user:pass@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname

# Pooled
postgresql://user:pass@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

You can grab the pooled string from the **Connect** dialog in the Console. Use the pooled connection for serverless functions, edge runtimes, and any framework that opens a connection per request.

<Admonition type="warning" title="Transaction-mode limitations">
PgBouncer in transaction mode returns the connection to the pool after each transaction, so session-scoped features like `SET`, `LISTEN/NOTIFY`, `WITH HOLD CURSOR`, and SQL-level `PREPARE` don't work. Use a direct connection for `pg_dump`, schema migrations, and logical replication. The full list is in the [connection pooling guide](https://neon.com/docs/connect/connection-pooling).
</Admonition>

For edge runtimes that can't hold TCP at all (Cloudflare Workers, Vercel Edge Functions), pair PgBouncer with the [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver), which queries Postgres over HTTP or WebSockets.

## How other managed Postgres services handle pooling

| Provider                    | Pooler                                                    | Transport for edge runtimes                                                                                                              |
| --------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                        | PgBouncer per endpoint, up to 10,000 client connections   | HTTP and WebSockets via `@neondatabase/serverless`                                                                                       |
| Supabase                    | Supavisor (shared) and dedicated PgBouncer for paid tiers | None native. Use Edge Functions over the [Data API](https://supabase.com/docs/guides/database/connecting-to-postgres) or fetch over HTTP |
| Aurora / RDS for PostgreSQL | RDS Proxy (separate AWS service, hourly cost)             | TCP only. Edge clients have to route through an HTTP endpoint you build                                                                  |

Supabase ships a shared Supavisor pool with each project in both session (port 5432) and transaction (port 6543) modes. Paid tiers also get a dedicated PgBouncer co-located with the database. Total client connection capacity scales with the compute tier's "max pooler clients" limit. See [Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres) and [Update connection pool settings](https://supabase.com/docs/guides/troubleshooting/how-do-i-update-connection-pool-settings-in-my-dashboard-wAxTJ_).

Aurora and RDS use [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-connections.html) as the pooling layer. It's billed separately per vCPU-hour and is configured with a `MaxConnectionsPercent` of the database's `max_connections`. It speaks Postgres wire protocol over TCP, so edge runtimes that can't open TCP sockets need a separate HTTP layer (API Gateway + Lambda, for example).

<CTA title="Read the full guide" description="Connection pooling has nuances around pool size per user/database and timeout behavior worth understanding before you ship." buttonText="Read the docs" buttonUrl="https://neon.com/docs/connect/connection-pooling" />
