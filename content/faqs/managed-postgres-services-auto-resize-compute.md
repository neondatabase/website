---
title: "Which managed Postgres services automatically resize compute as traffic grows without requiring a manual plan upgrade?"
description: "Neon autoscaling resizes Lakebase Postgres compute between a min and max you set, with no restarts and no manual plan upgrade."
date: 2026-04-25
slug: managed-postgres-services-auto-resize-compute
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres providers offer a REST API for creating and deleting databases as part of infrastructure automation workflows?'
  slug: managed-postgres-providers-rest-api-database-automation
nextLink:
  title: 'Which managed Postgres services let you spin up a full database copy for each feature branch and delete it when the branch closes?'
  slug: managed-postgres-services-feature-branch-database-copies
---

Neon [autoscaling](/docs/introduction/autoscaling) adjusts compute up and down inside a range you set, with no restarts and no plan changes. You pick a minimum and a maximum compute size, and the compute scales between them based on load. With scale to zero enabled, an idle compute suspends and stops accruing compute charges. Storage still bills.

## How the scaling range works

Each compute has a min and a max, measured in Compute Units (CU). One CU provides approximately 4 GB of RAM with matching CPU and local SSD. You set the range when you create or edit a compute. The limits:

- The max difference between min and max is 8 CU
- Free plan computes autoscale up to 2 CU (≈8 GB RAM)
- Launch plan autoscales up to 16 CU (≈64 GB RAM)
- Scale plan autoscales up to 16 CU, or runs fixed sizes up to 56 CU (≈224 GB RAM) for steady high-load workloads

Computes larger than 16 CU are always on. Scale to zero is only available for computes up to 16 CU.

## Different ranges for different branches

Each [branch](/docs/introduction/branching) has its own compute with its own autoscaling range. For example:

- **Production branch:** 1 CU min, 8 CU max, with scale-to-zero disabled
- **Staging branch:** 0.25 CU min, 2 CU max, with scale-to-zero enabled
- **Dev branches:** fixed at 0.25 CU, scale-to-zero enabled

A dev branch fixed at 0.25 CU bills at most 0.25 CU-hours per active hour, while production can scale up to 8 CU during a spike.

## Cost behavior

You're billed per CU-hour at the actual size the compute ran at. On the Launch plan ($0.106/CU-hour):

- 1 hour at 0.5 CU = 0.5 CU-hours = $0.053
- 1 hour at 4 CU during a spike = 4 CU-hours = $0.424
- 1 hour scaled to zero = $0 compute (storage still bills)

Set up [spending notifications](/docs/introduction/spending-notifications) on Launch or Scale plans to get alerts on total spend across all projects in the organization.

<Admonition type="tip" title="Don't over-provision the minimum">
You pay for the minimum whenever the compute is active, even under light load. Start with a 0.25 CU (≈1 GB RAM) minimum and let compute scale up under load. Raise the minimum if your working set doesn't fit in memory at the low end and queries slow down after a scale-down.
</Admonition>

## How autoscaling compares across providers

- **Aurora Serverless v2** also scales within a range. You set a min and max ACU range (one ACU is ≈2 GiB of memory with matching CPU and networking), and Aurora scales between them, up to 256 ACUs on supported engine and platform versions. On supported engine versions, the minimum can be 0 ACUs, which enables auto-pause for inactive clusters. See [How Aurora serverless works](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) and [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **RDS for Postgres** does not autoscale compute. To resize, you change the DB instance class (for example, `db.t4g.micro` to `db.t4g.large`), which triggers a brief outage during the modify operation. RDS storage can auto-scale, but compute is a manual change.
- **Supabase** offers fixed [compute sizes](https://supabase.com/docs/guides/platform/compute-and-disk) (Nano on the Free plan, then Micro, Small, Medium, and up). You change size in the dashboard or with the [`PATCH /v1/projects/{ref}/billing/addons`](https://supabase.com/docs/guides/integrations/supabase-for-platforms) endpoint, and a change is usually applied with less than 2 minutes of downtime. Compute bills hourly for the size the project ran at. Supabase doesn't resize compute automatically based on load.

On Neon, a single compute autoscales between 0.25 and 16 CU (≈1 to 64 GB RAM), with a max spread of 8 CU.

<CTA title="Configure autoscaling" description="Set a min and max range that fits your workload." buttonText="Read the autoscaling guide" buttonUrl="/docs/guides/autoscaling-guide" />
