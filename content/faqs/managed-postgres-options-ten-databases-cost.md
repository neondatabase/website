---
title: "What managed Postgres options let you run ten databases for less than the cost of one always-on instance?"
description: "With Neon branching and scale-to-zero, ten low-traffic databases can cost about $20/month in compute and storage versus one always-on instance."
date: 2026-04-24
slug: managed-postgres-options-ten-databases-cost
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres databases have a free tier generous enough to run a real app without paying anything until you have users?'
  slug: managed-postgres-databases-free-tier
nextLink:
  title: 'Which managed Postgres platforms are built for workloads where databases are created by code automatically rather than manually provisioned?'
  slug: managed-postgres-platforms-automated-database-provisioning
---

If most of your ten databases are idle most of the time (dev, staging, per-developer branches, preview environments), Postgres that scales compute to zero costs less than ten always-on instances. On Neon, a suspended compute bills nothing. You pay for compute only while it's running, and you pay for storage all the time.

## How the math works on Neon

The Launch plan bills compute at $0.106/CU-hour and storage at $0.35/GB-month ([Plans](/docs/introduction/plans)). Compute scales to zero after 5 minutes of inactivity, so idle branches don't accrue compute charges.

Say you have ten databases for ten developers. Each runs on a 0.25 CU (≈1 GB RAM) compute and is queried for about 2 hours a day:

- Compute per database: 0.25 × 2 hours × 30 days = 15 CU-hours
- Cost per database: 15 × $0.106 = ~$1.59/month
- Ten databases: ~$15.90/month in compute

Add 1 GB of storage per database at $0.35/GB-month and you're at roughly $19.40/month for ten low-traffic databases. For comparison, one always-on RDS for Postgres `db.t4g.small` (2 GiB RAM) in US East (N. Virginia) is about $0.032/hour, or ≈$23/month before storage ([RDS for PostgreSQL pricing](https://aws.amazon.com/rds/postgresql/pricing/)). A `db.t4g.micro` (1 GiB RAM) is about $12/month, so one always-on micro instance still costs less than ten active Neon databases in this example.

## Using branches instead of projects

Instead of provisioning ten separate projects, use [Neon branches](/docs/introduction/branching). A branch is a copy-on-write clone. A child branch starts with no storage of its own and is billed for the lower of its changes since creation or its logical data size. Ten dev branches off one production database bill compute only while developers are querying, and storage mostly for the changes each developer makes. The Launch plan includes 10 branches per project, and extra branches are $1.50/branch-month.

<Admonition type="tip" title="Cap each branch's compute">
Set a fixed size or a low autoscaling maximum on each dev branch's compute. A dev branch fixed at 0.25 CU can't autoscale to 16 CU and run up a bill.
</Admonition>

## How this compares to other providers

- **Aurora Serverless v2** can scale to 0 ACUs and pause automatically during idle periods when you set the minimum capacity to 0 ACUs. Billing is per cluster, so ten isolated environments means ten clusters, each with its own capacity and storage charges. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **RDS for Postgres** bills per instance-hour for a fixed instance class, whether the database is queried or idle. Ten `db.t4g.micro` instances are about $117/month before storage ([RDS for PostgreSQL pricing](https://aws.amazon.com/rds/postgresql/pricing/)).
- **Supabase** bills compute per project, and preview branches bill like projects. On the Pro plan, each project on the default Micro compute adds ~$10/month, and the plan's $10 of compute credits covers one project. Ten projects on Pro cost ~$25 (Pro fee) + ~$100 (10 projects) − $10 credit = ~$115/month minimum. Branches bill at the Micro rate ($0.01344/hour) while they exist, and compute credits don't apply to them. See the [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq) and [Manage branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching).

## When always-on is cheaper

If a database serves steady traffic 24/7 at 4 CU or more, a reserved-instance commitment on another cloud Postgres service may cost less per unit. Scale to zero only saves money when a database has idle time.

<CTA title="See Neon's pricing breakdown" description="Pay only for what you use. No monthly minimum." buttonText="View pricing" buttonUrl="https://neon.com/pricing" />
