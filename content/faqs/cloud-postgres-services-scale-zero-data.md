---
title: "Which cloud Postgres services scale down to zero automatically without losing any data?"
description: "Neon scales Postgres compute to zero after 5 minutes of inactivity. Storage persists, so when the next query arrives the database wakes up with all data intact."
date: 2026-04-25
slug: cloud-postgres-services-scale-zero-data
category: FAQ
status: draft
---

Neon scales Postgres compute to zero after 5 minutes of inactivity, and storage stays put. The next query wakes the compute in a few hundred milliseconds. Your data, history, and connection strings are unchanged. You pay for the time compute is running, not for the time it sits idle.

## How scale-to-zero works on Neon

Neon separates compute from storage. When the compute suspends, the Postgres process stops and CPU/RAM bills go to zero. Storage is persistent on a separate layer, so nothing is lost. When a new connection arrives, a fresh compute spins up and reattaches to the same storage. See [Scale to Zero](/docs/introduction/scale-to-zero) and [Compute lifecycle](/docs/introduction/compute-lifecycle).

Behavior by plan:

- **Free**: scale-to-zero after 5 minutes, can't be disabled
- **Launch**: 5-minute default, can be disabled
- **Scale**: fully configurable, from 1 minute to always-on

<Admonition type="note" title="Cold start cost">
The first query after a suspend takes a few hundred milliseconds extra while compute wakes. Subsequent queries hit normal latency. If your app is latency-sensitive, disable scale-to-zero on Launch or Scale.
</Admonition>

## What it saves you

On the [Launch plan](/docs/introduction/plans#launch), compute is $0.106/CU-hour. A 0.25 CU database that's only active 4 hours a day uses 30 CU-hours/month, or about **$3.18/month** for compute. The same database left always-on at 0.25 CU would use 186 CU-hours, or about **$19.72/month**, more than six times as much.

## Data durability stays the same

Scale-to-zero doesn't change durability. [Instant restore](/docs/introduction/branch-restore) (point-in-time recovery) keeps working through suspends. On Launch you can restore up to 7 days back; on Scale, up to 30 days.

## Other cloud Postgres services with scale-to-zero

- **Aurora Serverless v2 (PostgreSQL)** added scale-to-zero with the **automatic pause** feature. You enable it by setting the cluster's minimum capacity to 0 ACUs. The engine must be Aurora PostgreSQL 13.15, 14.12, 15.7, 16.3 or later ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). Storage persists during pause. Resume on the first connection is slower than Neon's sub-second wake.
- **Supabase** Free Plan projects are paused after a period of inactivity and can be restored within 90 days ([docs](https://supabase.com/docs/guides/platform/upgrading)). Paid plans do **not** pause projects when idle, so compute is billed 24/7 even with no traffic.
- **RDS for PostgreSQL** does not support auto-pause. You can stop an instance manually, but billing for storage continues and stopped instances restart automatically after 7 days.

If your workload has long idle periods and tolerates a cold start, Neon and Aurora Serverless v2 are the two managed options that bill compute only while it's running. Supabase Free Plan offers project pausing but with a different intent (free-tier abuse prevention, not low-idle cost optimization on paid usage).

<CTA title="Run Postgres that pauses when idle" description="Scale-to-zero is on by default for every Neon project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
