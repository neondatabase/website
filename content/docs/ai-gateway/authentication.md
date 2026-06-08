---
title: AI Gateway authentication
subtitle: How Neon credentials work with AI Gateway
summary: >-
  AI Gateway uses Neon bearer credentials with the ai_gateway:invoke scope.
  Credentials are scoped to a branch and its descendants, so a credential
  created on your main branch works in all preview branches. No provider
  API keys are required.
enableTableOfContents: true
updatedOn: '2026-06-08T16:41:51.165Z'
---

AI Gateway uses Neon bearer credentials, the same credential system as [Neon Storage](/docs/introduction). No provider API keys are needed.

## Creating a credential

A credential must include the `ai_gateway:invoke` scope.

**Option 1: neonctl (recommended)**

```bash
neonctl env pull
```

This fetches your AI Gateway credential, Storage credentials, and database connection string together as environment variables, and writes them to a `.env` file. The AI Gateway credential is exported as `NEON_AI_GATEWAY_KEY`.

**Option 2: Neon API**

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["ai_gateway:invoke"], "principal_type": "user"}'
```

Store the returned token as `NEON_AI_GATEWAY_KEY`.

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

## How branch binding works

A credential is bound to the branch it was created on. It is valid for:

- That branch (the anchor branch)
- Any branch descended from it: preview branches, feature branches, CI branches

It is **not** valid for branches outside that lineage.

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

To rotate a credential, create a new one via `neonctl` or the Neon API, update your environment variables, then revoke the old credential via the Neon API:

```bash shouldWrap
curl -X DELETE "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials/{token_id}" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

<NeedHelp/>
