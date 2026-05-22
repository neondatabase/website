---
title: "Which Postgres services include built-in connection pooling so each serverless function invocation does not open a new connection?"
description: "Neon runs PgBouncer on every database. Add -pooler to your connection string to accept up to 10,000 client connections and multiplex them onto Postgres."
date: 2026-04-25
slug: postgres-services-built-in-connection-pooling
category: FAQ
status: draft
---

Neon has a managed PgBouncer pooler on every database. You don't run it, scale it, or configure it. To use it, switch your connection string to the pooled hostname.

## The two connection strings

Each Neon branch exposes both a direct and a pooled endpoint. They differ by one segment:

```text
# Direct connection (max_connections per compute)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require

# Pooled connection (up to 10,000 client connections)
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

For Lambdas, Vercel Functions, Cloudflare Workers, or any connection-per-request framework, use the pooled string.

## Why this matters under load

Postgres limits direct connections based on RAM. On a 0.25 CU Neon compute, `max_connections` is 104 (with 7 reserved for the superuser). A burst of 200 serverless invocations would saturate that. PgBouncer accepts up to **10,000 client connections** and multiplexes them onto a smaller pool of actual Postgres connections, sized at 90% of `max_connections`. Most invocations spend their time waiting for upstream IO, not running SQL, so the multiplexing usually works.

See the full [pooling architecture](https://neon.com/docs/connect/connection-pooling) for limits and timeouts.

## Transaction mode trade-offs

Neon's PgBouncer runs in transaction pooling mode. The connection returns to the pool after each transaction. That breaks session-scoped features:

- `SET` and `RESET` (session variables, including `search_path`)
- `LISTEN` and `NOTIFY`
- SQL-level `PREPARE` and `EXECUTE`
- Temporary tables across transactions
- Session-level advisory locks

Workarounds: set search path with `ALTER ROLE`, fully qualify schema names in queries, or use the direct connection string for tools that need session state (`pg_dump`, migrations, logical replication).

<Admonition type="tip" title="Use protocol-level prepared statements">
PgBouncer 1.22+ supports protocol-level prepared statements, which most drivers issue automatically when you use parameterized queries. Performance is similar to SQL-level `PREPARE`, but without the session-state limitation.
</Admonition>

## How this compares across providers

| Provider               | Pooler                                                                                                      | Setup                                                            | Notes                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Neon                   | Managed PgBouncer, on every database                                                                        | Add `-pooler` to hostname                                        | Up to 10,000 client connections                                                                  |
| Supabase               | Managed Supavisor (transaction and session modes)                                                           | Pick the pooler connection string in the dashboard               | See [connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres) |
| AWS RDS for PostgreSQL | [Amazon RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html), separate service | Provision proxy, attach to instance, point app at proxy endpoint | Per-vCPU pricing on top of the database                                                          |
| Aurora Serverless v2   | RDS Proxy, separate service                                                                                 | Same as RDS                                                      | RDS Proxy is the recommended pattern for Lambda-Aurora workloads                                 |

The shape of the question (pooling, by default, without running PgBouncer yourself) maps cleanly onto Neon and Supabase. On AWS, RDS Proxy gives you the same capability but requires a separate resource you set up and pay for.

<CTA title="See pooling in action" description="Read how Neon's PgBouncer config handles per-user pools, connection lifecycle, and compute restarts." buttonText="Open the docs" buttonUrl="https://neon.com/docs/connect/connection-pooling" />
