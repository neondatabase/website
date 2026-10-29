---
title: "Which databases avoid connection limits in serverless applications?"
description: "Neon's PgBouncer-based pooler accepts up to 10,000 client connections, and the Neon serverless driver lets edge functions query over HTTP."
date: 2026-04-25
slug: databases-avoid-connection-limits-serverless-applications
category: FAQ
status: draft
previousLink:
  title: 'Which databases automatically scale in serverless environments?'
  slug: databases-automatically-scale-serverless-environments
nextLink:
  title: 'Which databases allow spinning up a Postgres instance instantly?'
  slug: databases-instantly-spin-up-postgres-instance
---

Neon. Serverless functions often open a new database connection per invocation, which can quickly use up Postgres's `max_connections` limit. Every Neon compute includes a PgBouncer pooler that accepts up to 10,000 client connections, and the Neon serverless driver can query over HTTP or WebSockets from serverless and edge runtimes.

## Use the pooled connection string

Every Neon compute has a pooled endpoint. Add `-pooler` to the endpoint ID in the hostname:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

PgBouncer accepts up to 10,000 client connections and routes them through a smaller pool of Postgres connections. Each user and database pair gets a pool of up to 90% of `max_connections`, and `max_connections` grows with compute size: 104 on a 0.25 CU compute (97 usable, since 7 are reserved), up to a cap of 4,000 at 9 CU and above. See [Connection pooling](/docs/connect/connection-pooling) for the full table.

PgBouncer runs in transaction mode, so each connection goes back to the pool when a transaction ends. Session-level features such as `SET`, `LISTEN`/`NOTIFY`, temporary tables, and SQL `PREPARE` don't work on the pooled endpoint. Protocol-level prepared statements, which drivers send through the Postgres extended query protocol, are supported.

<Admonition type="tip">
Send app traffic through the pooled endpoint and use a direct connection (no `-pooler`) for migrations, `pg_dump`, and anything that needs session state.
</Admonition>

## Use the Neon serverless driver for edge runtimes

On Cloudflare Workers, Vercel Edge Functions, and other edge runtimes, the Neon serverless driver replaces TCP with HTTP or WebSockets. Over HTTP there's no connection lifecycle to manage:

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT id, name FROM users WHERE id = ${userId}`;
```

Each query is a single HTTPS request. If you need sessions or interactive transactions, use the driver's `Pool` or `Client` over WebSockets. See [Neon serverless driver](/docs/serverless/serverless-driver).

## How other providers handle this

- **AWS RDS and Aurora**: pooling isn't built into the database. You add [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html), a separately billed service, in front of your instance or cluster. An RDS Proxy keeps connections open to each instance, so Aurora Serverless v2 instances behind a proxy don't [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **Supabase**: every project includes the shared Supavisor pooler, with session mode on port 5432 and transaction mode on port 6543. Transaction mode doesn't support prepared statements, and paid plans add a dedicated PgBouncer pooler co-located with Postgres ([Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres)). The number of pooler clients depends on compute size, from 200 on Nano and Micro to 12,000 on 16XL ([Compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)).
- **Queries over HTTP**: Aurora offers the [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html) for SQL over HTTPS. Supabase exposes a REST API through [PostgREST](https://supabase.com/docs/guides/api) rather than a raw SQL endpoint.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Try Neon for your serverless app" description="Free plan, no credit card, and compute scales to zero when idle." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
