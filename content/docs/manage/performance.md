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

## Cache optimization

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

## Optimizing queries with EXPLAIN ANALYZE

Using EXPLAIN ANALYZE in Postgres can help you optimize queries by providing insights into how the database executes a query. Below, is an introductory guide to using EXPLAIN ANALYZE, focusing on its purpose, how to use it, and interpreting its output for optimization.

EXPLAIN ANALYZE is a command in Postgres that shows the execution plan of a SQL query. This plan details how the PostgreSQL planner and optimizer interpret your query, including the paths taken to retrieve the data, the cost of each operation, and the time each step takes. Using EXPLAIN ANALYZE helps identify bottlenecks or inefficiencies in query execution.

### How to Use EXPLAIN ANALYZE

To use EXPLAIN ANALYZE, prefix it to your SQL query like so:

```sql
EXPLAIN ANALYZE SELECT * FROM your_table WHERE condition = 'value';
```

This command will not return the query's result set but will instead provide a detailed report on how the query was executed, including the time taken for each operation.

### Interpreting the output

The output of `EXPLAIN ANALYZE` can be complex, but there are key elements to focus on:

- Query Plan: This shows the steps PostgreSQL took to execute your query, such as sequential scans, index scans, joins, etc.
Execution Time: The total time taken to execute the query.
- Costs: Estimated startup cost and total cost to execute the plan, which helps in comparing the efficiency of different execution strategies.
- Rows: The number of rows processed at each stage of the query.
- Actual Time: Shows the actual time spent on each node of the plan, helping to pinpoint slow operations.

### Tips for optimization

1. Look for Sequential Scans: If your query involves large tables, sequential scans can be slow. Consider using indexes to speed up data retrieval.
2. Analyze Joins: Make sure that joins are using indexes. If not, it might be beneficial to add indexes or revise the join conditions.
3. Optimize Filters: Check if the conditions in the WHERE clause can be optimized. Using efficient indexes can dramatically reduce the search space.
4. Subquery Performance: Subqueries can sometimes be inefficient. Look for opportunities to rewrite them as joins or to simplify them.
5. Use ANALYZE: Regularly run the ANALYZE command on your database. This updates statistics, helping Postgres make better planning decisions.

### Additional resources

Optimizing queries using `EXPLAIN ANALYZE` is a large topic, with many resources you can draw upon. Here are a few of those resources to help you get started:

- [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), in the official PostgreSQL documentation:
- [Using EXPLAIN](https://wiki.postgresql.org/wiki/Using_EXPLAIN). This topic provides links to a variety of resources and tutorials.
- [Postgres Explain Visualizer](https://www.pgexplain.dev/)

## Checking for table or index bloat

If there is some issue with Postgres [autovacuum](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM), this can lead to table and index bloat. 

Bloat refers to the condition where tables and indexes occupy more space on disk than is necessary for storing the data. Bloat can occur over time due to the way Postgres handles updates and deletes.

### Table Bloat

When a row is updated, the database doesn’t overwrite the existing row. Instead, it marks the old row version as obsolete and creates a new version of the row elsewhere in the table. Similarly, when a row is deleted, it is not immediately removed; it’s just marked as inaccessible. The space occupied by these obsolete or deleted rows contributes to table bloat.

This mechanism supports Postgres MVCC (Multi-Version Concurrency Control), allowing for more efficient query processing without locking rows for reading. However, the downside is that it can lead to wasted space and decreased performance over time as the table grows larger than necessary.

### Index Bloat

Indexes can also experience bloat. As rows are updated and deleted, the indexes that point to those rows can become inefficient. Index bloat happens because, similar to tables, indexes also retain pointers to obsolete row versions. Over time, the index can grow larger, consuming more space than necessary.

Index bloat can degrade the performance of read operations. Since indexes are used to speed up data retrieval, a bloated index can have the opposite effect, making queries slower.

### Checking for bloat

There are SQL queries you can run to check for table and index bloat. There are several good sources for bloat check queries, including these:

- [Show database bloat – PostgreSQL wiki](https://wiki.postgresql.org/wiki/Show_database_bloat)
- [Index and table bloat check scripts from PostgreSQL Experts](https://github.com/pgexperts/pgx_scripts/tree/master/bloat)

### Reducing bloat

To reduce table bloat, you can run the [VACUUM](https://www.postgresql.org/docs/current/sql-vacuum.html) command. `VACUUM` cleans up these obsolete records and makes space available for reuse within the table. For more aggressive space reclamation, you can use VACUUM FULL, but this command locks the table, which can be disruptive.

To remove index bloat, you can use the [REINDEX](https://www.postgresql.org/docs/current/sql-reindex.html) command, which rebuilds the index from scratch. Be aware that this can be an intensive operation, especially for large indexes, as it requires an exclusive lock on the index.

Generally, you’ll want to perform these types of operations when it will have the least impact, or you’ll want to plan some maintenance downtime for a clean-up. 

### Indexing

### Right-sizing your compute

### Optimizing connections

### 