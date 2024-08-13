---
title: Postgres compatibility
subtitle: Learn about Neon as a managed Postgres service
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compatibility
updatedOn: '2024-08-01T13:14:19.485Z'
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

## Postgres parameter settings

The following table shows parameter settings that are set explicitly for your Neon Postgres instance. These values may differ from standard Postgres defaults, and a few settings differ based on your Neon compute size.

<Admonition type="note">
Because Neon is a managed Postgres service, Postgres parameters are not user-configurable outside of a session context, but if you are a paid plan user and require a different setting, you can contact [Neon Support](/docs/introduction/support) to see if a different setting can be supported.
</Admonition>

| Parameter                             | Value         | Note                                                                                                                                                                          |
| ------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client_connection_check_interval`    | 60000         |                                                                                                                                                                               |
| `dynamic_shared_memory_type`          | mmap          |                                                                                                                                                                               |
| `fsync`                               | off           | Neon syncs data to the Neon Storage Engine to store your data safely and reliably                                                                                             |
| `hot_standby`                         | off           |                                                                                                                                                                               |
| `idle_in_transaction_session_timeout` | 300000        |                                                                                                                                                                               |
| `listen_addresses`                    | '\*'          |                                                                                                                                                                               |
| `log_connections`                     | on            |                                                                                                                                                                               |
| `log_disconnections`                  | on            |                                                                                                                                                                               |
| `log_temp_files`                      | 1048576       |                                                                                                                                                                               |
| `maintenance_work_mem`                | 65536         | The value differs by compute size. See [below](#parameter-settings-that-differ-by-compute-size).                                                                              |
| `max_connections`                     | 112           | The value differs by compute size. See [below](#parameter-settings-that-differ-by-compute-size).                                                                              |
| `max_parallel_workers`                | 8             |                                                                                                                                                                               |
| `max_replication_flush_lag`           | 10240         |                                                                                                                                                                               |
| `max_replication_slots`               | 10            |                                                                                                                                                                               |
| `max_replication_write_lag`           | 500           |                                                                                                                                                                               |
| `max_wal_senders`                     | 10            |                                                                                                                                                                               |
| `max_wal_size`                        | 1024          |                                                                                                                                                                               |
| `max_worker_processes`                | 26            | The value differs by compute size. See [below](#parameter-settings-that-differ-by-compute-size).                                                                              |
| `password_encryption`                 | scram-sha-256 |                                                                                                                                                                               |
| `restart_after_crash`                 | off           |                                                                                                                                                                               |
| `shared_buffers`                      | 128MB         | Neon uses a [Local File Cache (LFC)](/docs/extensions/neon#what-is-the-local-file-cache) in addition to `shared_buffers` to extend cache memory to 80% of your compute's RAM. |
| `superuser_reserved_connections`      | 4             |                                                                                                                                                                               |
| `synchronous_standby_names`           | 'walproposer' |                                                                                                                                                                               |
| `wal_level`                           | replica       | Support for `wal_level=logical` is coming soon. See [logical replication](/docs/introduction/logical-replication).                                                            |
| `wal_log_hints`                       | off           |                                                                                                                                                                               |
| `wal_sender_timeout`                  | 10000         |                                                                                                                                                                               |

### Parameter settings that differ by compute size

Of the parameter settings listed above, the `maintenance_work_mem`, `max_connections`, and `max_worker_processes` differ by compute size, which is defined in [Compute Units (CU)](/docs/reference/glossary#compute-unit-cu). The following table shows values for each compute size.

| Compute Size (CU) | `max_connections` | `maintenance_work_mem` | `max_worker_processes` |
| :---------------- | :---------------- | :--------------------- | :--------------------- |
| 0.25              | 112               | 64 MB                  | 10                     |
| 0.50              | 225               | 64 MB                  | 11                     |
| 1                 | 450               | 67 MB                  | 12                     |
| 2                 | 901               | 134 MB                 | 14                     |
| 3                 | 1351              | 201 MB                 | 16                     |
| 4                 | 1802              | 268 MB                 | 18                     |
| 5                 | 2253              | 335 MB                 | 20                     |
| 6                 | 2703              | 402 MB                 | 22                     |
| 7                 | 3154              | 470 MB                 | 24                     |
| 8                 | 3604              | 537 MB                 | 26                     |
| 9                 | 4000              | 604 MB                 | 28                     |
| 10                | 4000              | 671 MB                 | 30                     |

<Admonition type="note">
You can use connection pooling in Neon to increase the number of supported connections. For more information, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

### Configuring Postgres parameters in a session context

Neon permits configuring parameters that have a `user` context, meaning that the parameter can be set by a connected user within a specific session using a [SET](https://www.postgresql.org/docs/current/sql-set.html) command. These parameters are also referred to as "run-time parameters". You can identify Postgres parameters with a `user` context by running the following command:

```sql
SELECT name
FROM pg_settings
WHERE context = 'user';
```

For example, the `maintenance_work_mem` parameter supports a `user` context, which lets you set it for the current session with a `SET` command:

```sql
SET maintenance_work_mem='1 GB';
```

## Postgres server logs

Currently, Postgres server logs can only be accessed Neon Support team. Should you require information from the Postgres server logs for troubleshooting purposes, please contact [Neon Support](/docs/introduction/support).

## Unlogged tables

Unlogged tables are maintained on Neon compute local storage. These tables do not survive compute restarts (including when a Neon compute is placed into an `Idle` state after a period of inactivity). This is unlike a standalone Postgres installation, where unlogged tables are only truncated in the event of abnormal process termination. Additionally, unlogged tables are limited by compute local storage size.

## Memory

SQL queries and index builds can generate large volumes of data that may not fit in memory. In Neon, the size of your compute determines the amount of memory that is available. For information about compute size and available memory, see [How to size your compute](https://neon.tech/docs/manage/endpoints#how-to-size-your-compute).

## Temporary tables

Temporary tables, which are stored in compute local storage, are limited by compute local storage size.

## Session context

The Neon cloud service automatically closes idle connections after a period of inactivity, as described in [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). When connections are closed, anything that exists within a session context is forgotten and must be recreated before being used again. For example, in-memory statistics, temporary tables, prepared statements, advisory locks, and notifications and listeners defined using [NOTIFY](https://www.postgresql.org/docs/14/sql-notify.html)/[LISTEN](https://www.postgresql.org/docs/14/sql-listen.html) commands only exist for the duration of the current session and are lost when the session ends. To avoid losing session-level contexts in Neon, you can disable Neon's [autosuspend](/docs/guides/auto-suspend-guide) feature, which is possible on any of Neon's paid plans. However, disabling autosuspend also means that your compute will run 24/7. You can't disable autosuspend on Neon's Free plan, where your compute always autosuspends after 5 minutes of inactivity.

## Statistics collection

Statistics collected by the Postgres [cumulative statistics system](https://www.postgresql.org/docs/current/monitoring-stats.html) are not saved when a Neon compute (where Postgres runs) is suspended due to inactivity or restarted. For information about the lifecycle of a Neon compute, see [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). For information about configuring Neon's autosuspend behavior, see [Autosuspend](/docs/introduction/auto-suspend).

## Database encoding

Neon supports UTF8 encoding (Unicode, 8-bit variable-width encoding). This is the most widely used and recommended encoding for Postgres.

## Collation support

A collation is an SQL schema object that maps an SQL name to locales provided by libraries installed in the operating system. A collation has a provider that specifies which library supplies the locale data. A common standard provider, `libc`, uses locales provided by the operating system C library. By default, Neon uses the `C` collation provided by `libc`, which offers a simple binary sorting order based on the byte values of characters, without considering any locale-specific rules.

Another provider is `icu`, which uses the external [ICU](https://icu.unicode.org/) library. In Neon, support for standard `libc` locales is limited. Instead, Neon provides predefined `icu` locales that you can use.

To view available locales, use the query `SELECT * FROM pg_collation`, or the command `\dOS+` from the [Neon SQL Editor](/docs/connect/query-with-psql-editor) or an SQL client like [psql](/docs/connect/query-with-psql-editor).

To create a database with a predefined `icu` locale, you can issue a query similar to this one with your preferred locale:

```sql
CREATE DATABASE my_arabic_db
LOCALE_PROVIDER icu
icu_locale 'ar-x-icu'
template template0;
```

To specify the locale for individual columns, you can use this syntax:

```sql
CREATE TABLE my_ru_table (
    id serial PRIMARY KEY,
    russian_text_column text COLLATE "ru-x-icu",
    description text
);
```

## Event triggers

Postgres [event triggers](https://www.postgresql.org/docs/current/event-triggers.html), which require Postgres superuser privileges, are currently not supported. Unlike regular triggers, which are attached to a single table and capture only DML events, event triggers are global to a particular database and are capable of capturing DDL events.

Attempting to create an event trigger will produce errors similar to these:

```sql
ERROR: permission denied to create event trigger "your_trigger_name" (SQLSTATE 42501)

ERROR:  permission denied to create event trigger "your_trigger_name"
HINT:  Must be superuser to create an event trigger.
```

## Foreign Data Wrappers

Neon does not yet support Foreign Data Wrappers (FDW) or Postgres extensions such as `postgres_fdw` that provide this functionality. We intend to offer FDW support in a future release.

## PostgreSQL documentation

Neon provides a mirror of the official PostgreSQL documentation on the [Neon documentation site](https://neon.tech/docs/introduction) for the convenience of our users. As Neon is built on standard PostgreSQL, most information from the official PostgreSQL documentation applies to our platform. However, there are a few key differences to consider when referencing the official PostgreSQL docs:

- As a managed Postgres service, certain aspects of the official PostgreSQL documentation like installation procedures do not apply to Neon.
- Some features detailed in the official PostgreSQL documentation may not be relevant for Neon, such as those mentioned on this Postgres compatibility page.
- Features requiring the PostgreSQL superuser privilege may not be supported. See [Roles and permissions](#roles-and-permissions) above.
- Neon may not support all of the extensions mentioned in the official PostgreSQL documentation. See [Postgres extensions](#postgres-extensions) above.

<NeedHelp/>
