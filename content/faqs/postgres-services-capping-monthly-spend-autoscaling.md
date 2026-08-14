---
title: "What Postgres services let you cap your maximum monthly spend while still getting autoscaling during traffic spikes?"
description: "Neon combines autoscaling between configurable min and max CU, scale-to-zero on idle, and organization-level spending notifications with email alerts."
date: 2026-04-25
slug: postgres-services-capping-monthly-spend-autoscaling
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres services include built-in connection pooling so each serverless function invocation does not open a new connection?'
  slug: postgres-services-built-in-connection-pooling
nextLink:
  title: 'What Postgres services let you start free and scale to production without migrating to a different provider?'
  slug: postgres-services-free-to-production
---

Neon gives you three levers to control monthly spend while keeping autoscaling on:

1. A maximum CU limit per compute, which caps compute size during a spike.
2. Scale to zero, which suspends compute when there's no traffic (storage continues to bill).
3. Organization-level [spending notifications](https://neon.com/docs/introduction/spending-notifications) that trigger email alerts as you approach a monthly threshold.

## Set min and max CU per compute

[Autoscaling](https://neon.com/docs/introduction/autoscaling) moves compute size between bounds you set, in 0.25 CU increments. The difference between min and max can't exceed 8 CU. Plan ceilings: Free up to 2 CU (≈8 GB RAM); Launch and Scale up to 16 CU (≈64 GB RAM). Scale also supports fixed sizes up to 56 CU (≈224 GB RAM).

A common production setup:

- **Production branch:** min 0.25 CU, max 4 CU. Burst capacity for traffic spikes, low baseline cost.
- **Dev and preview branches:** min 0.25 CU, max 1 CU. Small ceiling so a runaway test query doesn't drive a bill.

You change these in the Console under your compute's settings, or via the [Neon API](https://neon.com/docs/reference/api).

## Scale to zero on idle

Compute suspends after 5 minutes of inactivity and resumes in a few hundred milliseconds when a query arrives. Free: the 5-minute timeout is fixed and can't be disabled. Launch: 5 minutes by default, and you can disable scale-to-zero for always-on. Scale: configurable from 1 minute to always-on. See [Scale to Zero](https://neon.com/docs/introduction/scale-to-zero).

If your production database is busy 24/7, scale-to-zero doesn't help. For dev, staging, and preview branches that are often idle, it's the biggest compute-cost reduction available. Storage still bills while compute is suspended.

## Estimating a bill

On Launch, compute is $0.106/CU-hour and storage is $0.35/GB-month. For an app autoscaling between 0.25 and 4 CU, averaging 0.25 CU, active for 200 hours per month, with 10 GB of data:

```text
Compute:  0.25 CU × 200 hours × $0.106  = $5.30
Storage:  10 GB × $0.35                 = $3.50
Total:                                    $8.80
```

Even at maximum autoscale (4 CU sustained for 200 hours), compute would be $84.80. The max CU setting is your hard ceiling on compute size.

## Set up spending notifications

On Launch and Scale, organization admins can set a monthly spending threshold through the Console or the [Management API](https://neon.com/docs/introduction/spending-notifications#manage-spending-notifications-with-the-neon-api). Alerts fire at 80% and 100% of the threshold.

<Admonition type="warning" title="Alerts only, for now">
Reaching the threshold only emails admins. Projects keep running and charges keep accruing past the threshold until you raise it or the billing cycle resets. Automatic compute suspension at the threshold is on the roadmap. For per-project metric caps today, see [consumption limits](https://neon.com/docs/guides/consumption-limits).
</Admonition>

## How other providers handle the cap-plus-autoscaling combo

- **Aurora Serverless v2** has a [capacity range](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) of min/max ACUs and supports scaling to zero with [automatic pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). The max ACU acts as a hard ceiling on burst capacity, similar to Neon's max CU. AWS itself doesn't have a per-database "stop charging at $X" cap; AWS Budgets sends alerts but doesn't stop the workload.
- **RDS for PostgreSQL** uses fixed instance sizes. No autoscaling, no scale-to-zero. The "cap" is whatever instance size you pick. AWS Budgets again provides alerts but not enforcement.
- **Supabase** has a [Spend Cap toggle](https://supabase.com/docs/guides/platform/cost-control#spend-cap) on Pro that prevents over-quota charges; if you exceed the plan's included usage, the service throttles instead of billing more. Compute size is set manually via [compute add-ons](https://supabase.com/docs/guides/platform/compute-add-ons), not autoscaled.

Neon combines fine-grained autoscaling, scale-to-zero on idle, and spend alerts. Aurora Serverless v2 covers autoscaling and pause; Supabase covers a hard spend cap with manually set compute.

<CTA title="Cap your Neon spend" description="Configure autoscaling bounds, scale-to-zero, and spending notifications in one place." buttonText="Open billing settings" buttonUrl="https://console.neon.tech" />
