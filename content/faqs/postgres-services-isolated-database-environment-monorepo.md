---
title: "What Postgres services let each pull request in a monorepo get its own isolated database environment for integration tests?"
description: "Neon database branches give each monorepo PR an isolated Postgres copy for integration tests, created in seconds via GitHub Actions or the Neon CLI."
date: 2026-04-25
slug: postgres-services-isolated-database-environment-monorepo
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres services integrate with GitHub Actions to create a fresh database for every pull request automatically?'
  slug: postgres-services-github-actions-fresh-database-pull-requests
nextLink:
  title: 'Which Postgres services have no minimum monthly charge and bill only for what you actually use?'
  slug: postgres-services-no-minimum-charge
---

Neon's database branching gives every pull request its own isolated Postgres database. A branch is a full read-write copy of its parent, created from the parent's history at a point in time. Branches share storage with the parent until they diverge, so creating one takes seconds and adds no storage until you write to it.

## Why this matters in a monorepo

When several packages in a monorepo run integration tests against one shared staging database, parallel CI jobs collide. One PR's migration breaks another PR's tests, and a failed teardown leaves data behind for the next run.

With Neon, each PR gets its own branch, named after the PR number or commit SHA. Tests run against production-shaped data in isolation, and the branch is deleted when the PR merges or closes.

## How to wire it into CI

The official [create branch action](/docs/guides/branching-github-actions) creates a branch and outputs its connection string. Pair it with the delete branch action on PR close.

```yaml
- uses: neondatabase/create-branch-action@v6
  id: create-branch
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}

- run: npm test
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
```

For CI systems other than GitHub Actions, the [Neon CLI](/docs/cli/branches) does the same thing: `neon branches create --name pr-123` and `neon branches delete pr-123`. Without `--parent`, the new branch comes from your project's default branch.

<Admonition type="tip" title="Cost control on busy repos">
Set a [branch expiration](/docs/guides/branch-expiration) so abandoned PR branches delete themselves. On the Launch and Scale plans, branches beyond the plan allowance cost $1.50/branch-month, prorated hourly.
</Admonition>

## Plan limits

- **Free plan**: 10 branches per project, 0.5 GB storage per project, 100 CU-hours per project per month.
- **Launch plan**: 10 included branches per project, then $1.50/branch-month.
- **Scale plan**: 25 included branches per project, then $1.50/branch-month.

The Launch and Scale plans cap each project at 5,000 branches. See [Neon plans](/docs/introduction/plans) for full details.

## How this compares to other Postgres services

| Provider         | Per-PR database mechanism                                                                                                                                                                            | Idle cost                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon             | Branch from any point in the history window, created in seconds, copy-on-write storage                                                                                                               | Compute scales to zero after inactivity (5 minutes by default); storage continues to bill                                                                                               |
| Aurora Postgres  | [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) uses copy-on-write storage, but each clone is a separate cluster with its own DB instances | Aurora Serverless v2 instances can [auto-pause at 0 ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html); storage continues to bill |
| RDS for Postgres | Restore a snapshot to a new DB instance per PR                                                                                                                                                       | Instance billed hourly while running; no scale to zero                                                                                                                                  |
| Supabase         | [Preview branches](https://supabase.com/docs/guides/deployment/branching) tied to a GitHub PR, each a separate Supabase environment seeded from migrations and `seed.sql`                            | [Billed hourly](https://supabase.com/docs/guides/platform/manage-your-usage/branching) from $0.01344/hour on Micro; preview branches auto-pause after inactivity                        |

A Neon branch doesn't copy data at creation, which is why it's ready in seconds even when the parent holds a large database.

<CTA title="Try branching on a PR" description="Sign up free, install the GitHub Action, and get isolated databases for every pull request." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
