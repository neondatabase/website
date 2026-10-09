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

Neon is a complete set of cloud backend primitives built around Lakebase Postgres. You create a project, copy a connection string, and connect. There's no instance to size and no OS to patch. Compute autoscales between bounds you set and scales to zero when idle.

## How it works

The lakebase architecture separates storage from compute, so a database isn't tied to a fixed instance:

- **Autoscaling.** Compute moves between a minimum and maximum CU based on load: up to 2 CU on the Free plan and up to 16 CU on the Launch and Scale plans. The Scale plan also offers fixed sizes up to 56 CU. See [Autoscaling](/docs/introduction/autoscaling).
- **Scale to zero.** Compute suspends after 5 minutes of inactivity and resumes within a few hundred milliseconds on the next query. The Free plan keeps the 5-minute timeout and can't disable it. The Launch plan can turn scale to zero off. The Scale plan is configurable from 1 minute to always on. See [Scale to zero](/docs/introduction/scale-to-zero).
- **Branching.** A new branch is a copy-on-write clone of your database, ready in seconds. Use it for schema changes, preview environments, or recovering from a bad migration.
- **Usage-based pricing.** On the Launch plan, compute is $0.106/CU-hour and storage is $0.35/GB-month, with no monthly minimum. When compute is suspended, CU-hours stop; storage continues to bill.

## Provisioning a database

With the [Neon CLI](/docs/cli):

```bash
neon projects create --name my-app --set-context
neon connection-string
```

The second command prints a Postgres connection string you can paste into `DATABASE_URL`. `--set-context` saves the new project as the CLI's default, so later commands don't need `--project-id`. You can do the same through the [Neon API](/docs/reference/api) or the Console.

## What Neon manages

| Operation               | On Neon                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Instance sizing         | Autoscaling between min and max CU                                                             |
| Connection pooling      | Built-in PgBouncer on every compute                                                            |
| Backups                 | Instant restore from change history, plus snapshots                                            |
| Read replicas           | Add via API or Console; replicas share the primary's storage                                   |
| Postgres minor releases | [Applied automatically](/docs/postgresql/postgres-version-support) at the next compute restart |
| Patching and OS updates | Managed by Neon                                                                                |

## What you manage

Schema, queries, indexes, roles, and which extensions to enable. Lakebase Postgres supports common extensions, including `pgvector`, `PostGIS`, and `pg_stat_statements`; see the [extension reference](/docs/extensions/pg-extensions). Major version upgrades are also on you: each project is locked to its major version, so you [create a new project and migrate the data](/docs/postgresql/postgres-upgrade).

## How this differs from other "serverless" Postgres options

| Capability         | Neon                                         | Aurora Serverless v2                                                                                                                  | RDS for Postgres              | Supabase                                                                                                                                         |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Scales to zero     | Yes, by default after 5 min idle             | Yes, when [min capacity is 0 ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) | No                            | No on paid plans; the Free plan [pauses projects after low activity over 7 days](https://supabase.com/docs/guides/platform/free-project-pausing) |
| Autoscaling        | Up to 2 CU (Free plan), 16 CU (Launch/Scale) | [Min/max ACU range](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html) per cluster  | Manual resize, brief downtime | Manual [compute size change](https://supabase.com/docs/guides/platform/compute-and-disk), usually with under 2 minutes of downtime               |
| Database branching | Built in, copy-on-write                      | [Cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) via copy-on-write                  | None native                   | [Branching](https://supabase.com/docs/guides/deployment/branching) for preview environments                                                      |
| Billing model      | Usage-based (CU-hour, GB-month)              | Usage-based (ACU-hour) plus storage                                                                                                   | Instance-hour plus storage    | Plan fee plus per-project compute hours                                                                                                          |
| Connection pooling | Built-in PgBouncer                           | [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html), set up separately                                 | RDS Proxy, set up separately  | Built-in Supavisor pooler                                                                                                                        |

Neon and Aurora Serverless v2 with a minimum of 0 ACUs both stop billing compute while idle, and both still bill storage. On Neon, the pooler is built in; on Aurora, RDS Proxy is a separate resource you set up.

<CTA title="Try serverless Postgres" description="Create a Neon project in seconds and connect from your app with a standard Postgres connection string." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
