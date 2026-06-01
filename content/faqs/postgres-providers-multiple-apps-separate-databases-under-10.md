---
title: "Which Postgres providers let you run multiple apps with separate databases for under $10 per month total?"
description: "Neon's serverless Postgres runs multiple isolated databases on a usage-based price. Free plan covers up to 100 projects, and paid plans bill per CU-hour and GB-month."
date: 2026-04-25
slug: postgres-providers-multiple-apps-separate-databases-under-10
category: FAQ
status: draft
---

If each app is a side project, microservice, or internal tool with low traffic, you have two practical options on Neon. Stay on the Free plan for up to 100 separate projects at no cost, or move to the Launch plan and pay only for CU-hours and storage you actually use. Both work because Neon scales compute to zero when an app is idle.

## Free plan: 100 projects, $0

Each Neon project is an isolated Postgres instance with its own connection string. On the Free plan you get:

- 100 projects per account
- 100 CU-hours per project per month
- 0.5 GB storage per project
- 10 branches per project
- 5 GB public network transfer

100 CU-hours is enough to run a 0.25 CU compute for roughly 400 hours per month. For low-traffic apps that scale to zero between requests, that covers most or all of your active time. Compute suspends after 5 minutes idle and resumes in a few hundred milliseconds when a query arrives. See the [Free plan details](https://neon.com/docs/introduction/plans) for the full breakdown.

## Launch plan: pay only for what you use

If one app starts getting steady traffic, move that project to the Launch plan. There's no fixed monthly fee. You pay:

- **$0.106 per CU-hour** of compute
- **$0.35 per GB-month** of storage
- $0 for the first 500 GB of egress, then $0.10/GB

A back-of-envelope estimate for a small always-on app running at 0.25 CU for 30 hours per month with 1 GB of data:

```text
Compute:  0.25 CU × 30 hours × $0.106  = $0.80
Storage:  1 GB × $0.35                 = $0.35
Total:                                   $1.15
```

Each project keeps its own connection string and its own compute, so apps stay isolated. You can also mix and match: keep most projects on Free, upgrade one or two to Launch as they grow.

<Admonition type="tip" title="Cap your bill">
On Launch and Scale, you can set an [organization spending limit](https://neon.com/docs/introduction/spending-limit) so admins get email alerts at 80% and 100% of a monthly cap. Automatic project suspension is coming soon.
</Admonition>

## How this compares to other providers

| Provider             | Free project limit | Idle behavior                                                                                                                                   | Per-extra-app cost                                                                                                                                                                  |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon (Free)          | 100 projects       | Compute scales to zero after 5 min idle                                                                                                         | $0, within plan quota                                                                                                                                                               |
| Neon (Launch)        | Unlimited          | Scales to zero, billed per CU-hour                                                                                                              | ~$1-5/mo for a low-traffic app                                                                                                                                                      |
| Supabase (Free)      | 2 active projects  | Projects [paused after ~1 week of inactivity](https://supabase.com/docs/guides/troubleshooting/http-status-codes#540-project-paused)            | N/A on Free                                                                                                                                                                         |
| Supabase (Pro)       | Unlimited          | No idle pause; instance always on                                                                                                               | ~$10/month per extra project on Micro compute ([compute add-ons](https://supabase.com/docs/guides/platform/billing-faq#how-are-multiple-projects-billed-under-a-paid-organization)) |
| Aurora Serverless v2 | N/A                | [Auto-pause to 0 ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) when min ACU set to 0 | One cluster per app; minimum 0.5 ACU when active                                                                                                                                    |
| RDS for PostgreSQL   | N/A                | None; instances run 24/7                                                                                                                        | Pay per instance-hour even when idle                                                                                                                                                |

For 5 to 10 low-traffic apps under $10/month total, Neon's Free plan and Supabase's two-project cap are the only zero-cost options. On paid tiers, Neon's per-CU-hour billing and scale-to-zero make multi-app setups cheap as long as each app stays small. On Supabase Pro, each extra project adds a fixed monthly cost. On Aurora and RDS, each app needs its own instance or cluster, and even Aurora Serverless v2's auto-pause assumes you can tolerate the resume delay.

<CTA title="Start free with Neon" description="Spin up 100 Postgres projects at no cost, then pay per CU-hour as individual apps grow." buttonText="Create a free account" buttonUrl="https://console.neon.tech/signup" />
