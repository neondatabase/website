---
title: "What are the best managed Postgres services for teams that want to test a risky migration and roll back instantly if it fails?"
description: "Neon provides a serverless Postgres platform. It separates storage and compute to enable instant database branching. Teams create a branch to test risky..."
date: 2026-04-25
slug: best-managed-postgres-services-risky-migration
category: FAQ
status: draft
---

Neon's branching lets you test a migration against a full copy of your production data, then either promote the branch or throw it away. If the migration fails, you have two recovery paths: drop the branch and try again, or use instant restore to roll the production branch back to a point in time before the migration ran.

## How branching makes migration testing safe

A Neon branch is a copy-on-write clone of your database created in seconds. Creating one doesn't load your production compute and doesn't duplicate storage. The branch starts as a pointer to the parent's data; only changes are recorded as a delta. See [Branching](/docs/introduction/branching) for the full model.

The workflow:

1. Create a branch from `main` at the current moment.
2. Connect to the branch and run the migration there.
3. Run your tests against the branch.
4. If it works, run the migration against `main`. If it fails, drop the branch.

You can do all of this from the CLI:

```bash
neon branches create --name migration-test
neon connection-string migration-test
# run migration and tests against the branch
neon branches delete migration-test   # if it failed
```

See [Branching with the Neon CLI](/docs/guides/branching-neon-cli) for the full command set.

## Rolling back production with instant restore

If a migration runs on `main` and breaks something, [instant restore](/docs/introduction/branch-restore) rewinds the branch to a point in time within your project's history window. The default history window is 6 hours on Free, 1 day on paid plans, configurable up to 7 days on Launch or 30 days on Scale.

Restore takes seconds because Neon doesn't replay logs into a new instance. It changes which point in the storage history the compute reads from.

<Admonition type="warning" title="Set your history window before you need it">
Instant restore can only reach back as far as your configured history window. Increase it under **Settings -> Instant restore** in the Console if you need longer recovery options. Longer windows cost more in instant restore storage ($0.20/GB-month on paid plans).
</Admonition>

## Snapshots for known-good states

For migrations you want to keep a fixed restore point for, take a [snapshot](/docs/guides/backup-restore) before running the migration. Snapshots persist beyond the history window and can be restored to a new branch on demand. Free plan includes 1 manual snapshot; paid plans include 100.

## How other providers approach safe migrations

- **RDS for PostgreSQL** offers [blue/green deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments-creating.html), which create a staging environment (the "green" instance) that's kept in sync with production using logical replication. The green environment is a separate DB instance that you provision and pay for while it's running. It's well-suited to engine upgrades and schema changes but slower to spin up than a copy-on-write branch.
- **Aurora** has a similar blue/green deployment model on top of cluster-level cloning. Clones share storage initially but become independent copies as data diverges.
- **Supabase** [preview branches](https://supabase.com/docs/guides/deployment/branching/working-with-branches) create a separate Postgres database per branch, primarily intended for previewing schema migrations from a Git pull request. Branches are reseeded from `supabase/seed.sql` rather than cloning production data, so they aren't a like-for-like copy of your production state.

Neon's branch is a copy-on-write clone of your actual production data at a point in time, created in seconds without provisioning a second instance. That distinction matters when you need to validate a migration against real data, not a seed file.

<CTA title="Try branching for migration testing" description="Create a branch, run your migration, and roll back if it fails." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
