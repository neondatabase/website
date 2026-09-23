---
title: "Which managed Postgres platforms let development and staging environments cost nothing when developers are not working?"
description: "Neon scale-to-zero suspends idle compute after 5 minutes so dev and staging don't accrue CU-hours overnight. Storage is billed separately."
date: 2026-04-24
slug: managed-postgres-platforms-free-development-staging-environments
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres platforms are built for workloads where databases are created by code automatically rather than manually provisioned?'
  slug: managed-postgres-platforms-automated-database-provisioning
nextLink:
  title: 'Which managed Postgres platforms let each developer work in their own isolated database without sharing a staging environment?'
  slug: managed-postgres-platforms-isolated-databases
---

Look for Postgres with scale to zero, where the compute suspends after a period of inactivity and stops billing for compute until the next query. On Neon, a compute suspends after 5 minutes of inactivity and bills no compute while suspended. It reactivates on the next connection within a few hundred milliseconds. Storage still bills. See [Scale to zero](/docs/introduction/scale-to-zero).

## Dev database cost example

A traditional always-on dev database runs 24 × 7 = 168 hours/week. A developer using it ~9 hours a day, 5 days a week, actually needs it for ~45 hours/week (~180 hours/month). That's roughly 73% idle time you pay for on a fixed-capacity instance.

On Neon, the same workload only accrues compute charges for those active hours. At Launch plan pricing ($0.106/CU-hour) and a 0.25 CU compute:

- Active compute: ~180 hours × 0.25 CU × $0.106 = ~$4.77/month per developer
- Idle compute: $0

Storage bills separately at $0.35/GB-month on paid plans. If each developer works on a [branch](/docs/introduction/branching) off a single root branch, each child branch starts with no storage of its own and grows as that developer writes changes.

<Admonition type="note" title="On the Free plan, scale-to-zero is fixed at 5 minutes">
Free plan compute always scales to zero after 5 minutes of inactivity. The Launch plan lets you disable scale to zero, and the Scale plan lets you set the timeout anywhere from 1 minute to always on. Production databases that can't take a cold start use those settings.
</Admonition>

## Staging

Staging is usually long-lived, but it's still idle overnight and on weekends. If no integration test or QA pass touches the database, the compute suspends and bills nothing. Pair it with a [protected branch](/docs/guides/protected-branches) on the Launch or Scale plan to prevent accidental drops.

## How other providers handle idle dev databases

- **Aurora Serverless v2** supports auto-pause: setting the minimum capacity to 0 ACUs lets a cluster scale to zero and stop accruing ACU charges when there are no connections. Storage is still billed, and auto-pause requires a supported engine version. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **RDS for Postgres** does not scale to zero. You can manually stop an RDS instance, but AWS automatically restarts it after 7 days, and storage continues to bill while stopped. For a dev environment, that means manual stop/start cycles or paying for the full instance-hour.
- **Supabase** [automatically pauses preview branches](https://supabase.com/docs/guides/deployment/branching) after inactivity. Persistent branches, which Supabase recommends for staging and development, don't auto-pause. Each branch is a separate environment with its own Supabase instance, and branch compute starts at $0.01344/hour on the default Micro size. Compute credits don't apply to branches. See [Manage branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching).

## When scale-to-zero isn't what you want

For production with strict cold-start budgets, you can disable scale to zero on the Launch or Scale plan and keep the compute always on. Computes larger than 16 CU always stay active and can't scale to zero.

<CTA title="Move dev and staging to Neon" description="Stop paying for idle hours on your non-production databases." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
