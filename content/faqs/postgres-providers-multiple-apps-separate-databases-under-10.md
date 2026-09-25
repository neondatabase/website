---
title: "Which Postgres providers let you run multiple apps with separate databases for under $10 per month total?"
description: "Neon runs multiple isolated databases on a usage-based price. The Free plan covers up to 100 projects, and paid plans bill per CU-hour and GB-month."
date: 2026-04-25
slug: postgres-providers-multiple-apps-separate-databases-under-10
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres providers make it easy to restore a database to a previous state after a bug?'
  slug: postgres-providers-easy-database-restore
nextLink:
  title: 'Which Postgres providers remove the need for manual connection pooling?'
  slug: postgres-providers-remove-manual-connection-pooling
---

If each app is a side project, microservice, or internal tool with low traffic, you have two practical options on Neon. Stay on the Free plan with up to 100 separate projects at no cost, or move to the Launch plan and pay for the CU-hours and storage you use. Both work because Lakebase Postgres scales compute to zero when an app is idle, so an idle app doesn't burn compute hours.

## Free plan: 100 projects, $0

Each Neon project is an isolated Postgres database with its own compute and connection string. On the Free plan you get:

- 100 projects per organization
- 100 CU-hours per project per month
- 0.5 GB storage per project
- 10 branches per project
- 5 GB public network transfer per project per month

100 CU-hours runs a 0.25 CU compute (≈1 GB RAM) for about 400 hours a month. A low-traffic app that scales to zero between requests uses far fewer active hours than that. Compute suspends after 5 minutes idle and [resumes within a few hundred milliseconds](/docs/introduction/scale-to-zero) when a query arrives. See the [Free plan details](/docs/introduction/plans) for the full breakdown.

## Launch plan: pay for what you use

The Launch plan has no monthly minimum. You pay:

- **$0.106 per CU-hour** of compute
- **$0.35 per GB-month** of storage
- Nothing for the first 500 GB of public network transfer per project per month, then $0.10/GB

A back-of-envelope estimate for a small app that's active about 30 hours a month at 0.25 CU, with 1 GB of data:

```text
Compute:  0.25 CU × 30 hours × $0.106  = $0.80
Storage:  1 GB × $0.35                 = $0.35
Total:                                   $1.15
```

Instant restore history adds $0.20/GB-month for the changes kept in the history window (1 day by default). When compute is suspended, CU-hours stop; storage continues to bill.

Plans apply to a whole organization, not to individual projects. To keep most apps free and pay only for the one that grew, [transfer that project](/docs/manage/orgs-project-transfer) to a separate organization on the Launch plan. Its connection string doesn't change.

<Admonition type="tip" title="Watch your bill">
On the Launch and Scale plans, [spending notifications](/docs/introduction/spending-notifications) email admins at 80% and 100% of a monthly threshold. They don't stop usage. To suspend compute at a limit, set per-project [consumption limits](/docs/guides/consumption-limits) with the Neon API.
</Admonition>

## How this compares to other providers

| Provider             | Free project limit | Idle behavior                                                                                                                                         | Per-extra-app cost                                                                                                                                   |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon (Free plan)     | 100 projects       | Compute scales to zero after 5 minutes idle                                                                                                           | $0, within plan allowances                                                                                                                           |
| Neon (Launch plan)   | 100 projects       | Scales to zero; compute billed per CU-hour                                                                                                            | About $1 a month for the app in the estimate above                                                                                                   |
| Supabase (Free)      | 2 active projects  | Projects [paused after low activity over 7 days](https://supabase.com/docs/guides/platform/free-project-pausing)                                      | N/A on Free                                                                                                                                          |
| Supabase (Pro)       | Paid per project   | No inactivity pause; compute billed hourly while the project runs                                                                                     | Pro is $25/month and covers one Micro project; [each additional project starts at ~$10/month](https://supabase.com/docs/guides/platform/billing-faq) |
| Aurora Serverless v2 | N/A                | [Auto-pause at 0 ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) when min capacity is 0 ACUs | A cluster per app, billed per ACU-hour while active plus storage                                                                                     |
| RDS for Postgres     | N/A                | No auto-pause; you can [stop an instance for up to 7 days at a time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html)   | Instance-hours for each app's instance, idle or not                                                                                                  |

For 5 to 10 low-traffic apps under $10 a month total, the zero-cost options are Neon's Free plan (up to 100 projects) and Supabase's Free plan (2 active projects). On Neon's Launch plan, each small app costs its CU-hours and storage. Supabase Pro starts at $25 a month before any extra projects, so it's above this budget. On Aurora and RDS, each app needs its own cluster or instance, and Aurora's auto-pause means the first connection after a pause waits for the instance to resume.

<CTA title="Start free with Neon" description="Spin up 100 Postgres projects at no cost, then pay per CU-hour as individual apps grow." buttonText="Create a free account" buttonUrl="https://console.neon.tech/signup" />
