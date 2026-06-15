---
title: OpenAI Responses API
subtitle: Use the OpenAI Responses API with Neon AI Gateway
summary: >-
  The OpenAI Responses endpoint exposes the OpenAI Responses API through Neon
  AI Gateway. Required for gpt-5-5-pro and codex model variants, which do not
  work with the chat completions endpoint.
enableTableOfContents: true
updatedOn: '2026-06-15T08:51:16.298Z'
---

The OpenAI Responses endpoint exposes the [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses) through Neon AI Gateway. Use it with the OpenAI SDK's `responses.create()` method by changing only the `baseURL`.

**Base URL:** `https://<branch-host>/ai-gateway/openai/v1`

<Admonition type="warning">
`databricks-gpt-5-5-pro` and all codex model variants (`databricks-gpt-5-3-codex`, `databricks-gpt-5-2-codex`, `databricks-gpt-5-1-codex-max`, `databricks-gpt-5-1-codex-mini`) **require this endpoint**. They do not work with the [chat completions endpoint](/docs/ai-gateway/chat-completions).
</Admonition>

## Supported models

This endpoint accepts OpenAI models only:

| Model ID                        | Notes                  |
| ------------------------------- | ---------------------- |
| `databricks-gpt-5-5-pro`        | Requires this endpoint |
| `databricks-gpt-5-5`            |                        |
| `databricks-gpt-5-4`            |                        |
| `databricks-gpt-5-4-mini`       |                        |
| `databricks-gpt-5-4-nano`       |                        |
| `databricks-gpt-5-3-codex`      | Requires this endpoint |
| `databricks-gpt-5-2-codex`      | Requires this endpoint |
| `databricks-gpt-5-2`            |                        |
| `databricks-gpt-5-1-codex-max`  | Requires this endpoint |
| `databricks-gpt-5-1-codex-mini` | Requires this endpoint |
| `databricks-gpt-5-1`            |                        |

Sending a non-OpenAI model ID returns `400 model is not available on this endpoint`.

## Basic request

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_KEY,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/openai/v1`,
});

const response = await client.responses.create({
  model: 'databricks-gpt-5-4',
  input: [{ role: 'user', content: 'What is Neon?' }],
});

console.log(response.output_text);
```

```python shouldWrap
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ['NEON_AI_GATEWAY_KEY'],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/openai/v1",
)

response = client.responses.create(
    model='databricks-gpt-5-4',
    input=[{'role': 'user', 'content': 'What is Neon?'}],
)

print(response.output_text)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/openai/v1/responses" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "databricks-gpt-5-4",
    "input": [{"role": "user", "content": "What is Neon?"}]
  }'
```

</CodeTabs>

## Streaming

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
const stream = await client.responses.create({
  model: 'databricks-gpt-5-4',
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
    model='databricks-gpt-5-4',
    input=[{'role': 'user', 'content': 'Explain database branching.'}],
) as stream:
    for event in stream:
        if event.type == 'response.output_text.delta':
            print(event.delta, end='', flush=True)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/openai/v1/responses" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "databricks-gpt-5-4",
    "input": [{"role": "user", "content": "Explain database branching."}],
    "stream": true
  }'
```

</CodeTabs>

## Error handling

| Status            | Message                                   | Cause                                  |
| ----------------- | ----------------------------------------- | -------------------------------------- |
| `400 Bad Request` | `unknown model`                           | Model ID not in the catalog            |
| `400 Bad Request` | `model is not available on this endpoint` | Non-OpenAI model sent to this endpoint |

For authentication, quota, and upstream errors, see [Troubleshooting](/docs/ai-gateway/troubleshooting).

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog and which models require this endpoint
- [Chat completions](/docs/ai-gateway/chat-completions): use any model via the unified OpenAI-compatible endpoint
- [Authentication](/docs/ai-gateway/authentication): credential scopes and branch binding

<NeedHelp/>
