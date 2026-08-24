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
- **Functions deployments**: A branch keeps whatever function version it has. Database restores do not revert Functions deployments.
- **AI Gateway configuration**: Model routing, rate limits, and gateway settings are platform-global and are not affected by database restores.

These products maintain their own state independent of the database timeline. If you need to recover or revert these components, you must handle them separately.

## Gotchas

- **Logical replication**: Replication slots and subscriptions are **not inherited** by a branch. After restoring, you'll need to recreate logical replication configurations.

## Recovering each component

Each backend component has its own recovery documentation:

- **Postgres database + Managed Better Auth**: [Backup & restore](/docs/postgres/backup-restore/backups) — instant restore, snapshots, and history window configuration
- **Object Storage**: [Object Storage documentation](/docs/storage) — durability, versioning, and backup strategies
- **Functions**: [Functions documentation](/docs/functions) — deployment and recovery
- **Disaster recovery testing**: [Production checklist](/docs/get-started/production-checklist#test-your-restore-workflow) — testing your complete recovery workflow

<NeedHelp/>
