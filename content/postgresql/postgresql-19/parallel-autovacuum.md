---
title: 'PostgreSQL 19 Parallel Autovacuum'
page_title: 'PostgreSQL 19 Parallel Autovacuum - Faster Index Cleanup'
page_description: 'Learn how to configure PostgreSQL 19 parallel autovacuum to speed up index vacuuming on large tables with multiple indexes.'
ogImage: ''
updatedOn: '2026-04-15T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 Monitoring and Operations'
  slug: 'postgresql-19/monitoring-operations'
nextLink:
  title: 'PostgreSQL 19 Breaking Changes'
  slug: 'postgresql-19/breaking-changes'
---

**Summary**: PostgreSQL 19 lets autovacuum use parallel workers for index vacuuming and cleanup. On tables with multiple large indexes, this can cut vacuum time significantly by processing indexes in parallel instead of one at a time.

## Introduction

Vacuuming a table with many indexes is slow because PostgreSQL processes each index sequentially. For a table with 5 indexes, the index vacuum phase takes 5x as long as it would for a single index. On large tables, this phase often dominates the total vacuum time.

PostgreSQL 13 added `VACUUM (PARALLEL N)` for manual vacuum operations. PostgreSQL 19 extends this to autovacuum, letting the background vacuum workers spawn parallel helpers for index processing. The [autovacuum tuning guidance from PostgreSQL 18](/postgresql/postgresql-18/autovacuum-maintenance-configuration) still applies — parallel workers stack on top of those settings.

## How It Works

Parallel autovacuum adds workers during two specific phases of the vacuum process:

1. **Index vacuuming**: Removing index entries that point to dead heap tuples
2. **Index cleanup**: Updating index statistics after vacuuming

Each parallel worker handles one index at a time. If you have 4 indexes and 3 parallel workers, the leader process handles one index while the 3 workers handle the other 3, completing the phase in roughly the time it takes to process the largest single index.

The heap scanning and heap vacuuming phases remain single-threaded. Parallel workers are launched before each index phase and exit when the phase completes.

## Configuration

Parallel autovacuum is controlled by one cluster-wide GUC and one per-table storage parameter. Both default to disabled.

### Global setting

`autovacuum_max_parallel_workers` controls the cluster-wide ceiling. Set it via `ALTER SYSTEM` or `postgresql.conf`, then reload the config to pick up the change without a restart.

```sql
-- postgresql.conf or ALTER SYSTEM
-- Default is 0 (disabled)
ALTER SYSTEM SET autovacuum_max_parallel_workers = 4;
SELECT pg_reload_conf();
```

The `autovacuum_max_parallel_workers` parameter sets the maximum number of parallel workers a single autovacuum process can use. The default is `0`, which means parallel autovacuum is disabled after a fresh install. You must explicitly enable it.

<Admonition type="important">
Parallel autovacuum is off by default (`autovacuum_max_parallel_workers = 0`). You must set this to a positive value to benefit from it.
</Admonition>

### Per-Table Override

For tables that benefit most from parallel vacuum (large tables with many indexes), you can set the parallelism individually:

```sql
-- Use 3 parallel workers for this table
ALTER TABLE orders SET (autovacuum_parallel_workers = 3);

-- Use 6 parallel workers for a heavily-indexed table
ALTER TABLE events SET (autovacuum_parallel_workers = 6);

-- Disable parallel vacuum for a small table
ALTER TABLE config SET (autovacuum_parallel_workers = 0);
```

The per-table setting overrides the global `autovacuum_max_parallel_workers`. A value of `-1` (the default) means "use the global setting."

### Limits

The actual number of parallel workers is constrained by:

- `autovacuum_max_parallel_workers` (or the per-table override)
- `max_parallel_workers` (the overall parallel worker pool)
- The number of indexes on the table (you can not have more workers than indexes)
- Each index must be larger than `min_parallel_index_scan_size` to qualify for parallel processing

## When Parallel Autovacuum Helps

Parallel autovacuum is most effective when:

