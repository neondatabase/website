---
title: 'PostgreSQL 19 REPACK Command'
page_title: 'PostgreSQL 19 REPACK Command - Online Table Maintenance'
page_description: 'Learn how to use PostgreSQL 19 REPACK command to reclaim space and reorder tables, replacing VACUUM FULL and CLUSTER with optional online (CONCURRENTLY) mode.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 pg_plan_advice'
  slug: 'postgresql-19/pg-plan-advice'
nextLink:
  title: 'PostgreSQL 19 Logical Replication Improvements'
  slug: 'postgresql-19/logical-replication-improvements'
---

**Summary**: PostgreSQL 19 introduces the `REPACK` command, which absorbs the functionality of both `VACUUM FULL` and `CLUSTER` into a single command. With the `CONCURRENTLY` option, you can repack tables online while they remain readable and writable.

## Introduction to REPACK

PostgreSQL has two existing commands for reclaiming bloated table space: `VACUUM FULL` rewrites the entire table to remove dead tuples and return space to the OS, and `CLUSTER` reorders rows by an index for better sequential scan performance. Both commands have the same problem: they hold an `ACCESS EXCLUSIVE` lock for the entire duration, blocking all reads and writes.

For small tables, that is fine. For a 100GB table in production, it means downtime.

PostgreSQL 19 adds `REPACK`, which combines both operations into one command and adds a `CONCURRENTLY` mode that holds the exclusive lock only briefly at the end. The table stays accessible during most of the operation.

## Basic usage

The simplest invocation rewrites a single table. Without `CONCURRENTLY`, `REPACK` takes an `ACCESS EXCLUSIVE` lock for the full rewrite.

### Reclaim space

Rewrite a table to eliminate dead tuples and return space to the OS:

```sql
REPACK employees;
```

This is equivalent to `VACUUM FULL employees` but uses the new REPACK infrastructure.

### Reorder by Index

Rewrite a table and physically reorder rows by an index:

```sql
REPACK employees USING INDEX employees_hire_date_idx;
```

This is equivalent to `CLUSTER employees USING employees_hire_date_idx`. Rows are stored on disk in index order, which improves performance for range scans on that column.

### Repack All Tables

Repack every table in the current database:

```sql
REPACK;
```

Or repack all tables that have a clustering index set:

```sql
REPACK USING INDEX;
```

## Online REPACK with CONCURRENTLY

The standout feature is `CONCURRENTLY`, which lets you repack without blocking reads or writes:

```sql
REPACK (CONCURRENTLY) orders;
REPACK (CONCURRENTLY) orders USING INDEX orders_created_at_idx;
```

### How CONCURRENTLY Works

1. Creates a new copy of the table
2. Uses logical decoding to capture changes made to the original table during the copy
3. Applies captured changes to the new copy
4. Briefly acquires an `ACCESS EXCLUSIVE` lock to swap the old and new files
5. Drops the old table file

The exclusive lock is only held during the final swap step, which is fast regardless of table size. During steps 1-3, the table remains fully accessible for reads and writes.

### CONCURRENTLY Restrictions

The `CONCURRENTLY` option cannot be used with:

- Tables without a primary key or replica identity (needed for logical decoding)
- Unlogged tables
- Partitioned tables (the parent; individual partitions can be repacked)
- System catalogs
- Inside a transaction block

```sql
-- This will fail
BEGIN;
REPACK (CONCURRENTLY) orders;  -- ERROR: REPACK CONCURRENTLY cannot run inside a transaction block
COMMIT;
```

## Options

REPACK supports several options that can be combined:

```sql
-- Verbose output showing progress
REPACK (VERBOSE) employees;

-- Run ANALYZE after repacking for fresh statistics
REPACK (ANALYZE) employees;

-- Combine options
REPACK (CONCURRENTLY, ANALYZE, VERBOSE) orders USING INDEX orders_created_at_idx;
```

### Analyzing Specific Columns

You can limit the post-REPACK ANALYZE to specific columns:

```sql
REPACK (ANALYZE) orders (customer_id, created_at);
```

## Monitoring Progress

REPACK reports progress through the `pg_stat_progress_repack` system view:

```sql
SELECT pid, datname, relid::regclass AS table_name,
       phase, heap_blks_total, heap_blks_scanned
FROM pg_stat_progress_repack;
```

