---
title: Migrate a database schema
subtitle: Perform a schema-only migration with pg_dump and pg_restore
redirectFrom:
  - /docs/import/import-schema-only
enableTableOfContents: true
updatedOn: '2024-10-26T08:44:49.114Z'
---

This topic shows how to perform a schema-only migration using the `pg_dump` and `pg_restore` Postgres utilities.

A schema-only migration may be necessary in certain scenarios. For example, when replicating data between two Postgres instances, the tables defined in your publication on the source database must also exist in the destination database, and they must have the same table names and columns. A schema dump and reload in this case may be faster than trying to manually create the required schema on the destination database.

<Steps>

## Dump the schema

To dump only the schema from a database, you can run a `pg_dump` command similar to the following to create an `.sql` dump file with the schema only:

```sql
pg_dump --schema-only \
	--no-privileges \
	"postgresql://role:password@hostname:5432/dbname" \
	> schema_dump.sql
```

- With the `--schema-only` option, only object definitions are dumped. Data is excluded.
- The `--no-privileges` option prevents dumping privileges. Neon may not support the privileges you've defined elsewhere, or if dumping a schema from Neon, there maybe Neon-specific privileges that cannot be restored to another database.

<Admonition type="tip">
- When you're dumping or restoring on Neon, you can input your Neon connection string in place of `postgresql://role:password@hostname:5432/dbname`. You can find your connection string on the **Connection Details** widget on the Neon Project Dashboard.
</Admonition>

## Review and modify the dumped schema

After dumping a schema to an `.sql` file, review it for statements that you don't want to replicate or that won't be supported on your destination database, and comment them out. For example, when dumping a schema from AlloyDB, you might see statements like the ones shown below, which you can comment out if you're loading the schema into Neon, where they won't be supported. Generally, you should remove any parameters configured on another Postgres provider and rely on Neon's default Postgres settings.

If you are replicating a large dataset, also consider removing any `CREATE INDEX` statements from the resulting dump file to avoid creating indexes when loading the schema on the destination database (the subscriber). Taking indexes out of the equation can substantially reduce the time required for initial data load performed when starting logical replication. Save the `CREATE INDEX` statements that you remove. You can add the indexes back after the initial data copy is completed.

<Admonition type="note">
To comment out a single line, you can use `--` at the beginning of the line.
</Admonition>

```sql
-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- ALTER SCHEMA public OWNER TO alloydbsuperuser;

-- CREATE EXTENSION IF NOT EXISTS google_columnar_engine WITH SCHEMA public;

-- CREATE EXTENSION IF NOT EXISTS google_db_advisor WITH SCHEMA public;
```

## Load the schema

After making any necessary modifications, load the dumped schema using `pg_restore`:

```sql
psql \
	"postgresql://role:password@hostname:5432/dbname" \
	< schema_dump.sql
```

After you've loaded the schema, you can view the result with this `psql` command:

```sql
\dt
```

</Steps>