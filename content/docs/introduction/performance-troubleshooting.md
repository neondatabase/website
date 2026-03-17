---
title: Performance troubleshooting
subtitle: Diagnose and fix slow queries, connections, and compute performance
summary: >-
  A decision tree for diagnosing performance issues in Neon, covering platform
  topics like scale-to-zero reactivation, autoscaling, and connection pooling,
  as well as database topics like slow queries, indexing, and EXPLAIN/ANALYZE.
enableTableOfContents: true
updatedOn: '2026-03-16T00:00:00.000Z'
---

Slow database performance can come from the platform layer (cold starts, compute sizing, connection limits) or the database layer (missing indexes, bloated tables, lock contention). This page helps you match your symptoms to the right fix.

## Quick reference

| Symptom                                                                               | Likely cause                          | What to check                               | Guide                                                                                         |
| ------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [First query is slow after idle](#first-query-is-slow-after-idle)                     | Scale-to-zero reactivation            | Compute status on Branches page             | [Scale to zero](/docs/introduction/scale-to-zero)                                             |
| [Everything is slow regardless of query](#app-and-database-are-in-different-regions)  | App and database in different regions | Region settings in Neon Console             | [Latency and timeouts](/docs/connect/connection-latency)                                      |
| [Everything slows down under load](#everything-slows-down-under-load)                 | Compute at minimum size               | Monitoring dashboard (CPU, RAM)             | [Autoscaling](/docs/introduction/autoscaling)                                                 |
| [Connections fail or time out](#connections-fail-or-time-out)                         | Max connections exhausted             | Connection count on Monitoring dashboard    | [Connection pooling](/docs/connect/connection-pooling)                                        |
| [Prepared statements or SET commands fail](#prepared-statements-or-set-commands-fail) | PgBouncer transaction mode            | Connection string (`-pooler` in hostname)   | [Connection pooling](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode) |
| [Reads are slow but writes are fine](#reads-are-slow-but-writes-are-fine)             | Primary overloaded with reads         | Read vs. write ratio in your workload       | [Read replicas](/docs/introduction/read-replicas)                                             |
| [Specific queries are slow](#finding-slow-queries)                                    | Missing indexes, poor query plans     | Query Performance tab, `pg_stat_statements` | [Finding slow queries](#finding-slow-queries)                                                 |

## Platform layer

### First query is slow after idle

Neon's [Scale to zero](/docs/introduction/scale-to-zero) feature suspends your compute after a period of inactivity (5 minutes by default). The first query after suspension triggers a reactivation that typically takes a few hundred milliseconds. Beyond the initial reactivation, queries can stay slow until the [Local File Cache](/docs/reference/glossary#local-file-cache) reloads your [working set](/docs/reference/glossary#working-set), which starts empty after suspension.

**What to do:**

- **Disable scale-to-zero** for always-on production workloads. See [Configuring scale to zero](/docs/guides/scale-to-zero-guide).
- **Adjust the inactivity timeout** to reduce cold starts. Launch and Scale plan users can disable scale-to-zero entirely. Scale plan users can also set a custom timeout from 1 minute to 7 days. See [Configuring scale to zero](/docs/guides/scale-to-zero-guide) for setup.
- **Pre-warm the cache** after reactivation using the [pg_prewarm](/docs/extensions/pg_prewarm) extension to load critical tables and indexes into memory.
- **Build timeout handling** into your application. See [Latency and timeouts](/docs/connect/connection-latency) for strategies.

After reactivation, you lose session state (prepared statements, temp tables, session-level settings). Re-initialize on reconnect if your application depends on these. See [Postgres compatibility](/docs/reference/compatibility) for details.

### App and database are in different regions

If all queries are uniformly slow, the cause is likely a region mismatch between your application and database. For example, an app in `us-east-1` connecting to a database in `eu-west-1` adds significant round-trip time to every query.

**What to do:**

- **Check your regions.** Verify your database region in the Neon Console and compare it to where your application is deployed.
- **Co-locate app and database.** Deploy your application and database in the same region, or as close as possible. See [Regions](/docs/introduction/regions) for available Neon regions. To move an existing database, see [Import data from another Neon project](/docs/import/migrate-from-neon).

### Everything slows down under load

If your application slows down under high traffic, your compute may be undersized or your autoscaling limits may be too low.

**What to do:**

1. Check the [Monitoring dashboard](/docs/introduction/monitoring-page) for CPU and RAM usage. If either is consistently near 100%, your compute needs more resources.
2. If you use [autoscaling](/docs/introduction/autoscaling), verify your minimum and maximum CU settings. A low minimum means the compute starts small and takes time to scale up under sudden load. Autoscaling is most effective when your [working set](/docs/reference/glossary#working-set) can be fully cached in memory on the minimum compute size. See [Autoscaling considerations](/docs/manage/computes#autoscaling-considerations).
3. Consider raising the **minimum CU** for workloads with predictable traffic, or the **maximum CU** for workloads with spiky traffic. See [Manage computes](/docs/manage/computes) for sizing guidance.

### Connections fail or time out

Connection issues typically mean your application is opening more connections than your compute supports or not reusing them efficiently.

**What to do:**

- **Enable connection pooling** if you haven't already. Pooled connections route through PgBouncer, which supports up to 10,000 concurrent client connections. See [Connection pooling](/docs/connect/connection-pooling).
- **Check your connection limits.** The `max_connections` limit depends on your compute size and is capped at 4,000 for computes 9 CU and above. See [Manage computes](/docs/manage/computes) for limits per CU.
- **Review timeout settings.** PgBouncer's `query_wait_timeout` (120 seconds) causes queries to fail if the pool is full, and compute suspension closes all connections. See [Connection pooling](/docs/connect/connection-pooling) and [Latency and timeouts](/docs/connect/connection-latency).
- **Use direct SSL negotiation** if your PostgreSQL client is version 17+. Adding `sslnegotiation=direct` to your connection string skips a negotiation round trip and reduces connection setup time. See [Optimizing connection latency with sslnegotiation](/docs/connect/connection-latency#optimizing-connection-latency-with-sslnegotiation).

### Prepared statements or SET commands fail

If `SET`, `RESET`, SQL-level `PREPARE`/`DEALLOCATE`, `LISTEN`/`NOTIFY`, or temporary tables fail, you're likely connecting through PgBouncer, which runs in **transaction mode**.

**What to do:**

- **Switch to a direct (unpooled) connection** for operations that need session-level features. Direct connection strings omit `-pooler` from the hostname. See [Connection pooling](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode) for unsupported features and [Choosing your connection method](/docs/connect/choose-connection) for pooled vs. direct guidance.
- **Use protocol-level prepared statements** instead of SQL-level `PREPARE`. Most PostgreSQL client libraries support this; check your driver's documentation for specifics. See [Protocol-level prepared statements](/docs/connect/connection-pooling#protocol-level-prepared-statements).

### Reads are slow but writes are fine

If your read queries are slow while writes perform normally, your primary compute may be overloaded with read traffic.

**What to do:**

- **Offload reads to a read replica.** Heavy SELECT queries compete with writes for CPU, RAM, and connections on the primary. Read replicas run on separate computes with independent resources, eliminating that contention. In Neon, read replicas share the same storage with no traditional replication lag. See [Read replicas](/docs/introduction/read-replicas) and [Read replica guides](/docs/guides/read-replica-guide) for setup.

## Database layer

### Finding slow queries

Neon provides tools to help you identify which queries are consuming the most time and resources.

| Tool                                                                  | What it shows                                                                      | Guide                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Query Performance](/docs/introduction/monitor-query-performance) tab | Top queries by execution time, sorted by total or mean duration                    | [Monitor query performance](/docs/introduction/monitor-query-performance) |
| [Active Queries](/docs/introduction/monitor-active-queries)           | Currently running queries and their duration                                       | [Monitor active queries](/docs/introduction/monitor-active-queries)       |
| [pg_stat_statements](/docs/extensions/pg_stat_statements)             | Aggregated statistics: execution count, mean/total time, rows returned, buffer I/O | [pg_stat_statements](/docs/extensions/pg_stat_statements)                 |

Start with the **Query Performance** monitoring tab for a quick overview, then use `pg_stat_statements` to dig into specific queries.

<Admonition type="note">
`pg_stat_statements` data is not retained across compute suspensions. If your compute uses [Scale to zero](/docs/introduction/scale-to-zero), statistics reset each time the compute reactivates. Plan around this when analyzing query performance.
</Admonition>

### Fixing slow queries

Common slow query fixes:

**Indexes:** Missing indexes are the most frequent cause of slow queries. If `pg_stat_statements` shows high `shared_blks_read` (disk I/O) for a query, it likely needs an index. See [Postgres indexes](/docs/postgresql/index-types) for index types and usage. On Postgres 17, the [online_advisor](/docs/extensions/online_advisor) extension can recommend indexes based on your query workload. You can also query [pg_stat_user_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW) to find unused or duplicate indexes.

**EXPLAIN / ANALYZE:** Run `EXPLAIN ANALYZE` on the slow query to see the execution plan. Look for sequential scans on large tables, nested loops with high row counts, or sort operations that spill to disk. See [Optimize queries](/docs/postgresql/query-performance#use-explain) for guidance on reading query plans.

**Result set size:** Queries returning thousands of rows when you only need a few waste bandwidth and memory. Add `LIMIT` clauses or stricter `WHERE` filters. `pg_stat_statements` can help identify queries that [return many rows](/docs/extensions/pg_stat_statements).

**Vacuum and maintenance:** Tables with heavy update or delete activity accumulate dead rows, which slows down sequential scans. Query `pg_stat_user_tables` to check `n_dead_tup` and `last_autovacuum` for tables that may need vacuuming. If your compute uses [Scale to zero](/docs/introduction/scale-to-zero), autovacuum may not trigger after a restart because threshold counters reset on suspension. Consider running manual `VACUUM` on frequently updated tables. See [Cost optimization](/docs/introduction/cost-optimization) for details.

**Lock contention:** If queries intermittently hang rather than run slowly, a long-running transaction may be holding a lock. Check [Active Queries](/docs/introduction/monitor-active-queries) for long-running transactions that may be blocking others. To identify specific locks, query [`pg_locks`](https://www.postgresql.org/docs/current/view-pg-locks.html) joined with `pg_stat_activity`. The fix is usually to terminate the blocking transaction or restructure your application to use shorter transactions.

### Memory and configuration

Query performance depends on memory settings like `work_mem` and `maintenance_work_mem`, which scale with your [compute size](/docs/manage/computes). A larger compute provides more memory for large sorts, hash joins, and index builds.

Some Postgres parameters can be set at the session, database, or role level. See [Postgres compatibility](/docs/reference/compatibility) for which parameters are user-configurable in Neon.

## Still stuck?

If the issue persists after working through the checks above, gather the following before reaching out for help:

- **The slow query** and its `EXPLAIN ANALYZE` output
- **A screenshot or time range** from the [Monitoring dashboard](/docs/introduction/monitoring-page) showing CPU, RAM, and connection metrics around the time of the issue
- **The timestamp** when the problem occurred (in UTC if possible)
- **Your compute size** and whether autoscaling is enabled (include min/max CU)
- **Whether scale-to-zero is enabled** and the configured timeout
- **Your connection method** (pooled vs. direct, and which driver)

<NeedHelp/>
