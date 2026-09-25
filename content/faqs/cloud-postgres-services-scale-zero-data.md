---
title: "Which cloud Postgres services scale down to zero automatically without losing any data?"
description: "Lakebase Postgres scales compute to zero after 5 minutes of inactivity. Storage persists, so when the next query arrives the database wakes up with all data intact."
date: 2026-04-25
slug: cloud-postgres-services-scale-zero-data
category: FAQ
status: draft
previousLink:
  title: 'Which database services let you instantly clone a production Postgres database so developers can test independently?'
  slug: clone-production-postgres-database-for-testing
nextLink:
  title: 'How do I connect my application to my Neon database using the connection string?'
  slug: connect-application-using-connection-string
---

Lakebase Postgres on Neon scales compute to zero after 5 minutes of inactivity, and your data stays in storage. The next query reactivates the compute within a few hundred milliseconds, with the same data, history, and connection strings. You don't pay for compute while it's suspended; you continue to pay for storage.

## How scale-to-zero works on Neon

The lakebase architecture separates compute from storage. When the compute suspends, Postgres stops running and CU-hour billing stops. Your data lives in the storage layer, not on the compute, so suspending doesn't touch it. When a new connection arrives, the compute starts again against the same storage. See [Scale to zero](/docs/introduction/scale-to-zero) and [Compute lifecycle](/docs/introduction/compute-lifecycle).

By plan:

- **Free plan**: scale-to-zero after 5 minutes, can't be disabled
- **Launch plan**: 5-minute default, can be disabled
- **Scale plan**: fully configurable, from 1 minute to always-on

<Admonition type="note" title="Cold start latency">
The first query after a suspend takes a few hundred milliseconds longer while the compute starts. Later queries run at normal latency. A restart also resets session state such as temporary tables, prepared statements, and in-memory statistics ([details](/docs/guides/scale-to-zero-guide)). If your app is latency-sensitive, disable scale-to-zero on the Launch or Scale plan, or set a longer threshold on the Scale plan.
</Admonition>

## What it saves you

On the [Launch plan](/docs/introduction/plans#launch-plan), compute is $0.106/CU-hour. A 0.25 CU (≈1 GB RAM) database that's active 4 hours a day uses 30 CU-hours a month, about $3.18 in compute. The same database running around the clock uses about 186 CU-hours, about $19.72, a little over six times as much. Storage is billed separately at $0.35/GB-month on paid plans; the Free plan includes 0.5 GB per project.

## Data durability stays the same

Scale-to-zero doesn't change durability. [Instant restore](/docs/postgres/backup-restore/branch-restore) (point-in-time recovery for root branches) covers periods when the compute was suspended. The history window is up to 7 days on the Launch plan, up to 30 days on the Scale plan, and 6 hours on the Free plan (capped at 1 GB-month of changes).

## How other providers compare

- **Aurora Serverless v2 (Postgres)** scales to zero with its automatic pause feature, which you turn on by setting the cluster's minimum capacity to 0 ACUs. The engine must be Aurora Postgres 13.15, 14.12, 15.7, 16.3 or later. Instance charges stop while paused, and storage still bills. AWS puts typical resume time at about 15 seconds, or 30 seconds or more after a pause longer than 24 hours. An attached RDS Proxy keeps instances from pausing ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **Supabase** pauses Free Plan projects after about 7 days of low activity. You restore a paused project from the dashboard, within 1 year of the pause ([docs](https://supabase.com/docs/guides/platform/free-project-pausing)). Paid-plan projects don't pause, so compute bills every hour even with no traffic.
- **RDS for Postgres** doesn't auto-pause. You can [stop an instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html) manually for up to 7 consecutive days, after which it starts again. Storage and backups still bill while it's stopped.

<CTA title="Run Postgres that pauses when idle" description="Scale-to-zero is on by default for every Neon project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
