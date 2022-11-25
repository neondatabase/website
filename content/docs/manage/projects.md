---
title: Projects
enableTableOfContents: true
isDraft: false
---

A project is the top-level object in the Neon object hierarchy. Neon's free tier permits one project per account.

A Neon project is created with the following resources by default:

- A root branch called `main`. You can create additional child branches from the root branch or from a previously created branch. For more information, see [Branches](../branches).
- A single read-write endpoint, which is the Neon compute instance associated with the project's root branch. For more information, see [Endpoints](../branches).
- A default database, called `main`, which resides in the project's root branch.
- Two PostgreSQL database users:
  - A user that takes its name from your Neon account (the Google, GitHub, or partner account that you signed up with).
  - A `web_access` user, which is used for passwordless authentication and by the Neon SQL Editor. The `web_access` user cannot be modified or deleted.

## Create a project

To create a Neon project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. If you are creating your very first project, click **Create the first project**. Otherwise, click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

Upon creating a project, you are presented with a dialog that provides your password for the project, which is required to connect to databases in the Neon project from a client or application. Store your password in a safe location.

<Admonition type="important">
After navigating away from the Neon Console or refreshing the browser page, the password is no longer accessible. If you forget or misplace your password, your only option is to reset it. For password reset instructions, see [Users](../users).
</Admonition>

## Delete a project

Deleting a project is a permanent action. Deleting a project deletes any branches, databases, and users that belong to the project.

To delete a project:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select the project that you want to delete.
3. Select **Settings** > **General**.
4. Click **Delete project.**
5. On the **Do you want to delete this project?** dialog, click **Delete**.

## Check the project data size

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
