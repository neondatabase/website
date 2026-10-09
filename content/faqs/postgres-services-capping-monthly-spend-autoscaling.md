---
title: "What Postgres services let you cap your maximum monthly spend while still getting autoscaling during traffic spikes?"
description: "Neon combines autoscaling between configurable min and max CU, scale-to-zero on idle, per-project consumption quotas, and organization-level spending notifications."
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

Neon gives you four controls for monthly spend that work with autoscaling on:

1. A maximum CU per compute, which caps compute size during a spike.
2. Scale to zero, which suspends compute when there's no traffic. Storage still bills while compute is suspended.
3. Per-project [consumption quotas](/docs/guides/consumption-limits), which suspend a project's computes when it reaches a compute-time, storage, or data-transfer limit you set.
4. Organization-level [spending notifications](/docs/introduction/spending-notifications), which email admins as spend approaches a monthly dollar threshold.

## Set min and max CU per compute

[Autoscaling](/docs/introduction/autoscaling) moves compute size between bounds you set, in 0.25 CU increments. The gap between min and max can't exceed 8 CU. Plan ceilings: the Free plan goes up to 2 CU (≈8 GB RAM), and the Launch and Scale plans go up to 16 CU (≈64 GB RAM). The Scale plan also supports fixed sizes up to 56 CU (≈224 GB RAM).

An example setup:

- **Production branch:** min 0.25 CU, max 4 CU. Room to burst during spikes, with a low baseline.
- **Dev and preview branches:** min 0.25 CU, max 1 CU. A runaway test query can't push the compute past 1 CU.

You change these in the Console under your compute's settings, or with the [Neon API](/docs/reference/api).

## Scale to zero on idle

Compute suspends after 5 minutes of inactivity and resumes within a few hundred milliseconds when a query arrives. On the Free plan, the 5-minute timeout is fixed. On the Launch plan, it's 5 minutes by default and you can turn scale to zero off. On the Scale plan, you can set it from 1 minute to always on. See [Scale to zero](/docs/introduction/scale-to-zero).

A production database that's busy around the clock won't suspend, so scale to zero mostly saves money on dev, staging, and preview branches that sit idle.

## Estimate a bill

On the Launch plan, compute is $0.106/CU-hour and storage is $0.35/GB-month. For an app that autoscales between 0.25 and 4 CU, averages 0.25 CU, runs 200 hours a month, and stores 10 GB:

```text
Compute:  0.25 CU × 200 hours × $0.106  = $5.30
Storage:  10 GB × $0.35                 = $3.50
Total:                                    $8.80
```

If the same compute ran at the 4 CU maximum for all 200 hours, compute would be $84.80. The max CU setting caps compute size, not hours. To cap hours as well, set a consumption quota.

## Set a hard limit with consumption quotas

Consumption quotas are set per project through the `quota` object in the Create or Update Project API. You can cap `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, `data_transfer_bytes`, and `logical_size_bytes`. When a project reaches any quota, Neon suspends all of its active computes, and they stay suspended until the next billing period starts. Unlike scale to zero, a new connection doesn't wake them. See [Configure consumption limits](/docs/guides/consumption-limits).

Quotas limit usage metrics, not dollars, so you translate a budget into CU-seconds or bytes yourself.

## Set up spending notifications

On the Launch and Scale plans, organization admins set a monthly dollar threshold on the **Billing** page or through the [Management API](/docs/introduction/spending-notifications#manage-spending-notifications-with-the-neon-api). Neon checks spend every 15 minutes and emails admins at 80% and 100% of the threshold.

<Admonition type="warning" title="Alerts only, for now">
Reaching the threshold only emails admins. Projects keep running and charges keep accruing until you raise the threshold or the billing cycle resets. Automatic compute suspension at the threshold is coming soon. To stop usage today, use [consumption quotas](/docs/guides/consumption-limits).
</Admonition>

## How other providers compare

- **Aurora Serverless v2** scales within a [min/max ACU range](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) and can scale to zero when you set the minimum to 0 ACUs and enable [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). The max ACU caps burst size, like Neon's max CU. For spend, [AWS Budgets actions](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html) can apply IAM policies or SCPs, or stop EC2 and RDS instances, when a budget threshold is crossed.
- **RDS for Postgres** uses fixed instance classes with no autoscaling of compute or scale to zero. Compute cost is set by the instance class you pick, and AWS Budgets alerts and actions work the same way as for Aurora.
- **Supabase** has a [Spend Cap](https://supabase.com/docs/guides/platform/cost-control#spend-cap) on the Pro plan that blocks usage beyond plan quotas for items like disk size, egress, and MAU instead of billing overages. The Spend Cap doesn't cover compute, branching compute, read replicas, or PITR. Compute size is chosen manually, and Supabase says [compute sizes are not auto-upgraded](https://supabase.com/docs/guides/platform/compute-and-disk) because of the downtime a resize incurs.

<CTA title="Cap your Neon spend" description="Configure autoscaling bounds, scale-to-zero, and spending notifications in one place." buttonText="Open billing settings" buttonUrl="https://console.neon.tech" />
