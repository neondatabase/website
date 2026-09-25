---
title: "What are the cheapest ways to run a Postgres database for a project that gets very little traffic?"
description: "For a low-traffic project, pick Postgres that stops billing for compute when idle. Neon's Free plan includes 100 CU-hours per project per month, and the Launch plan bills $0.106/CU-hour with no monthly minimum."
date: 2026-04-25
slug: cheapest-ways-run-postgres-database-low-traffic
category: FAQ
status: draft
previousLink:
  title: 'How do I migrate an existing Neon project to a different AWS region?'
  slug: change-region-existing-neon-project
nextLink:
  title: 'How can I check which region my Neon project is running in?'
  slug: check-neon-project-region
---

For a low-traffic project, the cheapest Postgres setup is one that stops billing for compute when nothing is using it. A fixed-size instance bills around the clock even if your app sees one request a day. Lakebase Postgres scales compute to zero after 5 minutes of inactivity, and Neon meters compute in CU-seconds and prices it per CU-hour ([usage calculations](/docs/introduction/usage-calculations)), so a suspended compute adds no compute charges. Storage still bills: $0.35/GB-month on paid plans.

## What you pay on Neon

The [Free plan](/docs/introduction/plans) is $0/month and includes:

- 100 projects, 10 branches per project
- 0.5 GB storage per project
- 100 CU-hours of compute per project per month (enough to run 0.25 CU for ~400 hours)
- Scale to zero after 5 minutes (always on, can't disable)

If your app outgrows those limits, the [Launch plan](/docs/introduction/plans#launch-plan) bills compute at $0.106/CU-hour and storage at $0.35/GB-month, with no monthly minimum.

## Worked example

Say your app keeps the compute active for about 2 hours a day (active means running, not suspended), and your data is 1 GB, which is over the Free plan's 0.5 GB cap. On the Launch plan:

| Resource | Usage                     | Cost                             |
| -------- | ------------------------- | -------------------------------- |
| Compute  | 0.25 CU × 60 active hours | 15 CU-hours × $0.106 = **$1.59** |
| Storage  | 1 GB root branch          | 1 × $0.35 = **$0.35**            |
| Total    |                           | **~$1.94/month**                 |

The 15 CU-hours fit inside the Free plan's 100 CU-hours, so with 0.5 GB of data or less, the same project runs on the Free plan for $0.

<Admonition type="tip" title="Set a spending alert">
On the Launch and Scale plans, set up [spending notifications](/docs/introduction/spending-notifications) so a traffic spike doesn't surprise you. You get an email at 80% and 100% of the threshold you set. Notifications don't suspend computes, so also set an autoscaling max to limit how large a compute can get.
</Admonition>

## How other providers compare

| Provider                        | Free plan                                                                                                          | Paid baseline                                                                                                                                  | Idle behavior                                                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                            | 100 CU-hours/project/month, 0.5 GB/project                                                                         | $0.106/CU-hour, no monthly minimum                                                                                                             | Scales to zero after 5 min idle ([docs](/docs/introduction/scale-to-zero))                                                                                                                                     |
| Supabase Free Plan              | 2 projects, 500 MB database per project ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase))    | Pro Plan from $25/month, about $10/month per extra Micro project ([docs](https://supabase.com/docs/guides/platform/manage-your-usage/compute)) | Free Plan projects pause after a week of low activity; paid projects run 24/7 ([docs](https://supabase.com/docs/guides/platform/free-project-pausing))                                                         |
| Aurora Serverless v2 (Postgres) | New-account credits ([AWS Free Tier](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html)) | Per-ACU-hour billing                                                                                                                           | Scales to 0 ACUs (auto-pause) when min capacity is 0, on Aurora Postgres 13.15+/14.12+/15.7+/16.3+ ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| RDS for Postgres                | New-account credits ([AWS Free Tier](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html)) | Per-instance hourly                                                                                                                            | No auto-pause; pays 24/7                                                                                                                                                                                       |

New AWS accounts get $100 in credits (up to $200 with extra activities), and the free account plan ends after six months or when the credits run out, so it isn't a permanent free plan. For a hobby project with one request a day, Neon's Free plan and Supabase's Free Plan both cost $0. The difference is idle behavior: a Neon compute suspends after 5 minutes and reactivates on the next query, while a paused Supabase project stays paused until you restore it ([docs](https://supabase.com/docs/guides/platform/free-project-pausing)).

<CTA title="Run your low-traffic project free" description="Start on the Free plan. Upgrade only when you hit the limits." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
