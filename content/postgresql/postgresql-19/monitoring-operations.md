---
title: 'PostgreSQL 19 Monitoring and Operations'
page_title: 'PostgreSQL 19 Monitoring and Operations Improvements'
page_description: 'Learn about PostgreSQL 19 monitoring and operational improvements including online data checksums, WAL statistics, vacuum progress tracking, per-process logging, psql enhancements, and 64-bit MultiXactOffset.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 Schema Management'
  slug: 'postgresql-19/schema-management'
nextLink:
  title: 'PostgreSQL 19 Parallel Autovacuum'
  slug: 'postgresql-19/parallel-autovacuum'
---

**Summary**: PostgreSQL 19 adds online data checksum management, WAL full-page image tracking, vacuum progress details, per-process-type log levels, psql prompt improvements, the new `WAIT FOR LSN` command for read-your-writes on async replicas, dynamic WAL level, and eliminates the MultiXact wraparound risk with a 64-bit offset. These changes give DBAs better visibility into database operations and remove long-standing operational hazards.

## Online Data Checksum Enable/Disable

PostgreSQL 19 lets you enable or disable data checksums on a running cluster. Previously, checksums could only be set during `initdb` or offline using `pg_checksums` with the server shut down. For large databases, this meant hours of downtime or a full re-initdb with data reload.

Two new SQL-callable functions handle this:

### Enabling Checksums

`pg_enable_data_checksums()` kicks off the online conversion. With no arguments it uses sensible defaults; the optional throttling parameters mirror the autovacuum cost model.

```sql
-- Enable checksums with default throttling
SELECT pg_enable_data_checksums();

-- Enable with custom throttling (similar to vacuum cost parameters)
SELECT pg_enable_data_checksums(
    cost_delay := 10,   -- milliseconds to sleep between page writes
    cost_limit := 1000  -- pages to process before sleeping
);
```

The function starts a background worker that marks all shared buffers dirty, causing checksums to be written on the next page flush. The cluster transitions through an `inprogress-on` state before checksums are fully active:

```sql
-- Monitor progress
SHOW data_checksums;
-- Values: 'off' -> 'inprogress-on' -> 'on'
```

The cluster remains fully accessible throughout the process. Reads and writes continue normally while the background worker processes pages.

### Disabling Checksums

`pg_disable_data_checksums()` is a one-liner. There is no inverse cost model because the operation only needs to flip the control file and stop verifying.

```sql
SELECT pg_disable_data_checksums();
```

This transitions through `inprogress-off` before reaching `off`. Disabling is faster since it only needs to update the control file and stop verifying checksums on reads.

### Throttling the IO Impact

The `cost_delay` and `cost_limit` parameters work like vacuum cost-based delay. On busy production systems, increase `cost_delay` to spread the work over a longer period:

```sql
-- Gentle approach for production (takes longer but minimal IO impact)
SELECT pg_enable_data_checksums(cost_delay := 20, cost_limit := 500);

-- Aggressive approach for maintenance windows
SELECT pg_enable_data_checksums(cost_delay := 0, cost_limit := 10000);
```

### Why This Matters

Many long-running PostgreSQL clusters were initialized years ago without checksums. Until now, enabling checksums on these clusters required one of:

- Shutting down the server and running `pg_checksums --enable` (hours of downtime for large databases)
- Performing a full `pg_dump` and `pg_restore` into a new cluster with checksums enabled
- Living without checksums and risking silent data corruption

With online checksums, you can enable this protection on a running production database with zero downtime.

<Admonition type="note">
Starting in PostgreSQL 18, `initdb` enables data checksums by default for new clusters. Pass `--no-data-checksums` to opt out. Existing clusters upgrading via `pg_upgrade` retain their previous checksum setting.
</Admonition>

## WAL Monitoring: Full-Page Image Tracking

The `pg_stat_wal` view gains a `wal_fpi_bytes` column that tracks the total bytes used by full-page images (FPI) in WAL:

```sql
SELECT
    wal_records,
    wal_fpi,
    wal_fpi_bytes,
    wal_bytes,
    ROUND(wal_fpi_bytes::numeric / NULLIF(wal_bytes, 0) * 100, 1) AS fpi_percent
FROM pg_stat_wal;
```

```
 wal_records | wal_fpi | wal_fpi_bytes | wal_bytes  | fpi_percent
-------------+---------+---------------+------------+-------------
      845230 |   12450 |     102367232 | 256789504  |        39.9
```

### Why FPI Tracking Matters

Full-page images are complete page copies written to WAL after the first modification following a checkpoint. They are necessary for crash recovery but can account for 30-50% of total WAL volume.

With `wal_fpi_bytes`, you can now answer questions like:

- What percentage of my WAL is full-page images?
- Would increasing `checkpoint_timeout` reduce WAL volume? (Fewer checkpoints means fewer first-post-checkpoint modifications, which means fewer FPIs)
- Is `full_page_writes = on` adding significant overhead for my workload?

