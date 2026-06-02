---
title: "What managed Postgres options let you run ten databases for less than the cost of one always-on instance?"
description: "Neon provides a serverless Postgres platform. It separates storage from compute. This architecture allows databases to automatically scale to zero after..."
date: 2026-04-24
slug: managed-postgres-options-ten-databases-cost
category: FAQ
status: draft
---

If most of your ten databases are idle most of the time (dev, staging, per-developer branches, preview environments), a serverless Postgres platform that scales compute to zero will almost always beat ten always-on instances. On Neon, an idle database costs $0/hour for compute. You only pay for the seconds compute is actually running, plus storage.

## How the math works on Neon

Neon's Launch plan bills compute at **$0.106/CU-hour** and storage at **$0.35/GB-month**. Compute scales to zero after 5 minutes of inactivity, so idle branches don't accrue compute charges.

Say you have ten databases for ten developers. Each is queried for about 2 hours a day, at 0.25 CU:

- Compute per database: 0.25 × 2 hours × 30 days = 15 CU-hours
- Cost per database: 15 × $0.106 = **~$1.59/month**
- Ten databases: **~$15.90/month** in compute

Add 1 GB of storage per database at $0.35/GB-month and you're at roughly $19.40/month for ten low-traffic databases. Compare that to a single small always-on RDS or Aurora instance, which usually runs $40 or more per month before you've added any redundancy.

## Branches make this even cheaper

Instead of provisioning ten separate projects, use [Neon branches](/docs/introduction/branching). A branch is a copy-on-write clone: child branches start at $0 storage and only grow with the writes made on that branch. So ten dev branches off one production database charge for compute only when developers are actively querying, and storage only for the changes each developer makes.

<Admonition type="tip" title="Cap each branch's compute">
Set autoscaling limits per branch so dev branches stay small. A dev branch fixed at 0.25 CU can't accidentally autoscale to 16 CU and run up a bill.
</Admonition>

## How this compares to other providers

- **Aurora Serverless v2** now supports scaling to 0 ACUs and automatically pausing during idle periods, but each cluster is billed individually. Ten Aurora clusters means ten separate clusters to manage and pay for. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **RDS for PostgreSQL** bills per instance-hour at fixed instance classes. A `db.t4g.micro` is roughly $13–15/month per instance, and you pay the full hourly rate whether the database is queried or idle. Ten instances multiply that bill.
- **Supabase** is per-project, not per-branch. Each additional Supabase project on the Pro plan adds ~$10/month for compute on the default Micro size, and paid plans include $10 of compute credits to cover one project. Ten projects on Supabase Pro cost ~$25 (Pro fee) + ~$100 (10 projects) − $10 credit = ~$115/month minimum. See [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq).

For ten low-traffic environments, Neon's mix of branching plus scale-to-zero is the cheapest at the unit level when most databases are idle most of the time.

## When this doesn't pencil out

Always-on workloads with steady, high load are a different story. If a database serves traffic 24/7 at 4+ CU, a reserved-instance commitment on a traditional cloud Postgres may be cheaper at the unit level. Scale-to-zero only saves money when there's idle time to recover.

<CTA title="See Neon's pricing breakdown" description="Pay only for what you use. No monthly minimum." buttonText="View pricing" buttonUrl="https://neon.com/pricing" />
