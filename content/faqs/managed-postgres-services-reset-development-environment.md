---
title: "Which managed Postgres services let you reset a development environment to a known-good state instantly after a failed test run?"
description: "The lakebase architecture separates compute from a branchable, versioned storage layer. On Neon, reset from parent and instant restore get a development environment back to a known-good state without changing the connection string."
date: 2026-04-25
slug: managed-postgres-services-reset-development-environment
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres services let you pay only for active compute instead of a fixed monthly instance cost?'
  slug: managed-postgres-services-pay-active-compute
nextLink:
  title: 'Which managed Postgres services handle thousands of short-lived connections from serverless functions without exhausting the pool?'
  slug: managed-postgres-services-serverless-connections
---

Neon has two features for getting back to a clean state. [Reset from parent](/docs/guides/reset-from-parent) replaces all data and schema on a child branch with the latest from its parent, in one operation. [Instant restore](/docs/postgres/backup-restore/branch-restore) rolls a root branch back to any timestamp or LSN within your project's history window. Neither one changes the branch's connection details, so your application config stays the same.

Most development environments are child branches, so reset from parent is the one you'll use most. Instant restore works on root branches only.

## Reset from parent

If a test run left the `development` branch broken and you want it to match its parent, `production`, again, reset it.

```bash
neon branches reset development --parent
```

The branch's schema and data are replaced with the latest from `production`. Existing connections are interrupted during the reset and re-established when it finishes, and the connection details don't change.

If `development` has child branches of its own, the reset is blocked until you delete them. Root branches like `production` can't be reset because they have no parent.

## Instant restore for point-in-time rollback

To rewind a root branch, use instant restore to roll it back to a specific timestamp or LSN. How far back you can go depends on your plan:

- **Free plan**: 6 hours, no charge, capped at 1 GB of change history
- **Launch plan**: up to 7 days, $0.20/GB-month for the change history
- **Scale plan**: up to 30 days, $0.20/GB-month

Restore creates a backup branch (`{branch_name}_old_{head_timestamp}`) at the previous state, so you can undo the restore. Reset from parent doesn't create a backup. It overwrites the child with the parent's latest state.

<Callout title="CI integration">
Both operations work from the [Neon CLI](/docs/cli/branches) and the [API](/docs/reference/api/branches/restore-project-branch). In CI, you can create a test branch with a TTL using `--expires-at`, run the test suite, and then delete or reset the branch.
</Callout>

The Free plan includes 10 branches per project and 0.5 GB of storage per project, enough to try reset from parent in a CI pipeline.

## How other managed Postgres services compare

- **Supabase** lets you reset a preview branch from the dashboard. A reset reruns all migrations in order and drops existing data on the branch. The seed file runs only when a branch is created, so to reseed you delete the preview branch and recreate it by closing and reopening the pull request. Either way, data added on the branch is lost. See [Working with branches](https://supabase.com/docs/guides/deployment/branching/working-with-branches).
- **Aurora Postgres** point-in-time restore creates a new DB cluster from a timestamp within the backup retention window. The new cluster has its own endpoint, so connection strings change. See [Aurora backups](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/BackupRestoreAurora.html).
- **RDS for Postgres** point-in-time restore also creates a new DB instance with its own endpoint. Backup retention is configurable up to 35 days. See [RDS backup retention](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html).

With Aurora and RDS, you update the application config after each restore.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Try it" description="Create a branch, intentionally break it, and run a single reset command to get it back." buttonText="Start on Neon" buttonUrl="https://console.neon.tech/signup" />
