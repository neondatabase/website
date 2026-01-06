---
title: Choose your migration method
subtitle: Find the right approach to migrate your database to Neon
enableTableOfContents: true
updatedOn: '2025-01-06T00:00:00.000Z'
---

Moving your database to Neon? This guide helps you choose the best migration method based on your database size, downtime tolerance, source database type, and technical requirements.

<Admonition type="tip" title="Quick guidance">
If you can't afford downtime, use [Logical Replication](#logical-replication). For databases under 10GB with some downtime flexibility, [Import Data Assistant](#import-data-assistant-beta) is the easiest option. For larger databases where downtime is acceptable, choose between [pg_dump/restore](#pg_dump-and-pg_restore) (simplest) or [pgcopydb](#pgcopydb) (fastest).
</Admonition>

## Migration methods comparison

| Method | Best For | Database Size | Downtime | Technical Skill | Key Benefit |
|--------|----------|---------------|----------|----------------|-------------|
| [Import Data Assistant](#import-data-assistant-beta) | Quick migrations | Under 10GB | Minimal (minutes–hours) | Low | Easiest - fully automated |
| [pg_dump/restore](#pg_dump-and-pg_restore) | Standard migrations | Any size | Required | Medium | Reliable and well-tested |
| [pgcopydb](#pgcopydb) | Large databases | 10GB+ | Required | Medium | Parallel processing - fast |
| [Logical Replication](#logical-replication) | Production workloads | Any size | Near-zero | High | Minimal downtime |
| [pgloader](#migrating-from-other-databases) | Non-Postgres sources | Any size | Required | Medium | Handles MySQL, MSSQL, SQLite |
| [AWS DMS](#other-sources-oracle-etc) | Multi-source or custom transformations | Any size | Minimal (minutes–hours) | High | Advanced transformation rules |

## Migrating from Postgres

### Import Data Assistant (Beta)

**Best for:** Databases under 10GB where you want the simplest migration experience.

The Import Data Assistant is a guided UI tool that automatically copies your database to a new Neon branch. Just provide your database connection string and Neon handles the rest.

**Key features:**
- Fully automated process - no manual commands
- Creates a new branch with imported data
- Compatibility checks built-in (database size, Postgres version, extensions)
- 1-hour time limit on import operations

**Limitations:**
- Currently limited to databases under 10GB
- Neon must be able to connect to your source database (for example, allowlisted public access)
- AWS regions only
- Supabase and Heroku databases not supported due to extension incompatibilities
- IPv6 databases not yet supported

[Learn more about Import Data Assistant →](/docs/import/import-data-assistant)

### pg_dump and pg_restore

**Best for:** Standard migrations where you need precise control and some downtime is acceptable.

The traditional Postgres migration approach using command-line tools. This is the most widely-used and tested migration method.

**Key features:**
- Works with any size database
- Precise control over what gets migrated
- Can test migration multiple times before final cutover
- Maintains schema and data integrity
- Well-documented with extensive community support

**Limitations:**
- Requires downtime during the dump and restore process
- For very large databases, the process can be time-consuming
- Single-threaded by default (though parallel options exist)

[Learn more about pg_dump and pg_restore →](/docs/import/migrate-from-postgres)

### pgcopydb

**Best for:** Large databases (10GB+) where parallel processing can significantly reduce migration time.

An advanced migration tool that builds on pg_dump and pg_restore with parallel processing capabilities.

**Key features:**
- Parallel migration of multiple tables simultaneously
- Splits large tables into chunks for faster import
- Concurrent index creation and constraint application
- Proper dependency handling
- Real-time progress monitoring

**Limitations:**
- Requires downtime during migration
- More complex setup than basic pg_dump/restore
- Requires sufficient resources (CPU, memory, disk) on the machine running pgcopydb
- Network connectivity must be maintained throughout the process

[Learn more about pgcopydb →](/docs/import/pgcopydb)

### Logical Replication

**Best for:** Production databases requiring near-zero downtime migration.

Postgres logical replication continuously streams changes from your source database to Neon in real-time, allowing you to migrate with minimal service interruption.

**Key features:**
- Near-zero downtime migration
- Keeps source and target databases in sync during migration
- Can replicate specific tables rather than entire database
- Real-time data synchronization
- Allows for validation before final cutover

**Limitations:**
- Requires source database `wal_level = logical`
- More complex setup and configuration
- Schema changes must be handled separately
- Requires additional compute resources during initial sync
- Source database cannot scale to zero during replication (if source is Neon)
- Inactive replication slots automatically removed after ~40 hours (Neon sources)

**Technical requirements:**
- Source database must support logical replication
- Appropriate network connectivity between source and Neon
- Sufficient permissions to create publications and replication slots

[Learn more about Logical Replication →](/docs/guides/logical-replication-guide)

**Available guides for specific sources:**
- [PostgreSQL to Neon](/docs/guides/logical-replication-postgres-to-neon)
- [AWS RDS to Neon](/docs/guides/logical-replication-rds-to-neon)
- [Google Cloud SQL to Neon](/docs/guides/logical-replication-cloud-sql)
- [AlloyDB to Neon](/docs/guides/logical-replication-alloydb)
- [Supabase to Neon](/docs/guides/logical-replication-supabase-to-neon)
- [Neon to Neon](/docs/guides/logical-replication-neon-to-neon) (for cross-region or version upgrades)

## Migrating from other databases

### MySQL

[Migrate from MySQL to Neon Postgres](/docs/import/migrate-mysql) using pgloader. The tool automatically transforms MySQL data types and structures to Postgres-compatible formats.

**Best for:** MySQL databases of any size where some downtime is acceptable.

### Microsoft SQL Server

[Migrate from MSSQL to Neon Postgres](/docs/import/migrate-mssql) using pgloader. Similar to MySQL migrations, pgloader handles data type conversions automatically.

**Best for:** MSSQL databases where you need automated schema and data transformation.

### SQLite

[Migrate from SQLite to Neon Postgres](/docs/import/migrate-sqlite) using pgloader. Keep in mind SQLite's flexible typing system vs. Postgres's strict typing.

**Best for:** Smaller databases or development databases being promoted to production.

### Other sources (Oracle, etc.)

For databases not directly supported by the above tools, use [AWS Database Migration Service (DMS)](/docs/import/migrate-aws-dms).

**Best for:** Oracle and other databases not supported by pgloader.

## Common migration scenarios

### Small development database

**Scenario:** Migrating a 2GB development database from a local Postgres instance to Neon.

**Recommended method:** [Import Data Assistant](/docs/import/import-data-assistant)

**Why:** Simplest approach with automated process. Database size is well within limits, and minimal downtime is fine for a development environment.

**Alternative:** [pg_dump/restore](/docs/import/migrate-from-postgres) if you prefer command-line control

---

### Medium production database with maintenance window

**Scenario:** 50GB production database, can schedule a 2-hour maintenance window.

**Recommended method:** [pgcopydb](/docs/import/pgcopydb)

**Why:** Large enough that parallel processing will significantly reduce migration time. Maintenance window provides acceptable downtime period.

**Alternative:** [pg_dump/restore](/docs/import/migrate-from-postgres) if you prefer simpler tooling and can extend the maintenance window

---

### Large production database, near-zero downtime required

**Scenario:** 500GB production database, cannot afford significant downtime, actively receiving writes.

**Recommended method:** [Logical replication](/docs/guides/logical-replication-guide)

**Why:** Only method that provides near-zero downtime for large, active databases. Allows validation before cutover.

**Considerations:** Requires proper planning, setup time, and monitoring. Consider engaging Neon's Solutions Engineering team.

---

### Production database with no maintenance window

**Scenario:** 50GB production database, actively used 24/7, cannot schedule downtime for migration.

**Recommended method:** [Logical replication](/docs/guides/logical-replication-guide)

**Why:** Even for medium-sized databases, logical replication is the only option when downtime isn't possible. Keeps both databases in sync until you're ready to switch over.

---

### Migrating multiple small databases

**Scenario:** 20 small databases (each under 5GB) from another provider to Neon.

**Recommended method:** [Import Data Assistant](/docs/import/import-data-assistant) for each database

**Why:** Fastest approach for multiple small databases. Automated process means less manual work per database.

**Alternative:** Create a [pg_dump/restore](/docs/import/migrate-from-postgres) script if you prefer command-line automation

---

### MySQL to Postgres migration

**Scenario:** 30GB MySQL database moving to Postgres on Neon.

**Recommended method:** [Migrate from MySQL](/docs/import/migrate-mysql) using pgloader

**Why:** Specifically designed for cross-database migrations with automatic data type conversion.

**Note:** Plan for application code changes to accommodate Postgres SQL dialect differences

---

### Version upgrade (Postgres 14 to 17)

**Scenario:** Neon project on Postgres 14, want to upgrade to Postgres 17.

**Recommended methods:**
- **Under 10GB:** [Import Data Assistant](/docs/import/import-data-assistant) to new project with Postgres 17
- **10GB+, downtime OK:** [pg_dump/restore](/docs/import/migrate-from-postgres) to new project with Postgres 17
- **Near-zero downtime required:** [Logical replication](/docs/guides/logical-replication-neon-to-neon) to new project with Postgres 17

[Learn more about Postgres version upgrades →](/docs/postgresql/postgres-upgrade)

## Next steps

1. **Review the detailed guide** for your chosen migration method
2. **Test your migration** with a non-production database first
3. **Plan your migration window** if downtime is required
4. **Execute the migration** and validate your data in Neon
5. **Update connection strings** and test your applications

Ready to migrate? Head to the [migration guides overview](/docs/import/migrate-intro) to get started.

<NeedHelp/>
