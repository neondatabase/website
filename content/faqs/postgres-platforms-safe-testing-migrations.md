---
title: "What Postgres platforms provide safe testing for risky migrations?"
description: "Test Postgres migrations on a Neon branch with real production data. If something breaks, restore the parent branch to a point before the migration ran."
date: 2026-04-25
slug: postgres-platforms-safe-testing-migrations
category: FAQ
status: draft
---

## Short answer

Neon lets you test a migration on a writable copy of production data, then roll the parent branch back to any point in the history window if the same change breaks something later. Branches are copy-on-write, so testing against a 100 GB database doesn't require 100 GB of new storage.

## The two safety mechanisms

**Test on a branch first.** Create a branch from `main`, run the migration there, and exercise it from a staging deployment. Other Postgres workloads keep running on `main` unaffected, because each branch has its own compute.

```bash
neon branches create --name test/add-user-flags --parent main
# Run the migration against the new branch's connection string
psql "$NEON_TEST_BRANCH_URL" -f migrations/2026-04-25-add-flags.sql
```

**Restore if a deployed migration breaks production.** Neon keeps a continuous change history as Postgres WAL. Use [instant restore](/docs/introduction/branch-restore) to return a branch to a timestamp before the bad change ran:

```bash
neon branches restore main ^self@2026-04-25T14:32:00Z
```

The [history window](/docs/introduction/history-window) is 6 hours on Free, up to 7 days on Launch, and up to 30 days on Scale.

## A safer migration pattern

A common pattern combining both:

1. Create `test/` branch from `main`. Run the migration. Verify your app works against it.
2. Promote the same migration to `main` in a controlled deploy.
3. If something downstream breaks within the history window, branch from `main` at the pre-migration timestamp, or restore `main` in place.

<Admonition type="warning" title="Restore in place drops writes">
Restoring `main` in place overwrites the branch's current state. Writes made after the target timestamp are gone. If you might need them for forensics, branch to a new name from the timestamp instead of restoring in place.
</Admonition>

## What about protected branches

On Launch and Scale, mark `main` as a [protected branch](/docs/guides/protected-branches) to block accidental drops, restrict who can run destructive operations, and require IP allowlisting (Scale only). Treat it like a protected Git branch in your CI/CD.

## How other Postgres options compare

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) gives you a writable copy-on-write copy of production data to test against. Rollback after a bad change uses [PITR](https://docs.aws.amazon.com/aws-backup/latest/devguide/point-in-time-recovery.html), which restores to a new cluster; you then swap connection strings.

- **Amazon RDS for PostgreSQL.** No copy-on-write clone. Testing migrations against real data usually means snapshot-and-restore, which copies the full dataset to a new instance. PITR up to [35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html) is the rollback path, and again restores to a new instance.

- **Supabase.** [Preview branches](https://supabase.com/docs/guides/deployment/branching) let you run migrations on a separate Postgres environment, but [the preview is not seeded with production data](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding). Rollback after a bad change uses daily logical backups or the [PITR add-on](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) (paid).

With Neon, the branch has parent data already, and a restore happens in place against the existing branch, so connection strings don't change.

<CTA title="Test migrations against real data" description="Create a Neon branch, run your migration, throw the branch away." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
