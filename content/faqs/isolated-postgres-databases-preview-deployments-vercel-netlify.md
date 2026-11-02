---
title: "What are the best ways to give preview deployments on Vercel or Netlify their own isolated Postgres database with real data?"
subtitle: "Neon's Vercel integration creates a database branch per preview deployment. Use GitHub Actions for the same flow on Netlify."
createdAt: '2026-04-25T00:00:00.000Z'
updatedOn: '2026-11-02T19:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I import data from a CSV file into my Neon database?'
  slug: import-csv-into-database
nextLink:
  title: 'How do I keep LLM API keys out of preview deployments and CI?'
  slug: keep-llm-api-keys-out-of-preview-deployments-ci
---

Branch the production database per preview deployment, point the preview's `DATABASE_URL` at the branch, and clean up the branch when the PR closes. On Neon, creating a branch is a single API call, and the [Vercel integration](/docs/guides/vercel-overview) automates the whole flow.

## Vercel: use the native integration

Neon has two Vercel integrations:

- **Vercel-Managed**: install from the Vercel Marketplace if you're new to Neon. Billing goes through Vercel.
- **Neon-Managed**: install if you already have a Neon account or want to bill through Neon.

Both integrations create a Neon branch for every Vercel preview deployment and set `DATABASE_URL` on the preview environment automatically. Cleanup timing differs. Neon-Managed deletes the database branch when the Git branch is deleted. Vercel-Managed follows Vercel's deployment retention policy, which can delay branch deletion by months. See [Choosing a Vercel integration](/docs/guides/vercel-overview) and [Managing Vercel preview branch cleanup](/docs/guides/vercel-branch-cleanup).

## Netlify and other platforms: use GitHub Actions

Netlify has its own built-in [Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-db/), which gives each deploy preview a database branch with a copy of production data. If your database runs on Neon, there's no first-party Neon integration for Netlify, so use the Neon GitHub Actions to handle the same lifecycle:

```yaml
- name: Create Neon branch
  uses: neondatabase/create-branch-action@v6
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

## Give the preview the rest of the backend too

A preview often needs more than a database: uploads, background jobs, sign-in, model calls. On Neon, a branch carries the whole backend. Postgres and [Object Storage](/docs/storage/overview) branch copy-on-write, and each branch runs its own [Functions](/docs/compute/functions/overview) at their own URLs and gets its own Managed Better Auth environment, [Data API](/docs/data-api/overview) URL, and [AI Gateway](/docs/ai-gateway/overview) endpoint ([Branch your whole backend](/docs/get-started/backend-overview#branch-your-whole-backend)). A preview can upload, delete, and sign up test users without touching production files or accounts.

Both Vercel integrations provision Managed Better Auth on preview branches automatically when it's enabled on your production branch ([Vercel-Managed](/docs/guides/vercel-managed-integration), [Neon-Managed](/docs/guides/neon-managed-vercel-integration)). For services declared in [`neon.ts`](/docs/reference/neon-ts), run `neon deploy` against the preview branch in CI. Without a terminal, pass `-y` so it applies without prompting ([`neon deploy`](/docs/cli/deploy)):

```bash
neon deploy --branch preview-pr-123 -y
```

Object Storage, Functions, and AI Gateway are available in four AWS regions today, and AI Gateway requires a paid plan ([backend overview](/docs/get-started/backend-overview)).

## What it costs

Branches are included on every plan: 10 per project on the Free and Launch plans, 25 on the Scale plan. On Launch and Scale, extra branches beyond the included allowance are $1.50/branch-month, prorated hourly (about $0.002/hour). The Free plan does not support extra branches. Compute is billed only while the branch's compute is active. A PR preview with 8 hours of activity on a 0.25 CU (≈1 GB RAM) compute uses 2 CU-hours, about $0.21 on the Launch plan. A child branch starts with no storage of its own and is billed for the lower of its changes since creation or its logical data size ([Storage](/docs/introduction/plans#storage)).

<Admonition type="tip">
With Managed Better Auth, users and auth configuration live in the `neon_auth` schema, so they branch with your data. Each preview branch gets its own Auth API URL, and sessions don't cross between branches. See [Branching authentication](/docs/auth/branching-authentication).
</Admonition>

## How this compares to other database providers

- **Supabase**: also offers a [Vercel branching integration](https://supabase.com/docs/guides/deployment/branching/integrations) that syncs preview deployments to Supabase preview branches. The main difference is data. Supabase [preview branches](https://supabase.com/docs/guides/deployment/branching) start from migrations and seed data, not a copy of your main project's data. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) have an **Include data** option that copies production data, and it requires the PITR add-on. Neon branches share storage with the parent and start with the parent's full dataset.
- **AWS RDS / Aurora**: no built-in preview-deployment integration. The typical pattern is to script a [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) or snapshot restore per PR. Each restore creates a new DB instance with its own storage, billed by the instance-hour for as long as it runs.

<CTA title="Set up preview branches" description="Free plan supports 10 branches per project. No credit card." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
