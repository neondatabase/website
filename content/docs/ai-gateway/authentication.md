---
title: AI Gateway authentication
subtitle: How Neon credentials work with AI Gateway
summary: >-
  AI Gateway uses Neon bearer credentials with the ai_gateway:invoke scope.
  Credentials are scoped to a branch and its descendants, so a credential
  created on your main branch works in all preview branches. No provider
  API keys are required.
enableTableOfContents: true
updatedOn: '2026-06-11T16:21:17.644Z'
---

AI Gateway uses Neon bearer credentials, the same credential system as [Neon Storage](/docs/introduction). No provider API keys are needed.

## Creating a credential

A credential must include the `ai_gateway:invoke` scope. Use the Neon API to create one:

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["ai_gateway:invoke"], "principal_type": "user"}'
```

The response includes an `api_token` field. Store it as an environment variable:

```bash
export NEON_AI_GATEWAY_KEY=nt_live_...
```

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
  apiKey: process.env.NEON_AI_GATEWAY_KEY,
  baseURL: `https://${process.env.NEON_AI_GATEWAY_HOST}/ai-gateway/mlflow/v1`,
});
```

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_KEY"],
    base_url=f"https://{os.environ['NEON_AI_GATEWAY_HOST']}/ai-gateway/mlflow/v1",
)
```

</CodeTabs>

## Credentials in Neon Functions

When your code runs inside Neon Functions, Neon injects the following environment variables automatically. No credential creation step required:

| Variable                   | Value                                                   |
| -------------------------- | ------------------------------------------------------- |
| `NEON_AI_GATEWAY_TOKEN`    | Bearer token for the AI Gateway                         |
| `NEON_AI_GATEWAY_BASE_URL` | Branch gateway host with `https://` prefix, no path     |
| `OPENAI_API_KEY`           | Same value as `NEON_AI_GATEWAY_TOKEN`                   |
| `OPENAI_BASE_URL`          | Branch gateway host including the chat completions path |

`OPENAI_BASE_URL` and `OPENAI_API_KEY` let standard OpenAI SDK calls work with zero configuration. The `NEON_AI_GATEWAY_*` aliases are useful when you want credentials that survive a user overriding the `OPENAI_*` variables with their own keys:

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
| `401 Unauthorized`        | Missing or invalid credential              | Check that `NEON_AI_GATEWAY_KEY` is set and contains the full token                                                             |
| `403 Forbidden`           | Credential lacks `ai_gateway:invoke` scope | Recreate the credential with the correct scope                                                                                  |
| `403 Forbidden`           | Branch not in credential lineage           | Use a credential created on this branch or an ancestor branch. The gateway returns: `credential not authorized for this branch` |
| `503 Service Unavailable` | Auth store temporarily unavailable         | Retry the request                                                                                                               |

## Rotating credentials

To rotate a credential, create a new one via the Neon API (see [Creating a credential](#creating-a-credential)), update your environment variables, then revoke the old one:

```bash shouldWrap
curl -X DELETE "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials/{token_id}" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<NeedHelp/>
