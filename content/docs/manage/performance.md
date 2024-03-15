---
title: Performance optimization in Postgres
subtitle: Learn about strategies for optimizing Postgres performance in Neon
enableTableOfContents: true
---


Many factors can impact the performance of your Postgres database, ranging from insufficient indexing or database maintenance to poorly optimized queries or inadequate system resources. With such a wide range of factors, where do you start? This topic outlines several strategies for optimizing the performance of your Postgres database.

## Collecting statistics

A good first step is to make sure you are gathering statistics that can aid in identifying performance issues.

In addition to the Postgres [Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html), where Postgres collects and reports information about server activity, Neon supports the [pg_stat_statements](/docs/extensions/pg_stat_statements) extension for monitoring and analyzing SQL query performance.

The [pg_stat_statements](/docs/extensions/pg_stat_statements) extension provides aggregated query statistics for executed SQL statements. The data collected includes the number of query executions, total execution time, rows returned by the query, and much more. 

This extension isn’t installed by default, so your first step is to install it and allow some time for data collection. To install the extension, run the following `CREATE EXTENSION` statement.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

You can do this from the Neon SQL Editor or a Postgres client such as `psql` that is connected to your database.

Once installed, you can run the following query to view the types of data that `pg_stat_statements` collects:

```shell
neondb=> \d pg_stat_statements

                      View "public.pg_stat_statements"

         Column         |       Type       | Collation | Nullable | Default 
------------------------+------------------+-----------+----------+---------
 userid                 | oid              |           |          | 
 dbid                   | oid              |           |          | 
 toplevel               | boolean          |           |          | 
 queryid                | bigint           |           |          | 
 query                  | text             |           |          | 
 plans                  | bigint           |           |          | 
 total_plan_time        | double precision |           |          | 
 min_plan_time          | double precision |           |          | 
 max_plan_time          | double precision |           |          | 
 mean_plan_time         | double precision |           |          | 
 stddev_plan_time       | double precision |           |          | 
 calls                  | bigint           |           |          | 
 total_exec_time        | double precision |           |          | 
 min_exec_time          | double precision |           |          | 
 max_exec_time          | double precision |           |          | 
 mean_exec_time         | double precision |           |          | 
 stddev_exec_time       | double precision |           |          | 
 rows                   | bigint           |           |          | 
 ...
 jit_functions          | bigint           |           |          | 
 jit_generation_time    | double precision |           |          | 
 jit_inlining_count     | bigint           |           |          | 
 jit_inlining_time      | double precision |           |          | 
 jit_optimization_count | bigint           |           |          | 
 jit_optimization_time  | double precision |           |          | 
 jit_emission_count     | bigint           |           |          | 
 jit_emission_time      | double precision |           |          |
```

