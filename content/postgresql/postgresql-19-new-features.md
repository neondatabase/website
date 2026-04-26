---
title: 'PostgreSQL 19 New Features'
page_title: "PostgreSQL 19 New Features: What's New and Why It Matters"
page_description: 'Explore PostgreSQL 19 new features including SQL/PGQ property graph queries, ON CONFLICT DO SELECT, temporal data operations, pg_plan_advice, REPACK, parallel autovacuum, and more.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
nextLink:
  title: 'PostgreSQL 19 SQL/PGQ Graph Queries'
  slug: 'postgresql-19/sql-pgq-graph-queries'
---

**Summary**: PostgreSQL 19 is a landmark release that brings SQL/PGQ property graph queries, atomic get-or-create with `ON CONFLICT DO SELECT`, temporal data operations, query plan hints, online table repacking, parallel autovacuum, native JSON export, and logical replication improvements. This overview covers the highlights with links to detailed guides.

## Introduction

PostgreSQL 19 is currently in development, with a feature freeze in April 2026, beta expected in mid-2026, and a final release expected in late 2026. The headline addition is native graph query support via the SQL:2023 standard, alongside a dozen features that address long-standing developer and operator pain points.

The release spans six areas:

- **Graph queries**: SQL/PGQ property graph queries on existing tables
- **DML improvements**: New conflict handling and temporal operations
- **Query planning**: Official plan hint support via a contrib module
- **Maintenance**: Online table repacking and parallel autovacuum
- **Operations**: Better logical replication, JSON export, and monitoring
- **Upgrades**: Breaking changes and new defaults to review

## SQL/PGQ Property Graph Queries

PostgreSQL 19 brings native graph query capabilities into core via the SQL:2023 SQL/PGQ standard. Existing relational tables can be exposed as property graphs and traversed with pattern matching syntax, removing the need for a separate graph database for most workloads.

### [SQL/PGQ: Graph Queries on Existing Tables](/postgresql/postgresql-19/sql-pgq-graph-queries)

PostgreSQL 19 adds SQL/PGQ (ISO SQL:2023 Part 16), bringing native graph query capabilities to PostgreSQL. You define property graphs over existing relational tables and query relationships using pattern matching syntax.

```sql
-- Define a graph over existing tables
CREATE PROPERTY GRAPH social_graph
  VERTEX TABLES (users LABEL person PROPERTIES (id, name))
  EDGE TABLES (
    follows
      SOURCE KEY (follower_id) REFERENCES users (id)
      DESTINATION KEY (followed_id) REFERENCES users (id)
      LABEL follows
  );

-- Query: find friends of friends
SELECT * FROM GRAPH_TABLE (social_graph
    MATCH (a IS person WHERE a.name = 'Alice')
          -[IS follows]->(b IS person)
          -[IS follows]->(c IS person)
    COLUMNS (b.name AS friend, c.name AS friend_of_friend)
);
```

No new storage engine, no extensions, no data migration. Graph queries are rewritten into standard relational operations and use your existing indexes. Results compose naturally with joins, aggregations, CTEs, and everything else in SQL.

<Admonition type="note">
The initial implementation covers fixed-depth pattern matching. Variable-length paths (quantified patterns like `+`, `*`, `{2,5}`) are planned for a future release.
</Admonition>

## DML and Query Improvements

PostgreSQL 19 adds several long-requested DML primitives. `ON CONFLICT DO SELECT` finally provides atomic get-or-create semantics, `FOR PORTION OF` completes SQL:2011 temporal modifications, and convenience features like `GROUP BY ALL` and `IGNORE NULLS` reduce verbosity in common query patterns.

### [ON CONFLICT DO SELECT](/postgresql/postgresql-19/on-conflict-do-select)

PostgreSQL 19 adds a third action to `INSERT ... ON CONFLICT`: `DO SELECT`. This gives you atomic get-or-create semantics - insert a row and get it back, or if it already exists, get the existing row. No dead tuples, no CTE workarounds.

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice')
ON CONFLICT (email) DO SELECT
RETURNING *;
```

This replaces the common no-op `DO UPDATE SET col = EXCLUDED.col` workaround, which generated dead tuples on every conflict. Benchmarks show `DO SELECT` is nearly 4x faster than the no-op update approach.

### [Temporal Data Operations: FOR PORTION OF](/postgresql/postgresql-19/temporal-data-operations)

Building on PostgreSQL 18's `WITHOUT OVERLAPS` temporal constraints, PostgreSQL 19 adds `UPDATE ... FOR PORTION OF` and `DELETE ... FOR PORTION OF`. When you modify data within a specific time range, PostgreSQL automatically splits the row to preserve the untouched portions.

```sql
-- Original row: product 1 at $29.99 for all of 2025
-- Update price to $34.99 for Q3 only
UPDATE product_prices
FOR PORTION OF valid_range FROM '2025-07-01' TO '2025-10-01'
SET price = 34.99
WHERE product_id = 1;

