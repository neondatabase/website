---
title: "What tools are used to debug production database issues safely?"
description: "Use Neon branches and read replicas to investigate production issues without affecting live traffic. Both run on isolated compute."
date: 2026-04-25
slug: debug-production-database-issues-safely
category: FAQ
status: draft
previousLink:
  title: 'What databases support disposable Postgres instances for testing?'
  slug: databases-support-disposable-postgres-instances-testing
nextLink:
  title: 'How do I delete a database in Neon?'
  slug: delete-database-neon
---

The safe way to debug production is to run diagnostic queries on compute that doesn't serve your users. Lakebase Postgres gives you two ways to do that: read replicas for read-only investigation against live data, and branches for experiments that write.

## Read replicas for live diagnostics

A read replica is a separate read-only compute that reads from the same storage as the primary compute, so no data is copied. Run a long `EXPLAIN ANALYZE`, an expensive aggregation, or a slow analytics query on the replica, and the primary compute doesn't do the work.

Create one from the Console or the CLI. The examples on this page use `production`, the default branch name for projects created in the Console. Projects created with the CLI or API name it `main`.

```bash
neon branches add-compute production --type read_only
```

Each replica has its own compute size and autoscaling settings, so a heavy diagnostic query can run on a larger replica while production stays at its usual size. The Free plan allows up to 3 read replicas per project. See [Read replicas](/docs/introduction/read-replicas).

## Branches for write-heavy debugging

To test a fix (apply a migration, rebuild an index, modify rows), branch from the current state of production:

```bash
neon branches create --name debug-slow-query --parent production
```

The branch runs on its own compute and uses copy-on-write storage, so writes on the branch don't touch production. If the bad state has already been overwritten, branch from a point in the past with an RFC 3339 timestamp:

```bash
neon branches create --name pre-deploy \
  --parent 2026-04-25T08:00:00Z
```

How far back you can go depends on your [history window](/docs/postgres/backup-restore/history-window): up to 6 hours on the Free plan, up to 7 days on the Launch plan, and up to 30 days on the Scale plan.

## Inspect what's running right now

Before you create a branch, check the [Monitoring page](/docs/introduction/monitoring-page) in the Neon Console. It graphs CPU, active and idle connections, and other metrics for each compute. For per-query stats, install `pg_stat_statements` if it isn't already enabled:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

See [Optimize Postgres query performance](/docs/postgresql/query-performance).

<Admonition type="tip">
On the Launch and Scale plans, mark production as a [protected branch](/docs/guides/protected-branches). Protected branches can't be deleted or reset, which guards against a wrong command during debugging.
</Admonition>

## How other providers compare

- **AWS RDS and Aurora**: [read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html) run on separate instances. For write-side debugging on RDS, you [restore to a point in time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html), which creates a new DB instance that you pay for until you delete it. Aurora also offers [cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html), which uses copy-on-write storage to create a new cluster from production data.
- **Supabase**: [read replicas](https://supabase.com/docs/guides/platform/read-replicas/getting-started) are available on the Pro, Team, and Enterprise plans for projects on at least a Small compute, and each replica inherits the primary's compute size. For write-side debugging, [Restore to a new project](https://supabase.com/docs/guides/platform/clone-project) (beta, paid plans) copies your data into a separate project. [Preview branches](https://supabase.com/docs/guides/deployment/branching) start from migrations and seed data, and [dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data if you have the PITR add-on. An in-place [PITR restore](https://supabase.com/docs/guides/platform/backups) makes the project inaccessible while it runs.

In Lakebase Postgres, read replicas share storage with the primary, and branches carry a full copy-on-write view of production data, so both read-only diagnostics and write-side experiments run without a separate restore step.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Debug Postgres safely with Neon" description="Branches and read replicas are included on every plan." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
