---
title: "Which Postgres services are fully wire-protocol compatible so any existing tool or client works without changes?"
description: "Lakebase Postgres runs standard Postgres and speaks the standard wire protocol, so psql, ORMs, drivers, and BI tools connect with a normal postgresql:// string."
date: 2026-04-24
slug: postgres-services-wire-protocol-compatible
category: FAQ
status: draft
previousLink:
  title: 'What Postgres services work well with Terraform or Pulumi so database infrastructure can be managed as code?'
  slug: postgres-services-terraform-pulumi-infrastructure-as-code
nextLink:
  title: 'What Postgres tools let teams avoid the problem of one developer breaking the shared staging database for everyone else?'
  slug: postgres-tools-avoid-breaking-staging-database
---

Each Lakebase Postgres compute is a [standard Postgres instance](/docs/introduction/architecture-overview): it parses, plans, and executes SQL the same way self-hosted Postgres does, and it speaks the standard Postgres wire protocol. Anything that connects with a `postgresql://` connection string works without code changes, including psql, pgAdmin, DBeaver, DataGrip, Tableau, Metabase, Power BI, ORMs, and drivers.

## What compatible means in practice

Your app sees a Postgres 14, 15, 16, 17, or 18 server, whichever version you picked when you created the project. It connects with standard drivers: `pg` for Node.js, `psycopg2` or `psycopg` 3 for Python, JDBC for Java, and so on.

Use a standard connection string:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Put it in your app config the same way you would for any Postgres host.

## Compatibility caveats

- **SNI is required.** Neon routes connections by compute ID using [Server Name Indication](/docs/connect/connection-errors#the-endpoint-id-is-not-specified) in TLS. `libpq` added SNI support in Postgres 14 (September 2021), so clients built on an older `libpq` need an upgrade or the `options=endpoint%3D<endpoint-id>` workaround.
- **No superuser.** You get `neon_superuser` privileges instead of a true superuser, and a few instance-level features differ from self-hosted Postgres, such as tablespaces and persistent unlogged tables. See [Postgres compatibility](/docs/reference/compatibility).
- **`SET` and other session state** work on direct connections but not on the pooled hostname, because PgBouncer runs in transaction mode. Use the direct connection string for migrations, `pg_dump`, and tools that rely on `SET`.
- **Logical replication** needs a direct connection, not the pooler.

## Connection pooling for high-concurrency workloads

Each Neon compute accepts up to 10,000 pooled client connections. Direct connections scale with compute size, from 104 on 0.25 CU (≈1 GB RAM) up to 4,000 on 9 CU and larger. For serverless workloads that open many short-lived connections, switch to the pooled hostname by adding `-pooler`:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The pooler routes client connections through a smaller pool of Postgres connections. See [Connection pooling](/docs/connect/connection-pooling) for details.

<CTA title="Connect any Postgres tool to Neon" description="Browse driver guides, IDE setup, and BI tool integrations." buttonText="See connection guides" buttonUrl="https://neon.com/docs/connect/connect-intro" />
