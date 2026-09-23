---
title: "What are the best managed Postgres options for developers who find that the smallest available instance on major cloud providers is still too expensive?"
description: "Developers facing high minimum costs on traditional cloud providers can deploy Neon. Lakebase Postgres scales compute precisely, down to 0.25 CU, and..."
date: 2026-04-25
slug: best-managed-postgres-options-developers
category: FAQ
status: draft
previousLink:
  title: 'What are the best managed Postgres databases that only charge you when the database is actually being used?'
  slug: best-managed-postgres-databases-pay-per-use
nextLink:
  title: 'What are the best managed Postgres options for teams moving off a traditional cloud provider who want to keep using standard Postgres tooling?'
  slug: best-managed-postgres-options-for-teams-migrating
---

If the smallest instance on RDS, Cloud SQL, or Aurora is more than you need, look for a database that scales to zero when you aren't using it. On Neon, the smallest Lakebase Postgres compute is 0.25 CU (≈1 GB RAM), and it suspends after 5 minutes of inactivity. You pay in CU-hours of active time plus storage, not for a 24/7 instance.

## The smallest option elsewhere

- **RDS for Postgres** bills by database instance-hour. A `db.t4g.micro` bills for every hour it runs, even at 0% CPU.
- **Aurora Serverless v2** supports a minimum of 0 ACUs with [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), and 1 ACU is approximately 2 GiB of memory ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html)). You aren't charged for instance capacity while paused. Auto-pause is on only when you set minimum capacity to 0 ACUs, and AWS suggests it for development, test, and internal apps where a brief pause while the database resumes is acceptable.
- **Supabase** on the Pro Plan starts at $25/month plus Compute Hours per project. The smallest paid Compute size is Micro at ~$10/month, and Pro's $10 in monthly compute credits covers one Micro project ([compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk), [compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). Compute is billed by the hour and doesn't suspend automatically on paid plans.

With Neon, an idle database doesn't accumulate CU-hours, and there's no monthly subscription on the Launch plan. Storage continues to bill at $0.35/GB-month on paid plans.

## Neon's Free plan and starting price

The [Free plan](/docs/introduction/plans) covers most early development:

- 100 projects, 10 branches each
- 100 CU-hours per project per month
- 0.5 GB storage per project
- Autoscaling up to 2 CU (≈8 GB RAM)
- Scale-to-zero after 5 minutes

100 CU-hours/month is enough to run a 0.25 CU compute for ~400 hours, or a 0.5 CU compute for ~200 hours.

When you outgrow Free, the Launch plan is pay-as-you-go:

- $0.106/CU-hour compute
- $0.35/GB-month storage
- No monthly minimum

A 0.25 CU compute running about 40 hours total in a month (10 CU-hours) with 2 GB of storage works out to about $1.76: $1.06 of compute plus $0.70 of storage. The [Launch plan examples](/docs/introduction/plans#launch-plan) put the same workload at $2.31 once you add a 1 GB dev branch and 1 GB of instant restore history.

## How autoscaling helps low-traffic projects

Set your min CU low (0.25) and your max CU as high as you need (up to 16 CU on the Launch plan). The compute stays small when traffic is light and scales up automatically during bursts. You're billed for the size the compute runs at during active time, so a database that sits at 0.25 CU for 23 hours and spikes to 2 CU for one hour uses 7.75 CU-hours that day (23 × 0.25 + 2), not the 48 CU-hours of a 2 CU compute running all day.

<Callout title="What 1 CU is">
Each Compute Unit allocates approximately 4 GB of RAM plus associated CPU and local SSD. A 0.25 CU compute is ≈1 GB RAM. Lakebase Postgres supports up to 10,000 [pooled connections](/docs/connect/connection-pooling) per compute. Direct connections scale with compute size (`max_connections` is 104 on 0.25 CU). Prefer the pooled connection string for most apps.
</Callout>

<CTA title="Start at 0.25 CU" description="Spin up a project in seconds and scale down to zero when you aren't using it." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
