---
title: Migrate from Digital Ocean Postgres to Neon
subtitle: Learn how to migrate your Postgres database from Digital Ocean to Neon using
  pg_dump and pg_restore
tag: new
redirectFrom:
  - /docs/import/import-from-digital-ocean
enableTableOfContents: true
updatedOn: '2024-09-23T22:07:20.569Z'
---

This guide describes how to migrate a Postgres database from Digital Ocean to Neon using the `pg_dump` and `pg_restore` utilities, which are part of the Postgres client toolset. `pg_dump` works by dumping both the schema and data in a custom format that is compressed and suitable for input into `pg_restore` to rebuild the database.

## Prerequisites

- A Digital Ocean Postgres database containing the data you want to migrate.
- A Neon project to move the data to.
  For detailed information on creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project). Make sure to create a project with the same Postgres version as your Digital Ocean deployment.
- `pg_dump` and `pg_restore` utilities installed on your local machine. These typically come with a Postgres installation.

  We recommended that you use the `pg_dump` and `pg_restore` programs from the latest version of Postgres, to take advantage of enhancements that might have been made in these programs. To check the version of `pg_dump` or `pg_restore`, use the `-V` option. For example: `pg_dump -V`.

- Review our guide on [Importing data from Postgres](/docs/import/migrate-from-postgres) for more comprehensive information on using `pg_dump` and `pg_restore`.

## Prepare your Digital Ocean database

This section describes how to prepare your Digital Ocean database for exporting data.

To illustrate the migration workflow, we populate the Digital Ocean database with the [LEGO dataset](https://neon.tech/docs/import/import-sample-data#lego-database). This database contains information about LEGO sets, parts, and themes.

### Retrieve Digital Ocean connection details

1. Log in to your Digital Ocean account and navigate to the Databases section.
2. Select your Postgres database.
3. In the **Connection Details** section under the **Overview** tab, you'll find the following information:
   - Host
   - Port
   - Database name
   - Username
   - Password (you may need to reset it if you don't have it)

You'll need these details to construct the connection string for `pg_dump`. Alternatively, you can toggle to the `Connection string` option to get the `postgresql://` connection string, which can be used directly with postgres CLI tools.

## Export data with pg_dump

Now that you have the Digital Ocean connection details, you can export your data using `pg_dump`:

```bash shouldWrap
pg_dump -Fc -v -d postgresql://[username]:[password]@[host]:[port]/[database] -f digitalocean_dump.bak
```

Replace `[username]`, `[password]`, `[host]`, `[port]`, and `[database]` with your Digital Ocean connection details.

This command includes these arguments:

- `-Fc`: Outputs the dump in custom format, which is compressed and suitable for input into `pg_restore`.
- `-v`: Runs `pg_dump` in verbose mode, allowing you to monitor the dump operation.
- `-d`: Specifies the connection string for your Digital Ocean database.
- `-f`: Specifies the output file name.

If the command was successful, you'll see output similar to the following:

```bash
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

Each Neon project comes with a default database named `neondb`. To maintain consistency with your Digital Ocean setup, create a new database with the same name.

1. Connect to your Neon project using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a Postgres client like `psql`.

2. Create a new database. For example, if your Digital Ocean database was named `lego`, run:

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
pg_restore -d <neon-connection-string> -v --no-owner --no-acl digitalocean_dump.bak
```

Replace `<neon-connection-string>` with your Neon connection details.

This command includes these arguments:

- `-d`: Specifies the connection string for your Neon database.
- `-v`: Runs `pg_restore` in verbose mode.
- `--no-owner`: Skips setting the ownership of objects as in the original database.
- `--no-acl`: Skips restoring access privileges for objects as in the original database.

We recommend using the `--no-owner` and `--no-acl` options to skip restoring these settings, as they may not be compatible between Digital Ocean and Neon. After migrating the data, review and configure the appropriate roles and privileges for all objects, as needed.

If the command was successful, you'll see output similar to the following:

```bash
pg_restore: connecting to database for restore
pg_restore: creating SCHEMA "public"
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

2. Run some application queries to check your data. For example, if you're using the `LEGO` database, you can run the following:

   ```sql shouldWrap
   SELECT is_trans AS is_transparent, COUNT(*) FROM lego_colors GROUP BY is_trans;
   SELECT * FROM lego_sets ORDER BY num_parts DESC LIMIT 5;
   ```

3. Compare the results with those from running the same queries on your Digital Ocean database to ensure data integrity.

## Clean up

After successfully migrating and verifying your data on Neon, you can update your application's connection strings to point to your new Neon database. We recommend that you keep your Digital Ocean database dump file (`digitalocean_dump.bak`) as a backup until you've verified that the migration was successful.

## Other migration options

While this guide focuses on using `pg_dump` and `pg_restore`, there are other migration options available:

- **Logical replication**

  For larger databases or scenarios where you need to minimize downtime, you might consider using logical replication. See our guide on [Logical replication](/docs/guides/logical-replication-guide) for more information.

- **CSV export/import**

  For smaller datasets or specific tables, you might consider exporting to CSV from Digital Ocean and then importing to Neon. See [Import data from CSV](/docs/import/import-from-csv) for more details on this method.

## Reference

For more information on the Postgres utilities used in this guide, refer to the following documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [Migrating data to Neon](https://neon.tech/docs/import/migrate-from-postgres)

<NeedHelp/>
