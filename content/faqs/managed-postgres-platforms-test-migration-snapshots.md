---
title: "Which managed Postgres platforms let you create a database from a production snapshot to test a migration before deploying?"
description: "Testing database migrations directly on production carries high risk of downtime. Managed Postgres platforms like Neon and Supabase offer database branc..."
date: 2026-04-25
slug: managed-postgres-platforms-test-migration-snapshots
category: FAQ
status: draft
---

The safest way to test a migration is to run it on a real copy of production data, with the same schema, indexes, and row counts. Postgres platforms that support **instant branching** let you do exactly that: create an isolated database from a current or past production state in seconds, run the migration, and either promote or throw it away.

## How this works on Neon

Neon's [branching](/docs/introduction/branching) is copy-on-write at the storage layer. When you create a branch from `main`, no data is physically copied. The new branch points to existing storage pages and only diverges as you write to it. Practically, this means:

- A branch from a 200 GB production database is available in seconds, not hours
- The branch's storage starts at $0 and only grows with writes
- The parent branch is unaffected by anything you run on the child

You can branch from the current state of production, or branch from any point inside your [history window](/docs/introduction/history-window) (6 hours on Free, up to 7 days on Launch, up to 30 days on Scale).

## A migration test workflow

```bash
# Create a branch from production at the current point in time
neon branches create --name migration-test --parent main

# Get a connection string for the branch
export TEST_DB=$(neon connection-string migration-test)

# Run your migration tool against the branch
DATABASE_URL=$TEST_DB npx prisma migrate deploy

# Validate, then delete the branch when done
neon branches delete migration-test
```

If the migration breaks, your production data is untouched. If it works, you can promote the branch or simply replay the same migration against production.

<Admonition type="warning" title="Pooled vs. direct connections for migrations">
Most migration tools rely on session-level features like `SET` and prepared statements. Use a [direct connection string](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections) (without `-pooler`) when running migrations.
</Admonition>

## Snapshots for repeatable tests

If you want a reusable baseline, take a [snapshot](/docs/manage/backups) of the production branch and create new test branches from it as needed. Snapshots persist outside the history window and are billed at $0.09/GB-month. Free includes 1 manual snapshot; Launch and Scale include 100.

## How other providers handle migration testing

- **RDS for PostgreSQL** lets you restore from an automated backup or snapshot into a new DB instance. The restore is a full provision: it spins up a new VM and copies storage, which takes minutes to hours depending on database size. See [Backup retention period](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html).
- **Aurora PostgreSQL** supports fast database cloning at the cluster level using a copy-on-write mechanism. Clones are available in minutes (faster than RDS restore) but still create a separate cluster with its own writer/reader instances to manage and pay for.
- **Supabase** preview branches give you an isolated database environment, but the branch starts empty: you seed it from a `seed.sql` file rather than from production data. For migration testing against real schema and row counts, you'd need a separate process to populate the branch. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching).

For migration testing specifically, the Neon and Aurora clone workflows are closest in shape (both are copy-on-write off production state). Neon's storage-level branching is per-branch metadata rather than a full cluster, so creation is seconds rather than minutes, and a branch's compute drops to $0 while suspended (storage continues to bill).

<CTA title="Test migrations without risking production" description="Spin up a real copy of your data in seconds with Neon branching." buttonText="Try it" buttonUrl="https://console.neon.tech/signup" />
