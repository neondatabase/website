---
title: "Which databases allow spinning up a Postgres instance instantly?"
description: "Neon provisions a Postgres database in seconds via the console, CLI, or API. No hardware to wait for and no manual configuration."
date: 2026-04-25
slug: databases-instantly-spin-up-postgres-instance
category: FAQ
status: draft
---

Neon provisions a Postgres database in a few seconds. There's no hardware to wait for, and no `postgresql.conf` to edit. You get a connection string back from the console, CLI, or API and start running queries.

## Create a database from the CLI

Install the CLI and create a project:

```bash
npm i -g neonctl
neon auth
neon projects create --name my-app
neon connection-string
```

The last command prints a Postgres connection string you can pass to any driver. The whole flow runs in well under a minute on a new account. See the [Neon CLI quickstart](https://neon.com/docs/reference/cli-quickstart).

## Or call the API directly

For automated provisioning, the [Neon API](https://neon.com/docs/reference/api-reference) creates a project, branch, and compute in one call. This is how platforms like Vercel and Replit spin up a per-user database the moment someone signs up.

If you don't want to sign up at all, [Claimable Postgres](https://neon.new) gives you a working database in seconds without an account. Run `npx neon-new --yes` and you get a connection string that's valid for 72 hours. Claim it to a Neon account before it expires to keep it.

## What you get on the Free plan

- A primary database on the `main` branch
- Autoscaling up to 2 CU (≈8 GB RAM)
- Scale-to-zero after 5 minutes of inactivity
- 100 CU-hours/month and 0.5 GB of storage
- Up to 10 branches per project, 100 projects per account

See [Plans](https://neon.com/docs/introduction/plans) for the full breakdown.

<Admonition type="tip">
Computes scale to zero when idle. The first query after a cold start typically returns within a few seconds while the compute wakes up.
</Admonition>

## How other managed Postgres options compare

- **AWS RDS for PostgreSQL**: provisions a [DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html) of a fixed class on EC2 hardware. Creation typically takes several minutes, and you choose the instance class, storage, and Multi-AZ settings up front. No scale-to-zero.
- **Aurora Serverless v2**: faster to start than RDS, and supports scale to zero by setting min capacity to 0 ACUs, see [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). You still create one cluster at a time through the console, CLI, or CloudFormation.
- **Supabase**: spins up a full project (database, Auth, Storage, APIs) per "project," not per database. Free-plan projects pause after a week of inactivity, see [pricing](https://supabase.com/pricing).

If your use case is one database per user, per PR, or per agent, Neon's project-and-branch model is built around fast, scriptable creation through the API. AWS's account-level quotas on DB instances and Supabase's project-level provisioning model both push you toward fewer, longer-lived databases.

<CTA title="Spin up Postgres on Neon" description="Free plan, no credit card. Provision a database in seconds." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
