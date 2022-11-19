---
title: Databases
enableTableOfContents: true
isDraft: false
---

This topic describes how to create, view, and delete databases in your Neon project.

In the Neon object hierarchy, a database exists within a branch of a Neon project. A Neon project's root branch and all child branches are created with a default database called `main`. You can use this database or create your own. You can create a database in your project's root branch or in a child branch. As with standalone PostgreSQL, SQL objects (“database objects”) such as schemas and tables are created in a database.  

All databases in Neon are created with a `public` schema. Tables and other database objects are created in the `public` schema by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

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
3. Select a branch to view databases in that branch.

_**Note:**_ When you create a branch, a database that was present in the parent branch is cloned to the child branch, assuming the data that was branched includes the database unless the branch includes only data up to a past point in time, after which the database was created.

## Delete a database

Deleting a database is a permanent action. All database objects belonging to the database such as schemas, tables, and roles are also deleted.

To delete a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select **Settings** > **Databases**.
3. Select a branch to view databases in that branch.
4. For the database you want to delete, click the delete icon.
5. In the **Do you want to delete this database?** dialog, click **Delete**.
