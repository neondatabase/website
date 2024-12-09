---
title: Neon Postgres Version Support Policy
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.075Z'
---

This topic outlines [Neon's Postgres Version Support Policy](#neon-version-support-policy).

## The official Postgres versioning policy

To better understand [Neon's Postgres Version Support Policy](#neon-version-support-policy), it’s helpful to first familiarize yourself with the official Postgres versioning policy and numbering system. You can refer to the official [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/) documentation for details, but here’s a condensed summary:

### Major versions

- The PostgreSQL Global Development Group releases a new major version approximately once per year.
- Each major version is supported for five years from its initial release.
- After five years, a final minor version is released, and the major version reaches end-of-life (EOL) and is no longer supported.

### Minor releases

- Minor releases include only bug fixes and security patches, and are issued _at least_ once every three months. Minor releases do not introduce new features.
- The minor release schedule is available in the [official PostgreSQL roadmap](https://www.postgresql.org/developer/roadmap/).
- Critical bugs or security issues may result in an unscheduled release outside the regular minor release roadmap if the issue is deemed too urgent to delay.
- A minor release is issued for all supported major versions simultaneously.
- Occasionally, manual actions are necessary after a minor version upgrade. The PostgreSQL Global Development Group strives to minimize these situations, but they do occur. Any exceptions, required manual steps, or incompatibilities introduced in minor releases are detailed in the [PostgreSQL release notes](https://www.postgresql.org/docs/release/).

### Postgres version numbering

- The major version is indicated by the first part of the version number, such as the "16" in "16.1".
- The minor release is indicated by the second part of the version number, such as the "1" in "16.1".

## Neon Version Support Policy

Neon is committed to providing stability and hassle-free maintenance. You select the major version of Postgres when [creating a Neon project](/docs/manage/projects#create-a-project), and Neon automatically updates your chosen Postgres version to the latest minor release soon after it becomes available. Typically, no user action is required for minor release updates.

Minor release updates are announced in the [Neon Changelog](/docs/changelog).

To check your current Postgres major and minor version, you can run the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client connection to your database:

```sql
SELECT version();
```

Your Postgres major version is also displayed in the **Project settings** widget on your Neon **Project Dashboard**.

### Minor releases

In Neon, an instance of Postgres runs on each compute in your Neon project. When the PostgreSQL Global Development Group releases a new minor version, Neon automatically updates your computes to the new minor version. Typically, no user action is required for minor version updates. While we aim to make the new minor version available at the same time as the official Postgres release, these updates may occur a few days later than the official release date.

Once a new minor version is available on Neon, it is applied the next time your compute restarts (for any reason). For example, if your compute suspends due to inactivity, the compute will be updated to the new minor version the next time it restarts due to a user-initiated or control-plane initiated action that wakes the compute. If your compute is always active (i.e., it never stops due to regular database activity or because you disabled [autosuspend](/docs/introduction/auto-suspend)), and you want to force a restart to pick up the latest update, see [Restart a compute](/docs/manage/endpoints#restart-a-compute).

Neon only supports the latest minor release for each major Postgres version. For example, when 16.4 is the latest minor release of Postgres version 16, it is no longer possible run a Neon compute with version 16.3.

Neon does not support skipping minor releases or downgrading to a previous minor release.

#### Manual actions after minor release upgrades

As a managed service, Neon strives to manage all minor version updates automatically, minimizing the need for user intervention. However, certain updates, such as security fixes, may require decisions that depend on your application and cannot be fully automated.

In such cases, your action may occasionally be required. When this occurs &#8212; which is infrequently &#8212; we will notify you through appropriate communication channels to ensure you are aware of any necessary steps.

### Major versions

Neon currently supports Postgres 14, 15, 16, and 17. In the future, Neon intends to **support the five latest major Postgres versions, in alignment with the official Postgres version support policy.**

### Major version upgrades

Each Neon project is created with a specific Postgres major version. Upgrading to a newer major version requires [creating a new Neon project](/docs/manage/projects#create-a-project) with the desired Postgres version and migrating your data to the new Neon project. For more information, see [Upgrading your Postgres version](/docs/postgresql/postgres-upgrade).

<NeedHelp/>
