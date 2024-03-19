---
title: Optimizing query performance
subtitle: Learn about strategies for optimizing Postgres query performance in Neon
enableTableOfContents: true
---

Many factors can impact query performance in Postgres, ranging from insufficient indexing or database maintenance to poorly optimized queries or inadequate system resources. With such a wide range of factors, where do you start? This topic outlines several strategies for optimizing query performance in Postgres.

## Use indexes

Indexes are crucial for query performance, especially in applications dealing with large tables. They significantly reduce the time required to access data, which can be the difference between a slow application and a fast one.

Suppose that you have a large `users` table like this with several million rows:

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
```

If you frequently search for users by their username or email, you might want to create indexes on those columns to improve search performance:

```sql
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### View table indexes

You can use the following query to view the indexes defined on a table. You should at least have an index defined on your primary key, and if you know the columns used in your queries, consider adding indexes to those too. However, note that indexes are best suited to columns with high cardinality (a high number of unique values). Postgres might ignore indexes defined on low-cardinality columns, in which case you would be consuming storage space unnecessarily.  

```sql
SELECT
    tablename AS table_name,
    indexname AS index_name,
    indexdef AS index_definition
FROM
    pg_indexes
WHERE
    tablename = 'your_table_name' -- replace 'your_table_name' with the actual table name
    AND schemaname = 'public'; -- adjust the schema name as necessary
```

### Check for missing indexes

This query checks for potential indexing opportunities in a given schema by comparing sequential scans and index scans. The query suggests whether to "Check indexes" based on whether the number of sequential scans exceeds the number of index scans (if any). It prioritizes tables with a higher discrepancy between sequential and index scans and limits the results to the top 10 tables for a quick review.

```sql
SELECT
  relname AS table_name,
  CASE
    WHEN seq_scan > COALESCE(idx_scan, 0) THEN 'Check indexes'
    ELSE 'OK'
  END AS recommendation
FROM
  pg_stat_user_tables
WHERE
  schemaname = 'public' -- Adjust as necessary for your schema
ORDER BY
  (seq_scan - COALESCE(idx_scan, 0)) DESC
LIMIT 10; -- Adjust as necessary for the number of results
```

A "Check indexes" recommendation appears similar to the following:

```sql
 table_name | recommendation 
------------+----------------
 users      | Check indexes
```

<Admonition type="note">
Please note that statistics are cumulative for the lifetime of your compute instance. The number of index scans has to exceed the number of sequential scans before the missing index check will report "OK" instead of "Check indexes". So, if you add a missing index and rerun a query, don't expect the recommendation to change immediately.
</Admonition>

