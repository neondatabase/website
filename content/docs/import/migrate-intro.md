---
title: Neon data migration guides
subtitle: Learn how to migrate data to Neon Postgres from different database providers
  and sources
redirectFrom:
  - /docs/import/import-intro
enableTableOfContents: true
updatedOn: '2024-12-31T13:01:35.400Z'
---

Find instructions for migrating data from Postgres, CSV, other Neon projects, and other database providers. For near-zero downtime data migrations from other Postgres providers, consider using logical replication. Additionally, if you're new to Neon and want to try it out, our sample data guide provides datasets for exploration and testing.

<Admonition type="note" title="Can We Help with Your Migration?">
If you're planning to migrate a production workload to Neon, let us know&#8212;we'll connect you with an expert from our team. You can reach out to us [here](https://neon.tech/migration-assistance).
</Admonition>

## Data migration guides

<DetailIconCards>

<a href="/docs/import/migration-assistant" description="Move your existing database to Neon using our guided migration tool" icon="neon">Neon Migration Assistant</a>

<a href="/docs/import/migrate-from-postgres" description="Migrate data from another Postgres database using pg_dump and pg_restore" icon="postgres">Migrate with pg_dump and pg_restore</a>

<a href="/docs/import/migrate-from-neon" description="Migrate data from another Neon project for Postgres version, region, or account migration" icon="neon">Migrate from another Neon project</a>

<a href="/docs/import/migrate-schema-only" description="Migrate only the schema from a Postgres database with pg_dump and pg_restore" icon="neon">Migrate schema only</a>

<a href="/docs/import/import-from-csv" description="Import data from a CSV file using the psql command-line utility" icon="csv">Import data from CSV</a>

<a href="/docs/import/migrate-from-firebase" description="Migrate data from Firebase Firestore to Neon Postgres using a custom Python script" icon="import">Migrate from Firebase Firestore</a>

<a href="/docs/import/migrate-from-heroku" description="Migrate data from a Heroku Postgres database to Neon Postgres using the Heroku CLI" icon="heroku">Migrate from Heroku</a>

<a href="/docs/import/migrate-aws-dms" description="Migrate data from another database source to Neon using the AWS Data Migration Service" icon="aws">Migrate with AWS DMS</a>

<a href="/docs/import/migrate-from-azure-postgres" description="Migrate from an Azure Database for PostgreSQL to Neon Postgres" icon="import">Migrate from Azure</a>

<a href="/docs/import/migrate-from-digital-ocean" description="Migrate data from Digital Ocean Postgres to Neon Postgres with pg_dump and pg_restore" icon="import">Migrate from Digital Ocean</a>

<a href="/docs/import/import-sample-data" description="Import one of several sample datasets for exploration and testing" icon="download">Import sample data</a>

<a href="/docs/import/migrate-mysql" description="Migrate your MySQL data to Neon Postgres using pgloader." icon="sql">Migrate from MySQL</a>

<a href="/docs/import/migrate-from-render" description="Migrate data from Render to Neon Postgres with pg_dump and pg_restore" icon="sql">Migrate from Render</a>

<a href="/docs/import/migrate-from-supabase" description="MIgrate data from Supabase to Neon Postgres with pg_dump and pg_restore" icon="sql">Migrate from Supabase</a>

</DetailIconCards>

## Use logical replication for near-zero downtime data migrations

Postgres logical replication in Neon provides an efficient way to migrate data from other Postgres providers with minimal downtime. By replicating data in real-time, this method allows you to transition your applications to Neon without interrupting your services. Please refer to our logical replication guides for instructions.

<TechnologyNavigation open>

<a href="/docs/guides/logical-replication-alloydb" title="AlloyDB" description="Replicate data from AlloyDB to Neon" icon="alloydb"></a>

<a href="/docs/guides/logical-replication-aurora-to-neon" title="Aurora" description="Replicate data from Aurora to Neon" icon="aws-rds"></a>

<a href="/docs/guides/logical-replication-cloud-sql" title="Cloud SQL" description="Replicate data from Cloud SQL to Neon" icon="google-cloud-sql"></a>

<a href="/docs/guides/logical-replication-postgres-to-neon" title="PostgreSQL to Neon" description="Replicate data from PostgreSQL to Neon" icon="postgresql"></a>

<a href="/docs/guides/logical-replication-rds-to-neon" title="AWS RDS" description="Replicate data from AWS RDS PostgreSQL to Neon" icon="aws-rds"></a>

<a href="/docs/import/migrate-from-azure-postgres" title="Azure PostgreSQL" description="Replicate data from Azure PostgreSQL to Neon" icon="azure"></a>

</TechnologyNavigation>