This view shows which phase the operation is in (scanning heap, rebuilding indexes, swapping files) and how far along it is.

## REPACK vs VACUUM FULL vs CLUSTER

| Feature | VACUUM FULL | CLUSTER | REPACK |
|---|---|---|---|
| Reclaims space | Yes | Yes | Yes |
| Reorders by index | No | Yes | Yes (with USING INDEX) |
| Online mode | No | No | Yes (CONCURRENTLY) |
| Lock type | ACCESS EXCLUSIVE | ACCESS EXCLUSIVE | ACCESS EXCLUSIVE (brief with CONCURRENTLY) |
| Single command for both | No | No | Yes |
| Progress monitoring | pg_stat_progress_cluster | pg_stat_progress_cluster | pg_stat_progress_repack |

## REPACK vs pg_repack Extension

The `pg_repack` extension has provided online table repacking for years. PostgreSQL 19's built-in REPACK brings similar functionality into core:

- **No extension required**: Works out of the box on any PostgreSQL 19 installation
- **Officially supported**: Part of the core PostgreSQL distribution
- **Unified command**: Combines VACUUM FULL and CLUSTER functionality
- **Same general approach**: Both use logical decoding for online mode

If you have been using pg_repack, the built-in REPACK provides the same capability without the extension dependency.

## Practical examples

Two common maintenance patterns where `REPACK` replaces a more awkward sequence of commands.

### Reclaiming space after bulk deletes

After deleting a large number of rows, `VACUUM` reclaims space within pages but does not shrink the table file. `REPACK` rewrites the table to its minimal size:

```sql
-- After a large purge
DELETE FROM audit_logs WHERE created_at < now() - interval '1 year';

-- VACUUM frees space within pages but doesn't shrink the file
VACUUM audit_logs;

-- REPACK rewrites the table, returning space to the OS
REPACK (CONCURRENTLY, ANALYZE) audit_logs;
```

### Improving Range Scan Performance

If your most common query pattern scans by date range, clustering the table by the date column stores related rows physically together:

```sql
-- Create the index if it doesn't exist
CREATE INDEX IF NOT EXISTS orders_date_idx ON orders (created_at);

-- Repack and cluster by date
REPACK (CONCURRENTLY) orders USING INDEX orders_date_idx;
```

Sequential scans on `created_at` ranges will now read fewer pages because related rows are stored together on disk.

### Maintenance Window Script

For scheduled maintenance:

```sql
-- Repack the largest tables online
REPACK (CONCURRENTLY, ANALYZE, VERBOSE) orders;
REPACK (CONCURRENTLY, ANALYZE, VERBOSE) line_items;
REPACK (CONCURRENTLY, ANALYZE, VERBOSE) events;
```

## Performance Considerations

**Disk space**: REPACK needs free disk space equal to the table size plus all its index sizes. If sorting is required (USING INDEX), it may need up to double the table size temporarily.

**Memory**: Set `maintenance_work_mem` high before repacking large tables. This speeds up the sort and index rebuild phases:

```sql
SET maintenance_work_mem = '1GB';
REPACK (CONCURRENTLY) large_table USING INDEX large_table_pkey;
```

**Privileges**: Requires `MAINTAIN` privilege on the table (or table ownership).

**Partitioned tables**: REPACK processes each partition individually. You cannot repack the parent table directly, but you can repack partitions:

```sql
REPACK (CONCURRENTLY) orders_2025_q1;
REPACK (CONCURRENTLY) orders_2025_q2;
```

## Summary

The `REPACK` command unifies `VACUUM FULL` and `CLUSTER` into a single command with the addition of an online `CONCURRENTLY` mode. For production databases where downtime is not acceptable, `REPACK (CONCURRENTLY)` is the first in-core way to reclaim space without taking the table offline. For routine bloat control, see also [parallel autovacuum](/postgresql/postgresql-19/parallel-autovacuum), which often removes the need to repack in the first place.

## References

- [Commit `ac58465e`: Introduce the REPACK command](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=ac58465e)
- [PostgreSQL devel docs: REPACK](https://www.postgresql.org/docs/devel/sql-repack.html)
- [PostgreSQL devel docs: pg_stat_progress_repack](https://www.postgresql.org/docs/devel/progress-reporting.html)