-- Result: three rows
-- Jan-Jun: $29.99 (preserved automatically)
-- Jul-Sep: $34.99 (updated)
-- Oct-Dec: $29.99 (preserved automatically)
```

This completes PostgreSQL's SQL:2011 temporal feature set, making it suitable for booking systems, employee records, insurance policies, and any data with validity periods.

### [GROUP BY ALL](/postgresql/postgresql-19/query-improvements)

A convenience feature that automatically groups by every non-aggregate expression in the SELECT list:

```sql
-- Before: manually repeat column names
SELECT department, role, count(*)
FROM employees
GROUP BY department, role;

-- PostgreSQL 19: GROUP BY ALL
SELECT department, role, count(*)
FROM employees
GROUP BY ALL;
```

This eliminates a common source of errors when adding or removing columns from SELECT lists.

### [IGNORE NULLS / RESPECT NULLS for Window Functions](/postgresql/postgresql-19/query-improvements)

SQL-standard null handling for five window functions: `lead()`, `lag()`, `first_value()`, `last_value()`, and `nth_value()`:

```sql
-- Get the last non-null reading for each sensor
SELECT sensor_id,
    last_value(reading) IGNORE NULLS OVER (
        PARTITION BY sensor_id ORDER BY ts
    ) AS last_known_reading
FROM sensor_data;
```

`RESPECT NULLS` is the default and preserves existing behavior. `IGNORE NULLS` skips null rows when searching for a value, which is useful for time-series data with gaps.

## Query Planning and Performance

For the first time, PostgreSQL ships an official mechanism for query plan hints. `pg_plan_advice` lets you capture a known-good plan and feed it back to the planner, with a feedback loop that tells you whether each hint was honored. Memoize estimates in `EXPLAIN` output also make it easier to diagnose planner choices.

### [pg_plan_advice: Query Plan Hints](/postgresql/postgresql-19/pg-plan-advice)

PostgreSQL has historically avoided query plan hints. That changes with `pg_plan_advice`, a contrib module that provides plan stabilization and override capabilities.

The workflow: generate advice from a known-good plan, then feed it back to lock the plan.

```sql
-- Generate advice from the current plan
EXPLAIN (COSTS OFF, PLAN_ADVICE)
SELECT * FROM orders o JOIN customers c ON o.cust_id = c.id;
-- Output: JOIN_ORDER(o c)  HASH_JOIN(c)  SEQ_SCAN(o c)

-- Lock this plan
SET pg_plan_advice.advice = 'JOIN_ORDER(o c) HASH_JOIN(c) SEQ_SCAN(o c)';
```

Unlike Oracle or MySQL hints embedded in SQL comments, advice lives in a GUC setting and includes a feedback mechanism that tells you whether each hint was honored.

### Memoize Planner Estimates in EXPLAIN

EXPLAIN now shows estimated cache metrics on Memoize nodes:

```
->  Memoize  (cost=... rows=...)
      Cache Key: t.id
      Estimates: capacity=2 distinct keys=2 lookups=1000 hit percent=99.80%
```

This helps diagnose why the planner chose (or avoided) Memoize and whether `n_distinct` statistics need tuning.

## Table Maintenance

Table maintenance gets two significant upgrades. `REPACK` consolidates `VACUUM FULL` and `CLUSTER` into a single command with a `CONCURRENTLY` mode that keeps the table online. Parallel autovacuum workers attack multiple indexes simultaneously, dramatically shortening vacuum runs on heavily-indexed tables.

### [REPACK: Online Table Rebuilding](/postgresql/postgresql-19/repack-command)

`REPACK` absorbs the functionality of both `VACUUM FULL` and `CLUSTER` into a single command, with the addition of a `CONCURRENTLY` mode:

```sql
-- Reclaim space (like VACUUM FULL)
REPACK orders;

-- Reorder by index (like CLUSTER)
REPACK orders USING INDEX orders_created_at_idx;

-- Online mode: table stays accessible during repack
REPACK (CONCURRENTLY) orders USING INDEX orders_created_at_idx;
```

With `CONCURRENTLY`, the `ACCESS EXCLUSIVE` lock is only held briefly during the final file swap. The table remains readable and writable for the bulk of the operation.

### [Parallel Autovacuum](/postgresql/postgresql-19/parallel-autovacuum)

Autovacuum can now use parallel workers for index vacuuming and cleanup. On tables with multiple large indexes, this dramatically reduces vacuum time by processing indexes simultaneously instead of one at a time.

```sql
-- Enable globally (default is 0 = disabled)
ALTER SYSTEM SET autovacuum_max_parallel_workers = 4;

