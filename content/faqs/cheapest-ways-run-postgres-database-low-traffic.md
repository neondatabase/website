---
title: "What are the cheapest ways to run a Postgres database for a project that gets very little traffic?"
description: "For low-traffic projects, a Postgres database that scales to zero between requests beats a fixed-size instance. Neon's Free plan and pay-per-CU-hour billing fit this pattern."
date: 2026-04-25
slug: cheapest-ways-run-postgres-database-low-traffic
category: FAQ
status: draft
---

For a low-traffic project, the cheapest Postgres setup is one that stops billing for compute when nothing is hitting it. Fixed-size cloud Postgres charges 24/7 even when your app sees one request a day. Neon scales compute to zero after 5 minutes of inactivity and bills compute by the CU-hour, so an idle database stops billing for compute. Storage is still metered at $0.35/GB-month.

## What you pay on Neon

The [Free plan](/docs/introduction/plans#free) covers most side projects:

- 100 projects, 10 branches per project
- 0.5 GB storage per project
- 100 CU-hours of compute per month (enough to run 0.25 CU for ~400 hours)
- Scale to zero after 5 minutes (always on, can't disable)

If your app is busier than the Free plan allowance, the [Launch plan](/docs/introduction/plans#launch) bills compute at **$0.106/CU-hour** and storage at **$0.35/GB-month**. There's no monthly minimum.

## A small worked example

Say your app gets traffic for about 2 hours of active compute time per day. Active means the compute is actually running, not suspended.

| Resource | Usage                     | Cost                             |
| -------- | ------------------------- | -------------------------------- |
| Compute  | 0.25 CU × 60 active hours | 15 CU-hours × $0.106 = **$1.59** |
| Storage  | 1 GB root branch          | 1 × $0.35 = **$0.35**            |
| Total    |                           | **~$1.94/month**                 |

If the same project fits inside Free plan limits (100 CU-hours, 0.5 GB), it's $0.

<Admonition type="tip" title="Cap your spend">
On Launch and Scale plans, set a [spending limit](/docs/introduction/spending-limit) so an unexpected traffic spike doesn't surprise you. You'll get alerts at 80% and 100%.
</Admonition>

## How this compares to other low-traffic options

| Provider                          | Free tier                                               | Paid baseline                                                                                                                   | Idle behavior                                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                              | 100 CU-hours/month, 0.5 GB/project                      | $0.106/CU-hour, no monthly minimum                                                                                              | Scales to zero after 5 min idle ([docs](/docs/introduction/scale-to-zero))                                                                                                               |
| Supabase Free Plan                | 2 projects, 500 MB per project                          | Pro Plan from $25/month + $10 compute per extra project ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase)) | Free Plan projects pause after inactivity; paid projects run 24/7 ([docs](https://supabase.com/docs/guides/platform/billing-faq))                                                        |
| Aurora Serverless v2 (PostgreSQL) | None                                                    | Per-ACU-hour billing                                                                                                            | Scales to 0 ACUs (auto-pause) on Aurora PostgreSQL 13.15+/14.12+/15.7+/16.3+ ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| RDS for PostgreSQL                | 750 hrs/month db.t3.micro for 12 months (AWS Free Tier) | Per-instance hourly                                                                                                             | No auto-pause; pays 24/7                                                                                                                                                                 |

For a hobby project with one request a day, the cheapest options are Neon's Free plan (no compute fees while idle) or Supabase's Free plan (the project pauses, restored on demand within 90 days). Aurora Serverless v2 with min ACU of 0 is competitive once you outgrow free tiers but is more involved to set up than either Neon or Supabase.

<CTA title="Run your low-traffic project free" description="Start on the Free plan. Upgrade only when you hit the limits." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
