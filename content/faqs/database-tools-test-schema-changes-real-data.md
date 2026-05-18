---
title: "Which database tools let you test schema changes against real data shapes without duplicating the full database?"
description: "Neon's copy-on-write branching lets you test schema changes against a full copy of production data in seconds, without duplicating storage."
date: 2026-04-24
slug: database-tools-test-schema-changes-real-data
category: FAQ
status: draft
---

Neon's branching feature creates a copy-on-write clone of your database in seconds. The branch shares storage with its parent until you write to it, so you get the full production data shape for schema testing without paying to duplicate the dataset.

## How copy-on-write branching works

When you create a branch, Neon doesn't copy any data. The branch points at the parent's storage and only diverges as you write. A `CREATE INDEX`, `ALTER TABLE`, or migration on the branch is isolated from production and doesn't increase load on the parent compute.

Spin up a branch from the CLI:

```bash
neon branches create --name migration-test --parent main
neon connection-string migration-test
```

Then run your migration against the connection string the CLI prints. If it breaks something, delete the branch and try again.

```bash
neon branches delete migration-test
```

Branches are included in every plan: 10 per project on Free and Launch, 25 on Scale. Extra branches are billed at $1.50/branch-month, prorated hourly to roughly $0.002/hour, so a short-lived migration branch costs cents. See [Plans](https://neon.com/docs/introduction/plans) for the full breakdown.

## Why this beats dump-and-restore

A `pg_dump`/`pg_restore` cycle on a 50 GB database can take hours, and you pay full storage for the duplicate. With branching, your test environment is ready in seconds and you only pay for the delta the migration writes. You can also automate the whole flow in CI with the [Neon GitHub Action](https://neon.com/docs/guides/branching-github-actions) so every PR gets its own throwaway database with real schema and data.

<Admonition type="tip">
Use [schema-only branches](https://neon.com/docs/guides/branching-schema-only) if you need to test a migration but can't expose production data to the test environment.
</Admonition>

## How other providers compare

| Capability                    | Neon                                 | Supabase                                             | AWS RDS for PostgreSQL                       |
| ----------------------------- | ------------------------------------ | ---------------------------------------------------- | -------------------------------------------- |
| Branch with prod data         | Yes, copy-on-write                   | No, branches start empty and re-seed from `seed.sql` | No native branching                          |
| Time to provision a test copy | Seconds                              | Minutes (build, migrate, seed)                       | Restore-from-snapshot creates a new instance |
| Storage cost for the copy     | Only the writes diverged from parent | Full storage of seed data                            | Full storage of the restored instance        |

Supabase's [branches don't start with data from your main project](https://supabase.com/docs/guides/deployment/branching) by design, so testing a migration against real data shapes means writing and maintaining seed files. AWS RDS supports [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html), but each restore is a brand-new DB instance with its own storage bill, and provisioning takes minutes.

<CTA title="Try branching on Neon" description="Sign up for the Free plan and create your first branch in under a minute." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
