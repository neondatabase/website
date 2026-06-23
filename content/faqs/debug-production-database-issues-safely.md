---
title: "What tools are used to debug production database issues safely?"
description: "Use Neon branches and read replicas to investigate production issues without affecting live traffic. Both run on isolated compute."
date: 2026-04-25
slug: debug-production-database-issues-safely
category: FAQ
status: draft
---

The safe way to debug production is to put the diagnostic queries on separate compute from the user-facing workload. Neon gives you two ways to do that: branches for full read/write isolation, and read replicas for read-only investigation against live data.

## Read replicas for live diagnostics

A Neon read replica is a separate compute that reads from the same storage as the primary. Open a long `EXPLAIN ANALYZE`, run an expensive aggregation, or attach a slow analytics query to a replica without touching the primary compute.

Create one from the console or CLI:

```bash
neon branches add-compute main --type read_only
```

Replicas autoscale independently from the primary, so a heavy diagnostic query can run on a 4 CU replica while production stays at 1 CU. See [Read replicas](https://neon.com/docs/introduction/read-replicas).

## Branches for write-heavy debugging

If you need to test a fix (apply a migration, rebuild an index, modify rows), branch from the current state of `main`:

```bash
neon branches create --name debug-slow-query --parent main
```

The branch runs on its own compute and uses copy-on-write storage, so writes don't affect production. You can also branch from a point in the past if the bad state has already been overwritten:

```bash
neon branches create --name pre-deploy \
  --parent 2026-04-25T08:00:00Z
```

History window: 6 hours on Free, up to 7 days on Launch, up to 30 days on Scale.

## Inspect what's running right now

Before reaching for a branch, the Neon Console's [Monitoring page](https://neon.com/docs/introduction/monitoring-page) shows live connection counts, CPU, and active sessions. For deeper inspection, the `pg_stat_statements` extension is enabled by default:

```sql
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

<Admonition type="tip">
Mark production as a [protected branch](https://neon.com/docs/guides/protected-branches) on Launch and Scale to prevent accidental writes during debugging sessions.
</Admonition>

## How other providers compare for safe debugging

- **AWS RDS / Aurora**: read replicas are available and run on separate compute, see the [RDS read replica docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html). For write-side debugging, the standard path is [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html) into a new instance, which takes minutes and adds full instance and storage cost until you tear it down.
- **Supabase**: [read replicas](https://supabase.com/docs/guides/platform/read-replicas) are available for projects on Pro and above. Write-side debugging means restoring a PITR backup into the project (a paid add-on) or creating a [preview branch](https://supabase.com/docs/guides/deployment/branching), which won't include your production data.

Neon's combination of read replicas (live, no separate storage cost) and copy-on-write branches (writable, full data shape, seconds to create) covers both read-only diagnostics and write-side experiments on the same platform.

<CTA title="Debug Postgres safely with Neon" description="Branches and read replicas included on every plan." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
