---
title: "What Postgres hosting options automatically pause the database when there are no active connections?"
description: "Neon scales Postgres compute to zero after 5 minutes of inactivity on the Free plan and Launch plan, and from 1 minute on the Scale plan. You stop paying for idle compute time."
date: 2026-04-25
slug: postgres-hosting-options-auto-pause-database
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres databases support vector embeddings and can scale to zero between inference requests?'
  slug: postgres-databases-vector-embeddings-scale-to-zero
nextLink:
  title: 'Which Postgres platforms allow instant cloning of production databases for testing?'
  slug: postgres-instant-cloning-production-databases-testing
---

Neon suspends a Lakebase Postgres compute after a period of inactivity and resumes it on the next connection. The Free plan and Launch plan suspend after 5 minutes, and the Scale plan lets you set anything from 1 minute to always on. Amazon Aurora Serverless v2 also auto-pauses at a minimum capacity of 0 ACUs, on Aurora PostgreSQL 13.15, 14.12, 15.7, 16.3, or later.

## How scale to zero works

A provisioned Postgres instance keeps running when no one is connected, and you pay for it by the hour either way.

The lakebase architecture separates storage from compute. After 5 minutes of inactivity (by default), Neon suspends the compute. Your data stays in storage, which bills separately: $0.35/GB-month on paid plans, or up to 0.5 GB per project on the Free plan.

Per-plan settings from [Neon plans](/docs/introduction/plans):

- **Free plan**: 5-minute idle timeout, can't be disabled
- **Launch plan**: 5-minute idle timeout, can be disabled
- **Scale plan**: 1 minute to always-on, fully configurable

## Cold starts and connection limits on resume

When the next query arrives, the compute resumes, typically within a [few hundred milliseconds](/docs/introduction/scale-to-zero). If that latency matters to your application, disable scale to zero on the Launch plan or Scale plan.

A traffic spike right after resume can also run into connection limits. Neon sets `max_connections` by compute size, and a 0.25 CU compute (≈1 GB RAM) allows 104 connections, with 7 reserved for Neon's superuser. That leaves 97 direct connections for your app, and a burst of serverless function invocations can use them all.

Neon's [PgBouncer-based connection pooling](/docs/connect/connection-pooling) accepts up to 10,000 client connections per compute and routes them through a smaller pool of Postgres connections. The pooled connection string has `-pooler` in the hostname.

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

<Admonition type="tip" title="Use pooled connections from serverless">
Runtimes that open a connection per request (Vercel Functions, AWS Lambda) should use the pooled string. Use the direct string for schema migrations, `pg_dump`, logical replication, and session features like `LISTEN/NOTIFY`.
</Admonition>

## How other Postgres providers compare

| Provider                        | Pauses when idle                 | Notes                                                                                                                             |
| ------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Neon                            | Yes, after 5 min idle by default | Can be disabled on Launch; 1 minute to always on with Scale; storage still bills                                                  |
| Aurora Serverless v2 (Postgres) | Yes, when min ACU is 0           | Requires Aurora PostgreSQL 13.15, 14.12, 15.7, or 16.3+; pauses per DB instance                                                   |
| Amazon RDS for Postgres         | No                               | Instance pricing is hourly regardless of activity; you can stop a database instance manually, but RDS auto-starts it after 7 days |
| Supabase                        | Free plan only                   | Free projects pause after a week of inactivity and must be resumed from the dashboard; paid projects don't pause                  |

With Aurora Serverless v2, you set a cluster minimum of 0 ACUs and an idle timeout, and Aurora pauses a DB instance when it has had no user connections for that long. The writer and readers with failover priority 0 or 1 pause and resume together, while readers with priority 2 to 15 can pause independently. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).

[Amazon RDS for Postgres](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html) doesn't auto-pause. Instances are billed by the hour for the chosen instance class whether or not connections are active.

Supabase [pauses Free plan projects](https://supabase.com/docs/guides/platform/free-project-pausing) that don't get enough database activity over a week, and a paused project stays paused until you resume it from the dashboard. That's a way to reclaim unused Free projects, not an idle timeout between requests.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Run Postgres that pauses when idle" description="On the Free plan, computes suspend after 5 minutes of inactivity." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
