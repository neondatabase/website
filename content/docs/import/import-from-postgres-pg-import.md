---
title: Import data from Postgres with the @neondatabase/pg-import CLI
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.669Z'
---

This topic describes migrating data from another Postgres database to Neon using the `@neondatabase/pg-import` CLI. This tool is built on top of the Postgres `pg_dump` and `pg_restore` client utilities. It is intended to simplify data migrations for smaller, less complex databases compared to using the `pg_dump` and `pg_restore` client utilities directly, as described in [Import data from Postgres](/docs/import/import-from-postgres).

<Admonition type="important">
The `@neondatabase/pg-import` CLI is experimental. There may be bugs, and the API is subject to change.
</Admonition>

The`@neondatabase/pg-import` utility supports all Neon Postgres versions.

## Before you begin

- Make sure your Neon plan supports your database size. The Neon Free Plan offers 0.5 GiB of storage. For larger data sizes, upgrade to one of our paid plans: Launch, Scale, or Business. See Neon [plans](/docs/introduction/plans). If you are on a Neon paid plan, you can optimize for the migration by configuring a larger compute size or enabling [autoscaling](/docs/guides/autoscaling-guide) for additional CPU and RAM. See [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).
- Retrieve the [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) for your source Postgres database.
- Optionally, [create a role in Neon](/docs/manage/roles#manage-roles-in-the-neon-console) to perform the restore operation. The role that performs the restore operation becomes the owner of restored database objects. For example, if you want role `sally` to own database objects, create `role` sally in Neon and perform the restore operation as `sally`.
- Create the target database in Neon. For example, if you are migrating a database named `pagila`, create a database named `pagila` in Neon. For instructions, see [Create a database](/docs/manage/databases#create-a-database).
- Retrieve the connection string for your Neon database. You can find it in the **Connection Details** widget on the Neon **Dashboard**. If you created a role to perform the restore operation, make sure to select that role. Your connection string will look something like this:

  ```bash shouldWrap
  postgresql://[user]:[password]@[neon_hostname]/[dbname]
  ```

  Avoid using a [pooled Neon connection string](/docs/reference/glossary#pooled-connection-string) (see PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) & [976](https://github.com/pgbouncer/pgbouncer/issues/976) for details). Use an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string) instead.

- The `pg-import` utility uses `pg_dump` and `pg_restore`. A generated dump file containing any of the following statements will produce a warning or error when data is restored to Neon:

  - `ALTER OWNER` statements
  - `CREATE EVENT TRIGGER` statements
  - Any statement requiring the PostgreSQL superuser privilege or a privilege not held by the role running the migration.

  `ALTER OWNER` warnings can be ignored (see [Database object ownership considerations](/docs/import/import-from-postgres#database-object-ownership-considerations)). `CREATE EVENT TRIGGER` or other statements requiring a privilege not held by the role performing the restore operation may require that you exclude those statements from the dump file.

## Export data with @neondatabase/pg-import

Export your data from the source database with `@neondatabase/pg-import`:

```bash shouldWrap
npx @neondatabase/pg-import --source <source_database_connection_string> --backup-file-path <dump_file_name>
```

The `@neondatabase/pg-import` command above includes these arguments:

- `--source`: Specifies the source database name or [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
- `--backup-file-path`: The dump file name. It can be any name you choose (`./mydumpfile.bak`, for example).

For more command options, see [all @neondatabase/pg-import options](https://github.com/neondatabase/pg-import?tab=readme-ov-file#flags-and-options).

## Restore data to Neon with @neondatabase/pg-import

Restore your data to the target database in Neon with `@neondatabase/pg-import`.

```bash shouldWrap
npx @neondatabase/pg-import --destination <neon_database_connection_string> --backup-file-path <dump_file_name>
```

The `@neondatabase/pg-import` command above includes these arguments:

- `--destination`: Specifies the destination database name or [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
- `--backup-file-path`: The dump file name. It can be any name you choose (`./mydumpfile.bak`, for example).

For more command options, see [all @neondatabase/pg-import options](https://github.com/neondatabase/pg-import?tab=readme-ov-file#flags-and-options).

## @neondatabase/pg-import example

The following example shows how data from a `pagila` source database is dumped and restored to a `pagila` database in Neon using the commands described in the previous sections. (A database named `pagila` was created in Neon before running the restore operation.)

```bash shouldWrap
~$ cd mydump
~/mydump$ npx @neondatabase/pg-import --source postgresql://[user]:[password]@[neon_hostname]/pagila --backup-file-path ./mydumpfile.bak

~/mydump$ ls
mydumpfile.bak

~/mydump$ npx @neondatabase/pg-import --destination postgresql://[user]:[password]@[neon_hostname]/pagila --backup-file-path ./mydumpfile.bak
```

## Piped import with @neondatabase/pg-import

For small databases, the standard output of `pg_dump` can be piped directly into a `pg_restore` command to minimize migration downtime. `@neondatabase/pg-import` makes it easier for you with a single command.

For example:

```bash shouldWrap
npx @neondatabase/pg-import --source <source_database_connection_string> --destination <neon-database-connection-string>
```

This method is not recommended for large databases, as it is susceptible to failures during lengthy migration operations.

## Post-migration steps

After migrating your data, update your applications to connect to your new database in Neon. You will need the Neon database connection string that you used in the restore operation. If you run into any problems, see [Connect from any application](/docs/connect/connect-from-any-app). After connecting your applications, test them thoroughly to ensure they function correctly with your new database.

## References

- [@neondatabase/pg-import](https://github.com/neondatabase/pg-import)

<NeedHelp/>
