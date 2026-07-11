---
title: Anthropic Messages API
subtitle: Use the Anthropic SDK with Neon AI Gateway
summary: >-
  The Anthropic Messages endpoint lets you use the Anthropic SDK with Neon AI
  Gateway by changing only the base URL. Supports streaming, prompt caching,
  and extended thinking on Claude models.
enableTableOfContents: true
updatedOn: '2026-07-11T13:41:14.778Z'
---

<PrivatePreviewEnquire/>

The Anthropic Messages endpoint exposes the [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) through Neon AI Gateway. Use it when you need extended thinking or prompt caching, which require the native Anthropic SDK. For standard completions, the [chat completions](/docs/ai-gateway/chat-completions) endpoint works with all Anthropic models and doesn't require the Anthropic SDK.

**Base URL:** `https://<branch-host>/ai-gateway/anthropic`

<Admonition type="note">
The Anthropic SDK appends `/v1/messages` to the base URL automatically. Set the base URL to `/ai-gateway/anthropic` (without `/v1`).
</Admonition>

This endpoint is also reachable at the shorter `/v1/anthropic/v1/messages` path (no `/ai-gateway` prefix). Both behave identically. See [Shorter /v1 paths](/docs/ai-gateway/models#shorter-v1-paths) for the full list of aliases.

## Setup

Set these environment variables. See [Get started](/docs/ai-gateway/get-started) for how to obtain them.

```bash
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://br-winter-pond-aptw82ef-api.ai.c-2.us-east-2.aws.neon.tech
```

## Supported models

This endpoint accepts Anthropic models only. See the [AI Gateway catalog](/docs/ai-gateway/models) for the full list. Supported models:

- `claude-opus-4-8`, `claude-opus-4-7`, `claude-opus-4-6`, `claude-opus-4-5`, `claude-opus-4-1`
- `claude-sonnet-4-6`, `claude-sonnet-4-5`, `claude-sonnet-4`
- `claude-haiku-4-5`

Sending a non-Anthropic model ID returns `400 model "<model-id>" is not available on the anthropic_messages endpoint`, naming whichever model you sent. Use the [chat completions endpoint](/docs/ai-gateway/chat-completions) if you need to call multiple providers from the same code.

## Basic request

<CodeTabs labels={["TypeScript (Anthropic SDK)", "Python (Anthropic SDK)", "cURL"]}>

```typescript shouldWrap
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/anthropic`,
});

const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is Neon?' }],
});

console.log(message.content[0].text);
```

```python shouldWrap
import anthropic
import os

client = anthropic.Anthropic(
    api_key=os.environ['NEON_AI_GATEWAY_TOKEN'],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/anthropic",
)

message = client.messages.create(
    model='claude-sonnet-4-6',
    max_tokens=1024,
    messages=[{'role': 'user', 'content': 'What is Neon?'}],
)

print(message.content[0].text)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/anthropic/v1/messages" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is Neon?"}]
  }'
```

</CodeTabs>

## Streaming

Streaming works the same as with the Anthropic SDK directly. Use `client.messages.stream()` or pass `"stream": true` in a cURL request. The only change from standard usage is `base_url`.

## Prompt caching

The gateway forwards the `cache_control` field to Anthropic unchanged. Prompt caching works exactly as described in the [Anthropic prompt caching docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching).

<CodeTabs labels={["TypeScript (Anthropic SDK)", "Python (Anthropic SDK)"]}>

```typescript shouldWrap
const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
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
    model='claude-sonnet-4-6',
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

## Extended thinking

The gateway forwards the `thinking` parameter to Anthropic unchanged. Set `budget_tokens` to control how many tokens Claude can use for thinking. `max_tokens` must be greater than `budget_tokens`.

<CodeTabs labels={["TypeScript (Anthropic SDK)", "Python (Anthropic SDK)"]}>

```typescript shouldWrap
const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 16000,
  thinking: {
    type: 'enabled',
    budget_tokens: 10000,
  },
  messages: [{ role: 'user', content: 'Design a database schema for a multi-tenant SaaS app.' }],
});

for (const block of message.content) {
  if (block.type === 'thinking') {
    console.log('Thinking:', block.thinking);
  } else if (block.type === 'text') {
    console.log(block.text);
  }
}
```

```python shouldWrap
message = client.messages.create(
    model='claude-sonnet-4-6',
    max_tokens=16000,
    thinking={
        'type': 'enabled',
        'budget_tokens': 10000,
    },
    messages=[{'role': 'user', 'content': 'Design a database schema for a multi-tenant SaaS app.'}],
)

for block in message.content:
    if block.type == 'thinking':
        print('Thinking:', block.thinking)
    elif block.type == 'text':
        print(block.text)
```

</CodeTabs>

## Forwarded headers

The gateway forwards these request headers to the upstream provider:
`Accept`, `Anthropic-Beta`, `Anthropic-Version`, `Content-Type`, `User-Agent`.

All other headers are stripped. The `Authorization` header is replaced with the workspace credential before forwarding. Your `NEON_AI_GATEWAY_TOKEN` is never sent to Anthropic directly.

## Error handling

| Status            | Message                                                                  | Cause                                     |
| ----------------- | ------------------------------------------------------------------------ | ----------------------------------------- |
| `400 Bad Request` | `unknown model "<model-id>"`                                             | Model ID not in the catalog               |
| `400 Bad Request` | `model "<model-id>" is not available on the anthropic_messages endpoint` | Non-Anthropic model sent to this endpoint |

For authentication, quota, and upstream errors, see [Troubleshooting](/docs/ai-gateway/troubleshooting).

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog
- [Chat completions](/docs/ai-gateway/chat-completions): use any model including Anthropic via the unified endpoint
- [Authentication](/docs/ai-gateway/authentication): credential scopes and branch binding

<NeedHelp/>
