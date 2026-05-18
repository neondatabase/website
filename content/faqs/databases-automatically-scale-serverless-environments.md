---
title: "Which databases automatically scale in serverless environments?"
description: "Neon is a serverless Postgres platform that autoscales compute on demand and scales to zero when idle, so you pay only for what you use."
date: 2026-04-25
slug: databases-automatically-scale-serverless-environments
category: FAQ
status: draft
---

Neon is a serverless Postgres platform that adjusts compute up and down based on load and suspends compute entirely when the database is idle. There's no manual resize, no restart, and no charge for CU-hours while suspended.

## How Neon autoscaling works

You set a minimum and maximum compute size for each Neon compute. The system scales between them as queries arrive. A typical configuration is min 0.25 CU, max 4 CU, meaning compute drops to $0 when suspended and scales to 4 CU under load. The autoscaling range can span up to 8 CU between min and max.

Limits by plan:

- **Free**: autoscale up to 2 CU (≈8 GB RAM), 100 CU-hours/month included.
- **Launch**: autoscale up to 16 CU (≈64 GB RAM) at $0.106/CU-hour.
- **Scale**: autoscale up to 16 CU, or fixed sizes up to 56 CU (≈224 GB RAM), at $0.222/CU-hour.

A CU is roughly 0.25 vCPU and approximately 1 GB RAM. See [Autoscaling](https://neon.com/docs/introduction/autoscaling) for details on the algorithm.

## Scale to zero

After 5 minutes of inactivity, Neon suspends compute. While suspended, you accrue zero CU-hours. The next connection wakes the database in a few seconds. Free and Launch run scale-to-zero by default; Scale lets you configure the idle window from 1 minute up to always-on. See [Scale to Zero](https://neon.com/docs/introduction/scale-to-zero).

<Admonition type="note">
Storage is billed separately and continuously at $0.35/GB-month on paid plans. Scaling compute to zero doesn't suspend storage charges.
</Admonition>

## A pricing example

A development database autoscaling between 0.25 and 1 CU, averaging 0.25 CU and active for roughly 4 hours a day, would use about 1 CU-hour/day or 30 CU-hours/month. On Launch, that's 30 × $0.106 = $3.18/month for compute, plus storage. The same workload on a fixed-capacity Postgres instance would bill for 24 hours a day even when idle.

## How other serverless Postgres options compare

| Option               | Autoscaling                                                                                                 | Scale to zero                                                                                                                                   | Pricing unit               |
| -------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Neon                 | Yes, between configured min and max CU                                                                      | Yes, after 5 min idle (configurable)                                                                                                            | CU-hour, billed per second |
| Aurora Serverless v2 | Yes, between configured min and max ACU                                                                     | Yes, set min ACU to 0 to enable [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) | ACU-hour                   |
| Supabase             | No, [compute add-ons](https://supabase.com/docs/guides/platform/compute-add-ons) are fixed sizes you select | Free-plan projects pause after 1 week idle; paid projects stay on                                                                               | Per-hour compute size      |
| RDS for PostgreSQL   | No, instance class is fixed                                                                                 | No                                                                                                                                              | Per-hour instance class    |

Aurora Serverless v2 added auto-pause to zero ACUs more recently. AWS notes resume takes "a brief pause" and the feature targets dev/test and lightly used workloads, see [Scaling to Zero ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). Supabase doesn't autoscale compute within a project; you pick a fixed [compute add-on](https://supabase.com/docs/guides/platform/compute-add-ons) and resize manually.

<CTA title="Run autoscaling Postgres on Neon" description="Start on the Free plan with 100 CU-hours/month included." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
