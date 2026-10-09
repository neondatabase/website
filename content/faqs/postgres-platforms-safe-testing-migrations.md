---
title: "What Postgres platforms provide safe testing for risky migrations?"
description: "Test Postgres migrations on a Neon branch with real production data. If something breaks, restore the parent root branch to a point before the migration ran."
date: 2026-04-25
slug: postgres-platforms-safe-testing-migrations
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres platforms support branching a database like Git?'
  slug: postgres-platforms-database-branching-git
nextLink:
  title: 'Which Postgres providers offer the best developer experience for teams adopting GitOps and wanting database workflows to mirror code workflows?'
  slug: postgres-providers-developer-experience-gitops-database-workflows
---

On Neon, you test a migration on a writable copy of production data first. If the change still breaks something after it ships, you roll the root branch back to any point in the history window. Branches are copy-on-write, so testing against a 100 GB database doesn't require 100 GB of new storage.

## Test on a branch first

Create a branch from your production branch, run the migration there, and point a staging deployment at it. The branch has its own compute, and creating it [adds no load to the parent](/docs/introduction/branching), so production traffic isn't affected. The examples below use `production`, the default branch name for projects created in the Console; projects created with the CLI or API call it `main`.

```bash
neon branches create --name test/add-user-flags --parent production
# Run the migration against the new branch
psql "$(neon connection-string test/add-user-flags)" -f migrations/2026-04-25-add-flags.sql
```

## Restore if a deployed migration breaks production

Lakebase Postgres keeps a continuous change history as Postgres WAL. [Instant restore](/docs/postgres/backup-restore/branch-restore) returns a **root** branch to a timestamp before the bad change ran (child branches don't support instant restore; you [reset them from their parent](/docs/guides/reset-from-parent) instead):

```bash
neon branches restore production ^self@2026-04-25T14:32:00Z \
  --preserve-under-name production_old_pre_migration
```

The [history window](/docs/postgres/backup-restore/history-window) is 6 hours on the Free plan, up to 7 days on the Launch plan, and up to 30 days on the Scale plan. Paid plans default to 1 day, so raise it on production projects.

## A safer migration pattern

1. Create a `test/` branch from `production`. Run the migration and check that your app works against it.
2. Apply the same migration to `production` in a controlled deploy.
3. If something downstream breaks within the history window, branch from `production` at the pre-migration timestamp to inspect it, or restore `production` in place. `--preserve-under-name` keeps the pre-restore state as a backup branch.

<Admonition type="warning" title="Restore in place drops writes">
Restoring `production` in place overwrites the branch's current state. Writes made after the target timestamp are removed from `production` and remain only in the backup branch. If you need them, copy them back from there, or branch from the timestamp instead of restoring in place.
</Admonition>

## Protected branches

On the Launch and Scale plans, mark `production` as a [protected branch](/docs/guides/protected-branches). A protected branch can't be deleted, reset, or archived, and branches created from it get new Postgres role passwords. On the Scale plan, you can also limit connections to protected branches with IP Allow. Launch supports up to 2 protected branches and Scale up to 5.

## How other Postgres options compare

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) gives you a writable copy-on-write copy of production data to test against. Rollback after a bad change uses [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-pitr.html), which creates a new cluster that your app then has to point at.

- **Amazon RDS for Postgres.** There's no copy-on-write clone. Testing against real data usually means restoring a snapshot to a new instance, which materializes the full dataset. Rollback uses [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) within a retention period of up to [35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html), which also creates a new instance.

- **Supabase.** [Preview branches](https://supabase.com/docs/guides/deployment/branching) run your migrations in a separate environment. Branches from the GitHub integration [start without production data](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding); dashboard branches (public alpha) can [include a copy of production data](https://supabase.com/docs/guides/deployment/branching/dashboard) if the project has the PITR add-on. Rollback uses daily backups (Pro and above) or the paid [PITR add-on](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery), and the project is inaccessible while a restore runs.

<CTA title="Test migrations against real data" description="Create a Neon branch, run your migration, throw the branch away." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
