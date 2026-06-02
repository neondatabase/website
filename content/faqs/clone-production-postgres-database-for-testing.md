---
title: "Which database services let you instantly clone a production Postgres database so developers can test independently?"
description: "Neon branches are instant Postgres database clones. Each branch shares storage with the parent until you write to it, so cloning a 100 GB database doesn't take 100 GB of new storage."
date: 2026-04-25
slug: clone-production-postgres-database-for-testing
category: FAQ
status: draft
---

Neon does this with branching. A branch is a full Postgres database that starts as a pointer to the parent's data. No bytes are copied at branch time, so cloning a 50 GB production database takes a second or two regardless of size. Each developer can have their own branch and write to it without affecting production.

## How a branch differs from a backup restore

A branch shares storage with its parent until you change something. Once you write to the branch, Neon records a delta. You're billed for the smaller of the delta or the branch's logical data size, so a child branch never costs more than a full copy. Production reads aren't affected by branch creation. See [Branching](/docs/introduction/branching).

Create a branch from the CLI:

```bash
neon branches create \
  --name testing-payment-bug \
  --parent main \
  --project-id <project-id>
```

You can also branch from a specific point in time, which is useful for reproducing a bug from yesterday's data:

```bash
neon branches create \
  --name repro-bug-1234 \
  --parent 2026-04-24T15:00:00Z
```

## Keep dev branches short-lived

Branches can auto-delete after **1 hour, 1 day, 7 days**, or a custom timestamp. The console checks the 1-day box by default. Use this on CI and per-developer branches so storage doesn't accumulate. See [Branch expiration](/docs/guides/branch-expiration).

<Admonition type="warning" title="Production data needs care">
A clone of production is still production data. If you're testing against real customer rows, use [protected branches](/docs/guides/protected-branches) on Launch and Scale plans, or anonymize the data on the branch before sharing it broadly.
</Admonition>

## How other Postgres services compare

- **Supabase** branches create a separate environment with its own Postgres instance, but new branches are **data-less by default** ([docs](https://supabase.com/docs/guides/deployment/branching)). To start a branch with data, you ship a seed file with the GitHub integration. That's safer for production privacy but doesn't give you a true production clone for reproducing bugs against real rows.
- **Aurora Serverless v2** can create a clone of a cluster via the `RestoreDBClusterToPointInTime` API, which is fast because the cloned cluster initially shares storage with the source. Auto-pause on supported engine versions keeps the clone's idle cost low ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **RDS for PostgreSQL** supports point-in-time recovery to a new instance, which copies the full snapshot. Clones aren't instant and storage is duplicated, so cloning a 100 GB database costs 100 GB more.

If your test workflow depends on real production data, Neon's copy-on-write branches and Aurora's cluster clones are the two architectures designed for this. Neon's per-branch billing (delta-only) tends to be cheaper for short-lived dev branches.

<CTA title="Clone production in a second" description="Branching is available on every plan, including Free." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
