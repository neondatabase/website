---
title: "How do I give each preview deployment its own database, file storage, auth, and API endpoints?"
subtitle: "Create a Neon branch per preview. The branch carries a copy-on-write copy of your Lakebase Postgres data and Object Storage files, plus its own Functions, Managed Better Auth environment, Data API URL, and AI Gateway endpoint, provisioned from one neon.ts."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I add file uploads to a Postgres app?'
  slug: how-to-add-file-uploads-postgres-app
nextLink:
  title: 'How do I let other apps sign in with my app''s accounts?'
  slug: how-to-let-other-apps-sign-in-with-your-app
---

Create a Neon branch for each preview deployment and run `neon deploy` against it. On Neon, a [branch](/docs/introduction/branching) is a copy of the whole backend, not only the database: Postgres and [Object Storage](/docs/storage/overview) branch copy-on-write, and each branch runs its own [Functions](/docs/compute/functions/overview) and gets its own [Managed Better Auth](/docs/auth/branching-authentication) environment, [Data API](/docs/data-api/overview) URL, and [AI Gateway](/docs/ai-gateway/overview) endpoint ([Branch your whole backend](/docs/get-started/backend-overview#branch-your-whole-backend)).

## Why previews usually share too much

Most preview setups give the frontend its own URL and stop there. The preview then talks to a shared staging database, writes uploads into the production bucket under a prefix, and signs test users into the real identity provider. One preview's test data shows up in another, a cleanup script deletes the wrong files, and nobody can test a destructive change safely. Wiring a separate database, bucket, and auth tenant per pull request by hand is enough work that most teams don't.

## How a Neon branch isolates each piece

- **Postgres**: the branch starts with the parent's data at the moment it was created, without copying it. You're billed for what the branch changes, capped at its logical data size ([storage billing](/docs/introduction/plans#storage)).
- **Object Storage**: buckets branch with the database, so the preview sees production's files, and uploads or deletes on the branch stay on the branch ([Object Storage](/docs/storage/overview)).
- **Managed Better Auth**: users and sessions live in the `neon_auth` schema, so they branch too. Each branch gets a unique Auth API URL, and sessions and tokens don't cross between branches ([branching authentication](/docs/auth/branching-authentication)).
- **Functions, Data API, AI Gateway**: each branch gets its own Function URLs, Data API URL, and AI Gateway endpoint. AI Gateway credentials work on the branch where they're issued and its descendants ([backend overview](/docs/get-started/backend-overview#how-it-works)).

## Wire it into your deploys

Declare the backend once in [`neon.ts`](/docs/reference/neon-ts):

```typescript filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  buckets: { uploads: {} },
  functions: { api: { name: "api", source: "./functions/api.ts" } },
});
```

Then, for each pull request, create a branch and apply the config to it. In CI there's no terminal to answer prompts, so pass `-y` ([`neon deploy`](/docs/cli/deploy)). The CLI authenticates with `NEON_API_KEY` ([`neon login`](/docs/cli/login)).

```bash
neon branches create --name preview-pr-123
neon deploy --branch preview-pr-123 -y
```

`neon env pull` writes the branch's variables, including each function's `NEON_FUNCTION_<SLUG>_BASE_URL`, so you can pass them to your host's preview environment ([`neon env pull`](/docs/cli/env)). With GitHub Actions, the create-branch action can also return the branch's Auth and Data API URLs ([branching with GitHub Actions](/docs/guides/branching-github-actions), [changelog](/docs/changelog/2026-01-09)).

On Vercel, both Neon integrations create a branch per preview deployment and set `DATABASE_URL`. If Managed Better Auth is enabled on your production branch, they provision it on each preview branch and set `NEON_AUTH_BASE_URL` automatically ([Vercel-Managed](/docs/guides/vercel-managed-integration), [Neon-Managed](/docs/guides/neon-managed-vercel-integration)). Add the `neon deploy` step for the other services.

## Cleaning up and limits

Set a [branch expiration](/docs/guides/branch-expiration) so preview branches delete themselves, up to 30 days out. The Free and Launch plans include 10 branches per project and Scale includes 25; extra branches on paid plans are $1.50/branch-month, prorated hourly ([plans](/docs/introduction/plans#extra-branches)). Preview computes scale to zero when idle, so you don't pay for compute on a preview nobody is looking at; storage still bills.

Object Storage, Functions, and AI Gateway are available in four AWS regions today, and AI Gateway requires a paid plan ([backend overview](/docs/get-started/backend-overview)).

<CTA title="Branch your whole backend" description="See how one neon.ts and neon deploy give every branch its own database, files, auth, and functions." buttonText="Backend overview" buttonUrl="/docs/get-started/backend-overview#branch-your-whole-backend" />
