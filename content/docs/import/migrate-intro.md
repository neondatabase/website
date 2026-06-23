---
title: Neon data migration guides
subtitle: Learn how to migrate data to Neon Postgres from different database providers
  and sources
summary: >-
  Neon migration guide selection page compares transfer methods (Import Data
  Assistant, pg_dump/restore, pgcopydb, Logical Replication, pgloader, AWS DMS)
  by database size, downtime tolerance, and skill level to help you pick the
  right approach. Import Data Assistant is automated and targets databases under
  10 GB. Logical Replication delivers near-zero downtime for production Postgres
  workloads. pgloader covers non-Postgres sources including MySQL, MSSQL, and
  SQLite. Also indexes provider-specific migration paths for Heroku, Supabase,
  PlanetScale, RDS, Cloud SQL, and Azure, plus guidance for region migration and
  Neon-to-Neon moves.
redirectFrom:
  - /docs/import/import-intro
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

This guide helps you choose the best migration method based on your database size, downtime tolerance, source database type, and technical requirements.

## Migration methods

| Method                                                        | Best For                               | Database Size | Downtime                | Technical Skill | Key Benefit                   |
| ------------------------------------------------------------- | -------------------------------------- | ------------- | ----------------------- | --------------- | ----------------------------- |
| [Import Data Assistant](/docs/import/import-data-assistant)   | Quick Postgres migrations              | Under 10GB    | Minimal (minutes–hours) | Low             | Easiest - fully automated     |
| [pg_dump/restore](/docs/import/migrate-from-postgres)         | Standard Postgres migrations           | Any size      | Required                | Medium          | Reliable and well-tested      |
| [pgcopydb](/docs/import/pgcopydb)                             | Large Postgres databases               | 10GB+         | Required                | Medium          | Parallel processing - fast    |
| [Logical Replication](/docs/guides/logical-replication-guide) | Production Postgres workloads          | Any size      | Near-zero               | High            | Minimal downtime              |
| [pgloader](#provider-specific-guides)                         | Non-Postgres sources                   | Any size      | Required                | Medium          | Handles MySQL, MSSQL, SQLite  |
| [AWS DMS](/docs/import/migrate-aws-dms)                       | Multi-source or custom transformations | Any size      | Minimal (minutes–hours) | High            | Advanced transformation rules |

<Admonition type="tip" title="Quick guidance">
If you can't afford downtime, use [Logical Replication](/docs/guides/logical-replication-guide). For Postgres databases under 10GB with some downtime flexibility, [Import Data Assistant](/docs/import/import-data-assistant) is the easiest option. For larger Postgres databases where downtime is acceptable, choose between [pg_dump/restore](/docs/import/migrate-from-postgres) (simplest) or [pgcopydb](/docs/import/pgcopydb) (fastest).
</Admonition>

## Region migration

If you need your Neon **database** in a different **region**, or a **Postgres-compatible export** from Neon, start with **[Region migration](/docs/import/region-migration)** for paths and tradeoffs. For **Neon-to-Neon** moves, use **[Migrate to another Neon region](/docs/import/migrate-neon-to-another-region)**. A project stays in one region; you create a **new** Neon project in the target region and migrate your **data**, or export. For a **piped** `pg_dump | pg_restore` between Neon projects, see **[Migrate data from another Neon project](/docs/import/migrate-from-neon)**.

## Provider-specific guides

For step-by-step instructions tailored to specific databases or providers, see [MySQL](/docs/import/migrate-mysql), [MSSQL](/docs/import/migrate-mssql), [SQLite](/docs/import/migrate-sqlite), [Heroku](/docs/import/migrate-from-heroku), [Supabase](/docs/import/migrate-from-supabase), [PlanetScale](/docs/import/migrate-from-planetscale), [Turso](/docs/import/migrate-from-turso), [Render](/docs/import/migrate-from-render), [Azure](/docs/import/migrate-from-azure-postgres), [Digital Ocean](/docs/import/migrate-from-digital-ocean), [Railway](/docs/import/migrate-from-railway), [Firebase](/docs/import/migrate-from-firebase), or [another Neon project](/docs/import/migrate-from-neon).

## Logical replication guides

For near-zero downtime Postgres database migrations using logical replication, see guides for [AWS RDS](/docs/guides/logical-replication-rds-to-neon), [Google Cloud SQL](/docs/guides/logical-replication-cloud-sql), [AlloyDB](/docs/guides/logical-replication-alloydb), [Azure](/docs/import/migrate-from-azure-postgres), [Supabase](/docs/guides/logical-replication-supabase-to-neon), [PostgreSQL](/docs/guides/logical-replication-postgres-to-neon), or [Neon to Neon](/docs/guides/logical-replication-neon-to-neon).

## Other imports

- [Import data from CSV](/docs/import/import-from-csv): Import data from CSV files using psql
- [Import sample data](/docs/import/import-sample-data): Try Neon with sample datasets
- [Migrate schema only](/docs/import/migrate-schema-only): Migrate just the schema without data

<NeedHelp/>
