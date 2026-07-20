---
title: AI Gateway authentication
subtitle: How Neon credentials work with AI Gateway
summary: >-
  AI Gateway uses Neon bearer credentials with the ai_gateway:invoke scope.
  Credentials are scoped to a branch and its descendants, so a credential
  created on your main branch works in all preview branches. No provider
  API keys are required.
enableTableOfContents: true
updatedOn: '2026-07-17T11:46:46.418Z'
---

<FeatureBetaProps feature_name="Neon AI Gateway" />

AI Gateway uses Neon bearer credentials, the same credential system as [Neon Object Storage](/docs/introduction). No provider API keys are needed.

## Creating a credential

A credential must include the `ai_gateway:invoke` scope.

<Tabs labels={["Console", "API"]}>
<TabItem>

In the Neon Console, select your branch and click **Credentials** under **APP BACKEND** in the sidebar. Click **Create credential**, give it a name, and check **ai_gateway:invoke**.

After creation, the credential is shown once. Copy the snippet or click **Download .env** before closing. The snippet includes both gateway env vars (see [Environment variables](#environment-variables) below).

To view or revoke credentials later, return to the **Credentials** page and use the action menu (⋮) next to the credential.

</TabItem>
<TabItem>

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["ai_gateway:invoke"], "principal_type": "user"}'
```

The response includes an `api_token` field. Store it as an environment variable:

```bash
export NEON_AI_GATEWAY_TOKEN=nt_live_...
```

</TabItem>
</Tabs>

## Pull credentials with neon

For local development, `neon env pull` writes your AI Gateway credentials to your `.env` file automatically, with no manual copy-paste from the API response:

```bash
neon env pull --file .env
```

This populates `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` for the current branch alongside your database connection string. Running `neon config apply` or `neon deploy` also auto-pulls credentials after a successful apply. To check current credential status:

```bash
neon config status
```

For production deployments, use the [API-based workflow](#creating-a-credential) to create named credentials. `expires_at` is accepted but not currently enforced during the beta -- revoke credentials explicitly instead of relying on expiry.

## Using your credential

Pass your credential as a bearer token on every request:

```
Authorization: Bearer <your-credential>
```

When using an AI SDK, set this as the `apiKey` parameter:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/mlflow/v1`,
});
```

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/mlflow/v1",
)
```

</CodeTabs>

## Environment variables

Neon provides two gateway env vars. `NEON_AI_GATEWAY_BASE_URL` is the bare branch host, so you append the dialect path yourself when configuring an SDK.

| Variable                   | Value                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `NEON_AI_GATEWAY_TOKEN`    | Bearer token (`nt_live_...`)                                                                        |
| `NEON_AI_GATEWAY_BASE_URL` | Bare branch host: `https://<branch-host>`, with no path. Append `/ai-gateway/<dialect>/v1` yourself |

Append the dialect path for the endpoint you need:

```
NEON_AI_GATEWAY_BASE_URL + /ai-gateway/mlflow/v1   → chat completions (all providers)
NEON_AI_GATEWAY_BASE_URL + /ai-gateway/openai/v1   → OpenAI Responses API
NEON_AI_GATEWAY_BASE_URL + /ai-gateway/gemini      → Gemini generateContent API
```

Most dialects are also reachable at a shorter top-level path with no `/ai-gateway/<dialect>` prefix: `/v1/chat/completions` for chat completions and `/openai/v1/responses` for OpenAI Responses. Gemini's shorter alias keeps the `gemini` segment: `/v1/gemini/v1beta/models/{model}:generateContent`. `GET /v1/models` lists the catalog in an OpenRouter-shaped response. See [Shorter paths](/docs/ai-gateway/models#shorter-v1-paths) for the full mapping.

To use an OpenAI SDK, set its `apiKey` and `baseURL` from these variables (see the examples below).

## Credentials in Neon Functions

When your code runs inside Neon Functions, both gateway env vars are injected automatically. No credential creation step required:

| Variable                   | Value                                               |
| -------------------------- | --------------------------------------------------- |
| `NEON_AI_GATEWAY_TOKEN`    | Bearer token for the AI Gateway                     |
| `NEON_AI_GATEWAY_BASE_URL` | Branch gateway host with `https://` prefix, no path |

See [Environment variables](/docs/compute/functions/environment-variables) for the full list of variables Neon injects into a function.

Configure an OpenAI SDK by setting `apiKey` and `baseURL` from these variables. Use the OpenAI Responses dialect for `responses.create()`:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/openai/v1`,
});

const response = await client.responses.create({
  model: 'gpt-5-mini',
  input: 'What is Neon?',
});
```

For the chat completions endpoint, point the base URL at the `mlflow` dialect instead:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/mlflow/v1`,
});
```

## How branch binding works

Each credential is tied to the branch it was created on. It's valid for:

- That branch (the anchor branch)
- Any branch descended from it: preview branches, feature branches, CI branches

It's **not** valid for branches outside that lineage.

This means a credential created on your `main` branch works in all branches that were forked from `main`. A credential created on a feature branch only works within that feature branch's descendants.

```
main  ──── credential valid here
  └── preview/feature-x  ──── and here
        └── preview/sub-branch  ──── and here
staging  ──── credential NOT valid here (different lineage)
```

This design lets you use a single credential across your entire development workflow (local dev, preview deployments, and CI) without creating separate credentials for each environment.

## Common auth errors

| Error                     | Cause                                      | Fix                                                                                                                             |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `401 Unauthorized`        | Missing or invalid credential              | Check that `NEON_AI_GATEWAY_TOKEN` is set and contains the full token                                                           |
| `403 Forbidden`           | Credential lacks `ai_gateway:invoke` scope | Recreate the credential with the correct scope                                                                                  |
| `403 Forbidden`           | Branch not in credential lineage           | Use a credential created on this branch or an ancestor branch. The gateway returns: `credential not authorized for this branch` |
| `503 Service Unavailable` | Auth store temporarily unavailable         | Retry the request                                                                                                               |

## Rotating credentials

To rotate a credential: create a new one, update your environment variables, then revoke the old one.

To revoke from the Console, open the **Credentials** page and use the action menu (⋮) next to the credential. To revoke via the API:

```bash shouldWrap
curl -X DELETE "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials/{token_id}" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<NeedHelp/>
