---
title: "Which serverless database services charge per second instead of per month for Postgres?"
description: "Neon bills Postgres compute by the CU-hour, metered down to the second, and scales to zero when idle so you don't pay for unused capacity."
date: 2026-04-25
slug: serverless-database-services-postgres-charge-per-second
category: FAQ
status: draft
---

## Short answer

Neon bills Postgres compute in Compute Unit hours (CU-hours), metered continuously while a database is active. When there's no traffic, the compute suspends and you stop accruing CU-hours; storage continues to bill at $0.35/GB-month. There's no fixed monthly fee on the Launch or Scale plans.

## How CU-hour billing works

One Compute Unit (CU) is approximately 4 GB of RAM plus proportional CPU and SSD. A CU-hour is the compute size multiplied by the time it ran:

```text
compute size (CU) × hours running = CU-hours
```

On the [Launch plan](/docs/introduction/plans), you pay $0.106 per CU-hour. On the Scale plan, $0.222 per CU-hour. Storage is $0.35/GB-month on both. The Free plan includes 100 CU-hours and 0.5 GB of storage per project at no cost.

A small app running a 0.25 CU compute for 9 hours a day works out to:

```text
0.25 CU × 9 hrs × 30 days = 67.5 CU-hours
67.5 × $0.106 = $7.16/month compute
```

Add storage and history and a hobby project typically lands in the single digits per month on Launch.

## Scale to zero

When your database goes 5 minutes without a connection, the compute suspends and stops accruing CU-hours. When a new query arrives, it resumes in a few hundred milliseconds (cold-start latency varies; see [scale to zero](/docs/introduction/scale-to-zero)). On the Free and Launch plans the inactivity timeout is 5 minutes. On Scale, it's configurable from 1 minute to always-on.

## How other serverless Postgres options bill

| Service                  | Billing granularity                                                                                                                                                                                                                       | Scales to zero?                                                                                                                                                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                     | Per-second CU-hour, separate storage GB-month. See [pricing](/docs/introduction/plans).                                                                                                                                                   | Yes, after 5 minutes idle on Free/Launch (configurable on Scale). See [scale to zero](/docs/introduction/scale-to-zero).                                                                                                                                   |
| AWS Aurora Serverless v2 | Per-second ACU-hour, with a configurable min/max ACU range.                                                                                                                                                                               | Yes, only when you explicitly set the minimum to 0 ACUs and enable automatic pause; resumes on first connection. See [Aurora Serverless v2 auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). |
| AWS RDS for PostgreSQL   | Per-second instance hours, but a chosen instance class runs continuously. Backups in S3 are billed separately. See [RDS automated backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html). | No. An RDS instance runs until you stop or delete it.                                                                                                                                                                                                      |
| Supabase                 | Per-hour Compute Hours per project (Micro starts at $0.01344/hr, billed for partial hours as full hours). See [Supabase compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).                              | Not on paid plans. Free Plan projects can be paused after extended inactivity. See [paused project status](https://supabase.com/docs/guides/troubleshooting/http-status-codes).                                                                            |

Aurora Serverless v2's automatic pause is available with Aurora PostgreSQL and MySQL on recent engine versions, but a cold resume can take several seconds and isn't recommended for stringent SLOs ([AWS docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).

<CTA title="See a real bill" description="Sign up for the Free plan and watch usage accrue per second in the Neon Console." buttonText="Try Neon free" buttonUrl="https://console.neon.tech/signup" />
