---
title: "What databases help isolate bugs without downtime?"
description: "Neon's database branches give you an isolated copy of production data for debugging, with no impact on the live database."
date: 2026-04-25
slug: databases-isolate-bugs-without-downtime
category: FAQ
status: draft
---

When you need to reproduce a bug against production data, the safe move is to copy production into a separate database first. Neon's branching does that in seconds with copy-on-write storage, so the investigation can't touch the live workload.

## Branch production, then debug on the branch

A branch is a clone of your database at a point in time. It runs on its own compute, so heavy diagnostic queries don't compete with production traffic.

```bash
neon branches create --name debug-issue-1234 --parent main
neon connection-string debug-issue-1234
```

Now you can:

- Run a slow `EXPLAIN ANALYZE` without slowing down users
- Drop and re-add indexes to test query plans
- Reproduce a failed migration end-to-end

Creating the branch doesn't increase load on the parent, and writes on the branch don't affect production. When you're done, delete the branch.

## Branch from a point in the past

If the bug already happened in production, branch from before the bad data was written. The history window is 6 hours on Free, up to 7 days on Launch, and up to 30 days on Scale. See [Instant restore](https://neon.com/docs/introduction/branch-restore) for how to choose a timestamp or LSN.

```bash
neon branches create --name pre-incident --parent 2026-04-25T09:00:00Z
```

You can connect that branch to a staging app, dump the rows you care about, and compare against current production, all without touching the primary compute.

## Costs

Branches included in your plan: 10 on Free and Launch, 25 on Scale. Extra branches are $1.50/branch-month, prorated hourly to roughly $0.002/hour. A debug branch that lives for two hours costs about half a cent in branch fees, plus whatever compute and storage delta it consumes.

<Admonition type="tip">
Mark production as a [protected branch](https://neon.com/docs/guides/protected-branches) on Launch and Scale to block accidental deletion or reset.
</Admonition>

## How this compares to other options

- **AWS RDS for PostgreSQL**: to debug against prod data without affecting prod, the standard path is [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html) into a new DB instance. The new instance has its own full storage and instance-hour bill, and restore takes minutes to hours depending on data size.
- **Aurora Serverless v2**: same restore model. Restoring is creating a new cluster from a snapshot or PITR, not a copy-on-write fork.
- **Supabase**: [preview branches](https://supabase.com/docs/guides/deployment/branching) give you a separate database, but they do not include data from your main project. You'd seed the branch and then reproduce the bug against synthetic data.

Branching is well suited to debugging because it gives you a writable copy of real data on isolated compute in seconds, without provisioning a new instance.

<CTA title="Isolate debugging on Neon branches" description="Sign up free and try branching against your own data." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
