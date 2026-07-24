---
title: 'Postgres Support Recap: Investigating Postgres Query Performance'
description: Where to begin when your Postgres queries start to perform poorly
excerpt: >-
  Neon Support often receives support tickets related to Postgres query
  performance. Such issues could result from a myriad of factors ranging from
  missing indexes or lack of database maintenance to ineffective queries and
  joins or system resource limitations. Where should you star...
date: '2024-02-29T16:54:40'
updatedOn: '2024-04-02T18:51:25'
category: postgres
categories:
  - postgres
authors:
  - daniel-price
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-support-recap-investigating-postgres-query-performance/cover.png
  alt: null
isFeatured: false
seo:
  title: 'Postgres Support Recap: Investigating Postgres Query Performance - Neon'
  description: Where to begin when your Postgres queries start to perform poorly
  keywords: []
  noindex: false
  ogTitle: 'Postgres Support Recap: Investigating Postgres Query Performance - Neon'
  ogDescription: >-
    Neon Support often receives support tickets related to Postgres query
    performance. Such issues could result from a myriad of factors ranging from
    missing indexes or lack of database maintenance to ineffective queries and
    joins or system resource limitations. Where should you start when trying to
    get to the bottom of an issue with such a […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-support-recap-investigating-postgres-query-performance/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-support-recap-investigating-postgres-query-performance/image-5-1024x576-39ac3b58.png)

Neon Support often receives support tickets related to Postgres query performance. Such issues could result from a myriad of factors ranging from missing indexes or lack of database maintenance to ineffective queries and joins or system resource limitations. Where should you start when trying to get to the bottom of an issue with such a wide range of potential causes? In this **Postgres Support Recap**, we outline three strategies we often recommend and ones you can use in your Postgres query performance investigations.

Specifically, we’ll take a look at these strategies:

