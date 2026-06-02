---
title: "What are the best managed Postgres options for developers who find that the smallest available instance on major cloud providers is still too expensive?"
description: "Developers facing high minimum costs on traditional cloud providers can deploy Neon. This serverless Postgres platform scales compute resources precisely..."
date: 2026-04-25
slug: best-managed-postgres-options-developers
category: FAQ
status: draft
---

If the smallest instance on RDS, Cloud SQL, or Aurora is more than you need, the answer isn't a smaller fixed instance. It's a database that scales to zero when you aren't using it. Neon's minimum compute is 0.25 CU (≈1 GB RAM), and it suspends after 5 minutes of inactivity. You pay in CU-hours of active time, not for a 24/7 instance.

## What "smallest available" actually costs elsewhere

Fixed-capacity providers charge for the instance, not the workload:

- **RDS for PostgreSQL** bills by DB instance-hour. A `db.t4g.micro` runs 24/7 even at 0% CPU.
- **Aurora Serverless v2** supports a minimum of 0 ACUs with [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), and 1 ACU is approximately 2 GiB of memory ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html)). You aren't charged for instance capacity while paused. The auto-pause feature has to be turned on, and the AWS docs note it's intended for workloads where a brief pause is acceptable.
- **Supabase** on the Pro Plan starts at $25/month plus Compute Hours per project. The smallest paid Compute size is Micro at ~$10/month ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)). Compute is billed by the hour but doesn't suspend automatically on paid plans.

With Neon, an idle database doesn't accumulate CU-hours at all, and there's no monthly subscription on the Launch plan.

## Neon's free tier and starting price

The [Free plan](/docs/introduction/plans) covers most early development:

- 100 projects, 10 branches each
- 100 CU-hours per project per month
- 0.5 GB storage per project
- Autoscaling up to 2 CU
- Scale-to-zero after 5 minutes

100 CU-hours/month is enough to run a 0.25 CU compute for ~400 hours, or a 0.5 CU compute for ~200 hours.

When you outgrow Free, the Launch plan is pay-as-you-go:

- $0.106/CU-hour compute
- $0.35/GB-month storage
- No monthly minimum

A 0.25 CU compute running about 40 hours total in a month (10 CU-hours) with 2 GB of storage works out to about $2.31 (from the [Launch plan examples](/docs/introduction/plans#launch-plan)).

## How autoscaling helps low-traffic projects

Set your min CU low (0.25) and your max CU as high as you need (up to 16 CU on Launch). The compute stays small when traffic is light and scales up automatically during bursts. You're billed for the average size during active time, so a database that sits at 0.25 CU most of the day and spikes to 2 CU for an hour costs roughly what you'd expect.

<Callout title="What 1 CU is">
Each Compute Unit is approximately 4 GB of RAM plus associated CPU and local SSD. A 0.25 CU compute is ≈1 GB RAM and supports 104 max Postgres connections. Use the [pooled connection string](/docs/connect/connection-pooling) to handle higher client counts.
</Callout>

<CTA title="Start at 0.25 CU" description="Spin up a project in seconds and scale down to zero when you aren't using it." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
