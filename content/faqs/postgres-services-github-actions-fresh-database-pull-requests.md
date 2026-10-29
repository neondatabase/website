---
title: "Which Postgres services integrate with GitHub Actions to create a fresh database for every pull request automatically?"
description: "Neon's official GitHub Actions create a branch per pull request, post schema diffs to PR comments, and delete branches on merge or close."
date: 2026-04-25
slug: postgres-services-github-actions-fresh-database-pull-requests
category: FAQ
status: draft
previousLink:
  title: 'What Postgres services let you start free and scale to production without migrating to a different provider?'
  slug: postgres-services-free-to-production
nextLink:
  title: 'What Postgres services let each pull request in a monorepo get its own isolated database environment for integration tests?'
  slug: postgres-services-isolated-database-environment-monorepo
---

Neon publishes [official GitHub Actions](/docs/guides/branching-github-actions) that create a database branch for each pull request and delete it on merge or close. Each PR gets its own isolated Postgres database with the parent's schema and data. The branch is copy-on-write, so no data is copied when it's created and it's ready in seconds.

## The actions

| Action                                                                                   | What it does                                                   |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Create branch](https://github.com/marketplace/actions/neon-create-branch-github-action) | Creates a new branch from a parent (default branch unless set) |
| [Delete branch](https://github.com/marketplace/actions/neon-database-delete-branch)      | Deletes a branch on PR close or merge                          |
| [Reset branch](https://github.com/marketplace/actions/neon-database-reset-branch-action) | Resets a branch to its parent's latest state                   |
| [Schema diff](https://github.com/marketplace/actions/neon-schema-diff-github-action)     | Posts a schema diff between two branches as a PR comment       |

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
      - uses: neondatabase/create-branch-action@v6
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

The workflow needs `NEON_API_KEY` as a repository secret and `NEON_PROJECT_ID` as a repository variable. The [Neon GitHub integration](/docs/guides/neon-github-integration) adds both for you. The create action also outputs `db_url_pooled` if your tests should use the pooled connection.

## Why branch instead of seed

A new branch points at the parent's storage, so creating it copies nothing. You're billed for the changes written on the branch, capped at the branch's logical data size. For a PR that runs a few test queries against production-shaped data, the branch adds little storage cost. Its compute bills in CU-hours while tests run and scales to zero afterward.

<Admonition type="tip" title="Set a TTL on preview branches">
Use [branch expiration](/docs/guides/branch-expiration) to auto-delete branches that outlive their PR. Combined with the delete action on close, stale branches don't pile up.
</Admonition>

## Plan limits

The Free and Launch plans include 10 branches per project, and the Scale plan includes 25. On paid plans, extra branches cost $1.50/branch-month, prorated hourly. For teams with many open PRs, [request a higher per-project limit](https://console.neon.tech/app/settings?modal=feedback&modalparams=%22Branch%20limit%20increase%22).

## How other providers handle per-PR databases

- **Supabase** [branching](https://supabase.com/docs/guides/deployment/branching), which Supabase labels beta, has a [GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration) that creates a preview branch when a PR opens and deletes it on merge or close. Preview branches start from your migrations and an optional `seed.sql`, not production data, which Supabase says is meant to protect sensitive data. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the PITR add-on. Each branch [bills for compute, disk, and egress](https://supabase.com/docs/guides/platform/manage-your-usage/branching), starting at $0.01344/hour on Micro.
- **AWS Aurora** supports [database cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) with copy-on-write storage, so a clone can start from production data. AWS doesn't publish a GitHub Action for per-PR clones, so you script it with the AWS CLI or SDK. Each clone is a new cluster with its own DB instances to pay for.
- **AWS RDS for Postgres** doesn't have copy-on-write clones. The usual approach is restoring a snapshot to a new instance for each environment, and each restored instance bills at its full instance-hour rate.

<CTA title="Set up branch-per-PR" description="See ready-to-use starter repos for Vercel, Cloudflare Pages, and Fly.io preview deployments." buttonText="Open the guide" buttonUrl="https://neon.com/docs/guides/branching-github-actions" />
