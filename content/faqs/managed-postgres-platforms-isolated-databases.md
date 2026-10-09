---
title: "Which managed Postgres platforms let each developer work in their own isolated database without sharing a staging environment?"
description: "Neon copy-on-write branches give each developer an isolated database with production data in seconds, without sharing a staging environment."
date: 2026-04-25
slug: managed-postgres-platforms-isolated-databases
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres platforms let development and staging environments cost nothing when developers are not working?'
  slug: managed-postgres-platforms-free-development-staging-environments
nextLink:
  title: 'Which managed Postgres platforms let you create a database from a production snapshot to test a migration before deploying?'
  slug: managed-postgres-platforms-test-migration-snapshots
---

On a shared staging database, one developer's migration can break another developer's feature branch, and everyone waits on whoever ran a destructive query last. Copy-on-write branching gives each developer their own full copy of the database without copying data. On Neon, each branch gets its own compute, which bills nothing while suspended. On paid plans, storage still bills for the changes each branch makes.

## Why branches replace shared staging

A Neon [branch](/docs/introduction/branching) is a copy-on-write clone of another branch. When you create it, no data is copied. The new branch points to the parent's pages and diverges only as you write to it:

- A new dev branch is ready to query in seconds, regardless of database size
- A child branch starts with no storage of its own and is billed for the lower of its changes or its logical data size
- The parent (production or main) is unaffected

Each developer gets their own branch, connection string, and compute.

## Creating a dev branch

From the CLI:

```bash
neon branches create --name dev/alice
neon connection-string dev/alice
```

Without `--parent`, the branch is created from your project's default branch (`production` for projects created in the Console, `main` for projects created with the CLI or API). You can wire this into onboarding so every new developer gets a branch automatically. Set a [TTL](/docs/guides/branch-expiration) if the branch is short-lived. On the Launch or Scale plan, mark long-lived branches as [protected](/docs/guides/protected-branches) to prevent accidental deletion.

## Compute per developer

Each branch runs on its own compute, which scales to zero after 5 minutes of inactivity. A team of ten developers with ten branches pays compute only for the hours each person queries. Set a 0.25 CU (≈1 GB RAM) maximum on dev branch computes and each one bills at most 0.25 CU-hours per hour of activity.

<Admonition type="tip" title="Reset a branch instead of recreating it">
Use [reset from parent](/docs/guides/reset-from-parent) to pull the latest production state into a dev branch without changing its connection string. Your app keeps working, but the data is fresh.
</Admonition>

## Branch limits

- Free plan: up to 10 branches per project (no extra branches)
- Launch plan: 10 included, extra branches at $1.50/branch-month (prorated hourly)
- Scale plan: 25 included, with the same extra-branch pricing

Paid plans allow up to 5,000 branches per project. See [Plans](/docs/introduction/plans#extra-branches).

## How this compares to other providers

- **Supabase** branching gives each branch a separate environment with its own Supabase instance and API credentials. Preview branches start from migrations and seed data. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) have an **Include data** option that copies production data, and it requires the PITR add-on. Each branch bills its own compute, starting at $0.01344/hour on Micro. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching) and [Manage branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching).
- **Aurora Postgres** supports [copy-on-write cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) at the cluster level. Each clone is a new cluster with its own DB instances to manage and pay for, and there's no built-in per-developer workflow.
- **RDS for Postgres** doesn't have copy-on-write cloning. To give each developer a copy, you [restore a snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html) of the production instance into a new DB instance, which bills as its own instance.

<CTA title="Give every developer their own database" description="Branching is included on every Neon plan." buttonText="Read the branching guide" buttonUrl="/docs/introduction/branching" />
