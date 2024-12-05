---
title: The pg_stat_statements extension
subtitle: Track planning and execution statistics for all SQL statements
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.050Z'
---

The `pg_stat_statements` extension provides a detailed statistical view of SQL statement execution within a Postgres database. It tracks information such as execution counts, total and average execution times, and more, helping database administrators and developers analyze and optimize SQL query performance.

<CTA />

This guide covers:

- [Enabling pg_stat_statements](#enable-the-pgstatstatements-extension)
- [Usage examples](#usage-examples)
- [Resetting statistics](#reset-statistics)

<Admonition type="note">
`pg_stat_statements` is an open-source extension for Postgres that can be installed on any Neon project using the instructions below.
</Admonition>

### Version availability

The version of `pg_stat_statements` available on Neon depends on the version of Postgres you select for your Neon project.

- Postgres 14 - `pg_stat_statements` 1.9
- Postgres 15 - `pg_stat_statements` 1.10
- Postgres 16 - `pg_stat_statements` 1.10
- Postgres 17 - `pg_stat_statements` 1.11

### Data persistence

In Neon, statistics collected by the `pg_stat_statements` extension are not retained when your Neon compute (where Postgres runs) is suspended or restarted. For example, if your compute scales down to zero due to inactivity, any existing statistics are lost. New statistics will be gathered once your compute restarts. For more details about the lifecycle of a Neon compute, see [Compute lifecycle](/docs/conceptual-guides/compute-lifecycle/). For information about configuring Neon's scale to zero behavior, see [Scale to zero](/docs/introduction/scale-to-zero).

## Enable the `pg_stat_statements` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Usage examples

This section provides `pg_stat_statements` usage examples.

### Query the pg_stat_statements view

The main interface is the `pg_stat_statements` view, which contains one row per distinct database query, showing various statistics.

```sql
SELECT * FROM pg_stat_statements LIMIT 10;
```

The view contains details like those shown below:

```
| userid | dbid  | queryid               | query                 | calls |
|--------|-------|-----------------------|-----------------------|-------|
| 16391  | 16384 | -9047282044438606287  | SELECT * FROM users;  | 10    |
```

For a complete list of `pg_stat_statements` columns and descriptions, see [The pg_stat_statements View](https://www.postgresql.org/docs/current/pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS).

Let's explore some example usage patterns.

### Find the most frequently executed queries

The most frequently run queries are often critical paths and optimization candidates.

This query retrieves details about the most frequently executed queries, ordered by the number of calls. Only the top 10 rows are returned (`LIMIT 10`):

```sql
SELECT
  userid,
  query,
  calls,
  (total_exec_time / 1000 / 60) as total_min,
  mean_exec_time as avg_ms
FROM pg_stat_statements
ORDER BY 3 DESC
LIMIT 10;
```

### Monitor slow queries

A high average runtime can indicate an inefficient query.

The query below uses the `query`, `mean_exec_time` (average execution time per call), and `calls` columns. The condition `WHERE mean_exec_time > 1` filters out queries with an average execution time greater than 1 unit (you may adjust this threshold as needed).

```sql
SELECT
    query,
    mean_exec_time,
    calls
FROM
    pg_stat_statements
WHERE
    mean_exec_time > 1
ORDER BY
    mean_exec_time DESC;
```

This query returns the following results:

```
| Query                                         | Mean Time | Calls |
|-----------------------------------------------|-----------|-------|
| SELECT p.*, c.name AS category FROM products  | 250.60ms  |  723  |
```

This query retrieves the top 10 queries with the highest average execution time, focusing on queries run more than 500 times, for the current user.

```sql
WITH statements AS (
    SELECT *
    FROM pg_stat_statements pss
    JOIN pg_roles pr ON (pss.userid = pr.oid)
    WHERE pr.rolname = current_user
)
SELECT
    calls,
    mean_exec_time,
    query
FROM statements
WHERE
    calls > 500
    AND shared_blks_hit > 0
ORDER BY
    mean_exec_time DESC
LIMIT 10;
```

This query returns the 10 longest-running queries for the current user, focusing on those executed over 500 times and with some cache usage. It orders queries by frequency and cache efficiency to highlight potential areas for optimization.

```sql
WITH statements AS (
    SELECT *
    FROM pg_stat_statements pss
    JOIN pg_roles pr ON (pss.userid = pr.oid)
    WHERE pr.rolname = current_user
)
SELECT
    calls,
    shared_blks_hit,
    shared_blks_read,
    shared_blks_hit / (shared_blks_hit + shared_blks_read)::NUMERIC * 100 AS hit_cache_ratio,
    query
FROM statements
WHERE
    calls > 500
    AND shared_blks_hit > 0
ORDER BY
    calls DESC,
    hit_cache_ratio ASC
LIMIT 10;
```

This query retrieves the top 10 longest-running queries (in terms of mean execution time), focusing on queries executed more than 500 times, for the current user.

```sql
WITH statements AS (
    SELECT *
    FROM pg_stat_statements pss
    JOIN pg_roles pr ON (userid = oid)
    WHERE rolname = current_user
)
SELECT
    calls,
    min_exec_time,
    max_exec_time,
    mean_exec_time,
    stddev_exec_time,
    (stddev_exec_time / mean_exec_time) AS coeff_of_variance,
    query
FROM statements
WHERE calls > 500
AND shared_blks_hit > 0
ORDER BY mean_exec_time DESC
```

### Find queries that return many rows

To identify queries that return a lot of rows, you can select the `query` and `rows` columns, representing the SQL statement and the number of rows returned by each statement, respectively.

```sql
SELECT
    query,
    rows
FROM
    pg_stat_statements
ORDER BY
    rows DESC
LIMIT
    10;
```

This query returns results similar to the following:

```
| Query                                             | Rows    |
|---------------------------------------------------|---------|
| SELECT * FROM products;                           | 112,394 |
| SELECT * FROM users;                              | 98,723  |
| SELECT p.*, c.name AS category FROM products      | 23,984  |
```

### Find the most time-consuming queries

The following query returns details about the most time-consuming queries, ordered by execution time.

```sql
SELECT
  userid,
  query,
  calls,
  total_exec_time,
  rows
FROM
  pg_stat_statements
ORDER BY
  total_exec_time DESC
LIMIT 10;
```

## Reset statistics

When executed, the `pg_stat_statements_reset()` function resets the accumulated statistical data, such as execution times and counts for SQL statements, to zero. It's particularly useful in scenarios where you want to start fresh with collecting performance statistics.

<Admonition type="note">
In Neon, only [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) roles have the privilege required to execute this function. The default role created with a Neon project and roles created in the Neon Console, CLI, and API are granted membership in the `neon_superuser` role.
</Admonition>

```sql
SELECT pg_stat_statements_reset();
```

## Resources

- [PostgreSQL documentation for pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)
