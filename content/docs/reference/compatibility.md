---
title: Postgres compatibility
subtitle: Learn about Neon as a managed Postgres service
summary: >-
  Covers the differences and features of Neon as a managed Postgres service,
  including supported Postgres versions, available extensions, and the roles and
  permissions model specific to Neon.
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compatibility
updatedOn: '2026-02-06T22:07:33.142Z'
---

**Neon is Postgres**. However, as a managed Postgres service, there are some differences you should be aware of.

## Postgres versions

Neon supports Postgres 14, 15, 16, 17, and 18 (preview), as per the [Neon version support policy](/docs/postgresql/postgres-version-policy). You can select the Postgres version you want to use when creating a Neon project. For information about creating a Neon project, See [Manage projects](/docs/manage/projects). Minor Postgres point releases are rolled out by Neon after extensive validation as part of regular platform maintenance.

## Postgres extensions

Neon supports numerous Postgres extensions, and we regularly add support for more. For the extensions that Neon supports, see [Postgres Extensions](/docs/extensions/pg-extensions). To request support for additional extensions, please reach out to us on our [Discord Server](https://discord.gg/92vNTzKDGp). Please keep in mind that privilege requirements, local file system access, and functionality that is incompatible with Neon features such as Autoscaling and Scale to Zero may prevent Neon from being able to offer support for certain extensions.

## Roles and permissions

Neon is a managed Postgres service, so you cannot access the host operating system, and you can't connect using the Postgres `superuser` account. In place of the Postgres superuser role, Neon provides a `neon_superuser` role.

Roles created in the Neon Console, CLI, or API, including the default role created with a Neon project, are granted membership in the `neon_superuser` role. For information about the privileges associated with this role, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

Roles created in Neon with SQL syntax, from a command-line tool like `psql` or the [Neon SQL Editor](/docs/connect/query-with-psql-editor), have the same privileges as newly created roles in a standalone Postgres installation. These roles are not granted membership in the `neon_superuser` role. You must grant these roles the privileges you want them to have. For more information, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

Neon roles cannot install Postgres extensions other than those supported by Neon.

<a id="default-parameters/"></a>

## Postgres parameter settings

The following table shows parameter settings that are set explicitly for your Neon Postgres instance. These values may differ from standard Postgres defaults, and a few settings differ based on your Neon compute size.

<Admonition type="note">
Because Neon is a managed Postgres service, Postgres parameters are not user-configurable outside of a [session, database, or role context](#configuring-postgres-parameters-for-a-session-database-or-role).

If you are a Neon [Scale plan](/docs/introduction/plans) user and require a different Postgres instance-level setting, you can contact [Neon Support](/docs/introduction/support) to see if the desired setting can be supported. Please keep in mind that it may not be possible to support some parameters due to platform limitations and contraints.
</Admonition>

| Parameter                             | Value         | Note                                                                                                                                                                                                                                                                           |
| ------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `client_connection_check_interval`    | 60000         |                                                                                                                                                                                                                                                                                |
| `dynamic_shared_memory_type`          | mmap          |                                                                                                                                                                                                                                                                                |
| `effective_io_concurrency`            | 20            |                                                                                                                                                                                                                                                                                |
| `effective_cache_size    `            |               | Set based on the [Local File Cache (LFC)](/docs/reference/glossary#local-file-cache) size of your maximum Neon compute size                                                                                                                                                    |
| `fsync`                               | off           | Neon syncs data to the Neon Storage Engine to store your data safely and reliably                                                                                                                                                                                              |
| `hot_standby`                         | off           |                                                                                                                                                                                                                                                                                |
| `idle_in_transaction_session_timeout` | 300000        |                                                                                                                                                                                                                                                                                |
| `listen_addresses`                    | '\*'          |                                                                                                                                                                                                                                                                                |
| `log_connections`                     | on            |                                                                                                                                                                                                                                                                                |
| `log_disconnections`                  | on            |                                                                                                                                                                                                                                                                                |
| `log_min_error_statement`             | panic         |                                                                                                                                                                                                                                                                                |
| `log_temp_files`                      | 1048576       |                                                                                                                                                                                                                                                                                |
| `maintenance_work_mem`                | 65536         | The value differs by compute size. See [below](#parameter-settings-that-differ-by-compute-size).                                                                                                                                                                               |
| `max_connections`                     | 112           | The value differs by compute size. See [below](#parameter-settings-that-differ-by-compute-size).                                                                                                                                                                               |
| `max_parallel_workers`                | 8             |                                                                                                                                                                                                                                                                                |
| `max_replication_flush_lag`           | 10240         |                                                                                                                                                                                                                                                                                |
| `max_replication_slots`               | 10            |                                                                                                                                                                                                                                                                                |
| `max_replication_write_lag`           | 500           |                                                                                                                                                                                                                                                                                |
| `max_wal_senders`                     | 10            |                                                                                                                                                                                                                                                                                |
| `max_wal_size`                        | 1024          |                                                                                                                                                                                                                                                                                |
| `max_worker_processes`                | 26            | The value differs by compute size. See [below](#parameter-settings-that-differ-by-compute-size).                                                                                                                                                                               |
| `password_encryption`                 | scram-sha-256 |                                                                                                                                                                                                                                                                                |
| `restart_after_crash`                 | off           |                                                                                                                                                                                                                                                                                |
| `shared_buffers`                      | 128MB         | Neon uses a [Local File Cache (LFC)](/docs/extensions/neon#what-is-the-local-file-cache) in addition to `shared_buffers` to extend cache memory to 75% of your compute's RAM. The value differs by compute size. See [below](#parameter-settings-that-differ-by-compute-size). |
| `superuser_reserved_connections`      | 4             |                                                                                                                                                                                                                                                                                |
| `synchronous_standby_names`           | 'walproposer' |                                                                                                                                                                                                                                                                                |
| `wal_level`                           | replica       | Support for `wal_level=logical` is coming soon. See [logical replication](/docs/introduction/logical-replication).                                                                                                                                                             |
| `wal_log_hints`                       | off           |                                                                                                                                                                                                                                                                                |
| `wal_sender_timeout`                  | 10000         |                                                                                                                                                                                                                                                                                |

### Parameter settings that differ by compute size

Of the parameter settings listed above, the `max_connections`, `maintenance_work_mem`,
`shared_buffers`, `max_worker_processes`, and `effective_cache_size` differ by your compute size—defined in [Compute Units (CU)](/docs/reference/glossary#compute-unit-cu)—or by your autoscaling configuration, which has a minimum and maximum compute size. To understand how values are set, see the formulas below.

- The formula for `max_connections` is:

  ```go
  compute_size = min(max_compute_size, 8 × min_compute_size)
  max_connections = max(100, min(4000, floor(compute_size × 419.66)))
  ```

  In simpler terms:
  - Neon first determines the effective compute size by taking the smaller of: your maximum size, or 8 times your minimum size
  - This compute size is then multiplied by approximately 420 connections per CU
  - The result is capped between a minimum of 100 and a maximum of 4,000 connections

  **Examples:**
  - **Fixed compute size of 4 CU:**
    - Since your min and max are both 4 CU, the compute size is 4.
    - Max connections = 4 × 419.66 = 1,678 connections
  - **Autoscaling from 0.25 to 2 CU:**
    - Compute size = min(2, 8 × 0.25) = min(2, 2) = 2
    - Max connections = 2 × 419.66 = 839 connections
  - **Autoscaling from 0.25 to 4 CU:**
    - Compute size = min(4, 8 × 0.25) = min(4, 2) = 2
    - Max connections = 2 × 419.66 = 839 connections
  - **Autoscaling from 2 to 8 CU:**
    - Compute size = min(8, 8 × 2) = min(8, 16) = 8
    - Max connections = 8 × 419.66 = 3,357 connections

You can view your `max_connections` setting in the Neon Console by navigating to **Branches**, selecting your compute, and clicking **Edit** on the **Compute** tab. The value is displayed as **direct connections**. As you adjust your compute settings, you'll see how changes to your min/max compute size affect the number of direct connections available.

![max_connections calculator](/docs/reference/max_connections_calculator.png)

_For most applications, we recommend using connection pooling, which supports up to 10,000 concurrent connections regardless of compute size. Direct connections are best for specific use cases like running `pg_dump`, session-dependent features, or schema migrations. For more information, see [Connection pooling](/docs/connect/connection-pooling)._

- The `maintenance_work_mem` value is set according to your minimum compute size RAM. The formula is:

  ```go
  maintenance_work_mem = max(min_compute_size RAM in bytes * 1024/63,963,136, 65,536)
  ```

  However, you can increase the setting for the current session; for example:

  ```sql
  SET maintenance_work_mem='10 GB';
  ```

  If you do increase `maintenance_work_mem`, your setting should not exceed 60 percent of your compute's available RAM.

  | Compute Units (CU) | RAM    | maintenance_work_mem |
  | :----------------- | :----- | :------------------- |
  | 0.25               | 1 GB   | 64 MB                |
  | 0.50               | 2 GB   | 64 MB                |
  | 1                  | 4 GB   | 67 MB                |
  | 2                  | 8 GB   | 134 MB               |
  | 3                  | 12 GB  | 201 MB               |
  | 4                  | 16 GB  | 268 MB               |
  | 5                  | 20 GB  | 335 MB               |
  | 6                  | 24 GB  | 402 MB               |
  | 7                  | 28 GB  | 470 MB               |
  | 8                  | 32 GB  | 537 MB               |
  | 9                  | 36 GB  | 604 MB               |
  | 10                 | 40 GB  | 671 MB               |
  | 11                 | 44 GB  | 738 MB               |
  | 12                 | 48 GB  | 805 MB               |
  | 13                 | 52 GB  | 872 MB               |
  | 14                 | 56 GB  | 939 MB               |
  | 15                 | 60 GB  | 1007 MB              |
  | 16                 | 64 GB  | 1074 MB              |
  | 18                 | 72 GB  | 1208 MB              |
  | 20                 | 80 GB  | 1342 MB              |
  | 22                 | 88 GB  | 1476 MB              |
  | 24                 | 96 GB  | 1610 MB              |
  | 26                 | 104 GB | 1744 MB              |
  | 28                 | 112 GB | 1878 MB              |
  | 30                 | 120 GB | 2012 MB              |
  | 32                 | 128 GB | 2146 MB              |
  | 34                 | 136 GB | 2280 MB              |
  | 36                 | 144 GB | 2414 MB              |
  | 38                 | 152 GB | 2548 MB              |
  | 40                 | 160 GB | 2682 MB              |
  | 42                 | 168 GB | 2816 MB              |
  | 44                 | 176 GB | 2950 MB              |
  | 46                 | 184 GB | 3084 MB              |
  | 48                 | 192 GB | 3218 MB              |
  | 50                 | 200 GB | 3352 MB              |
  | 52                 | 208 GB | 3486 MB              |
  | 54                 | 216 GB | 3620 MB              |
  | 56                 | 224 GB | 3754 MB              |

- The formula for `max_worker_processes` is:

  ```go
  max_worker_processes := 12 + floor(2 * max_compute_size)
  ```

  For example, if your `max_compute_size` is 4 CU, your `max_worker_processes` setting would be 20.

- The formula for `shared_buffers` is:

  ```go
  backends = 1 + max_connections + max_worker_processes
  shared_buffers_mb = max(128, (1023 + backends * 256) / 1024)
  ```

- The `effective_cache_size` parameter is set based on the [Local File Cache (LFC)](/docs/reference/glossary#local-file-cache) size of your maximum Neon compute size. This helps the Postgres query planner make smarter decisions, which can improve query performance. For details on LFC size by compute size, see the table in [How to size your compute](/docs/manage/computes#how-to-size-your-compute).

### Configuring Postgres parameters for a session, database, or role

Neon permits configuring parameters that have a `user` context, meaning that these parameters can be set for a session, database, or role. You can identify Postgres parameters with a `user` context by running the following query:

```sql
SELECT name
FROM pg_settings
WHERE context = 'user';
```

To set a parameter for a specific session, use a [SET](https://www.postgresql.org/docs/current/sql-set.html) command.

For example, the `maintenance_work_mem` parameter supports a `user` context, which lets you set it for the current session with a `SET` command:

```sql
SET maintenance_work_mem='1 GB';
```

To set parameters for a database or role:

```sql
ALTER DATABASE neondb SET maintenance_work_mem='1 GB';
```

```sql
ALTER USER neondb_owner SET maintenance_work_mem='1 GB';
```

## Tablespaces

Neon does not support PostgreSQL [tablespaces](https://www.postgresql.org/docs/current/manage-ag-tablespaces.html). Attempting to create a tablespace with the `CREATE TABLESPACE` command will result in an error. This is due to Neon's managed cloud architecture, which does not permit direct file system access for custom storage locations.

If you have existing applications or scripts that use tablespaces for organizing database objects across different storage devices, you'll need to remove or modify these references when migrating to Neon.

## Postgres logs

Postgres logs can be accessed through the [Datadog](/docs/guides/datadog) or [OpenTelemetry](/docs/guides/opentelemetry) integration on the Scale plan. The integration forwards logs including error messages, database connection events, system notifications, and general PostgreSQL logs. For other plans or if you need specific log information for troubleshooting purposes, please contact [Neon Support](/docs/introduction/support).

## Unlogged tables

Unlogged tables are tables that do not write to the Postgres write-ahead log (WAL). In Noen, these tables are stored on compute local storage and are not persisted across compute restarts or when a compute scales to zero. This is unlike standard Postgres, where unlogged tables are only truncated in the event of abnormal process termination. Additionally, unlogged tables are limited by compute local disk space. Computes allocate 20 GiB of local disk space or 15 GiB x the maximum compute size (whichever is highest) for temporary files used by Postgres.

## Temporary tables

Temporary tables are tied to a session (or optionally a transaction). They exist only for the lifetime of the session or transaction and are automatically dropped when it ends. Like unlogged tables, they are stored on compute local storage and limited by compute local disk space.

## Memory

SQL queries and index builds can generate large volumes of data that may not fit in memory. In Neon, the size of your compute determines the amount of memory that is available. For information about compute size and available memory, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

## Session context

The Neon cloud service automatically closes idle connections after a period of inactivity, as described in [Compute lifecycle](/docs/introduction/compute-lifecycle). When connections are closed, anything that exists within a session context is forgotten and must be recreated before being used again. For example, parameters set for a specific session, in-memory statistics, temporary tables, prepared statements, advisory locks, and notifications and listeners defined using [NOTIFY](https://www.postgresql.org/docs/current/sql-notify.html)/[LISTEN](https://www.postgresql.org/docs/current/sql-listen.html) commands only exist for the duration of the current session and are lost when the session ends. To avoid losing session-level contexts in Neon, you can disable Neon's [Scale to Zero](/docs/guides/scale-to-zero-guide) feature, which is possible on any of Neon's paid plans. However, disabling scale to zero also means that your compute will run 24/7. You can't disable scale to zero on Neon's Free plan, where your compute always suspends after 5 minutes of inactivity.

## Statistics collection

Statistics collected by the Postgres [cumulative statistics system](https://www.postgresql.org/docs/current/monitoring-stats.html) are not saved when a Neon compute (where Postgres runs) is suspended due to inactivity or restarted. For information about the lifecycle of a Neon compute, see [Compute lifecycle](/docs/introduction/compute-lifecycle). For information about configuring Neon's scale to zero behavior, see [Scale to Zero](/docs/introduction/scale-to-zero).

## Database encoding

Neon supports UTF8 encoding (Unicode, 8-bit variable-width encoding). This is the most widely used and recommended encoding for Postgres.

To view the encoding and collation for your database, you can run the following query:

```sql
SELECT
    pg_database.datname AS database_name,
    pg_encoding_to_char(pg_database.encoding) AS encoding,
    pg_database.datcollate AS collation,
    pg_database.datctype AS ctype
FROM
    pg_database
WHERE
    pg_database.datname = 'your_database_name';
```

You can also issue this command from [psql](/docs/connect/query-with-psql-editor) or the Neon SQL Editor:

```bash
\l
```

<Admonition type="note">
In Postgres, you cannot change a database's encoding or collation after it has been created.
</Admonition>

## Collation support

A collation is an SQL schema object that maps an SQL name to locales provided by libraries installed in the operating system. A collation has a provider that specifies which library supplies the locale data. For example, a common standard provider, `libc`, uses locales provided by the operating system C library.

By default, Neon uses the `C.UTF-8` collation. `C.UTF-8` supports the full range of UTF-8 encoded characters.

Another provider supported by Neon is `icu`, which uses the external [ICU](https://icu.unicode.org/) library. In Neon, support for standard `libc` locales is limited compared to what you might find in a locally installed Postgres instance where there's typically a wider range of locales provided by libraries installed on your operating system. For this reason, Neon provides a full series of [predefined icu locales](https://www.postgresql.org/docs/current/collation.html#COLLATION-MANAGING-PREDEFINED-ICU) in case you require locale-specific sorting or case conversions.

To view all of the predefined locales available to you, use the query `SELECT * FROM pg_collation`, or the command `\dOS+` from the [Neon SQL Editor](/docs/connect/query-with-psql-editor) or an SQL client like [psql](/docs/connect/query-with-psql-editor).

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

ICU also supports creating custom collations. For more information, see [ICU Custom Collations](https://www.postgresql.org/docs/current/collation.html#ICU-CUSTOM-COLLATIONS).

For more about collations in Postgres, see [Collation Support](https://www.postgresql.org/docs/current/collation.html#COLLATION).

## track_commit_timestamp parameter

The `track_commit_timestamp` Postgres parameter is currently not supported in Neon due to platform constraints.

<NeedHelp/>
