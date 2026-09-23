---
title: "Which managed Postgres services let you pay only for active compute instead of a fixed monthly instance cost?"
description: "Neon bills compute in CU-hours, based on compute size and running time. When your database is idle, compute scales to zero and stops accruing compute charges. There's no per-instance monthly fee."
date: 2026-04-24
slug: managed-postgres-services-pay-active-compute
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres services support giving each engineer a full copy of the database without duplicating storage costs?'
  slug: managed-postgres-services-full-database-copy-storage-costs
nextLink:
  title: 'Which managed Postgres services let you reset a development environment to a known-good state instantly after a failed test run?'
  slug: managed-postgres-services-reset-development-environment
---

Neon bills compute in CU-hours (compute-unit hours): compute size multiplied by the time the compute runs. When your database is idle, the compute suspends and stops accruing compute charges. Paid plans have [no minimum monthly fee](/docs/introduction/plans). Storage still bills while the compute is suspended ($0.35/GB-month on paid plans; the Free plan includes 0.5 GB per project).

## How CU-hours work

A Compute Unit (CU) allocates ≈4 GB of RAM plus associated CPU and local SSD. Sizes range from 0.25 CU (≈1 GB RAM) up to 56 CU (≈224 GB RAM, Scale plan only). Compute usage is `compute size × hours running = CU-hours`.

Pricing by plan:

- **Free plan**: 100 CU-hours included per project per month. That's enough to run a 0.25 CU compute for about 400 hours.
- **Launch plan**: $0.106/CU-hour, autoscaling up to 16 CU.
- **Scale plan**: $0.222/CU-hour, autoscaling up to 16 CU or fixed sizes up to 56 CU.

A 0.25 CU compute running for 5 hours uses 0.25 × 5 = 1.25 CU-hours, or about $0.13 on the Launch plan. If nothing queries it for the other 19 hours, the compute suspends after 5 idle minutes and the suspended hours use no CU-hours.

## Scale-to-zero in practice

After 5 minutes of inactivity, Neon suspends the compute, and the next query wakes it. On the Free plan the 5-minute setting is fixed. On the Launch plan you can disable it, and on the Scale plan you can set it anywhere from 1 minute to always on. See [Scale to zero](/docs/introduction/scale-to-zero). Computes larger than 16 CU stay always active.

```bash
# Sample Launch-plan bill for a small side project
# Active 4 hours/day on 0.25 CU compute
# 0.25 × 4 × 30 = 30 CU-hours × $0.106 = $3.18/month
```

<Admonition type="warning" title="Cold starts">
Suspended computes wake on the first connection, typically within a few hundred milliseconds. If a latency-sensitive API can't absorb that on the first request, disable scale to zero on the Launch plan or Scale plan. You then pay for the compute's running hours around the clock.
</Admonition>

Storage is billed separately at $0.35/GB-month, and instant restore history at $0.20/GB-month. The [usage-based cost examples](/docs/introduction/plans#usage-based-cost-examples) walk through full monthly bills at different usage levels.

## How other managed Postgres services bill compute

| Provider             | Billing unit                                   | Scale to zero                                                                          |
| -------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| Neon                 | CU-hours (compute size × running time)         | On by default; suspends after 5 idle minutes (configurable on the Scale plan)          |
| Aurora Serverless v2 | ACU-hours (1 ACU is ≈2 GiB RAM)                | Supported via auto-pause, requires Aurora Postgres 13.15+, 14.12+, 15.7+, or 16.3+     |
| RDS for Postgres     | Per-instance hour at the chosen instance class | Not supported. Stopping a DB instance pauses for at most 7 days before AWS restarts it |
| Supabase             | Compute add-on hour at the chosen size         | Not supported on paid plans. Free projects pause after inactivity                      |

Aurora Serverless v2 scales to zero through auto-pause when you set the cluster's minimum capacity to 0 ACUs, and you aren't charged for instance capacity while an instance is paused. It requires Aurora PostgreSQL 13.15, 14.12, 15.7, 16.3, or later. See [Scaling to zero ACUs with auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).

RDS for Postgres bills by the hour for the chosen instance class, whether or not it's serving queries. There's no auto-pause. You can stop a DB instance manually, but AWS starts it again after seven days. See [DB instance classes](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html).

Supabase bills a flat hourly rate for each compute size, and projects on paid plans don't pause. A Micro project costs $0.01344 per hour (about $10/month) whether or not it's busy, and the Pro plan's $10 in Compute Credits covers one Micro project. See [Supabase compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Estimate your bill" description="See worked examples of monthly costs for Launch plan and Scale plan workloads." buttonText="View plans" buttonUrl="/docs/introduction/plans" />
