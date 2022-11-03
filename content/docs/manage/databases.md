---
title: Databases
enableTableOfContents: true
isDraft: true
---

A project's root branch is created with a default database called `main`. This database and all databases created in Neon contain a `public` schema. Tables and other objects are created in the `public` schema by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

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

_**Note:**_ When you create a branch, a database that was present in the parent branch is also be present in the child branch, assuming the data that was branched includes the database. For example, if you branched from Head, any database that existed in the parent branch will also be present in the child branch. If you branched data up to a past point in time, database created before that point in time are included in the child branch.

## Delete a database

Deleting a database is a permanent action.

To delete a database:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select **Settings** > **Databases**.
3. Select a branch to view databases in that branch.
4. For the database you want to delete, click the delete icon.
5. In the **Do you want to delete this database?** dialog, click **Delete**.
