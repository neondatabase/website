---
title: Import data from PostgreSQL
redirectFrom:
  - /docs/cloud/tutorials
  - /docs/how-to-guides/import-an-existing-database
---

This topic describes how to import an existing PostgreSQL database to Neon.

- [Use pg_dump with psql](#use-pg_dump-with-psql)
- [Use pg_dump with pg_restore](#use-pg_dump-with-pg_restore)
- [Import a database from another Neon project](#import-a-database-from-another-neon-project)

## Use pg_dump with psql

This section describes how to use the `pg_dump` utility to dump data from an existing PostgreSQL database and import it into Neon using `psql`.

The example below uses the following command, which you can run from a terminal or command window where you have access to the `pg_dump` and `psql` utilities.

```bash
pg_dump <connection-string> | psql <connection-string>
```

The first connection string is for your existing PostgreSQL database. The second is for your Neon database.

A PostgreSQL connection string has the following format:

```bash
postgres://<user>:<password>@<hostname>:<port>/<dbname>
```

You must supply the connection string for your existing PostgreSQL database. You can obtain the connection string for your Neon database from the **Connection Details** widget on the Neon **Dashboard**. The connection string will look something like this:

```bash
postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/neondb
```

where:

- `<user>` is the PostgreSQL role.
- `<password>` is the role's password.
- `ep-polished-water-579720.us-east-2.aws.neon.tech` is the hostname of the Neon PostgreSQL instance. Your hostname will differ.
- `5432` is the port number of the PostgreSQL instance. Neon uses this default PostgreSQL port number.
- `neondb` is the name of the default Neon database. You can use this database or create your own. For instructions, see [Create a database](../docs/manage/databases#create-a-database).

After you input the connection strings into the command, it will appear similar to the following:

```bash
pg_dump postgres://<user>:<password>@<hostname>:5432/<dbname> | psql postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/<dbname>
```

Run the command to import your data.

If you have multiple databases to import, each database must be imported separately.

## Use pg_dump with pg_restore

This section describes how to use the `pg_dump` utility to dump data from an existing PostgreSQL database and import it into your Neon database using `pg_restore` .

1. Start by retrieving the connection details for the existing PostgreSQL database and your Neon database.

  You must supply the connection details for your existing PostgreSQL database. You can obtain the connection string for your Neon database from the **Connection Details** widget on the Neon **Dashboard**. The connection string will look something like this:

  ```bash
  postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/neondb
  ```

2. Dump the database from your existing PostgreSQL instance. You can use a `pg_dump` command similar to the following:

  ```bash
  pg_dump "postgres://<user>:<hostname>:<port>/<dbname>" --file=dumpfile.bak -Fc -Z 6 -v
  ```

The `-Fc` option sends the output a custom-format archive suitable for input into `pg_restore`. The `-Z 6` option specifies a compression level of 6 (the default). The `-v` option runs `pg_dump` in verbose mode, allowing you to monitor what happens during the dump.

The `pg_dump` command provides many other options you can use to modify your database dump. To learn more, refer to the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) documentation.

3. Load the database dump into Neon using `pg_restore`. For example:

  ```bash
  pg_restore -d postgres://[user]:[password]@[hostname]/<dbname> -Fc -j 4 employees.sql.gz -c -v
  ```

  The `-Fc` option sends the output a custom-format archive suitable for input into `pg_restore`. The `-j 4` option specifies the number of concurrent jobs (sessions). The `-c` option tell the restore operation to run `clean`, meaning that it will drop database objects before recreating them. The `-v` option runs `pg_dump` in verbose mode, allowing you to monitor what happens during the dump.

As with `pg_dump`, the `pg_restore` command provides many other options you can use to modify your database import. For example, the `--single-transaction` option forces the operation to run as a single transaction to ensure that either all the commands complete successfully, or no changes are applied. This option is not used above because it is not compatible with the `-j` option. To learn about other options, refer to the [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) documentation.

## Import a database from another Neon project

This section describes how to import a database from another Neon project. For example, you can use these instructions to move a database from a Neon project created with PostgreSQL 14 to a Neon project created with PostgreSQL 15, or from a Neon project created in one region to a project in created in a different region.

<Admonition type="note">
The Neon Free Tier provides a single Neon project. If you need to move your data to a new Neon project created in a different region or with a different PostgreSQL version, dump your database first, delete your Neon project, create a new Neon project with the desired region or PostgreSQL version, and import your data into the new project. For the dump and restore procedure, refer to [Use pg_dump with pg_restore](#use-pg_dump-with-pg_restore).
</Admonition>

1. Start by retrieving the connection details for your Neon databases.

  You can obtain the connection string for your Neon databases from the Neon **Dashboard**, under **Connection Details**. The connection strings will look something like this:

  ```bash
  postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/<dbname>
  ```

2. Prepare your dump and import command. It will look something like this:

```bash
pg_dump postgres://myneonrole:a1B2c3D4e5F6@ep-dawn-union-749234.us-east-2.aws.neon.tech:5432/<dbname> | psql postgres://myneonrole:a1B2c3D4e5F6@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/<dbname>
```

3. Run the dump and import command.

## Data import notes

When importing a database, be aware of the following:

- If you are importing a database from an archive using `pg_dump` that is  not in plain-text format, use the `pg_restore` utility instead of `psql` to restore the database to Neon.
- Neon is not able to create databases, so you can not use `pg_dumpall` or `pg_dump` with the `-C` option.
- Because `pg_dump` dumps a single database, it does not include information about roles stored in the global `pg_authid` catalog. Also, Neon does not support creating roles using `psql`. You can only create roles using the Neon Console. If you do not create roles in Neon before importing a database that has roles, you will receive "role does not exist" errors during the import operation. You can ignore this warning. It does not prevent data from being imported.
- Some PostgreSQL features that require access to the local file system are not supported by Neon. For example, tablespaces and large objects are not supported. Please take this into account when importing a database from PostgreSQL to Neon.
- In addition to databases, Neon supports importing individual tables from a standalone PostgreSQL instance. You can do this using the `COPY` command. The only requirement is that the data is transferred through a replication stream, which may affect the performance of other queries, including those unrelated to the table you are copying. Individual tables can also be imported from a CSV file. See [Import from CSV](../import/import-from-csv).

For information about the commands referred to in this topic, refer to the following topics in the PostgreSQL documentation:

- [pgdump](https://www.postgresql.org/docs/14/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/14/app-pgrestore.html)
- [psql](https://www.postgresql.org/docs/14/app-psql.html)
- [COPY](https://www.postgresql.org/docs/14/sql-copy.html)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
