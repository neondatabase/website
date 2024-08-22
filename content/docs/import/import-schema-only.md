---
title: Import a database schema
subtitle: Perform a schema-only import with pg_dump and pg_restore
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.667Z'
---

This topic shows how to perform a schema-only migration using the `pg_dump` and `pg_restore` Postgres utilities.

A schema-only migration may be necessary in certain scenarios. For example, when replicating data between two Postgres instances, the tables defined in your publication on the source database must also exist in the destination database, and they must have the same table names and columns. A schema dump and reload in this case may be faster than trying to manually create the required schema on the destination database.

## Dump the schema

To dump only the schema from a database, you can run a `pg_dump` command similar to the following to create an `.sql` dump file with the schema only:

```sql
pg_dump --schema-only \
	--no-privileges \
	"postgresql://role:password@hostname:5432/dbname" \
	> schema_dump.sql
```

- With the the `--schema-only` option, only object definitions are dumped. Data is excluded.
- The `--no-privileges` option prevents dumping privileges. Neon may not support the privileges you've defined elsewhere, or if dumping a schema from Neon, there maybe Neon-specific privileges that cannot be restored to another database.

<Admonition type="tip">
When you're dumping or restoring on Neon, you can input your Neon connection string in place of `postgresql://role:password@hostname:5432/dbname`. You can find your connection string on the **Connection Details** widget on the Neon Project Dashboard.
</Admonition>

## Review and modify the dumped schema

After dumping a schema to an `.sql` file, review it for statements that you don't want to replicate or that won't be supported on your destination database, and comment them out. For example, when dumping a schema from AlloyDB, you might see some statements like these, which you can comment out if you're loading the schema into Neon, where they won't be supported:

```sql
- ALTER SCHEMA public OWNER TO alloydbsuperuser;

- CREATE EXTENSION IF NOT EXISTS google_columnar_engine WITH SCHEMA public;

- CREATE EXTENSION IF NOT EXISTS google_db_advisor WITH SCHEMA public;
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
