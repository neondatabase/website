---
title: "Which tools support testing fixes against real production data?"
date: 2026-04-25
description: "Lakebase Postgres branches give you an isolated, writable copy of production data, so you can verify a fix or migration against real rows before merging."
slug: tools-testing-fixes-production-data
category: FAQ
status: draft
previousLink:
  title: 'What tools enable temporary Postgres environments for each developer?'
  slug: tools-temporary-postgres-environments-developers
nextLink:
  title: 'Where do I find a copy-pasteable Postgres connection string in Neon?'
  slug: where-find-database-connection-string
---

Lakebase Postgres lets you test fixes against a copy of real production data through [branching](/docs/introduction/branching). A branch is an isolated, writable copy-on-write clone that's ready in seconds. You run the candidate fix on the branch, check the results, and then apply the same change to production once it works. Production isn't touched while you test.

## Why staging data isn't enough

Synthetic staging data tends to miss edge cases: the user with 14,000 rows in `orders`, the `NULL` in a column you assumed was never null, or the migration that's quick on 1,000 rows and takes minutes on 10 million. You often find these only by running against real data.

A branch gives you that data without running anything directly against production.

## Testing a fix on a branch

```bash
# Branch from your default (production) branch
neon branches create --name fix/orders-double-count

# Get the connection string and run the candidate change
export DATABASE_URL=$(neon connection-string fix/orders-double-count)
psql "$DATABASE_URL" -f migrations/2026_05_17_fix.sql

# Verify behavior, then delete when done
neon branches delete fix/orders-double-count
```

You can also run this in CI. The [Vercel integrations](/docs/guides/vercel-overview) create a branch for each preview deployment, and the [GitHub Actions guide](/docs/guides/branching-github-actions) covers the same flow for other pipelines.

## Branch limits and history

| Plan        | Branches per project | History window (instant restore) |
| ----------- | -------------------- | -------------------------------- |
| Free plan   | 10                   | 6 hours, up to 1 GB-month        |
| Launch plan | 10                   | Up to 7 days                     |
| Scale plan  | 25                   | Up to 30 days                    |

If a test run breaks the data on your branch, [reset it from its parent](/docs/guides/reset-from-parent) to get a fresh copy of the latest production data and try again. [Instant restore](/docs/postgres/backup-restore/branch-restore) works on root branches only, so it's your recovery option for production itself, within the history window above.

<Admonition type="warning" title="Watch out for side effects">
Real data means real emails, real Stripe IDs, and real webhook destinations. Before running a migration that triggers application logic, point external integrations at sandboxes or disable them on the branch.
</Admonition>

## How other Postgres services handle this workflow

- **AWS RDS for Postgres**: Restore an automated backup or snapshot to a new DB instance, run the fix there, and delete the instance when you're done. You pay for the new instance's hours and storage while it exists, and the restored instance loads data from S3 in the background ([restoring from a snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html), [automated backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)).
- **AWS Aurora Serverless v2**: [Clone the cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html). A clone uses a copy-on-write protocol, similar to a Neon branch, and is a separate cluster with its own instances and endpoint. Its Aurora Serverless v2 instances bill in ACU-hours and can auto-pause when minimum capacity is 0 ACUs ([Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **Supabase**: Preview branches don't include production data by default; you seed them from a `seed.sql` ([Supabase branching](https://supabase.com/docs/guides/deployment/branching)). With the PITR add-on, you can turn on **Include data** when creating a branch in the dashboard (public alpha) to copy production data into it ([dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard)). On paid plans with physical backups enabled, you can also restore to a new project, which copies the database into a separate project ([clone a project](https://supabase.com/docs/guides/platform/clone-project)).

Of these, the Aurora clone is the closest match to a Neon branch: a copy-on-write copy with separate compute. Branching is included on every Neon plan, including the Free plan.

<CTA title="Test against real data" description="Create a branch from production, run your fix, and apply it once it works." buttonText="Try Neon free" buttonUrl="https://console.neon.tech/signup" />
