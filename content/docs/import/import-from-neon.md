---
title: Import data from another Neon project
enableTableOfContents: true
---

This section describes how to import a database from another Neon project using `pg_dump` and `psql`. Use these instructions to:

- Import a database from a Neon project created in one region to a project created in another region.
- Import a database from a Neon project created with PostgreSQL 14 to a Neon project created with PostgreSQL 15.

<Admonition type="note">
The Neon Free Tier has a limit of one project per user, which means a Free Tier user cannot have two projects simultaneously. To move you data to new Neon project while on the Free Tier, dump your database first, delete your existing Neon project, create a new Neon project with the desired region or PostgreSQL version, and import your data into the new project. For the dump and restore procedure, refer to [pg_dump with pg_restore](../import/import-from-postgres#pg_dump-with-pg_restore).
</Admonition>

To import your data from another Neon project:

1. Create a new project in the desired region or PostgreSQL version. See [Create a project](../manage/projects#create-a-project) for instructions.

2. Create a database with the desired name in your new Neon project. See [Create a database](../manage/databases#create-a-database) for instructions.

3. Retrieve the connection strings for the new and existing Neon databases.

   You can obtain the connection strings from the Neon **Dashboard**, under **Connection Details**. Your connection strings will look something like this:

   <CodeBlock shouldWrap>

   ```bash
   postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
   ```

   </CodeBlock>

4. Prepare your import command. It will look similar to this one:

   <CodeBlock shouldWrap>

   ```bash
   pg_dump postgres://<user>:<password>@ep-dawn-union-749234.us-east-2.aws.neon.tech/<dbname> | psql postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
   ```

   </CodeBlock>

5. Run the import command from your terminal or command window.
6. If you no longer require the old project, you can remove it. See [Delete a project](../manage/projects#delete-a-project) for instructions.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
