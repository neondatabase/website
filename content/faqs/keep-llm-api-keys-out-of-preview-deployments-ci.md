---
title: "How do I keep LLM API keys out of preview deployments and CI?"
subtitle: "Use Neon AI Gateway credentials instead of provider keys: each credential is bound to a branch and its descendants, each branch gets its own gateway host, and Neon Functions receive the credential automatically."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'What are the best ways to give preview deployments on Vercel or Netlify their own isolated Postgres database with real data?'
  slug: isolated-postgres-databases-preview-deployments-vercel-netlify
nextLink:
  title: 'How do I keep Postgres metadata in sync with files in a bucket?'
  slug: keep-postgres-metadata-in-sync-with-bucket
---

Use Neon. With [Neon AI Gateway](/docs/ai-gateway/overview), your app calls models with a Neon credential instead of an OpenAI, Anthropic, or Google key, so no provider key needs to exist in your preview or CI environments at all. Each credential is tied to the branch it was created on and works only on that branch and its descendants ([authentication](/docs/ai-gateway/authentication#how-branch-binding-works)).

## Why provider keys spread

A provider key isn't tied to any environment. To make previews and CI call a model, teams paste the same production key into every preview deployment, PR bot, and CI secret store. Each copy is valid against the full account, with production's rate limits and bill, and revoking it breaks every environment at once.

## How branch-bound credentials work

AI Gateway uses Neon bearer credentials with the `ai_gateway:invoke` scope. A credential created on a branch is valid for:

- That branch, the anchor branch
- Any branch descended from it: preview branches, feature branches, CI branches

It's not valid for branches outside that lineage. A request from another lineage gets `403` with `credential not authorized for this branch`.

```
main  ──── credential valid here
  └── preview/feature-x  ──── and here
        └── preview/sub-branch  ──── and here
staging  ──── credential NOT valid here (different lineage)
```

Every branch also gets its own AI Gateway endpoint ([branching](/docs/introduction/branching)), so a preview deploy calls `br-preview-…`, not production's host. When you delete the branch, its host goes with it ([LLMs belong in your backend](/blog/llms-belong-in-your-backend)).

## Give each environment the right credential

The simplest path is to not handle the token at all. A [Neon Function](/docs/compute/functions/overview) deployed to a branch receives `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` for that branch at runtime, next to `DATABASE_URL`. A Function on a preview branch reaches that branch's database and that branch's gateway ([environment variables](/docs/compute/functions/environment-variables)).

For code running elsewhere, declare `aiGateway: true` in [`neon.ts`](/docs/reference/neon-ts). Switching branches with `neon checkout` pulls that branch's variables into your local `.env`, and `neon env pull` re-pulls them at any time:

```bash
neon checkout preview/feature-x --create
neon deploy        # provisions the branch's services and writes its credentials to .env
```

To create a named credential for a CI job, scope it to the branch your CI branches fork from:

```bash
neon credentials create --scope ai_gateway:invoke --name ci --branch main
```

The `api_token` is printed once. Because CI branches descend from `main`, that one token works across them without granting access to any other lineage ([`neon credentials`](/docs/cli/credentials)). Right after `neon deploy` on a new branch, the first gateway call can return a `403` while the credential propagates; it clears within seconds, so retry ([backend overview](/docs/get-started/backend-overview#ai-gateway-the-model-call)).

## Rotate and revoke

- **Rotate in place**: `neon credentials rotate <token_id>` mints a new `api_token` and keeps the same `token_id`. The Console's **Connect** dialog can also rotate.
- **Revoke**: `neon credentials revoke <token_id>` or the API. The Console's **Connect** dialog can't revoke.
- **Expiry**: `expires_at` is accepted but not currently enforced, so revoke credentials explicitly instead of relying on expiry.

Use `neon credentials list` to see every credential on a branch. Secrets never appear in the list ([`neon credentials`](/docs/cli/credentials#list)). Note that IP Allow and Private Link don't cover AI Gateway traffic ([availability](/docs/ai-gateway/prepaid-credits#availability)).

AI Gateway draws from [prepaid credits](/docs/ai-gateway/prepaid-credits) and needs a project in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions).

## How other options compare

- **Vercel AI Gateway**: requests authenticate with an AI Gateway API key or an OIDC token. API keys never expire unless you revoke them, and Vercel deployments receive an OIDC token as `VERCEL_OIDC_TOKEN`, so code on Vercel can authenticate without a stored key ([authentication](https://vercel.com/docs/ai-gateway/authentication-and-byok/authentication)). The token isn't tied to a database branch.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Scope your first gateway credential" description="Learn how AI Gateway credentials bind to a branch and its descendants." buttonText="AI Gateway authentication" buttonUrl="/docs/ai-gateway/authentication" />
