---
title: Performance optimization in Postgres
subtitle: Learn about strategies for optimizing Postgres performance in Neon
enableTableOfContents: true
---


Many factors that can impact the performance of your Postgres database, ranging from insufficient indexing or database maintenance to poorly optimized queries or inadequate system resources. With such a wide range of factors, where do you start? This topic outlines several strategies for optimizing the performance of your Postgres database.

## Collecting statistics

A good first step is to make sure you are gathering statistics that can aid in identifying performance issues.

In addition to the Postgres [Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html), where Postgres collects and reports information about server activity, Neon supports the [pg_stat_statements](/docs/extensions/pg_stat_statements) extension for monitoring and analyzing SQL query performance.

The [pg_stat_statements](/docs/extensions/pg_stat_statements) extension provides aggregated query statistics for executed SQL statements. The data collected includes the number of query executions, total execution time, rows returned by the query, and much more. 

This extension isn’t installed by default, so your first step is to install it and allow some time for data collection. To install the extension, run the following `CREATE EXTENSION` statement.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

You can do this from the Neon SQL Editor or a Postgres client such as `psql` that is connected to your database.

Once installed, you can run the following query to view the types of data that pg_stat_statements `collects:

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

For a description of each metric, you can refer to the official Postgres documentation: [The pg_stat_statements View](https://www.postgresql.org/docs/current/pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS).

<Admonition type="note" title="WHAT’S THE PERFORMANCE IMPACT OF PG_STAT_STATEMENTS?">
Generally, pg_stat_statements is found to have a very small impact, and many users will keep it installed so that it’s available when needed. For a discussion on this topic, please see this [Database Administrators Stack Exchange article](https://dba.stackexchange.com/questions/303503/what-is-the-performance-impact-of-pg-stat-statements).
</Admonition>

After allowing time for statistics to be collected, you can run queries like these to start gathering data about your queries.

### Long-running queries

This `pg_stat_statements` query returns the longest-running queries by mean execution time.

```
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
LIMIT 10;
```


There are many other useful queries you can run with pg_stat_statements, which you can find online and in our [pg_stat_statements guide](/docs/extensions/pg_stat_statements). 

Long-running queries are candidates for optimization. As a next step, you can run `EXPLAIN (ANALYZE)` on each to identify opportunities for optimization, such as full table scans or inefficient joins.



## Optimizing query performance

### Using EXPLAIN ANALYZE

### Cache optimization

### Slow queries

### Right-sizing your compute

### 