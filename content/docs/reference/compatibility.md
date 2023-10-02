---
title: Postgres compatibility
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compatibility
updatedOn: '2023-09-13T23:32:46Z'
---

Neon is protocol and application-compatible with Postgres. However, when using the Neon cloud service, there are some limitations that you should be aware of.

## Postgres versions

Neon cloud service is currently compatible with Postgres 14, 15, and 16. You can select the Postgres version you want to use when creating a Neon project. Postgres 15 is selected, by default. For information about creating a Neon project, See [Manage projects](/docs/manage/projects).

## Postgres extensions

Neon supports numerous Postgres extensions, and we regularly add support for more. For a list of supported extensions, see [Postgres Extensions](/docs/extensions/pg-extensions). To request support for additional extensions, please contact us at [support@neon.tech](mailto:support@neon.tech) or post your request to the [Neon community forum](https://community.neon.tech/).

## Roles and permissions

Neon is a managed Postgres service, so you cannot access the host operating system, and you can't connect using the Postgres `superuser` account like you can in a stand-alone Postgres installation.

Roles created in the Neon console, CLI, or API, including the default role created with a Neon project, are granted membership in the `neon_superuser` role. For information about the privileges associated with this role, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

Roles created in Neon with SQL syntax, from a command-line tool like `psql` or the [Neon SQL Editor](/docs/connect/query-with-psql-editor), have the same privileges as newly created roles in a stand-alone Postgres installation. These roles are not granted membership in the `neon_superuser` role. You must grant these roles the privileges you want them to have. For more information, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

Neon roles cannot access replication methods or install Postgres extensions other than those supported by by Neon.

<a id="default-parameters/"></a>

## Neon Postgres parameter settings

The following table lists Neon Postgres parameter settings that may differ from the expected default.

| Parameter       | Value   | Note                                                                              |
| --------------- | ------- | --------------------------------------------------------------------------------- |
| fsync           | off     | Neon syncs data to the Neon Storage Engine to store your data safely and reliably |
| max_connections |         | The value depends on compute size. Set to 100 for Neon.          |
| shared_buffers  |         | The value depends on compute size                                                 |
| wal_level       | replica | Logical replication is currently not supported                                    |

<Admonition type="note">
You can use connection pooling in Neon to increase the number of supported connections. For more information, see [Connection pooling]../connect/connection-pooling).
</Admonition>

## Unlogged tables

Unlogged tables are maintained on Neon compute local storage. These tables do not survive compute restarts (including when a Neon compute instance is placed into an `Idle` state after a period of inactivity). This is unlike a standalone Postgres installation, where unlogged tables are only truncated in the event of abnormal process termination. Additionally, unlogged tables are limited by compute local storage size.

## Spill and index build handling

Certain queries in Postgres can generate large datasets that do not fit in memory. In such cases, storage spills the data. In Neon, the size of compute local storage limits the ability to create large indexes or execute certain queries that generate large datasets.

## Temporary tables

Temporary tables, which are stored in compute local storage, are limited by compute local storage size.

## Session context

The Neon cloud service automatically closes idle connections after a period of inactivity, as described in [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). When connections are closed, anything defined within a session context is forgotten and must be recreated before being used again. For example, temporary tables, prepared statements, advisory locks, and notifications and listeners that were defined using the [NOTIFY](https://www.postgresql.org/docs/14/sql-notify.html)/[LISTEN](https://www.postgresql.org/docs/14/sql-listen.html) commands only exist for the duration of the current session and are lost when the session ends.

## Statistics collection

Statistics collected by the Postgres [cumulative statistics system](https://www.postgresql.org/docs/14/monitoring-stats.html) are currently not saved when the Neon compute node is placed into an `Idle` state due to inactivity or restarted. For information about the lifecycle of a Neon compute, see [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/).

## Database encoding

Neon does not currently support changing the database encoding. This feature will become available when we add support for creating databases using SQL, which is on our roadmap. Currently, creating a database is supported only in the Neon Console. See [Manage databases](/docs/manage/databases).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
