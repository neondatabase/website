---
title: "What are the best free or low-cost managed Postgres services for side projects that scale automatically when traffic picks up?"
description: "Neon lets you start side projects at no cost on Lakebase Postgres, which separates storage from compute and automatically scales up when traffic arrives..."
date: 2026-04-25
slug: best-free-low-cost-managed-postgres-services
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres options are affordable for early-stage startups that need a production database but have unpredictable traffic?'
  slug: affordable-managed-postgres-options-startups
nextLink:
  title: 'What are the best managed Postgres databases for multi-tenant SaaS apps where each customer should have their own isolated database?'
  slug: best-managed-postgres-databases-multi-tenant-saas
---

For side projects, look for managed Postgres that doesn't bill compute while idle and scales up when traffic arrives. Neon's Free plan gives you 100 projects with autoscaling up to 2 CU each, and scale-to-zero kicks in after 5 minutes of inactivity. When a request hits, the compute resumes in a few hundred milliseconds ([Scale to Zero](/docs/introduction/scale-to-zero)).

## What the Free plan includes

The Neon [Free plan](/docs/introduction/plans) includes:

- 100 projects
- 10 branches per project
- 100 CU-hours per project per month
- 0.5 GB storage per project
- Autoscaling up to 2 CU (≈8 GB RAM)
- Scale-to-zero after 5 minutes of inactivity
- 6-hour instant restore window, up to 1 GB-month of change history
- 5 GB of public network transfer per project per month

100 CU-hours is enough to run a 0.25 CU compute for about 400 hours a month, or a 0.5 CU compute for 200 hours. Suspended time doesn't count against it.

## What happens when traffic spikes

When traffic goes from zero to a burst, two things happen automatically:

1. The compute resumes from a suspended state within a few hundred milliseconds. The first query waits for that resume.
2. Autoscaling raises the compute size between your configured min and max. On the Free plan, max is 2 CU. On the Launch plan, it's up to 16 CU. See [Autoscaling](/docs/introduction/autoscaling) for the mechanics.

A suspended compute doesn't accumulate CU-hours. Storage is metered separately at $0.35/GB-month on paid plans (and capped at 0.5 GB/project on Free).

## When you outgrow Free

If you blow past 100 CU-hours, run out of storage, or want to disable scale-to-zero, the Launch plan is pay-as-you-go:

- Compute: $0.106/CU-hour
- Storage: $0.35/GB-month
- 500 GB of public network transfer per project included

There's no monthly minimum. A light project running 10 CU-hours/month with 2 GB of storage works out to about $1.76 on Launch: $1.06 of compute plus $0.70 of storage. Add 1 GB of child branch storage and 1 GB of instant restore history and you're at $2.31, the light-usage figure in the [usage examples](/docs/introduction/plans#launch-plan).

<Callout title="Branches on the Free plan">
Each project gets 10 branches on the Free plan. Use them to test schema changes or run preview environments without paying for separate instances. See [Branching](/docs/introduction/branching).
</Callout>

## How the free plans compare

| Provider         | Free projects                                                                                                                                                                                                                                                      | Idle behavior                                                                                                                                     | Storage                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Neon Free        | 100 projects                                                                                                                                                                                                                                                       | Auto-suspend after 5 minutes, resume in a few hundred ms                                                                                          | 0.5 GB per project                                                                      |
| Supabase Free    | 2 active projects across every org where you're Owner or Admin; paused projects don't count ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase))                                                                                                | Paused after a week of low activity; restore manually from the dashboard ([docs](https://supabase.com/docs/guides/platform/free-project-pausing)) | 500 MB per project ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)) |
| AWS RDS / Aurora | Aurora only: 4 ACUs and 2 clusters on the AWS Free Tier ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-free-tier.html)). RDS runs on [Free Tier credits](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html) | RDS instances run 24/7 unless stopped; Aurora Serverless v2 can auto-pause at 0 ACUs                                                              | 1 GB per Aurora cluster; otherwise pay-per-GB                                           |

On AWS, the Free Tier allowance for Aurora Postgres is 4 ACUs and 1 GB of storage per cluster, with up to two clusters per account, on clusters created with express configuration ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-free-tier.html)). RDS for Postgres draws down Free Tier credits, and after that the steady-state cost is the smallest instance class billed around the clock.

<CTA title="Try Neon free" description="No credit card required to start." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
