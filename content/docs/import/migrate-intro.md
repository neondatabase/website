---
title: Neon data migration guides
subtitle: Learn how to migrate data to Neon Postgres from different database providers
  and sources
summary: >-
  Covers the selection of migration methods for transferring data to Neon
  Postgres from various database sources, considering factors like database
  size, downtime tolerance, and technical skill requirements.
redirectFrom:
  - /docs/import/import-intro
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.075Z'
---

This guide helps you choose the best migration method based on your database size, downtime tolerance, source database type, and technical requirements.

<Admonition type="tip" title="Quick guidance">
If you can't afford downtime, use [Logical Replication](/docs/guides/logical-replication-guide). For Postgres databases under 10GB with some downtime flexibility, [Import Data Assistant](/docs/import/import-data-assistant) is the easiest option. For larger Postgres databases where downtime is acceptable, choose between [pg_dump/restore](/docs/import/migrate-from-postgres) (simplest) or [pgcopydb](/docs/import/pgcopydb) (fastest).
</Admonition>

## Migration methods

| Method                                                        | Best For                               | Database Size | Downtime                | Technical Skill | Key Benefit                   |
| ------------------------------------------------------------- | -------------------------------------- | ------------- | ----------------------- | --------------- | ----------------------------- |
| [Import Data Assistant](/docs/import/import-data-assistant)   | Quick Postgres migrations              | Under 10GB    | Minimal (minutes–hours) | Low             | Easiest - fully automated     |
| [pg_dump/restore](/docs/import/migrate-from-postgres)         | Standard Postgres migrations           | Any size      | Required                | Medium          | Reliable and well-tested      |
| [pgcopydb](/docs/import/pgcopydb)                             | Large Postgres databases               | 10GB+         | Required                | Medium          | Parallel processing - fast    |
| [Logical Replication](/docs/guides/logical-replication-guide) | Production Postgres workloads          | Any size      | Near-zero               | High            | Minimal downtime              |
| [pgloader](#provider-specific-guides)                         | Non-Postgres sources                   | Any size      | Required                | Medium          | Handles MySQL, MSSQL, SQLite  |
| [AWS DMS](/docs/import/migrate-aws-dms)                       | Multi-source or custom transformations | Any size      | Minimal (minutes–hours) | High            | Advanced transformation rules |

## Provider-specific guides

For step-by-step instructions tailored to specific databases or providers, see [MySQL](/docs/import/migrate-mysql), [MSSQL](/docs/import/migrate-mssql), [SQLite](/docs/import/migrate-sqlite), [Heroku](/docs/import/migrate-from-heroku), [Supabase](/docs/import/migrate-from-supabase), [Render](/docs/import/migrate-from-render), [Azure](/docs/import/migrate-from-azure-postgres), [Digital Ocean](/docs/import/migrate-from-digital-ocean), [Firebase](/docs/import/migrate-from-firebase), or [another Neon project](/docs/import/migrate-from-neon).

## Logical replication guides

For near-zero downtime Postgres database migrations using logical replication, see guides for [AWS RDS](/docs/guides/logical-replication-rds-to-neon), [Google Cloud SQL](/docs/guides/logical-replication-cloud-sql), [AlloyDB](/docs/guides/logical-replication-alloydb), [Azure](/docs/import/migrate-from-azure-postgres), [Supabase](/docs/guides/logical-replication-supabase-to-neon), [PostgreSQL](/docs/guides/logical-replication-postgres-to-neon), or [Neon to Neon](/docs/guides/logical-replication-neon-to-neon).

## Other imports

- [Import data from CSV](/docs/import/import-from-csv) — Import data from CSV files using psql
- [Import sample data](/docs/import/import-sample-data) — Try Neon with sample datasets
- [Migrate schema only](/docs/import/migrate-schema-only) — Migrate just the schema without data

<NeedHelp/>