Previously, you had to parse WAL files with `pg_waldump` and manually calculate FPI bytes. Now it is a single query.

## Vacuum Progress: Mode and Started By

The `pg_stat_progress_vacuum` view adds two columns that answer "why is this vacuum running?" and "how aggressive is it?":

```sql
SELECT
    pid,
    relid::regclass AS table_name,
    phase,
    mode,
    started_by,
    heap_blks_scanned,
    heap_blks_total
FROM pg_stat_progress_vacuum;
```

```
  pid  | table_name | phase          | mode       | started_by | heap_blks_scanned | heap_blks_total
-------+------------+----------------+------------+------------+-------------------+-----------------
 12345 | orders     | scanning heap  | normal     | auto       |            150000 |          500000
 12346 | users      | vacuuming heap | aggressive | wraparound |             80000 |          100000
```

### Mode Values

| Mode | Meaning |
|---|---|
| `normal` | Standard vacuum, reclaims dead tuples |
| `aggressive` | Scans all pages to advance relfrozenxid, not just those with dead tuples |
| `failsafe` | Emergency mode triggered when the database is close to transaction ID wraparound |

### Started By Values

| Value | Meaning |
|---|---|
| `auto` | Triggered by the autovacuum launcher |
| `manual` | Explicitly run by a user (VACUUM command) |
| `wraparound` | Triggered by the autovacuum launcher specifically to prevent wraparound |

This is useful for understanding why vacuum is consuming resources. A `wraparound` vacuum in `aggressive` mode will scan the entire table regardless of dead tuple count, which can cause I/O spikes.

## Per-Process-Type Log Levels

The `log_min_messages` parameter now accepts a comma-separated list of process-type overrides:

```
# postgresql.conf
log_min_messages = 'warning, autovacuum:debug1, archiver:debug5'
```

This sets the default log level to `warning` but enables debug logging for autovacuum and archiver processes specifically.

### Supported Process Types

The 14 supported process types include:

| Process Type | Typical Use |
|---|---|
| `autovacuum` | Debug vacuum behavior without flooding logs with backend messages |
| `archiver` | Troubleshoot WAL archiving issues |
| `checkpointer` | Investigate checkpoint timing and I/O |
| `walsender` | Debug replication issues |
| `walreceiver` | Debug standby replication |
| `backend` | Application query logging |
| `startup` | Recovery and startup diagnostics |
| `bgwriter` | Background writer behavior |

### Practical Example

To debug why autovacuum is running aggressively without adding noise from all other processes:

```
log_min_messages = 'warning, autovacuum:debug2'
```

This produces detailed autovacuum debug output (table selection, threshold calculations, page scanning) while keeping all other processes at warning level.

You can change this at runtime without a restart:

```sql
ALTER SYSTEM SET log_min_messages = 'warning, autovacuum:debug1';
SELECT pg_reload_conf();
```

## psql Prompt Improvements

PostgreSQL 19 adds two new prompt escape sequences:

### %i: Primary/Standby Status

Shows whether the connected server is a primary or standby:

```
\set PROMPT1 '[%i] %/%R%x%# '
```

Result on a primary:

```
[primary] mydb=#
```

Result on a standby:

```
[standby] mydb=#
```

This is useful when you have multiple terminal windows connected to different servers and need a visual indicator of which is the primary.

### %S: Current search_path

Shows the current `search_path` setting:

```
\set PROMPT1 '%/ [%S] %R%x%# '
```

Result:

```
mydb ["$user", public] =#
```

<Admonition type="note">
The `%S` prompt escape requires a PostgreSQL 18+ server (it uses GUC_REPORT to send the search_path value to the client). Connecting to an older server will show an empty string.
</Admonition>

## WAIT FOR LSN: Read-Your-Writes on Async Replicas

PostgreSQL 19 adds the `WAIT FOR` command (commit `447aae13b`), which lets a session block until the server has reached a target WAL location. The most common use is read-your-writes on async replicas: an application that scales reads onto replicas can still guarantee a specific read sees a specific earlier write, by having the replica wait until it has replayed past that write's LSN before answering.

The syntax is:

```sql
WAIT FOR LSN 'lsn' [ WITH ( option [, ...] ) ]
-- options: MODE 'standby_replay' | 'standby_write' | 'standby_flush' | 'primary_flush'
--          TIMEOUT 'milliseconds'
--          NO_THROW
```

The command returns a single `status` column with `success` if the LSN was reached or `timeout` if it gave up first.

### Read-your-writes on a standby

The flow is: write on the primary, capture the commit LSN, send the read to a replica with `WAIT FOR LSN` first.

```sql
-- 1. On the primary: do the write and grab the commit LSN
INSERT INTO orders (customer_id, total) VALUES (42, 99.00);
SELECT pg_current_wal_lsn();
--   pg_current_wal_lsn
-- ----------------------
--   0/1A3C8F0
```

