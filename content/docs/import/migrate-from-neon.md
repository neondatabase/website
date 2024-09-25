---
title: Migrate data from another Neon project
enableTableOfContents: true
redirectFrom:
  - /docs/import/import-from-neon
updatedOn: '2024-08-20T23:55:48.551Z'
---

This guide describes how to migrate a database from one Neon project to another by piping data from `pg_dump` to `pg_restore`.

<Admonition type="important">
Avoid using `pg_dump` over a [pooled connection string](/docs/reference/glossary#pooled-connection-string) (see PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) & [976](https://github.com/pgbouncer/pgbouncer/issues/976) for details). Use an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string) instead.
</Admonition>

Use these instructions to:

- Import a database from a Neon project created in one region to a project created in another region.
- Import a database from a Neon project created with one Postgres version to a Neon project created with another Postgres version.

<Admonition type="tip">
You can also use **logical replication** to move your data from one Neon project to another. See [Replicate data from one Neon project to another](/docs/guides/logical-replication-neon-to-neon).
</Admonition>

## Important considerations

- **Upgrading the Postgres version**: When upgrading to a new version of Postgres, always test thoroughly before migrating your production systems or applications. We also recommend familiarizing yourself with the changes in the new version of Postgres, especially those affecting compatibility. For information about those changes, please refer to the official Postgres [Release 15](https://www.postgresql.org/docs/release/15.0/) or [Release 16](https://www.postgresql.org/docs/16/release-16.html) documentation.
- **Piping considerations**: Piping is not recommended for large datasets, as it is susceptible to failures during lengthy migration operations (see [Pipe pg_dump to pg_restore](/docs/import/migrate-from-postgres#pipe-pgdump-to-pgrestore) for more information). If your dataset is large, we recommend performing the dump and restore as separate operations. For instructions, see [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).
- **Neon Free Plan project limit**: The Neon Free Plan has a limit of one project per user, which means a Neon Free Plan user cannot have two projects simultaneously. To move your data from a Neon Free Plan project, dump your database first, delete your Neon project, create a new Neon project with the desired region or Postgres version, and import your data into the new project. For the dump and restore procedure, refer to [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).

## Import data from another project

To import your data from another Neon project:

1. Create a new project with the desired region or Postgres version. See [Create a project](/docs/manage/projects#create-a-project) for instructions.

2. Create a database with the desired name in your new Neon project. See [Create a database](/docs/manage/databases#create-a-database) for instructions.

3. Retrieve the connection strings for the new and existing Neon databases.

   You can obtain the connection strings from the Neon **Dashboard**, under **Connection Details**. Connections strings have this format:

   ```bash shouldWrap
   postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

4. Prepare your command to pipe data from one Neon project to the other. For the `pg_dump` command, specify connection details for the source database. For the `pg_restore` command, specify connection details for the destination database. The command should have the following format:

   ```bash shouldWrap
   pg_dump -Fc -v -d postgresql://[user]:[password]@[source_neon_hostname]/[dbname] | pg_restore -v -d postgresql://[user]:[password]@[destination_neon_hostname]/[dbname]
   ```

   With actual source and destination connection details, your command will appear similar to this:

   ```bash shouldWrap
   pg_dump -Fc -v -d postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/my_source_db | pg_restore -v -d postgresql://alex:AbC123dEf@square-shadow-654321.us-east-2.aws.neon.tech/my_destination_db
   ```

   <Admonition type="note">
   While your source and destination databases might have the same name, the hostnames will differ, as illustrated in the example above.
   </Admonition>

   The command includes these arguments:

   - `-Fc`: Sends the output to a custom-format archive suitable for input into `pg_restore`.
   - `-v`: Runs commands in verbose mode, allowing you to monitor what happens during the operation.
   - `-d`: Specifies the database name or connection string.

5. Run the command from your terminal or command window.
6. If you no longer require the old project, you can remove it. See [Delete a project](/docs/manage/projects#delete-a-project) for instructions.

<NeedHelp/>
