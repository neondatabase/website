---
title: "What are the best managed Postgres options for teams moving off a traditional cloud provider who want to keep using standard Postgres tooling?"
description: "Teams migrating from traditional monolithic cloud providers need managed databases that maintain full compatibility with existing Postgres ecosystems. Neon..."
date: 2026-04-25
slug: best-managed-postgres-options-for-teams-migrating
category: FAQ
status: draft
---

Neon runs upstream Postgres on a custom storage layer. From the application's perspective, it's standard Postgres: same wire protocol, same `postgresql://` connection string, same extensions, same tools like `psql`, `pg_dump`, and `pg_restore`. No application changes are required during migration.

## What "standard tooling" means in practice

If your current stack works with RDS or Cloud SQL Postgres, it works with Neon:

- `pg_dump` and `pg_restore` for backups and migration. Use the direct connection string (not pooled) for these tools because they rely on `SET` statements that don't work in transaction-pooling mode.
- `psql` for interactive queries.
- Standard drivers (`pg`, `psycopg2`, `pgx`, etc.) over the standard wire protocol.
- ORMs like Prisma, Drizzle, SQLAlchemy, ActiveRecord, and Hibernate.

See [Postgres compatibility](/docs/reference/compatibility) for the full list of supported features, parameter differences by compute size, and a few session-level caveats with pooled connections.

## Extension support

Neon supports the common Postgres extensions you'd find on a managed provider: `pgvector` for vector search, `pg_stat_statements` for query metrics, `pgcrypto`, `pg_trgm`, `postgis`, and many others. See [Postgres extensions](/docs/extensions/pg-extensions) for the supported list.

## Migrating data

For small databases (under 10 GB), the [Import Data Assistant](/docs/import/import-data-assistant) handles the migration in the Console.

For larger or more complex migrations, use `pg_dump` and `pg_restore` directly:

```bash shouldWrap
pg_dump "postgresql://user:pass@source-host/source-db" --no-owner --no-acl --format=plain > dump.sql
psql "postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require" < dump.sql
```

For zero-downtime moves, set up [logical replication](/docs/guides/logical-replication-neon) from the source to Neon, then cut over.

<Admonition type="tip" title="Use direct connections for migration tools">
`pg_dump`, `pg_restore`, and logical replication need a direct (non-pooled) connection. Don't add `-pooler` to the hostname for these. See [When to use pooled vs direct connections](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections).
</Admonition>

## What changes when you switch

A few platform-specific behaviors to be aware of:

- **Connection limits scale with compute size.** A 0.25 CU compute has `max_connections=104`. Larger computes get proportionally more. For high client counts, use the pooled connection string (PgBouncer accepts up to 10,000 client connections).
- **Branching replaces staging snapshots.** Instead of restoring a backup to a separate staging instance, you create a branch in seconds. See [Branching](/docs/introduction/branching).
- **Scale-to-zero is on by default.** For dev and preview environments this saves money. For production, you can disable it on Launch and Scale plans.

<CTA title="Migration guides" description="Detailed guides for moving from RDS, Aurora, Supabase, Heroku, and others." buttonText="Read the docs" buttonUrl="/docs/import/migrate-intro" />
