---
title: Import data from Postgres with pg_dump and pg_restore
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/tutorials
  - /docs/how-to-guides/import-an-existing-database
updatedOn: '2024-08-07T21:36:52.669Z'
---

This topic describes migrating data from another Postgres database to Neon using the `pg_dump` and `pg_restore`.

<Admonition type="important">
Avoid using `pg_dump` over a [pooled connection string](/docs/reference/glossary#pooled-connection-string) (see PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) & [976](https://github.com/pgbouncer/pgbouncer/issues/976) for details). Use an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string) instead.
</Admonition>

Repeat the `pg_dump` and `pg_restore` process for each database you want to migrate.

## Before you begin

- Neon supports PostgreSQL 14, 15, and 16. We recommend that clients are the same version as source Postgres instance. To check the version of `pg_dump` or `pg_restore`, use the `-V` option. For example: `pg_dump -V`.
- Retrieve the connection parameters or connection string for your source Postgres database. The instructions below use a [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING), but you can use the connection format you prefer. If you are logged in to a local Postgres instance, you may only need to provide the database name. Refer to the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) documentation for information about connection parameters.
- Optionally, create a role in Neon to perform the restore operation. The role that performs the restore operation becomes the owner of restored database objects. For example, if you want role `sally` to own database objects, create `role` sally in Neon and perform the restore operation as `sally`.
- If you have assigned database object ownership to different roles in your source database, read [Database object ownership considerations](#database-object-ownership-considerations). You may want to add the `-O, --no-owner` option to your `pg_restore` command to avoid errors.
- Create the target database in Neon. For example, if you are migrating a database named `pagila`, create a database named `pagila` in Neon. For instructions, see [Create a database](/docs/manage/databases#create-a-database).
- Retrieve the connection string for your Neon database. You can find it in the **Connection Details** widget on the Neon **Dashboard**. It will look something like this:

  ```bash shouldWrap
  postgresql://[user]:[password]@[neon_hostname]/[dbname]
  ```

- Consider running a test migration first to ensure your actual migration goes smoothly. See [Run a test migration](#run-a-test-migration).
- If your database is small, you can pipe `pg_dump` output directly to `pg_restore` to save time. See [Pipe pg_dump to pg_restore](#pipe-pgdump-to-pgrestore).

## Export data with pg_dump

Export your data from the source database with `pg_dump`:

```bash shouldWrap
pg_dump -Fc -v -d <source_database_connection_string> -f <dump_file_name>
```

The `pg_dump` command above includes these arguments:

- `-Fc`: Sends the output to a custom-format archive suitable for input into `pg_restore`.
- `-v`: Runs `pg_dump` in verbose mode, allowing you to monitor what happens during the dump operation.
- `-d`: Specifies the source database name or [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
- `-f`: The dump file name. It can be any name you choose (`mydumpfile.bak`, for example).

For more command options, see [Advanced pg_dump and pg_restore options](#advanced-pgdump-and-pgrestore-options).

## Restore data to Neon with pg_restore

Restore your data to the target database in Neon with `pg_restore`.

<Admonition type="note">
If you assigned database object ownership to different roles in your source database, consider adding the `-O, --no-owner` option to your `pg_restore` command to avoid errors. See [Database object ownership considerations](#database-object-ownership-considerations).
</Admonition>

```bash shouldWrap
pg_restore -v -d <neon_database_connection_string> <dump_file_name>
```

The example above includes these arguments:

- `-v`: Runs `pg_restore` in verbose mode, allowing you to monitor what happens during the restore operation.
- `-d`: Specifies the Neon database to connect to. The value is a Neon database connection string. See [Before you begin](#before-you-begin).
- `<dump_file_name>` is the name of the dump file you created with `pg_dump`.

For more command options, see [Advanced pg_dump and pg_restore options](#advanced-pgdump-and-pgrestore-options).

## pg_dump and pg_restore example

The following example shows how data from a `pagila` source database is dumped and restored to a `pagila` database in Neon using the commands described in the previous sections. (A database named `pagila` was created in Neon prior to running the restore operation.)

```bash shouldWrap
~$ cd mydump
~/mydump$ pg_dump -Fc -v -d postgresql://[user]:[password]@[neon_hostname]/pagila -f mydumpfile.bak

~/mydump$ ls
mydumpfile.bak

~/mydump$ pg_restore -v -d postgresql://[user]:[password]@[neon_hostname]/pagila mydumpfile.bak
```

## Pipe pg_dump to pg_restore

For small databases, the standard output of `pg_dump` can be piped directly into a `pg_restore` command to minimize migration downtime:

```bash
pg_dump [args] | pg_restore [args]
```

For example:

```bash shouldWrap
pg_dump -Fc -v -d <source_database_connection_string> | pg_restore -v -d <neon-database-connection-string>
```

Piping is not recommended for large databases, as it is susceptible to failures during lengthy migration operations.

When piping `pg_dump` output directly to `pg_restore`, the custom output format (`-Fc`) is most efficient. The directory format (`-Fd`) format cannot be piped to `pg_restore`.

## Post-migration steps

After migrating your data, update your applications to connect to your new database in Neon. You will need the database connection string that you used in your `pg_restore` command. If you run into any problems, see [Connect from any application](/docs/connect/connect-from-any-app). After connecting your applications, test them thoroughly to ensure they function correctly with your new database.

## Database object ownership considerations

Roles created in the Neon Console, including the default role created with your Neon project, are automatically granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role. This role can create roles and databases, select from all tables and views, and insert, update, or delete data in all tables. However, the `neon_superuser` is not a PostgreSQL `superuser`. It cannot run `ALTER OWNER` statements to grant ownership of database objects. As a result, if you granted ownership of database objects in your source database to different roles, your dump file will contain `ALTER OWNER` statements, and those statements will cause non-fatal errors when you restore data to your Neon database.

<Admonition type="note">
Regardless of `ALTER OWNER` statement errors, a restore operation still succeeds because assigning ownership is not necessary for the data itself to be restored. The restore operation will still create tables, import data, and create other objects.
</Admonition>

To avoid the non-fatal errors, you can ignore database object ownership statements when restoring data by specifying the `-O, --no-owner` option in your `pg_restore` command:

```bash shouldWrap
pg_restore -v -O -d postgresql://[user]:[password]@[neon_hostname]/pagila mydumpfile.bak
```

The Neon role performing the restore operation becomes the owner of all database objects.

## Advanced pg_dump and pg_restore options

The `pg_dump` and `pg_restore` commands provide numerous advanced options, some of which are described below. Full descriptions and more options are found in the PostgreSQL [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) documentation.

### pg_dump options

- `-Z`: Defines the compression level to use when using a compressible format. 0 means no compression, while 9 means maximum compression. In general, we recommend a setting of 1. A higher compression level slows the dump and restore process but also uses less disk space.
- `--lock-wait-timeout=20s`: Error out early in the dump process instead of waiting for an unknown amount of time if there is lock contention.
  Do not wait forever to acquire shared table locks at the beginning of the dump. Instead fail if unable to lock a table within the specified timeout.`
- `-j <njobs>`: Consider this option for large databases to dump tables in parallel. Set `<njobs>` to the number of available CPUs. Refer to the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) documentation for more information. In Neon, this option only make sense for Neon paid plan users who can configure computes with >1 vCPU.
- `--no-blobs`: Excludes large objects from your dump. See [Data migration notes](#data-migration-notes).

### pg_restore options

- `-c --if-exists`: Drop database objects before creating them if they already exist. If you had a failed migration, you can use these options to drop objects created by the previous migration to avoid errors when retrying the migration.
- `-j <njobs>`: Consider this option for large databases to run the restore process in parallel. Set `<njobs>` to the number of available vCPUs. Refer to the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) documentation for more information. In Neon, this option only makes sense for Neon paid plan users who can configure computes with >1 vCPU. It cannot be used together with `--single-transaction`.
- `--single-transaction`: Forces the operation to run as an atomic transaction, which ensures that no data is left behind when a restore operation fails. Retrying an import operation after a failed attempt that leaves data behind may result in "duplicate key value" errors.
- `--no-tablespaces`: Do not output commands to select tablespaces. See [Data migration notes](#data-migration-notes).
- `-t <table_name>`: Allows you to restore individual tables from a custom-format database dump. Individual tables can also be imported from a CSV file. See [Import from CSV](/docs/import/import-from-csv).

## Run a test migration

It is recommended that you run a test migration before migrating your production database. Make sure you can successfully migrate data to the new database and connect to it. Before starting the actual migration, create a database dump and address any issues that show up. In Neon, you can quickly create a test database, obtain the connection string, and delete the database when you are finished with it. See [Create a database](/docs/manage/databases#create-a-database).

## Other migration options

This section discusses migration options other than `pg_dump` and `pg_restore`.

### Postgres GUI clients

Some Postgres clients offer backup and restore capabilities. These include [pgAdmin](https://www.pgadmin.org/docs/pgadmin4/latest/backup_and_restore.html) and [phppgadmin](https://github.com/phppgadmin/phppgadmin/releases), among others. We have not tested migrations using these clients, but if you are uncomfortable using command-line utilities, they may provide an alternative.

### Table-level data migration

Table-level data migration (using CSV files, for example) does not preserve database schemas, constraints, indexes, types, or other database features. You will have to create these separately. Table-level migration is simple but could result in significant downtime depending on the size of your data and the number of tables. For instructions, see [Import data from CSV](/docs/import/import-from-csv).

## Data migration notes

- You can load data using the `psql` utility, but it only supports plain-text SQL dumps, which you should only consider for small datasets or specific use cases. To create a plain-text SQL dump with `pg_dump` utility, leave out the `-F` format option. Plain-text SQL is the default `pg_dump` output format.
- `pg_dumpall` is not supported.
- `pg_dump` with the `-C, --create` option is not supported.
- Some PostgreSQL features, such as tablespaces and large objects, which require access to the local file system are not supported by Neon. To exclude selecting tablespaces, specify the `--no-tablespaces` option with `pg_restore`. To exclude large objects, specify the `--no-blobs` option with `pg_dump`.

## Reference

For information about the Postgres client utilities referred to in this topic, refer to the following topics in the Postgres documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [psql](https://www.postgresql.org/docs/current/app-psql.html)

<NeedHelp/>
