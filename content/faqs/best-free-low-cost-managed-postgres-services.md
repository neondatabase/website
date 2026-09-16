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

For side projects, the most cost-effective managed Postgres is one that doesn't bill you for compute while idle and scales up only when traffic arrives. Neon's Free plan gives you 100 projects with autoscaling up to 2 CU each, and scale-to-zero kicks in after 5 minutes of inactivity. When a request hits, the compute resumes in a few hundred milliseconds ([Scale to Zero](/docs/introduction/scale-to-zero)).

## What the Free plan includes

The Neon [Free plan](/docs/introduction/plans) is designed for prototypes and small projects:

- 100 projects
- 10 branches per project
- 100 CU-hours per project per month
- 0.5 GB storage per project
- Autoscaling up to 2 CU (≈8 GB RAM)
- Scale-to-zero after 5 minutes of inactivity
- 6-hour instant restore window, up to 1 GB of change history
- 5 GB of public network transfer per project per month

100 CU-hours is enough to run a 0.25 CU compute for about 400 hours a month, or a 0.5 CU compute for 200 hours. Combined with scale-to-zero, that covers most side projects.

## What happens when traffic spikes

When you go from no traffic to a sudden burst, two things happen automatically:

1. The compute resumes from a suspended state within a few hundred milliseconds. Your first query may see a slightly higher cold-start latency.
2. Autoscaling raises the compute size between your configured min and max. On the Free plan, max is 2 CU. On the Launch plan, it's up to 16 CU. See [Autoscaling](/docs/introduction/autoscaling) for the mechanics.

You don't accumulate CU-hours during idle stretches. Compute is billed only when it's serving queries; storage is metered separately at $0.35/GB-month on paid plans (and capped at 0.5 GB/project on Free).

## When you outgrow Free

If you blow past 100 CU-hours, run out of storage, or want to disable scale-to-zero, the Launch plan is pay-as-you-go:

- Compute: $0.106/CU-hour
- Storage: $0.35/GB-month
- 500 GB of public network transfer per project included

There's no monthly minimum. A light project running 10 CU-hours/month with 2 GB of storage works out to about $1.76 on Launch: $1.06 of compute plus $0.70 of storage. Add a dev branch and a day of restore history and you're at $2.31, the light-usage figure in the [usage examples](/docs/introduction/plans#launch-plan).

<Callout title="Branching is free under the limits">
Each project gets 10 branches on Free. Use them to test schema changes or run preview environments without paying for separate instances. See [Branching](/docs/introduction/branching).
</Callout>

## How the free plans compare

| Provider         | Free projects                                                                                                                                                                     | Idle behavior                                                                                                                    | Storage                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Neon Free        | 100 projects                                                                                                                                                                      | Auto-suspend after 5 minutes, resume in a few hundred ms                                                                         | 0.5 GB per project                                                                      |
| Supabase Free    | 2 active projects across every org where you're Owner or Admin; paused projects don't count                                                                                       | Inactive projects are paused (manual unpause to restore) ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase)) | 500 MB per project ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)) |
| AWS RDS / Aurora | Aurora only: 4 ACUs and 2 clusters on the AWS Free Tier ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-free-tier.html)). RDS runs on sign-up credits | Instances run 24/7 unless stopped manually or paused at 0 ACUs                                                                   | 1 GB per Aurora cluster; otherwise pay-per-GB                                           |

Supabase pauses Free Plan projects after a period of inactivity and requires a manual unpause, while Neon's scale-to-zero resumes automatically on every query. On AWS, only Aurora Postgres has a standing free allowance, and it's small: 4 ACUs and 1 GB per cluster, two clusters per account. RDS for Postgres runs on sign-up credits, after which the steady-state cost is the smallest instance class billed 24/7.

<CTA title="Try Neon free" description="No credit card required to start." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
