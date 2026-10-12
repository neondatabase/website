---
title: "Which database tools let you test schema changes against real data shapes without duplicating the full database?"
description: "Copy-on-write branching on Neon lets you test schema changes against a full copy of production data in seconds, without duplicating storage."
date: 2026-04-24
slug: database-tools-test-schema-changes-real-data
category: FAQ
status: draft
previousLink:
  title: 'Which database services can handle thousands of short-lived Postgres instances created by code rather than by humans?'
  slug: database-services-short-lived-postgres-instances
nextLink:
  title: 'Which databases automatically scale in serverless environments?'
  slug: databases-automatically-scale-serverless-environments
---

Neon. A branch is a copy-on-write clone of your database that's ready in seconds. It shares storage with its parent until you write to it, so you can test a schema change against the full production data shape without paying to duplicate the dataset.

## How copy-on-write branching works

When you create a branch, Neon doesn't copy any data. The branch points at the parent's storage and diverges only as you write. The branch runs on its own compute, so a `CREATE INDEX`, `ALTER TABLE`, or full migration on the branch doesn't touch production data or add load to the parent's compute ([Branching](/docs/introduction/branching)).

Create a branch from the CLI:

```bash
neon branches create --name migration-test
neon connection-string migration-test
```

Without `--parent`, the branch comes from your project's default branch (`production` for projects created in the Console, `main` for projects created with the CLI or API). Run your migration against the connection string the CLI prints. If it works, apply the same migration to production. If it breaks something, delete the branch and try again:

```bash
neon branches delete migration-test
```

Branches included per project: 10 on the Free plan and Launch plan, 25 on the Scale plan. On paid plans, extra branches cost $1.50/branch-month, metered hourly (about $0.002/hour), so a migration branch that lives for a few hours adds less than a cent in branch fees. The Free plan doesn't allow extra branches. See [Plans](/docs/introduction/plans#extra-branches).

## Compared with dump and restore

A `pg_dump` and `pg_restore` of a large database takes time proportional to its size, and the copy takes full storage. A branch is ready in seconds whatever the database size, and you pay only for the data the migration writes. To run this on every pull request, use the [Neon GitHub Actions](/docs/guides/branching-github-actions) to create a branch per PR and delete it when the PR closes.

<Admonition type="tip">
If the test environment can't see production data, use a [schema-only branch](/docs/guides/branching-schema-only) (beta). It copies the schema without any rows, and you load test or anonymized data yourself.
</Admonition>

## How other providers compare

| Capability                | Neon                              | Supabase                                                                                                                    | Aurora (Postgres)                                                                                                                                                            | RDS for Postgres                                      |
| ------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Test copy with prod data  | Yes, a copy-on-write branch       | Preview branches start from migrations and `seed.sql`; dashboard branches (public alpha) can copy data with the PITR add-on | Yes, a copy-on-write [clone](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) (up to 15 per source before clones become full copies) | Restore a snapshot or point in time to a new instance |
| What you get              | A branch in the same project      | A separate branch environment                                                                                               | A new cluster                                                                                                                                                                | A new DB instance                                     |
| Storage cost for the copy | Only data written after branching | Storage for the seeded data                                                                                                 | Only pages changed after cloning                                                                                                                                             | Full storage of the restored instance                 |

Supabase preview branches [start from migrations and seed data](https://supabase.com/docs/guides/deployment/branching) and don't copy production data, so testing against real data shapes means maintaining seed files. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) have an **Include data** option that copies production data, and it requires the PITR add-on. Aurora clones share storage with the source much like Neon branches, but each clone is a separate cluster. RDS for Postgres has no cloning; you [restore to a point in time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) or from a snapshot, which creates a new DB instance with its own storage bill.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Try branching on Neon" description="Sign up for the Free plan and create your first branch in under a minute." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
