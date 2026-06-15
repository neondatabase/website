---
title: Gemini API
subtitle: Use the Google Gemini API with Neon AI Gateway
summary: >-
  The Gemini endpoint exposes the Google Gemini generateContent and
  streamGenerateContent APIs through Neon AI Gateway. Use the google-genai SDK
  with a custom base URL.
enableTableOfContents: true
updatedOn: '2026-06-15T13:34:36.031Z'
---

<PrivatePreviewEnquire/>

The Gemini endpoint exposes the [Google Gemini API](https://ai.google.dev/api/generate-content) through Neon AI Gateway. Use it when you're already working with the `google-genai` SDK and want to keep your existing code. For most use cases, the [chat completions](/docs/ai-gateway/chat-completions) endpoint is simpler to set up and works with Gemini models via the OpenAI SDK.

**Supported actions:** `:generateContent` and `:streamGenerateContent`

**Endpoint pattern:** `https://<branch-host>/ai-gateway/gemini/v1beta/models/<model>:<action>`

<Admonition type="note">
Only `generateContent` and `streamGenerateContent` are supported. Requests to other actions (such as `countTokens`) return `404 unsupported gemini action`.
</Admonition>

## Supported models

This endpoint accepts Google models only:

| Model ID                           | Notes |
| ---------------------------------- | ----- |
| `databricks-gemini-3-5-flash`      |       |
| `databricks-gemini-3-1-pro`        |       |
| `databricks-gemini-3-1-flash-lite` |       |
| `databricks-gemini-3-pro`          |       |
| `databricks-gemini-3-flash`        |       |
| `databricks-gemini-2-5-pro`        |       |
| `databricks-gemini-2-5-flash`      |       |

Sending a non-Google model ID returns `400 model is not available on this endpoint`. Use the [chat completions endpoint](/docs/ai-gateway/chat-completions) if you want to call Gemini models alongside other providers from the same code.

## Basic request

<CodeTabs labels={["TypeScript (google-genai)", "Python (google-genai)", "cURL"]}>

```typescript shouldWrap
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
  apiKey: process.env.NEON_AI_GATEWAY_KEY,
  httpOptions: {
    baseUrl: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/gemini`,
  },
});

const response = await client.models.generateContent({
  model: 'databricks-gemini-2-5-flash',
  contents: [{ role: 'user', parts: [{ text: 'What is Neon?' }] }],
});

console.log(response.text);
```

```python shouldWrap
from google import genai
from google.genai import types
import os

client = genai.Client(
    api_key=os.environ['NEON_AI_GATEWAY_KEY'],
    http_options=types.HttpOptions(
        base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/gemini",
    ),
)

response = client.models.generate_content(
    model='databricks-gemini-2-5-flash',
    contents='What is Neon?',
)

print(response.text)
```

```bash shouldWrap
curl -X POST \
  "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/gemini/v1beta/models/databricks-gemini-2-5-flash:generateContent" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"role": "user", "parts": [{"text": "What is Neon?"}]}]
  }'
```

</CodeTabs>

## Streaming

<CodeTabs labels={["TypeScript (google-genai)", "Python (google-genai)"]}>

```typescript shouldWrap
const stream = await client.models.generateContentStream({
  model: 'databricks-gemini-2-5-flash',
  contents: [{ role: 'user', parts: [{ text: 'Explain database branching.' }] }],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text ?? '');
}
```

```python shouldWrap
for chunk in client.models.generate_content_stream(
    model='databricks-gemini-2-5-flash',
    contents='Explain database branching.',
):
    print(chunk.text, end='', flush=True)
```

</CodeTabs>

## URL structure

The gateway uses the model ID and action directly in the URL path. The `google-genai` SDK constructs this automatically from the base URL and model parameter:

```
base_url: https://<branch-host>/ai-gateway/gemini
model:    databricks-gemini-2-5-flash
action:   generateContent or streamGenerateContent

→ https://<branch-host>/ai-gateway/gemini/v1beta/models/databricks-gemini-2-5-flash:generateContent
→ https://<branch-host>/ai-gateway/gemini/v1beta/models/databricks-gemini-2-5-flash:streamGenerateContent
```

When calling the REST API directly, the model ID and action must appear in the path as shown above.

## Error handling

| Status            | Message                                   | Cause                                                                 |
| ----------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| `400 Bad Request` | `unknown model`                           | Model ID not in the catalog                                           |
| `400 Bad Request` | `model is not available on this endpoint` | Non-Google model sent to this endpoint                                |
| `400 Bad Request` | `missing or invalid model`                | No model field in request body                                        |
| `404 Not Found`   | `unsupported gemini action`               | Action other than `generateContent` or `streamGenerateContent` in URL |
| `404 Not Found`   | `invalid gemini model path`               | Malformed `model:action` segment in URL                               |

For authentication, quota, and upstream errors, see [Troubleshooting](/docs/ai-gateway/troubleshooting).

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog
- [Chat completions](/docs/ai-gateway/chat-completions): use Gemini models via the unified OpenAI-compatible endpoint
- [Authentication](/docs/ai-gateway/authentication): credential scopes and branch binding

<NeedHelp/>
