---
title: Postgres compatibility
subtitle: Learn about Neon as a managed Postgres service
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compatibility
updatedOn: '2025-02-21T20:49:03.651Z'
---

**Neon is Postgres**. However, as a managed Postgres service, there are some differences you should be aware of.

## Postgres versions

Neon supports Postgres 14, 15, 16, 17. You can select the Postgres version you want to use when creating a Neon project. For information about creating a Neon project, See [Manage projects](/docs/manage/projects). Minor Postgres point releases are rolled out by Neon after extensive validation as part of regular platform maintenance.

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
Because Neon is a managed Postgres service, Postgres parameters are not user-configurable outside of a [session, database, or role context](#configuring-postgres-parameters-for-a-session-database-or-role), but if you are a paid plan user and require a different Postgres instance-level setting, you can contact [Neon Support](/docs/introduction/support) to see if the desired setting can be supported.
</Admonition>

| Parameter                             | Value         | Note                                                                                                                                                                                                                                                                           |
| ------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `client_connection_check_interval`    | 60000         |                                                                                                                                                                                                                                                                                |
| `dynamic_shared_memory_type`          | mmap          |                                                                                                                                                                                                                                                                                |
| `effective_io_concurrency`            | 20            |                                                                                                                                                                                                                                                                                |
| `fsync`                               | off           | Neon syncs data to the Neon Storage Engine to store your data safely and reliably                                                                                                                                                                                              |
| `hot_standby`                         | off           |                                                                                                                                                                                                                                                                                |
| `idle_in_transaction_session_timeout` | 300000        |                                                                                                                                                                                                                                                                                |
| `listen_addresses`                    | '\*'          |                                                                                                                                                                                                                                                                                |
| `log_connections`                     | on            |                                                                                                                                                                                                                                                                                |
| `log_disconnections`                  | on            |                                                                                                                                                                                                                                                                                |
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
`shared_buffers`, and `max_worker_processes` differ by your compute size—defined in [Compute Units (CU)](/docs/reference/glossary#compute-unit-cu)—or by your autoscaling configuration, which has a minimum and maximum compute size. To understand how values are set, see the formulas below.

- The formula for `max_connections` is:

  ```go
  compute_size = min(max_compute_size, 8 * min_compute_size)
  max_connections = max(100, min(4000, 450.5 * compute_size))
  ```

  For example, if you have a fixed compute size of 4 CU, that size is be both your `max_compute_size` and `min_compute_size`. Inputting that value into the formula gives you a `max_connections` setting of 1802. For an autoscaling configuration with a `min_compute_size` of 0.25 CU and a `max_compute_size` of 2 CU, the `max_connections` setting would be 901.

    <Admonition type="note">
    It's important to note that `max_connections` does not scale dynamically in an autoscaling configuration. It’s a static setting determined by your minimum and maximum compute size.
    </Admonition>

  You can also check your `max_connections` setting in the Neon Console. Go to **Branches**, select your branch, then go to the **Compute** tab and select **Edit**. Your `max_connections` setting is the "direct connections" value. You can adjust the compute configuration to see how it impacts the number of direct connections.

  ![max_connections calculator](/docs/reference/max_connection_calculator.png)

  _You can use connection pooling in Neon to increase the number of supported connections. For more information, see [Connection pooling](/docs/connect/connection-pooling)._

- The `maintenance_work_mem` value is set according to your minimum compute size RAM. The formula is:

  ```go
  maintenance_work_mem = max(min_compute_size RAM in bytes * 1024/63,963,136, 65,536)
  ```

  However, you can increase the setting for the current session; for example:

  ```sql
  SET maintenance_work_mem='10 GB';
  ```

  If you do increase `maintenance_work_mem`, your setting should not exceed 60 percent of your compute's available RAM.

  | Compute Units (CU) | vCPU | RAM    | maintenance_work_mem |
  | :----------------- | :--- | :----- | :------------------- |
  | 0.25               | 0.25 | 1 GB   | 64 MB                |
  | 0.50               | 0.50 | 2 GB   | 64 MB                |
  | 1                  | 1    | 4 GB   | 67 MB                |
  | 2                  | 2    | 8 GB   | 134 MB               |
  | 3                  | 3    | 12 GB  | 201 MB               |
  | 4                  | 4    | 16 GB  | 268 MB               |
  | 5                  | 5    | 20 GB  | 335 MB               |
  | 6                  | 6    | 24 GB  | 402 MB               |
  | 7                  | 7    | 28 GB  | 470 MB               |
  | 8                  | 8    | 32 GB  | 537 MB               |
  | 9                  | 9    | 36 GB  | 604 MB               |
  | 10                 | 10   | 40 GB  | 671 MB               |
  | 11                 | 11   | 44 GB  | 738 MB               |
  | 12                 | 12   | 48 GB  | 805 MB               |
  | 13                 | 13   | 52 GB  | 872 MB               |
  | 14                 | 14   | 56 GB  | 939 MB               |
  | 15                 | 15   | 60 GB  | 1007 MB              |
  | 16                 | 16   | 64 GB  | 1074 MB              |
  | 18                 | 18   | 72 GB  | 1208 MB              |
  | 20                 | 20   | 80 GB  | 1342 MB              |
  | 22                 | 22   | 88 GB  | 1476 MB              |
  | 24                 | 24   | 96 GB  | 1610 MB              |
  | 26                 | 26   | 104 GB | 1744 MB              |
  | 28                 | 28   | 112 GB | 1878 MB              |
  | 30                 | 30   | 120 GB | 2012 MB              |
  | 32                 | 32   | 128 GB | 2146 MB              |
  | 34                 | 34   | 136 GB | 2280 MB              |
  | 36                 | 36   | 144 GB | 2414 MB              |
  | 38                 | 38   | 152 GB | 2548 MB              |
  | 40                 | 40   | 160 GB | 2682 MB              |
  | 42                 | 42   | 168 GB | 2816 MB              |
  | 44                 | 44   | 176 GB | 2950 MB              |
  | 46                 | 46   | 184 GB | 3084 MB              |
  | 48                 | 48   | 192 GB | 3218 MB              |
  | 50                 | 50   | 200 GB | 3352 MB              |
  | 52                 | 52   | 208 GB | 3486 MB              |
  | 54                 | 54   | 216 GB | 3620 MB              |
  | 56                 | 56   | 224 GB | 3754 MB              |

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

## Postgres server logs

Currently, Postgres server logs can only be accessed Neon Support team. Should you require information from the Postgres server logs for troubleshooting purposes, please contact [Neon Support](/docs/introduction/support).

## Unlogged tables

Unlogged tables are maintained on Neon compute local storage. These tables do not survive compute restarts (including when a Neon compute is placed into an idle state after a period of inactivity). This is unlike a standalone Postgres installation, where unlogged tables are only truncated in the event of abnormal process termination. Additionally, unlogged tables are limited by compute local storage size.

## Memory

SQL queries and index builds can generate large volumes of data that may not fit in memory. In Neon, the size of your compute determines the amount of memory that is available. For information about compute size and available memory, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

## Temporary tables

Temporary tables, which are stored in compute local storage, are limited by compute local storage size.

## Session context

The Neon cloud service automatically closes idle connections after a period of inactivity, as described in [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). When connections are closed, anything that exists within a session context is forgotten and must be recreated before being used again. For example, parameters set for a specific session, in-memory statistics, temporary tables, prepared statements, advisory locks, and notifications and listeners defined using [NOTIFY](https://www.postgresql.org/docs/current/sql-notify.html)/[LISTEN](https://www.postgresql.org/docs/current/sql-listen.html) commands only exist for the duration of the current session and are lost when the session ends. To avoid losing session-level contexts in Neon, you can disable Neon's [Scale to Zero](/docs/guides/scale-to-zero-guide) feature, which is possible on any of Neon's paid plans. However, disabling scale to zero also means that your compute will run 24/7. You can't disable scale to zero on Neon's Free plan, where your compute always suspends after 5 minutes of inactivity.

## Statistics collection

Statistics collected by the Postgres [cumulative statistics system](https://www.postgresql.org/docs/current/monitoring-stats.html) are not saved when a Neon compute (where Postgres runs) is suspended due to inactivity or restarted. For information about the lifecycle of a Neon compute, see [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). For information about configuring Neon's scale to zero behavior, see [Scale to Zero](/docs/introduction/scale-to-zero).

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

## Event triggers

Postgres [event triggers](https://www.postgresql.org/docs/current/event-triggers.html), which require Postgres superuser privileges, are currently not supported. Unlike regular triggers, which are attached to a single table and capture only DML events, event triggers are global to a particular database and are capable of capturing DDL events.

Attempting to create an event trigger will produce errors similar to these:

```sql
ERROR: permission denied to create event trigger "your_trigger_name" (SQLSTATE 42501)

ERROR:  permission denied to create event trigger "your_trigger_name"
HINT:  Must be superuser to create an event trigger.
```

<NeedHelp/>
