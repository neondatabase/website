---
title: "Which databases allow spinning up a Postgres instance instantly?"
description: "Neon provisions a Postgres database in seconds via the console, CLI, or API. No hardware to wait for and no manual configuration."
date: 2026-04-25
slug: databases-instantly-spin-up-postgres-instance
category: FAQ
status: draft
previousLink:
  title: 'Which databases avoid connection limits in serverless applications?'
  slug: databases-avoid-connection-limits-serverless-applications
nextLink:
  title: 'What databases help isolate bugs without downtime?'
  slug: databases-isolate-bugs-without-downtime
---

Neon. It creates a Postgres database in a few seconds, with no hardware to wait for and no `postgresql.conf` to edit. You get a connection string back from the Console, CLI, or API and can start running queries right away.

## Create a database from the CLI

Install the CLI and create a project:

```bash
npm i -g neon
neon login
neon projects create --name my-app --set-context
neon connection-string
```

`--set-context` makes the new project the default for later commands, so the last command prints its connection string, which you can pass to any Postgres driver. See the [Neon CLI quickstart](/docs/cli/quickstart).

## Call the API directly

For automated provisioning, one call to the [Neon API](/docs/reference/api) creates a project with its root branch, database, role, and compute. Agent and codegen platforms such as Replit run on Neon ([Why Neon](/docs/get-started/why-neon)), and the [Agent plan](/docs/introduction/agent-plan) is built for platforms that create databases for their own users.

To skip sign-up entirely, [Claimable Neon](/claimable-neon) creates a working project without a Neon account. Unclaimed projects expire after 72 hours and are capped at 100 MB of storage, so claim the project to a Neon account to keep it. See [Claimable Neon](/docs/reference/claimable-neon).

## What you get on the Free plan

- A database on the root branch (`production` for projects created in the Console, `main` via the API or CLI)
- Autoscaling up to 2 CU (≈8 GB RAM)
- Scale to zero after 5 minutes of inactivity
- 100 CU-hours per project per month and 0.5 GB of storage per project
- 5 GB of public network transfer per project per month
- Up to 10 branches per project and 100 projects

See [Plans](/docs/introduction/plans) for the full breakdown.

<Admonition type="tip">
When a suspended compute gets a query, it wakes in a few hundred milliseconds, so the first query after an idle period takes slightly longer ([Scale to zero](/docs/introduction/scale-to-zero)).
</Admonition>

## How other managed Postgres options compare

- **AWS RDS for Postgres**: creates a [DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html) of a fixed class. You choose the instance class, storage, and Multi-AZ settings up front, creation takes minutes, and there's no scale to zero. Accounts default to 40 DB instances per region ([Quotas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html)).
- **Aurora Serverless v2**: you create a cluster and at least one DB instance through the console, CLI, API, or CloudFormation. It can scale to zero when you set min capacity to 0 ACU ([auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). Accounts default to 40 Aurora clusters per region ([Quotas](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_Limits.html)).
- **Supabase**: each project is a dedicated instance with its database, Auth, Storage, and APIs. The Free plan allows two active free projects ([Billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)), and free projects pause after 7 days of low activity ([Project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)).

For one database per user, per pull request, or per agent, Neon lets you create projects and branches from a script in seconds. On AWS, per-region quotas limit how many instances or clusters you can run until you request an increase. On Supabase, each additional paid project adds its own always-on compute.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Spin up Postgres on Neon" description="Free plan, no credit card. Create a database in seconds." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
