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

This extension isn’t installed by default, so your first step is to install it and allow some time for statistics collection. To install the extension, run the following `CREATE EXTENSION` statement.

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
```

For a description of each metric, refer to the official Postgres documentation: [The pg_stat_statements View](https://www.postgresql.org/docs/current/pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS).

<Admonition type="note" title="WHAT’S THE PERFORMANCE IMPACT OF PG_STAT_STATEMENTS?">
Generally, `pg_stat_statements` is found to have a very small performance impact, and many users will keep it installed so that it’s available when needed. For a discussion on this topic, please see this [Database Administrators Stack Exchange article](https://dba.stackexchange.com/questions/303503/what-is-the-performance-impact-of-pg-stat-statements).
</Admonition>

After allowing time for statistics to be collected, you can run queries like these to identify queries that are candidates for optimization:

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

In Neon, it’s a little different. Neon extends Postgres shared buffers with a local file cache (local to your Neon compute instance).To query your cache hit ratio in Neon, you need to look at local file cache hits instead of shared buffer hits. 

### The neon_stat_file_cache view

<Admonition type="note">
This feature is not yet available in Neon. You can expect it to be released soon.
</Admonition>

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

If it’s a lack of memory, you can consider allocating more. In Postgres, this requires increasing your shared_buffers setting, assuming your system has memory resources to support it. In Neon, `shared_buffers` is always set to 128 MB. To increase available memory in Neon, you can increase the size of your compute. Larger computes have larger local file caches. For information about selecting an appropriate compute size in Neon, refer to [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

Remember that the local file cache statistics are for the entire compute, not specific databases or tables. A Neon compute runs an instance of Postgres, which can have multiple databases and tables.

<Admonition type="note">
The cache hit ratio query is based on statistics that represent the lifetime of your Postgres instance, from the last time you started it until the time you ran the query. Statistics are lost when your instance stops and gathered again from scratch when your instance restarts. In Neon, your compute runs Postgres, so starting and stopping a compute also starts and stops Postgres. Additionally, you'll only want to run the cache hit ratio query after a representative workload has been run. For example, say that you restart Postgres. In this case, you should run a representative workload before you try the cache hit ratio query again to see if your cache hit ratio improved. Optionally, to help speed up the process, you can use the pg_prewarm extension to pre-load data into memory after a restart. 
</Admonition>

## Optimizing queries with EXPLAIN ANALYZE

Using `EXPLAIN ANALYZE` in Postgres can help you optimize queries by providing insights into how the database executes a query. It shows the execution plan of an SQL query. This plan details how the PostgreSQL planner and optimizer interpret your query, including the paths taken to retrieve the data, the cost of each operation, and the time each step takes, which can help you identify bottlenecks or inefficiencies in query execution.

### How to use EXPLAIN ANALYZE

To use `EXPLAIN ANALYZE`, prefix it to your SQL query like so:

```sql
EXPLAIN ANALYZE SELECT * FROM your_table WHERE condition = 'value';
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

## Indexing

Indexes are crucial for enhancing database performance, especially in applications dealing with large volumes of data. They significantly reduce the time required to access data, which can be the difference between a slow application and a fast one.

### Creating an index

PostgreSQL supports different types of indexes, each designed for specific scenarios, but the most common type, used for queries involving comparisons (<, <=, =, >=, >), is the B-tree index. 

Let's take this table for example: 

```sql
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    registration_date DATE NOT NULL
);
```

You might want to query users by customer name to find customer information or to check if a user exists. For example:

```sql
SELECT * FROM customer WHERE name = 'John Doe';
```

Creating a B-tree index on the name column can significantly improve the performance of these queries. The B-tree index is efficient for operations involving comparisons, making it an ideal choice for this scenario.

WWithout an index, PostgreSQL must perform a full table scan to find records matching the query condition, which becomes increasingly inefficient as the size of the table grows.

To create a B-tree index on the `name` column of the customer table, you use the `CREATE INDEX` statement as follows:

```sql
CREATE INDEX idx_customer_name ON customer (name);
```

This SQL command instructs Postgres to create a B-tree index (the default type if not specified) named `idx_customer_name` on the name column in the customer table. Once created, Postgres will automatically use this index to speed up queries that search or filter by the name column.

After creating the index, if you run a query like the one below to find a customer by name, Postgres can utilize the `idx_customer_name` index to quickly locate the record:

```sql
SELECT * FROM customer WHERE name = 'John Doe';
```

Instead of scanning the entire table, PostgreSQL can now navigate the B-tree structure to find 'John Doe' more efficiently.

### Monitoring index usage

To ensure that your index is being used, you can analyze query performance using the `EXPLAIN` command. By prefixing your query with `EXPLAIN`, Postgres will return a plan showing how the query will be executed, including whether the index is utilized:

```sql
EXPLAIN SELECT * FROM customer WHERE name = 'John Doe';
```

Look for the `Index Scan`` or `Bitmap Heap Scan` on `idx_customer_name` in the plan output, indicating that the index is effectively supporting the query.

## Right-sizing your compute

## Optimizing connections

### 