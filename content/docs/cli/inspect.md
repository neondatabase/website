---
title: 'Neon CLI command: inspect'
subtitle: Run diagnostic queries against a branch's Postgres to check its health and configuration
summary: >-
  The Neon CLI `neon inspect` command runs read-only diagnostic queries
  against a branch's Postgres, reporting on table and index sizes, unused
  indexes, locks, long-running and expensive queries, cache hit rates,
  autovacuum status, bloat, and replication. Use it to troubleshoot
  performance and understand what a database is doing without leaving the
  terminal.
enableTableOfContents: true
---

The `inspect` command runs a set of read-only diagnostic queries against a branch's Postgres and prints the results. Each query targets a common operational question, such as which tables are largest, which indexes go unused, what is holding locks, or how the cache is performing. Nothing is modified, so the command is safe to run against any branch.

<CliSubcommands command="inspect" />

## neon inspect db (#db)

Run a single diagnostic query against a branch's Postgres. Pick the query with a subcommand, for example `neon inspect db table-sizes`.

<CliUsage command="inspect db" />

<CliOptions command="inspect db" />

By default the command resolves the project, branch, database, and role from your [context](/docs/cli/set-context) and connects through the Neon API. Pass `--db-url` to inspect any Postgres directly from a connection string, which bypasses API resolution and lets you point `inspect` at a database outside Neon.

Some queries read from Postgres statistics extensions. `outliers` and `calls` need [`pg_stat_statements`](/docs/extensions/pg_stat_statements), and `lfc-hit-rate` and `working-set` need the [`neon`](/docs/extensions/neon) extension. If a required extension is not installed, the command reports it instead of returning rows.

<CliSubcommands command="inspect db" anchorParts="db" />

### neon inspect db table-sizes (#db-table-sizes)

Size of each table, including TOAST, largest first.

```bash
neon inspect db table-sizes
```

```text
┌────────┬───────────┬─────────┐
│ Schema │ Name      │ Size    │
├────────┼───────────┼─────────┤
│ public │ events    │ 16 MB   │
├────────┼───────────┼─────────┤
│ public │ orders    │ 4752 kB │
├────────┼───────────┼─────────┤
│ public │ customers │ 1616 kB │
└────────┴───────────┴─────────┘
```

### neon inspect db index-sizes (#db-index-sizes)

Size of each index, largest first.

```bash
neon inspect db index-sizes
```

### neon inspect db unused-indexes (#db-unused-indexes)

Non-unique, non-primary-key indexes with fewer than 50 scans, largest first. These are candidates for removal. Check the `Index Scans` column: an index that has never been scanned (`0`) while taking up space is a strong candidate to drop.

```bash
neon inspect db unused-indexes
```

```text
┌──────────────────┬────────────────────────┬────────────┬─────────────┐
│ Table            │ Index                  │ Index Size │ Index Scans │
├──────────────────┼────────────────────────┼────────────┼─────────────┤
│ public.events    │ events_created_at_idx  │ 1368 kB    │ 0           │
├──────────────────┼────────────────────────┼────────────┼─────────────┤
│ public.orders    │ orders_customer_id_idx │ 1024 kB    │ 2           │
├──────────────────┼────────────────────────┼────────────┼─────────────┤
│ public.customers │ customers_email_idx    │ 808 kB     │ 0           │
├──────────────────┼────────────────────────┼────────────┼─────────────┤
│ public.orders    │ orders_status_idx      │ 560 kB     │ 20          │
└──────────────────┴────────────────────────┴────────────┴─────────────┘
```

### neon inspect db seq-scans (#db-seq-scans)

Number of sequential scans recorded against each table, highest first. A high count on a large table often points to a missing index.

```bash
neon inspect db seq-scans
```

### neon inspect db long-running-queries (#db-long-running-queries)

Queries that have been running longer than five minutes. Run it to catch a runaway statement. When nothing qualifies, it says so instead of printing an empty table:

```bash
neon inspect db long-running-queries
```

```text
No long-running queries.
```

### neon inspect db locks (#db-locks)

Locks currently held, with the query that acquired each one and its age. When writes are blocked, run this to find what is holding the lock.

```bash
neon inspect db locks
```

```text
No locks held.
```

### neon inspect db outliers (#db-outliers)

The top 25 queries by cumulative execution time (`Total Exec Time`), with each query's share of the total (`Prop Exec Time`) and how often it ran (`Ncalls`). This ranks by total time spent, so a cheap query that runs constantly can outrank an expensive one that runs rarely. Needs the [`pg_stat_statements`](/docs/extensions/pg_stat_statements) extension.

```bash
neon inspect db outliers
```

<details>
<summary>Show output</summary>

