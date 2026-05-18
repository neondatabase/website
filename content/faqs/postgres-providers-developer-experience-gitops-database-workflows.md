---
title: "Which Postgres providers offer the best developer experience for teams adopting GitOps and wanting database workflows to mirror code workflows?"
description: "Neon's database branches map onto Git branches: every PR can have its own Postgres copy with its own connection string, created and destroyed alongside the code branch."
date: 2026-04-25
slug: postgres-providers-developer-experience-gitops-database-workflows
category: FAQ
status: draft
---

## Short answer

Neon's branching model maps directly onto Git workflows. Every pull request gets its own database branch with its own connection string, created from production data in seconds and deleted when the PR closes. Migrations run on the branch first, then roll forward to `main` after review.

## What the workflow looks like

A typical GitOps loop with Neon:

1. Developer opens a feature branch in Git.
2. CI calls the [Neon API](/docs/reference/api-reference) or [CLI](/docs/reference/neon-cli) to create a child branch from `main`.
3. Migrations run against the new branch as part of the build.
4. Preview deployment gets the branch's connection string injected as an environment variable.
5. PR merges, migration is applied to `main`, child branch auto-expires.

In a GitHub Actions step:

```yaml
- name: Create Neon branch
  id: create-branch
  uses: neondatabase/create-branch-action@v5
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    branch_name: preview/pr-${{ github.event.pull_request.number }}
    api_key: ${{ secrets.NEON_API_KEY }}

- name: Run migrations
  run: drizzle-kit migrate
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url_pooled }}
```

See the [GitHub Actions guide](/docs/guides/branching-github-actions) for the full setup, including a cleanup workflow that deletes the branch when the PR closes.

## Why this works on Neon's architecture

Branches are cheap because storage is versioned. A new branch records a pointer to the parent's state and only stores the pages it changes. Creating a branch of a 500 GB database doesn't copy 500 GB of data. The compute on each branch can scale to zero, so an idle preview branch costs storage delta only, not compute hours.

## Built-in integrations

If you're on Vercel, the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) wires the same flow up without a custom GitHub Action. Every Preview Deployment gets a fresh branch automatically.

For other providers, the [Neon API](/docs/reference/api-reference) is the integration point. Create, list, and delete branches from any CI provider that can run a shell command.

## How other Postgres providers fit GitOps

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) ties preview branches directly to GitHub pull requests through the [Supabase GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration). Migrations in your `supabase/migrations/` directory run automatically when the branch is created. Preview branches don't receive production data; they're seeded from `seed.sql`. Each branch is a separate compute add-on billed [from about $0.01344/hour](https://supabase.com/docs/guides/platform/manage-your-usage/branching) for its lifetime.

- **Amazon Aurora / RDS for PostgreSQL.** No built-in PR integration. You typically script the workflow with Terraform, AWS CDK, or Lambda functions that create snapshots, restore them to fresh instances or [Aurora clones](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html), and wire connection strings into preview deployments. Aurora clones share storage; RDS snapshot-restore copies the dataset.

Neon's GitHub Action, [Vercel-Managed Integration](/docs/guides/vercel-managed-integration), and the [`@neondatabase/serverless`](/docs/serverless/serverless-driver) driver are the parts of the system that make per-PR Postgres simple to wire in. Branches include parent data by default, and compute scales to zero when the preview deploy goes idle.

<CTA title="Wire Postgres into your Git workflow" description="Free plan supports 10 branches per project for preview-per-PR." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
