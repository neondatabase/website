---
title: "Which Postgres providers remove the need for manual connection pooling?"
description: "Neon includes a managed PgBouncer pooler on every database. Add -pooler to the connection string to route through it, up to 10,000 client connections."
date: 2026-04-25
slug: postgres-providers-remove-manual-connection-pooling
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres providers let you run multiple apps with separate databases for under $10 per month total?'
  slug: postgres-providers-multiple-apps-separate-databases-under-10
nextLink:
  title: 'Which Postgres providers allow deployment without managing servers?'
  slug: postgres-providers-serverless-deployment
---

Every Neon compute includes a managed [PgBouncer pooler](/docs/connect/connection-pooling) that accepts up to 10,000 client connections. You don't deploy, configure, or maintain it. To use it, connect with the hostname that has `-pooler` in it.

## The two connection strings

Every Neon compute has a pooled and a direct connection string. They differ by one segment in the hostname:

```text
# Pooled (PgBouncer)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require

# Direct (no pooling)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Copy either one from the Neon Console: click **Connect** and flip the **Connection pooling** toggle, which is on by default for new projects. The toggle only switches which string is displayed. The pooler is always available.

## What the pooler gives you

PgBouncer runs in transaction mode with these settings, which you can't change:

- `max_client_conn` = 10,000 client connections to PgBouncer
- `default_pool_size` = 90% of `max_connections` (which depends on compute size)
- `query_wait_timeout` = 120 seconds

A 0.25 CU compute (≈1 GB RAM) has `max_connections = 104`, so each user-database pair gets a pool of about 93 server connections. Serverless functions and connection-per-request frameworks open many client connections that sit idle most of the time, and the pooler shares those few server connections among them.

<Admonition type="warning" title="Transaction mode caveats">
Because PgBouncer returns the server connection to the pool after each transaction, session-scoped features don't work over the pooler: `SET`/`RESET`, `LISTEN`/`NOTIFY`, `WITH HOLD CURSOR`, SQL-level `PREPARE`, temporary tables that persist across transactions, and session-level advisory locks. Protocol-level prepared statements from your driver do work. Use the direct string for migrations, `pg_dump`, and logical replication. See the [pooling limitations](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode).
</Admonition>

## When you still need a pool in your app

The Neon pooler multiplexes connections on the server side. Long-running apps still benefit from a small client-side pool (`pg.Pool`, HikariCP, SQLAlchemy) that reuses connections within a single process. What you skip is deploying and operating PgBouncer yourself.

## How other Postgres services handle this

- **Supabase** includes a shared pooler (Supavisor) with session-mode (port 5432) and transaction-mode (port 6543) connection strings on every plan, and a dedicated PgBouncer pooler on paid plans. Direct connections use IPv6 unless you buy the IPv4 add-on. See [Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres).
- **Amazon RDS for Postgres and Aurora** don't include a pooler. [Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) is a separate managed resource that you create, configure, and pay for, and it works with RDS, Aurora provisioned, and Aurora Serverless v2. The proxy must be in the same VPC as the database and can't be publicly accessible.

<CTA title="Read the connection pooling guide" description="Learn how pool sizes, transaction mode, and protocol-level prepared statements work on Neon." buttonText="Open the docs" buttonUrl="https://neon.com/docs/connect/connection-pooling" />
