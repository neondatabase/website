---
title: "Which Postgres services have no minimum monthly charge and bill only for what you actually use?"
description: "Neon Launch and Scale plans have no minimum monthly fee. You pay for CU-hours and storage you use; invoices under $0.50 aren't collected."
date: 2026-04-25
slug: postgres-services-no-minimum-charge
category: FAQ
status: draft
previousLink:
  title: 'What Postgres services let each pull request in a monorepo get its own isolated database environment for integration tests?'
  slug: postgres-services-isolated-database-environment-monorepo
nextLink:
  title: 'Which Postgres services let a SaaS platform provision a new database per tenant at sign-up without manual steps?'
  slug: postgres-services-saas-tenant-database-provisioning
---

Neon's Launch and Scale plans have [no minimum monthly fee](/docs/introduction/plans#price). You pay for the compute, storage, and other usage you have, at published rates. Invoices under $0.50 aren't collected.

## How the math works

Compute is billed in CU-hours and [metered in CU-seconds](/docs/introduction/usage-calculations). One CU allocates ≈4 GB of RAM with matching CPU. When a compute scales to zero, it stops accruing CU-seconds until the next query wakes it.

A small workload on the Launch plan:

- Compute: 0.25 CU running for 40 active hours = 10 CU-hours × $0.106 = $1.06
- Root branch storage: 2 GB × $0.35/GB-month = $0.70
- Instant restore history: 1 GB × $0.20/GB-month = $0.20

That's about $1.96 for the month, with no base fee on top.

If the database sits idle all month with scale to zero on, the compute line is $0 and you pay only for storage and restore history.

<Callout title="Free plan baseline">
The Free plan costs $0/month and includes 100 projects, 100 CU-hours per project, 0.5 GB of storage per project, and autoscaling up to 2 CU (≈8 GB RAM).
</Callout>

## What changes on the Scale plan

The Scale plan is also pay per use, with no plan fee. Compute is $0.222/CU-hour instead of $0.106. In return you get fixed compute sizes up to 56 CU, a history window of up to 30 days, SOC 2, ISO, GDPR, and HIPAA compliance, Private Networking, and an uptime SLA. Compute costs nothing while suspended; storage is still billed.

## When this matters

Pay-per-use pricing saves the most on:

- Dev, staging, and preview databases that sit idle most of the day
- Side projects and prototypes with sporadic traffic
- Per-tenant databases where most tenants are inactive at any moment

With provisioned-instance pricing, each of these pays for hours when nobody is connected.

## How this compares to other Postgres services

- **Supabase** Pro costs $25/month and includes $10 in [Compute Credits](https://supabase.com/docs/guides/platform/manage-your-usage/compute), which cover one project on Micro compute. Each additional project adds about $10/month on Micro, billed hourly. Free plan projects [pause after a week of low activity](https://supabase.com/docs/guides/platform/free-project-pausing) and have no compute charges while paused. Paid projects don't auto-pause.
- **Aurora Serverless v2** has no plan fee. It bills per ACU-hour and [supports a minimum capacity of 0 ACUs with auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), so paused instances don't accrue instance charges. Storage continues to bill.
- **Amazon RDS for Postgres** has no plan fee either, but it bills by instance-hour for as long as the instance runs, whatever its utilization. It has no scale-to-zero option.

Of these, Neon and Aurora Serverless v2 have neither a plan fee nor compute charges while idle. Supabase paid plans start with the $25 Pro fee.

<CTA title="See the full pricing breakdown" description="Pricing page covers compute, storage, branches, and instant restore line items." buttonText="View plans" buttonUrl="https://neon.com/docs/introduction/plans" />