-- Per-table override for heavily-indexed tables
ALTER TABLE events SET (autovacuum_parallel_workers = 6);
```

Each worker handles one index. With 4 workers and 5 indexes, the index vacuum phase completes in roughly the time of the largest single index instead of the sum of all five.

<Admonition type="note">
Parallel autovacuum is disabled by default (`autovacuum_max_parallel_workers = 0`). You must explicitly enable it to benefit.
</Admonition>

## Data Export

`COPY TO` finally supports JSON output natively, removing the need for `row_to_json()` and `json_agg()` workarounds. NDJSON is the default, with an optional JSON array form, and the implementation is faster than the equivalent SELECT-based pipelines.

### [JSON Format for COPY TO](/postgresql/postgresql-19/json-copy-to)

Native JSON output support for `COPY TO`, producing NDJSON (one JSON object per line) by default or a JSON array with `FORCE_ARRAY`:

```sql
-- NDJSON output
COPY users TO STDOUT WITH (FORMAT JSON);
-- {"id":1,"email":"alice@example.com","name":"Alice"}
-- {"id":2,"email":"bob@example.com","name":"Bob"}

-- JSON array output
COPY users TO STDOUT WITH (FORMAT JSON, FORCE_ARRAY);
-- [
--  {"id":1,"email":"alice@example.com","name":"Alice"}
-- ,{"id":2,"email":"bob@example.com","name":"Bob"}
-- ]
```

This replaces the `row_to_json()` and `json_agg()` workarounds with streaming, memory-efficient output.

### COPY TO for Partitioned Tables

`COPY partitioned_table TO` now works directly, without wrapping in a subquery:

```sql
COPY partitioned_sales TO '/tmp/sales.csv' WITH (FORMAT csv);
```

About 7-8% faster than the `COPY (SELECT * FROM ...) TO` workaround.

## Logical Replication and Operations

Logical replication picks up sequence synchronization, table exclusions in `FOR ALL TABLES` publications, and a dynamic WAL level that no longer requires a server restart to switch into and out of. Schema and operations tooling also improve with new DDL extraction functions and modern output formats for `pg_dumpall`.

### [Logical Replication Improvements](/postgresql/postgresql-19/logical-replication-improvements)

PostgreSQL 19 addresses several long-standing logical replication pain points:

**Sequence synchronization**: Subscribers can now sync sequence values from the publisher, preventing duplicate key errors after failover.

```sql
CREATE PUBLICATION my_pub FOR ALL TABLES, ALL SEQUENCES;
```

**EXCEPT TABLE**: Publications using `FOR ALL TABLES` can exclude specific tables:

```sql
CREATE PUBLICATION prod_pub FOR ALL TABLES
    EXCEPT (TABLE audit_log, temp_imports);
```

**Dynamic WAL level**: The `effective_wal_level` parameter adjusts automatically based on whether logical replication slots exist, eliminating the need to manually configure and restart for WAL level changes.

### [pg_get_*_ddl() Functions](/postgresql/postgresql-19/schema-management)

Three new functions for programmatic DDL extraction:

```sql
SELECT * FROM pg_get_database_ddl('mydb');
-- CREATE DATABASE mydb WITH TEMPLATE = template0 ENCODING = 'UTF8' ...

SELECT * FROM pg_get_role_ddl('app_user');
-- CREATE ROLE app_user WITH LOGIN PASSWORD '********' ...
```

Also available: `pg_get_tablespace_ddl()`. These provide a cleaner alternative to parsing `pg_dump` output when you need DDL for specific objects.

### [pg_dumpall Non-Text Formats](/postgresql/postgresql-19/schema-management)

`pg_dumpall` now supports custom (`-Fc`), directory (`-Fd`), and tar (`-Ft`) output formats:

```bash
pg_dumpall -Fc -f full-dump
pg_restore --globals-only full-dump  # restore only roles/tablespaces
```

### [64-bit MultiXactOffset](/postgresql/postgresql-19/monitoring-operations)

MultiXactOffset has been widened from 32-bit to 64-bit, eliminating the ~4 billion member wraparound limit. Previously, heavy use of row-level locking (concurrent `SELECT FOR UPDATE` across many transactions) could exhaust MultiXact member space, causing write failures that required emergency vacuuming. This risk is removed in PostgreSQL 19.

## Monitoring and Operations Improvements

Several long-standing rough edges around observability and runtime configuration get smoothed out. Data checksums can be enabled or disabled on a running cluster, `pg_stat_wal` exposes more detail, and per-process-type logging lets you turn up verbosity for autovacuum or the archiver without flooding the rest of the log.

### [Online Data Checksums](/postgresql/postgresql-19/monitoring-operations)

You can now enable or disable data checksums on a running cluster without downtime:

```sql
-- Enable checksums online (cluster stays accessible)
SELECT pg_enable_data_checksums(cost_delay := 10, cost_limit := 1000);

