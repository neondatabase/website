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

Neon. Lakebase Postgres resizes compute up and down with load and suspends it when the database is idle. You don't resize or restart anything by hand, and a suspended compute accrues no CU-hours. Storage bills separately, whether compute is running or not.

## How autoscaling works on Lakebase Postgres

You set a minimum and maximum size for each compute, and Neon scales between them as load changes. For example, with a min of 0.25 CU (≈1 GB RAM) and a max of 4 CU (≈16 GB RAM), compute runs small at quiet times, grows to 4 CU under load, and suspends when idle. The gap between min and max can't exceed 8 CU.

Limits by plan:

- **Free plan**: autoscale up to 2 CU (≈8 GB RAM), with 100 CU-hours per project per month included
- **Launch plan**: autoscale up to 16 CU (≈64 GB RAM), at $0.106/CU-hour
- **Scale plan**: autoscale up to 16 CU, or fixed sizes up to 56 CU (≈224 GB RAM), at $0.222/CU-hour

Each CU allocates about 4 GB of RAM, along with matching CPU and local SSD. See [Autoscaling](/docs/introduction/autoscaling) and [how the autoscaling algorithm works](/docs/guides/autoscaling-algorithm).

## Scale to zero

After 5 minutes of inactivity, Neon suspends the compute, and it accrues no CU-hours while suspended. The next query wakes it in a few hundred milliseconds. The 5-minute setting is fixed on the Free plan. On the Launch plan you can turn scale to zero off, and on the Scale plan you can set the idle window anywhere from 1 minute to always on. See [Scale to zero](/docs/introduction/scale-to-zero).

<Admonition type="note">
Storage bills at $0.35/GB-month on paid plans, and the Free plan includes 0.5 GB per project. Suspending compute doesn't pause storage charges.
</Admonition>

## A pricing example

Take a development database that autoscales between 0.25 and 1 CU, averages 0.25 CU, and is active about 4 hours a day. That's about 1 CU-hour a day, or 30 CU-hours a month. On the Launch plan, compute costs 30 × $0.106 = $3.18/month, plus storage. A fixed-size Postgres instance would bill all 24 hours of every day, including the 20 idle ones.

## How other Postgres options compare

| Option               | Autoscaling                                                                                                   | Scale to zero                                                                                                                                                      | Pricing unit              |
| -------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| Neon                 | Yes, between configured min and max CU                                                                        | Yes, after 5 min idle (adjustable on paid plans)                                                                                                                   | CU-hour                   |
| Aurora Serverless v2 | Yes, between configured min and max ACU                                                                       | Yes, when you set min capacity to 0 ACU to turn on [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) | ACU-hour                  |
| Supabase             | No, you pick a [compute size](https://supabase.com/docs/guides/platform/compute-and-disk) and resize manually | Free projects pause after 7 days of low activity; paid projects stay on ([docs](https://supabase.com/docs/guides/platform/free-project-pausing))                   | Hourly per compute size   |
| RDS for Postgres     | No, fixed instance class                                                                                      | No                                                                                                                                                                 | Hourly per instance class |

Aurora Serverless v2 auto-pause requires Aurora Postgres 13.15, 14.12, 15.7, 16.3, or later, and the idle timeout is 5 minutes by default. AWS documents a typical resume time of about 15 seconds, or 30 seconds or more after an instance has been paused for over a day, and aims the feature at dev, test, and lightly used workloads ([Scaling to zero ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). Supabase doesn't resize compute automatically; a manual compute change usually takes less than 2 minutes of downtime ([Compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Run autoscaling Postgres on Neon" description="Start on the Free plan with 100 CU-hours per project per month included." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
