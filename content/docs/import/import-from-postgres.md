---
title: Import data from PostgreSQL
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/tutorials
  - /docs/how-to-guides/import-an-existing-database
---

This topic describes how to import an existing PostgreSQL database to Neon. The following methods are described:

- [pg_dump with psql](#use-pg_dump-with-psql)
- [pg_dump with pg_restore](#use-pg_dump-with-pg_restore)

## Which import method should you use?

The primary determinant is the format of your dump file. The `psql` utility is used for plain SQL dumps, and `pg_restore` is used for PostgreSQL custom format dumps.

If you prefer working with human-readable SQL scripts that can be inspected or edited using a text editor, the [pg_dump with psql](#pg_dump-with-psql) method may be your preferred option.

If you are importing a large or complex dataset, you might choose the [pg_dump with pg_restore](#pg_dump-with-pg_restore) method. The `pg_restore` utility has these advantages:

- It may be faster, particularly for large databases.
- It supports parallel restoration of data.
- It allows for greater flexibility during the restore process.

Ultimately, you should familiarize yourself with the capabilities of the `pg_dump`, `psql`, and `pg_restore` utilities and choose the import method that meets your requirements.

## pg_dump with psql

This section describes using the `pg_dump` utility to dump data from an existing PostgreSQL database and import it into Neon using `psql`.

<Admonition type="note">
If you have multiple databases to import, each database must be imported separately.
</Admonition>

The example below uses the following command, which you can run from a terminal or command window where you have access to the `pg_dump` and `psql` utilities. The first connection string is for your existing PostgreSQL database. The second is for your Neon database.

```bash
pg_dump <connection-string> | psql <connection-string>
```

A PostgreSQL connection string has the following format:

```bash
postgres://<user>:<password>@<hostname>:<port>/<dbname>
```

You must supply the connection string for your existing PostgreSQL database. You can obtain the connection string for your Neon database from the **Connection Details** widget on the Neon **Dashboard**. The connection string will look something like this:

```bash
postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/neondb
```

where:

- `<user>` is the PostgreSQL role.
- `<password>` is the role's password.
- `ep-polished-water-579720.us-east-2.aws.neon.tech` is the hostname of the Neon PostgreSQL instance. Your hostname will differ.
- `5432` is the port number of the PostgreSQL instance. Neon uses this default PostgreSQL port number.
- `neondb` is the name of the default Neon database. You can use this database or create your own. For instructions, see [Create a database](../docs/manage/databases#create-a-database).

After you input the connection strings into your command, it will appear similar to the following:

```bash
pg_dump postgres://<user>:<password>@<hostname>:5432/<dbname> | psql postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
```

Run the command in your terminal or command window to import your data.

## pg_dump with pg_restore

This section describes how to use the `pg_dump` utility to dump data from an existing PostgreSQL database and import it into your Neon database using `pg_restore` .

1. Start by retrieving the connection strings for the existing PostgreSQL database and your Neon database.

    You must supply the connection string for your existing PostgreSQL database. You can obtain the connection string for your Neon database from the **Connection Details** widget on the Neon **Dashboard**. The connection string will look something like this:

    ```bash
    postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/neondb
    ```

2. Dump the database from your existing PostgreSQL instance. You can use a `pg_dump` command similar to the following:

    ```bash
    pg_dump "postgres://<user>:<hostname>:<port>/<dbname>" --file=dumpfile.bak -Fc -Z 6 -v
    ```

    The example above includes some optional arguments. The `-Fc` option sends the output to a custom-format archive suitable for input into `pg_restore`. The `-Z 6` option specifies a compression level of 6 (the default). The `-v` option runs `pg_dump` in verbose mode, allowing you to monitor what happens during the dump.

    The `pg_dump` command provides many other options to modify your database dump. To learn more about the options used in the example above and others available to you, refer to the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) documentation.

3. Load the database dump into Neon using `pg_restore`. For example:

      ```bash
      pg_restore -d postgres://[user]:[password]@[hostname]/<dbname> -Fc -j 4 dumpfile.bak.gz -c -v
      ```

    The example above includes some optional arguments. The `-Fc` option sends the output a custom-format archive suitable for input into `pg_restore`. The `-j 4` option specifies the number of concurrent jobs (sessions). The `-c` option tells the restore operation to run `clean`, meaning that it will drop database objects before recreating them. The `-v` option runs `pg_dump` in verbose mode, allowing you to monitor what happens during the restore operation.

    The `pg_restore` command provides other options to modify your database import.  To learn more about the options used in the example above and others available to you, refer to the [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) documentation.

## Data import notes

When importing a database, be aware of the following:

- If you are importing a database from an archive using `pg_dump` that is not in plain-text format, you must use the `pg_restore` utility instead of `psql` to restore the database to Neon.
- Currently, Neon only supports database creation via the Neon Console, so you can not use `pg_dumpall` or `pg_dump` with the `-C` option.
- Because `pg_dump` dumps a single database, it does not include information about roles stored in the global `pg_authid` catalog. Also, Neon does not support creating roles using `psql`. You can only create roles using the Neon Console. If you do not create roles in Neon before importing a database that has roles, you will receive "role does not exist" errors during the import operation. You can ignore this warning. It does not prevent data from being imported.
- `pg_restore` supports a `--single-transaction` option that forces the operation to run as a single transaction to ensure that either all the commands complete successfully, or no changes are applied. This option is not used in the `pg_restore` example above because it is not compatible with the `-j` option for concurrent jobs. Consider using this option if you want to make sure that no data is left behind if your import operation fails. Retrying an import operation after a failed attempt that leaves data behind could result in "duplicate key value" errors.
- Some PostgreSQL features that require access to the local file system are not supported by Neon. For example, tablespaces and large objects are not supported. Please take this into account when importing a database from PostgreSQL to Neon. When importing from a plain-text `.sql` script, you can specify the `pg_dump --no-tablespaces` option to exclude commands that select tablespaces. This option is ignored when emitting an archive (non-text) output file. For custom-format archive files, you can specify the option when you call `pg_restore`. To exclude large objects from your dump, you can use the `pg_dump --no-blobs` option.
- You can import individual tables from a custom-format database dump using the `pg_restore -t <table_name>` option. Individual tables can also be imported from a CSV file. See [Import from CSV](../import/import-from-csv).

For information about the commands referred to in this topic, refer to the following topics in the PostgreSQL documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [psql](https://www.postgresql.org/docs/current/app-psql.html)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
