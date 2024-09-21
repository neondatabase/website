---
title: Neon Postgres Version Support Policy
enableTableOfContents: true
updatedOn: '2024-08-15T12:36:39.367Z'
---

This topic outlines [Neon's Postgres Version Support Policy](#neon-version-support-policy).

## The official PostgreSQL versioning policy

To understand [Neon's Postgres Version Support Policy](#neon-version-support-policy), it helps to have a basic understanding the official PostgreSQL versioning policy and numbering system. You can find that information in the official [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/) documentation, but here's a condensed version:

### Major versions

- The PostgreSQL Global Development Group releases a new major version approximately once a year.
- Each major version is supported for 5 years from its initial release.
- After 5 years, a final minor version is released and the major version becomes unsupported (end-of-life).
- Major version upgrades require data migration

### Minor releases

- Minor releases contain bug fixes and security patches only, and are issued _at least_ once every three months. They do not contain new features.
- The minor release schedule can be viewed in the [official PostgreSQL roadmap](https://www.postgresql.org/developer/roadmap/).
- Critical bugs or security issues may lead to an unscheduled release outside of the regular minor release roadmap if the issue is deemed too important to wait.
- A minor release is provided for all supported major versions at the same time.
- Upgrading to a new minor release involves replacing the binary and restarting PostgreSQL. Data migration is not required.
- Manual actions are sometimes required after an upgrade. The PostgreSQL Global Development Group tries to avoid these situations, but they happen occasionally. Any exceptions, required manual steps, or incompatibilities that occur in minor releases are listed in the [PostgreSQL release notes](https://www.postgresql.org/docs/release/).

### PostgreSQL version numbering

- A major version is indicated by the first part of the version, e.g. the "16" in "16.1".
- A minor release is indicated by the last part of the version number, e.g. the "1" in "16.1".

## Neon Version Support Policy

Neon aims to provide stability and hassle-free maintenance. You select the major version of Postgres when [creating a Neon project](/docs/manage/projects#create-a-project), and Neon takes care of upgrading your project to the latest PostgreSQL minor release soon after it becomes available. Typically, no user action is required for minor version upgrades, which we announce in the [Neon Changelog](https://neon.tech/docs/changelog). You can check your Postgres major version in the **Project Settings** widget on the Neon Project Dashboard.

![Postgres major version](/docs/postgres/postgres_major_version.png 'no-border')

To check the minor PostgreSQL version, you can issue the following query:

```sql
neondb=> SELECT version();
                                              version
------------------------------------------------------------------------------------------
 PostgreSQL 16.4 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110
```

### Minor releases

When the PostgreSQL Global Development Group releases a new minor version, Neon automatically updates your compute image to include it. We strive to make the new image available at the same time as the PostgreSQL release, but these minor version updates often occur a few days later than the official PostgreSQL release date. Neon's rollout of new minor versions is staged, one region at a time, like any new Neon compute release.

Once the image has been made available in a region, all new computes will use the new version. Neon only supports the latest minor release of each major version. For example, when 16.4 is the latest minor release of of PostgreSQL version 16, it is no longer possible to start a compute with version 16.3. However, you will continue to use the old version until your compute is restarted (for any reason).

Neon automatically restarts computes that have not been restarted for other reasons after about a month.

Skipping minor releases or downgrade to a previous minor release is not supported in Neon. As a managed Postgres service, Neon takes care of minor release upgrades for you automatically.

#### Manual actions after minor release upgrades

If there are extra manual steps that need to be taken after a minor release upgrade, how does Neon handle them?

As a managed service, Neon makes every effort to manage changes like this automatically and not burden users with maintenance tasks. However, some security fixes, for example, might require decisions that depend on the application or cannot be fully automated.

As a result, your action may be required from time to time. In this occurs, which is not too often, we'll let you know via appropriate communication channels to ensure that you are aware of any required actions.

### Major versions

Neon currently supports PostgreSQL 14, 15, and 16, and we'll soon add support for PostgreSQL 17. In the future, Neon intends to **support the five latest major PostgreSQL versions, the same as the PostgreSQL community.**

### Major version upgrades

Each Neon project is bound to a particular PostgreSQL major version. Upgrading to a newer major version requires creating a new Neon project with the desired PostgreSQL version and migrating your data to the new project using one of the methods listed below.

- **Large databases**

  For large databases, we recommend using `pg_dump` and `pg_restore` or Logical Replication.

  - [Logical Replication](https://neon.tech/docs/guides/logical-replication-neon-to-neon)
  - [Migrate data with pg_dump and pg_restore](https://neon.tech/docs/import/migrate-from-postgres)

- **Small databases**

  For smaller databases, you can try piping data from one Neon project to another for a simpler migration process. These methods require fewer steps but we recommend them only for smaller databases, as any failure during the data copy operation will require restarting the operation from scratch, in which case it's often more efficient to perform dump and restore operations separately.

  - [Migrate data with the @neondatabase/pg-import CLI](https://neon.tech/docs/import/migrate-from-postgres-pg-import)
  - [Migrate data from another Neon project](https://neon.tech/docs/import/migrate-from-postgres-pg-import)

<Admonition type="note">
Neon intends to provide more advanced support for major version upgrades in the future.
</Admonition>

### Major version upgrades as a Free Plan user

Free Plan users can only create a single Neon project. Due to this limitation, migrating to a Neon project with a new Postgres major version requires dumping your data using `pg_dump`, deleting your current Neon project, creating a new Neon project with the desired Postgres version, and restoring your data to the new Neon project using `pg_restore`. Please refer to the procedure described here: [Migrate data with pg_dump and pg_restore](https://neon.tech/docs/import/migrate-from-postgres) for `pg_dump` and `pg_restore` instructions.
