---
title: "What are the best Postgres services for running integration tests against production-like data in a CI environment without extra cost?"
description: "Run integration tests against production-like data by creating a Neon branch per CI run. Copy-on-write branches share storage with the parent until tests write to them."
date: 2026-04-25
slug: best-postgres-services-integration-tests-ci
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres services for backend teams that want to eliminate the shared staging database entirely?'
  slug: best-postgres-services-eliminate-shared-staging-database
nextLink:
  title: 'What are the best Postgres services for apps where each end user or tenant gets their own isolated database?'
  slug: best-postgres-services-isolated-database-tenants
---

Neon. Branch your production database for each CI run. The branch is a copy-on-write fork that shares storage with its parent until tests write to it, so you don't duplicate gigabytes of data, and you delete it (or its compute suspends) when the test job ends.

## What CI databases usually cost you

The common approaches each give something up. A dedicated staging cluster runs 24/7 even when no tests are running. Postgres in a Docker container starts quickly but starts empty, so you spend time loading fixtures that don't match production. Restoring a production dump on every run is slow, and it gets slower as the database grows.

A Neon branch is created in seconds, starts with your production schema and data, and bills only for the changes the tests make plus active compute time.

## A GitHub Actions setup

```yaml
name: Integration tests
on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: neondatabase/create-branch-action@v6
        id: branch
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: ci-${{ github.run_id }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - run: npm ci && npm run test:integration
        env:
          DATABASE_URL: ${{ steps.branch.outputs.db_url_pooled }}

      - uses: neondatabase/delete-branch-action@v3
        if: always()
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: ci-${{ github.run_id }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

The pooled URL routes through Neon's built-in PgBouncer, which accepts up to 10,000 client connections per compute. That matters if your test suite runs queries in parallel.

If production contains personal data you don't want in CI, you can mask it on the branch. See [Data anonymization](/docs/workflows/data-anonymization).

## What it costs

- **Storage**: a branch shares data with its parent until it diverges, so a 50 GB production database can back many test branches, each storing only what its tests write. Branch storage is $0.35/GB-month on the Launch and Scale plans.
- **Compute**: $0.106/CU-hour on the Launch plan. A 5-minute test job on a 0.25 CU compute costs about $0.002.
- **Extra branches**: $1.50/branch-month (metered hourly, about $0.002/hour) for branches beyond your plan's allowance. A branch that lives 10 minutes costs about $0.0003.

The Free plan includes 10 branches and 100 CU-hours of compute per project each month, which is enough to try the workflow before you move production CI to it.

<Admonition type="tip" title="Reset, don't recreate, between local runs">
For local development, `neon branches reset <branch> --parent` discards your changes and pulls the parent's latest state without deleting the branch. See [Reset from parent](/docs/guides/reset-from-parent).
</Admonition>

## How other managed Postgres compares for CI

- **Supabase** [preview branches](https://supabase.com/docs/guides/deployment/branching) spin up a full environment per branch, billed from $0.01344/hour on the default Micro size ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). Preview branches start from your migrations and seed data, so production-like data means loading it yourself. [Dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the PITR add-on.
- **Aurora Serverless v2** supports [cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html), which creates a copy-on-write clone of a cluster. Each clone is a separate cluster, and you add a DB instance to it before tests can connect. That instance bills for the capacity it uses until you delete it.
- **RDS for Postgres** has no cloning. You restore a snapshot per CI run, which creates a full copy on a new instance, and you pay the instance's hourly rate while it runs.

For per-PR test isolation against production-shaped data, Neon branches are quick to create and cost little per run. If you're fine seeding the schema on every run, Supabase preview branches are the comparable option.

<CTA title="See the full guide" description="The branching with GitHub Actions guide covers schema migrations, seed data, and cleanup." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
