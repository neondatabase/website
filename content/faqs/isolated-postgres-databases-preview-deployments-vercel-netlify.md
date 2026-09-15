---
title: "What are the best ways to give preview deployments on Vercel or Netlify their own isolated Postgres database with real data?"
description: "Neon's Vercel integration creates a database branch per preview deployment. Use GitHub Actions for the same flow on Netlify."
date: 2026-04-25
slug: isolated-postgres-databases-preview-deployments-vercel-netlify
category: FAQ
status: draft
previousLink:
  title: 'How do I import data from a CSV file into my Neon database?'
  slug: import-csv-into-database
nextLink:
  title: 'Which managed Postgres databases have a free tier generous enough to run a real app without paying anything until you have users?'
  slug: managed-postgres-databases-free-tier
---

Branch the production database per preview deployment, point the preview's `DATABASE_URL` at the branch, and clean up the branch when the PR closes. Neon's branching makes branch creation a single API call, and the [Vercel integration](/docs/guides/vercel-overview) automates the whole flow.

## Vercel: use the native integration

Neon has two Vercel integrations:

- **Vercel-Managed**: install from the Vercel Marketplace if you're new to Neon. Billing goes through Vercel.
- **Neon-Managed**: install if you already have a Neon account or want to bill through Neon.

Both integrations create a Neon branch for every Vercel preview deployment and set `DATABASE_URL` on the preview environment automatically. Cleanup timing differs: Neon-Managed deletes the database branch when the Git branch is deleted; Vercel-Managed follows Vercel's deployment retention policy, which can keep preview branches around longer. See [Choosing a Vercel integration](/docs/guides/vercel-overview) and [Managing Vercel preview branch cleanup](/docs/guides/vercel-branch-cleanup).

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

See [Branching with GitHub Actions](/docs/guides/branching-github-actions).

## What it costs

Branches are included on every plan: 10 per project on the Free and Launch plans, 25 on the Scale plan. On Launch and Scale, extra branches beyond the included allowance are $1.50/branch-month, prorated hourly (about $0.002/hour). The Free plan does not support extra branches. A preview branch that exists for the lifetime of a PR (for example, 8 hours of active compute, with the rest scaled to zero) typically costs a few cents in compute. Child-branch storage starts at $0 and grows only with writes on that branch.

<Admonition type="tip">
With Managed Better Auth, user sessions and OAuth config also branch with your data, so logins work in preview environments without extra setup. See [Branching authentication](/docs/auth/branching-authentication).
</Admonition>

## How this compares to other database providers

- **Supabase**: also offers a [Vercel branching integration](https://supabase.com/docs/guides/deployment/branching/integrations) that syncs preview deployments to Supabase preview branches. The main difference is data: Supabase preview branches [don't include data from your main project](https://supabase.com/docs/guides/deployment/branching) and re-seed from a `seed.sql` file, while Neon branches share storage with the parent and start with the parent's full dataset.
- **AWS RDS / Aurora**: no built-in preview-deployment integration. The typical pattern is to script a [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html) per PR, which creates a new database instance with its own storage and instance-hour bill. Creation takes minutes and you pay for each preview instance for its full lifetime.

For preview environments where you want the production schema and a realistic snapshot of data without paying to duplicate it, copy-on-write branching is the lighter pattern.

<CTA title="Set up preview branches" description="Free plan supports 10 branches per project. No credit card." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
