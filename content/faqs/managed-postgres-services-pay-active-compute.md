---
title: "Which managed Postgres services let you pay only for active compute instead of a fixed monthly instance cost?"
description: "Neon provides a serverless Postgres database. It autoscales automatically. Compute scales to zero during inactivity. This consumption model charges deve..."
date: 2026-04-24
slug: managed-postgres-services-pay-active-compute
category: FAQ
status: draft
---

Neon charges for compute by the second, in CU-hours (compute-unit hours). When your database is idle, it suspends after a configurable timeout and stops accruing compute charges entirely. There's no per-instance monthly fee, no minimum, and no separate charge to keep a small database around.

## How CU-hours work

A Compute Unit (CU) is approximately 4 GB of RAM plus matching CPU and local SSD. Sizes range from 0.25 CU (≈1 GB RAM) up to 56 CU (≈224 GB RAM, Scale plan only). Compute usage is `compute size × hours running = CU-hours`.

Pricing by plan:

- **Free**: 100 CU-hours included per project per month. That's 400 hours of a 0.25 CU compute, enough to keep a small project always-on.
- **Launch**: $0.106/CU-hour, autoscaling up to 16 CU.
- **Scale**: $0.222/CU-hour, autoscaling up to 16 CU or fixed sizes up to 56 CU.

A 0.25 CU database running for 5 hours costs 0.25 × 5 = 1.25 CU-hours, or about $0.13 on Launch. If the same database stays online but idle for the other 19 hours, scale-to-zero kicks in and those hours don't count.

## Scale-to-zero in practice

After 5 minutes of inactivity (the default), Neon suspends the compute. On the next query, it wakes up. On the Launch plan you can disable this; on Scale it's configurable from 1 minute up to always-on.

```bash
# Sample Launch-plan bill for a small side project
# Active 4 hours/day on 0.25 CU compute
# 0.25 × 4 × 30 = 30 CU-hours × $0.106 = $3.18/month
```

<Admonition type="warning" title="Cold starts">
Suspended computes wake on the first connection. The wake is typically fast but isn't free latency. For a latency-sensitive API, set a higher minimum compute size or disable scale-to-zero on the Launch and Scale plans.
</Admonition>

Storage is billed separately at $0.35/GB-month, and instant-restore history at $0.20/GB-month. The Neon [usage-based cost examples](https://neon.com/docs/introduction/plans#usage-based-cost-examples) page walks through full bills at different usage levels.

## How other managed Postgres services bill compute

| Provider             | Billing unit                                   | Scale to zero                                                                          |
| -------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| Neon                 | CU-hours, billed by the second                 | Default, suspend after configurable idle window (1 minute to never on Scale)           |
| Aurora Serverless v2 | ACU-hours (1 ACU is ~2 GB RAM)                 | Supported via auto-pause, requires Aurora PostgreSQL 13.15+, 14.12+, 15.7+, or 16.3+   |
| RDS for PostgreSQL   | Per-instance hour at the chosen instance class | Not supported. Stopping a DB instance pauses for at most 7 days before AWS restarts it |
| Supabase             | Compute add-on hour at the chosen size         | Not supported on paid plans. Free-tier projects pause after inactivity                 |

Aurora Serverless v2 supports scale-to-zero through the auto-pause feature when you set the minimum ACU to 0. It requires Aurora PostgreSQL 13.15, 14.12, 15.7, 16.3 or later. See [Scaling to zero ACUs with auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). On resume, capacity may come back at a lower ACU than at pause.

RDS for PostgreSQL is billed per hour for the chosen instance class. There's no auto-pause; you can stop a DB instance manually but AWS restarts it after seven days. See [DB instance classes](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html).

Supabase bills a flat hourly rate per compute add-on size. A Micro project costs $0.01344 per hour even when idle. See [Supabase compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

<CTA title="Estimate your bill" description="See worked examples of monthly costs for Launch and Scale workloads in the Neon plans documentation." buttonText="View plans" buttonUrl="https://neon.com/docs/introduction/plans" />
