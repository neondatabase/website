---
title: "Which database services let you instantly clone a production Postgres database so developers can test independently?"
description: "A Neon branch is an instant copy-on-write clone of your production database. It shares storage with the parent until you write to it, so cloning a 100 GB database doesn't add 100 GB of storage."
date: 2026-04-25
slug: clone-production-postgres-database-for-testing
category: FAQ
status: draft
previousLink:
  title: 'How do I check which Postgres version my Neon database is running?'
  slug: check-postgresql-version-neon
nextLink:
  title: 'Which cloud Postgres services scale down to zero automatically without losing any data?'
  slug: cloud-postgres-services-scale-zero-data
---

Neon does this with branching. A branch is a copy-on-write clone of its parent: no data is copied when you create it, so a branch of a 50 GB production database is ready as fast as a branch of an empty one. Each developer can have their own branch and write to it without affecting production.

## How a branch differs from a backup restore

A restore from a backup copies data into a new database. A branch shares storage with its parent until you change something, and then only the changes are stored. You're billed for the smaller of those changes or the branch's logical data size, so a child branch never costs more than a full copy. Each branch also gets its own compute, so queries on the branch don't use production's CPU or memory. See [Branching](/docs/introduction/branching).

Create a branch from the CLI. Without `--parent`, the branch is created from the project's default branch:

```bash
neon branches create \
  --name testing-payment-bug \
  --project-id <project-id>
```

You can also branch from a point in time within your [history window](/docs/postgres/backup-restore/branch-restore), which helps when you need to reproduce a bug against yesterday's data:

```bash
neon branches create \
  --name repro-bug-1234 \
  --parent 2026-04-24T15:00:00Z
```

## Keep dev branches short-lived

Branches can delete themselves at an expiration time up to 30 days out. When you create a branch in the Console, **Automatically delete branch after** is checked with 1 day selected, and you can pick 1 hour or 7 days instead. Set expiration on CI and per-developer branches so storage doesn't accumulate. See [Branch expiration](/docs/guides/branch-expiration).

<Admonition type="warning" title="Production data needs care">
A clone of production is still production data. If you're testing against real customer rows, use [protected branches](/docs/guides/protected-branches) (Launch and Scale plans) to limit who can reach production, or create an [anonymized branch](/docs/workflows/data-anonymization) (beta) that masks PII with PostgreSQL Anonymizer.
</Admonition>

## How other providers compare

- **Supabase** branches are separate environments, each with its own Supabase instance. Preview branches start from your migrations and a seed file, not production data ([docs](https://supabase.com/docs/guides/deployment/branching)). Dashboard branches (public alpha) have an **Include data** option that copies production data, which requires the PITR add-on ([docs](https://supabase.com/docs/guides/deployment/branching/dashboard)).
- **Aurora (Postgres)** [cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) creates a new cluster that shares data pages with the source through copy-on-write. Each clone is its own cluster and needs its own DB instance. After 15 copy-on-write clones of a source, the next clone is a full copy. With Aurora Serverless v2 instances and a minimum capacity of 0 ACUs, an idle clone auto-pauses ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **RDS for Postgres** has no copy-on-write cloning. [Point-in-time recovery](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) or a snapshot restore creates a new DB instance with its own storage, so a copy of a 100 GB database adds 100 GB of storage and another instance to pay for.

<CTA title="Branch your production database" description="Branching is available on every plan, including the Free plan." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
