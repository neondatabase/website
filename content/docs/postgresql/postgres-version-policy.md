---
title: Neon Postgres Version Support Policy
enableTableOfContents: true
updatedOn: '2024-08-15T12:36:39.367Z'
---

This topic outlines [Neon's Postgres Version Support Policy](#neon-version-support-policy).

## The official PostgreSQL versioning policy

To better understand [Neon's Postgres Version Support Policy](#neon-version-support-policy), it's useful to first grasp the official PostgreSQL versioning policy and numbering system. You can refer to the official [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/) documentation for details, but here’s a condensed summary:

### Major versions

- The PostgreSQL Global Development Group releases a new major version approximately once per year.
- Each major version is supported for five years from its initial release.
- After five years, a final minor version is released, and the major version reaches end-of-life (EOL) and is no longer supported.

### Minor releases

- Minor releases include only bug fixes and security patches, and are issued _at least_ once every three months. They do not introduce new features.
- The minor release schedule is available in the [official PostgreSQL roadmap](https://www.postgresql.org/developer/roadmap/).
- Critical bugs or security issues may result in an unscheduled release outside the regular minor release roadmap if the issue is deemed too urgent to delay.
- A minor release is issued for all supported major versions simultaneously.
- Occasionally, manual actions are necessary after a minor version upgrade. The PostgreSQL Global Development Group strives to minimize these situations, but they do occur. Any exceptions, required manual steps, or incompatibilities introduced in minor releases are detailed in the [PostgreSQL release notes](https://www.postgresql.org/docs/release/).

### PostgreSQL version numbering

- The major version is indicated by the first part of the version number, such as the "16" in "16.1".
- The minor release is indicated by the second part of the version number, such as the "1" in "16.1".

## Neon Version Support Policy

Neon is committed to providing stability and hassle-free maintenance. You select the major version of Postgres when [creating a Neon project](/docs/manage/projects#create-a-project), and Neon automatically updates your chosen PostgreSQL version to the latest minor release soon after it becomes available. Typically, no user action is required for minor release updates, which are announced in the [Neon Changelog](https://neon.tech/docs/changelog).

You can view your Postgres major version in the **Project Settings** widget on the Neon Project Dashboard.

![Postgres major version](/docs/postgres/postgres_major_version.png 'no-border')

To check the your PostgreSQL minor version, you can run the following query from the Neon SQL Editor or any SQL client connection to your database:

```sql
neondb=> SELECT version();
                                              version
------------------------------------------------------------------------------------------
 PostgreSQL 16.4 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110
```

### Minor releases

In Neon, an instance of PostgreSQL runs on each compute. You may have multiple computes in your Neon project. When the PostgreSQL Global Development Group releases a new minor version, Neon automatically updates your computes to the new minor version. Typically, no user action is required for minor version updates. While we aim to make the new minor version available at the same time as the PostgreSQL release, these updates may occur a few days later than the official release date.

Once a new minor version is available on Neon, it is applied the next time a compute restarts for any reason.

Neon only supports the latest minor release for each major PostgreSQL version. For example, when 16.4 is the latest minor release of PostgreSQL version 16, it is no longer possible run a Neon compute with version 16.3.

Skipping minor releases or downgrading to a previous minor release is not supported in Neon.

#### Manual actions after minor release upgrades

As a managed service, Neon strives to manage all minor version updates automatically, minimizing the need for user intervention. However, certain updates, such as security fixes, may require decisions that depend on your application and cannot be fully automated.

In such cases, your action may occasionally be required. When this occurs &#8212; which is infrequent &#8212; we will notify you through appropriate communication channels to ensure you are aware of any necessary steps.

### Major versions

Neon currently supports PostgreSQL 14, 15, and 16, and we plan to support PostgreSQL 17 as soon as it is released. In the future, Neon intends to **support the five latest major PostgreSQL versions, in alignment with the official PostgreSQL version support policy.**

### Major version upgrades

Each Neon project is tied to a specific PostgreSQL major version. Upgrading to a newer major version requires [creating a new Neon project](/docs/manage/projects#create-a-project) with the desired PostgreSQL version and migrating your data using one of the methods listed below.

- **Large databases**

  For large databases, we recommend using `pg_dump` and `pg_restore` or Logical Replication.

  - [Logical Replication](https://neon.tech/docs/guides/logical-replication-neon-to-neon)
  - [Migrate data with pg_dump and pg_restore](https://neon.tech/docs/import/migrate-from-postgres)

- **Small databases**

  For smaller databases, you can pipe data from one Neon project to another for a simpler migration process. These methods involve fewer steps but are recommended only for smaller databases, as any failure during the data copy will require restarting the operation from the beginning. In such cases, dump and restore operations are often more efficient.

  - [Migrate data with the @neondatabase/pg-import CLI](https://neon.tech/docs/import/migrate-from-postgres-pg-import)
  - [Migrate data from another Neon project](https://neon.tech/docs/import/migrate-from-postgres-pg-import)

<Admonition type="note">
Neon plans to provide advanced support for major version upgrades in the future.
</Admonition>

### Major version upgrades as a Free Plan user

Free Plan users can only create a single Neon project. Due to this limitation, migrating to a Neon project with a new PostgreSQL major version requires dumping your data using `pg_dump`, deleting your current Neon project, creating a new project with the desired PostgreSQL version, and restoring your data using `pg_restore`. For detailed instructions, please refer to the procedure described here: [Migrate data with pg_dump and pg_restore](https://neon.tech/docs/import/migrate-from-postgres).
