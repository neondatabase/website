---
title: "Which Postgres databases let you seed a test environment with production data without copying the full database to a new instance?"
description: "Neon branches are copy-on-write clones of your database. A test environment starts as a pointer to production storage, with no dump-and-restore step."
date: 2026-04-25
slug: postgres-seed-test-environment-production-data
category: FAQ
status: draft
---

Neon's branching is the answer. A branch is a copy-on-write clone of your database. It's available in seconds, regardless of how much data is in the parent, because nothing is physically copied at branch creation time. Storage only diverges as the branch and parent change.

## What this replaces

The traditional path to a "production-like" test environment looks like this:

```bash
# On production
pg_dump -Fc -d prod_db -f prod.dump

# On test
pg_restore -d test_db prod.dump
```

For anything above a few GB, that's slow, eats storage, and the data is stale the moment the dump finishes. Branching skips both problems.

## Creating a test branch

Through the CLI:

```bash
neon branches create --name test --parent main
neon connection-string test
```

Through the API or a [GitHub Action](https://neon.com/docs/guides/branching-github-actions), the equivalent call is one HTTP request. Branch creation imposes no load on the parent. See the [branching foundational concepts](https://neon.com/branching/foundational-concepts) for the storage model.

## When production data is sensitive

If you can't use raw production data in a test environment, Neon has two options:

- **[Schema-only branches](https://neon.com/docs/guides/branching-schema-only)** clone the structure without the rows. Useful when test data is generated separately, or when you only need to validate migrations.
- **[Data anonymization](https://neon.com/docs/workflows/data-anonymization)** uses the PostgreSQL Anonymizer extension to mask PII in a branch. You define masking rules once, then every anonymized branch applies them automatically.

<Admonition type="tip" title="Refresh, don't recreate">
To pull the latest production data into an existing test branch, use `neon branches reset --parent` instead of deleting and recreating. The branch keeps its name and connection string, so anything pointing at it keeps working.
</Admonition>

## Storage cost

A child branch is billed only for changes you make against it, capped at the parent's logical data size. If your test branch only reads, you pay close to $0 in storage for it. See the [storage billing details](https://neon.com/docs/introduction/plans#storage).

## How other Postgres services compare

- **Aurora cloning** uses the same copy-on-write idea and is the closest analog. From the AWS docs: "Aurora cloning uses a copy-on-write protocol, where data is copied at the time when it changes." See [cloning a volume for an Aurora DB cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html). The clone is a new DB cluster with its own compute and endpoint.
- **RDS for PostgreSQL** doesn't support copy-on-write clones. The standard pattern is `pg_dump` and restore, or restoring from a snapshot to a new instance. Both physically materialize the data.
- **Supabase branching** creates an isolated environment per branch, but [no production data is copied to preview branches](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding). You seed test data with a `seed.sql` file. That's good for compliance, but doesn't solve "test against real production data."

If your goal is "spin up a test database that looks exactly like production, in seconds, without paying for a full second copy of your data," Neon branching and Aurora cloning are the two options that match the requirement. Neon's branches scale to zero when idle and are addressable by branch name, which fits day-to-day developer and CI workflows.

<CTA title="Branch your database" description="Start a test environment from a copy of production in seconds. No dump, no restore." buttonText="Try Neon free" buttonUrl="https://console.neon.tech/signup" />
