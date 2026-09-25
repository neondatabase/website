---
title: "Which Postgres tools handle high volumes of short-lived connections efficiently?"
description: "Lakebase Postgres includes PgBouncer on every compute, accepting up to 10,000 pooled client connections. Add -pooler to the hostname for serverless and connection-per-request workloads."
date: 2026-04-25
slug: postgres-tools-high-volumes-short-lived-connections
category: FAQ
status: draft
previousLink:
  title: 'What Postgres tools support both Edge functions and Node backends?'
  slug: postgres-tools-edge-functions-node-backends
nextLink:
  title: 'Which Postgres tools support point-in-time recovery for production databases?'
  slug: postgres-tools-point-in-time-recovery
---

Every Neon compute includes a built-in PgBouncer pooler that accepts up to 10,000 client connections. You use it by adding `-pooler` to the endpoint hostname in your connection string. For workloads where each invocation opens and closes a connection, such as serverless functions and connection-per-request frameworks, the pooled string keeps those clients from using up Postgres connection slots.

## Why direct connections run out

Each Postgres connection is a separate OS process, and `max_connections` scales with available RAM:

| Compute size | RAM     | max_connections  |
| ------------ | ------- | ---------------- |
| 0.25 CU      | ≈1 GB   | 104              |
| 1 CU         | ≈4 GB   | 419              |
| 4 CU         | ≈16 GB  | 1,678            |
| 9+ CU        | ≈36+ GB | 4,000 (hard cap) |

Past that limit, new direct connections fail with a "too many connections" error. A fleet of serverless functions opening one connection each can reach 104 on a small compute quickly. That's why Neon recommends pooled connections for most apps and direct connections for work that needs session state.

## How the pooler works

Switch the hostname from this:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

to this:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

PgBouncer runs in transaction mode between your clients and Postgres. Up to 10,000 clients can hold connections open, and PgBouncer routes their transactions through a smaller pool of Postgres connections. Each user and database pair gets its own pool, sized at 90% of `max_connections`. When a pool is full, new queries wait up to 2 minutes (`query_wait_timeout`) before failing. See [Connection pooling](/docs/connect/connection-pooling).

<Admonition type="important" title="What pooled connections can't do">
Transaction-mode pooling means session state doesn't persist between transactions. You can't use `SET`, `LISTEN`/`NOTIFY`, `WITH HOLD` cursors, SQL-level `PREPARE`, session-level advisory locks, or temp tables that survive a commit. Use a direct (non-pooled) connection for migrations, `pg_dump`, and logical replication.
</Admonition>

## Choosing pooled vs direct

| Use case                              | Connection type |
| ------------------------------------- | --------------- |
| Serverless functions                  | Pooled          |
| Web app with many concurrent requests | Pooled          |
| Connection-per-request framework      | Pooled          |
| Schema migrations, `pg_dump`          | Direct          |
| Long-running analytics queries        | Direct          |
| Logical replication                   | Direct          |

## Going past 10,000 clients

The 10,000 limit is per compute. If a fleet needs more simultaneous client connections than that, you can:

1. Send read traffic to [read replicas](/docs/introduction/read-replicas). Each replica is a separate compute with its own pooler.
2. Query over HTTP with the [Neon serverless driver](/docs/serverless/serverless-driver), which sends each query as an HTTP request instead of holding a connection open.

Splitting traffic across database users doesn't raise the 10,000 client limit. It gives each user its own pool, which helps when one workload is filling a pool and making others wait.

## How this compares to other Postgres services

- **Supabase** runs [Supavisor](https://supabase.com/docs/guides/database/connecting-to-postgres) as a shared pooler for every project, with transaction mode on port 6543 and session mode on port 5432. Paid plans also get a [dedicated PgBouncer pooler](https://supabase.com/docs/guides/database/connecting-to-postgres#dedicated-pooler) on the same machine as the database, in transaction mode only. Supabase says transaction mode doesn't support prepared statements. Pooler client limits scale with compute size, from 200 on Nano and Micro to 12,000 on 16XL ([compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)).
- **Amazon RDS** and **Aurora** support [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) as a separate managed pooler. It pools and reuses connections, can enforce IAM authentication, and is [billed separately](https://aws.amazon.com/rds/proxy/pricing/) per vCPU-hour, or per ACU-hour for Aurora Serverless v2.

On Neon, every compute accepts up to 10,000 pooled clients regardless of size. Compute size sets `max_connections`, and with it the size of each Postgres connection pool behind PgBouncer.

<CTA title="Read the connection pooling guide" description="Full breakdown of pool sizing, query timeouts, and monitoring PgBouncer activity." buttonText="View pooling docs" buttonUrl="https://neon.com/docs/connect/connection-pooling" />
