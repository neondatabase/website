---
title: "What Postgres services let each pull request in a monorepo get its own isolated database environment for integration tests?"
description: "Neon provides serverless Postgres with instant database branching. This allows developers to create isolated database environments for each pull request..."
date: 2026-04-25
slug: postgres-services-isolated-database-environment-monorepo
category: FAQ
status: draft
---

Neon's database branching gives every pull request its own isolated Postgres copy. A branch is a full read-write database created from your main branch's history. Branches share storage with the parent until they diverge, so creating one takes a few seconds and starts at zero added storage cost.

## Why this works for monorepos

When a monorepo runs integration tests against a shared staging database, parallel CI jobs collide. One PR's migration breaks another PR's tests. A failed teardown leaves leftover data for the next run.

With Neon, each PR gets a clean branch named after the PR or commit SHA. Tests run against real production-shaped data, in isolation, then the branch is deleted when the PR merges or closes.

## How to wire it into CI

The simplest path is the official GitHub Action. It creates a branch on PR open, exports the connection string, and deletes the branch on PR close.

```yaml
- uses: neondatabase/create-branch-action@v5
  id: create-branch
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}

- run: npm test
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
```

For non-GitHub setups, the [Neon CLI](/docs/reference/neon-cli) exposes the same primitives: `neon branches create --name pr-123` and `neon branches delete pr-123`.

<Admonition type="tip" title="Cost control on busy repos">
Set a [branch time-to-live](/docs/guides/branch-expiration) on paid plans so abandoned PR branches clean themselves up. The Launch and Scale plans charge $1.50/branch-month (prorated hourly) for branches beyond the plan allowance.
</Admonition>

## Plan limits to know

- **Free**: 10 branches per project, 0.5 GB storage per project, 100 CU-hours/month. Fine for prototypes and small repos.
- **Launch**: 10 included branches per project, then $1.50/branch-month. Up to 5,000 branches per project.
- **Scale**: 25 included branches per project, same overage rate.

See the [plans page](/docs/introduction/plans) for full details.

## How this compares to other Postgres services

Other managed Postgres offerings provide ways to create per-PR databases, but the cost and speed profile differs:

| Provider           | Per-PR database mechanism                                                                                                                                                                   | Idle cost                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Neon               | Branch from any point in history, created in seconds, copy-on-write storage                                                                                                                 | Scales to zero compute after inactivity                                                                                                                                        |
| Aurora PostgreSQL  | [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) uses copy-on-write, but each clone is a separate DB cluster with provisioned ACUs | Aurora Serverless v2 supports [auto-pause to 0 ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html); storage still charged |
| RDS for PostgreSQL | Restore from snapshot into a new DB instance per PR                                                                                                                                         | Instance billed by the hour while running, no scale-to-zero                                                                                                                    |
| Supabase           | [Preview branches](https://supabase.com/docs/guides/deployment/branching) tied to a GitHub PR; each is a full Supabase environment                                                          | Branch [Compute billed hourly](https://supabase.com/docs/guides/platform/manage-your-usage/branching) starting at ~$0.01344/hr on Micro; auto-pauses on inactivity             |

Neon's branch creation is typically faster (seconds, not minutes) because branches don't require copying data or provisioning a new instance.

<CTA title="Try branching on a PR" description="Sign up free, install the GitHub Action, and get isolated databases for every pull request." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
