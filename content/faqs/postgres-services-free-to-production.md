---
title: "What Postgres services let you start free and scale to production without migrating to a different provider?"
description: "Neon's Free, Launch, and Scale plans share the same architecture and connection strings. Upgrading raises limits and unlocks features without a data migration."
date: 2026-04-24
slug: postgres-services-free-to-production
category: FAQ
status: draft
---

Neon's three plans share the same architecture. Upgrading from Free to Launch to Scale is a billing change, not a data migration. The connection string stays the same. The compute, storage layer, and Postgres version stay the same. What changes are the resource limits, the level of support, and access to compliance features.

## What you get on each plan

|                  | **Free**                      | **Launch**         | **Scale**                      |
| ---------------- | ----------------------------- | ------------------ | ------------------------------ |
| Monthly fee      | $0                            | Pay per use        | Pay per use                    |
| Compute price    | 100 CU-hours/project included | $0.106/CU-hour     | $0.222/CU-hour                 |
| Storage          | 0.5 GB/project                | $0.35/GB-month     | $0.35/GB-month                 |
| Autoscaling max  | 2 CU                          | 16 CU              | 16 CU autoscaling, 56 CU fixed |
| Scale to zero    | 5 min, fixed                  | 5 min, can disable | 1 min to always-on             |
| Branches/project | 10                            | 10                 | 25                             |
| History window   | 6 hours                       | Up to 7 days       | Up to 30 days                  |
| Compliance       | None                          | Protected branches | SOC 2, ISO 27001, HIPAA, GDPR  |

See the [full plan comparison](https://neon.com/docs/introduction/plans) for support tiers, snapshots, and network transfer details.

## What "no migration" looks like

When you upgrade in the Console, the change applies to the organization. Your existing project keeps its endpoint hostname, its branches, its data, its roles. Application code doesn't change. You get higher limits and new features (longer history window, configurable scale-to-zero, protected branches) immediately.

The exception: if you want compliance features only available on Scale (HIPAA, IP Allow, Private Networking, SLAs), you upgrade to Scale and configure them in your project settings. The project itself doesn't move.

## When to upgrade

The most common signals:

- You're hitting the **100 CU-hours/project** Free plan compute allowance.
- Your data is approaching **0.5 GB** on a single project.
- You need to **disable scale-to-zero** for a production database.
- You need more than the Free plan's **6-hour history window** for instant restore.
- You want **protected branches** to prevent accidental drops on production.

<Admonition type="tip" title="Estimate before you upgrade">
Run the [usage calculator](https://neon.com/docs/introduction/usage-calculations) against your current workload to see what your Launch or Scale bill would look like. On Launch and Scale you can also set a [spending limit](https://neon.com/docs/introduction/spending-limit) to catch surprises.
</Admonition>

## How this compares to other Postgres providers

- **Supabase** has Free, Pro, Team, and Enterprise plans on the same platform. Upgrading is a plan change at the organization level, no migration. The notable Free-plan limitation: projects [pause after about a week of inactivity](https://supabase.com/docs/guides/troubleshooting/http-status-codes#540-project-paused), and you're capped at [two active free projects](https://supabase.com/docs/guides/platform/billing-faq#how-many-free-projects-can-i-have).
- **AWS RDS and Aurora** don't really have a "free plan" beyond the [12-month AWS Free Tier](https://aws.amazon.com/free/) for new accounts, which covers a single `db.t2.micro` (or t3/t4g.micro) instance for 750 hours/month for the first year. After that you're paying per instance-hour. There's no shared-architecture story; you pick an instance type and stay there.
- **Aurora Serverless v2** doesn't have a free tier. You pay per ACU-hour from the first query (down to zero ACU with [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), but there's still no included monthly allowance).

The Neon-specific story is shared architecture across all plans plus a Free plan generous enough to host a real low-traffic app, then a smooth path to paid usage-based pricing without changing the connection string. Supabase has the smoothest plan-to-plan upgrade with a similar shape; AWS expects you to think in instance sizes from day one.

<CTA title="Start on the Free plan" description="Build on the same Postgres you'll run in production. Upgrade when you need higher limits." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