- [Analyzing query performance with pg_stat_statements](https://neon.tech/blog/postgres-support-recap-investigating-postgres-query-performance#strategy-1-analyzing-query-performance-with-pgstatstatements)
- [Checking your cache hit ratio](https://neon.tech/blog/postgres-support-recap-investigating-postgres-query-performance#strategy-2-checking-your-cache-hit-ratio)
- [Checking for table or index bloat](https://neon.tech/blog/postgres-support-recap-investigating-postgres-query-performance#strategy-3-checking-for-table-or-index-bloat)

For those who prefer a visual monitoring tool over running SQL queries, we’ll finish off this post by introducing a free and open-source Postgres query monitoring and analysis application called [PgHero](https://neon.tech/blog/postgres-support-recap-investigating-postgres-query-performance#pghero-a-performance-dashboard-for-postgres).

Without further ado, let’s get started!

## Strategy 1: Analyzing query performance with pg_stat_statements

`pg_stat_statements` is an open-source Postgres extension for monitoring and analyzing SQL query performance. It provides aggregated query statistics for executed SQL statements. The data collected includes the number of query executions, total execution time, rows returned by the query, and much more.

This extension isn’t installed by default, so your first step is to install it and allow some time for data collection. To install the extension, you can run the following `CREATE EXTENSION` statement in a Postgres client such as [`psql`](https://neon.tech/docs/connect/query-with-psql-editor) that is connected to your database.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Once installed, you can run the following query to view the types of data that `pg_stat_statements` collects:

```bash
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
 shared_blks_hit        | bigint           |           |          | 
 shared_blks_read       | bigint           |           |          | 
 shared_blks_dirtied    | bigint           |           |          | 
 shared_blks_written    | bigint           |           |          | 
 local_blks_hit         | bigint           |           |          | 
 local_blks_read        | bigint           |           |          | 
 local_blks_dirtied     | bigint           |           |          | 
 local_blks_written     | bigint           |           |          | 
 temp_blks_read         | bigint           |           |          | 
 temp_blks_written      | bigint           |           |          | 
 blk_read_time          | double precision |           |          | 
 blk_write_time         | double precision |           |          | 
 temp_blk_read_time     | double precision |           |          | 
 temp_blk_write_time    | double precision |           |          | 
 wal_records            | bigint           |           |          | 
 wal_fpi                | bigint           |           |          | 
 wal_bytes              | numeric          |           |          | 
 jit_functions          | bigint           |           |          | 
 jit_generation_time    | double precision |           |          | 
 jit_inlining_count     | bigint           |           |          | 
 jit_inlining_time      | double precision |           |          | 
 jit_optimization_count | bigint           |           |          | 
 jit_optimization_time  | double precision |           |          | 
 jit_emission_count     | bigint           |           |          | 
 jit_emission_time      | double precision |           |          |
```

For a description of each metric, you can refer to the official Postgres documentation: [The `pg_stat_statements` View](https://www.postgresql.org/docs/current/pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS).

<Admonition type="note" title="What’s the performance impact of pg_stat_statements?">
Generally, `pg_stat_statements` is found to have a very small impact, and many users will keep it installed so that it’s available when needed. For a discussion on this topic, please see this [Database Administrators Stack Exchange article](https://dba.stackexchange.com/questions/303503/what-is-the-performance-impact-of-pg-stat-statements).
</Admonition>

After allowing time for statistics to be collected, you can run queries like this one to start gathering data about your queries.

### Long-running queries

This `pg_stat_statements` query returns the longest-running queries by mean execution time.

```sql
WITH statements AS (
    SELECT*
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

Long-running queries are candidates for optimization. As a next step, you can run [`EXPLAIN (ANALYZE)`](https://www.postgresql.org/docs/current/sql-explain.html) on each to identify opportunities for optimization, such as full table scans or inefficient joins.

There are many other useful queries you can run with `pg_stat_statements`, which you can find online and in our [`pg_stat_statements` guide](https://neon.tech/docs/extensions/pg_stat_statements).

## Strategy 2: Checking your cache hit ratio

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

In Neon, it’s a little different. Neon extends Postgres shared buffers with a **local file cache** (local to your Neon compute instance), so in order to query your cache hit ratio in Neon, you need to look at local file cache hits instead of shared buffer hits.

### The neon_stat_file_cache view

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

```bash
file_cache_hit_ratio = (file_cache_hits / (file_cache_hits + file_cache_misses)) * 100
```

If the `file_cache_hit_ratio` is below 99%, your working set (your most frequently accessed data) may not be adequately in memory. This could be due to your Postgres instance not having sufficient memory.

If it’s a lack of memory, you can consider allocating more. In Postgres, this requires increasing your shared_buffers setting, assuming your system has memory resources to support it. In Neon, shared_buffers is always set to 128 MB. To increase available memory in Neon, you can increase the size of your compute. Larger computes have larger local file caches. For information about selecting an appropriate compute size in Neon, please refer to [How to size your compute](https://neon.tech/docs/manage/endpoints#how-to-size-your-compute).

Please remember that the local file cache statistics are for the entire compute, not specific databases or tables. A Neon compute runs an instance of Postgres, which can have multiple databases and tables.

<Admonition type="note">
The cache hit ratio query is based on statistics that represent the lifetime of your Postgres instance, from the last time you started it until the time you ran the query. Statistics are lost when your instance stops and gathered again from scratch when your instance restarts. In Neon, your compute runs Postgres, so starting and stopping a compute also starts and stops Postgres. Additionally, you'll only want to run the cache hit ratio query after a representative workload has been run. For example, say that you restart Postgres. In this case, you should run a representative workload before you try the cache hit ratio query again to see if your cache hit ratio improved. Optionally, to help speed up the process, you can use the [pg_prewarm](https://neon.tech/docs/extensions/pg_prewarm) extension to pre-load data into memory after a restart.
</Admonition>

## Strategy 3: Checking for table or index bloat

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

To reduce table bloat, you can run the [VACUUM](https://www.postgresql.org/docs/current/sql-vacuum.html) command. VACUUM cleans up these obsolete records and makes space available for reuse within the table. For more aggressive space reclamation, you can use VACUUM FULL, but this command locks the table, which can be disruptive.

To remove index bloat, you can use the [REINDEX](https://www.postgresql.org/docs/current/sql-reindex.html) command, which rebuilds the index from scratch. Be aware that this can be an intensive operation, especially for large indexes, as it requires an exclusive lock on the index.

Generally, you’ll want to perform these types of operations when it will have the least impact, or you’ll want to plan some maintenance downtime for a clean-up.

## PgHero: A Performance Dashboard for Postgres

[PgHero](https://github.com/ankane/pghero) is described as a performance dashboard for Postgres, and for anyone looking for a free and open-source monitoring tool, it’s a good alternative to running SQL queries from the command line.

### What does PgHero provide?

A quick look at the interface gives you an idea of what you’ll find in PgHero.

Among other things, you can use PgHero to:

- Identify long-running queries
- Identify tables that require vacuuming
- Identify duplicate or missing indexes
- View connections by database and user
- Explain, analyze, and visualize queries

### How to install PgHero

PgHero supports installation with [Docker](https://github.com/ankane/pghero/blob/master/guides/Docker.md), [Linux](https://github.com/ankane/pghero/blob/master/guides/Linux.md), and [Rails](https://github.com/ankane/pghero/blob/master/guides/Linux.md). Here, we’ll show how to install PgHero with Docker and connect it to a Neon database.

Before you begin:

- Ensure that you have the pg_stat_statements extension installed. PgHero uses it for query stats. See [above](https://docs.google.com/document/d/13pEjK5dVZ9npuc4SnNl-xvyvmNLQh2xmr3uvniiBkew/edit#heading=h.pualuj35db6l).
- Ensure that you have Docker installed. See [Install Docker Engine](https://docs.docker.com/engine/install/) for instructions.

PgHero is available on [DockerHub](https://hub.docker.com/r/ankane/pghero/). To install it, run:

```bash
docker pull ankane/pghero
```

Next, grab your Neon database connection string from the **Connection Details** widget in the Neon Dashboard.

Finally, run this command, replacing $NEON_DB with your Neon database connection string.

```bash
docker run -ti -e DATABASE_URL='$NEON_DB' -p 8080:8080 ankane/pghero
```

Then visit [https://localhost:8080](https://localhost:8080/) in your browser to open the PgHero Dashboard.

## Conclusion

In summary, managing and troubleshooting Postgres query performance can involve a variety of strategies. We’ve covered a few of them in this post, including using the `pg_stat_statements` extension to analyze query performance, evaluating your cache hit ratio, addressing table and index bloat, and utilizing tools like PgHero. We hope you find these strategies helpful in your own query performance investigations.<br />As always, thanks for reading and stay tuned for the next ** _Postgres Support Recap_**!
