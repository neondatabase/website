---
title: Optimize Postgres query performance
subtitle: Learn about strategies for optimizing Postgres query performance
enableTableOfContents: true
---

Many factors can impact query performance in Postgres, ranging from insufficient indexing and database maintenance to poorly optimized queries or inadequate system resources. With such a wide range of factors, it can be difficult to know where to start. In this topic, we'll look at several strategies you can use to optimize query performance in Postgres.

- [Gather statistics](#gather-statistics)
- [Use indexes](#use-indexes)
- [Use EXPLAIN](#use-explain)
- [Cache your data](#cache-your-data)
- [Check for table or index bloat](#check-for-table-or-index-bloat)
- [Right-size your compute](#right-size-your-compute)
- [Use connection pooling](#use-connection-pooling)
- [Use joins instead of subqueries](#use-joins-instead-of-subqueries)
- [Use efficient data types](#use-efficient-data-types)
- [Limit your result sets](#limit-your-result-sets)

## Gather statistics

Gathering query statistics can aid in identifying performance issues and opportunities for optimization. Neon supports the [pg_stat_statements](/docs/extensions/pg_stat_statements) extension for monitoring and analyzing SQL query performance.

The [pg_stat_statements](/docs/extensions/pg_stat_statements) extension provides aggregated query statistics for executed SQL statements. The data collected includes the number of query executions, total execution time, rows returned by the query, and more. 

This extension isn’t installed by default, so your first step is to install it and then allow some time for statistics collection. To install the extension, run the following `CREATE EXTENSION` statement.

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
Generally, `pg_stat_statements` is found to have a very small performance impact. Many users keep it installed so that it’s available when needed. For a discussion on this topic, please see this [Database Administrators Stack Exchange article](https://dba.stackexchange.com/questions/303503/what-is-the-performance-impact-of-pg-stat-statements).
</Admonition>

After allowing time for statistics collection, you can run queries like these to identify opportunities for query optimization:

### Most frequently executed queries

This query lists the top 100 most frequently executed queries with the executing user and total and average execution time.

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

This query showcases the top 100 queries that return the most rows, ordered by the number of rows returned. It includes the average execution time for each query.

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

## Use indexes

Indexes are crucial for query performance, especially in applications with large tables. They significantly reduce the time required to access data, which can be the difference between a slow application and a fast one.

Suppose that you have a large `users` table like this with millions of rows:

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
```

If you frequently search for users by their username or email, you can create indexes on those columns to improve search performance. For example:

```sql
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

To see if an index was used or to compare execution times with and without an index, you can use `EXPLAIN ANALYZE`. See [Use EXPLAIN](#use-explain).

### View table indexes

You can use the following query to view the indexes defined on a table. You should at least have an index defined on your primary key, and if you know the columns used in your queries, consider adding indexes to those too. However, note that indexes are best suited for columns with high cardinality (a high number of unique values). Postgres might ignore indexes defined on low-cardinality columns, in which case you would be consuming storage space unnecessarily.  

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

This query checks for potential indexing opportunities in a given schema by comparing sequential scans and index scans. The query suggests to "Check indexes" based on whether the number of sequential scans exceeds the number of index scans.

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
The number of index scans has to exceed the number of sequential scans before the missing index check will report "OK" instead of "Check indexes". So, if you add a missing index and rerun a query, don't expect the recommendation to change immediately.
</Admonition>

The `PgHero` utility also supports identifying missing indexes. See [PgHero](/docs/introduction/monitoring#pghero). 

## Use EXPLAIN

`EXPLAIN` provides a detailed report on how a query was executed, including how tables are scanned, execution times, join algorithms, and so on. This information can be used to optimize queries.

`EXPLAIN` has the following syntax:

```sql
EXPLAIN [ ( option [, ...] ) ] statement
```

where `option` can be one of:

```sql
ANALYZE
VERBOSE
COSTS
SETTINGS
GENERIC_PLAN
BUFFERS
WAL
TIMING
SUMMARY
FORMAT { TEXT | XML | JSON | YAML }
```

The `ANALYZE` option executes the SQL statement first and includes actual run times and other statistics in your query plans, so it's helpful to include this option when explaining `SELECT` queries. For other types of statements such as `INSERT`, `UPDATE`, or `DELETE`, which affect your data, you can enclose an `EXPLAIN ANALYZE` statement in a transaction, as shown below. This way, your data will not be changed by the `EXPLAIN ANALYZE` statement.

```sql
BEGIN;
    EXPLAIN ANALYZE sql_statement;
ROLLBACK;
```

For a description of the other `EXPLAIN` options listed above, refer to the [official PostgreSQL EXPLAIN documentation](https://www.postgresql.org/docs/current/sql-explain.html).

The following example demonstrates running `EXPLAIN ANALYZE` on a simple `SELECT` query:

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE id = '1';
                                                       QUERY PLAN                                                       
------------------------------------------------------------------------------------------------------------------------
 Gather  (cost=1000.00..59375.93 rows=1 width=9) (actual time=0.404..6479.494 rows=1 loops=1)
   Workers Planned: 2
   Workers Launched: 2
   ->  Parallel Seq Scan on users  (cost=0.00..58375.83 rows=1 width=9) (actual time=4313.317..6472.025 rows=0 loops=3)
         Filter: (id = 1)
         Rows Removed by Filter: 1833333
 Planning Time: 0.102 ms
 Execution Time: 6479.526 ms
```

In this case, the query plan shows that two parallel workers were launched to run a sequential scan on the `users` table. The presence of a sequential scan and a lengthy execution time indicates an opportunity for optimization, such as adding an index to the `id` column of the `users` table to replace the costly sequential scan with an index scan.

### Interpreting EXPLAIN output

Interpreting `EXPLAIN` output can be a little daunting at first, but you can learn the basics here: [EXPLAIN Basics](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-BASICS).

There are numerous other resources you can draw upon to learn more about leveraging `EXPLAIN` to optimize queries. Here are a few to get you started:

- [Using EXPLAIN — official PostgreSQL documentation](https://www.postgresql.org/docs/current/using-explain.html)
- [Using EXPLAIN — PostgreSQL wiki](https://wiki.postgresql.org/wiki/Using_EXPLAIN). 
- [PostgreSQL EXPLAIN tutorial](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-explain/)

<Admonition type="tip" title="Tips">
- The Neon SQL Editor provides a visual `EXPLAIN` and `ANALYZE` capability, providing query plans in a visual form. See [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
- Regularly run the `ANALYZE` command on your database. This updates statistics, helping Postgres produce better query plans. The Postgres `autovacuum` process, which is enabled in Neon, will automatically issue `ANALYZE` commands whenever the content of a table has changed sufficiently, but if you're working with very large tables, this may not happen as often as expected. For a query that shows when vacuum or autovacuum was last run, see [VACUUM and ANALYZE statistics](/docs/postgres/query-reference#vacuum-and-analyze-statistics).
</Admonition> 

## Cache your data

A cache hit ratio tells you the percentage of queries served from memory. Queries not served from memory retrieve data from disk, which is more costly and can result in slower query performance.

In a standalone Postgres instance, you can query the cache hit ratio with an SQL statement that looks for `shared buffers` block hits. In Neon, it’s a little different. Neon extends Postgres shared buffers with a local file cache (local to your Neon compute instance). To query your cache hit ratio in Neon, you need to look at local file cache hits instead of shared buffer hits.

<Admonition type="note">
This `neon_stat_file_cache` view and the `neon` extension that provides it are not yet available in Neon. You can expect it to be released soon.
</Admonition>

To enable querying local file cache statistics, Neon provides a `neon_stat_file_cache` view. To access this view, you need to install the `neon` extension:

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

To increase available memory for a POstgres instance in Neon, you can increase the size of your compute. Larger computes have larger local file caches. For information about selecting an appropriate compute size in Neon, refer to [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

Remember that the local file cache statistics are for the entire compute, not specific databases or tables. A Neon compute runs an instance of Postgres, which can have multiple databases and tables.

<Admonition type="note">
The cache hit ratio query is based on statistics that represent the lifetime of your Postgres instance, from the last time you started it until the time you ran the query. Statistics are lost when your instance stops and gathered again from scratch when your instance restarts. In Neon, your compute runs Postgres, so starting and stopping a compute also starts and stops Postgres. Additionally, you'll only want to run the cache hit ratio query after a representative workload has been run. For example, say that you restart Postgres. In this case, you should run a representative workload before you try the cache hit ratio query again to see if your cache hit ratio improved. Optionally, to help speed up the process, you can use the [pg_prewarm](/docs/extensions/pg_prewarm) extension to pre-load data into memory after a restart. 
</Admonition>

## Check for table or index bloat

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

To reduce table bloat, you can run the [VACUUM](https://www.postgresql.org/docs/current/sql-vacuum.html) command. `VACUUM` cleans up these obsolete records and makes space available for reuse within the table. 

```sql
VACUUM your_table_name;
```

For more aggressive space reclamation, you can use `VACUUM FULL`, but this command locks the table, which can be disruptive — affecting database performance significantly.

To remove index bloat, you can use the [REINDEX](https://www.postgresql.org/docs/current/sql-reindex.html) command, which rebuilds the index from scratch. Be aware that this can be an intensive operation, especially for large indexes, as it requires an exclusive lock on the index.

This command rebuilds all indexes on the specified table:

```sql
REINDEX TABLE your_table_name;
```

Generally, you’ll want to perform vacuum and reindex operations when they will have the least impact, or you’ll want to plan some maintenance downtime to run them. 

## Right-size your compute

The size of your compute determines the amount of memory available to cache your frequently accessed data and the maximum number of simultaneous connections you can support. As a result, if your compute size is too small, this can lead to suboptimal query performance and connection limit issues. 

For information about right-sizing your compute in Neon, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

## Use connection pooling

Connection pooling improves performance by minimizing the overhead associated with creating and tearing down database connections. Neon uses PgBouncer to provide connection pooling support, enabling up to 10,000 concurrent connections. 

Enabling connection pooling in Neon requires adding a `-pooler` option to your Neon connection string (to the Neon hostname), as shown here:

```plaintext
postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

Alternatively, you can grab a pooled connection string from the **Connection Details** widget on the Neon Dashboard.

For more information about connection pooling in Neon, see [Connection pooling](/docs/connect/connection-pooling).

## Use prepared statements

Prepared statements are another way you can optimize query performance. They let you prepare a query plan once and use it multiple times, which minimizes processing time for repetitive query execution. 

For example, imagine you need to fetch all users from a database with a given name:

```sql
SELECT * FROM users WHERE name = 'alex';
```

To enhance performance when running this type of, you can use a prepared statement, as shown here:

```sql
PREPARE user_fetch_plan (text) AS SELECT * FROM users WHERE name = $1;
EXECUTE user_fetch_plan('alex');
EXECUTE user_fetch_plan('dana');
```

### Use joins instead of subqueries

Optimizing subqueries can significantly enhance the performance of your database queries. Consider a situation where you need to fetch all orders for customers residing in a specific country:

```sql
SELECT * FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE country = 'Spain');
```

This approach uses a subquery to identify customer IDs based in Spain. To optimize, you can transform this query into a `JOIN` operation:

```sql
SELECT orders.* FROM orders JOIN customers ON orders.customer_id = customers.id WHERE customers.country = 'Spain';
```

Joins are generally more efficient because they replace multiple queries with one join query, reducing the number of trips to the database.

### Use efficient data types

Generally, you should avoid selecting a data type that is larger than necessary. 

Postgres offers a range of numeric types, including `INTEGER`, `NUMERIC`, `REAL`, and `DOUBLE PRECISION`. Each has its use case, but `INTEGER` types are often sufficient for counts and identifiers and use less space than floating-point types.

If you’re storing small integers, you can use the `SMALLINT` type instead of `INTEGER` or `BIGINT`, as it uses less space.

For example, imagine a scenario where your `users` table includes an `age` column. If operations such as computing the average age of users are common, you can optimize database efficiency by switching to a more compact data type, such as `SMALLINT` instead of the standard `INTEGER`:

```sql
ALTER TABLE users ALTER COLUMN age TYPE SMALLINT;
```

This change decreases the memory footprint for storing `age` data, potentially improving the performance of queries that operate on that data.

### Limit your result sets

Consider a scenario where you're fetching all entries from an `orders` table with the query:

```sql
SELECT * FROM orders;
```

This approach might become inefficient and consume considerable resources when working with a large table. To optimize this query, you can add the `LIMIT` clause to restrict the output to a specific number of rows. For example:

```sql
SELECT * FROM orders LIMIT 100;
```

By doing so, you ensure that the database retrieves only a manageable subset of records, improving the query's performance and reducing the load on the database.
