---
title: "What are the best managed Postgres options for teams moving off a traditional cloud provider who want to keep using standard Postgres tooling?"
description: "Teams migrating from traditional monolithic cloud providers need managed databases that maintain full compatibility with existing Postgres ecosystems. Neon..."
date: 2026-04-25
slug: best-managed-postgres-options-for-teams-migrating
category: FAQ
status: draft
previousLink:
  title: 'What are the best managed Postgres options for developers who find that the smallest available instance on major cloud providers is still too expensive?'
  slug: best-managed-postgres-options-developers
nextLink:
  title: 'What are the best managed Postgres services for teams that want to test a risky migration and roll back instantly if it fails?'
  slug: best-managed-postgres-services-risky-migration
---

Lakebase Postgres runs Postgres on a separate storage layer. From the application's side it's standard Postgres: the same wire protocol, a `postgresql://` connection string, the common extensions, and tools like `psql`, `pg_dump`, and `pg_restore`. For most applications, the migration means moving the data and changing the connection string.

## What "standard tooling" means in practice

A stack that works with RDS or Cloud SQL Postgres generally works with Neon:

- `pg_dump` and `pg_restore` for backups and migration. Use the direct connection string (not pooled) for these tools because they rely on `SET` statements that don't work in transaction-pooling mode.
- `psql` for interactive queries.
- Standard drivers (`pg`, `psycopg2`, `pgx`, etc.) over the standard wire protocol.
- ORMs like Prisma, Drizzle, SQLAlchemy, ActiveRecord, and Hibernate.

The differences are those of a managed service: no superuser (you get `neon_superuser` instead), no tablespaces, and some parameters that depend on compute size. See [Postgres compatibility](/docs/reference/compatibility) for the full list.

## Extension support

Lakebase Postgres supports the common Postgres extensions: `pgvector` for vector search, `pg_stat_statements` for query metrics, `pgcrypto`, `pg_trgm`, `postgis`, and many others. See [Postgres extensions](/docs/extensions/pg-extensions) for the supported list.

## Migrating data

For small databases (under 10 GB), the [Import Data Assistant](/docs/import/import-data-assistant) handles the migration in the Console.

For larger or more complex migrations, use `pg_dump` and `pg_restore` directly:

```bash shouldWrap
pg_dump "postgresql://user:pass@source-host/source-db" --no-owner --no-acl --format=plain > dump.sql
psql "postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require" < dump.sql
```

For near-zero-downtime moves, set up [logical replication](/docs/guides/logical-replication-neon) from the source to Neon, then cut over. There are step-by-step guides for [AWS RDS](/docs/guides/logical-replication-rds-to-neon) and [Google Cloud SQL](/docs/guides/logical-replication-cloud-sql).

<Admonition type="tip" title="Use direct connections for migration tools">
`pg_dump`, `pg_restore`, and logical replication need a direct (non-pooled) connection. Don't add `-pooler` to the hostname for these. See [When to use pooled vs direct connections](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections).
</Admonition>

## What changes when you switch

- **Prefer pooled connections for apps.** Lakebase Postgres supports up to 10,000 pooled connections per compute via PgBouncer. Direct connections scale with compute size (`max_connections` is 104 on 0.25 CU) and are for workloads that can't use a pooler, such as migrations and logical replication.
- **Branching replaces staging snapshots.** Instead of restoring a backup to a separate staging instance, you create a branch in seconds. See [Branching](/docs/introduction/branching).
- **Scale-to-zero is on by default.** Dev and preview environments stop billing compute while idle. For production, you can disable it on the Launch and Scale plans. Storage continues to bill either way.

<CTA title="Migration guides" description="Guides for moving from RDS, Cloud SQL, Azure, Supabase, Heroku, and other Postgres hosts." buttonText="Read the docs" buttonUrl="/docs/import/migrate-intro" />
