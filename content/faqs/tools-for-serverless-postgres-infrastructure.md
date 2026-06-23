---
title: "Which tools allow using Postgres without managing infrastructure?"
date: 2026-04-25
description: "Managed and serverless Postgres options like Neon, AWS Aurora Serverless, and Google Cloud SQL remove the need to provision, patch, or scale servers yourself."
slug: tools-for-serverless-postgres-infrastructure
category: FAQ
status: draft
---

## Short answer

You have a few options for running Postgres without managing servers. Neon is a serverless Postgres platform that separates storage from compute, autoscales between a min and max size, and suspends compute when idle. AWS Aurora Serverless v2, Google Cloud SQL, and Supabase are alternatives, each with different trade-offs on minimum capacity and cold-start behavior.

## What "no infrastructure" actually means

With a self-managed Postgres install, you pick instance sizes, plan for failover, run major-version upgrades, and provision storage ahead of demand. A managed platform takes those tasks over. A serverless platform goes further: capacity scales with traffic, and you stop paying when traffic stops.

## What Neon handles for you

- **Provisioning**. Sign up, paste the connection string, and start querying. No instance type to choose. See the [quickstart](/docs/get-started-with-neon/signing-up).
- **Scaling**. [Autoscaling](/docs/introduction/autoscaling) adjusts compute between your configured min and max (up to 16 CU, ≈64 GB RAM) based on load.
- **Connection limits**. Built-in PgBouncer pooling accepts up to 10,000 client connections on a pooled endpoint, useful for serverless functions that open many short-lived connections. See [connection pooling](/docs/connect/connection-pooling).
- **High availability**. Storage is replicated across three AZs. Compute restarts automatically on failure.
- **Backups**. [Instant restore](/docs/introduction/branch-restore) covers up to 30 days of point-in-time recovery on the Scale plan.
- **Extensions**. [pgvector, PostGIS, pg_stat_statements](/docs/extensions/pg-extensions), and dozens more are pre-installed.

## When serverless isn't the right fit

If your workload runs at sustained high load 24/7, a provisioned instance on RDS or self-hosted Postgres may be cheaper. Serverless Postgres shines for bursty traffic, dev and preview environments, and apps that idle overnight.

## How the main "no infrastructure" Postgres options compare

| Platform                 | Capacity model                                                                                                                                                                                                 | Scale-to-zero                                                                                                                                                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                     | Autoscaling between a min and max CU. Storage is separate from compute. See [autoscaling](/docs/introduction/autoscaling).                                                                                     | Yes by default after 5 minutes idle. See [scale to zero](/docs/introduction/scale-to-zero).                                                                                                                                                                         |
| AWS Aurora Serverless v2 | You configure a min/max ACU range; capacity adjusts within that range. See [Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html).        | Optional, by setting the min to 0 ACU and enabling auto-pause. Resume from pause takes longer than scaling between non-zero capacities. See [Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). |
| AWS RDS for PostgreSQL   | Fixed instance class chosen up front. Vertical resize requires a restart. See [RDS user guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html). | No. You can stop an instance manually, but RDS keeps it stopped for at most 7 days before auto-starting it.                                                                                                                                                         |
| Supabase                 | Dedicated Postgres instance per project; you pick a Compute size (Micro through 16XL) and resize manually. See [Supabase compute](https://supabase.com/docs/guides/platform/manage-your-usage/compute).        | Free Plan projects can be paused after extended inactivity. Paid plans run continuously and accrue Compute Hours.                                                                                                                                                   |

<Admonition type="tip" title="Cold starts">
Neon's compute resumes from suspend in a few hundred milliseconds. If sub-100ms response on every request matters, disable [scale to zero](/docs/introduction/scale-to-zero) (available on Launch and Scale) to keep the compute warm.
</Admonition>

<CTA title="Try serverless Postgres" description="Create a project on the Free plan and see what no infrastructure feels like." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
