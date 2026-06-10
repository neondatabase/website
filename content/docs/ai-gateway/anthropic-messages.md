---
title: Anthropic Messages API
subtitle: Use the Anthropic SDK with Neon AI Gateway
summary: >-
  The Anthropic Messages endpoint lets you use the Anthropic SDK with Neon AI
  Gateway by changing only the base URL. Supports streaming, prompt caching,
  and extended thinking on Claude models.
enableTableOfContents: true
updatedOn: '2026-06-10T17:21:35.055Z'
---

The Anthropic Messages endpoint exposes the [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) through Neon AI Gateway. Use it with the official Anthropic SDK by changing only the `base_url`. Prompt caching, extended thinking, and streaming all work without additional configuration.

**Base URL:** `https://<branch-host>/ai-gateway/anthropic`

<Admonition type="note">
The Anthropic SDK appends `/v1/messages` to the base URL automatically. Set the base URL to `/ai-gateway/anthropic` (without `/v1`).
</Admonition>

## Supported models

This endpoint accepts Anthropic models only. Use the `databricks-` prefixed model IDs from the [AI Gateway catalog](/docs/ai-gateway/models):

- `databricks-claude-opus-4-8`, `databricks-claude-opus-4-7`, `databricks-claude-opus-4-6`, `databricks-claude-opus-4-5`
- `databricks-claude-sonnet-4-6`
- `databricks-claude-haiku-4-5`

Sending a non-Anthropic model ID returns `400 model is not available on this endpoint`. Use the [chat completions endpoint](/docs/ai-gateway/chat-completions) if you need to call multiple providers from the same code.

## Basic request

<CodeTabs labels={["TypeScript (Anthropic SDK)", "Python (Anthropic SDK)", "cURL"]}>

```typescript shouldWrap
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.NEON_AI_GATEWAY_KEY,
  baseURL: `https://${process.env.NEON_AI_GATEWAY_HOST}/ai-gateway/anthropic`,
});

const message = await client.messages.create({
  model: 'databricks-claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is Neon?' }],
});

console.log(message.content[0].text);
```

```python shouldWrap
import anthropic
import os

client = anthropic.Anthropic(
    api_key=os.environ['NEON_AI_GATEWAY_KEY'],
    base_url=f"https://{os.environ['NEON_AI_GATEWAY_HOST']}/ai-gateway/anthropic",
)

message = client.messages.create(
    model='databricks-claude-sonnet-4-6',
    max_tokens=1024,
    messages=[{'role': 'user', 'content': 'What is Neon?'}],
)

print(message.content[0].text)
```

```bash shouldWrap
curl -X POST "https://$NEON_AI_GATEWAY_HOST/ai-gateway/anthropic/v1/messages" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "databricks-claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is Neon?"}]
  }'
```

</CodeTabs>

## Streaming

<CodeTabs labels={["TypeScript (Anthropic SDK)", "Python (Anthropic SDK)", "cURL"]}>

```typescript shouldWrap
const stream = client.messages.stream({
  model: 'databricks-claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain database branching.' }],
});

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

```python shouldWrap
with client.messages.stream(
    model='databricks-claude-sonnet-4-6',
    max_tokens=1024,
    messages=[{'role': 'user', 'content': 'Explain database branching.'}],
) as stream:
    for text in stream.text_stream:
        print(text, end='', flush=True)
```

```bash shouldWrap
curl -X POST "https://$NEON_AI_GATEWAY_HOST/ai-gateway/anthropic/v1/messages" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "databricks-claude-sonnet-4-6",
    "max_tokens": 1024,
    "stream": true,
    "messages": [{"role": "user", "content": "Explain database branching."}]
  }'
```

</CodeTabs>

## Prompt caching

The gateway forwards the `cache_control` field to Anthropic unchanged. Prompt caching works exactly as described in the [Anthropic prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching).

<CodeTabs labels={["TypeScript (Anthropic SDK)", "Python (Anthropic SDK)"]}>

```typescript shouldWrap
const message = await client.messages.create({
  model: 'databricks-claude-sonnet-4-6',
  max_tokens: 1024,
  system: [
    { type: 'text', text: 'You are a helpful assistant.' },
    {
      type: 'text',
      text: longDocumentContent,
      cache_control: { type: 'ephemeral' },
    },
  ],
  messages: [{ role: 'user', content: 'Summarize the key points.' }],
});

console.log(message.usage);
// { input_tokens: 50, output_tokens: 200,
//   cache_creation_input_tokens: 10000, cache_read_input_tokens: 0 }
```

```python shouldWrap
message = client.messages.create(
    model='databricks-claude-sonnet-4-6',
    max_tokens=1024,
    system=[
        {'type': 'text', 'text': 'You are a helpful assistant.'},
        {
            'type': 'text',
            'text': long_document_content,
            'cache_control': {'type': 'ephemeral'},
        },
    ],
    messages=[{'role': 'user', 'content': 'Summarize the key points.'}],
)

print(message.usage)
# input_tokens=50, output_tokens=200,
# cache_creation_input_tokens=10000, cache_read_input_tokens=0
```

</CodeTabs>

## Forwarded headers

The gateway forwards these request headers to the upstream provider:
`Accept`, `Anthropic-Beta`, `Anthropic-Version`, `Content-Type`, `User-Agent`.

All other headers are stripped. The `Authorization` header is replaced with the workspace credential before forwarding — your `NEON_AI_GATEWAY_KEY` is never sent to Anthropic directly.

## Error handling

| Status                  | Message                                     | Cause                                                   |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `400 Bad Request`       | `unknown model`                             | Model ID not in the catalog                             |
| `400 Bad Request`       | `model is not available on this endpoint`   | Non-Anthropic model ID sent to this endpoint            |
| `401 Unauthorized`      | `invalid or missing credential`             | Missing or invalid `NEON_AI_GATEWAY_KEY`                |
| `403 Forbidden`         | `credential not authorized for ai gateway`  | Credential lacks `ai_gateway:invoke` scope              |
| `403 Forbidden`         | `credential not authorized for this branch` | Credential's branch not in the request branch's lineage |
| `429 Too Many Requests` | `ai gateway quota exceeded`                 | Account quota blocked; check `Retry-After` header       |
| `502 Bad Gateway`       | `upstream request failed`                   | Upstream Anthropic/Databricks error; retry              |

## Next steps

- [Models](/docs/ai-gateway/models) — full model catalog
- [Chat completions](/docs/ai-gateway/chat-completions) — use any model including Anthropic via the unified endpoint
- [Authentication](/docs/ai-gateway/authentication) — credential scopes and branch binding

<NeedHelp/>
