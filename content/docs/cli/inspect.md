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

Some queries read from Postgres statistics extensions. `outliers` and `calls` need [`pg_stat_statements`](/docs/extensions/pg_stat_statements), and `lfc-hit-rate` and `working-set` need the `neon` extension. If a required extension is not installed, the command reports it instead of returning rows.

<CliSubcommands command="inspect db" anchorParts="db" />

### neon inspect db table-sizes (#db-table-sizes)

Size of each table, including TOAST, largest first.

```bash
neon inspect db table-sizes
```

### neon inspect db index-sizes (#db-index-sizes)

Size of each index, largest first.

```bash
neon inspect db index-sizes
```

### neon inspect db unused-indexes (#db-unused-indexes)

Non-unique indexes with few scans. These are candidates for removal.

```bash
neon inspect db unused-indexes
```

### neon inspect db seq-scans (#db-seq-scans)

Number of sequential scans recorded against each table. A high count on a large table often points to a missing index.

```bash
neon inspect db seq-scans
```

### neon inspect db long-running-queries (#db-long-running-queries)

Queries that have been running longer than five minutes.

```bash
neon inspect db long-running-queries
```

### neon inspect db locks (#db-locks)

Locks currently held, with the query that acquired each one and its age.

```bash
neon inspect db locks
```

### neon inspect db outliers (#db-outliers)

Queries that take the most cumulative execution time. Needs the `pg_stat_statements` extension.

```bash
neon inspect db outliers
```

### neon inspect db calls (#db-calls)

Most frequently called queries. Needs the `pg_stat_statements` extension.

```bash
neon inspect db calls
```

### neon inspect db lfc-hit-rate (#db-lfc-hit-rate)

Local File Cache hit rate. Needs the `neon` extension.

```bash
neon inspect db lfc-hit-rate
```

### neon inspect db working-set (#db-working-set)

Estimated working set size compared with the Local File Cache size. Needs the `neon` extension.

```bash
neon inspect db working-set
```

### neon inspect db vacuum-stats (#db-vacuum-stats)

Autovacuum status per table: last (auto)vacuum time, dead tuples, and the autovacuum threshold.

```bash
neon inspect db vacuum-stats
```

### neon inspect db bloat (#db-bloat)

Estimated table and index bloat. This is a statistical estimate and needs no extension.

```bash
neon inspect db bloat
```

### neon inspect db replication-slots (#db-replication-slots)

Replication slots with their kind, status, client, restart and confirmed-flush LSNs, and lag.

```bash
neon inspect db replication-slots
```

### neon inspect db subscriptions (#db-subscriptions)

Per-table logical replication progress on this subscriber.

```bash
neon inspect db subscriptions
```
