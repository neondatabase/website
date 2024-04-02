---
title: Postgres compatibility
subtitle: Learn about Neon as a managed Postgres service
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compatibility
updatedOn: '2024-02-16T12:00:44.905Z'
---

**Neon is Postgres**. However, as a managed Postgres service, there are some differences you should be aware of.

## Postgres versions

Neon supports Postgres 14, 15, and 16. You can select the Postgres version you want to use when creating a Neon project. Postgres 16 is selected by default. For information about creating a Neon project, See [Manage projects](/docs/manage/projects). Minor Postgres point releases are rolled out by Neon after extensive validation as part of regular platform maintenance.  

## Postgres extensions

Neon supports numerous Postgres extensions, and we regularly add support for more. For the extensions that Neon supports, see [Postgres Extensions](/docs/extensions/pg-extensions). To request support for additional extensions, please reach out to us on our [Discord Server](https://discord.gg/92vNTzKDGp). Please keep in mind that privilege requirements, local file system access, and functionality that is incompatible with Neon features such as Autoscaling and Autosuspend may prevent Neon from being able to offer support for certain extensions.

## Roles and permissions

Neon is a managed Postgres service, so you cannot access the host operating system, and you can't connect using the Postgres `superuser` account. In place of the Postgres superuser role, Neon provides a `neon_superuser` role.

Roles created in the Neon Console, CLI, or API, including the default role created with a Neon project, are granted membership in the `neon_superuser` role. For information about the privileges associated with this role, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

Roles created in Neon with SQL syntax, from a command-line tool like `psql` or the [Neon SQL Editor](/docs/connect/query-with-psql-editor), have the same privileges as newly created roles in a standalone Postgres installation. These roles are not granted membership in the `neon_superuser` role. You must grant these roles the privileges you want them to have. For more information, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

Neon roles cannot install Postgres extensions other than those supported by Neon.

<a id="default-parameters/"></a>

## Neon Postgres parameter settings

The following table lists Neon Postgres parameter settings that may differ from the expected default.

| Parameter       | Value   | Note                                                                              |
| --------------- | ------- | --------------------------------------------------------------------------------- |
| fsync           | off     | Neon syncs data to the Neon Storage Engine to store your data safely and reliably |
| max_connections |         | The value depends on compute size.          |
| shared_buffers  |         | The value depends on compute size                                                 |

<Admonition type="note">
You can use connection pooling in Neon to increase the number of supported connections. For more information, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Postgres server logs

Currently, Postgres server logs can only be accessed Neon Support team. Should you require information from the Postgres server logs for troubleshooting purposes, please contact [Neon Support](/docs/introduction/support).

## Unlogged tables

Unlogged tables are maintained on Neon compute local storage. These tables do not survive compute restarts (including when a Neon compute instance is placed into an `Idle` state after a period of inactivity). This is unlike a standalone Postgres installation, where unlogged tables are only truncated in the event of abnormal process termination. Additionally, unlogged tables are limited by compute local storage size.

## Memory

SQL queries and index builds can generate large volumes of data that may not fit in memory. In Neon, the size of your compute determines the amount of memory that is available. For information about compute size and available memory, see [How to size your compute](https://neon.tech/docs/manage/endpoints#how-to-size-your-compute).

## Temporary tables

Temporary tables, which are stored in compute local storage, are limited by compute local storage size.

## Session context

The Neon cloud service automatically closes idle connections after a period of inactivity, as described in [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). When connections are closed, anything that exists within a session context is forgotten and must be recreated before being used again. For example, in-memory statistics, temporary tables, prepared statements, advisory locks, and notifications and listeners defined using [NOTIFY](https://www.postgresql.org/docs/14/sql-notify.html)/[LISTEN](https://www.postgresql.org/docs/14/sql-listen.html) commands only exist for the duration of the current session and are lost when the session ends.

## Statistics collection

Statistics collected by the Postgres [cumulative statistics system](https://www.postgresql.org/docs/current/monitoring-stats.html) are currently not saved when the Neon compute node is placed into an `Idle` state due to inactivity or restarted. For information about the lifecycle of a Neon compute, see [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/).

## Database encoding

Neon does not currently support changing the database encoding. However, Neon does support [ICU Custom Collations](https://www.postgresql.org/docs/current/collation.html#ICU-CUSTOM-COLLATIONS), which lets you define collation objects using ICU as the collation provider. For example:

```sql
CREATE COLLATION german (provider = icu, locale = 'de');
CREATE TABLE books (id int, title text COLLATE "german");
``` 

or 

```sql
CREATE COLLATION arabic (provider = icu, locale = 'ar');
CREATE TABLE books (id int, title text COLLATE "arabic");
```

## Event triggers

Postgres [event triggers](/docs/current/event-triggers.html), which require Postgres superuser privileges, are currently not supported. Unlike regular triggers, which are attached to a single table and capture only DML events, event triggers are global to a particular database and are capable of capturing DDL events.

Attempting to create an event trigger will produce errors similar to these:

```sql
ERROR: permission denied to create event trigger "your_trigger_name" (SQLSTATE 42501)

ERROR:  permission denied to create event trigger "your_trigger_name"
HINT:  Must be superuser to create an event trigger.
```

## PostgreSQL documentation

Neon provides a mirror of the official PostgreSQL documentation on the [Neon documentation site](https://neon.tech/docs/introduction) for the convenience of our users. As Neon is built on standard PostgreSQL, most information from the official PostgreSQL documentation applies to our platform. However, there are a few key differences to consider when referencing the official PostgreSQL docs:

- As a managed Postgres service, certain aspects of the official PostgreSQL documentation like installation procedures do not apply to Neon.
- Some features detailed in the official PostgreSQL documentation may not be relevant for Neon, such as those mentioned on this Postgres compatibility page.
- Features requiring the PostgreSQL superuser privilege may not be supported. See [Roles and permissions](#roles-and-permissions) above.
- Neon may not support all of the extensions mentioned in the official PostgreSQL documentation. See [Postgres extensions](#postgres-extensions) above.

<NeedHelp/>
