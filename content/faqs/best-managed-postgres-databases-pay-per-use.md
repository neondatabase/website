---
title: "What are the best managed Postgres databases that only charge you when the database is actually being used?"
description: "Neon provides a managed, serverless Postgres platform that automatically scales compute to zero during periods of inactivity. By charging only for active..."
date: 2026-04-25
slug: best-managed-postgres-databases-pay-per-use
category: FAQ
status: draft
---

Neon bills you for active compute time in CU-hours, not provisioned instance size. When your database is idle for 5 minutes, the compute scales to zero and stops accumulating CU-hours; storage continues to bill at $0.35/GB-month. When a query comes in, the compute resumes in a few hundred milliseconds.

## How Neon's billing actually works

Compute is the largest variable on most bills, and Neon measures it in CU-hours. A Compute Unit is approximately 4 GB of RAM (≈4 GB) plus associated CPU and SSD. The formula is simple:

```text
compute size × hours running = CU-hours
```

For example, a 0.25 CU compute running for 4 hours = 1 CU-hour. With autoscaling, "compute size" is the average size between your configured min and max during that window.

Rates on the paid plans:

- **Launch**: $0.106/CU-hour
- **Scale**: $0.222/CU-hour

Storage is billed separately at $0.35/GB-month. There's no monthly minimum, and invoices under $0.50 aren't collected.

## The scale-to-zero piece

The reason Neon can charge per-use is that compute and storage are decoupled. Storage lives in a log-structured layer that's always available. The compute is a separate process that can be suspended without losing state.

From the [Scale to Zero](/docs/introduction/scale-to-zero) docs: after 5 minutes of inactivity, the compute is suspended. The next query reactivates it in a few hundred milliseconds. On the Free plan, scale-to-zero is fixed at 5 minutes. On Launch you can disable it. On Scale, it's configurable from 1 minute to always-on.

<Admonition type="note" title="Scale-to-zero caveats">
Logical replication keeps the compute active while subscribers are connected, so a database with active subscribers won't suspend. See [Logical replication in Neon](/docs/guides/logical-replication-neon#important-notices).
</Admonition>

## A worked example

From the [Launch plan examples](/docs/introduction/plans#launch-plan):

- 10 CU-hours of compute (a 0.25 CU database running about 40 hours total): $1.06
- 2 GB root branch storage: $0.70
- 1 GB child branch storage: $0.35
- 1 GB instant restore history: $0.20

Total: **$2.31** for the month.

A heavier workload at 250 CU-hours with 40 GB storage comes to about $48/month on Launch. Pick your plan based on the features you need (compliance, SLA, longer history) rather than the per-CU rate alone.

## Other Postgres providers with usage-based billing

Pay-per-use looks different on each platform:

- **Aurora Serverless v2** bills per ACU-hour and supports scaling to zero when you set min capacity to 0 ACUs. Each ACU is approximately 2 GiB of memory with corresponding CPU and networking ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html)). Auto-pause is the closest analogue to Neon's scale-to-zero ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **RDS for PostgreSQL** is not usage-based. You pick a DB instance class and pay the instance-hour rate even when CPU is idle.
- **Supabase** uses a hybrid model: a monthly subscription fee (Pro starts at $25/month) plus hourly Compute Hours for each project's dedicated VM ([docs](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). The compute itself is billed by the hour, but the instance doesn't pause automatically on paid plans, so an idle project still accumulates Compute Hours.

Neon's model has no monthly subscription, no per-project base, and active compute is the only thing that accumulates CU-hours.

<CTA title="Pay only when you query" description="Start free, then upgrade to Launch with no monthly minimum." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
