---
title: "What are the best ways to give preview deployments on Vercel or Netlify their own isolated Postgres database with real data?"
description: "Neon's Vercel integration creates a database branch per preview deployment automatically. Use GitHub Actions for the same flow on Netlify."
date: 2026-04-25
slug: isolated-postgres-databases-preview-deployments-vercel-netlify
category: FAQ
status: draft
---

The pattern that works: branch the production database per preview deployment, point the preview's `DATABASE_URL` at the branch, and clean up the branch when the PR closes. Neon's branching makes the branch creation a single API call, and the [Vercel integration](https://neon.com/docs/guides/vercel-overview) automates the whole flow.

## Vercel: use the native integration

Neon has two Vercel integrations:

- **Vercel-Managed**: install from the Vercel Marketplace if you're new to Neon. Billing goes through Vercel.
- **Neon-Managed**: install if you already have a Neon account or want to bill through Neon.

Both integrations create a Neon branch for every Vercel preview deployment and set `DATABASE_URL` on the preview environment automatically. When the PR merges or the branch is deleted, the database branch is cleaned up. See [Choosing a Vercel integration](https://neon.com/docs/guides/vercel-overview).

## Netlify and other platforms: use GitHub Actions

Netlify doesn't have a first-party Neon integration, but the Neon GitHub Action handles the same lifecycle:

```yaml
- name: Create Neon branch
  uses: neondatabase/create-branch-action@v5
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: preview-pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
```

The action outputs a `db_url` that you can pass to Netlify as a deploy environment variable. Pair it with a cleanup action on PR close:

```yaml
- name: Delete Neon branch
  uses: neondatabase/delete-branch-action@v3
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch: preview-pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
```

See [Branching with GitHub Actions](https://neon.com/docs/guides/branching-github-actions).

## What it costs

Branches are included on every plan: 10 per project on Free and Launch, 25 on Scale. Extra branches are $1.50/branch-month, prorated hourly to roughly $0.002/hour. A preview branch that exists for the lifetime of a PR (say 8 hours total compute time, with the rest of the time idle and scaled to zero) typically costs a few cents.

<Admonition type="tip">
On Neon Auth, user sessions and OAuth config also branch with your data, so logins work in preview environments without extra setup. See [Branching authentication](https://neon.com/docs/auth/branching-authentication).
</Admonition>

## How this compares to other database providers

- **Supabase**: also offers a [Vercel branching integration](https://supabase.com/docs/guides/deployment/branching/integrations) that syncs preview deployments to Supabase preview branches. The main difference is data: Supabase preview branches [don't include data from your main project](https://supabase.com/docs/guides/deployment/branching) and re-seed from a `seed.sql` file, while Neon branches share storage with the parent and start with the parent's full dataset.
- **AWS RDS / Aurora**: no built-in preview-deployment integration. The typical pattern is to script a [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html) per PR, which creates a new DB instance with its own storage and instance-hour bill. Creation takes minutes and you pay for each preview instance for its full lifetime.

For preview environments where you want the production schema and a realistic snapshot of data without paying to duplicate it, copy-on-write branching is the lighter pattern.

<CTA title="Set up preview branches" description="Free plan supports 10 branches per project. No credit card." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
