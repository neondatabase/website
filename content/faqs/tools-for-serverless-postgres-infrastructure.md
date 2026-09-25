---
title: "Which tools allow using Postgres without managing infrastructure?"
date: 2026-04-25
description: "Managed and serverless Postgres options like Neon, AWS Aurora Serverless, and Supabase remove the need to provision, patch, or scale servers yourself."
slug: tools-for-serverless-postgres-infrastructure
category: FAQ
status: draft
previousLink:
  title: 'What tools allow restoring a database to before a bug occurred?'
  slug: tools-for-restoring-database-before-bug
nextLink:
  title: 'What tools allow inspecting production data without affecting users?'
  slug: tools-inspecting-production-data-without-affecting-users
---

Neon. It's a set of cloud backend primitives built around Lakebase Postgres, and you create a database without choosing or running a server. The lakebase architecture separates storage from compute, so compute autoscales between a minimum and maximum size and suspends when idle. AWS Aurora Serverless v2, Amazon RDS, and Supabase also run Postgres for you, with different capacity models (compared below).

## Managed versus serverless

With self-managed Postgres, you pick instance sizes, plan for failover, run upgrades, and provision storage ahead of demand. A managed service takes those tasks over. A serverless service also scales capacity with traffic and stops billing compute when traffic stops. Storage still bills.

## What Neon handles for you

- **Provisioning**. Sign up, copy the connection string, and start querying. There's no instance type to choose. See [Sign up](/docs/get-started/signing-up).
- **Scaling**. [Autoscaling](/docs/introduction/autoscaling) adjusts compute between the minimum and maximum you set, up to 16 CU (≈64 GB RAM) on paid plans and 2 CU on the Free plan.
- **Connections**. Built-in PgBouncer pooling accepts up to 10,000 client connections on the pooled connection string, so serverless functions that open many short-lived connections don't exhaust Postgres. See [connection pooling](/docs/connect/connection-pooling).
- **High availability**. Safekeepers replicate WAL across multiple Availability Zones, data is backed by cloud object storage, and a failed compute is restarted or rescheduled automatically. See [high availability](/docs/introduction/high-availability).
- **Backups**. [Instant restore](/docs/postgres/backup-restore/branch-restore) restores a root branch to any point in the history window: 6 hours on the Free plan, up to 7 days on the Launch plan, and up to 30 days on the Scale plan.
- **Extensions**. [pgvector, PostGIS, pg_stat_statements](/docs/extensions/pg-extensions), and many more are available. Install them with `CREATE EXTENSION`.

## When serverless isn't the right fit

If your workload runs at steady high load around the clock, scale to zero never kicks in, so compare the cost against a fixed-size instance on RDS or self-hosted Postgres. Autoscaling and scale to zero save the most on bursty traffic, dev and preview environments, and apps that sit idle overnight.

## How managed Postgres options compare

| Service                  | Capacity model                                                                                                                                                                                                            | Scale-to-zero                                                                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                     | Autoscaling between a min and max CU. Storage is separate from compute. See [autoscaling](/docs/introduction/autoscaling).                                                                                                | Yes, after 5 minutes idle by default. You can disable it on paid plans. See [scale to zero](/docs/introduction/scale-to-zero).                                                                                                      |
| AWS Aurora Serverless v2 | You configure a min/max ACU range; capacity adjusts within that range. See [Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html).                   | Optional, by setting the min to 0 ACU and enabling auto-pause. A typical resume takes about 15 seconds. See [Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). |
| AWS RDS for Postgres     | Fixed instance class chosen up front. Changing the class requires a reboot, which causes downtime ([Modifying a DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html)). | No. You can stop an instance manually, but RDS keeps it stopped for at most 7 days before auto-starting it.                                                                                                                         |
| Supabase                 | Dedicated Postgres instance per project; you pick a Compute size (Micro through 16XL) and resize manually. See [Supabase compute](https://supabase.com/docs/guides/platform/manage-your-usage/compute).                   | Free Plan projects [pause after a week of low activity](https://supabase.com/docs/guides/platform/free-project-pausing). Paid plan projects run continuously and bill Compute Hours.                                                |

<Admonition type="tip" title="Cold starts">
A suspended Lakebase Postgres compute resumes within a few hundred milliseconds. If every request needs an already-running compute, disable [scale to zero](/docs/introduction/scale-to-zero) on the Launch plan or Scale plan.
</Admonition>

<CTA title="Try Neon" description="Create a project on the Free plan and connect to it in your app." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
