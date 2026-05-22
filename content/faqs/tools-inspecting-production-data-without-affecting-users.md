---
title: "What tools allow inspecting production data without affecting users?"
date: 2026-04-25
description: "Neon branches and read replicas let you query a copy of production Postgres data without adding load to the database your users are hitting."
slug: tools-inspecting-production-data-without-affecting-users
category: FAQ
status: draft
---

## Short answer

You have two safe ways to inspect production data on Neon. Create a [branch](/docs/introduction/branching) for an isolated copy with its own compute, or attach a [read replica](/docs/guides/read-replicas) to your existing branch. Both run on separate compute from your production endpoint, so analytics queries don't slow down user-facing traffic.

## Branches: a separate copy with its own compute

A Neon branch is a copy-on-write fork of your data. Creating one takes a second or two, adds no initial storage, and the new compute is independent of your production compute. Heavy queries on the branch don't touch the primary.

```bash
# Make a branch you can query freely
neon branches create --name analytics --parent main
neon connection-string analytics
```

Point Metabase, a notebook, or `psql` at the branch's connection string. When you're done, delete the branch:

```bash
neon branches delete analytics
```

Branches are included on all plans: 10/project on Free and Launch, 25 on Scale. Extra branches cost $1.50/branch-month (about $0.002/hour).

## Read replicas: same data, separate compute

If you want the live state of production rather than a point-in-time fork, add a read replica. The replica reads from the same storage as your primary, but runs on its own compute, so analytics queries and BI dashboards don't compete with application traffic.

```bash
neon branches add-compute main --type read_only
```

Use the read-only endpoint's connection string for read traffic. Replicas count toward CU-hour usage like any other compute.

## When to pick which

| Use case                                      | Branch | Read replica |
| --------------------------------------------- | :----: | :----------: |
| Reproducing a bug at a specific point in time |   x    |              |
| Running migrations against real data          |   x    |              |
| Live BI dashboards                            |        |      x       |
| Offloading reporting queries                  |        |      x       |

<Admonition type="tip" title="Mask sensitive data first">
If you're sharing the connection string with non-engineering teammates, anonymize or drop PII on the branch before they connect. See the [data anonymization guide](/docs/guides/branching-test-queries).
</Admonition>

## How other Postgres platforms handle this

- **AWS RDS for PostgreSQL**: Create a read replica or restore a snapshot to a new instance. A read replica reduces load on the primary but adds full instance cost. Restoring a snapshot can take minutes to hours for large databases ([RDS resilience](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/disaster-recovery-resiliency.html)).
- **Supabase**: [Read Replicas](https://supabase.com/docs/guides/platform/read-replicas) are available on Pro, Team, and Enterprise plans and require at least a Small compute add-on. Each replica inherits the primary's compute size and is billed as separate Compute Hours. Supabase branches don't carry over production data by default; you populate them from a `seed.sql` ([branching](https://supabase.com/docs/guides/deployment/branching)).
- **AWS Aurora Serverless v2**: Add reader instances to a cluster and offload read traffic to them. The readers can pause independently when configured for auto-pause ([Aurora replicas](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Integrating.AutoScaling.html)).

The trade-offs are similar: every option separates the read workload from the primary compute. The main difference with Neon is that a branch starts copy-on-write from production data instantly, so you can inspect or even write against real data without affecting users.

<CTA title="Spin up a branch" description="Create a project, branch your data, and query a copy without touching production." buttonText="Try Neon" buttonUrl="https://console.neon.tech/signup" />
