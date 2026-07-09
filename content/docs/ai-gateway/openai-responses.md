---
title: OpenAI Responses API
subtitle: Use the OpenAI Responses API with Neon AI Gateway
summary: >-
  The OpenAI Responses endpoint exposes the OpenAI Responses API through Neon
  AI Gateway. Required for codex model variants, which do not work with the
  chat completions endpoint.
enableTableOfContents: true
updatedOn: '2026-07-09T23:06:44.844Z'
---

<PrivatePreviewEnquire/>

The OpenAI Responses endpoint exposes the [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses) through Neon AI Gateway. Use it with the OpenAI SDK's `responses.create()` method by changing only the `baseURL`.

**Base URL:** `https://<branch-host>/ai-gateway/openai/v1`

This endpoint is also reachable at the shorter `/v1/responses` path (no `/ai-gateway/openai` prefix). Both behave identically. See [Shorter /v1 paths](/docs/ai-gateway/models#shorter-v1-paths) for the full list of aliases.

If you're using an OpenAI-compatible client that accepts a base URL, set it to either `https://<branch-host>/ai-gateway/openai/v1` or `https://<branch-host>/v1`. The request and response shapes are the standard OpenAI Responses API shape.

<Admonition type="warning">
All codex model variants (`gpt-5-3-codex`, `gpt-5-2-codex`, `gpt-5-1-codex-max`, `gpt-5-1-codex-mini`) **require this endpoint**. They do not work with the [chat completions endpoint](/docs/ai-gateway/chat-completions).
</Admonition>

## Setup

Set these environment variables. See [Get started](/docs/ai-gateway/get-started) for how to obtain them.

```bash
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://br-winter-pond-aptw82ef-api.ai.c-2.us-east-2.aws.neon.tech
```

## Supported models

This endpoint accepts OpenAI models only:

| Model ID             | Notes                  |
| -------------------- | ---------------------- |
| `gpt-5-4`            |                        |
| `gpt-5-4-mini`       |                        |
| `gpt-5-4-nano`       |                        |
| `gpt-5-3-codex`      | Requires this endpoint |
| `gpt-5-2-codex`      | Requires this endpoint |
| `gpt-5-2`            |                        |
| `gpt-5-1-codex-max`  | Requires this endpoint |
| `gpt-5-1-codex-mini` | Requires this endpoint |
| `gpt-5-1`            |                        |
| `gpt-5`              |                        |
| `gpt-5-mini`         |                        |
| `gpt-5-nano`         |                        |

Sending a non-OpenAI model ID returns `400 model "claude-sonnet-4-6" is not available on the openai_responses endpoint`.

## Basic request

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/openai/v1`,
});

const response = await client.responses.create({
  model: 'gpt-5-4',
  input: [{ role: 'user', content: 'What is Neon?' }],
});

console.log(response.output_text);
```

```python shouldWrap
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ['NEON_AI_GATEWAY_TOKEN'],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/openai/v1",
)

response = client.responses.create(
    model='gpt-5-4',
    input=[{'role': 'user', 'content': 'What is Neon?'}],
)

print(response.output_text)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/openai/v1/responses" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-4",
    "input": [{"role": "user", "content": "What is Neon?"}]
  }'
```

</CodeTabs>

## Streaming

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
const stream = await client.responses.create({
  model: 'gpt-5-4',
  input: [{ role: 'user', content: 'Explain database branching.' }],
  stream: true,
});

for await (const event of stream) {
  if (event.type === 'response.output_text.delta') {
    process.stdout.write(event.delta);
  }
}
```

```python shouldWrap
with client.responses.stream(
    model='gpt-5-4',
    input=[{'role': 'user', 'content': 'Explain database branching.'}],
) as stream:
    for event in stream:
        if event.type == 'response.output_text.delta':
            print(event.delta, end='', flush=True)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/openai/v1/responses" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-4",
    "input": [{"role": "user", "content": "Explain database branching."}],
    "stream": true
  }'
```

</CodeTabs>

## Image generation with Vercel AI SDK

The `@neon/ai-sdk-provider` package re-exports the OpenAI provider's Responses image-generation tool as `neon.tools.imageGeneration()`. Use it with OpenAI-routed models such as `gpt-5-mini`.

Use `streamText`, not `generateText`: image results are returned as tool-result parts, and streaming avoids the gateway's non-streaming response-size cap for base64 image data.

```typescript shouldWrap
import { neon } from '@neon/ai-sdk-provider';
import { streamText } from 'ai';

const result = streamText({
  model: neon('gpt-5-mini'),
  messages: [{ role: 'user', content: 'Create a simple Neon database mascot.' }],
  tools: {
    image: neon.tools.imageGeneration({
      outputFormat: 'jpeg',
      size: '1024x1024',
      partialImages: 3,
    }),
  },
});

return result.toUIMessageStreamResponse();
```

AI SDK `generateImage()` is not supported by AI Gateway; image generation is available only through this Responses tool.

## Error handling

| Status            | Message                                                                       | Cause                                  |
| ----------------- | ----------------------------------------------------------------------------- | -------------------------------------- |
| `400 Bad Request` | `unknown model "<model-id>"`                                                  | Model ID not in the catalog            |
| `400 Bad Request` | `model "claude-sonnet-4-6" is not available on the openai_responses endpoint` | Non-OpenAI model sent to this endpoint |

For authentication, quota, and upstream errors, see [Troubleshooting](/docs/ai-gateway/troubleshooting).

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog and which models require this endpoint
- [Chat completions](/docs/ai-gateway/chat-completions): use any model via the unified OpenAI-compatible endpoint
- [Authentication](/docs/ai-gateway/authentication): credential scopes and branch binding

<NeedHelp/>