```sql
-- 2. On the replica: block until replay has caught up, then read.
--    Default mode is standby_replay, so no WITH clause needed.
WAIT FOR LSN '0/1A3C8F0' WITH (TIMEOUT '5000');
SELECT * FROM orders WHERE customer_id = 42;
```

If the timeout fires before the LSN is reached, the command returns `status = 'timeout'` and the session can decide whether to retry, fail over to the primary, or surface an error to the caller. Add `NO_THROW` if you want the timeout to be returned silently rather than as a query error.

### Mode option

`MODE` controls what "reached the LSN" means and where the wait runs:

| Mode | Where it runs | What it waits for |
|---|---|---|
| `standby_replay` | Standby (default) | WAL has been replayed up to the LSN — readable from this standby |
| `standby_write` | Standby | WAL has been written to disk on this standby |
| `standby_flush` | Standby | WAL has been flushed to durable storage on this standby |
| `primary_flush` | Primary | WAL has been flushed locally on the primary |

`primary_flush` is useful for write paths that want to confirm a commit is durable before responding to the caller without changing `synchronous_commit`. On the primary, the other three modes error with "recovery is not in progress" because they describe a standby state.

### When to use it

The standby-side pattern fits applications that already split reads onto async replicas for capacity reasons but have a small number of read paths that genuinely need to see their own writes. Typical examples:

- A user updates a setting on the primary and the next page load reads from a replica.
- A background job inserts a row and then a status checker on a replica needs to see it.
- A request that writes once and reads many times can do the write, capture the LSN, and then read from a replica without sticking the rest of the request to the primary.

For workloads where every read needs the latest data, a synchronous replica or reading from the primary is still the right answer. `WAIT FOR LSN` is for the cases where most reads can tolerate a few hundred milliseconds of replica lag but a small subset cannot.

<Admonition type="note">
The LSN you wait for is the value returned from `pg_current_wal_lsn()` or the LSN the driver surfaces alongside the commit. On a replica that is already caught up, `WAIT FOR LSN` returns `success` immediately, so the cost on a healthy system is one extra round trip rather than a stall.
</Admonition>

## Dynamic WAL Level

PostgreSQL 19 introduces automatic WAL level adjustment based on whether logical replication slots exist. The new read-only parameter `effective_wal_level` shows the actual operational WAL level:

```sql
SHOW effective_wal_level;
```

When the first logical replication slot is created, the effective WAL level automatically increases from `replica` to `logical`. When the last logical slot is removed, it drops back to `replica` asynchronously.

Previously, enabling logical replication required:

1. Set `wal_level = logical` in `postgresql.conf`
2. Restart the server
3. If you later removed all logical replication, the overhead remained until another manual change and restart

Dynamic WAL level eliminates steps 1 and 2, and automatically removes the overhead when it is no longer needed.

## 64-bit MultiXactOffset

PostgreSQL 19 widens MultiXactOffset from 32-bit to 64-bit, eliminating a wraparound risk that has bitten production databases running heavy row-level locking workloads.

### The Problem It Solves

MultiXacts are used when multiple transactions hold locks on the same row (for example, concurrent `SELECT ... FOR SHARE` queries). Each MultiXact stores a list of member transaction IDs, and the offset into this list was a 32-bit integer.

With heavy concurrent locking, the ~4 billion member limit could be exhausted. When this happened:

- New row-level locks would fail
- Emergency vacuuming was required to reclaim MultiXact space
- The database could effectively stall if vacuuming could not keep up

### The Fix

With 64-bit MultiXactOffset, the member space is effectively unlimited. The wraparound scenario that required emergency intervention is gone.

```sql
-- No syntax change needed. This query that could previously
-- cause MultiXact exhaustion under heavy concurrent load
-- is now safe:
SELECT * FROM orders WHERE status = 'pending' FOR SHARE;
-- (even with thousands of concurrent sessions)
```

The upgrade to 64-bit happens automatically when you upgrade to PostgreSQL 19 via `pg_upgrade`. The SLRU files are rewritten during the upgrade process.

## Summary

PostgreSQL 19's monitoring and operational improvements give DBAs better tools for understanding what the database is doing and why. WAL FPI tracking reveals a previously hidden cost driver. Vacuum progress details explain why vacuums run and how aggressive they are. Per-process logging lets you debug specific subsystems without flooding your logs. And the 64-bit MultiXactOffset removes a long-standing operational hazard that has caused production incidents.

## References

- [Commit `f19c0ecc`: Online enabling and disabling of data checksums](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=f19c0ecc)
- [Commit `f9a09aa2`: Add wal_fpi_bytes to pg_stat_wal](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=f9a09aa2)
- [Commit `0d789520`: Add mode and started_by columns to pg_stat_progress_vacuum](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=0d789520)
- [Commit `447aae13b`: Add WAIT FOR command for read-your-writes on async replicas](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commitdiff;h=447aae13b)
- [PostgreSQL devel docs: Monitoring stats](https://www.postgresql.org/docs/devel/monitoring-stats.html)
