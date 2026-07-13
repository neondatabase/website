---
title: AI Gateway troubleshooting
subtitle: Common errors and how to fix them
summary: >-
  Solutions for common errors when using Neon AI Gateway, including
  authentication failures, model errors, quota limits, and upstream issues.
enableTableOfContents: true
updatedOn: '2026-07-13T19:43:27.832Z'
---

<PrivatePreviewEnquire/>

## Authentication errors

### `401 invalid or missing credential`

The bearer token is missing, malformed, or has been revoked.

**Fix:** Check that `NEON_AI_GATEWAY_TOKEN` is set and contains the full `nt_live_...` token returned when you created the credential. If the credential was revoked, create a new one. See [Authentication](/docs/ai-gateway/authentication#creating-a-credential).

### `403 credential not authorized for ai gateway`

The credential exists but lacks the `ai_gateway:invoke` scope.

**Fix:** Create a new credential that includes `ai_gateway:invoke` in the `scopes` array. You can't add scopes to an existing credential. See [Authentication](/docs/ai-gateway/authentication#creating-a-credential).

### `403 credential not authorized for this branch`

The credential was issued on a branch that is not an ancestor of the branch in the request hostname.

**Fix:** Use a credential issued on the current branch or an ancestor branch. See [Authentication](/docs/ai-gateway/authentication#how-branch-binding-works) for how branch lineage works.

### `503 authorization temporarily unavailable`

The credential store or branch resolver is temporarily unavailable.

**Fix:** Retry the request. This is a transient infrastructure error, not a client error.

---

## Model errors

### `400 unknown model "<model-id>"`

The `model` field in the request body does not match any entry in the AI Gateway catalog. The error message includes the model ID you sent.

**Fix:** Check the model ID against the [full model catalog](/docs/ai-gateway/models). Use the short form (e.g., `claude-sonnet-4-6`) or the `databricks-` prefixed form (`databricks-claude-sonnet-4-6`) — both are accepted.

### `400 model "<model-id>" is not available on the <endpoint> endpoint`

The model exists in the catalog but doesn't work with the endpoint you're calling. The error message names both the model and the endpoint dialect it was sent to (for example, `anthropic_messages`, `openai_responses`, `gemini`, or `chat_completions`).

**Fix:** Check which endpoint the model requires:

- Anthropic models (`claude-*`) on `/openai/v1/responses` → use `/anthropic/v1/messages` or `/mlflow/v1/chat/completions`
- OpenAI codex models on `/mlflow/v1/chat/completions` → use `/openai/v1/responses`
- Google models on `/anthropic/v1/messages` → use `/ai-gateway/gemini/v1beta/...` or `/mlflow/v1/chat/completions`

See [Which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use).

### `400 missing or invalid model`

The request body does not contain a valid `model` field.

**Fix:** Include `"model": "<model-id>"` in the request body.

---

## Gemini-specific errors

### `404 unsupported gemini action`

The action in the Gemini endpoint URL is unsupported. The AI Gateway supports Gemini `generateContent` and streaming `streamGenerateContent` calls.

**Fix:** Use either `:<model-id>:generateContent` or `:<model-id>:streamGenerateContent`. Other actions (`countTokens`, etc.) are not available.

### `404 invalid gemini model path`

The `{modelAction}` segment in the Gemini URL path is malformed. It must follow the format `<model>:<action>` where both parts are non-empty.

**Fix:** Ensure the URL path contains exactly one colon separating the model ID and action, e.g. `gemini-2-5-flash:generateContent`.

---

## Workspace resolution errors

### `403` or `400`: `could not resolve workspace from host`

The request host does not match the expected format or region.

**Common causes:**

- The host does not end with a trusted suffix (`.neon.tech` in production). Returns 403.
- The host has no parseable AWS region label. Returns 400.
- The region in the host has no configured workspace. Returns 404.

**Fix:** Verify that you are using the correct AI Gateway host from the Neon Console or API. The host format for production is `<branch-id>-api.ai.<cell>.<region>.aws.neon.tech`. Do not construct the host manually.

---

## Rate limiting and quota

### `429`: upstream provider rate limit

The request hit the upstream Databricks/provider rate limit.

**Fix:** Implement exponential backoff. The response includes a `Retry-After` header and provider-specific rate limit headers (`X-Ratelimit-*`, `Anthropic-Ratelimit-*`). See [Rate limiting](/docs/ai-gateway/chat-completions#rate-limiting).

### `429`: account quota exceeded

Your account's AI Gateway quota is blocked. This can happen if you exceed the token-per-minute limits in [Rate limits](/docs/ai-gateway/models#rate-limits), or if your account exceeds its daily spend cap, which is a separate, account-level limit that can block requests even while inference is free during the preview. See [Pricing](/docs/ai-gateway/models#pricing). The response body looks like this:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway daily token limit exceeded"
}
```

If the block is due to the per-minute token limit specifically rather than the daily cap, the message reads `ai gateway per-minute token limit exceeded...` instead.

**Fix:** Check the `Retry-After` header. If present, the block is temporary and will lift at that time. If absent, the block is permanent until resolved. Contact support for a quota increase or to resolve a permanent block. See [Rate limits](/docs/ai-gateway/models#rate-limits) for current per-minute quota values.

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
  "message": "ai gateway daily token limit exceeded"
}
```

<NeedHelp/>
