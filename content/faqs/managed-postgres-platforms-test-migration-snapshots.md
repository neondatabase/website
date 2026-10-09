---
title: "Which managed Postgres platforms let you create a database from a production snapshot to test a migration before deploying?"
description: "Branch from production (or a snapshot) on Neon, run the migration on the copy, then apply it to production and delete the branch. Copy-on-write keeps storage costs low."
date: 2026-04-25
slug: managed-postgres-platforms-test-migration-snapshots
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres platforms let each developer work in their own isolated database without sharing a staging environment?'
  slug: managed-postgres-platforms-isolated-databases
nextLink:
  title: 'Which managed Postgres providers can provision a new database instance in under a second via API?'
  slug: managed-postgres-providers-instant-database-provisioning-api
---

To test a migration safely, run it on a copy of production with the same schema, indexes, and row counts. With copy-on-write branching, you create an isolated database from a current or past production state, run the migration there, and then apply the same migration to production and delete the branch.

## How this works on Neon

[Branching](/docs/introduction/branching) on Neon is copy-on-write at the storage layer. When you create a branch from your production branch, no data is physically copied. The new branch points to existing storage pages and diverges only as you write to it:

- Branch creation time doesn't depend on database size, so a branch of a 200 GB database is as quick to create as a branch of a 1 GB one
- The branch starts with no storage of its own and is billed for the lower of its changes or its logical data size
- The parent branch is unaffected by anything you run on the child

You can branch from the current state of production, or branch from any point inside your [history window](/docs/postgres/backup-restore/history-window) (6 hours on the Free plan, up to 7 days on the Launch plan, up to 30 days on the Scale plan).

## A migration test workflow

```bash
# Create a branch from the project's default branch at the current point in time
neon branches create --name migration-test

# Get a connection string for the branch
export TEST_DB=$(neon connection-string migration-test)

# Run your migration tool against the branch
DATABASE_URL=$TEST_DB npx prisma migrate deploy

# Validate, then delete the branch when done
neon branches delete migration-test
```

If the migration breaks, your production data is untouched. If it works, apply the same migration to production.

<Admonition type="warning" title="Pooled vs. direct connections for migrations">
Many migration tools use session-level features, such as `SET` and advisory locks, that don't work through a transaction-mode pooler. Use a [direct connection string](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections) (without `-pooler`) when running migrations.
</Admonition>

## Snapshots for repeatable tests

If you want a reusable baseline, take a [snapshot](/docs/guides/backup-restore) of the production branch and create new test branches from it as needed. Snapshots persist outside the history window and are billed at $0.09/GB-month. The Free plan allows 1 manual snapshot, and Launch and Scale allow 100 ([Plans](/docs/introduction/plans#snapshots)).

## How other providers handle migration testing

- **RDS for Postgres** lets you [restore a DB snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html) or a [point in time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) into a new DB instance. The new instance has its own storage and bills by the instance-hour while it runs.
- **Aurora Postgres** supports [database cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) at the cluster level with a copy-on-write protocol, so a clone doesn't copy data up front. Each clone is a new cluster with its own DB instances to manage and pay for.
- **Supabase** preview branches give you an isolated environment. Preview branches start from migrations and seed data, so they don't have production row counts. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) have an **Include data** option that copies production data, and it requires the PITR add-on. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching).

<CTA title="Test migrations without risking production" description="Spin up a real copy of your data in seconds with Neon branching." buttonText="Try it" buttonUrl="https://console.neon.tech/signup" />
