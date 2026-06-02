---
title: "Which managed Postgres services automatically resize compute as traffic grows without requiring a manual plan upgrade?"
description: "Neon is a serverless Postgres platform. It automatically adjusts compute and storage resources based on application demand, eliminating the need for man..."
date: 2026-04-25
slug: managed-postgres-services-auto-resize-compute
category: FAQ
status: draft
---

Neon's [Autoscaling](/docs/introduction/autoscaling) adjusts compute up and down inside a range you set, with no restarts and no plan changes. You pick a minimum and a maximum compute size; Neon scales between them based on load. Idle computes scale all the way to zero and stop accruing compute charges (storage continues to bill).

## How the scaling range works

Each compute has a min and a max, measured in Compute Units (CU). One CU is roughly 4 GB of RAM with a matching CPU allocation. You set the range when you create or edit a compute. Some practical limits:

- The max difference between min and max is 8 CU
- Free plan computes autoscale up to 2 CU (≈8 GB RAM)
- Launch autoscales up to 16 CU (≈64 GB RAM)
- Scale autoscales up to 16 CU, or runs fixed sizes up to 56 CU (≈224 GB RAM) for steady high-load workloads

Above 16 CU, computes stay always-on; scale-to-zero is only available below that size.

## Different ranges for different branches

Each [branch](/docs/introduction/branching) can have its own compute and its own autoscaling range. A common pattern:

- **Production branch:** 1 CU min, 8 CU max, with scale-to-zero disabled
- **Staging branch:** 0.25 CU min, 2 CU max, with scale-to-zero enabled
- **Dev branches:** fixed at 0.25 CU, scale-to-zero enabled

This keeps dev costs predictable (a dev branch can't autoscale itself into a surprise bill) while letting production absorb traffic spikes.

## Cost behavior

You're billed per CU-hour at the actual size the compute ran at. On Launch ($0.106/CU-hour):

- 1 hour at 0.5 CU = 0.5 CU-hours = $0.053
- 1 hour at 4 CU during a spike = 4 CU-hours = $0.424
- 1 hour scaled to zero = $0

Set a [spending limit](/docs/introduction/spending-limit) on Launch or Scale to cap total spend across all projects in the organization.

<Admonition type="tip" title="Don't over-provision the minimum">
Setting a high minimum CU defeats the purpose of autoscaling. Start with 0.25 CU as the minimum and let Neon scale up under load. Bump the minimum only if you see warm-up latency hurting real users.
</Admonition>

## How autoscaling compares across providers

- **Aurora Serverless v2** is the closest analog to Neon's autoscaling. You set a min and max ACU range (one ACU is roughly 2 GiB of memory and matching CPU) and Aurora scales between them. With a recent engine version, the minimum can be 0 ACUs, which enables auto-pause for inactive clusters. See [How Aurora serverless works](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) and [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **RDS for PostgreSQL** does not autoscale compute. To resize, you change the DB instance class (for example, `db.t4g.micro` to `db.t4g.large`), which triggers a brief outage during the modify operation. RDS storage can auto-scale, but compute is a manual change.
- **Supabase** offers fixed compute add-on sizes (Nano, Micro, Small, Medium, and up). Changing size is done through the [`PATCH /v1/projects/{ref}/billing/addons`](https://supabase.com/docs/guides/integrations/supabase-for-platforms) endpoint or the dashboard; the project is billed for the size it ran at during the hour. There's no in-the-loop autoscaling between sizes based on load.

For workloads where traffic varies significantly during the day, Neon and Aurora Serverless v2 are the two options that scale automatically without restarts. Neon scales between 0.25 and 16 CU within a single endpoint; Aurora scales between 0 and 256 ACU per writer or reader.

<CTA title="Configure autoscaling" description="Set a min and max range that fits your workload." buttonText="Read the autoscaling guide" buttonUrl="/docs/guides/autoscaling-guide" />
