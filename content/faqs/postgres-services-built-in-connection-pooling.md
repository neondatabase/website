---
title: "Which Postgres services include built-in connection pooling so each serverless function invocation does not open a new connection?"
description: "Every Neon compute runs PgBouncer. Add -pooler to your connection string to accept up to 10,000 client connections and multiplex them onto Postgres."
date: 2026-04-25
slug: postgres-services-built-in-connection-pooling
category: FAQ
status: draft
previousLink:
  title: 'What Postgres works best for serverless functions without connection issues?'
  slug: postgres-serverless-functions-connection-issues
nextLink:
  title: 'What Postgres services let you cap your maximum monthly spend while still getting autoscaling during traffic spikes?'
  slug: postgres-services-capping-monthly-spend-autoscaling
---

Every Neon compute includes a managed PgBouncer pooler. You don't deploy, scale, or configure it. To use it, switch your connection string to the pooled hostname.

## The two connection strings

Each Neon compute exposes a pooled and a direct hostname. They differ by one segment:

```text
# Pooled connection (up to 10,000 client connections)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require

# Direct connection (limited by max_connections for the compute size)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

For AWS Lambda, Vercel Functions, Cloudflare Workers, or any connection-per-request framework, use the pooled string. The pooled endpoint is always available; the **Connection pooling** toggle in the Console's **Connect** modal only switches which string it shows.

## Connection limits under load

Postgres limits direct connections based on RAM. On a 0.25 CU compute (≈1 GB RAM), `max_connections` is 104, with 7 reserved for the superuser. A burst of 200 function invocations using direct connections would hit that limit and get "too many connections" errors.

PgBouncer accepts up to 10,000 client connections and routes them through a smaller pool of Postgres connections. Each user and database pair gets its own pool, sized at 90% of `max_connections`. Because transaction mode returns a Postgres connection to the pool as soon as each transaction ends, many idle or short-lived clients can share a few hundred real connections. If every pool slot is busy, new queries wait in a queue for up to 2 minutes (`query_wait_timeout`) before failing.

See [Connection pooling](/docs/connect/connection-pooling) for the full limits and timeouts.

## What transaction mode doesn't support

Neon's PgBouncer runs in transaction mode, so session-scoped features don't work on pooled connections:

- `SET` and `RESET` (session variables, including `search_path`)
- `LISTEN` and `NOTIFY`
- `WITH HOLD` cursors
- SQL-level `PREPARE` and `DEALLOCATE`
- Temporary tables that persist across transactions
- Session-level advisory locks

To work around this, set `search_path` at the role level with `ALTER ROLE ... SET search_path`, fully qualify schema names in queries, or use the direct connection string for tools that need session state (`pg_dump`, migrations, logical replication).

<Admonition type="tip" title="Protocol-level prepared statements work">
Neon's PgBouncer supports protocol-level prepared statements (PgBouncer 1.22.0 and later), up to 1,000 per connection. Drivers that prepare statements through the extended query protocol keep working through the pooler. Only SQL-level `PREPARE` is blocked.
</Admonition>

## How this compares across providers

| Provider             | Pooler                                                                                                                                                                                                                                                                                                         | Setup                                                             | Notes                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Neon                 | Managed PgBouncer on every compute, transaction mode                                                                                                                                                                                                                                                           | Add `-pooler` to the hostname                                     | Up to 10,000 client connections                                                                                               |
| Supabase             | [Shared Supavisor pooler](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-transaction-mode) in transaction mode (port 6543) or session mode (port 5432), plus a [dedicated PgBouncer](https://supabase.com/docs/guides/database/connecting-to-postgres#dedicated-pooler) on paid plans | Copy the pooler connection string from the dashboard              | Pooler client limits scale with compute size ([compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)) |
| AWS RDS for Postgres | [Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html), a separate service                                                                                                                                                                                                  | Provision a proxy, attach it to the instance, point the app at it | [Billed per vCPU-hour](https://aws.amazon.com/rds/proxy/pricing/) of the target instance                                      |
| Aurora Serverless v2 | RDS Proxy, a separate service                                                                                                                                                                                                                                                                                  | Same as RDS                                                       | [Billed per ACU-hour](https://aws.amazon.com/rds/proxy/pricing/) consumed by the target                                       |

Neon and Supabase both include a pooler with every database, so you don't run your own. On AWS, RDS Proxy provides pooling as a separate resource that you set up and pay for.

<CTA title="See pooling in action" description="Read how Neon's PgBouncer config handles per-user pools, connection lifecycle, and compute restarts." buttonText="Open the docs" buttonUrl="https://neon.com/docs/connect/connection-pooling" />