```text
┌─────────────────┬────────────────┬────────┬───────────────────────────────────────────────────────────────────────┐
│ Total Exec Time │ Prop Exec Time │ Ncalls │ Query                                                                 │
├─────────────────┼────────────────┼────────┼───────────────────────────────────────────────────────────────────────┤
│ 00:00:00.875831 │ 57.0%          │ 250    │ SELECT * FROM orders WHERE customer_id = $1                           │
├─────────────────┼────────────────┼────────┼───────────────────────────────────────────────────────────────────────┤
│ 00:00:00.439406 │ 28.6%          │ 400    │ SELECT * FROM customers WHERE email = $1                              │
├─────────────────┼────────────────┼────────┼───────────────────────────────────────────────────────────────────────┤
│ 00:00:00.220669 │ 14.4%          │ 15     │ SELECT status, count(*), sum(total_cents) FROM orders GROUP BY status │
└─────────────────┴────────────────┴────────┴───────────────────────────────────────────────────────────────────────┘
```

</details>

### neon inspect db calls (#db-calls)

The top 25 queries by call count (`Ncalls`). Where `outliers` ranks by total time, this ranks by how often a query runs, so it highlights hot paths worth caching or batching even when each individual call is cheap. Needs the [`pg_stat_statements`](/docs/extensions/pg_stat_statements) extension.

```bash
neon inspect db calls
```

<details>
<summary>Show output</summary>

```text
┌────────┬─────────────────┬────────────────┬───────────────────────────────────────────────────────────────────────┐
│ Ncalls │ Total Exec Time │ Prop Exec Time │ Query                                                                 │
├────────┼─────────────────┼────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 400    │ 00:00:00.439406 │ 59.8%          │ SELECT * FROM customers WHERE email = $1                              │
├────────┼─────────────────┼────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 250    │ 00:00:00.875831 │ 37.4%          │ SELECT * FROM orders WHERE customer_id = $1                           │
├────────┼─────────────────┼────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 15     │ 00:00:00.220669 │ 2.2%           │ SELECT status, count(*), sum(total_cents) FROM orders GROUP BY status │
└────────┴─────────────────┴────────────────┴───────────────────────────────────────────────────────────────────────┘
```

</details>

### neon inspect db lfc-hit-rate (#db-lfc-hit-rate)

Local File Cache hit rate, the share of reads served from Neon's Local File Cache instead of storage. A low or falling ratio means your working set no longer fits in the cache. Read it after the compute has handled some traffic, not on a freshly resumed one. Needs the [`neon`](/docs/extensions/neon) extension.

```bash
neon inspect db lfc-hit-rate
```

### neon inspect db working-set (#db-working-set)

Estimated working set size over several time windows, compared with the Local File Cache size. When `Exceeds Lfc` is `no`, your recent data fits in cache. A `yes` means the working set has outgrown the cache, and a larger compute may help. Needs the [`neon`](/docs/extensions/neon) extension.

```bash
neon inspect db working-set
```

```text
┌────────┬─────────────┬──────────┬─────────────┐
│ Window │ Working Set │ Lfc Size │ Exceeds Lfc │
├────────┼─────────────┼──────────┼─────────────┤
│ 1m     │ 48 MB       │ 607 MB   │ no          │
├────────┼─────────────┼──────────┼─────────────┤
│ 5m     │ 48 MB       │ 607 MB   │ no          │
├────────┼─────────────┼──────────┼─────────────┤
│ 15m    │ 48 MB       │ 607 MB   │ no          │
├────────┼─────────────┼──────────┼─────────────┤
│ 1h     │ 48 MB       │ 607 MB   │ no          │
└────────┴─────────────┴──────────┴─────────────┘
```

### neon inspect db vacuum-stats (#db-vacuum-stats)

Autovacuum status per table: last (auto)vacuum time, dead tuples, and the autovacuum threshold, ordered by dead tuples. Rising dead tuples with no recent autovacuum points at autovacuum falling behind.

```bash
neon inspect db vacuum-stats
```

<Admonition type="note" title="Vacuum stats reset on auto-suspend">
Postgres resets these counters whenever the compute restarts, including after a scale-to-zero auto-suspend. On a freshly resumed compute they start near empty, so read them after the database has handled some real traffic.
</Admonition>

### neon inspect db bloat (#db-bloat)

The top 25 tables by estimated wasted bytes. It needs no extension. The number is a statistical estimate, so use it to decide where to look, not as an exact measurement.

```bash
neon inspect db bloat
```

### neon inspect db replication-slots (#db-replication-slots)

Replication slots with their kind, status, client, restart and confirmed-flush LSNs, and lag. Check the lag and status columns to see how far each replica or subscriber is behind the primary.

```bash
neon inspect db replication-slots
```

### neon inspect db subscriptions (#db-subscriptions)

Per-table logical replication progress on this subscriber. Run it on a database with a subscription to see which tables are still copying and which have caught up. On other databases it reports that no subscriptions were found.

```bash
neon inspect db subscriptions
```
