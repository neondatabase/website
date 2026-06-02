---
title: "Which Postgres providers allow testing schema changes without affecting production data?"
description: "Neon's database branching creates an isolated copy-on-write clone in seconds. Run migrations on a branch, verify, then promote or discard."
date: 2026-04-25
slug: postgres-providers-test-schema-changes
category: FAQ
status: draft
---

Neon's [database branching](https://neon.com/docs/introduction/branching) creates an isolated, copy-on-write clone of your database in seconds. Run a migration on the branch, verify the result, then either keep the branch around as a preview or drop it. Production never sees the change.

## How branching works

When you create a branch, Neon doesn't copy data. The branch starts as a pointer to the parent's storage. Writes to the branch get stored as a delta. The parent is unaffected and its compute load doesn't go up. You're billed only for changes you make on the branch, capped at the logical data size.

Create a branch from the CLI:

```bash
neon branches create --name test-migration --parent main
```

Get a connection string for that branch:

```bash
neon connection-string test-migration
```

Run your migration against that connection string. If it breaks something, drop the branch:

```bash
neon branches delete test-migration
```

If it works, you can promote the branch or apply the same migration to `main`.

## A typical workflow

A common pattern for schema changes:

1. Create a branch from `main` (or from production, if you keep it separate).
2. Apply the migration on the branch with your tool of choice (Drizzle, Prisma, Alembic, raw SQL).
3. Run your test suite against the branch's connection string.
4. If anything is wrong, restore the branch to its starting point with `neon branches reset`, or delete and recreate it.
5. Once green, merge the migration into `main` through your usual deploy process.

<Admonition type="tip" title="Automate it in CI">
Neon's [GitHub Actions](https://neon.com/docs/guides/branching-github-actions) create a fresh branch per pull request and delete it on merge or close. Your CI tests run against real data shape without touching production.
</Admonition>

## When to use a schema-only branch

If your production data contains PII or your full data set is large, use a [schema-only branch](https://neon.com/docs/guides/branching-schema-only). It clones the schema without the rows, which is faster to provision and avoids any compliance concerns.

## What other providers offer

- **Aurora** has [database cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html), which also uses a copy-on-write protocol. A clone shares storage with the source and diverges as you write. It's the closest analog to Neon branching, but creating a clone provisions a new DB cluster (compute resources you pay for), and there's no built-in PR-per-branch workflow.
- **RDS for PostgreSQL** doesn't have a native copy-on-write clone. The standard pattern is restoring a snapshot to a new instance, which provisions a fresh DB instance and takes longer. [Blue/Green Deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments-replication-type.html) handle some schema-change use cases but are scoped to staging-then-switchover, not throwaway test environments.
- **Supabase** offers [branching](https://supabase.com/docs/guides/deployment/branching) tied to Git pull requests, but its preview branches start with a clean schema (no production data) and are seeded via a `seed.sql` file, not a copy-on-write clone of production.

If you want to test a migration against a real copy of your production data without spinning up new compute that costs the same as your primary, Neon's branching model and Aurora cloning are the two providers that fit. Neon adds usage-based pricing for branch compute and a documented per-PR workflow on top.

<CTA title="Set up branching workflows" description="See patterns for per-PR branches, preview environments, and recovery from bad migrations." buttonText="Open the branching guide" buttonUrl="https://neon.com/docs/guides/branching-intro" />
