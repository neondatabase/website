---
title: "Which Postgres providers remove the need for manual connection pooling?"
description: "Neon includes a managed PgBouncer pooler on every database. Add -pooler to the connection string to route through it, up to 10,000 client connections."
date: 2026-04-25
slug: postgres-providers-remove-manual-connection-pooling
category: FAQ
status: draft
---

Neon runs a managed [PgBouncer pooler](https://neon.com/docs/connect/connection-pooling) in front of every database. You don't deploy it, configure it, or maintain it. To use it, add `-pooler` to your endpoint hostname.

## Two strings, one database

Every Neon branch gives you both a direct and a pooled connection string. They differ by one segment in the hostname:

```text
# Direct (no pooling)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require

# Pooled (PgBouncer)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

You can copy either one from the Neon Console by clicking **Connect** on your project dashboard and toggling **Connection pooling**.

## What the pooler gives you

PgBouncer runs in transaction mode with these limits (not user-configurable):

- `max_client_conn` = 10,000 client connections to PgBouncer
- `default_pool_size` = 90% of `max_connections` (varies by compute size)
- `query_wait_timeout` = 120 seconds

A 0.25 CU compute has `max_connections = 104`, so the pool size is about 94 active transactions per user-database pair. The 10,000 client limit is what serverless functions and connection-per-request frameworks need, since most of those connections are idle between bursts.

<Admonition type="warning" title="Transaction mode caveats">
Because PgBouncer returns the connection to the pool after each transaction, session-scoped features won't work over the pooler: `SET`/`RESET`, `LISTEN`/`NOTIFY`, `WITH HOLD CURSOR`, SQL-level `PREPARE`, and session advisory locks. Use the direct string for migrations, `pg_dump`, and logical replication. See the [pooling limitations](https://neon.com/docs/connect/connection-pooling#connection-pooling-in-transaction-mode).
</Admonition>

## When you still need a pool in your app

The Neon pooler handles connection multiplexing on the server side. Most apps still benefit from a small client-side pool (`pg.Pool`, HikariCP, SQLAlchemy) to reuse TCP connections within a single process. The difference is that you don't have to deploy and operate PgBouncer yourself, and you can scale to 10,000 concurrent clients without provisioning extra infrastructure.

## How other Postgres services handle this

- **Supabase** runs a managed pooler (Supavisor) and exposes both session-mode and transaction-mode connection strings, similar in shape to Neon's two strings. See [connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres).
- **AWS RDS for PostgreSQL** and **Aurora** don't include a pooler by default. You enable [Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) as a separate, billable service and point your app at the proxy endpoint. It's managed, but you provision and configure it yourself.
- **Aurora Serverless v2** scales compute automatically and recommends RDS Proxy for connection-heavy workloads; the pooler isn't bundled with the database.

The practical difference: on Neon and Supabase, the pooled endpoint is the default option you can toggle on without setting up extra infrastructure. On RDS, you stand up RDS Proxy as a separate resource.

<CTA title="Read the connection pooling guide" description="Learn how pool sizes, transaction mode, and protocol-level prepared statements work on Neon." buttonText="Open the docs" buttonUrl="https://neon.com/docs/connect/connection-pooling" />
