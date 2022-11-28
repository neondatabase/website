---
title: Projects
enableTableOfContents: true
isDraft: false
---

A project is the top-level object in the Neon object hierarchy. Tier limits define how many projects you can create. Neon's free tier permits one project per Neon account.

A Neon project is created with the following resources by default:

- A root branch called `main`. You can create child branches from the root branch or from a previously created branch. For more information, see [Branches](../branches).
- A single read-write endpoint. An endpoint is the compute instance associated with a branch. For more information, see [Endpoints](../branches).
- A default database, called `main`, which resides in the project's root branch.
- Two PostgreSQL users:
  - A user that takes its name from your Neon account (the Google, GitHub, or partner account that you registered with).
  - A `web_access` user, which is used for passwordless authentication and by the Neon SQL Editor. The `web_access` user cannot be modified or deleted.

## Create a project

To create a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. If you are creating your very first project, click **Create the first project**. Otherwise, click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

Upon creating a project, you are presented with a dialog that provides your password for the project, which is required to connect to databases in the project from a client or application. Store your password in a safe location. Your password is also temporarily available in the **Connection Details** widget on the **Neon Dashboard**. 

<Admonition type="important">
After closing the password dialog, navigating away from the Neon Console, or refreshing the browser page, your password is no longer accessible. If you forget or misplace your password, your only option is to reset it. For password reset instructions, see [Users](../users).
</Admonition>

## Delete a project

Deleting a project is a permanent action. Deleting a project deletes any endpoints, branches, databases, and users that belong to the project.

To delete a project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to delete.
3. Select **Settings** > **General**.
4. Click **Delete project.**
5. On the confirmation dialog, click **Delete**.

## Check the data size

Neon stores data in its own internal format. Tier limits define the amount of data you can store in a project. 

The logical size is the sum of all database sizes in the project. To check the logical size of the databases in your Neon project, run the following query:

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
```
