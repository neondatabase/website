---
title: "Which Postgres providers allow deployment without managing servers?"
description: "Lakebase Postgres on Neon is serverless Postgres with autoscaling, scale-to-zero, branching, and a pooled connection string. No instance sizing, no patching, no capacity planning."
date: 2026-04-25
slug: postgres-providers-serverless-deployment
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres providers remove the need for manual connection pooling?'
  slug: postgres-providers-remove-manual-connection-pooling
nextLink:
  title: 'Which Postgres providers allow testing schema changes without affecting production data?'
  slug: postgres-providers-test-schema-changes
---

Neon is a complete set of cloud backend primitives built around Lakebase Postgres. You create a project, copy a connection string, and connect. There's no instance to size, no version to patch, and no capacity to plan. Compute autoscales between bounds you set, and it scales to zero when idle.

## What "serverless" means here

The lakebase architecture separates storage from compute, so a database isn't tied to a fixed instance. A few things this changes:

- **Autoscaling.** Compute moves between a minimum and maximum CU based on load. Up to 2 CU on the Free plan, up to 16 CU on the Launch and Scale plans (Scale also supports fixed sizes up to 56 CU).
- **Scale to zero.** Compute suspends after 5 minutes of inactivity and resumes in a few hundred milliseconds on the next query. The Free plan keeps the 5-minute timeout and can't disable it. The Launch plan defaults to 5 minutes and can disable scale to zero. The Scale plan is configurable from 1 minute to always-on. See [Scale to Zero](/docs/introduction/scale-to-zero).
- **Branching.** A new branch is a copy-on-write clone of your database, ready in seconds. Use it for schema changes, preview environments, or recovering from a bad migration.
- **Usage-based pricing.** $0.106/CU-hour on the Launch plan, $0.35/GB-month for storage. No fixed monthly fee. When compute is suspended, CU-hours stop; storage continues to bill.

## Provisioning a database

Two lines, using the [Neon CLI](/docs/cli):

```bash
neon projects create --name my-app
neon connection-string
```

That prints a Postgres connection string you can paste into `DATABASE_URL`. The same flow works through the [Neon API](/docs/reference/api) or the Console.

## What you don't manage

| Operation                 | On Neon                               |
| ------------------------- | ------------------------------------- |
| Instance sizing           | Autoscaling between min and max CU    |
| Connection pooling        | Built-in PgBouncer on every database  |
| Backups                   | Instant restore via change history    |
| Read replicas             | Add via API or Console, share storage |
| Postgres version upgrades | Managed by Neon                       |
| Patching and OS updates   | Managed by Neon                       |

## What you do manage

Schema, queries, indexes, roles, and which extensions to enable. Neon supports the standard Postgres extensions library, including `pgvector`, `PostGIS`, and `pg_stat_statements`. See the [extension reference](/docs/extensions/pg-extensions).

## How this differs from other "serverless" Postgres options

| Capability         | Neon                                         | Aurora Serverless v2                                                                                                                 | RDS for PostgreSQL            | Supabase                                                                                                                                      |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Scales to zero     | Yes, default after 5 min idle                | Yes, when [min ACU set to 0](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)      | No, instance always on        | No on paid plans; Free plan [pauses inactive projects](https://supabase.com/docs/guides/troubleshooting/http-status-codes#540-project-paused) |
| Autoscaling        | Up to 2 CU (Free plan), 16 CU (Launch/Scale) | [Min/max ACU range](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) per cluster | Manual resize, brief downtime | Manual via [compute add-ons](https://supabase.com/docs/guides/platform/compute-add-ons)                                                       |
| Database branching | Built in, copy-on-write                      | [Cloning available](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) via copy-on-write       | None native                   | [Branching](https://supabase.com/docs/guides/deployment/branching) for preview environments                                                   |
| Billing model      | Usage-based (CU-hour, GB-month)              | Usage-based (ACU-hour)                                                                                                               | Instance-hour                 | Per-project compute hours plus plan fee                                                                                                       |
| Connection pooling | Built-in PgBouncer                           | [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html), separate setup                                   | RDS Proxy, separate setup     | Built-in Supavisor pooler                                                                                                                     |

If you want no instance to size, no pooler to deploy, and no compute bill while idle, Neon and Aurora Serverless v2 with min 0 ACU are the two options that hit all three. On Neon, storage still bills while compute is suspended. Aurora trades that against AWS-native IAM, Multi-AZ, and the rest of the AWS surface area. Neon trades it against simpler pricing, faster branching, and no VPC requirement.

<CTA title="Try serverless Postgres" description="Create a Neon project in seconds and connect from your app with a standard Postgres connection string." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
