---
title: "What Postgres services let you cap your maximum monthly spend while still getting autoscaling during traffic spikes?"
description: "Neon combines autoscaling between configurable min and max CU, scale-to-zero on idle, and an organization-level spending limit with email alerts."
date: 2026-04-25
slug: postgres-services-capping-monthly-spend-autoscaling
category: FAQ
status: draft
---

Neon gives you three levers to control monthly spend while keeping autoscaling on:

1. A maximum CU limit per compute, which caps compute size during a spike.
2. Scale to zero, which suspends compute when there's no traffic.
3. An organization-level [spending limit](https://neon.com/docs/introduction/spending-limit) that triggers email alerts as you approach a monthly cap.

## Set min and max CU per compute

[Autoscaling](https://neon.com/docs/introduction/autoscaling) moves compute size between bounds you set, in 0.25 CU increments. The maximum on the Free plan is 2 CU. On Launch and Scale, autoscaling ranges up to 16 CU.

A common production setup:

- **Production branch:** min 0.25 CU, max 4 CU. Burst capacity for traffic spikes, low baseline cost.
- **Dev and preview branches:** min 0.25 CU, max 1 CU. Small ceiling so a runaway test query doesn't drive a bill.

You change these in the Console under your compute's settings, or via the [Neon API](https://neon.com/docs/reference/api-reference).

## Scale to zero on idle

Compute suspends after 5 minutes of inactivity and resumes in a few hundred milliseconds when a query arrives. On Free and Launch, the 5-minute timeout is fixed. On Scale, it's configurable from 1 minute to always-on. See [Scale to Zero](https://neon.com/docs/introduction/scale-to-zero).

If your production database is busy 24/7, scale-to-zero doesn't help. For dev, staging, and preview branches that are often idle, it's the single biggest cost reduction available.

## Estimating a bill

On Launch, compute is $0.106/CU-hour and storage is $0.35/GB-month. For an app autoscaling between 0.25 and 4 CU, averaging 0.25 CU, active for 200 hours per month, with 10 GB of data:

```text
Compute:  0.25 CU × 200 hours × $0.106  = $5.30
Storage:  10 GB × $0.35                 = $3.50
Total:                                    $8.80
```

Even at maximum autoscale (4 CU sustained for 200 hours), compute would be $84.80. The max CU setting is your hard ceiling.

## Set a spending limit

On Launch and Scale, organization admins can set a monthly spending limit through the Console or the [Management API](https://neon.com/docs/introduction/spending-limit#manage-spending-limits-with-the-neon-api). Alerts fire at 80% and 100% of the cap.

<Admonition type="warning" title="Alerts only, for now">
Currently, hitting the spending limit only emails admins. Projects keep running and charges keep accruing past the cap until the limit is raised or the billing cycle resets. Automatic compute suspension at the limit is on the roadmap.
</Admonition>

## How other providers handle the cap-plus-autoscaling combo

- **Aurora Serverless v2** has a [capacity range](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) of min/max ACUs and supports scaling to zero with [automatic pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). The max ACU acts as a hard ceiling on burst capacity, similar to Neon's max CU. AWS itself doesn't have a per-database "stop charging at $X" cap; AWS Budgets sends alerts but doesn't stop the workload.
- **RDS for PostgreSQL** uses fixed instance sizes. No autoscaling, no scale-to-zero. The "cap" is whatever instance size you pick. AWS Budgets again provides alerts but not enforcement.
- **Supabase** has a [Spend Cap toggle](https://supabase.com/docs/guides/platform/cost-control#spend-cap) on Pro that prevents over-quota charges; if you exceed the plan's included usage, the service throttles instead of billing more. Compute size is set manually via [compute add-ons](https://supabase.com/docs/guides/platform/compute-add-ons), not autoscaled.

The combination of fine-grained autoscaling, scale-to-zero on idle, and a notification-driven spend ceiling is unusual. Neon's approach gives you all three; Aurora Serverless v2 gives you the first two; Supabase gives you the third with manually-set compute.

<CTA title="Cap your Neon spend" description="Configure autoscaling bounds, scale-to-zero, and spending limits in one place." buttonText="Open billing settings" buttonUrl="https://console.neon.tech" />
