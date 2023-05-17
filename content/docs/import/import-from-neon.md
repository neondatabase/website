---
title: Import data from another Neon project
enableTableOfContents: true
---

This section describes how to import a database from another Neon project. You can use these instructions to:

- Import a database from a Neon project created in one region to a project in created in another region.
- Import a database from a Neon project created with PostgreSQL 14 to a Neon project created with PostgreSQL 15.

<Admonition type="note">
The Neon Free Tier has a limit of one project per user. If you need to move your data to a new Neon project, dump your database first, delete your Neon project, create a new Neon project with the desired region or PostgreSQL version, and import your data into the new project. For the dump and restore procedure, refer to [Use pg_dump with pg_restore](#use-pg_dump-with-pg_restore).
</Admonition>

1. Create a new project with desired region or PostgreSQL version. See [Create a project](../manage/projects#create-a-project) for instructions.

2. Create a database with the desired name in your new Neon project. See [Create a database](../manage/databases#create-a-database).

3. Retrieve the connection strings for the new and existing Neon databases.

  You can obtain the connection strings from the Neon **Dashboard**, under **Connection Details**. Your connection strings will look something like this:

  ```bash
  postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/<dbname>
  ```

4. Prepare your dump and import command. It will look something like this:

```bash
pg_dump postgres://myneonrole:a1B2c3D4e5F6@ep-dawn-union-749234.us-east-2.aws.neon.tech:5432/<dbname> | psql postgres://myneonrole:a1B2c3D4e5F6@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/<dbname>
```

5. Run the dump and import command from your terminal or command window.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).