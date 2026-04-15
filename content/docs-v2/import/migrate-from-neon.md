---
title: Migrate data from another Neon project
summary: >-
  Migrate between Neon projects by piping `pg_dump` to `pg_restore`, a compact
  option for smaller databases and CLI workflows. Also covers alternatives
  (Import Data Assistant, separate dump and restore, logical replication).
enableTableOfContents: true
redirectFrom:
  - /docs/import/import-from-neon
updatedOn: '2026-04-01T20:00:00.000Z'
---

This guide describes how to migrate a database from one Neon project to another by **piping** output from **`pg_dump`** straight into **`pg_restore`** (`pg_dump ... | pg_restore ...`). That runs the dump and restore in one step without writing an intermediate dump file on disk.

<Admonition type="important">
Avoid using `pg_dump` over a [pooled connection string](/docs/reference/glossary#pooled-connection-string). Use an [unpooled connection string](/docs/reference/glossary#unpooled-connection-string) instead.
</Admonition>

## Important considerations

- **Upgrading the Postgres version**: When upgrading to a new version of Postgres, always test thoroughly before migrating your production systems or applications.
- **Piping considerations**: Piping simplifies the operation, but for large or complex datasets, we highly recommend a **separate** dump and restore. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres).

## Import data from another project

To import your data from another Neon project:

1. Create a new project with the desired region or Postgres version. See [Create a project](/docs/manage/projects#create-a-project) for instructions.

2. Create a database with the desired name in your new Neon project. See [Create a database](/docs/manage/databases#create-a-database) for instructions.

3. Retrieve the connection strings for the new and existing Neon databases.

   You can find the connection details for your database by clicking the **Connect** button on your **Project Dashboard**. Connection strings have this format:

   ```bash shouldWrap
   postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

4. Prepare your command to pipe data from one Neon project to the other. For the `pg_dump` command, specify connection details for the source database. For the `pg_restore` command, specify connection details for the destination database. The command should have the following format:

   ```bash shouldWrap
   pg_dump -Fc -v -d postgresql://[user]:[password]@[source_neon_hostname]/[dbname] | pg_restore -v -d postgresql://[user]:[password]@[destination_neon_hostname]/[dbname]
   ```

   With actual source and destination connection details, your command will appear similar to this:

   ```bash shouldWrap
   pg_dump -Fc -v -d postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/my_source_db?sslmode=require&channel_binding=require | pg_restore -v -d postgresql://alex:AbC123dEf@square-shadow-654321.us-east-2.aws.neon.tech/my_destination_db?sslmode=require&channel_binding=require
   ```

   <Admonition type="note">
   While your source and destination databases might have the same name, the hostnames will differ, as illustrated in the example above.
   </Admonition>

   The command includes these arguments:
   - `-Fc`: Sends the output to a custom-format archive suitable for input into `pg_restore`.
   - `-v`: Runs commands in verbose mode, allowing you to monitor what happens during the operation.
   - `-d`: Specifies the database name or connection string.

5. Run the command from your terminal or command window.
6. Run some test queries on the target database to ensure everything imported correctly.
7. Switch the connection string in your app to point to your new Neon database.
8. If you no longer need the old Neon project, you can remove it. See [Delete a project](/docs/manage/projects#delete-a-project) for instructions.

<NeedHelp/>
