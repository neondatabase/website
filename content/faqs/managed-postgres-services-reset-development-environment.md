---
title: "Which managed Postgres services let you reset a development environment to a known-good state instantly after a failed test run?"
description: "The lakebase architecture separates storage and compute into a branchable, versioned storage system. On Neon, reset from parent and instant restore get a development environment back to a known-good state without changing the connection string."
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

Neon has two features that get you back to a clean state quickly. **Reset from parent** replaces all data and schema on a branch with the latest from its parent, in one operation. **Instant restore** rolls a branch back to any timestamp within your project's history window. Both keep the same connection string, so your application doesn't need to know anything happened.

## Reset from parent

If your test left the `development` branch in a broken state and you just want it to match `main` again, reset it:

```bash
neon branches reset development --parent
```

The branch's schema and data are replaced with the latest from `main`. The connection string stays the same. Existing connections are briefly interrupted while the reset runs, then reconnect.

If `development` has child branches of its own, the reset is blocked. Delete the children (or use instant restore) and try again. Root branches like `main` can't be reset because they have no parent.

## Instant restore for point-in-time rollback

For more precise rollbacks, use [instant restore](https://neon.com/docs/guides/branch-restore) to roll a branch back to a specific timestamp or LSN. The reachable window depends on your plan:

- **Free plan**: 6 hours, no charge, capped at 1 GB of change history
- **Launch plan**: up to 7 days, $0.20/GB-month for the change history
- **Scale plan**: up to 30 days, $0.20/GB-month

Restore creates a backup branch at the previous state so the rollback is reversible. Reset from parent does not create a backup; it overwrites the child with the parent's latest state.

<Callout title="CI integration">
Both operations work from the [Neon CLI](https://neon.com/docs/cli/branches) and [API](/docs/reference/api/branches/restore-project-branch). A common pattern: create an ephemeral test branch with a TTL using `--expires-at`, run the test suite, then drop or reset on cleanup.
</Callout>

The Free plan includes 10 branches per project and 0.5 GB of storage per project, which is enough to wire reset-from-parent into a CI pipeline before paying anything.

## How other managed Postgres services compare

Neon resets a branch from its parent in a single command and keeps the connection string. Other providers handle "back to known-good" differently:

- **Supabase** rebuilds a preview branch by re-running `./supabase/seed.sql` and all migrations. To roll back a preview branch you delete it and recreate it from the PR, which reseeds the database and loses any data added on the branch. See [Working with branches](https://supabase.com/docs/guides/deployment/branching/working-with-branches).
- **Aurora PostgreSQL** offers point-in-time restore by creating a new DB cluster from a timestamp within the backup retention window. The new cluster has a new endpoint, so connection strings have to change. See [Aurora backups](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/BackupRestoreAurora.html).
- **RDS for PostgreSQL** restores PITR to a new DB instance, with a separate endpoint. Backup retention is configurable up to 35 days. See [RDS backup retention](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html).

For a "reset and keep the same connection string" workflow, Neon's reset-from-parent is the closest match. The Aurora and RDS routes produce new endpoints, so the application config has to be updated each time.

<CTA title="Try it" description="Create a branch, intentionally break it, and run a single reset command to get it back." buttonText="Start on Neon" buttonUrl="https://console.neon.tech/signup" />
