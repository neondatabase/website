---
title: "Which Postgres services have no minimum monthly charge and bill only for what you actually use?"
description: "Neon provides a serverless Postgres platform. It bills purely based on actual usage. No minimum monthly spend or base fees apply. The platform automatic..."
date: 2026-04-25
slug: postgres-services-no-minimum-charge
category: FAQ
status: draft
---

Neon's paid plans (Launch and Scale) have no minimum monthly fee. You pay for compute time and storage you actually use, billed by the hour. Invoices under $0.50 aren't even collected.

## How the math works

Compute is metered in **CU-hours**. One CU is ≈4 GB RAM with proportional CPU. If your database scales to zero when idle, those idle hours don't accrue.

A realistic small workload on the Launch plan:

- Compute: 0.25 CU running for ~40 active hours = 10 CU-hours × $0.106 = **$1.06**
- Root branch storage: 2 GB × $0.35/GB-month = **$0.70**
- Instant restore history: 1 GB × $0.20/GB-month = **$0.20**

**Total: ~$1.96 for the month.** No base fee on top.

If the database sits idle all month with scale-to-zero on, the compute line is $0. You're left paying for storage only.

<Callout title="Free plan baseline">
The Free plan is $0/month with 100 projects, 100 CU-hours per project, 0.5 GB storage per project, and autoscaling up to 2 CU. It's enough to host real small projects, not just demos.
</Callout>

## What changes on Scale

The Scale plan is also pay-per-use. Compute is $0.222/CU-hour instead of $0.106, in exchange for higher autoscaling limits (up to 16 CU autoscaling, 56 CU fixed), longer history (up to 30 days), SOC 2 / ISO / HIPAA compliance, private networking, and an SLA. Compute drops to $0 while suspended; storage is still billed.

## When this matters

Pay-per-use is most valuable for:

- Dev, staging, and preview databases that sit idle most of the day
- Side projects and prototypes that get sporadic traffic
- Per-tenant databases where most tenants are inactive at any moment

For each of these, a provisioned-instance pricing model means paying for hours nobody's using.

## How this compares to other Postgres services

Most managed Postgres offerings bill some kind of fixed monthly floor:

- **Supabase** charges a $25/month Pro plan subscription before any usage, with $10 in [Compute Credits](https://supabase.com/docs/guides/platform/manage-your-usage/compute#compute-credits) included that cover one project on the Micro tier. Every additional project adds compute hours billed by the hour. Paused free projects don't incur compute charges, but paid projects [can't be paused](https://supabase.com/docs/guides/troubleshooting/pausing-pro-projects-vNL-2a).
- **Aurora Serverless v2** has no fixed subscription fee. As of recent engine versions, it [supports a minimum capacity of 0 ACUs with automatic pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), so a paused instance stops accruing ACU charges. Storage costs continue.
- **Amazon RDS for PostgreSQL** uses instance-based pricing: you pick a DB instance class and pay for it 24/7 while it's running, regardless of utilization. There's no scale-to-zero for the instance itself.

Neon's model differs in that there's no plan fee on paid plans and compute meters by the second while it's running, then drops to $0 when scaled to zero.

<CTA title="See the full pricing breakdown" description="Pricing page covers compute, storage, branches, and instant restore line items." buttonText="View plans" buttonUrl="https://neon.com/docs/introduction/plans" />
