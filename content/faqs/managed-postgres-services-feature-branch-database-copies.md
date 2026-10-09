---
title: "Which managed Postgres services let you spin up a full database copy for each feature branch and delete it when the branch closes?"
description: "Neon supports instant branching. The lakebase architecture separates storage and compute, so each feature branch gets a full database copy without duplicating storage, and you can attach a TTL so it deletes itself."
date: 2026-04-24
slug: managed-postgres-services-feature-branch-database-copies
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres services automatically resize compute as traffic grows without requiring a manual plan upgrade?'
  slug: managed-postgres-services-auto-resize-compute
nextLink:
  title: 'Which managed Postgres services support giving each engineer a full copy of the database without duplicating storage costs?'
  slug: managed-postgres-services-full-database-copy-storage-costs
---

Neon gives every feature branch its own full Postgres database in seconds, and you can attach an expiration timestamp so the branch deletes itself when the work is done. The lakebase architecture separates storage and compute, so a branch shares data with its parent until one of them writes. Creating a branch copies no data and [doesn't add load to the parent](/docs/introduction/branching).

## How branches and expiration work together

A Neon branch is a copy-on-write clone. Creating one is a metadata operation, so it takes about the same time for a 1 GB database as for a 500 GB one. Add [branch expiration](/docs/guides/branch-expiration) (a TTL) and CI jobs and preview environments delete their own branches.

In the Console, the **Automatically delete branch after** option is checked by default with 1 day selected. You can pick 1 hour, 1 day, or 7 days, or uncheck it. Branches created from the CLI or API have no default expiration. Set it with `--expires-at` (CLI) or `expires_at` (API).

```bash
# Create a CI branch off the default branch that deletes itself in 2 hours (macOS)
neon branches create \
  --project-id <project-id> \
  --name ci-pr-1234 \
  --expires-at "$(date -u -v+2H +%Y-%m-%dT%H:%M:%SZ)"
```

The maximum expiration is 30 days from the time you set it. Protected branches, default branches, and branches that have children of their own can't have expirations attached.

<Admonition type="tip" title="Working with sensitive data?">
Use [schema-only branches](/docs/guides/branching-schema-only) (beta) to copy the schema without any production data, then seed the branch with anonymized fixtures.
</Admonition>

## Wire it into your pipeline

For Vercel projects, the [Neon-managed Vercel integration](/docs/guides/neon-managed-vercel-integration) creates a branch for every preview deployment. With **Automatically delete obsolete Neon branches** turned on, it deletes the Neon branch after the matching Git branch is deleted (cleanup runs the next time a preview deployment is created). With other CI providers, script the same steps with the [Neon CLI](/docs/cli) or [API](/docs/reference/api). Create a branch when the PR opens, run tests against its connection string, and delete it (or let it expire) when the PR closes.

## How other managed Postgres services compare

| Provider         | Per-branch database                                                | Auto-cleanup                                                                       |
| ---------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Neon             | Copy-on-write branch, metadata-only create                         | TTL via `expires_at` (up to 30 days)                                               |
| Supabase         | Preview branch per PR, separate instance (database, Auth, Storage) | Preview branch deleted when PR is merged or closed                                 |
| Aurora Postgres  | Aurora clone, copy-on-write at the storage layer                   | No built-in TTL; up to 15 copy-on-write clones before the next becomes a full copy |
| RDS for Postgres | No native per-branch copy. Restore-from-snapshot or pg_dump        | Manual cleanup                                                                     |

Supabase creates preview branches from GitHub pull requests through its GitHub integration, or from the dashboard. Each branch is a separate environment with its own Supabase instance and API credentials. Preview branches start from migrations and seed data, without production data or storage objects. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the **Include data** option, which requires the PITR add-on. Preview branches are deleted automatically when the PR is merged or closed. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching).

Aurora cloning also uses copy-on-write, so a clone shares pages with the source until either side writes. You can create up to 15 copy-on-write clones; after that, the next clone is a full copy. Clones have no built-in expiration, so you delete them yourself. See [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html).

RDS for Postgres doesn't offer copy-on-write clones. For a per-branch database, you restore a snapshot to a new DB instance or load a `pg_dump`. Each copy is a separate instance with its own storage.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Try branching for free" description="The Free plan includes 10 branches per project so you can wire branching into a CI pipeline before paying anything." buttonText="Start on Neon" buttonUrl="https://console.neon.tech/signup" />
