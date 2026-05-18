---
title: "What are the best Postgres platforms for automatically creating a separate database for each pull request in a CI pipeline?"
description: "Neon is a cloud-native, serverless Postgres platform. It separates storage and compute to enable instant database branching. This architecture enables d..."
date: 2026-04-24
slug: best-postgres-platforms-automatic-database-creation-ci-pipeline
category: FAQ
status: draft
---

Neon's branching model is built for this. A Neon branch is a copy-on-write fork of your database that's ready to query in seconds, costs nothing for storage until you change something, and can be created and torn down through the API or a GitHub Action.

## The shape of the workflow

When a pull request opens, your CI creates a branch off `main`, points your test environment at the branch's connection string, runs migrations and tests, then deletes the branch when the PR closes. Each PR gets a real database with production schema and (if you want) production data, with no copying cost.

The two common ways to wire this up:

- **Vercel-Managed Integration.** If you're deploying previews on Vercel, the integration creates a Neon branch for every preview deployment automatically and exposes a `DATABASE_URL` to the preview. No CI script required. See [Vercel-Managed Integration](/docs/guides/vercel-managed-integration).
- **GitHub Actions.** For everything else, Neon publishes actions you can drop into a workflow. See [Branching with GitHub Actions](/docs/guides/branching-github-actions) for the full setup.

A minimal GitHub Actions job looks like this:

```yaml
- name: Create Neon branch
  id: create-branch
  uses: neondatabase/create-branch-action@v5
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}

- name: Run tests
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

Branches share storage with their parent until they diverge, so you're billed for the delta, not a full copy. The Free plan covers 10 branches per project. On Launch and Scale, extra branches beyond the included allowance are $1.50/branch-month (about $0.002/hour), so a PR branch that lives for 2 hours costs around $0.004 in branch overhead plus compute time.

<Admonition type="tip" title="Set a TTL on PR branches">
Even with cheap branch storage, stale branches add up. Set a [time to live](/docs/guides/branch-expiration) so branches auto-delete if a PR sits open too long.
</Admonition>

## How other Postgres platforms handle this

- **Supabase Preview Branches** are the closest analog. Each PR gets a separate environment with its own Postgres, auth, and storage, billed by the hour at around $0.013/hour for the default Micro compute size ([Supabase branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). The branch is migration-driven, not a copy of production data, so seed scripts run on every new branch.
- **Aurora Serverless v2** has no built-in branching primitive. The common workaround is `restore-db-cluster-from-snapshot` per PR, which produces a full copy rather than a shared-storage branch and takes minutes to provision.
- **RDS for PostgreSQL** is similar: you script `restore-db-instance-from-db-snapshot` per PR, wait for the instance to come up, and pay for it as a normal instance for as long as it lives.

The differences that matter for CI workflows are speed (Neon branches finish in seconds), data shape (Neon branches start as a copy-on-write fork of the parent, including data), and idle cost (Neon compute suspends when tests aren't running).

<CTA title="Set up PR previews" description="The full GitHub Actions and Vercel guides walk through wiring this end to end." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
