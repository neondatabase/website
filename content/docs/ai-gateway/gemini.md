---
title: Gemini API
subtitle: Use the Google Gemini API with Neon AI Gateway
summary: >-
  The Gemini endpoint exposes the Google Gemini generateContent API through Neon
  AI Gateway. Use the google-genai SDK with a custom base URL. Only the
  generateContent action is supported.
enableTableOfContents: true
updatedOn: '2026-06-10T17:21:35.055Z'
---

The Gemini endpoint exposes the [Google Gemini generateContent API](https://ai.google.dev/api/generate-content) through Neon AI Gateway. Use the `google-genai` SDK with a custom base URL, or call the API directly.

**Endpoint pattern:** `https://<branch-host>/ai-gateway/gemini/v1beta/models/<model>:generateContent`

<Admonition type="note">
Only the `generateContent` action is supported. Requests to other actions (such as `streamGenerateContent` or `countTokens`) return `404 unsupported gemini action`. The `google-genai` SDK handles streaming via `generateContent` with a stream flag — this works correctly.
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
    baseUrl: `https://${process.env.NEON_AI_GATEWAY_HOST}/ai-gateway/gemini`,
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
        base_url=f"https://{os.environ['NEON_AI_GATEWAY_HOST']}/ai-gateway/gemini",
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
  "https://$NEON_AI_GATEWAY_HOST/ai-gateway/gemini/v1beta/models/databricks-gemini-2-5-flash:generateContent" \
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
action:   generateContent (SDK default)

→ https://<branch-host>/ai-gateway/gemini/v1beta/models/databricks-gemini-2-5-flash:generateContent
```

When calling the REST API directly, the model ID and `:generateContent` action must appear in the path as shown above.

## Error handling

| Status                  | Message                                     | Cause                                                   |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `400 Bad Request`       | `unknown model`                             | Model ID not in the catalog                             |
| `400 Bad Request`       | `model is not available on this endpoint`   | Non-Google model sent to this endpoint                  |
| `400 Bad Request`       | `missing or invalid model`                  | No model field in request body                          |
| `404 Not Found`         | `unsupported gemini action`                 | Action other than `generateContent` in the URL          |
| `404 Not Found`         | `invalid gemini model path`                 | Malformed `model:action` segment in URL                 |
| `401 Unauthorized`      | `invalid or missing credential`             | Missing or invalid `NEON_AI_GATEWAY_KEY`                |
| `403 Forbidden`         | `credential not authorized for ai gateway`  | Credential lacks `ai_gateway:invoke` scope              |
| `403 Forbidden`         | `credential not authorized for this branch` | Credential's branch not in the request branch's lineage |
| `429 Too Many Requests` | `ai gateway quota exceeded`                 | Account quota blocked; check `Retry-After` header       |
| `502 Bad Gateway`       | `upstream request failed`                   | Upstream Google/Databricks error; retry                 |

## Next steps

- [Models](/docs/ai-gateway/models) — full model catalog
- [Chat completions](/docs/ai-gateway/chat-completions) — use Gemini models via the unified OpenAI-compatible endpoint
- [Authentication](/docs/ai-gateway/authentication) — credential scopes and branch binding

<NeedHelp/>
