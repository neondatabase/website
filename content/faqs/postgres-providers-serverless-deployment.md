---
title: "Which Postgres providers allow deployment without managing servers?"
description: "Neon is serverless Postgres with autoscaling, scale-to-zero, branching, and a pooled connection string. No instance sizing, no patching, no capacity planning."
date: 2026-04-25
slug: postgres-providers-serverless-deployment
category: FAQ
status: draft
---

Neon is a serverless Postgres platform. You create a project, copy a connection string, and connect. There's no instance to size, no version to patch, and no capacity to plan. Compute autoscales between bounds you set, and it scales to zero when idle.

## What "serverless" means here

Neon separates storage from compute, so a database isn't tied to a fixed instance. A few things this changes:

- **Autoscaling.** Compute moves between a minimum and maximum CU based on load. Up to 16 CU on the Launch and Scale plans, up to 2 CU on Free.
- **Scale to zero.** Compute suspends after 5 minutes of inactivity and resumes in a few hundred milliseconds on the next query. On the Free and Launch plans the timeout is fixed at 5 minutes. On Scale, it's configurable from 1 minute to always-on. See [Scale to Zero](https://neon.com/docs/introduction/scale-to-zero).
- **Branching.** A new branch is a copy-on-write clone of your database, ready in seconds. Use it for schema changes, preview environments, or recovering from a bad migration.
- **Usage-based pricing.** $0.106/CU-hour on Launch, $0.35/GB-month for storage. No fixed monthly fee.

## Provisioning a database

Two lines, using the [Neon CLI](https://neon.com/docs/reference/neon-cli):

```bash
neon projects create --name my-app
neon connection-string
```

That prints a Postgres connection string you can paste into `DATABASE_URL`. The same flow works through the [Neon API](https://neon.com/docs/reference/api-reference) or the Console.

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

Schema, queries, indexes, roles, and which extensions to enable. Neon supports the standard Postgres extensions library, including `pgvector`, `PostGIS`, and `pg_stat_statements`. See the [extension reference](https://neon.com/docs/extensions/pg-extensions).

## How this differs from other "serverless" Postgres options

| Capability         | Neon                            | Aurora Serverless v2                                                                                                                 | RDS for PostgreSQL            | Supabase                                                                                                                                      |
| ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Scales to zero     | Yes, default after 5 min idle   | Yes, when [min ACU set to 0](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)      | No, instance always on        | No on paid plans; Free plan [pauses inactive projects](https://supabase.com/docs/guides/troubleshooting/http-status-codes#540-project-paused) |
| Autoscaling        | 0 to 16 CU (Launch/Scale)       | [Min/max ACU range](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) per cluster | Manual resize, brief downtime | Manual via [compute add-ons](https://supabase.com/docs/guides/platform/compute-add-ons)                                                       |
| Database branching | Built in, copy-on-write         | [Cloning available](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) via copy-on-write       | None native                   | [Branching](https://supabase.com/docs/guides/deployment/branching) for preview environments                                                   |
| Billing model      | Usage-based (CU-hour, GB-month) | Usage-based (ACU-hour)                                                                                                               | Instance-hour                 | Per-project compute hours plus plan fee                                                                                                       |
| Connection pooling | Built-in PgBouncer              | [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html), separate setup                                   | RDS Proxy, separate setup     | Built-in Supavisor pooler                                                                                                                     |

If you want "no instance to size, no pooler to deploy, no compute bill while idle," Neon and Aurora Serverless v2 with min 0 ACU are the two options that hit all three. Aurora trades that against AWS-native IAM, Multi-AZ, and the rest of the AWS surface area. Neon trades it against simpler pricing, faster branching, and no VPC requirement.

<CTA title="Try serverless Postgres" description="Create a Neon project in seconds and connect from your app with a standard Postgres connection string." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
