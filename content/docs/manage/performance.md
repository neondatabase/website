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

Let's take a simple table like this one:

```sql
CREATE TABLE users (id serial, name text);
```

You might want to query users by id to find information or to check if a user exists. For example:

```sql
SELECT * FROM users WHERE id = '2';
```

If you run a query like this without an index, the response time will be high because the query will scan all records in the table. You can verify this by inserting some data into our exmaple table. The following queries insert 5.5 million rows:

```sql
INSERT INTO users (name) SELECT 'alex' FROM generate_series(1,2750000);
INSERT INTO users (name) SELECT 'dana' FROM generate_series(1,2750000);
```

After inserting this much data, it's a good idea to run `ANALYZE` to ensure that optimizer statistics are up to date. The optimizer requires the statistics to determine the best query plan, including whether or not to use an index. We'll run `ANALYZE VERBOSE` on the `user` table to see what it does.

```sql
INFO:  analyzing "public.users"
INFO:  "users": scanned 29730 of 29730 pages, containing 5500000 live rows and 0 dead rows; 30000 rows in sample, 5500000 estimated total rows
ANALYZE
```

As you can see below, without any index defined, the query will be executed using a `Parallel Seq Scan`, and the execution time for that plan is very high.

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE id = '2';
                                                       QUERY PLAN                                                       
Gather  (cost=1000.00..59375.93 rows=1 width=9) (actual time=2.087..5952.280 rows=1 loops=1)
   Workers Planned: 2
   Workers Launched: 2
   ->  Parallel Seq Scan on users  (cost=0.00..58375.83 rows=1 width=9) (actual time=3961.255..5943.782 rows=0 loops=3)
         Filter: (id = 2)
         Rows Removed by Filter: 1833333
 Planning Time: 2.960 ms
 Execution Time: 5952.310 ms
(8 rows)
```

Let's compare after creating an index:

```sql
CREATE INDEX idx_user_id on users (id);
```

Now, try the explain query once more. As shown below, the scan is performed `using idx_user_id on users` and the execution time is significantly better.

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE id = '2';
                                                    QUERY PLAN                                                     
-------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_user_id on users  (cost=0.43..8.45 rows=1 width=9) (actual time=0.034..0.035 rows=1 loops=1)
   Index Cond: (id = 2)
 Planning Time: 3.634 ms
 Execution Time: 0.064 ms
(4 rows)
```

The example above demonstrates how indexes can improve query performance. However, it is important to remember that indexes are not free. They take up storage space and can impact write performance, as you now need to write to the index in addition to the table when you modify data in your table. To compare the size of your table to the size of your index, you can run the following commands:

Table size:

```sql
\dt+
                                     List of relations
 Schema | Name  | Type  |    Owner     | Persistence | Access method |  Size  | Description 
--------+-------+-------+--------------+-------------+---------------+--------+-------------
 public | users | table | neondb_owner | permanent   | heap          | 232 MB | 
```

Index size:

```sql
\di+
                                            List of relations
 Schema |    Name     | Type  |    Owner     | Table | Persistence | Access method |  Size  | Description 
--------+-------------+-------+--------------+-------+-------------+---------------+--------+-------------
 public | idx_user_id | index | neondb_owner | users | permanent   | btree         | 118 MB | 
```

As you can see above, the index is more than half the table size. The amount of storage required for your indexes should always be considered when evaluating whether a particular index is worth the performance benefit.

### When to use indexes

- 


## Right-sizing your compute

The size of your compute determines the amount of memory available to cache your frequently accessed data and the maximum number of simultaneous connections you can support. As a result, if your compute size is too small, this can lead to suboptimal query performance and connection limit issues. 

For infomration about right-sizing your compute in Neon, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

## Optimizing connections

### 