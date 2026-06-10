---
title: AI Gateway troubleshooting
subtitle: Common errors and how to fix them
summary: >-
  Solutions for common errors when using Neon AI Gateway, including
  authentication failures, model errors, quota limits, and upstream issues.
enableTableOfContents: true
updatedOn: '2026-06-10T17:21:35.055Z'
---

## Authentication errors

### `401 invalid or missing credential`

The bearer token is missing, malformed, or has been revoked.

**Fix:** Check that `NEON_AI_GATEWAY_KEY` is set and contains the full `nt_live_...` token returned when you created the credential. If the credential was revoked, create a new one. See [Authentication](/docs/ai-gateway/authentication#creating-a-credential).

### `403 credential not authorized for ai gateway`

The credential exists but lacks the `ai_gateway:invoke` scope.

**Fix:** Create a new credential that includes `ai_gateway:invoke` in the `scopes` array. Scopes cannot be added to an existing credential. See [Authentication](/docs/ai-gateway/authentication#creating-a-credential).

### `403 credential not authorized for this branch`

The credential was issued on a branch that is not an ancestor of the branch in the request hostname.

**Fix:** Use a credential issued on the current branch or an ancestor branch. See [Authentication](/docs/ai-gateway/authentication#how-branch-binding-works) for how branch lineage works.

### `503 authorization temporarily unavailable`

The credential store or branch resolver is temporarily unavailable.

**Fix:** Retry the request. This is a transient infrastructure error, not a client error.

---

## Model errors

### `400 unknown model`

The `model` field in the request body does not match any entry in the AI Gateway catalog.

**Fix:** Check the model ID. All model IDs use the `databricks-` prefix (e.g., `databricks-claude-sonnet-4-6`). See the [full model catalog](/docs/ai-gateway/models) for valid IDs.

### `400 model is not available on this endpoint`

The model exists in the catalog but does not work with the endpoint you are calling.

**Fix:** Check which endpoint the model requires:

- Anthropic models (`databricks-claude-*`) on `/openai/v1/responses` → use `/anthropic/v1/messages` or `/mlflow/v1/chat/completions`
- OpenAI codex models or `gpt-5-5-pro` on `/mlflow/v1/chat/completions` → use `/openai/v1/responses`
- Google models on `/anthropic/v1/messages` → use `/gemini/v1beta/...` or `/mlflow/v1/chat/completions`

See [Which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use).

### `400 missing or invalid model`

The request body does not contain a valid `model` field.

**Fix:** Include `"model": "<model-id>"` in the request body.

---

## Gemini-specific errors

### `404 unsupported gemini action`

The action in the Gemini endpoint URL is not `generateContent`.

**Fix:** Only `generateContent` is supported. The URL must end with `:<model-id>:generateContent`. Other actions (`countTokens`, `streamGenerateContent`, etc.) are not available.

### `404 invalid gemini model path`

The `{modelAction}` segment in the Gemini URL path is malformed. It must follow the format `<model>:<action>` where both parts are non-empty.

**Fix:** Ensure the URL path contains exactly one colon separating the model ID and action, e.g. `databricks-gemini-2-5-flash:generateContent`.

---

## Workspace resolution errors

### `403` or `400` — `could not resolve workspace from host`

The request host does not match the expected format or region.

**Common causes:**

- The host does not end with a trusted suffix (`.neon.tech` in production). Returns 403.
- The host has no parseable AWS region label. Returns 400.
- The region in the host has no configured workspace. Returns 404.

**Fix:** Verify that you are using the correct AI Gateway host from the Neon Console or API. The host format for production is `<branch-id>-api.<cell>.<region>.aws.neon.tech`. Do not construct the host manually.

---

## Rate limiting and quota

### `429` — upstream provider rate limit

The request hit the upstream Databricks/provider rate limit.

**Fix:** Implement exponential backoff. The response includes a `Retry-After` header and provider-specific rate limit headers (`X-Ratelimit-*`, `Anthropic-Ratelimit-*`). See [Rate limiting](/docs/ai-gateway/chat-completions#rate-limiting).

### `429` — account quota exceeded

Your account's AI Gateway quota is blocked. The response body is:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway quota exceeded"
}
```

**Fix:** Check the `Retry-After` header — if present, the block is temporary and will lift at that time. If `Retry-After` is absent, the block is permanent until resolved. Contact support for a quota increase or to resolve a permanent block.

---

## Upstream errors

### `502 upstream request failed`

The gateway could not reach the upstream Databricks workspace, or the upstream returned an unexpected error.

**Fix:** Retry the request. If the error persists, check the [Neon status page](https://neonstatus.com).

---

## Error response formats

Most AI Gateway errors use the standard OpenAI error envelope:

```json
{
  "error": {
    "message": "unknown model"
  }
}
```

The quota block error uses a different shape:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway quota exceeded"
}
```

<NeedHelp/>