**Multiple large indexes**: A table with 5+ indexes where each index is gigabytes in size. The index vacuum phase dominates total vacuum time, and parallel processing provides a near-linear speedup.

**Write-heavy tables with many indexes**: Tables like audit logs, event streams, or time-series data that accumulate dead tuples quickly and have several indexes for different query patterns.

**Tables where vacuum falls behind**: If autovacuum cannot keep up with the dead tuple generation rate, parallel workers help it process faster.

### When It Does Not Help

**Single-index tables**: No benefit from parallelism when there is only one index to process.

**Small indexes**: Indexes below `min_parallel_index_scan_size` are processed by the leader, not workers.

**Heap-bound vacuums**: If the heap scanning phase is the bottleneck (common with very wide rows or tables with few dead tuples spread across many pages), parallel index processing does not help.

## Memory Considerations

Each parallel worker allocates its own `maintenance_work_mem` for the vacuum operation. With `maintenance_work_mem = 256MB` and 4 parallel workers, a single autovacuum process could use up to 1.25 GB (leader + 4 workers).

Plan your memory budget accordingly:

```sql
-- If you set 4 parallel workers globally:
-- Total memory per autovacuum = maintenance_work_mem * (1 + autovacuum_max_parallel_workers)
-- 256MB * 5 = 1.28 GB per concurrent autovacuum

SHOW maintenance_work_mem;
SHOW autovacuum_max_parallel_workers;
```

## Monitoring

The `pg_stat_progress_vacuum` view shows the combined progress of the leader and all parallel workers:

```sql
SELECT
    pid,
    relid::regclass AS table_name,
    phase,
    heap_blks_total,
    heap_blks_scanned,
    index_vacuum_count,
    max_dead_tuple_bytes,
    dead_tuple_bytes
FROM pg_stat_progress_vacuum;
```

Parallel workers do not get their own rows in this view. The progress information is aggregated under the leader process.

## Practical configuration

Typical settings by database size. These are starting points, not hard rules. The right numbers depend on how many indexes your tables have and how much CPU headroom the box has during autovacuum windows.

### Small database (< 50 GB)

Parallel autovacuum is likely unnecessary. The default of 0 is fine:

```
# postgresql.conf
autovacuum_max_parallel_workers = 0
```

### Medium Database (50-500 GB)

Enable a modest level of parallelism:

```
# postgresql.conf
autovacuum_max_parallel_workers = 2
maintenance_work_mem = 256MB
```

### Large Database (500+ GB)

Enable higher parallelism, especially for tables with many indexes:

```
# postgresql.conf
autovacuum_max_parallel_workers = 4
maintenance_work_mem = 512MB
```

```sql
-- Per-table for your largest tables
ALTER TABLE events SET (autovacuum_parallel_workers = 6);
ALTER TABLE audit_log SET (autovacuum_parallel_workers = 4);
```

## Relationship to Manual VACUUM PARALLEL

The existing `VACUUM (PARALLEL N)` syntax for manual vacuums still works and is controlled by `max_parallel_maintenance_workers`. The new `autovacuum_max_parallel_workers` parameter only affects autovacuum.

```sql
-- Manual parallel vacuum (existing feature)
VACUUM (PARALLEL 4) orders;

-- Autovacuum parallel workers (new in PG 19)
ALTER SYSTEM SET autovacuum_max_parallel_workers = 4;
```

Both share workers from the `max_parallel_workers` pool.

## Summary

Parallel autovacuum in PostgreSQL 19 addresses one of the biggest pain points with large, heavily-indexed tables: slow index vacuuming. By processing multiple indexes simultaneously, vacuum operations that previously took hours on large tables can complete in a fraction of the time. The feature is disabled by default, so you must explicitly enable it after upgrading.

## References

- [Commit `1ff3180c`: Allow autovacuum to use parallel vacuum workers](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=1ff3180c)
- [PostgreSQL devel docs: Routine Vacuuming](https://www.postgresql.org/docs/devel/routine-vacuuming.html)
- [PostgreSQL devel docs: autovacuum_max_parallel_workers](https://www.postgresql.org/docs/devel/runtime-config-autovacuum.html)
