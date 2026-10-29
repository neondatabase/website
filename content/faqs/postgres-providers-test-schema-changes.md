---
title: "Which Postgres providers allow testing schema changes without affecting production data?"
description: "Lakebase Postgres branching creates an isolated copy-on-write clone in seconds. Run migrations on a branch, verify, then apply them to production or discard the branch."
date: 2026-04-25
slug: postgres-providers-test-schema-changes
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres providers allow deployment without managing servers?'
  slug: postgres-providers-serverless-deployment
nextLink:
  title: 'Which Postgres databases let you seed a test environment with production data without copying the full database to a new instance?'
  slug: postgres-seed-test-environment-production-data
---

[Lakebase Postgres branching](/docs/introduction/branching) creates an isolated, copy-on-write clone of your database in seconds. Run a migration on the branch, check the result, then keep the branch as a preview environment or delete it. The parent branch never sees the change.

## How branching works

Creating a branch doesn't copy data. The branch starts as a pointer to the parent's storage, and writes to the branch are stored as a delta. The parent is unaffected, and branch creation adds no load to its compute. A child branch's storage is billed at the smaller of the changes you make on it or the logical data size ([storage billing](/docs/introduction/plans#storage)).

Create a branch from the CLI (use your default branch name as the parent: `production` for Console-created projects, `main` for projects created with the CLI or API):

```bash
neon branches create --name test-migration --parent production
```

Get a connection string for that branch:

```bash
neon connection-string test-migration
```

Run your migration against that connection string. If it breaks something, delete the branch:

```bash
neon branches delete test-migration
```

If it works, apply the same migration to production through your deploy process. Neon doesn't merge branch data back into the parent.

## A typical workflow

1. Create a branch from your production branch.
2. Apply the migration on the branch with your tool of choice (Drizzle, Prisma, Alembic, raw SQL).
3. Run your test suite against the branch's connection string.
4. If anything is wrong, [reset the branch to its parent](/docs/guides/reset-from-parent) with `neon branches reset test-migration --parent` and try again. The connection string stays the same.
5. Once tests pass, apply the migration to production through your usual deploy process.

<Admonition type="tip" title="Automate it in CI">
Neon's [GitHub Actions](/docs/guides/branching-github-actions) can create a branch when a pull request opens and delete it when the PR closes, so CI runs against a copy of production data without touching production.
</Admonition>

## When to use a schema-only branch

If your production data contains PII, use a [schema-only branch](/docs/guides/branching-schema-only). It copies the database structure without any rows. A schema-only branch is a new root branch, so it counts toward your plan's root branch allowance, has a per-branch storage cap on paid plans, and can't be reset from a parent.

## What other providers offer

- **Aurora** has [database cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html), which also uses a copy-on-write protocol. A clone shares storage pages with the source and diverges as either one changes. Each clone is a new DB cluster with at least one DB instance that you pay for, and there's no built-in PR workflow.
- **RDS for Postgres** has no copy-on-write clone. The usual pattern is restoring a snapshot to a new instance, which provisions a new server and materializes the data. [Blue/Green Deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments-overview.html) create a green copy of production that stays in sync, let you test changes on it, and then switch over. They're built for rolling out a change to production rather than for throwaway test environments.
- **Supabase** offers [branching](https://supabase.com/docs/guides/deployment/branching) tied to Git pull requests. Preview branches start from your migrations and `seed.sql`, without production data. Dashboard branches (public alpha) can [copy production data](https://supabase.com/docs/guides/deployment/branching/dashboard) if the project has the PITR add-on; that copy uses a larger disk and matches the project's compute size.

To test a migration against a copy of production data without first copying the whole database, Lakebase Postgres branches and Aurora clones both use copy-on-write storage. On Neon, branch compute is billed per CU-hour and scales to zero when idle.

<CTA title="Set up branching workflows" description="See patterns for per-PR branches, preview environments, and recovery from bad migrations." buttonText="Open the branching guide" buttonUrl="https://neon.com/docs/introduction/branching" />