The `PgHero` utility also supports identifying missing indexes. See [PgHero](/docs/introduction/monitoring#pghero). 

## Collect query statistics

A good first step is to make sure you are gathering statistics that can aid in identifying performance issues. Neon supports the [pg_stat_statements](/docs/extensions/pg_stat_statements) extension for monitoring and analyzing SQL query performance.

The [pg_stat_statements](/docs/extensions/pg_stat_statements) extension provides aggregated query statistics for executed SQL statements. The data collected includes the number of query executions, total execution time, rows returned by the query, and much more. 

This extension isn’t installed by default, so your first step is to install it and allow some time for statistics collection. To install the extension, run the following `CREATE EXTENSION` statement.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

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
```

For a description of each metric, refer to the official Postgres documentation: [The pg_stat_statements View](https://www.postgresql.org/docs/current/pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS).

<Admonition type="note" title="WHAT’S THE PERFORMANCE IMPACT OF PG_STAT_STATEMENTS?">
Generally, `pg_stat_statements` is found to have a very small performance impact, and many users will keep it installed so that it’s available when needed. For a discussion on this topic, please see this [Database Administrators Stack Exchange article](https://dba.stackexchange.com/questions/303503/what-is-the-performance-impact-of-pg-stat-statements).
</Admonition>

After allowing time for statistics collection, you can run queries like these to identify queries that are candidates for optimization:

### Most frequently executed queries

This query ranks the top 100 most frequently executed queries in the database, detailing each query's executing user, total and average execution times, to identify potential areas for query optimization and performance improvement.

```sql
SELECT
  userid,
  query,
  calls,
  total_exec_time / 1000 AS total_seconds,
  mean_exec_time AS avg_ms
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 100;
```

### Long-running queries

This query identifies the top 100 queries with the longest average execution time across all users, including execution frequency and the executing user's ID.

```sql
SELECT 
    userid,
    query,
    calls, 
    mean_exec_time
FROM 
    pg_stat_statements
ORDER BY 
    mean_exec_time DESC
LIMIT 100;
```

### Queries that return the most rows

This query showcases the top 100 queries that yield the most rows, ordered by the number of rows returned. It includes the average execution time for each query, providing insights into the queries that not only return significant amounts of data but also their efficiency, aiding in database performance optimization.

```sql
SELECT 
    query, 
    rows, 
    mean_exec_time
FROM 
    pg_stat_statements
ORDER BY 
    rows DESC
LIMIT 
    100;
```

## Use EXPLAIN ANALYZE

The EXPLAIN statement provides the execution plan that the Postgres planner creates for a query.

The plan shows how tables that are accessed by a query are scanned — by an index scan, sequential scan, etc. If the query access more than one table, the plan shows what join algorithm is used.

The key information provided by EXPLAIN includes the start-cost before the first row can be returned and the total cost to return the result set.

### How to use EXPLAIN

To use `EXPLAIN`, prefix it to your SQL query like so:

```sql
EXPLAIN SELECT * FROM your_table WHERE condition = 'value';
```

This command will not return the query's result set but will instead provide a detailed report on how the query was executed, including the time taken for each operation.

### Interpreting the output

The output of `EXPLAIN ANALYZE` can be complex, but there are key elements to focus on:

- **Query Plan**: This shows the steps PostgreSQL took to execute your query, such as sequential scans, index scans, joins, etc.
- **Execution Time**: The total time taken to execute the query.
- **Costs**: Estimated startup cost and total cost to execute the plan, which helps in comparing the efficiency of different execution strategies.
- **Rows**: The number of rows processed at each stage of the query.
- **Actual Time**: Shows the actual time spent on each node of the plan, helping to pinpoint slow operations.

### Tips for optimization

1. **Look for Sequential Scans**: If your query involves large tables, sequential scans can be slow. Consider using indexes to speed up data retrieval.
2. **Analyze Joins**: Make sure that joins are using indexes. If not, it might be beneficial to add indexes or revise the join conditions.
3. **Optimize Filters**: Check if the conditions in the WHERE clause can be optimized. Using efficient indexes can dramatically reduce the search space.
4. **Subquery Performance**: Subqueries can sometimes be inefficient. Look for opportunities to rewrite them as joins or to simplify them.
5. **Use ANALYZE**: Regularly run the ANALYZE command on your database. This updates statistics, helping Postgres make better planning decisions.

### Additional resources

Optimizing queries using `EXPLAIN ANALYZE` is a large topic, with many resources you can draw upon. Here are a few of those resources to help you get started:

- [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), in the official PostgreSQL documentation:
- [Using EXPLAIN](https://wiki.postgresql.org/wiki/Using_EXPLAIN). This topic provides links to a variety of resources and tutorials.
- [Postgres Explain Visualizer](https://www.pgexplain.dev/)


## Cache optimization

A cache hit ratio tells you what percentage of queries are served from memory. Queries not served from memory retrieve data from disk, which is more costly and can result in slower query performance.

In a standalone Postgres instance, you can query the cache hit ratio with an SQL statement that looks for `shared buffers` block hits. In Neon, it’s a little different. Neon extends Postgres shared buffers with a local file cache (local to your Neon compute instance). To query your cache hit ratio in Neon, you need to look at local file cache hits instead of shared buffer hits. 

To enable querying local file cache statistics, Neon provides a `neon_stat_file_cache` view. To access this view, you must first install the neon extension:

```sql
CREATE EXTENSION neon;
```

After allowing time for statistics collection, you can issue the following query to view your cache hit ratio:

```sql
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

To increase available memory in Neon, you can increase the size of your compute. Larger computes have larger local file caches. For information about selecting an appropriate compute size in Neon, refer to [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

Remember that the local file cache statistics are for the entire compute, not specific databases or tables. A Neon compute runs an instance of Postgres, which can have multiple databases and tables.

<Admonition type="note">
The cache hit ratio query is based on statistics that represent the lifetime of your Postgres instance, from the last time you started it until the time you ran the query. Statistics are lost when your instance stops and gathered again from scratch when your instance restarts. In Neon, your compute runs Postgres, so starting and stopping a compute also starts and stops Postgres. Additionally, you'll only want to run the cache hit ratio query after a representative workload has been run. For example, say that you restart Postgres. In this case, you should run a representative workload before you try the cache hit ratio query again to see if your cache hit ratio improved. Optionally, to help speed up the process, you can use the [pg_prewarm](/docs/extensions/pg_prewarm) extension to pre-load data into memory after a restart. 
</Admonition>



## Checking for table or index bloat

If there is some issue with Postgres [autovacuum](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM), this can lead to table and index bloat. 

Bloat refers to the condition where tables and indexes occupy more space on disk than is necessary for storing the data. Bloat can occur over time due to the way Postgres handles updates and deletes.

### Table Bloat

When a row is updated, the database doesn’t overwrite the existing row. Instead, it just marks the old row version as obsolete and creates a new version of the row elsewhere in the table. Similarly, when a row is deleted, it is not immediately removed; it’s just marked as deleted. The space occupied by these obsolete or deleted rows contributes to table bloat.

This mechanism supports Postgres MVCC (Multi-Version Concurrency Control), allowing for more efficient query processing without locking rows for reading. However, the downside is that it can lead to wasted space and decreased performance over time as the table grows larger than necessary.

### Index Bloat

Indexes can also experience bloat. As rows are updated and deleted, the indexes that point to those rows can become inefficient. Index bloat happens because, similar to tables, indexes also retain pointers to obsolete row versions. Over time, the index can grow larger, consuming more space than necessary.

Index bloat can degrade the performance of read operations. Since indexes are used to speed up data retrieval, a bloated index can have the opposite effect, making queries slower.

### Checking for bloat

There are SQL queries you can run to check for table and index bloat. There are several good sources for bloat check queries, including these:

- [Show database bloat – PostgreSQL wiki](https://wiki.postgresql.org/wiki/Show_database_bloat)
- [Index and table bloat check scripts from PostgreSQL Experts](https://github.com/pgexperts/pgx_scripts/tree/master/bloat)

### Reducing bloat

To reduce table bloat, you can run the [VACUUM](https://www.postgresql.org/docs/current/sql-vacuum.html) command. `VACUUM` cleans up these obsolete records and makes space available for reuse within the table. For more aggressive space reclamation, you can use `VACUUM FULL`, but this command locks the table, which can be disruptive.

To remove index bloat, you can use the [REINDEX](https://www.postgresql.org/docs/current/sql-reindex.html) command, which rebuilds the index from scratch. Be aware that this can be an intensive operation, especially for large indexes, as it requires an exclusive lock on the index.

Generally, you’ll want to perform these types of operations when it will have the least impact, or you’ll want to plan some maintenance downtime for a clean-up. 





## Right-sizing your compute

The size of your compute determines the amount of memory available to cache your frequently accessed data and the maximum number of simultaneous connections you can support. As a result, if your compute size is too small, this can lead to suboptimal query performance and connection limit issues. 

For infomration about right-sizing your compute in Neon, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

## Optimizing connections

### 