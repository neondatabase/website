---
title: Migrate from Railway Postgres to Neon Postgres
subtitle: Learn how to migrate your database from Railway to Neon Postgres using
  pg_dump and pg_restore
summary: >-
  Step-by-step guide for moving a Railway Postgres database to Neon using
  `pg_dump` and `pg_restore`. Covers how to retrieve Railway's
  `DATABASE_PUBLIC_URL` via the TCP Proxy setting and apply `--no-owner
  --no-acl` flags during restore to drop Railway-specific ownership and access
  control settings. Use this page when migrating from Railway specifically, as
  distinct from the general Postgres migration guide. Also covers logical
  replication and CSV import as alternatives for larger datasets or
  minimal-downtime requirements.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

This guide describes how to migrate a database from Railway to Neon Postgres using the `pg_dump` and `pg_restore` utilities, which are part of the Postgres client toolset. `pg_dump` works by dumping both the schema and data in a custom format that is compressed and suitable for input into `pg_restore` to rebuild the database.

## Prerequisites

- A Railway project containing the Postgres database you want to migrate.

- A Neon project to move the data to.

  For detailed information on creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project). Make sure to create a project with the same Postgres version as your Railway deployment.

- `pg_dump` and `pg_restore` utilities installed on your local machine. These typically come with a Postgres client installation. Install the same version of Postgres client tools as the Postgres version used in your Railway database to ensure compatibility.

  To check the version of `pg_dump` or `pg_restore`, use the `-V` option. For example: `pg_dump -V`.

- Review the guide on [Migrating data from Postgres](/docs/import/migrate-from-postgres) for more comprehensive information on using `pg_dump` and `pg_restore`.

<Steps>

## Prepare your Railway database

This section describes how to prepare your Railway database for exporting data.

To illustrate the migration workflow, this guide uses the [LEGO Database](/docs/import/import-sample-data#lego-database). This database contains information about LEGO sets, parts, and themes. The LEGO database is loaded into Railway using the [psql](/docs/connect/query-with-psql-editor) command-line tool.

### Retrieve Railway connection details

1. Log in to your [Railway dashboard](https://railway.com/dashboard) and navigate to your project.
2. Select your Postgres service in the project canvas.
3. Click the **Variables** tab to view the environment variables.
4. Copy the value of the `DATABASE_PUBLIC_URL` variable.
   <Admonition type="tip">
   To connect to your Railway database from your local machine, ensure the [TCP Proxy](https://docs.railway.com/networking/tcp-proxy) is enabled for your database service. With the proxy active, you can use the `DATABASE_PUBLIC_URL` connection string to connect to your database from your local machine.
   ![TCP Proxy toggle in Railway dashboard](/docs/import/railway_tcp_proxy.png)
   </Admonition>

You'll need this connection string for `pg_dump` to connect to the Railway database.

## Export data with pg_dump

Now that you have your Railway connection details, you can export your data using `pg_dump`:

```bash shouldWrap
pg_dump -Fc -v -d <railway_database_url> --schema=public -f railway_dump.bak
```

Replace `<railway_database_url>` with your Railway `DATABASE_URL`.

This command includes these arguments:

- `-Fc`: Outputs the dump in custom format, which is compressed and suitable for input into `pg_restore`.
- `-v`: Runs `pg_dump` in verbose mode, allowing you to monitor the dump operation.
- `-d`: Specifies the connection string for your Railway database.
- `-f`: Specifies the output file name.
- `--schema=public`: Specifies the schema to dump. In this case, you only want to back up tables in the `public` schema.

If the command was successful, you'll see output similar to the following:

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

## Prepare your Neon destination database

This section describes how to prepare your destination Neon Postgres database to receive the imported data.

### Create the Neon database

To maintain consistency with your Railway setup, you might want to create a new database in Neon with the same database name used in Railway.

1. Connect to your Neon project using the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or a Postgres client like `psql`.

2. Create a new database. For example, if your Railway database was named `lego`, run:

   ```sql
   CREATE DATABASE lego;
   ```

For more information, see [Create a database](/docs/manage/databases#create-a-database).

### Retrieve Neon connection details

1. In the Neon Console, go to your **Project Dashboard**.
2. Select **Connect** to open the **Connect to your database** modal.
3. Select the user and database as needed for your connection. Make sure the **Connection pooling** toggle is disabled to get a direct connection string.
4. Copy the connection string. It will look similar to this:

   ```text shouldWrap
   postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
   ```

## Restore data to Neon with pg_restore

Now you can restore your data to the Neon database using `pg_restore`:

```bash
pg_restore -d <neon-connection-string> -v --no-owner --no-acl railway_dump.bak
```

Replace `<neon-connection-string>` with your Neon connection string.

This command includes these arguments:

- `-d`: Specifies the connection string for your Neon database.
- `-v`: Runs `pg_restore` in verbose mode.
- `--no-owner`: Skips setting the ownership of objects as in the original database.
- `--no-acl`: Skips restoring access privileges for objects as in the original database.

Use the `--no-owner` and `--no-acl` options to skip restoring ownership and access control settings from Railway. After migrating the data, review and configure the appropriate roles and privileges for all objects, as needed. For more information, refer to the section on [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

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

1. Connect to your Neon database using the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or [psql](/docs/connect/query-with-psql-editor).

2. Run some application queries to check your data. For example, if you're using the LEGO database, you can run the following:

   ```sql
   SELECT * FROM lego_inventory_parts ORDER BY quantity DESC LIMIT 5;
   SELECT parent_id, COUNT(name) FROM lego_themes GROUP BY parent_id;
   ```

3. Compare the results with those from running the same queries on your Railway database to ensure data integrity.

## Clean up

After successfully migrating and verifying your data on Neon, you can update your application's connection strings to point to your new Neon database. Keep your Railway database dump file (`railway_dump.bak`) as a backup until you've verified that the migration was successful.

</Steps>

## Other migration options

While this guide focuses on using `pg_dump` and `pg_restore`, there are other migration options available:

- **Logical replication**

  For larger databases or scenarios where you need to minimize downtime, you might consider using logical replication. See the guide on [Logical replication](/docs/guides/logical-replication-guide) for more information.

- **CSV export/import**

  For smaller datasets or specific tables, you might consider exporting to CSV from Railway and then importing to Neon. See [Import data from CSV](/docs/import/import-from-csv) for more details on this method.

## Reference

For more information on the Postgres utilities used in this guide, refer to the following documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [Migrating data to Neon](/docs/import/migrate-from-postgres)

<NeedHelp/>
