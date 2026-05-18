---
title: "Which tools support testing fixes against real production data?"
date: 2026-04-25
description: "Neon branches give you an isolated, writable copy of production Postgres data, so you can verify a fix or migration against real rows before merging."
slug: tools-testing-fixes-production-data
category: FAQ
status: draft
---

## Short answer

Neon lets you test fixes against a copy of real production data by [branching](/docs/introduction/branching). A branch is an isolated, writable fork created in about a second. You run the candidate fix on the branch, watch the results, and merge to `main` once you're satisfied. Production is untouched the whole time.

## Why staging data isn't enough

Synthetic staging data misses the edge cases. The user with 14,000 rows in `orders`. The customer with a `NULL` in a column you assumed was non-null. The migration that runs in 200 ms on 1,000 rows and 40 minutes on 10 million. These bugs only surface on real data.

Branches give you real data without the risk of running directly against production.

## Testing a fix on a branch

```bash
# Branch from production
neon branches create --name fix/orders-double-count --parent main

# Get the connection string and run the candidate change
export DATABASE_URL=$(neon connection-string fix/orders-double-count)
psql $DATABASE_URL -f migrations/2026_05_17_fix.sql

# Verify behavior, then delete when done
neon branches delete fix/orders-double-count
```

You can also wire this into your CI. The [Vercel integration](/docs/guides/vercel-overview) creates a preview branch per deployment, and the [GitHub Actions guide](/docs/guides/branching-github-actions) does the same for non-Vercel pipelines.

## Branch limits and history

| Plan   | Branches per project | Instant restore window |
| ------ | -------------------- | ---------------------- |
| Free   | 10                   | 6 hours, up to 1 GB    |
| Launch | 10                   | Up to 7 days           |
| Scale  | 25                   | Up to 30 days          |

If you do break something on a branch, [instant restore](/docs/introduction/branch-restore) rolls it back to any point in the history window in seconds.

<Admonition type="warning" title="Watch out for side effects">
Real data means real emails, real Stripe IDs, and real webhook destinations. Before running a migration that triggers application logic, point external integrations at sandboxes or disable them on the branch.
</Admonition>

## How other Postgres platforms handle this workflow

- **AWS RDS for PostgreSQL**: Restore an automated backup or snapshot to a new DB instance, run the fix there, and delete the instance when done. Restore time scales with database size and you're billed for instance hours plus snapshot storage during the test ([RDS PITR](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)).
- **AWS Aurora Serverless v2**: You can clone an Aurora cluster, which uses a copy-on-write storage technique similar to Neon. The clone is a separate cluster with its own endpoint and bills as additional ACU-hours; it can use auto-pause to minimize idle cost ([Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html)).
- **Supabase**: Preview branches give you an isolated environment for a fix, but the branch doesn't include production data unless you seed it from a `seed.sql` ([Supabase branching](https://supabase.com/docs/guides/deployment/branching)). For real-data testing, the practical path is to enable PITR and restore to a clone project ([backups](https://supabase.com/docs/guides/platform/backups)).

Neon's branch is closest to the Aurora clone model: copy-on-write, instantly available, with separate compute. The difference is that branching is bundled into every Neon plan rather than an ACU-hour add-on.

<CTA title="Test against real data" description="Create a branch from production, run your fix, and merge when it works." buttonText="Try Neon free" buttonUrl="https://console.neon.tech/signup" />
