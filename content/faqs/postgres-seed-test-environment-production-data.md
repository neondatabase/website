---
title: "Which Postgres databases let you seed a test environment with production data without copying the full database to a new instance?"
description: "Lakebase Postgres branches are copy-on-write clones of your database. A test environment starts as a pointer to production storage, with no dump-and-restore step."
date: 2026-04-25
slug: postgres-seed-test-environment-production-data
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres providers allow testing schema changes without affecting production data?'
  slug: postgres-providers-test-schema-changes
nextLink:
  title: 'What Postgres works best for serverless functions without connection issues?'
  slug: postgres-serverless-functions-connection-issues
---

Lakebase Postgres branches do this. A branch is a copy-on-write clone of your database, available in seconds regardless of how much data the parent holds, because nothing is physically copied when the branch is created. Storage diverges only as the branch or its parent changes.

## What this replaces

The traditional path to a production-like test environment looks like this:

```bash
# On production
pg_dump -Fc -d prod_db -f prod.dump

# On test
pg_restore -d test_db prod.dump
```

The dump and restore take longer as the database grows, the test copy needs as much storage as production, and the data starts aging as soon as the dump finishes. A branch skips the copy, shares unchanged storage with its parent, and can be reset to the parent's latest state in one command.

## Creating a test branch

Through the CLI (use your default branch name as the parent: `production` for Console-created projects, `main` for projects created with the CLI or API):

```bash
neon branches create --name test --parent production
neon connection-string test
```

Through the [API](/docs/reference/api) or a [GitHub Action](/docs/guides/branching-github-actions), it's one request. Creating a branch [adds no load to the parent](/docs/introduction/branching). See [branching foundational concepts](https://neon.com/branching/foundational-concepts) for the storage model.

## When production data is sensitive

If you can't use raw production data in a test environment, Neon has two options:

- **[Schema-only branches](/docs/guides/branching-schema-only)** copy the structure without any rows. Use them when you generate test data separately or only need to validate migrations.
- **[Anonymized branches](/docs/workflows/data-anonymization)** (beta) use the PostgreSQL Anonymizer extension to replace PII in the branch copy with masked values, and the parent's data stays unchanged. You set masking rules per branch in the Console, through the API, or with SQL `SECURITY LABEL` commands.

<Admonition type="tip" title="Refresh, don't recreate">
To pull the latest production data into an existing test branch, run `neon branches reset test --parent` instead of deleting and recreating it. The reset discards changes made on the branch, and the branch keeps its name and connection string, so anything pointing at it keeps working.
</Admonition>

## Storage cost

A child branch is billed for the smaller of the changes made on it or the logical data size. A branch your tests only read from adds little or no storage. See the [storage billing details](/docs/introduction/plans#storage).

## How other Postgres services compare

- **Aurora cloning** uses the same copy-on-write approach. A [clone](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) initially shares the source's data pages, and Aurora allocates new storage only when either side changes data. The clone is a new DB cluster with its own instances and endpoint. After 15 copy-on-write clones of a source, the next one is a full copy.
- **Xata** [branches](https://xata.io/docs/core-concepts/branching) use copy-on-write storage snapshots and start with the parent's schema and data. Each running branch has its own compute instance, billed hourly.
- **RDS for Postgres** has no copy-on-write clone. The standard patterns are `pg_dump` and restore, or restoring a snapshot to a new instance. Both materialize the full dataset.
- **Supabase** preview branches from the GitHub integration [start without production data](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding) and are seeded from `seed.sql`. Dashboard branches (public alpha) can [copy production data](https://supabase.com/docs/guides/deployment/branching/dashboard) if the project has the PITR add-on. That branch uses a larger disk and matches the project's compute size, which raises its cost.

On Neon, test branches are addressed by name in the CLI and API, and their compute scales to zero when idle.

<CTA title="Branch your database" description="Start a test environment from a copy of production in seconds. No dump, no restore." buttonText="Try Neon free" buttonUrl="https://console.neon.tech/signup" />
