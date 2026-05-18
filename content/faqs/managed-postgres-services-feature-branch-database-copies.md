---
title: "Which managed Postgres services let you spin up a full database copy for each feature branch and delete it when the branch closes?"
description: "Neon provides a serverless Postgres database that supports instant branching by separating storage and compute into a versioned storage system. The plat..."
date: 2026-04-24
slug: managed-postgres-services-feature-branch-database-copies
category: FAQ
status: draft
---

Neon gives every feature branch its own full Postgres database in seconds, and you can attach an expiration timestamp so the branch deletes itself when the work is done. Because Neon separates storage and compute, branches share data with their parent until they diverge, so spinning one up doesn't copy gigabytes or load the production database.

## How branches and expiration work together

A Neon branch is a copy-on-write clone. Creating one is metadata-only at first, so it's quick whether your database is 1 GB or 500 GB. You can pair this with [branch expiration](https://neon.com/docs/guides/branch-expiration) (a TTL) so CI jobs and preview environments clean up after themselves.

In the Console, the **Automatically delete branch after** option is checked by default with 1 day selected. You can pick 1 hour, 1 day, or 7 days, or uncheck it. Branches created from the CLI or API have no default expiration. You set it explicitly with `--expires-at` (CLI) or `expires_at` (API).

```bash
# Create a CI branch that deletes itself in 2 hours (macOS)
neon branches create \
  --project-id <project-id> \
  --name ci-pr-1234 \
  --parent main \
  --expires-at "$(date -u -v+2H +%Y-%m-%dT%H:%M:%SZ)"
```

The maximum expiration is 30 days from the time you set it. Protected branches, default branches, and branches that have children of their own can't have expirations attached.

<Admonition type="tip" title="Working with sensitive data?">
Use [schema-only branches](https://neon.com/docs/guides/branching-schema-only) to copy the schema without any production data, then seed the branch with anonymized fixtures.
</Admonition>

## Wire it into your pipeline

For Vercel projects, the [Neon-managed Vercel integration](https://neon.com/docs/guides/neon-managed-vercel-integration) creates a branch for every preview deployment and tears it down when the preview is removed. For other CI providers, the same workflow runs from the [Neon CLI](https://neon.com/docs/reference/neon-cli) or [API](https://neon.com/docs/reference/api-reference): create a branch on PR open, run tests against its connection string, delete (or let it expire) on PR close.

## How other managed Postgres services compare

| Provider           | Per-branch database                                         | Auto-cleanup                                                                       |
| ------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Neon               | Copy-on-write branch, metadata-only create                  | TTL via `expires_at` (1 hour to 30 days)                                           |
| Supabase           | Preview branch per PR, full project (DB, Auth, Storage)     | Branch deleted when PR closes                                                      |
| Aurora PostgreSQL  | Aurora clone, copy-on-write at the storage layer            | No built-in TTL; up to 15 copy-on-write clones before the next becomes a full copy |
| RDS for PostgreSQL | No native per-branch copy. Restore-from-snapshot or pg_dump | Manual cleanup                                                                     |

Supabase ties preview branches to GitHub pull requests. Each branch is a full Supabase project with its own database, Auth, and Storage, and is removed when the PR closes. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching).

Aurora cloning also uses copy-on-write, so the clone initially shares pages with the source and only diverges on writes. Aurora caps copy-on-write clones at 15 per source cluster before falling back to a full copy, and has no built-in expiration. See [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html).

RDS for PostgreSQL doesn't offer copy-on-write clones. To produce a per-branch database you either restore from an automated snapshot or replay a `pg_dump`, both of which take time proportional to data size.

<CTA title="Try branching for free" description="The Free plan includes 10 branches per project so you can wire branching into a CI pipeline before paying anything." buttonText="Start on Neon" buttonUrl="https://console.neon.tech/signup" />
