---
title: Import data from another Neon project
enableTableOfContents: true
---

This guide describes how to migrate a database from one Neon project to another by piping data from `pg_dump` to `pg_restore`. Use these instructions to:

- Import a database from a Neon project created in one region to a project created in another region.
- Import a database from a Neon project created with one Postgres version to a Neon project created with another Postgres version.

## Important considerations

- **Upgrading the Postgres version**: When upgrading to a new version of Postgres, always test thoroughly before migrating your production systems or applications. We also recommend familiarizing yourself with the changes in the new version of Postgres, especially those affecting compatibility. For information about those changes, please refer to the official Postgres [Release 15](https://www.postgresql.org/docs/release/15.0/) or [Release 16](https://www.postgresql.org/docs/16/release-16.html) documentation.
- **Piping considerations**: Piping is not recommended for medium (> 1 GB) and large databases (> 5 GB), as it is susceptible to failures during lengthy migration operations (see [Pipe pg_dump to pg_restore](/docs/import/import-from-postgres#pipe-pgdump-to-pgrestore) for more information). If your database is larger than 1 GB, we recommend performing the dump and restore as separate operations. For instructions, see [Import data from Postgres](/docs/import/import-from-postgres).
- **Neon Free Tier project limit**: The Neon Free Tier has a limit of one project per user, which means a Free Tier user cannot have two projects simultaneously. To move your data from a Neon Free Tier project, dump your database first, delete your Neon project, create a new Neon project with the desired region or Postgres version, and import your data into the new project. For the dump and restore procedure, refer to [Import from Postgres](/docs/import/import-from-postgres).

## Import data from another project

To import your data from another Neon project:

1. Create a new project with the desired region or Postgres version. See [Create a project](/docs/manage/projects#create-a-project) for instructions.

2. Create a database with the desired name in your new Neon project. See [Create a database](/docs/manage/databases#create-a-database) for instructions.

3. Retrieve the connection strings for the new and existing Neon databases.

   You can obtain the connection strings from the Neon **Dashboard**, under **Connection Details**. Your connection strings will look something like this:

   <CodeBlock shouldWrap>

   ```bash
   postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
   ```

   </CodeBlock>

4. Prepare your import command to pipe data to from one Neon project to the other. The command will look similar to this one:

   <CodeBlock shouldWrap>

   ```bash
   pg_dump -Fc -v -d postgres://<user>:<password>@ep-dawn-union-749234.us-east-2.aws.neon.tech/<dbname> | pg_restore -v -d postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
   ```

   </CodeBlock>

   The command includes these arguments:

   - `-Fc`: Sends the output to a custom-format archive suitable for input into `pg_restore`.
   - `-v`: Runs commands in verbose mode, allowing you to monitor what happens during the operation.
   - `-d`: Specifies the database name or connection string.

5. Run the command from your terminal or command window.
6. If you no longer require the old project, you can remove it. See [Delete a project](/docs/manage/projects#delete-a-project) for instructions.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
