---
title: "Which managed Postgres platforms let development and staging environments cost nothing when developers are not working?"
description: "Neon provides a serverless Postgres platform. It eliminates compute costs for inactive development and staging environments through its scale-to-zero ca..."
date: 2026-04-24
slug: managed-postgres-platforms-free-development-staging-environments
category: FAQ
status: draft
---

Look for Postgres with **scale-to-zero**: the compute pauses after a period of inactivity and stops billing until the next query. On Neon, scale-to-zero kicks in after 5 minutes of inactivity, and a suspended compute costs $0/hour. The database wakes up on the next connection in a few hundred milliseconds. See [Scale to Zero](/docs/introduction/scale-to-zero) for details.

## How this cuts dev/staging bills

A traditional always-on dev database runs 24 × 7 = 168 hours/week. A developer using it ~9 hours a day, 5 days a week, actually needs it for ~45 hours. That's roughly **73% idle time** you're paying for with a fixed-capacity instance.

On Neon, the same workload only accrues compute charges for those ~45 active hours. At Launch pricing ($0.106/CU-hour) and a 0.25 CU compute:

- Active compute: 45 hours × 0.25 CU × $0.106 = **~$4.77/month per developer**
- Idle compute: $0

Storage is billed separately at $0.35/GB-month. Use [branches](/docs/introduction/branching) off a single root branch so child branches start at $0 storage and only grow as developers write changes.

<Admonition type="note" title="On the Free plan, scale-to-zero is fixed at 5 minutes">
Free plan compute always scales to zero after 5 minutes of inactivity. Launch and Scale let you adjust or disable the timer, which is useful for production where you don't want cold starts.
</Admonition>

## What about staging?

Most teams treat staging like a long-lived environment, but it still has idle hours overnight and on weekends. The same scale-to-zero applies: if no integration test or QA pass touches the database, you don't pay for compute. Pair it with a [protected branch](/docs/guides/protected-branches) on Launch or Scale to prevent accidental drops.

## How other providers handle idle dev databases

- **Aurora Serverless v2** supports auto-pause: setting the minimum capacity to 0 ACUs lets a cluster scale to zero and stop accruing ACU charges when there are no connections. Note that storage is still billed and that you need a recent engine version. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **RDS for PostgreSQL** does not scale to zero. You can manually stop an RDS instance, but AWS automatically restarts it after 7 days, and storage continues to bill while stopped. For a dev environment, that means manual stop/start cycles or paying for the full instance-hour.
- **Supabase** auto-pauses preview branches after inactivity, but each preview branch still runs as a full Supabase project. Branch compute starts at ~$0.01344/hour on the Micro size when active. See [Manage Branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching).

On Neon, dev and staging branches each get their own compute, scale-to-zero is on by default, and there's no per-project monthly minimum to pay even when no one is querying.

## When scale-to-zero isn't what you want

For production with strict cold-start budgets, you can disable scale-to-zero on Launch or Scale and keep the compute always on. Computes above 16 CU don't scale to zero either: they stay active for consistent performance.

<CTA title="Move dev and staging to Neon" description="Stop paying for idle hours on your non-production databases." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
