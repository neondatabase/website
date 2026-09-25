---
title: "What are the best managed Postgres services for teams that want to test a risky migration and roll back instantly if it fails?"
description: "Test a risky migration on a Neon branch, a copy-on-write clone of your production data, then roll production back with instant restore if the migration still fails."
date: 2026-04-25
slug: best-managed-postgres-services-risky-migration
category: FAQ
status: draft
previousLink:
  title: 'What are the best managed Postgres options for teams moving off a traditional cloud provider who want to keep using standard Postgres tooling?'
  slug: best-managed-postgres-options-for-teams-migrating
nextLink:
  title: 'What are the best Postgres databases for engineering teams that use a monorepo and need isolated database environments per service?'
  slug: best-postgres-databases-monorepo-engineering-teams
---

Neon. You test the migration on a branch, which is a copy-on-write clone of your production data, and only run it on production once it passes. If it still breaks production, you have two ways back: drop the test branch and try again, or use instant restore to roll the production branch back to a moment before the migration ran.

## How branching makes migration testing safe

A Neon branch is a copy-on-write clone of your database, created in seconds. Creating one doesn't add load to the parent branch or duplicate its storage. The branch starts from the parent's data, and only the changes you make on the branch are stored as a delta. See [Branching](/docs/introduction/branching) for the full model.

The workflow:

1. Create a branch from your production branch at the current moment.
2. Connect to the branch and run the migration there.
3. Run your tests against the branch.
4. If it works, apply the same migration to production. If it fails, drop the branch.

With the Neon CLI:

```bash
neon branches create --name migration-test
neon connection-string migration-test
# run migration and tests against the branch
neon branches delete migration-test   # if it failed
```

See [Branching with the Neon CLI](/docs/guides/branching-neon-cli) for the full command set.

## Rolling back production with instant restore

If a migration runs on production and breaks something, [instant restore](/docs/postgres/backup-restore/branch-restore) rewinds the branch to a point in time within your project's history window. The default history window is 6 hours on the Free plan and 1 day on paid plans. You can raise it to 7 days on the Launch plan or 30 days on the Scale plan ([Plans](/docs/introduction/plans#history-window)).

A restore usually finishes in a few seconds. Keep in mind what it does:

- It overwrites the branch. Any writes made after the restore point are removed, including legitimate application writes.
- It applies to every database on the branch, not only the one the migration touched.
- Connections to the branch drop briefly while it runs.
- Neon saves the pre-restore state as a backup branch, so you can undo the restore if you need to.

Instant restore works on root branches, such as your production branch. To bring a child branch back in line with its parent, use [reset from parent](/docs/guides/reset-from-parent) instead. See [Instant restore](/docs/postgres/backup-restore/branch-restore) for details.

<Admonition type="warning" title="Set your history window before you need it">
Instant restore can only reach back as far as your configured history window. You can change it under **Settings** > **Postgres** in the Console ([History window](/docs/postgres/backup-restore/history-window)). A longer window retains more change history, which is billed at $0.20/GB-month on paid plans.
</Admonition>

## Snapshots for known-good states

If you want a fixed restore point for a migration, take a [snapshot](/docs/guides/backup-restore) before you run it. Snapshots persist beyond the history window. You can restore one into the existing branch or into a new branch so you can inspect it first. The Free plan includes 1 manual snapshot, and paid plans include 100. Snapshot storage is billed at $0.09/GB-month.

## How other providers approach safe migrations

- **RDS for Postgres** offers [blue/green deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments-overview.html). A blue/green deployment creates a staging (green) environment that stays in sync with production through physical or logical replication, depending on the change ([replication methods](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments-replication-type.html)). The green environment runs on its own DB instances, which you pay for while it exists. It's designed for engine upgrades, parameter changes, and schema changes, with a switchover when you're ready.
- **Aurora** supports [blue/green deployments](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/blue-green-deployments-overview.html) on the same model, copying the cluster and all of its DB instances. For a quick test copy, [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) creates a new cluster that shares data pages with the source through copy-on-write. The clone is a separate cluster that needs its own DB instance.
- **Supabase** [branching](https://supabase.com/docs/guides/deployment/branching) creates a separate Postgres database per branch, mainly for previewing schema migrations from a Git pull request. Preview branches start from your migrations and seed data: branches created through the GitHub integration are seeded once from `supabase/seed.sql` ([working with branches](https://supabase.com/docs/guides/deployment/branching/working-with-branches)). [Dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data into a branch with its **Include data** option, which requires the PITR add-on.

On Neon, every branch includes the parent's data as of the moment you create it, with no add-on and no second instance to provision. That matters when you need to test a migration against real data rather than a seed file.

<CTA title="Try branching for migration testing" description="Create a branch, run your migration, and roll back if it fails." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
