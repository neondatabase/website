---
title: AI Gateway troubleshooting
subtitle: Common errors and how to fix them
summary: >-
  Solutions for common errors when using Neon AI Gateway, including
  authentication failures, model errors, quota limits, and upstream issues.
enableTableOfContents: true
updatedOn: '2026-10-09T11:04:29.203Z'
---

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

**Fix:** Check the model ID against the [full model catalog](/docs/ai-gateway/models). Use the short form (e.g., `gpt-5-mini`) or the `databricks-` prefixed form (`databricks-gpt-5-mini`) — both are accepted.

### `400 model "<model-id>" is not available on the <endpoint> endpoint`

The model exists in the catalog but doesn't work with the endpoint you're calling. The error message names both the model and the endpoint dialect it was sent to (for example, `openai_responses`, `gemini_generate_content`, or `chat_completions`).

**Fix:** Check which endpoint the model requires:

- OpenAI codex models on `/v1/chat/completions` → use `/openai/v1/responses`
- Google models on `/openai/v1/responses` → use `/gemini/v1beta/...` or `/v1/chat/completions`

See [Which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use).

### `400 missing or invalid model`

The request body does not contain a valid `model` field.

**Fix:** Include `"model": "<model-id>"` in the request body.

### Some models are restricted in the Console

On your project's **AI Gateway** page, locked models show a padlock, and the **Some models are restricted** section lists them grouped by reason. Each reason links to the fix:

| Message                                                  | What to do                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **A paid plan is required to use these models**          | Select **Upgrade plan**. The AI Gateway is available on paid plans only.                    |
| **AI Gateway credits are required to use these models**  | Select **Add credits**. See [AI Gateway prepaid credits](/docs/ai-gateway/prepaid-credits). |
| **Account verification is required to use these models** | Select **Complete verification**, or [contact Support](/docs/introduction/support).         |
| **Your account is restricted from using these models**   | [Contact Support](/docs/introduction/support).                                              |
| **Some models are not available to your account**        | [Contact Support](/docs/introduction/support).                                              |

After you upgrade or buy credits, models unlock once Neon confirms access. Reload the page if a model still shows as locked.

### `403 model requires a verified account`

The model exists in the catalog, but your account can't call it yet. This is a per-model access gate, separate from the credential-scope and branch-lineage `403`s above. It's the same condition the `enabled` field reports in `GET /v1/models`: a model with `"enabled": false` returns this error when called. The response body looks like this:

```json
{
  "error": {
    "message": "model requires a verified account"
  }
}
```

**Fix:** List `GET /v1/models` and filter on `enabled` to see which models your account can call (see [Check what your account can call](/docs/ai-gateway/models#check-what-your-account-can-call)). If you're on a paid plan with prepaid credits and still can't call a model, [contact Support](/docs/introduction/support).

---

## Gemini-specific errors

### `404 unsupported gemini action`

The action in the Gemini endpoint URL is unsupported. The AI Gateway supports Gemini `generateContent` and streaming `streamGenerateContent` calls.

**Fix:** Use either `:<model-id>:generateContent` or `:<model-id>:streamGenerateContent`. Other actions (`countTokens`, etc.) are not available.

### `404 invalid gemini model path`

The `{modelAction}` segment in the Gemini URL path is malformed. It must follow the format `<model>:<action>` where both parts are non-empty.

**Fix:** Ensure the URL path contains exactly one colon separating the model ID and action, e.g. `gemini-3-flash:generateContent`.

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

**Fix:** Implement exponential backoff. The response includes a `Retry-After` header and provider-specific rate limit headers (`X-Ratelimit-*`). See [Rate limiting](/docs/ai-gateway/chat-completions#rate-limiting).

### `429`: account quota exceeded

Your account's AI Gateway quota is blocked. This happens when you exceed a token-per-minute (TPM) rate limit or your account's daily spend limit. Both return `REQUEST_LIMIT_EXCEEDED`, and the message names the limit that was hit and how to recover.

An account-wide TPM limit:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway account token rate limit exceeded (<N> tokens per minute across all models in this region). Retry after the current minute resets, or request a higher limit through Neon support: https://neon.com/docs/introduction/support"
}
```

A per-model TPM limit names the model instead: `ai gateway account token rate limit exceeded for model "<model-id>" (<N> tokens per minute in this region). Retry after the current minute resets, ...`

A daily spend limit:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway account daily spend limit exceeded. Retry after the daily spend limit resets, or request a higher limit through Neon support: https://neon.com/docs/introduction/support"
}
```

**Fix:** Check the `Retry-After` header. If present, the block is temporary and lifts at that time; retry with exponential backoff. If absent, the block is permanent until resolved; requesting a higher limit requires a paid plan. See [Support](/docs/introduction/support) for your plan's support options and [Rate limits](/docs/ai-gateway/models#rate-limits) for current values.

---

## Upstream errors

When the upstream model provider or Databricks returns an error, the AI Gateway replaces the upstream response body with its own `{"error_code","message"}` envelope and preserves the upstream status code. Upstream internal details, such as endpoints, workspace IDs, Unity Catalog objects, principals, and internal headers, are never exposed to the caller.

The message identifies the condition:

| Condition               | Message                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint disabled       | `ai gateway upstream model endpoint is temporarily disabled. Contact Neon support`                                                                                     |
| Timeout                 | `ai gateway upstream model timed out. Retry, or reduce the input size`                                                                                                 |
| Request too large       | `ai gateway upstream rejected the request: body too large`                                                                                                             |
| Model unavailable       | `ai gateway upstream model is not available. Contact Neon support`                                                                                                     |
| Access denied           | `ai gateway upstream denied the request. Contact Neon support`                                                                                                         |
| Over capacity           | `ai gateway upstream model is temporarily over capacity. Retry later`                                                                                                  |
| Upstream internal error | `ai gateway upstream model error. Retry later, or contact Neon support if it persists`                                                                                 |
| Invalid request         | `ai gateway upstream model rejected the request: <provider message>` (redacted to `...rejected the request as invalid` when the provider detail can't be shown safely) |
| Unknown                 | `ai gateway upstream request failed. Contact Neon support if it persists`                                                                                              |

**Fix:** Follow the guidance in the message. Retry transient conditions (timeout, over capacity, upstream internal error) with exponential backoff, respecting any `Retry-After` header. If an error persists, check the [Neon status page](https://neonstatus.com). For paid plan support options, see [Support](/docs/introduction/support).

---

## Error response formats

Errors the gateway generates itself (authentication, model validation, workspace resolution) use the standard OpenAI error envelope:

```json
{
  "error": {
    "message": "unknown model \"<model-id>\""
  }
}
```

Quota blocks and all upstream (non-2xx) errors use a flat envelope, with the upstream status code preserved:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway account daily spend limit exceeded. Request a higher limit through Neon support: https://neon.com/docs/introduction/support"
}
```

<NeedHelp/>
