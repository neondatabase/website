---
title: Projects
enableTableOfContents: true
isDraft: true
---

A Neon account can have multiple projects.

Each Neon project is created with a dedicated Neon compute instance. During the Technical Preview, a Neon compute instance is deployed with PostgreSQL 14.5, 1 vCPU, and 256MB of RAM. If preferred, you can select PostgreSQL 15 during project creation. For more information about limits associated with Neon's Technical Preview, see [Technical Preview Free Tier](/docs/reference/technical-preview-free-tier).

A project is the top-level object in the Neon object hierarchy.

Each Neon project is created with a branch called `main`, which is the project's root branch. A project may contain additional branches created from the root branch or from a previously created branch. For information about Neon's branching feature, see [Branching](../../conceptual-guides/branching).

A project's root branch is created with a default database, also called `main`. This database and all databases created in Neon contain a `public` schema. Tables and other objects are created in the `public` schema by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

A project is created with two database users by default:

- A user that takes its name from your Neon account (the Google, GitHub, or partner account that you signed up with).
- A `web_access` user, which is used for passwordless authentication and by the Neon SQL Editor. The `web_access` user cannot be modified or deleted.

Additional database users can be added to a project's root branch or child branches.

## Create a project

To create a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. If you are creating your very first project, click **Create the first project**. Otherwise, click **New Project**. 
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**. Upon creating a project, you are presented with a dialog that provides your password for the project, which is required to connect to databases in the Neon project from a client or application. Store your password in a safe location.

**_Important_**: After navigating away from the Neon Console or refreshing the browser page, the password is no longer accessible. If you forget or misplace your password, your only option is to reset it. You can reset a password on the **User** page, which is found on the **Settings** tab in the Neon Console.

## Delete a project

Deleting a branch is a permanent action. Deleting a project deletes any branches, databases, and users that belong to the project.

To delete a project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to delete from the project drop-down list.
3. Select **Settings** > **General**.
4. Click **Delete project.**
5. On the **Do you want to delete this project?** dialog, click **Delete**.

## Check the project data size

Neon stores data in its own internal format. During the technical preview, a Neon project has a 10GB data size limit, which applies to the logical size of a Neon project. The logical size is the sum of all database sizes in the project.

To check the logical size of the databases in your Neon project, run the following query:

```sql
SELECT pg_size_pretty(sum(pg_database_size(datname)))
FROM pg_database;
```

{
/* To check the logical size of your Neon project, run the following query:

```sql
SELECT pg_size_pretty(neon.pg_cluster_size());
```

*/
}

When the data size limit is reached, the following PostgreSQL error message is reported:

```text
could not extend file because cluster size limit (10240 MB)
has been exceeded