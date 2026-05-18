---
title: "What Postgres hosting options automatically pause the database when there are no active connections?"
description: "Neon scales Postgres compute to zero after 5 minutes of inactivity on the Free and Launch plans, and from 1 minute on Scale. You stop paying for idle compute time."
date: 2026-04-25
slug: postgres-hosting-options-auto-pause-database
category: FAQ
status: draft
---

## Short answer

Neon suspends a Postgres compute after a configurable idle window and resumes it on the next connection. Free and Launch plans suspend after 5 minutes; Scale lets you set anything from 1 minute up to always-on. Amazon Aurora Serverless v2 also supports auto-pause down to zero ACUs, but its idle pause is per cluster and only on recent PostgreSQL engine versions.

## How it works

A traditional Postgres instance keeps every process running even when no one is connected. You pay for the VM whether you're serving traffic or not.

Neon decouples storage from compute. When no connections are active and no background work is happening, the compute is shut down. Storage stays available, billed separately at $0.35/GB-month (root branches) on paid plans, or included in the 0.5 GB free allowance.

Per-plan defaults from the [plans page](/docs/introduction/plans#scale-to-zero):

- **Free**: 5-minute idle timeout, can't be disabled
- **Launch**: 5-minute idle timeout, can be disabled
- **Scale**: 1 minute to always-on, fully configurable

## Cold starts and connection limits on resume

When the next query arrives, the compute resumes. Cold start time is typically under a second for most workloads. If that latency matters to your application, disable scale-to-zero on a Launch or Scale plan.

A bigger issue on resume is connections. Postgres caps `max_connections` based on RAM, and a 0.25 CU compute (≈1 GB RAM) allows 104 connections, with 7 reserved for Neon's superuser. That leaves 97 for your app, which serverless functions can exhaust during a traffic spike.

Use Neon's [PgBouncer-based connection pooling](/docs/connect/connection-pooling) to accept up to 10,000 client connections per compute, routed through the smaller pool of Postgres backends. The pooled connection string ends with `-pooler` in the hostname:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="tip" title="Use pooled connections from serverless">
Connection-per-request runtimes (Vercel functions, Lambda, Cloudflare Workers) should always use the pooled string. The direct string is for migrations and long-lived workers.
</Admonition>

## How other Postgres providers compare

| Provider                          | Pauses when idle         | Notes                                                                                                                       |
| --------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Neon                              | Yes, 1–5 min idle window | Configurable on paid plans; storage stays available                                                                         |
| Aurora Serverless v2 (PostgreSQL) | Yes, when min ACU is 0   | Requires Aurora PostgreSQL 13.15, 14.12, 15.7, or 16.3+; auto-pause is per cluster                                          |
| Amazon RDS for PostgreSQL         | No                       | Instance pricing is hourly regardless of activity; you can stop a DB instance manually, but RDS auto-starts it after 7 days |
| Supabase                          | No                       | Compute add-ons run continuously                                                                                            |

Aurora Serverless v2 added scale-to-zero in late 2024. You configure a cluster minimum of 0 ACUs and an idle timeout, and Aurora pauses the instance when no user connections are present. Pause and resume happens at the cluster level. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).

[Amazon RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html) doesn't auto-pause. Instances are billed by the hour for the chosen class size whether or not connections are active.

<CTA title="Run Postgres that pauses when idle" description="Free plan auto-pauses after 5 minutes. No credit card." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
