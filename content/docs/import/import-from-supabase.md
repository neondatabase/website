---
title: Migrate from Supabase to Neon Postgres
subtitle: Learn how to migrate your database from Supabase to Neon Postgres using pg_dump and pg_restore
enableTableOfContents: true
updatedOn: '2024-09-11T14:30:00.000Z'
---

This guide describes how to migrate a database from Supabase to Neon Postgres. 

We use the `pg_dump` and `pg_restore` utilities, which are part of the Postgres client toolset. `pg_dump` works by dumping both the schema and data in a custom format that is compressed and suitable for input into `pg_restore` to rebuild the database.

## Prerequisites

- A Supabase project containing the data you want to migrate.

- A Neon project to move the data to. 

    For detailed information on creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project). Make sure to create a project with the same Postgres version as your Supabase deployment.

- `pg_dump` and `pg_restore` utilities installed on your local machine. These typically come with a Postgres installation.

    We recommend using clients with the same version as the source Postgres instance. To check the version of `pg_dump` or `pg_restore`, use the `-V` option. For example: `pg_dump -V`.

- Review our guide on [Importing data from Postgres](/docs/import/import-from-postgres) for more comprehensive information on using `pg_dump` and `pg_restore`.

## Prepare your Supabase database

This section describes how to prepare your Supabase database for exporting data.

To illustrate the migration workflow, we use the [LEGO Database](https://neon.tech/docs/import/import-sample-data#lego-database). This database contains information about LEGO sets, parts, and themes.

### Retrieve Supabase connection details

1. Log in to your Supabase account and navigate to your project dashboard.
2. In the left sidebar, click on **Project Settings**.
3. Select **Database**, where you will find the below settings under the **Connection Parameters** section:
   - Host
   - Database name
   - Port
   - User
   - Password [Not visible in the dashboard]

You'll need these details to construct your connection string for `pg_dump`.

## Export data with pg_dump

Now that you have your Supabase connection details, you can export your data using `pg_dump`:

```bash
pg_dump -Fc -v -d postgresql://[user]:[password]@[supabase_host]:[port]/[database] --schema=public -f supabase_dump.bak
```

Replace `[user]`, `[password]`, `[supabase_host]`, `[port]`, and `[database]` with your Supabase connection details.

This command includes these arguments:

- `-Fc`: Outputs the dump in custom format, which is compressed and suitable for input into `pg_restore`.
- `-v`: Runs `pg_dump` in verbose mode, allowing you to monitor the dump operation.
- `-d`: Specifies the connection string for your Supabase database.
- `-f`: Specifies the output file name.
- `--schema=public`: Specifies the schema to dump. In this case, we only want to back up tables in the `public` schema. 

Supabase projects may also store data corresponding to authentication, storage and other services under different schemas. If necessary, you can specify additional schemas to dump by adding the `--schema` option multiple times.

If the command was successful, you’ll see output similar to the following:

```bash

...
pg_dump: saving encoding = UTF8
pg_dump: saving standard_conforming_strings = on
pg_dump: saving search_path =
pg_dump: saving database definition
pg_dump: dumping contents of table "public.lego_colors"
pg_dump: dumping contents of table "public.lego_inventories"
pg_dump: dumping contents of table "public.lego_inventory_parts"
pg_dump: dumping contents of table "public.lego_inventory_sets"
pg_dump: dumping contents of table "public.lego_part_categories"
pg_dump: dumping contents of table "public.lego_parts"
pg_dump: dumping contents of table "public.lego_sets"
pg_dump: dumping contents of table "public.lego_themes"
```

<Admonition type="important">
Avoid using `pg_dump` over a [pooled connection string](/docs/reference/glossary#pooled-connection-string) (see PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) & [976](https://github.com/pgbouncer/pgbouncer/issues/976) for details). Use an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string) instead.
</Admonition>

## Prepare your Neon destination database

This section describes how to prepare your destination Neon Postgres database to receive the imported data.

### Create the Neon database

Each Neon project comes with a default database named `neondb`. However, to maintain consistency with your Supabase setup, you might want to create a new database with the same name.

1. Connect to your Neon project using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a Postgres client like `psql`.

2. Create a new database. For example, if your Supabase database was named `lego`, run:

   ```sql
   CREATE DATABASE lego;
   ```

For more information, see [Create a database](/docs/manage/databases#create-a-database).

### Retrieve Neon connection details

1. In the Neon Console, go to your project dashboard.
2. Find the **Connection Details** widget.
3. Copy the connection string. It will look similar to this:

   ```
   postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

## Restore data to Neon with pg_restore

Now you can restore your data to the Neon database using `pg_restore`:

```bash
pg_restore -d <neon-connection-string> -v --no-owner --no-acl supabase_dump.bak
```

Replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your Neon connection details.

This command includes these arguments:

- `-d`: Specifies the connection string for your Neon database.
- `-v`: Runs `pg_restore` in verbose mode.
- `--no-owner`: Skips setting the ownership of objects as in the original database.
- `--no-acl`: Skips restoring access privileges for objects as in the original database.

A Supabase database has ownership and access control tied to the authentication system. We recommend that you use the `--no-owner` and `--no-acl` options to skip restoring these settings. After migrating the data, review and configure the appropriate roles and privileges for all objects, as needed. For more information, refer to the section on [Database object ownership considerations](/docs/import/import-from-postgres#database-object-ownership-considerations).

If the command was successful, you’ll see output similar to the following:

```bash
pg_restore: connecting to database for restore
pg_restore: creating SCHEMA "public"
pg_restore: while PROCESSING TOC:
pg_restore: from TOC entry 13; 2615 2200 SCHEMA public pg_database_owner
pg_restore: error: could not execute query: ERROR:  schema "public" already exists
Command was: CREATE SCHEMA public;


pg_restore: creating COMMENT "SCHEMA public"
pg_restore: creating TABLE "public.lego_colors"
pg_restore: creating SEQUENCE "public.lego_colors_id_seq"
pg_restore: creating SEQUENCE OWNED BY "public.lego_colors_id_seq"
pg_restore: creating TABLE "public.lego_inventories"
pg_restore: creating SEQUENCE "public.lego_inventories_id_seq"
...

```

## Verify the migration

After the restore process completes, you should verify that your data has been successfully migrated:

1. Connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or `psql`. 

2. Run some application queries to check your data. For example, if you're using the LEGO database, you can run the following:

   ```sql
   SELECT COUNT(*) FROM lego_sets;
   SELECT * FROM lego_themes LIMIT 5;
   ```

3. Compare the results with those from running the same queries on your Supabase database to ensure data integrity.

## Clean up

After successfully migrating and verifying your data on Neon, you can update your application's connection strings to point to your new Neon database. We recommend that you keep your Supabase dump file (`supabase_dump.bak`) as a backup for some time. 

## Other migration options

While this guide focuses on using `pg_dump` and `pg_restore`, there are other migration options available:

### Logical replication

For larger databases or scenarios where you need to minimize downtime, you might consider using logical replication. See our guide on [Logical replication](/docs/guides/logical-replication-guide) for more information.

### CSV export/import

For smaller datasets or specific tables, you might consider exporting to CSV from Supabase and then importing to Neon. See [Import data from CSV](/docs/import/import-from-csv) for more details on this method.

## Reference

For more information on the Postgres utilities used in this guide, refer to the following documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [Importing data to Neon](https://neon.tech/docs/import/import-from-postgres)

<NeedHelp/>
