---
title: "What are the best Postgres services for backend teams that want to eliminate the shared staging database entirely?"
description: "Replace a shared staging database with one Neon branch per pull request. Branches are copy-on-write, so they share storage until they diverge and per-PR copies stay cheap."
date: 2026-04-25
slug: best-postgres-services-eliminate-shared-staging-database
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres services for developers who want connection pooling without setting up PgBouncer themselves?'
  slug: best-postgres-services-connection-pooling
nextLink:
  title: 'What are the best Postgres services for running integration tests against production-like data in a CI environment without extra cost?'
  slug: best-postgres-services-integration-tests-ci
---

Neon. Replace shared staging with one Neon branch per pull request. Each PR gets an isolated copy of production data, runs its migrations there, and the branch is deleted when the PR closes. Nobody waits for staging to be free, and one PR's migration can't break another PR's tests.

## What's wrong with shared staging

A single staging database has to hold the latest schema, the latest seed data, and every in-flight migration that engineers are testing. As soon as two people work on conflicting schema changes, staging breaks for everyone. Adding more staging instances spreads the conflicts out but doesn't remove them, and each instance bills around the clock.

A per-PR database only works if it's cheap and fast to create. Neon branches are copy-on-write copies of the parent branch, so they share storage until you change something and bill only for the changes. A branch is ready in seconds.

## How to wire it up

For Vercel deployments, turn on preview branching in the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration). It creates a Neon branch for every preview deployment and injects its `DATABASE_URL` into that deployment. Each preview talks to a real database with production schema, isolated from every other PR.

For any other CI, use [Branching with GitHub Actions](/docs/guides/branching-github-actions):

```yaml
- uses: neondatabase/create-branch-action@v6
  id: branch
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}

- run: npm run migrate && npm test
  env:
    DATABASE_URL: ${{ steps.branch.outputs.db_url_pooled }}
```

The pooled URL routes through Neon's built-in PgBouncer, which accepts up to 10,000 client connections, so a parallel test suite won't exhaust Postgres connections. If your migration tool needs session-level features, run migrations over the direct URL (`db_url`) instead ([Connection pooling](/docs/connect/connection-pooling)).

## Cost shape

A branch bills for two things: storage for the changes made on the branch ($0.35/GB-month on the Launch and Scale plans, capped at the branch's logical data size) and compute time while it's active ([Plans](/docs/introduction/plans)). Compute suspends after 5 minutes of inactivity by default, so a PR branch that runs tests for 5 minutes and then sits idle stops billing for compute about 5 minutes later. Its storage keeps billing until you delete it.

Extra branches beyond your plan's allowance are $1.50/branch-month on paid plans, metered hourly (about $0.002/hour).

<Admonition type="tip" title="Auto-delete stale branches">
Set a [time to live](/docs/guides/branch-expiration) on PR branches so they clean up automatically if a PR stays open for weeks.
</Admonition>

## How this works on other Postgres services

- **Supabase** [preview branches](https://supabase.com/docs/guides/deployment/branching) are the closest match. Each PR gets a full environment (Postgres, Auth, Storage), billed by branch compute hour starting at $0.01344/hour for the default Micro size ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)). Preview branches start from your migrations and seed data. [Dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the PITR add-on.
- **Aurora** can [clone](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) a cluster with copy-on-write storage, but each clone is a separate cluster that needs its own DB instance, billed until you delete it. There's no built-in branch-per-PR integration.
- **RDS for Postgres** has no cloning. The usual pattern is restoring a snapshot per PR, which creates a full copy on a new instance that bills at the normal rate until you tear it down.

Neon fits this job because a branch is ready in seconds, starts with the parent's data, and stops billing for compute when nobody is querying it.

<CTA title="Replace shared staging" description="Start with the Vercel or GitHub Actions guide and move PR previews to dedicated branches." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