-- Monitor progress
SHOW data_checksums;  -- 'off' -> 'inprogress-on' -> 'on'
```

Previously, enabling checksums on an existing cluster required shutting down the server or a full data reload. The `cost_delay` and `cost_limit` parameters let you throttle the IO impact on production systems.

### WAL Statistics

The `pg_stat_wal` view gains a `wal_fpi_bytes` column tracking bytes used by full-page images:

```sql
SELECT wal_records, wal_fpi, wal_fpi_bytes, wal_bytes FROM pg_stat_wal;
```

### Vacuum Progress

`pg_stat_progress_vacuum` adds `mode` (normal/aggressive/failsafe) and `started_by` (auto/manual/wraparound):

```sql
SELECT pid, relid::regclass, phase, mode, started_by
FROM pg_stat_progress_vacuum;
```

### Per-Process Logging

`log_min_messages` accepts per-process-type overrides:

```
log_min_messages = 'warning, autovacuum:debug1, archiver:debug5'
```

### psql Prompt Additions

Two new prompt escapes: `%i` shows primary/standby status, `%S` shows the current `search_path`:

```
\set PROMPT1 '[%i] %/%R%x%# '
-- Result: [primary] mydb=#
```

## Getting Started

PostgreSQL 19 is currently in development. To try these features, you can build from the PostgreSQL `master` branch or use the PGDG snapshot packages:

```bash
# Docker approach using PGDG snapshots
# See our PostgreSQL 19 guide for Dockerfile details
docker build -t pg19-dev .
docker run -d --name pg19 -p 5433:5432 pg19-dev
psql -h localhost -p 5433 -U postgres
```

## [Breaking Changes and Upgrade Notes](/postgresql/postgresql-19/breaking-changes)

PostgreSQL 19 includes several changes that may affect existing applications. Review these before upgrading:

- **JIT disabled by default**: The `jit` parameter now defaults to `off`. Analytics workloads that rely on JIT should explicitly re-enable it.
- **LZ4 TOAST compression default**: New TOAST data uses LZ4 instead of pglz. Faster compression and decompression with slightly lower ratios. Existing data is unaffected.
- **RADIUS authentication removed**: The `radius` auth method is gone entirely. Switch to LDAP, GSSAPI, or certificate auth.
- **standard_conforming_strings forced on**: Backslash escapes in regular string literals no longer work. Use `E'...'` syntax or standard SQL `''` escaping. `escape_string_warning` was also removed because it has nothing to warn about.
- **MD5 deprecation warnings**: Connecting with MD5-hashed passwords now emits warnings. Migrate to SCRAM-SHA-256.
- **max_locks_per_transaction doubled**: Default changed from 64 to 128.
- **MULE_INTERNAL encoding removed**: `pg_upgrade` refuses to migrate clusters that still use it.
- **btree_gist inet/cidr opclasses retired**: Indexes built on `gist_inet_ops` or `gist_cidr_ops` must be dropped before upgrade. They are known to return wrong results and `pg_upgrade` blocks the migration.
- **CR and LF disallowed in database, role, and tablespace names**: `pg_upgrade` blocks clusters containing any such names.
- **`log_lock_waits` enabled by default**: Servers that previously ran with the default now emit log entries for long lock waits.
- **Wait event class `BUFFERPIN` renamed to `BUFFER`**: Update monitoring that filters on the old name.
- **`postgres_fdw` now respects local READ ONLY**: Transactions declared `READ ONLY` no longer allow writes through foreign tables.

## Summary

PostgreSQL 19 is one of the most feature-rich releases in recent history. SQL/PGQ brings graph query capabilities that previously required a separate database. `ON CONFLICT DO SELECT` solves a problem that has existed since PostgreSQL 9.5. `FOR PORTION OF` completes the SQL:2011 temporal feature set. `pg_plan_advice` breaks new ground for PostgreSQL by providing official plan hints. `REPACK (CONCURRENTLY)` brings online table maintenance into core. And parallel autovacuum addresses one of the biggest pain points for large database operators.
