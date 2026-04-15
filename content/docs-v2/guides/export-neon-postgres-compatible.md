---
title: Postgres-compatible export from Neon
subtitle: Export your Neon database with pg_dump as a standard Postgres archive
summary: >-
  How to export your Neon database to a Postgres-compatible archive using
  pg_dump, and a standard pg_restore pattern for the same dump, with caveats to
  validate import steps against your destination Postgres provider.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-03-30T12:00:00.000Z'
---

This topic describes how to export your **Neon** database to a **Postgres-compatible** archive using the Postgres **`pg_dump`** utility. You get a normal custom-format dump (for example `-Fc`) that any Postgres toolchain can consume.

Once you have the archive, importing it is standard Postgres tooling. The **[Restore on your destination](#restore-on-your-destination-with-pg-restore)** section below shows a **`pg_restore`** command that pairs with the **`-Fc`** export. **You must still check your destination Postgres platform or provider.** Their docs are authoritative for SSL, networking, extensions, roles, empty-database requirements, and any managed import UI they offer.

## Export steps on Neon

<Admonition type="important">
Avoid using `pg_dump` over a [pooled connection string](/docs/reference/glossary#pooled-connection-string). Use an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string) instead.
</Admonition>

1. In the Neon Console, open **Connect** and turn **Connection pooling** **off**. Copy the connection string.

2. Run **`pg_dump`** in **custom** format (`-Fc`) and write a dump file:

   ```bash shouldWrap
   pg_dump -Fc -v -d "<neon_database_connection_string>" -f <dump_file_name>
   ```

   With your Neon URL and a file name filled in, a command looks like this:

   ```bash shouldWrap
   pg_dump -Fc -v -d "postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f mydatabase.bak
   ```

   The `pg_dump` arguments above:
   - **`-Fc`**: Custom-format archive for **`pg_restore`**.
   - **`-v`**: Verbose output during the dump.
   - **`-d`**: Your Neon database [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
   - **`-f`**: Output file path (for example `mydatabase.bak`).

3. Store the file where your restore environment can reach it securely.

Each **`pg_dump`** run covers **one** Neon database. If your project has multiple databases, run **`pg_dump`** again with the other connection strings (and separate dump files).

For installing `pg_dump` on your machine, see [Backups with pg_dump](/docs/manage/backup-pg-dump). For advanced options, ownership, and piping, see [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).

## Restore on your destination with `pg_restore`

A **custom-format** dump (`-Fc`) from Neon is restored with **`pg_restore`**. Use the **same dump file** you wrote with **`pg_dump -f`** in [Export steps on Neon](#export-steps-on-neon) (the examples below use **`mydatabase.bak`** to match the export example).

**Before you run this:** Confirm with **your destination’s documentation** that **`pg_restore`** against a custom-format (**`-Fc`**) archive is supported.

- **Postgres version:** Plan for the destination server to run a Postgres **major version that matches your Neon database or is newer**. Restoring into an **older** major version than the cluster you dumped from often **fails**. If versions differ, follow your provider’s compatibility guidance and test first.
- **Extensions and settings:** The destination must support the **extensions** and features your Neon database uses, or you adjust before cutover.
- **Roles:** Source and destination role names often differ. Plan for **`-O` / `--no-owner`** on **`pg_restore`** (see below) so restores do not depend on matching role OIDs.

Install **`pg_dump`** and **`pg_restore`** builds that your **Neon** Postgres version and your **destination** provider support (if the two differ, follow each side’s client guidance; see [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) in the Postgres manual).

1. Create or select a **target database** on your destination as their docs require (**empty** is typical so objects from the dump do not collide with existing schema or data).

2. Obtain a **connection string** for that database.

3. Run **`pg_restore`** against the destination, passing the dump file path last (same role as **`-f`** on **`pg_dump`**):

   ```bash shouldWrap
   pg_restore -v -d "<destination_database_connection_string>" <dump_file_name>
   ```

   With your destination URL and the same file name you used when exporting, a command looks like this:

   ```bash shouldWrap
   pg_restore -v -d "postgresql://user:password@db.example.com:5432/mydb?sslmode=require" mydatabase.bak
   ```

   The `pg_restore` arguments above:
   - **`-v`**: Verbose output while restoring.
   - **`-d`**: Target database [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) (your provider’s URL format and query parameters).
   - **`<dump_file_name>`**: The custom-format archive from **`pg_dump`** (for example **`mydatabase.bak`** from the **`pg_dump`** command in [Export steps on Neon](#export-steps-on-neon)).

If restore fails on ownership or role statements, try adding **`-O`** and consult [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations). For more flags (parallel jobs, schema-only, exclusions), see [Advanced pg_dump and pg_restore options](/docs/import/migrate-from-postgres#advanced-pg_dump-and-pg_restore-options).

## Related

- [Region migration](/docs/import/region-migration)
- [Backups with pg_dump](/docs/manage/backup-pg-dump)
- [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres)

<NeedHelp/>
