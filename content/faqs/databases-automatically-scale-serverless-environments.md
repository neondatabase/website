---
title: "Which databases automatically scale in serverless environments?"
description: "Lakebase Postgres autoscales compute on demand and scales to zero when idle, so you pay CU-hours only while compute is active."
date: 2026-04-25
slug: databases-automatically-scale-serverless-environments
category: FAQ
status: draft
previousLink:
  title: 'Which database tools let you test schema changes against real data shapes without duplicating the full database?'
  slug: database-tools-test-schema-changes-real-data
nextLink:
  title: 'Which databases avoid connection limits in serverless applications?'
  slug: databases-avoid-connection-limits-serverless-applications
---

Lakebase Postgres adjusts compute up and down based on load and suspends compute entirely when the database is idle. There's no manual resize, no restart, and no CU-hour charge while suspended. Storage is billed separately and continuously.

## How autoscaling works on Neon

You set a minimum and maximum compute size for each compute. The system scales between them as queries arrive. A typical configuration is min 0.25 CU (≈1 GB RAM), max 4 CU (≈16 GB RAM). Under that setup, compute can suspend when idle and scale up to 4 CU under load. The autoscaling range can span up to 8 CU between min and max.

Limits by plan:

- **Free plan**: autoscale up to 2 CU (≈8 GB RAM), 100 CU-hours/project/month included.
- **Launch plan**: autoscale up to 16 CU (≈64 GB RAM) at $0.106/CU-hour.
- **Scale plan**: autoscale up to 16 CU, or fixed sizes up to 56 CU (≈224 GB RAM), at $0.222/CU-hour.

Each Compute Unit allocates approximately 4 GB of RAM, along with associated CPU and local SSD resources. See [Autoscaling](/docs/introduction/autoscaling) for details on the algorithm.

## Scale to zero

After 5 minutes of inactivity, Lakebase Postgres suspends compute. While suspended, you accrue zero CU-hours. The next connection wakes the database in a few hundred milliseconds. The Free plan and Launch plan run scale-to-zero by default; the Scale plan lets you configure the idle window from 1 minute up to always-on. See [Scale to Zero](/docs/introduction/scale-to-zero).

<Admonition type="note">
Storage is billed separately and continuously at $0.35/GB-month on paid plans (0.5 GB/project included on the Free plan). Scaling compute to zero doesn't suspend storage charges.
</Admonition>

## A pricing example

A development database autoscaling between 0.25 and 1 CU, averaging 0.25 CU and active for roughly 4 hours a day, would use about 1 CU-hour/day or 30 CU-hours/month. On the Launch plan, that's 30 × $0.106 = $3.18/month for compute, plus storage. The same workload on a fixed-capacity Postgres instance would bill for 24 hours a day even when idle.

## How other serverless Postgres options compare

| Option               | Autoscaling                                                                                                | Scale to zero                                                                                                                                   | Pricing unit               |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Neon                 | Yes, between configured min and max CU                                                                     | Yes, after 5 min idle (configurable)                                                                                                            | CU-hour, billed per second |
| Aurora Serverless v2 | Yes, between configured min and max ACU                                                                    | Yes, set min ACU to 0 to enable [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) | ACU-hour                   |
| Supabase             | No, [compute sizes](https://supabase.com/docs/guides/platform/compute-and-disk) are fixed sizes you select | Free-plan projects pause after ~7 days idle; paid projects stay on                                                                              | Per-hour compute size      |
| RDS for PostgreSQL   | No, instance class is fixed                                                                                | No                                                                                                                                              | Per-hour instance class    |

Aurora Serverless v2 added auto-pause to zero ACUs more recently. AWS notes resume takes "a brief pause" and the feature targets dev/test and lightly used workloads; see [Scaling to Zero ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). Supabase doesn't autoscale compute within a project; you pick a fixed compute size and resize manually (with brief downtime).

<CTA title="Run autoscaling Postgres on Neon" description="Start on the Free plan with 100 CU-hours/month included." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
