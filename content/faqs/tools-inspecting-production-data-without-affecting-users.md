---
title: "What tools allow inspecting production data without affecting users?"
date: 2026-04-25
description: "Lakebase Postgres branches and read replicas let you query a copy of production data without adding load to the database your users are hitting."
slug: tools-inspecting-production-data-without-affecting-users
category: FAQ
status: draft
previousLink:
  title: 'Which tools allow using Postgres without managing infrastructure?'
  slug: tools-for-serverless-postgres-infrastructure
nextLink:
  title: 'What tools isolate database changes per branch in modern development workflows?'
  slug: tools-isolate-database-changes-branch-development
---

Neon gives you two ways to inspect production data without touching the compute your users hit. Create a [branch](/docs/introduction/branching) for an isolated, writable copy with its own compute, or add a [read replica](/docs/introduction/read-replicas) to your production branch for read-only access to live data. Either way, heavy queries run on separate compute, so they don't slow down user-facing traffic.

## Branches

A branch is a copy-on-write clone of your data. Creating one doesn't copy data, so it takes seconds and adds no storage until the branch diverges from its parent ([branching](/docs/introduction/branching)). The branch gets its own compute, and queries on it don't use your production compute.

```bash
# Create a branch from your default branch
neon branches create --name analytics
neon connection-string analytics
```

Point Metabase, a notebook, or `psql` at the branch's connection string. When you're done, delete the branch:

```bash
neon branches delete analytics
```

Every plan includes branches: 10 per project on the Free plan and Launch plan, 25 on the Scale plan. Extra branches on paid plans cost $1.50/branch-month, prorated hourly (about $0.002/hour) ([extra branches](/docs/introduction/plans#extra-branches)).

## Read replicas

If you want the live state of production rather than a snapshot from when you branched, add a read replica. A replica is a read-only compute that serves queries from the same storage as your primary compute. No data is copied, and BI dashboards on the replica don't compete with application traffic for CPU and memory ([read replicas](/docs/introduction/read-replicas)).

```bash
neon branches add-compute production --type read_only
neon connection-string production --endpoint-type read_only
```

Replace `production` with your branch name if yours is `main`. Replica compute counts toward CU-hour usage like any other compute, and replicas support autoscaling and scale to zero. See [Create and manage read replicas](/docs/guides/read-replica-guide).

## When to pick which

| Use case                                      | Branch | Read replica |
| --------------------------------------------- | :----: | :----------: |
| Reproducing a bug at a specific point in time |   x    |              |
| Running migrations against real data          |   x    |              |
| Live BI dashboards                            |        |      x       |
| Offloading reporting queries                  |        |      x       |

<Admonition type="tip" title="Mask sensitive data first">
If you're sharing the connection string with non-engineering teammates, create an [anonymized branch](/docs/workflows/data-anonymization) (beta) and define masking rules so PII is replaced before they connect.
</Admonition>

## How other Postgres services handle this

- **AWS RDS for Postgres**: Create a read replica, or restore a snapshot to a new DB instance. Read replicas are billed as standard DB instances at the same rate as the replica's instance class ([RDS read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)). A snapshot restore also creates a separate instance that bills until you delete it ([restore from a snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html)).
- **Supabase**: Read Replicas are available on the Pro, Team, and Enterprise plans and require at least a Small compute add-on. Each replica inherits the primary's compute size ([getting started with Read Replicas](https://supabase.com/docs/guides/platform/read-replicas/getting-started)) and appears as Replica Compute Hours on your invoice; Compute Credits don't apply ([Read Replica usage](https://supabase.com/docs/guides/platform/manage-your-usage/read-replicas)). New branches don't include production data by default. You can seed them from a `seed.sql`, or, with the PITR add-on, turn on **Include data** when creating a branch in the dashboard, which is in public alpha ([branching via the dashboard](https://supabase.com/docs/guides/deployment/branching/dashboard)).
- **AWS Aurora Serverless v2**: Add reader instances to the cluster and send read traffic to them. With the cluster's minimum capacity set to 0 ACUs, readers with failover priority 2 to 15 can auto-pause independently of the writer ([Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).

All of these separate the read workload from the primary compute. A Neon branch also gives you a writable copy of production data in seconds, so you can test a write or a migration against real rows without affecting users.

<CTA title="Spin up a branch" description="Create a project, branch your data, and query a copy without touching production." buttonText="Try Neon" buttonUrl="https://console.neon.tech/signup" />
