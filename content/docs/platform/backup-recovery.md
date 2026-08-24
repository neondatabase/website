---
title: Backup & recovery
subtitle: Understanding what restores and what doesn't across your backend
summary: >-
  Neon's backup and restore capabilities operate at different levels depending
  on the product. Postgres databases and Managed Better Auth data restore
  together via instant restore and snapshots. Object Storage buckets, Functions
  deployments, and AI Gateway configuration are not reverted by database
  restores and require separate recovery approaches. This page clarifies the
  scope boundaries and links to each product's durability documentation.
enableTableOfContents: true
---

When you restore a Neon branch using [instant restore](/docs/postgres/backup-restore/branch-restore) or [snapshots](/docs/guides/backup-restore), you're restoring the **database timeline**. Understanding what gets restored and what doesn't is critical for planning your disaster recovery strategy.

## What restores with the database

Database restore operations (instant restore, point-in-time restore, reset from parent, and snapshot restores) revert:

- **Postgres data and schema**: All tables, indexes, sequences, views, and other database objects
- **Postgres roles and databases**: User accounts, roles, and all databases on the branch
- **Managed Better Auth data**: User accounts, sessions, and organization data stored in the `neon_auth` schema

Because Managed Better Auth stores its state inside your Postgres database (in the `neon_auth` schema), it automatically restores along with your database. This ensures that user authentication state stays consistent with your application data.

## What does NOT restore with the database

Database restore operations do **not** revert:

- **Object Storage buckets**: Files and objects stored in Neon Object Storage remain unchanged. Bucket contents are not rolled back when you restore a database.
- **Functions deployments**: Deployed functions and their versions are not reverted. The function code that was deployed remains active regardless of database restores.
- **AI Gateway configuration**: Model routing, rate limits, and gateway settings are platform-global and are not affected by database restores.

These products maintain their own state independent of the database timeline. If you need to recover or revert these components, you must handle them separately.

## Gotchas

- **Logical replication**: Replication slots and subscriptions are **not inherited** by a branch. After restoring, you'll need to recreate logical replication configurations.

## Recovery strategy by product

To build a complete disaster recovery plan, you need to address each backend component separately:

### Postgres database + Managed Better Auth

Use Neon's built-in database backup and restore:

- [Instant restore (PITR)](/docs/postgres/backup-restore/branch-restore) — Roll back to any point within your history window
- [Snapshots](/docs/guides/backup-restore) — Create manual or scheduled restore points
- [History window configuration](/docs/postgres/backup-restore/history-window) — Control how far back you can restore

### Object Storage

Object Storage recovery depends on your own backup strategy:

- **Versioning**: If enabled for your buckets, you can recover previous versions of objects (check your bucket configuration for versioning status and retention)
- **External backups**: Set up your own backup process to copy critical objects to external storage
- **Application-level recovery**: Rebuild objects from source data or application state

See [Object Storage documentation](/docs/storage) for durability details and versioning capabilities.

### Functions

Functions are immutable once deployed. Recovery approaches:

- **Redeploy from source**: Functions should be deployed from version-controlled source code. To recover, redeploy the correct version from your repository.
- **Version history**: Previous function versions remain available unless explicitly deleted. You can revert to an earlier deployment if needed.

See [Functions documentation](/docs/functions) for deployment and versioning details.

### Secrets and configuration

Environment variables, API keys, and other secrets are not stored in the database:

- **Better Auth configuration**: External provider credentials, OAuth apps, and signing keys are configured outside the database. Back these up separately in your secrets management system.
- **Application secrets**: Database connection strings, API keys, and other application configuration must be backed up independently.

## Testing your restore workflow

Before you need it in production:

1. **Test database restore**: Practice restoring a branch from both instant restore and snapshots
2. **Document Object Storage recovery**: Identify which buckets contain critical data and verify your backup or versioning strategy
3. **Verify Functions redeployment**: Ensure you can redeploy functions from source in your CI/CD pipeline
4. **Inventory secrets**: Document all external configuration and secrets needed to restore a fully functioning environment

See [Getting ready for production](/docs/get-started/production-checklist#test-your-restore-workflow) for a complete production readiness checklist.

<NeedHelp/>
