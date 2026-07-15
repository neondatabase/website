---
title: Chat completions
subtitle: The OpenAI-compatible unified endpoint
summary: >-
  The chat completions endpoint is the recommended starting point for Neon AI
  Gateway. It is OpenAI Chat Completions-compatible, works with any model in
  the catalog, and lets you switch providers without changing your SDK code.
enableTableOfContents: true
updatedOn: '2026-07-09T23:06:44.844Z'
---

<PrivatePreviewEnquire/>

The chat completions endpoint is the recommended way to use Neon AI Gateway. It's fully compatible with the [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat) and works with every model in the [AI Gateway catalog](/docs/ai-gateway/models). Switch models by changing a single field.

**Base URL:** `https://<branch-host>/ai-gateway/mlflow/v1`

This endpoint is also reachable at the shorter `/v1/chat/completions` path (no `/ai-gateway/mlflow` prefix). Both behave identically. See [Shorter /v1 paths](/docs/ai-gateway/models#shorter-v1-paths) for the full list of aliases.

If you're using an OpenRouter-compatible client that asks for a base URL, set it to `https://<branch-host>/v1` and call `/chat/completions`.

## Setup

Set these environment variables. See [Get started](/docs/ai-gateway/get-started) for how to obtain them.

```bash
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://br-winter-pond-aptw82ef-api.ai.c-2.us-east-2.aws.neon.tech
```

## Basic request

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/mlflow/v1`,
});

const response = await client.chat.completions.create({
  model: 'claude-sonnet-4-6',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is Neon?' },
  ],
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

```python shouldWrap
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/mlflow/v1",
)

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is Neon?"},
    ],
    max_tokens=256,
)

print(response.choices[0].message.content)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is Neon?"}
    ],
    "max_tokens": 256
  }'
```

</CodeTabs>

## Streaming

Add `stream: true` to receive a server-sent events response.

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/mlflow/v1`,
});

const stream = await client.chat.completions.create({
  model: 'claude-sonnet-4-6',
  messages: [{ role: 'user', content: 'Explain branching in Postgres.' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```

```python shouldWrap
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/mlflow/v1",
)

with client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Explain branching in Postgres."}],
    stream=True,
) as stream:
    for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="", flush=True)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [{"role": "user", "content": "Explain branching in Postgres."}],
    "stream": true
  }'
```

</CodeTabs>

## Switching models

Change the `model` field to use a different provider. Everything else stays the same.

```typescript
// Anthropic
model: 'claude-sonnet-4-6'

// OpenAI
model: 'gpt-5-4'

// Google
model: 'gemini-2-5-flash'

// Alibaba
model: 'databricks-qwen35-122b-a10b'
```

See [Models](/docs/ai-gateway/models) for the full list.

## Rate limiting

There are two separate rate limit tiers:

- **Neon account quota:** enforced by Neon. Returns `429` with error code `REQUEST_LIMIT_EXCEEDED`. See [Rate limits](/docs/ai-gateway/models#rate-limits) for current limits.
- **Upstream provider limit:** enforced by the Databricks workspace serving the model. Returns `429` with forwarded rate limit headers.

When the upstream provider rate-limits a request, AI Gateway forwards the relevant headers so your client can back off correctly:

| Header                           | Description                                |
| -------------------------------- | ------------------------------------------ |
| `Retry-After`                    | Seconds to wait before retrying (RFC 9110) |
| `X-Ratelimit-Limit-Requests`     | Request limit                              |
| `X-Ratelimit-Remaining-Requests` | Remaining requests                         |
| `X-Ratelimit-Reset-Requests`     | Time until request limit resets            |
| `X-Ratelimit-Limit-Tokens`       | Token limit                                |
| `X-Ratelimit-Remaining-Tokens`   | Remaining tokens                           |
| `X-Ratelimit-Reset-Tokens`       | Time until token limit resets              |
| `Anthropic-Ratelimit-*`          | Anthropic-specific rate limit headers      |

## Error handling

| Status                         | Meaning                | Common cause                                                                                                                                 |
| ------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 Bad Request`              | Invalid request        | Unknown model ID, or model used on the wrong endpoint                                                                                        |
| `413 Request Entity Too Large` | Body too large         | Request body exceeds 32 MiB. Reduce the size of your request.                                                                                |
| `401 Unauthorized`             | Authentication failed  | Missing or invalid `NEON_AI_GATEWAY_TOKEN`                                                                                                   |
| `403 Forbidden`                | Access denied          | Credential lacks `ai_gateway:invoke` scope, or branch not in credential lineage                                                              |
| `429 Too Many Requests`        | Account quota exceeded | Your account's AI Gateway quota is blocked. Error code: `REQUEST_LIMIT_EXCEEDED`. Check `Retry-After` for when to retry, or contact support. |
| `429 Too Many Requests`        | Upstream rate limited  | Upstream provider rate limit. Check the `Retry-After` and `X-Ratelimit-*` headers.                                                           |
| `502 Bad Gateway`              | Upstream error         | Temporary issue with the upstream workspace. Retry the request.                                                                              |

Error responses use the standard OpenAI error format:

```json
{
  "error": {
    "message": "unknown model \"<model-id>\"",
    "type": "invalid_request_error",
    "code": "invalid_model"
  }
}
```

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog
- [Anthropic Messages API](/docs/ai-gateway/anthropic-messages): native Anthropic features
- [OpenAI Responses API](/docs/ai-gateway/openai-responses): Responses API endpoint
- [Authentication](/docs/ai-gateway/authentication): credential scopes and branch binding

<NeedHelp/>
