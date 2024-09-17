---
title: Neon data import guides
subtitle: Learn how to import data from different sources or load sample data
enableTableOfContents: true
updatedOn: '2024-09-17T16:14:42.838Z'
---

Find instructions for importing data from Postgres, CSV, other Neon projects, and other Postgres providers. For near-zero downtime data migrations from other Postgres providers, consider using logical replication. Additionally, if you're new to Neon and want to try it out, our sample data guide provides datasets for exploration and testing.

## Data import guides

<DetailIconCards>

<a href="/docs/import/import-from-postgres" description="Import data from another Postgres database using pg_dump and pg_restore" icon="postgres">Import with pg_dump and pg_restore</a>

<a href="/docs/import/import-from-postgres-pg-import" description="Easily import data from another Postgres database with the @neondatabase/pg-import CLI" icon="postgres">Import with @neondatabase/pg-import</a>

<a href="/docs/import/import-from-neon" description="Import data from another Neon project for Postgres version, region, or account migration" icon="neon">Import from another Neon project</a>

<a href="/docs/import/import-schema-only" description="Import only the schema from a Postgres database with pg_dump and pg_restore" icon="neon">Import schema only</a>

<a href="/docs/import/import-from-csv" description="Import data from a CSV file using the psql command-line utility" icon="csv">Import data from CSV</a>

<a href="/docs/import/import-from-heroku" description="Import data from a Heroku Postgres database to a Neon Postgres database" icon="heroku">Import from Heroku using the Heroku CLI</a>

<a href="/docs/import/migrate-aws-dms" description="Migrate data from another database source to Neon using the AWS Data Migration Service" icon="aws">Migrate with AWS DMS</a>

<a href="/docs/import/import-from-azure-postgres" description="Import from an Azure Database for PostgreSQL to Neon Postgres" icon="import">Import from Azure</a>

<a href="/docs/import/import-from-digital-ocean" description="Import data from Digital Ocean Postgres to Neon Postgres with pg_dump and pg_restore" icon="aws">Import from Digital Ocean</a>

<a href="/docs/import/import-sample-data" description="Load one of several sample datasets for exploration and testing" icon="download">Load sample data</a>

<a href="/docs/import/migrate-mysql" description="Learn how to migrate your MySQL data to Neon Postgres using pgloader." icon="sql">Import from MySQL</a>

<a href="/docs/import/import-from-supabase" description="Import data from Supabase to Neon Postgres with pg_dump and pg_restore" icon="sql">Import from Supabase</a>

</DetailIconCards>

## Use logical replication for near-zero downtime data migrations

Postgres logical replication in Neon provides an efficient way to migrate data from other Postgres providers with minimal downtime. By replicating data in real-time, this method allows you to transition your applications to Neon without interrupting your services. Please refer to our logical replication guides for instructions.

<TechnologyNavigation open>

<a href="/docs/guides/logical-replication-alloydb" title="AlloyDB" description="Replicate data from AlloyDB to Neon" icon="alloydb"></a>

<a href="/docs/guides/logical-replication-aurora-to-neon" title="Aurora" description="Replicate data from Aurora to Neon" icon="aws-rds"></a>

<a href="/docs/guides/logical-replication-cloud-sql" title="Cloud SQL" description="Replicate data from Cloud SQL to Neon" icon="google-cloud-sql"></a>

<a href="/docs/guides/logical-replication-postgres-to-neon" title="PostgreSQL to Neon" description="Replicate data from PostgreSQL to Neon" icon="postgresql"></a>

<a href="/docs/guides/logical-replication-rds-to-neon" title="AWS RDS" description="Replicate data from AWS RDS PostgreSQL to Neon" icon="aws-rds"></a>

</TechnologyNavigation>
