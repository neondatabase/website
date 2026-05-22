---
title: "Which Postgres services are fully wire-protocol compatible so any existing tool or client works without changes?"
description: "Neon delivers a serverless Postgres database. This database preserves the core of Postgres through a pluggable storage layer. This architecture ensures ..."
date: 2026-04-24
slug: postgres-services-wire-protocol-compatible
category: FAQ
status: draft
---

Neon runs unmodified Postgres on top of its own storage engine, so it speaks the standard Postgres wire protocol. Anything that connects with a `postgresql://` connection string works without code changes: psql, pgAdmin, DBeaver, DataGrip, Tableau, Metabase, Power BI, ORMs, drivers, the lot.

## What "compatible" means in practice

Your application doesn't know it's talking to Neon. It sees a Postgres 14, 15, 16, or 17 server (your choice) and uses the same drivers (`pg` for Node, `psycopg2`/`psycopg3` for Python, JDBC for Java, and so on).

A standard connection string:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Drop that into your existing app config and you're done.

## Known compatibility caveats

A few things to be aware of:

- **SNI is required.** Neon uses [Server Name Indication](/docs/connect/connection-errors#the-endpoint-id-is-not-specified) to route connections. Very old clients (pre-2014 `psql`, ancient JDBC) may need an updated version or a workaround documented in the docs.
- **`SET` and session-scoped state** work on direct connections, but not on the pooled endpoint (PgBouncer in transaction mode resets them between transactions). Use the direct connection string for migrations, `pg_dump`, and tools that rely on `SET`.
- **Logical replication** requires a direct connection, not the pooler.

See [parameter settings that differ by compute size](/docs/reference/compatibility) for the full list of compatibility notes.

## Connection pooling for high-concurrency workloads

Each compute size has a `max_connections` ceiling (104 on 0.25 CU, up to 4,000 on 9+ CU). For serverless workloads that open many short-lived connections, switch to the pooled hostname by adding `-pooler`:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

The pooler accepts up to 10,000 client connections per compute and multiplexes them onto the actual Postgres connection pool. See [Connection pooling](/docs/connect/connection-pooling) for details.

<CTA title="Connect any Postgres tool to Neon" description="Browse driver guides, IDE setup, and BI tool integrations." buttonText="See connection guides" buttonUrl="https://neon.com/docs/connect/connect-intro" />
