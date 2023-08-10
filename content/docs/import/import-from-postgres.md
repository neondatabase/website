---
title: Import data from Postgres
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/tutorials
  - /docs/how-to-guides/import-an-existing-database
---

This topic describes how to migrate data from another Postgres database to Neon.

We recommend using the `pg_dump` and `pg_restore` command line utilities for database migration. Migration steps typically include the following:

1. Place your database into read-only mode.
2. Export data from your database with the `pg_dump` utility.
3. Restore your data to a Neon database with the with the `pg_restore` utility.
5. Update your applications to connect to the new database.
6. Test your applications to ensure they function correctly with the new database.
7. Repeat the process for each database you want to migrate.

## Before you begin

- Neon supports PostgreSQL 14 and 15. We recommend that clients are version 14 and higher. To check the version of `pg_dump` or `pg_restore`, use the `-V` option. For example: `pg_dump -V`
- Collect the connection details for your source Postgres database. The instructions below use a [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING), but use the connection parameter format you prefer. Refer to the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) documentation for connection parameters.
- Create roles in Neon. The Neon role that performs the restore operation becomes the owner of database objects that are restored. If you want role `sally` to own database objects, create `role` sally in Neon and perform the restore operation as role `sally`. You may also want to create any roles that are assigned database object privileges in your source database. If ownership and privileges are defined in your source database, read [Ownership and privilege considerations](#ownership-and-privilege-considerations) before you begin.
- Create the database in Neon. For example, if you are migrating a database named `pagila`, create a `pagila` database in Neon. The database owner should be the role that will perform the restore operation. For instructions, see [Create a database](/docs/manage/databases#create-a-database).
- Retrieve the connection string for your Neon Postgres database. You can find it on the **Connection Details** widget on the Neon **Dashboard**. It will look something like this:

   <CodeBlock shouldWrap>

   ```bash
   postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
   ```

   </CodeBlock>

- Run a test migration first. See [Run a test migration](#run-a-test-migration).
- If your database is small (< 1 GB), you can pipe the output of `pg_dump` directly to `pg_restore` to save time. See [Pipe pg_dump to pg_restore](#pipe-pg_dump-to-pg_restore).

## Place your database into read-only mode

Placing your database in read-only mode prevents writes to your database while you perform the migration. Make sure you are ready to perform the migration before you do this. You will experience downtime for writes from the moment you set your database to read-only.

You can set a specific database as read-only by altering its default transaction mode:

```sql
ALTER DATABASE my_database_name SET default_transaction_read_only = true;
```

Alternatively, if permitted on the platform you are migrating from, you can modify your database configuration to restrict connection types. For example, you can change the authentication method for all users in your `pg_hba.conf` file (PostgreSQL's client authentication configuration file) to `reject` except for `SELECT` statements. This method requires an understanding of PostgreSQL configuration.

## Export data with `pg_dump`

Export your data from the source database with `pg_dump`:

<CodeBlock shouldWrap>

```bash
pg_dump -Fc -d <source_database_connection_string> -f <dump_file_name> 
```

</CodeBlock>

The `pg_dump` command above includes these arguments:

- `-Fc`: Sends the output to a custom-format archive suitable for input into `pg_restore`.
- `-d`: Specifies the source database name. The value can be a [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING), as in the example above.
- `-f`: The dump file name. It can be any name you choose (`mydump.bak`, for example).

For more command options, see [Advanced options](#advanced-options).

## Restore data to Neon with `pg_restore`

Restore your data to the target Neon database with `pg_restore`:

<CodeBlock shouldWrap>

```bash
pg_restore -d <neon_database_connection_string> <dump_file_name>
```

</CodeBlock>

<Admonition type="note">

</Admonition>

The example above includes these arguments:

- `-d`: Specifies the the Neon database to connect to. The value is a Neon database connection string. See [Before you begin](#before-you-begin).

For more command options, see [Advanced options](#advanced-options).

## pg_dump and pg_restore example

The following example shows how data from a `pagila` source database was dumped and restored to a `pagila` database in Neon using the commands described in the previous section. A `pagila` database was created in Neon prior to the restore operation.

<CodeBlock shouldWrap>

```bash
~$ cd mydump
~/mydump$ pg_dump -Fc -d postgresql://sally:<password>@<hostname>:<port>/pagila -f mydumpfile.bak 

~/mydump$ ls
mydumpfile.bak

~/mydump$ pg_restore postgres://sally:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/pagila mydumpfile.bak
```

</CodeBlock>

## Ownership and privilege considerations

Roles created in the Neon console, including the default role created with your Neon project, are automatically granted membership in the [neon_superuser](/docs/manage/roles#neon_superuser) group. This role can create roles and databases, and select, insert, update, or delete data from all databases in your Neon project. However, the `neon_superuser` is not a PostgreSQL `superuser`. It cannot run `ALTER OWNER` statements to set ownership of database objects. As a result, if you granted ownership of database objects in your source database, your dump file will contain `ALTER OWNER` statements, and those statements will cause non-fatal errors when you restore data to your target database in Neon if steps are not taken to avoid these errors. Additionally, any statements in your dump file that grant or revoke access privileges to roles that do not exist in Neon will also produce non-fatal errors.

<Admonition type="note">
Regardless of `ALTER OWNER` or `GRANT/REVOKE` statement errors, a restore operation still succeeds because ownership and permissions are not necessary for the data itself to be restored. The restore operation to a target database in Neon, will still create tables, import data, and create other objects.
</Admonition>

To avoid these non-fatal errors, you can take one of the following approaches:

- _Option 1_: Exclude database object ownership and privilege assignment statements from being executed when you restore data by specifying the `-O`, `--no-owner` and `-x`, `--no-privileges` options with `pg_dump`. The Neon role that performs the restore operation becomes the owner of all database objects and privilege assignments are ignored.

  ```bash
  pg_dump -Fc -O -x -d postgresql://sally:<password>@<hostname>:<port>/pagila -f mydumpfile.bak 
  ```

- _Option 2_: Ensure that the Neon role running the restore operation (e.g., `sally`) is also the role that owns all database objects in your source database prior to the dump operation, and that any role assigned database object privileges in your source database are created in Neon prior to the restore operation. This method preserves database object privileges. To use this method:

  1. Identify non-system roles roles on the source database using a query similar to the following:

     ```sql
     SELECT rolname 
     FROM pg_roles 
     WHERE rolname NOT LIKE 'pg_%';
     ```

  2. Create the roles in Neon before you perform the restore operation. See [Manage roles](/docs/manage/roles) for instructions.
  3. Run your restore operation with a Neon role that has the same name as the role that owns the database objects in your source database.

      <CodeBlock shouldWrap>

      ```bash
      pg_restore -d postgres://sally:<password>@ep-tiny-silence-654537.us-east-2.aws.neon.tech/pagila mydump.bak
      ```

      </CodeBlock>

## Run a test migration

It is recommended that you run a test migration before migrating your production database. Make sure you can successfully migrate your data to the new database and connect your applications to the new database. Before starting the migration process and before placing your production database into read-only mode, create a database dump and try migration into database in Neon. You do not need to place your database in to read-only mode to create a dump file. In Neon, you can quickly create a test database in the Neon console, obtain the connection string, and delete the database after you are finished. See [Create a database](/docs/manage/databases#create-a-database).

## Advanced options

The `pg_dump` and `pg_restore` commands provide many advanced options, some of which are described below. Make sure you fully understand what the options do before using them. You can find  full descriptions in the PostgreSQL [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) documentation.

### pg_dump options

- `-O`, `--no-owner` and `-x`, `--no-privileges`: These options prevent dumping ownership and access privileges statements for database objects, which can cause non-fatal errors during the restore operation if your source database includes database object ownership and privilege assignments. For more information, see [Ownership and privilege considerations](#ownership-and-privilege-considerations).
- `-Z`: Defines the compression level to use when using a compressible format. 0 means no compression, while 9 means maximum compression. In general, we recommend a setting of 1. A higher compression level slows the dump and restore process but also uses less disk space.
- `-v`: runs `pg_dump` in verbose mode, allowing you to monitor what happens during the dump operation.

### pg_restore options

- `-c --if-exists` Drop database objects before creating them, if they already exist. If you have had a failed migration, you can use these options to drop objects created by the previous migration to avoid errors when you retry the migration.
- `--single-transaction`: Forces the operation to run as an atomic transaction, which ensures that no data is left behind when a restore operation fails. Retrying an import operation after a failed attempt that leaves data behind may result in "duplicate key value" errors.
- `-v` runs `pg_restore` in verbose mode, allowing you to monitor what happens during the restore operation.

## Pipe pg_dump to pg_restore

For small databases (< 1 GB), the standard output of `pg_dump` can be piped directly into a `pg_restore` command to minimize migration downtime:

```bash
pg_dump [args] | pg_restore [args]
```

For example:

```bash
pg_dump -F c -d <source_database_connection_string> | pg_restore -d <neon-database-connection-string>
```

Piping is not recommended for medium (> 1 GB) and large databases ( > 5 GB), as it is more prone to failure during lengthier migration operations.

When piping `pg_dump` output directly to `pg_restore`, the custom output format (`-Fc`) is most efficient. The directory format (`-Fd`) format cannot be piped to `pg_restore` directly.

## Other migration options

This section discusses migration options other than the `pg_dump` and `pg_restore` method.

### Postgres GUI clients

Some Postgres clients offer backup and restore capabilities. These include [pgAdmin](https://www.pgadmin.org/docs/pgadmin4/latest/backup_and_restore.html) and [phppgadmin](https://github.com/phppgadmin/phppgadmin/releases), among others. We have not tested a migration using these clients, but if you are uncomfortable using command-line utilities, they may offer a viable alternative. As mentioned previously, a test migration is recommended. See [Run a test migration](#run-a-test-migration).

### Table-level data migration

Table-level data migration, using CSV files for example, does not preserve database schemas, constraints, indexes, types, or other database features. You will have to create these. Table-level migration is simple but could result in significant downtime depending on the size of your data and the number of tables. If you are working with small datasets and a small number of tables and prefer this method, you can find instructions for importing from CSV here: [Import data from CSV](/docs/import/import-from-csv).

## Data migration notes

When migrating a database, be aware of the following:

- You can load data using the `psql` utility, but it only supports plain-text SQL dumps, which should only be considered for small datasets or specific use cases. To create a plain-text SQL dump with the `pg_dump` utility, do not specify the `-F` format option. Plain-text SQL output is the default `pg_dump` output format.
- `pg_dumpall` is not supported.
- `pg_dump` with the `-C, --create` option is not supported.
- Some PostgreSQL features that require access to the local file system are not supported by Neon. For example, tablespaces and large objects are not supported. Please take this into account when importing a database into to Neon. For custom-format archive files, you can specify the `--no-tablespaces` option with `pg_restore`. To exclude large objects from your dump, use the `--no-blobs` option with `pg_dump`.
- You can import individual tables from a custom-format database dump using the `-t <table_name>` option with `pg_restore`. Individual tables can also be imported from a CSV file. See [Import from CSV](/docs/import/import-from-csv).

For information about the commands referred to in this topic, refer to the following topics in the Postgres documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [psql](https://www.postgresql.org/docs/current/app-psql.html)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
