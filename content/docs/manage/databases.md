---
title: Databases
enableTableOfContents: true
isDraft: false
---

In the Neon object hierarchy, a database exists within a branch of a Neon project. The is no limit on the number of databases you can create.

A Neon project's root branch is created with a default database called `main`. You can create your own databases in a project's root branch or in a child branch.

As with any standalone PostgreSQL instance, database objects such as schemas and tables are created in a database. All databases in Neon are created with a `public` schema. Tables and other database objects are created in the `public` schema by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

## Create a database

To create a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select **Settings** > **Databases**.
3. Click **New Database**.
4. Select the branch where you want to create the database, enter a database name, and select a database owner.
5. Click **Create**.

## View databases

To view databases:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select **Settings** > **Databases**
3. Select a branch to view the databases in the branch.

## Delete a database

Deleting a database is a permanent action. All database objects belonging to the database such as schemas, tables, and roles are also deleted.

To delete a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select **Settings** > **Databases**.
3. Select a branch to view the databases in the branch.
4. For the database you want to delete, click the delete icon.
5. In the **Do you want to delete this database** dialog, click **Delete**.
