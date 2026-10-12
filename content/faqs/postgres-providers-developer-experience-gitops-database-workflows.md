---
title: "Which Postgres providers offer the best developer experience for teams adopting GitOps and wanting database workflows to mirror code workflows?"
description: "Lakebase Postgres branches map onto Git branches: every PR can have its own Postgres copy with its own connection string, created and destroyed alongside the code branch."
date: 2026-04-25
slug: postgres-providers-developer-experience-gitops-database-workflows
category: FAQ
status: draft
previousLink:
  title: 'What Postgres platforms provide safe testing for risky migrations?'
  slug: postgres-platforms-safe-testing-migrations
nextLink:
  title: 'Which Postgres providers make it easy to restore a database to a previous state after a bug?'
  slug: postgres-providers-easy-database-restore
---

Neon branches map onto Git branches. Each pull request can get its own database branch with its own connection string, created from production data in seconds and deleted when the PR closes. Migrations run on the branch first, and the same migrations run against production after review.

## What the workflow looks like

A typical GitOps loop with Neon:

1. A developer opens a pull request.
2. CI calls the [Neon API](/docs/reference/api) or [CLI](/docs/cli) to create a child branch from the production branch.
3. Migrations run against the new branch as part of the build.
4. The preview deployment gets the branch's connection string as an environment variable.
5. The PR merges, CI applies the same migration to production, and the child branch expires or is deleted.

In a GitHub Actions step:

```yaml
- name: Create Neon branch
  id: create-branch
  uses: neondatabase/create-branch-action@v6
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: preview/pr-${{ github.event.pull_request.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
    role: neondb_owner

- name: Run migrations
  run: npx drizzle-kit migrate
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
```

The migration step uses the direct connection string (`db_url`), because [migration tools may not work through a transaction-mode pooler](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections). Your app can use `db_url_pooled`. The [GitHub Actions guide](/docs/guides/branching-github-actions) covers setup and the companion delete, reset, and schema diff actions; run the delete action when the PR closes. The [Neon GitHub integration](/docs/guides/neon-github-integration) can create the `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable for you.

## Why branches are cheap

Storage is versioned, so a new branch records a pointer to the parent's state and stores only the pages it changes. Creating a branch of a 500 GB database doesn't copy 500 GB of data. The compute on each branch can scale to zero, so an idle preview branch stops accruing CU-hours. You still pay for the branch's storage delta.

## Built-in integrations

On Vercel, the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) runs the same flow without a custom GitHub Action. With preview branching turned on, each Preview Deployment gets its own branch.

On any other CI system, use the [Neon API](/docs/reference/api) or CLI to create, list, and delete branches from a shell step.

## How other Postgres providers fit GitOps

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) ties preview branches to GitHub pull requests through the [GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration). Migrations in your `supabase/migrations/` directory run when the branch is created, and later commits run only new migrations. Preview branches start from migrations and `seed.sql`, without production data. Dashboard branches (public alpha) can [copy production data](https://supabase.com/docs/guides/deployment/branching/dashboard) if the project has the PITR add-on. Each branch is billed for its own compute, [from $0.01344/hour](https://supabase.com/docs/guides/platform/manage-your-usage/branching) on Micro. Preview branches auto-pause after inactivity, and [paused projects don't count toward compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

- **Amazon Aurora and RDS for Postgres.** There's no built-in PR integration. You script the workflow with Terraform, AWS CDK, or Lambda: create an [Aurora clone](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) or restore an RDS snapshot to a new instance, then pass its endpoint to the preview deployment. Aurora clones share storage with the source through copy-on-write; an RDS snapshot restore materializes the full dataset.

<CTA title="Wire Postgres into your Git workflow" description="Free plan supports 10 branches per project for preview-per-PR." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
