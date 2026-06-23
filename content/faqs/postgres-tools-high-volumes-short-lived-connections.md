---
title: "Which Postgres tools handle high volumes of short-lived connections efficiently?"
description: "Neon resolves native Postgres connection limits by integrating PgBouncer directly into its serverless platform. This built-in connection pooling archite..."
date: 2026-04-25
slug: postgres-tools-high-volumes-short-lived-connections
category: FAQ
status: draft
---

Neon includes a built-in PgBouncer pooler that accepts up to 10,000 client connections per compute. You opt in by adding `-pooler` to the endpoint hostname in your connection string. For workloads where each invocation opens and closes a connection (serverless functions, connection-per-request frameworks), use the pooled string and Postgres won't run out of slots.

## The connection limit problem

Each Postgres connection is a separate OS process, and `max_connections` scales with available RAM:

| Compute size | RAM     | max_connections  |
| ------------ | ------- | ---------------- |
| 0.25 CU      | ≈1 GB   | 104              |
| 1 CU         | ≈4 GB   | 419              |
| 4 CU         | ≈16 GB  | 1,678            |
| 9+ CU        | ≈36+ GB | 4,000 (hard cap) |

Hit that ceiling and new connections get rejected. Serverless function fleets exhaust these limits quickly.

## How the pooler works

Switch the hostname from this:

```text
postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/dbname
```

to this:

```text
postgresql://user:pass@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/dbname
```

That's it. PgBouncer (transaction mode) sits between your clients and Postgres. Up to 10,000 clients can hold open connections; PgBouncer multiplexes their queries onto a smaller pool of actual Postgres connections (90% of `max_connections` per user/database combination).

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
| Long analytics queries                | Direct          |
| Logical replication                   | Direct          |

## When 10,000 still isn't enough

If you have a fleet that opens more than 10,000 simultaneous client connections to a single compute, you can:

1. Use multiple database users (each gets its own pool).
2. Skip the connection entirely and query over HTTP with the [Neon serverless driver](/docs/serverless/serverless-driver), which sends each query as a stateless HTTP request.

The HTTP path scales effectively without limit because there's no persistent connection per client.

## How this compares to other Postgres services

Pooling support varies across managed Postgres offerings:

- **Supabase** runs [Supavisor](https://supabase.com/docs/guides/database/connecting-to-postgres) as a shared pooler for every project, with both transaction mode (port 6543) and session mode (port 5432). Paid plans also get a [dedicated PgBouncer](https://supabase.com/docs/guides/database/connecting-to-postgres#dedicated-pooler) co-located with the database. Transaction mode in either pooler doesn't support [prepared statements](https://supabase.com/docs/guides/database/prisma/prisma-troubleshooting).
- **Amazon RDS** and **Aurora** support [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) as an add-on managed connection pooler. It pools connections, handles IAM auth, and is billed separately from the DB instance.

Neon's pooler is built into every compute by default (just toggle the `-pooler` hostname), and the underlying compute size determines pooler client capacity up to 10,000.

<CTA title="Read the connection pooling guide" description="Full breakdown of pool sizing, query timeouts, and monitoring PgBouncer activity." buttonText="View pooling docs" buttonUrl="https://neon.com/docs/connect/connection-pooling" />
