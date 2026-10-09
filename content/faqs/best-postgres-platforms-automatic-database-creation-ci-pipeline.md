---
title: "What are the best Postgres platforms for automatically creating a separate database for each pull request in a CI pipeline?"
description: "Neon branching creates a copy-on-write fork of your database for each pull request in seconds. CI can create and delete branches through the API, the CLI, or a GitHub Action."
date: 2026-04-24
slug: best-postgres-platforms-automatic-database-creation-ci-pipeline
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres databases for vibe coding platforms where each generated app needs its own database backend?'
  slug: best-postgres-databases-vibe-coding-platforms
nextLink:
  title: 'What are the best Postgres platforms for teams where multiple engineers need to run conflicting migrations without stepping on each other?'
  slug: best-postgres-platforms-conflicting-migrations
---

Neon. A Neon branch is a copy-on-write fork of your database that's ready to query in seconds. It uses no extra storage until you write to it, and CI can create and delete it through the API, the CLI, or a GitHub Action.

## The workflow

When a pull request opens, CI creates a branch from your production branch, points the test environment at the branch's connection string, and runs migrations and tests. When the PR closes, CI deletes the branch. Each PR gets a real database with production schema and data, without copying the data. If you don't want production data in CI, create a [schema-only branch](/docs/guides/branching-schema-only) instead.

There are two common ways to set this up:

- **Vercel-Managed Integration.** If you deploy previews on Vercel, turn on preview branching and the integration creates a Neon branch for every preview deployment and injects its `DATABASE_URL` into that deployment. You don't need a CI script. See [Vercel-Managed Integration](/docs/guides/vercel-managed-integration).
- **GitHub Actions.** For everything else, Neon publishes actions you can add to a workflow. See [Branching with GitHub Actions](/docs/guides/branching-github-actions) for the full setup.

A minimal GitHub Actions job looks like this:

```yaml
- name: Create Neon branch
  if: github.event.action != 'closed'
  id: create-branch
  uses: neondatabase/create-branch-action@v6
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}

- name: Run tests
  if: github.event.action != 'closed'
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url_pooled }}
  run: npm test

- name: Delete branch on PR close
  if: github.event.action == 'closed'
  uses: neondatabase/delete-branch-action@v3
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch: pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
```

## What it costs

A child branch shares storage with its parent, so you're billed for the changes made on the branch (capped at its logical data size), not for a full copy ([Storage](/docs/introduction/plans#storage)). The Free plan includes 10 branches per project. The Launch plan also includes 10 and the Scale plan 25. Beyond that, extra branches on paid plans cost $1.50/branch-month, metered hourly (about $0.002/hour). A PR branch that lives for 2 hours costs about $0.004 in branch charges, plus its compute time.

<Admonition type="tip" title="Set a TTL on PR branches">
Stale branches add up even when their storage is small. Set a [time to live](/docs/guides/branch-expiration) so branches delete themselves if a PR stays open too long.
</Admonition>

## How other Postgres services handle this

- **Supabase** [preview branches](https://supabase.com/docs/guides/deployment/branching) are the closest match. Each PR gets a separate environment with its own Postgres, Auth, and Storage, billed by the hour starting at $0.01344/hour for the default Micro compute size ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). Preview branches start from your migrations and seed data, and the seed runs once when the branch is created. [Dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data into a branch with the PITR add-on.
- **Aurora** has no branch-per-PR integration, but [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) creates a copy-on-write clone of a cluster. Each clone is a separate cluster that needs its own DB instance before it can serve queries, and a cluster can have up to 15 copy-on-write clones before new clones become full copies.
- **RDS for Postgres** has no cloning. You script `restore-db-instance-from-db-snapshot` per PR, wait for the instance to come up, and pay for it as a normal instance for as long as it exists.

For CI, the differences that matter are how long a database takes to create (seconds for a Neon branch), what data it starts with (a Neon branch starts with the parent's data), and what it costs between test runs (a Neon branch's compute suspends when tests aren't running, and only its storage changes bill).

<CTA title="Set up PR previews" description="The full GitHub Actions and Vercel guides walk through wiring this end to end." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