For a description of each metric, refer to the official Postgres documentation: [The pg_stat_statements View](https://www.postgresql.org/docs/current/pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS).

<Admonition type="note" title="WHAT’S THE PERFORMANCE IMPACT OF PG_STAT_STATEMENTS?">
Generally, pg_stat_statements is found to have a very small impact, and many users will keep it installed so that it’s available when needed. For a discussion on this topic, please see this [Database Administrators Stack Exchange article](https://dba.stackexchange.com/questions/303503/what-is-the-performance-impact-of-pg-stat-statements).
</Admonition>

After allowing time for statistics to be collected, you can run queries like these to start gathering data about your queries.

### Most frequently executed queries

```sql
SELECT
  userid,
  query,
  calls,
  (total_exec_time / 1000 / 60) as total_min,
  mean_exec_time as avg_ms
FROM pg_stat_statements
ORDER BY 3 DESC
LIMIT 100;
```

This query returns:

- the ID of the user who executed the SQL query
- the text of the SQL query that was executed
- the number of times each query was executed
- the total execution time in minutes
- the average execution time in milliseconds
- queries sorted based on the number of calls (calls) in descending order, ensuring that the queries that were executed the most times are listed first.

Queries in this list with the highest total or mean execution time are often good candidates for optimization.

### Long-running queries

This `pg_stat_statements` query returns the longest-running queries by mean execution time.

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
FROM 
    statements
WHERE 
    calls > 100
ORDER BY 
    mean_exec_time DESC
LIMIT 100;
```

This query returns executed by the current user with more than 100 calls and orders them by the mean execution time in descending order, prioritizing queries with the longest average execution time. Specifically, it returns:

- the number of times each query was executed
- the shortest execution time for the query
- the longest execution time for the query
- the average execution time for the query
- the variability of the execution time from the mean.
- the standard deviation of execution time divided by the mean execution time

Queries with the longest execution time are candidates for optimization. 

As a next step, you can run `EXPLAIN (ANALYZE)` on each to identify opportunities for optimization, such as full table scans or inefficient joins.

### Most time-consuming queries

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

### Queries that return the most rows

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

## Cache hit ratio

A cache hit ratio tells you what percentage of queries are served from memory. Queries not served from memory retrieve data from disk, which is more costly and can result in slower query performance.

In Postgres, you can query the cache hit ratio with an SQL statement similar to this one, which looks for shared buffer block hits.

```sql
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit)  as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM 
  pg_statio_user_tables;
```

In Neon, it’s a little different. Neon extends Postgres shared buffers with a local file cache (local to your Neon compute instance), so in order to query your cache hit ratio in Neon, you need to look at local file cache hits instead of shared buffer hits. 

### The neon_stat_file_cache view

<Admonition type="note">
 This feature is not yet available in Neon. You can expect it to be released soon.
</Admonition>

To enable querying local file cache statistics, Neon provides a `neon_stat_file_cache` view. To access this view, you must first install the neon extension:

```sql
CREATE EXTENSION neon;
```

After allowing time for statistics collection, you can issue the following query to view your cache hit ratio:

```
\x
Expanded display is on.
SELECT * FROM neon.neon_stat_file_cache;
file_cache_misses:                 2133643
file_cache_hits:                   108999742
file_cache_used:                   607
file_cache_writes:                 10767410
file_cache_hit_ratio:              98.08
```

The ratio is calculated according to the following formula:

```plaintext
file_cache_hit_ratio = (file_cache_hits / (file_cache_hits + file_cache_misses)) * 100
```

If the `file_cache_hit_ratio` is below 99%, your working set (your most frequently accessed data) may not be adequately in memory. This could be due to your Postgres instance not having sufficient memory.

If it’s a lack of memory, you can consider allocating more. In Postgres, this requires increasing your shared_buffers setting, assuming your system has memory resources to support it. In Neon, shared_buffers is always set to 128 MB. To increase available memory in Neon, you can increase the size of your compute. Larger computes have larger local file caches. For information about selecting an appropriate compute size in Neon, please refer to [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

Please remember that the local file cache statistics are for the entire compute, not specific databases or tables. A Neon compute runs an instance of Postgres, which can have multiple databases and tables.

<Admonition type="note">
The cache hit ratio query is based on statistics that represent the lifetime of your Postgres instance, from the last time you started it until the time you ran the query. Statistics are lost when your instance stops and gathered again from scratch when your instance restarts. In Neon, your compute runs Postgres, so starting and stopping a compute also starts and stops Postgres. Additionally, you'll only want to run the cache hit ratio query after a representative workload has been run. For example, say that you restart Postgres. In this case, you should run a representative workload before you try the cache hit ratio query again to see if your cache hit ratio improved. Optionally, to help speed up the process, you can use the pg_prewarm extension to pre-load data into memory after a restart. 
</Admonition>

## Optimizing query performance

### Using EXPLAIN ANALYZE to optimize queries

Using EXPLAIN ANALYZE in PostgreSQL is a powerful technique to optimize queries by providing insights into how the database executes a query. This tool is invaluable for developers and database administrators aiming to improve the performance of their SQL queries. Below, is an introductory guide to using EXPLAIN ANALYZE, focusing on its purpose, how to use it, and interpreting its output for optimization.

### Cache optimization

### Slow queries

### Right-sizing your compute

### 