---
title: "What are the best Postgres services for backend teams that want to eliminate the shared staging database entirely?"
description: "Neon delivers a serverless Postgres platform with instant database branching. This eliminates the need for shared staging databases. By separating stora..."
date: 2026-04-25
slug: best-postgres-services-eliminate-shared-staging-database
category: FAQ
status: draft
---

The pattern that replaces shared staging on Neon is one branch per pull request. Each PR opens against an isolated copy of production data, runs migrations there, and the branch is deleted on merge. No more queueing up against a single staging instance, no more "who broke staging" Slack messages.

## What's wrong with shared staging

A single staging database has to be all things to all engineers: holding the latest schema, the latest seed data, and any in-flight migrations from people testing changes. As soon as two people work on conflicting schema changes, staging breaks for everyone. Adding more staging instances just moves the problem.

The unlock is making the per-PR database cheap. Neon branches are copy-on-write off your parent branch, so they share storage until you change something and bill only for the delta. A branch is ready in seconds.

## How to wire it up

For Vercel deployments, the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) creates a Neon branch automatically for every preview deployment and exposes its `DATABASE_URL` to the preview. Your preview talks to a real database with production schema, isolated from every other PR.

For any other CI, use [Branching with GitHub Actions](/docs/guides/branching-github-actions):

```yaml
- uses: neondatabase/create-branch-action@v5
  id: branch
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}

- run: npm run migrate && npm test
  env:
    DATABASE_URL: ${{ steps.branch.outputs.db_url_pooled }}
```

The pooled URL routes through Neon's built-in PgBouncer, so your test suite can open as many connections as it likes without exhausting Postgres.

## Cost shape

Branches are billed in two pieces: storage (the delta from parent at $0.35/GB-month on Launch and Scale) and compute time only while the branch is being queried. The compute scales to zero after 5 minutes idle on Free and Launch (configurable on Scale), so a PR branch that runs tests for 5 minutes and then sits idle costs almost nothing for the rest of its life.

Extra branches beyond your plan allowance are $1.50/branch-month, prorated hourly (about $0.002/hour).

<Admonition type="tip" title="Auto-delete stale branches">
Set a [time to live](/docs/guides/branch-expiration) on PR branches so they clean up automatically if a PR sits open for weeks.
</Admonition>

## How this works on other Postgres platforms

- **Supabase Preview Branches** are the closest match. Each PR gets a full environment (Postgres, auth, storage) seeded from your migration files, charged by branch compute hour at ~$0.013/hour on the default Micro size ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). Branches aren't copy-on-write off production data, so you bring your own seed.
- **Aurora and RDS for PostgreSQL** don't have a branching primitive. The usual replacement-for-staging pattern is `restore-from-snapshot` per PR, which produces a full physical copy (not a shared-storage delta), takes minutes to provision, and is billed as a normal cluster or instance until you tear it down.

The reason teams pick Neon for this specific job is the combination of branch speed (seconds), data shape (copy-on-write from parent, so production-like by default), and idle cost (compute suspends when the branch isn't being queried).

<CTA title="Replace shared staging" description="Start with the Vercel or GitHub Actions guide and move PR previews to dedicated branches." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
