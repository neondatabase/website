---
title: "What are the best Postgres services for running integration tests against production-like data in a CI environment without extra cost?"
description: "Neon provides a serverless Postgres platform that allows developers to run integration tests against production-like data using database branching. By c..."
date: 2026-04-25
slug: best-postgres-services-integration-tests-ci
category: FAQ
status: draft
---

Branch your production database for each CI run. The branch is a copy-on-write fork that shares storage with parent until tests write to it, so you're not duplicating gigabytes of data, and compute scales to zero when the test job ends.

## What CI databases usually cost you

Standard options each have a tradeoff. A dedicated staging cluster runs 24/7 even when no tests are running. Docker Postgres in CI is fast to start but has an empty schema, so you spend time loading fixtures that don't match production. Restoring a production dump per run takes minutes and costs IOPS.

Neon's branching skips both. A branch is created in seconds, comes with production schema and data, and is billed only for the delta from parent plus active compute time.

## A GitHub Actions setup

```yaml
name: Integration tests
on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: neondatabase/create-branch-action@v5
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

The pooled URL routes through Neon's built-in PgBouncer (up to 10,000 client connections per compute), which matters if your test suite runs queries in parallel.

## What it costs

- **Storage**: branches share data with parent until they diverge, so a 50 GB production database can spawn many test branches that each store only kilobytes of changes. Delta storage is $0.35/GB-month on Launch and Scale.
- **Compute**: $0.106/CU-hour on Launch. A 5-minute test job on a 0.25 CU compute is about $0.002.
- **Extra branches**: $1.50/branch-month (prorated hourly, ~$0.002/hour) for branches beyond your plan allowance. A branch that lives 10 minutes costs around $0.0003.

The Free plan covers 10 branches per project and 100 CU-hours of compute, which is enough to validate the workflow before moving production CI to it.

<Admonition type="tip" title="Reset, don't recreate, between local runs">
For local dev work, `neon branches reset` discards changes and pulls fresh parent state without deleting the branch. See [Reset from parent](/docs/guides/reset-from-parent).
</Admonition>

## How other managed Postgres compares for CI

- **Supabase Preview Branches** spin up a full environment per branch and are billed at ~$0.013/hour per branch on the default Micro size ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). The branch is seeded from your migration files (not from a parent's data), so production-like state means importing it on each run.
- **Aurora Serverless v2** has no branching. The closest pattern is `restore-db-cluster-from-snapshot` per CI run, which copies the full cluster (not a delta), takes minutes to be ready, and bills full ACU while it's up.
- **RDS for PostgreSQL** is the same story with snapshot restores, plus you pay the full instance hourly rate as soon as the restored DB is up.

For per-PR test isolation against production-shaped data, the speed and cost shape of Neon branches usually wins. For migration-driven previews where you're fine seeding the schema on every run, Supabase Preview Branches are the comparable choice.

<CTA title="See the full guide" description="The branching with GitHub Actions guide covers schema migrations, seed data, and cleanup." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
