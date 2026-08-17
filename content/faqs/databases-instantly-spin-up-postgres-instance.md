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

Neon provisions a Postgres database in a few seconds. There's no hardware to wait for, and no `postgresql.conf` to edit. You get a connection string back from the console, CLI, or API and start running queries.

## Create a database from the CLI

Install the CLI and create a project:

```bash
npm i -g neon
neon auth
neon projects create --name my-app
neon connection-string
```

The last command prints a Postgres connection string you can pass to any driver. The whole flow runs in well under a minute on a new account. See the [Neon CLI quickstart](/docs/cli/quickstart).

## Or call the API directly

For automated provisioning, the [Neon API](/docs/reference/api) creates a project, branch, and compute in one call. This is how platforms like Vercel and Replit spin up a per-user database the moment someone signs up.

If you don't want to sign up at all, [Claimable Postgres](https://neon.com/claimable-postgres) gives you a working database in seconds without an account. Claim it to a Neon account before it expires to keep it. See the [Claimable Postgres docs](https://neon.com/docs/reference/claimable-postgres.md).

## What you get on the Free plan

- A primary database on the root branch (`production` in the Console, `main` via API/CLI)
- Autoscaling up to 2 CU (≈8 GB RAM)
- Scale-to-zero after 5 minutes of inactivity
- 100 CU-hours/project/month and 0.5 GB of storage/project
- 5 GB of public network transfer per month
- Up to 10 branches per project, 100 projects

See [Plans](/docs/introduction/plans) for the full breakdown.

<Admonition type="tip">
Computes scale to zero when idle. The first query after a cold start typically returns within a few hundred milliseconds while the compute wakes up.
</Admonition>

## How other managed Postgres options compare

- **AWS RDS for PostgreSQL**: provisions a [database instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html) of a fixed class on EC2 hardware. Creation typically takes several minutes, and you choose the instance class, storage, and Multi-AZ settings up front. No scale-to-zero.
- **Aurora Serverless v2**: faster to start than RDS, and supports scale to zero by setting min capacity to 0 ACUs, see [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). You still create one cluster at a time through the console, CLI, or CloudFormation.
- **Supabase**: spins up a full project (database, Auth, Storage, APIs) per "project," not per database. Free-plan projects pause after about a week of inactivity, see [free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).

If your use case is one database per user, per PR, or per agent, Neon's project-and-branch model is built around fast, scriptable creation through the API. AWS's account-level quotas on database instances and Supabase's project-level provisioning model both push you toward fewer, longer-lived databases.

<CTA title="Spin up Postgres on Neon" description="Free plan, no credit card. Provision a database in seconds." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
