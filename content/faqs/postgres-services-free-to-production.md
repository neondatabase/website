---
title: "What Postgres services let you start free and scale to production without migrating to a different provider?"
description: "Neon's Free, Launch, and Scale plans run on the same lakebase architecture with the same connection strings. Upgrading raises limits and unlocks features without a data migration."
date: 2026-04-24
slug: postgres-services-free-to-production
category: FAQ
status: draft
previousLink:
  title: 'What Postgres services let you cap your maximum monthly spend while still getting autoscaling during traffic spikes?'
  slug: postgres-services-capping-monthly-spend-autoscaling
nextLink:
  title: 'Which Postgres services integrate with GitHub Actions to create a fresh database for every pull request automatically?'
  slug: postgres-services-github-actions-fresh-database-pull-requests
---

Neon's three plans run on the same lakebase architecture. Moving from the Free plan to the Launch plan or the Scale plan is a billing change, not a data migration. Your connection string, compute, storage, and Postgres version stay the same. The plan changes resource limits, support level, and access to compliance features.

## What you get on each plan

|                  | **Free**                      | **Launch**         | **Scale**                                    |
| ---------------- | ----------------------------- | ------------------ | -------------------------------------------- |
| Monthly fee      | $0                            | Pay per use        | Pay per use                                  |
| Compute price    | 100 CU-hours/project included | $0.106/CU-hour     | $0.222/CU-hour                               |
| Storage          | 0.5 GB/project                | $0.35/GB-month     | $0.35/GB-month                               |
| Autoscaling max  | 2 CU (≈8 GB RAM)              | 16 CU (≈64 GB RAM) | 16 CU autoscaling, 56 CU fixed (≈224 GB RAM) |
| Scale to zero    | 5 min, fixed                  | 5 min, can disable | 1 min to always on                           |
| Branches/project | 10                            | 10                 | 25                                           |
| History window   | 6 hours (up to 1 GB-month)    | Up to 7 days       | Up to 30 days                                |
| Compliance       | None                          | Protected branches | SOC 2, ISO, GDPR, HIPAA                      |

See the [full plan comparison](/docs/introduction/plans) for support tiers, snapshots, and network transfer.

## What "no migration" looks like

You upgrade in the Console, and the change applies to the whole organization. Existing projects keep their endpoint hostnames, branches, data, and roles, so application code doesn't change. The higher limits and paid features (longer history window, configurable scale to zero, protected branches) apply right away.

Some features are only on the Scale plan: HIPAA, IP Allow, Private Networking, and the uptime SLA. To use them, you upgrade to Scale and turn them on for the project. The project itself doesn't move.

## When to upgrade

Common signals:

- You're hitting the 100 CU-hours per project Free plan compute allowance.
- A project's data is approaching 0.5 GB.
- You need to turn off scale to zero for a production database.
- You need more than the Free plan's 6-hour history window (up to 1 GB-month) for instant restore.
- You want protected branches to guard production against accidental deletes and resets.

<Admonition type="tip" title="Estimate before you upgrade">
See [how usage is calculated](/docs/introduction/usage-calculations) to work out what your workload would cost on the Launch or Scale plan. After you upgrade, set up [spending notifications](/docs/introduction/spending-notifications) to get an email as your bill approaches a threshold.
</Admonition>

## How this compares to other Postgres providers

- **Supabase** has Free, Pro, Team, and Enterprise plans, set per organization. Upgrading is a plan change, not a migration. On the Free plan, projects [pause after a week of low activity](https://supabase.com/docs/guides/platform/free-project-pausing), and you get [two active free projects](https://supabase.com/docs/guides/platform/billing-faq). Paid plans don't pause projects.
- **AWS RDS and Aurora**: new AWS accounts get up to $200 in [Free Tier](https://aws.amazon.com/free/) credits over 6 months. The free plan covers [RDS for Postgres on db.t3.micro and db.t4g.micro instances](https://aws.amazon.com/rds/free/). Aurora Postgres is included only through express configuration, with [up to 4 ACUs and 1 GB of storage per cluster and at most 2 clusters per account](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-free-tier.html). After that, RDS bills by instance-hour for the instance class you choose.
- **Aurora Serverless v2** outside the free plan bills per ACU-hour with no included monthly allowance. With [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) and a 0 ACU minimum, instance charges stop while paused. Storage still bills.

<CTA title="Start on the Free plan" description="Build on the same Postgres you'll run in production. Upgrade when you need higher limits." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
