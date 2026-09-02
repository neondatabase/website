---
title: "What Postgres services let you start free and scale to production without migrating to a different provider?"
description: "Neon's Free, Launch, and Scale plans share the same lakebase architecture and connection strings. Upgrading raises limits and unlocks features without a data migration."
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

Neon's three plans share the same lakebase architecture. Upgrading from the Free plan to the Launch plan to the Scale plan is a billing change, not a data migration. The connection string stays the same. The compute, storage layer, and Postgres version stay the same. What changes are the resource limits, the level of support, and access to compliance features.

## What you get on each plan

|                  | **Free**                      | **Launch**         | **Scale**                      |
| ---------------- | ----------------------------- | ------------------ | ------------------------------ |
| Monthly fee      | $0                            | Pay per use        | Pay per use                    |
| Compute price    | 100 CU-hours/project included | $0.106/CU-hour     | $0.222/CU-hour                 |
| Storage          | 0.5 GB/project                | $0.35/GB-month     | $0.35/GB-month                 |
| Autoscaling max  | 2 CU (≈8 GB RAM)              | 16 CU (≈64 GB RAM) | 16 CU autoscaling, 56 CU fixed |
| Scale to zero    | 5 min, fixed                  | 5 min, can disable | 1 min to always-on             |
| Branches/project | 10                            | 10                 | 25                             |
| History window   | 6 hours (1 GB cap)            | Up to 7 days       | Up to 30 days                  |
| Compliance       | None                          | Protected branches | SOC 2, ISO, HIPAA, GDPR        |

See the [full plan comparison](https://neon.com/docs/introduction/plans) for support tiers, snapshots, and network transfer details.

## What "no migration" looks like

When you upgrade in the Console, the change applies to the organization. Your existing project keeps its endpoint hostname, its branches, its data, and its roles. Application code doesn't change. You get higher limits and new features (longer history window, configurable scale-to-zero, protected branches) immediately.

The exception: if you want compliance features only available on the Scale plan (HIPAA, IP Allow, Private Networking, SLAs), you upgrade to Scale and configure them in your project settings. The project itself doesn't move.

## When to upgrade

The most common signals:

- You're hitting the **100 CU-hours/project** Free plan compute allowance.
- Your data is approaching **0.5 GB** on a single project.
- You need to **disable scale-to-zero** for a production database.
- You need more than the Free plan's **6-hour history window** (capped at 1 GB of changes) for instant restore.
- You want **protected branches** to prevent accidental drops on production.

<Admonition type="tip" title="Estimate before you upgrade">
Run the [usage calculator](https://neon.com/docs/introduction/usage-calculations) against your current workload to see what your Launch or Scale plan bill would look like. On the Launch and Scale plans you can also set up [spending notifications](https://neon.com/docs/introduction/spending-notifications) to catch surprises.
</Admonition>

## How this compares to other Postgres providers

- **Supabase** has Free, Pro, Team, and Enterprise plans on the same platform. Upgrading is a plan change at the organization level, no migration. The notable Free-plan limitation: projects [pause after about a week of inactivity](https://supabase.com/docs/guides/troubleshooting/http-status-codes#540-project-paused), and you're capped at [two active free projects](https://supabase.com/docs/guides/platform/billing-faq#how-many-free-projects-can-i-have).
- **AWS RDS and Aurora** don't really have a "free plan." New accounts get sign-up credits on the [AWS Free Tier](https://aws.amazon.com/free/), and Aurora Postgres has a small standing allowance (4 ACUs and 1 GB per cluster, two clusters per account). RDS for Postgres has neither, so once the credits are gone you're paying per instance-hour. There's no shared-architecture story; you pick an instance type and stay there.
- **Aurora Serverless v2** doesn't have a free plan. You pay per ACU-hour from the first query (down to zero ACU with [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), but there's still no included monthly allowance).

Neon keeps the same lakebase architecture across the Free, Launch, and Scale plans, with a Free plan sized for a real low-traffic app and a path to usage-based pricing without changing the connection string. Supabase has a similar plan-to-plan upgrade shape; AWS expects you to think in instance sizes from day one.

<CTA title="Start on the Free plan" description="Build on the same Postgres you'll run in production. Upgrade when you need higher limits." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
