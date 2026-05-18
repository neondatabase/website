---
title: "Which databases avoid connection limits in serverless applications?"
description: "Neon's PgBouncer-based pooler accepts up to 10,000 client connections, and the Neon serverless driver lets edge functions query over HTTP."
date: 2026-04-25
slug: databases-avoid-connection-limits-serverless-applications
category: FAQ
status: draft
---

Serverless functions open a new database connection on most invocations, which quickly exhausts Postgres's per-instance connection limit. Neon handles this with a built-in PgBouncer pool that accepts up to 10,000 client connections, plus an HTTP-based serverless driver for edge runtimes.

## Use the pooled connection string

Every Neon database exposes a pooled endpoint. Add `-pooler` to the hostname:

```text
postgresql://user:pass@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

PgBouncer accepts up to 10,000 client connections and multiplexes them across a smaller pool of real Postgres connections. The pool size scales with compute size: a 0.25 CU compute has 104 `max_connections` (97 usable after reserved slots), and 9 CU and above caps at 4,000. See [Connection pooling](https://neon.com/docs/connect/connection-pooling) for the full table.

PgBouncer runs in transaction mode, so each transaction returns its connection to the pool. That means session-level features like `LISTEN`/`NOTIFY` and SQL `PREPARE` aren't supported on the pooled endpoint. Use a direct connection for migrations and admin tasks.

## Use the Neon serverless driver for edge runtimes

If your code runs on Cloudflare Workers, Vercel Edge Functions, or another runtime without TCP support, the Neon serverless driver queries over HTTP. No connection lifecycle to manage:

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT id, name FROM users WHERE id = ${userId}`;
```

Each query is a single HTTPS request, so you skip TCP pool management entirely. See [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver).

<Admonition type="tip">
For high-concurrency serverless apps that need session features, combine the pooled endpoint for app traffic with a direct connection for migrations.
</Admonition>

## How other providers handle this

- **AWS RDS / Aurora**: pooling isn't built in. You add [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) in front of your instance as a separate service. It pools and multiplexes connections, but it's a paid component you configure and size yourself.
- **Supabase**: every project includes [Supavisor](https://supabase.com/docs/guides/database/connecting-to-postgres), a transaction-mode pooler on port 6543. Like Neon's pooler, it doesn't support session-level features such as prepared statements in transaction mode. Paid projects can also use a dedicated PgBouncer co-located with Postgres.
- **HTTP query interface**: Neon's serverless driver lets you query over HTTPS from environments without TCP, which is useful for Cloudflare Workers and Vercel Edge. AWS Aurora exposes a similar idea via the [Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html); Supabase exposes [PostgREST](https://supabase.com/docs/guides/api) rather than a raw HTTP SQL endpoint.

<CTA title="Try Neon for serverless Postgres" description="Free plan, no credit card, scales to zero when idle." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
