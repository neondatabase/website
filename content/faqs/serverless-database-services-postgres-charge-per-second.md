---
title: "Which serverless database services charge per second instead of per month for Postgres?"
description: "Neon bills Lakebase Postgres compute by the CU-hour, metered down to the second, and scales to zero when idle so you don't pay for unused capacity."
date: 2026-04-25
slug: serverless-database-services-postgres-charge-per-second
category: FAQ
status: draft
previousLink:
  title: 'How do I rotate my Neon API keys after they''ve been exposed?'
  slug: rotate-neon-api-keys
nextLink:
  title: 'What is the simplest Postgres setup for startups?'
  slug: simplest-postgres-setup-for-startups
---

Neon. Lakebase Postgres compute is priced per CU-hour but metered in CU-seconds, so you pay for the seconds a compute actually runs ([usage calculations](/docs/introduction/usage-calculations)). When there's no traffic, the compute suspends and stops accruing usage. Storage keeps billing at $0.35/GB-month on paid plans. The Launch plan and Scale plan have no minimum monthly fee ([plans](/docs/introduction/plans#price)).

## How CU-hour billing works

One Compute Unit (CU) allocates ≈4 GB of RAM, along with CPU and local SSD. A 2 CU compute accrues 2 CU-seconds for every second it runs, and 3,600 CU-seconds make a CU-hour.

```text
compute size (CU) × hours running = CU-hours
```

On the [Launch plan](/docs/introduction/plans), compute costs $0.106 per CU-hour, and on the Scale plan $0.222 per CU-hour. Storage is $0.35/GB-month on both. The Free plan includes 100 CU-hours per project per month and 0.5 GB of storage per project.

For example, a small app on a 0.25 CU (≈1 GB RAM) compute that's active 9 hours a day uses:

```text
0.25 CU × 9 hrs × 30 days = 67.5 CU-hours
67.5 × $0.106 = $7.16/month compute
```

Storage adds $0.35 per GB-month, and instant restore history adds $0.20 per GB-month of retained changes.

## Scale to zero

After 5 minutes of inactivity, the compute suspends and stops accruing usage. The next query wakes it within a few hundred milliseconds ([scale to zero](/docs/introduction/scale-to-zero)). The 5-minute timeout is fixed on the Free plan. On the Launch plan you can disable scale to zero, and on the Scale plan you can set the timeout anywhere from 1 minute to always on. Computes larger than 16 CU don't scale to zero.

## How other serverless Postgres options bill

| Service                  | Billing granularity                                                                                                                                                                                              | Scales to zero?                                                                                                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                     | Metered per second (CU-seconds), priced per CU-hour, with separate storage per GB-month. See [plans](/docs/introduction/plans).                                                                                  | Yes, after 5 minutes idle by default (configurable on the Scale plan). See [scale to zero](/docs/introduction/scale-to-zero).                                                                                                                              |
| AWS Aurora Serverless v2 | A flat rate per second of ACU usage, within a min/max ACU range you set. See the [Aurora Serverless FAQ](https://docs.aws.amazon.com/rds/latest/auroraextendedcontent/aurora-faq-scalability.html).              | Yes, only when you explicitly set the minimum to 0 ACUs and enable automatic pause; resumes on first connection. See [Aurora Serverless v2 auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). |
| AWS RDS for Postgres     | Billed in one-second increments with a 10-minute minimum, for as long as the instance runs. See [RDS on-demand instances](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_OnDemandDBInstances.html). | No. An instance bills until you stop or delete it, and a stopped instance restarts automatically after 7 days.                                                                                                                                             |
| Supabase                 | Hourly Compute Hours per project, with partial hours billed as full hours (Micro is $0.01344/hour). See [Supabase compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).           | Not on paid plans. Free Plan projects pause after a week of low activity. See [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).                                                                                           |

Aurora Serverless v2 auto-pause needs a recent engine version (Aurora PostgreSQL 16.3, 15.7, 14.12, or 13.15 or later). AWS says a typical resume takes about 15 seconds and positions the feature for workloads without a stringent SLO ([Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).

<CTA title="See a real bill" description="Sign up for the Free plan and track your compute usage in the Neon Console." buttonText="Try Neon free" buttonUrl="https://console.neon.tech/signup" />
