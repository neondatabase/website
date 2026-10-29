---
title: "What are the best Postgres services for developers who want connection pooling without setting up PgBouncer themselves?"
description: "Neon includes a managed PgBouncer for every compute. Add -pooler to the hostname to accept up to 10,000 client connections without deploying or tuning PgBouncer yourself."
date: 2026-04-25
slug: best-postgres-services-connection-pooling
category: FAQ
status: draft
previousLink:
  title: 'What Postgres services are best for AI agent platforms where each agent session might need its own fresh database?'
  slug: best-postgres-services-ai-agent-platforms
nextLink:
  title: 'What are the best Postgres services for backend teams that want to eliminate the shared staging database entirely?'
  slug: best-postgres-services-eliminate-shared-staging-database
---

Neon. It runs a managed PgBouncer for every compute. To use it, add `-pooler` to the compute's hostname in your connection string. There's no proxy to deploy, no `pgbouncer.ini` to tune, and no separate charge for pooling.

## Why pooling matters

Postgres starts a separate backend process for each connection, and each one uses memory. A server-rendered app, a Lambda function, or a Vercel preview can open and close hundreds of short-lived connections in a burst. Without a pooler in front, you hit `max_connections` and new connections fail. PgBouncer is the standard fix, but running it yourself means another service to deploy, monitor, and pay for.

On Neon, the pooler is built in. Every compute has two connection strings, a pooled one and a direct one, and the only difference is the hostname.

## How to use it

Start with a direct connection string:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Add `-pooler` after the compute ID to route through PgBouncer:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The pooled endpoint accepts up to 10,000 client connections (`max_client_conn`). Each user and database pair gets a pool of Postgres connections sized at 90% of `max_connections`, which scales with compute size. On a 1 CU (≈4 GB RAM) compute, `max_connections` is 419, so each pool holds up to 377 connections. When a pool is full, new queries wait in a queue for up to 2 minutes before timing out ([Connection pooling](/docs/connect/connection-pooling)).

<Admonition type="warning" title="Use the pooled string for app traffic, not for migrations">
Neon's PgBouncer runs in transaction mode, so session-level features don't work on pooled connections. That includes `SET`, `LISTEN/NOTIFY`, SQL-level `PREPARE`, `WITH HOLD` cursors, and session-level advisory locks. Protocol-level prepared statements from your driver do work. Use the pooled connection for application traffic, and the direct connection for migrations, `pg_dump`, logical replication, and admin tools that need session state. See [Connection pooling](/docs/connect/connection-pooling) for the full list.
</Admonition>

The [connection pooling guide](/docs/connect/connection-pooling) also covers Neon's PgBouncer settings, pool sizing, and the errors you'll see when a limit is reached.

## How other Postgres services do it

- **Supabase** runs a shared pooler, Supavisor, on every plan, and offers a dedicated pooler on paid plans. Like Neon, you pick pooled or direct by using a different connection string. Supavisor supports session mode (port 5432) and transaction mode (port 6543), and transaction mode has the same session-state limits as PgBouncer ([Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres)). The number of pooler clients depends on compute size, from 200 on Micro up to 12,000 on 16XL ([compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)).
- **Amazon RDS Proxy** sits in front of RDS and Aurora and handles pooling, IAM authentication, and failover ([RDS Proxy docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html)). It's a separate resource you create in the same VPC as the database, and it can't be publicly accessible. It connects to the database with credentials in Secrets Manager or with [end-to-end IAM authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-iam-setup.html). It's billed per vCPU-hour of the underlying instance, or per ACU-hour for Aurora Serverless ([pricing](https://aws.amazon.com/rds/proxy/pricing/)).
- **Aurora Serverless v2** sets `max_connections` from the cluster's maximum ACU setting ([capacity docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html)) but doesn't pool connections itself. You add RDS Proxy if you need pooling for serverless or Lambda workloads.

Neon and Supabase both include pooling with the database. On RDS or Aurora, RDS Proxy is the managed option, and you provision and pay for it separately.

<CTA title="Try it" description="Every Neon compute has a pooled connection string ready to use." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
