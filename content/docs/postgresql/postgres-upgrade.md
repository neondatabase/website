---
title: Upgrading your Postgres version
subtitle: Learn how upgrade to a new major Postgres version in Neon
enableTableOfContents: true
updatedOn: '2024-10-07T18:18:31.791Z'
---

This topic describes how to upgrade your Neon project from one **major** Postgres version to a newer one.

Postgres version numbers consist of a **major** and a **minor** version number. For example, in the version number 16.1, 16 is the major version number and the 1 is the minor version number.

Neon manages **minor** Postgres version upgrades for you, as per the [Neon Postgres Version Support Policy](/docs/postgresql/postgres-version-policy). Typically, no user action is required for **minor** version upgrades. Neon deploys minor versions soon after they become available. However, upgrading to a new major Postgres version is a manual task that must be performed by you.

Each Neon project is tied to a specific Postgres major version, which you selected when creating your Neon project.

You can check your Neon project's Postgres version in the **Project settings** widget on **Project Dashboard** or by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client connection to your database:

```sql
SELECT version();
```

## Before you begin

- Review the [PostgreSQL Release Notes](https://www.postgresql.org/docs/current/release.html) for the new Postgres version. Major Postgres versions often introduce user-visible incompatibilities, so review the release notes for these changes. While you can upgrade directly to a new major Postgres version without going through each intermediate version, make sure you review the release notes for any skipped versions, as they may contain changes relevant to your upgrade.
- Optionally, you may want to run some performance tests of your current database to set a benchmark for post-upgrade comparison.

## Performing the upgrade

### 1. Create a Neon project with the new Postgres version

Start by creating a new Neon project with the desired Postgres version. For instructions, see [creating a new Neon project](/docs/manage/projects#create-a-project).

At this time, you may also also want to apply any specific configurations to your new Neon project that exist in your current Neon project. For example, you may have configured settings for the following Neon features that you want to implement in your new Neon project:

- [Compute size](/docs/manage/endpoints#edit-a-compute)
- [Autoscaling](/docs/guides/autoscaling-guide)
- [Autosuspend](/docs/guides/auto-suspend-guide)
- [Protected branches](/docs/guides/protected-branches)
- [IP Allow](/docs/introduction/ip-allow)

Alternatively, you can apply these configurations after migrating your data.

### 2. Migrate your data using one of the following methods

**Dump and Restore**

Neon supports the following dump and restore options:

- [Migrate data with pg_dump and pg_restore](/docs/import/migrate-from-postgres)

  This method requires dumping data from your current Neon project with `pg_dump` and loading the data into the new Neon project using `pg_restore`. Some downtime will be required between the dump and restore operations.

- [Migrate data from one Neon project to another by piping data from pg_dump to pg_restore](/docs/import/migrate-from-neon)

  If your database is small, you can use this method to pipe `pg_dump` output directly to `pg_restore` to save time. While this method is a bit simpler, we recommend it only for small databases, as it is susceptible to failures during lengthy data migrations.

**Logical Replication**

The logical replication method can be used to achieve a near-zero downtime migration. Once the data in the new Neon project is synced with the data in the Neon project running the older version of Postgres, you can quickly switch your applications to the database. This method is recommended for active databases that cannot afford much downtime. For instructions, see [Logical Replication](/docs/guides/logical-replication-neon-to-neon).

<Admonition type="note" title="Notes">
- Neon does not support the `pg_dumpall` utility. If upgrading via dump and restore, dumps must be performed one database at a time using `pg_dump`.
- Neon does not yet support upgrading using `pg_upgrade`. Support for this utility is being considered for a future release.
- If you choose a dump and restore method, it is recommended that you use `pg_dump` and `pg_store` programs from the newer version of Postgres, to take advantage of any enhancements introduced in the newer version. Current releases of the these programs can read data from all previous Postgres versions supported by Neon.
</Admonition>

### 3. Switch over your applications

After the migration is complete and you have verified that your new database is working as expected, you can switch your application over to the database in your new Neon project by swapping out your current database connection details for your new database connection details.

You can find the connection details for your new Neon database on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).

<NeedHelp/>
