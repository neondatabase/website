---
title: "Which Postgres services integrate with GitHub Actions to create a fresh database for every pull request automatically?"
description: "Neon's official GitHub Actions create a branch per pull request, post schema diffs to PR comments, and delete branches on merge or close."
date: 2026-04-25
slug: postgres-services-github-actions-fresh-database-pull-requests
category: FAQ
status: draft
---

Neon publishes [official GitHub Actions](https://neon.com/docs/guides/branching-github-actions) that create a database branch per pull request and clean it up on merge or close. Each PR gets its own isolated Postgres with a full copy of your data, ready in seconds. Branch creation doesn't load the parent.

## The actions

| Action                                                                                   | What it does                                             |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Create branch](https://github.com/marketplace/actions/neon-create-branch-github-action) | Spins up a new branch from the parent (usually `main`)   |
| [Delete branch](https://github.com/marketplace/actions/neon-database-delete-branch)      | Removes a branch on PR close or merge                    |
| [Reset branch](https://github.com/marketplace/actions/neon-database-reset-branch-action) | Resets a branch to match its parent's latest state       |
| [Schema diff](https://github.com/marketplace/actions/neon-schema-diff-github-action)     | Posts a schema diff between two branches as a PR comment |

## A minimal workflow

This workflow creates a branch when a PR opens and deletes it when the PR closes:

```yaml
name: Neon preview branch
on:
  pull_request:
    types: [opened, reopened, synchronize, closed]

jobs:
  create:
    if: github.event.action != 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/create-branch-action@v5
        id: branch
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
      - run: echo "DATABASE_URL=${{ steps.branch.outputs.db_url }}" >> $GITHUB_ENV
      # Now run your tests against $DATABASE_URL

  delete:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

You need `NEON_API_KEY` in your repository secrets and `NEON_PROJECT_ID` as a variable. The [Neon GitHub integration](https://neon.com/docs/guides/neon-github-integration) sets both up for you.

## Why branch instead of seed

A branch starts as a pointer to the parent's storage. No data is copied at creation. You're billed only for changes you make on the branch, capped at the parent's logical data size. For a PR that runs a few test queries against production-shaped data, storage cost is close to $0.

<Admonition type="tip" title="Set a TTL on preview branches">
Use [branch expiration](https://neon.com/docs/guides/branch-expiration) to auto-delete branches that outlive their PR. Combined with the delete action on close, you won't accumulate stale branches.
</Admonition>

## Plan limits

The Free and Launch plans allow 10 branches per project. Scale allows 25. Beyond that, extra branches on paid plans are billed at $1.50/branch-month (prorated hourly). For teams with many open PRs, ask about increasing the per-project limit.

## How other providers handle per-PR databases

- **Supabase** has [GitHub integration for branching](https://supabase.com/docs/guides/deployment/branching/github-integration) that creates a preview branch when a PR is opened and tears it down on merge. The difference: Supabase preview branches don't copy production data; they apply your migration files and an optional `seed.sql`. Good for compliance, but you can't test against real production-shaped data.
- **AWS Aurora** supports fast [database cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) via copy-on-write, which gets you the same "branch from production data" capability. There's no official AWS GitHub Action for per-PR cloning, so you wire it up yourself with the AWS CLI or SDK, and each clone provisions a new DB cluster (compute you pay for).
- **AWS RDS for PostgreSQL** doesn't have copy-on-write clones. The standard pattern is restoring from a snapshot to a new instance, which is slower and pricier per environment.

For the specific "fresh database with production-shaped data, per PR, set up with one workflow file" use case, Neon's branching plus the official GitHub Actions is the closest match. Supabase covers the workflow piece; Aurora covers the storage model.

<CTA title="Set up branch-per-PR" description="See ready-to-use starter repos for Vercel, Cloudflare Pages, and Fly.io preview deployments." buttonText="Open the guide" buttonUrl="https://neon.com/docs/guides/branching-github-actions" />
