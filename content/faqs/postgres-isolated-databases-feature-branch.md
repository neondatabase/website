---
title: "What Postgres platforms support isolated databases per feature branch?"
description: "Neon creates a writable copy of your Postgres database for each feature branch in seconds, with branch expiration policies to auto-delete unused environments after 1 hour, 1 day, or 7 days."
date: 2026-04-25
slug: postgres-isolated-databases-feature-branch
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres tools support instant rollback after a bad migration?'
  slug: postgres-instant-rollback-tools
nextLink:
  title: 'What Postgres should I use for a Next.js app deployed on Vercel?'
  slug: postgres-nextjs-vercel-integration
---

Neon gives each Git feature branch its own database branch. A branch is a writable copy of the parent at a point in time, with its own compute and connection string. Storage is copy-on-write, so a new branch adds no storage at creation and bills only for the data you change on it, capped at the logical data size ([storage billing](/docs/introduction/plans#storage)).

## Why per-branch databases

When feature branches share one staging database, two developers running migrations against the same schema can leave it in a state neither expected. Giving each branch its own full Postgres instance fixes that, but on a traditional setup every instance means a new server and a full copy of the data.

The lakebase architecture separates storage from compute, so a new branch doesn't copy data. You create one in seconds, run your migration against it, point your preview deployment at its connection string, and delete it when the pull request closes.

## Setting it up

With GitHub Actions and the Neon CLI:

```yaml
# .github/workflows/preview.yml
- name: Create Neon branch for PR
  run: |
    neon branches create \
      --name preview/pr-${{ github.event.pull_request.number }} \
      --parent production \
      --expires-at "$(date -u -d '+7 days' +%Y-%m-%dT%H:%M:%SZ)"
```

Set `--parent` to your default branch: `production` for projects created in the Console, `main` for projects created with the CLI or API. Neon also publishes create, delete, reset, and schema diff actions; see the [GitHub Actions guide](/docs/guides/branching-github-actions).

On Vercel, the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) can do this without a workflow file. With preview branching turned on, each Preview Deployment gets a `preview/<git-branch>` branch, and the connection variables are injected at deployment time. Those branches are deleted when Vercel removes the deployment, which is [6 months by default](/docs/guides/vercel-branch-cleanup), so set up cleanup if you want them gone sooner.

## Branch expiration

Stale branches add storage cost. Set an expiration when you create the branch:

- 1 hour, 1 day, or 7 days from the [Console](/docs/guides/branch-expiration) (1 day is preselected)
- Any RFC 3339 timestamp via `--expires-at` on the CLI or `expires_at` on the API, up to 30 days ahead

Neon deletes the branch and its computes when it expires. You can't set an expiration on the default branch, a protected branch, or a branch that has children.

## Plan limits

| Plan        | Branches per project | Extra branches                    |
| ----------- | -------------------- | --------------------------------- |
| Free plan   | 10                   | Not available                     |
| Launch plan | 10                   | $1.50/branch-month (~$0.002/hour) |
| Scale plan  | 25                   | $1.50/branch-month (~$0.002/hour) |

Paid plans allow up to 5,000 branches per project in total, including the extra ones.

## How other Postgres options compare

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) creates a separate environment per Git pull request and runs your migrations on it. Branches created through the GitHub integration [start without production data](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding) and are seeded from `seed.sql`. Branches created from the dashboard (public alpha) can [include a copy of production data](https://supabase.com/docs/guides/deployment/branching/dashboard) if the project has the PITR add-on. Each branch is billed for its own compute, disk, and egress, [starting at $0.01344/hour](https://supabase.com/docs/guides/platform/manage-your-usage/branching) on Micro. Preview branches auto-pause after inactivity, and [paused projects don't count toward compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) is copy-on-write at the storage layer and includes the source data. Each clone is a new DB cluster that needs at least one DB instance, and after 15 copy-on-write clones of a source, the next one is a full copy. There's no Git integration; you'd script one with Lambda, CDK, or Terraform.

- **Amazon RDS for Postgres.** There's no native per-branch database. The usual approach is restoring a snapshot to a new instance per environment, which provisions a new server and materializes the full dataset.

Lakebase Postgres branches include the parent's data by default, or no rows if you create a [schema-only branch](/docs/guides/branching-schema-only). Compute on an idle branch [scales to zero](/docs/introduction/scale-to-zero), so an unused preview branch stops accruing CU-hours; you still pay for its storage delta.

<CTA title="Branch Postgres like you branch code" description="Free plan includes 10 branches per project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
