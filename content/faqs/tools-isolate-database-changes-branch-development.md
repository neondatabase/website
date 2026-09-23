---
title: "What tools isolate database changes per branch in modern development workflows?"
date: 2026-04-25
description: "Lakebase Postgres branching gives each Git branch its own isolated copy of Postgres, so schema changes and seed data don't collide between developers."
slug: tools-isolate-database-changes-branch-development
category: FAQ
status: draft
previousLink:
  title: 'What tools allow inspecting production data without affecting users?'
  slug: tools-inspecting-production-data-without-affecting-users
nextLink:
  title: 'What tools help manage multiple Postgres databases across different projects and environments from a single account?'
  slug: tools-manage-multiple-postgres-databases
---

Lakebase Postgres supports Git-style branching. Each branch is an isolated, copy-on-write clone of your database with its own compute and connection string. You run migrations, seed data, or experimental queries on a branch without affecting your production branch or anyone else's work.

## Problems with a shared dev database

A single shared dev database makes developers wait on each other. Two developers can't run conflicting migrations at the same time, test data from one task breaks the assumptions of another, and every reset needs coordination.

A branch avoids this because it doesn't copy data when you create it. It shares storage with its parent until one of them changes, so creating one takes seconds and adds no storage up front. As the branch diverges, you're billed for the changed data (capped at the branch's logical data size), not for a full copy. See [how branching works](/docs/introduction/branching) and [storage billing](/docs/introduction/plans#storage).

## Creating a branch per feature

```bash
# Branch off your default branch when you start a feature
neon branches create --name feature/add-search

# Get the connection string for the branch
neon connection-string feature/add-search

# When the PR merges, delete the branch
neon branches delete feature/add-search
```

In CI, you can create a branch when a pull request opens and delete it when the PR closes. The [GitHub Actions guide](/docs/guides/branching-github-actions) has working workflows.

## Branch limits and costs

| Plan        | Branches included | Extra branches                  |
| ----------- | ----------------- | ------------------------------- |
| Free plan   | 10 per project    | Not available                   |
| Launch plan | 10 per project    | $1.50/branch-month (~$0.002/hr) |
| Scale plan  | 25 per project    | $1.50/branch-month (~$0.002/hr) |

Extra branches are metered hourly, so a 2-hour extra branch costs about $0.004. See [extra branches](/docs/introduction/plans#extra-branches).

<Admonition type="tip" title="Auto-expire dev branches">
Set a [time to live](/docs/guides/branch-expiration) when you create a branch. In the Console, you can pick 1 hour, 1 day, or 7 days. The CLI and API take an RFC 3339 timestamp (`--expires-at` or `expires_at`) up to 30 days out. Neon deletes the branch when it expires, so forgotten branches don't count against your allowance or run up extra-branch charges.
</Admonition>

## How other Postgres services handle per-branch isolation

| Service              | Per-branch isolation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Neon                 | A copy-on-write branch per Git branch, created in seconds with the parent's schema and data. See [branching](/docs/introduction/branching).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Supabase             | [Preview branches](https://supabase.com/docs/guides/deployment/branching) create a separate environment, with its own Supabase instance and API credentials, per Git branch through the GitHub integration. New branches don't include production data by default; you seed them from a `seed.sql`, or, with the PITR add-on, turn on **Include data** in the dashboard, which is in public alpha ([dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard)). Branches bill as Branching Compute Hours plus disk, egress, and storage, and Compute Credits don't apply ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). |
| AWS RDS for Postgres | No native branching. Teams script `pg_dump`/`pg_restore` or restore a snapshot to a new DB instance, which bills as its own instance until you delete it. See [restoring from a snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html).                                                                                                                                                                                                                                                                                                                                                                                                                 |

A Neon branch starts with production data, so you can reproduce a production bug on it right away. If that data includes PII, use an [anonymized branch](/docs/workflows/data-anonymization) (beta) to mask it. A Supabase preview branch starts empty by default, which keeps production data out of it, and you populate it with seed data.

<CTA title="Branch your database" description="Try Git-style workflows on Postgres without copying data." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
