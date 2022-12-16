---
title: Manage databases
enableTableOfContents: true
isDraft: false
---

A database is a container for SQL objects such as schemas, tables, views, functions, and indexes. In the Neon object hierarchy, a database exists within a branch of a project. There is no limit on the number of databases you can create.

A Neon project's root branch is created with a default database called `neondb`, which is owned by your project's default user (see [Users](../users) for more information). You can create your own databases in a project's root branch or in a child branch.

All databases in Neon are created with a `public` schema. SQL objects are created in the `public` schema by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

Databases belong to branch. If you create a child branch, databases from the parent branch are duplicated in the child branch. For example, if database `mydb` exists in the parent branch, database `mydb` will be copied to the child branch. The only time that this does not occur is when you create a branch that only includes data up to a particular point in time. If a database was created in the parent branch after this point in time, that database is not duplicated the child branch.

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
5. In the confirmation dialog, click **Delete**.
