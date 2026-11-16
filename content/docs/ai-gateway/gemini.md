---
title: Gemini API
subtitle: Use the Google Gemini API with Neon AI Gateway
summary: >-
  The Gemini endpoint exposes the Google Gemini generateContent and
  streamGenerateContent APIs through Neon AI Gateway. Use the google-genai SDK
  with a custom base URL.
enableTableOfContents: true
updatedOn: '2026-11-15T17:20:24.920Z'
---

The Gemini endpoint exposes the [Google Gemini API](https://ai.google.dev/api/generate-content) through Neon AI Gateway. Use it when you're already working with the `google-genai` SDK and want to keep your existing code. For most use cases, the [chat completions](/docs/ai-gateway/chat-completions) endpoint is simpler to set up and works with Gemini models via the OpenAI SDK.

**Supported actions:** `:generateContent` and `:streamGenerateContent`

**Endpoint pattern:** `https://<branch-host>/gemini/v1beta/models/<model>:<action>`

<Admonition type="note">
Only `generateContent` and `streamGenerateContent` are supported. Requests to other actions (such as `countTokens`) return `404 unsupported gemini action`.
</Admonition>

This endpoint is also reachable at the longer `/ai-gateway/gemini/v1beta/models/<model>:<action>` path. Both behave identically and neither is deprecated. See [Shorter paths](/docs/ai-gateway/models#shorter-paths) for the full list of aliases.

## Setup

Set these environment variables. See [Get started](/docs/ai-gateway/get-started) for how to obtain them.

```bash
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://br-winter-pond-aptw82ef-api.ai.c-2.us-east-2.aws.neon.tech
```

## Supported models

This endpoint accepts Google models only:

| Model ID                | Notes                                                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gemini-4-argon`        | Supports `temperature` and `thinkingConfig.thinkingLevel` on this endpoint, but not on [chat completions](/docs/ai-gateway/chat-completions#switching-models). |
| `gemini-3-8-flash`      |                                                                                                                                                                |
| `gemini-3-7-flash`      |                                                                                                                                                                |
| `gemini-3-6-flash`      |                                                                                                                                                                |
| `gemini-3-5-flash`      |                                                                                                                                                                |
| `gemini-3-5-flash-lite` |                                                                                                                                                                |
| `gemini-3-1-pro`        |                                                                                                                                                                |
| `gemini-3-1-flash-lite` |                                                                                                                                                                |
| `gemini-3-flash`        |                                                                                                                                                                |

Sending a non-Google model ID returns `400 model "<model-id>" is not available on the gemini_generate_content endpoint`, naming whichever model you sent. Use the [chat completions endpoint](/docs/ai-gateway/chat-completions) if you want to call Gemini models alongside other providers from the same code.

## Basic request

<Admonition type="note">
The `google-genai` SDK's `apiKey` option sends an `x-goog-api-key` header, but Neon AI Gateway expects `Authorization: Bearer <token>`. Set your credential as an explicit header instead, and pass any non-empty string as `apiKey` since the SDK requires the field even though the gateway ignores it.

The gateway serves the Gemini API at `v1beta`. `google-genai` 3.x defaults to `v1`, so set the API version explicitly in `httpOptions` (`apiVersion` in TypeScript, `api_version` in Python) as shown in the examples. Without it, the SDK calls `/gemini/v1/models/...` and the gateway returns `404 page not found`.
</Admonition>

<CodeTabs labels={["TypeScript (google-genai)", "Python (google-genai)", "cURL"]}>

```typescript shouldWrap
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
  apiKey: 'placeholder',
  httpOptions: {
    apiVersion: 'v1beta',
    baseUrl: `${process.env.NEON_AI_GATEWAY_BASE_URL}/gemini`,
    headers: {
      Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}`,
    },
  },
});

const response = await client.models.generateContent({
  model: 'gemini-3-flash',
  contents: [{ role: 'user', parts: [{ text: 'What is Neon?' }] }],
});

console.log(response.text);
```

```python shouldWrap
from google import genai
from google.genai import types
import os

client = genai.Client(
    api_key='placeholder',
    http_options=types.HttpOptions(
        api_version='v1beta',
        base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/gemini",
        headers={'Authorization': f"Bearer {os.environ['NEON_AI_GATEWAY_TOKEN']}"},
    ),
)

response = client.models.generate_content(
    model='gemini-3-flash',
    contents='What is Neon?',
)

print(response.text)
```

```bash shouldWrap
curl -X POST \
  "$NEON_AI_GATEWAY_BASE_URL/gemini/v1beta/models/gemini-3-flash:generateContent" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
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
  model: 'gemini-3-flash',
  contents: [{ role: 'user', parts: [{ text: 'Explain database branching.' }] }],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text ?? '');
}
```

```python shouldWrap
for chunk in client.models.generate_content_stream(
    model='gemini-3-flash',
    contents='Explain database branching.',
):
    print(chunk.text, end='', flush=True)
```

</CodeTabs>

## Google Search grounding

The Gemini API supports the [Google Search grounding tool](https://ai.google.dev/gemini-api/docs/google-search). Add `{"google_search": {}}` to the request's `tools`, and the model can search Google on its own and ground its answer in the results. The search runs on Google's side, inside the model call. The gateway forwards the tool and returns the `groundingMetadata` that comes back, including the queries the model ran and the sources it cited.

The search is authenticated by your [Neon AI Gateway credential](/docs/ai-gateway/authentication), the same as any other request, so you don't need a separate Google API key, a Custom Search JSON API key, or a Google Cloud project.

<CodeTabs labels={["TypeScript (google-genai)", "Python (google-genai)", "cURL"]}>

```typescript shouldWrap
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
  apiKey: 'placeholder',
  httpOptions: {
    apiVersion: 'v1beta',
    baseUrl: `${process.env.NEON_AI_GATEWAY_BASE_URL}/gemini`,
    headers: {
      Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}`,
    },
  },
});

const response = await client.models.generateContent({
  model: 'gemini-3-flash',
  contents: [{ role: 'user', parts: [{ text: 'Who won the 2026 Nobel Prize in Physics?' }] }],
  config: {
    tools: [{ googleSearch: {} }],
  },
});

console.log(response.text);

const metadata = response.candidates?.[0]?.groundingMetadata;
for (const chunk of metadata?.groundingChunks ?? []) {
  console.log(chunk.web?.domain, chunk.web?.uri);
}
```

```python shouldWrap
from google import genai
from google.genai import types
import os

client = genai.Client(
    api_key='placeholder',
    http_options=types.HttpOptions(
        api_version='v1beta',
        base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/gemini",
        headers={'Authorization': f"Bearer {os.environ['NEON_AI_GATEWAY_TOKEN']}"},
    ),
)

response = client.models.generate_content(
    model='gemini-3-flash',
    contents='Who won the 2026 Nobel Prize in Physics?',
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())]
    ),
)

print(response.text)

metadata = response.candidates[0].grounding_metadata
print(metadata.web_search_queries)
for chunk in metadata.grounding_chunks or []:
    print(chunk.web.domain, chunk.web.uri)
```

```bash shouldWrap
curl -X POST \
  "$NEON_AI_GATEWAY_BASE_URL/gemini/v1beta/models/gemini-3-flash:generateContent" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"role": "user", "parts": [{"text": "Who won the 2026 Nobel Prize in Physics?"}]}],
    "tools": [{"google_search": {}}]
  }'
```

</CodeTabs>

The response includes the model's text plus a `groundingMetadata` object:

```json
{
  "candidates": [
    {
      "content": { "role": "model", "parts": [{ "text": "..." }] },
      "groundingMetadata": {
        "webSearchQueries": [
          "2026 Nobel Prize in Physics winner",
          "who won the 2026 Nobel Prize in Physics?",
          "Nobel Prize in Physics 2026 announcement date"
        ]
        "groundingChunks": [
          {
            "web": {
              "uri": "https://...",
              "title": "forbes.com",
              "domain": "forbes.com"
            }
          }
        ]
      }
    }
  ]
}
```

The model decides whether to search. There's no way to invoke a search directly or force one, so a request that doesn't need current information may come back with no grounding at all. Check for `groundingMetadata` before treating an answer as sourced.

<Admonition type="note">
`groundingChunks[].web.uri` is a Google redirect URL, not the site's URL directly. Use `web.domain` for the source domain, and fetch the URI server-side to resolve it, or render it as a citation link.
</Admonition>

### Using this with ADK

Use the `google.adk.models.Gemini` class to create a Gemini model instance with the Neon AI Gateway base URL and your AI Gateway token:

```python
import os

from google.adk.agents import Agent
from google.adk.models import Gemini
from google.adk.tools import google_search
from google.adk.apps.app import App

model = Gemini(
    model="gemini-3-flash",
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/gemini",
    client_kwargs={
        "api_key": os.environ["NEON_AI_GATEWAY_TOKEN"],
        "http_options": {
            "headers": {
                "Authorization": f"Bearer {os.environ['NEON_AI_GATEWAY_TOKEN']}"
            },
        },
    },
)

root_agent = Agent(
    name="FactChecker",
    model=model,
    instruction="Verify claims using web search.",
    tools=[google_search],
)

app = App(name="fact_checker", root_agent=root_agent)
```

The code above implements a simple fact-checking agent using Google ADK, leveraging the `google_search` tool to ground its responses in relevant web search results.

## URL structure

The gateway uses the model ID and action directly in the URL path. The `google-genai` SDK constructs this from the base URL, API version, and model parameter:

```
base_url:    https://<branch-host>/gemini
api_version: v1beta
model:       gemini-3-flash
action:      generateContent or streamGenerateContent

→ https://<branch-host>/gemini/v1beta/models/gemini-3-flash:generateContent
→ https://<branch-host>/gemini/v1beta/models/gemini-3-flash:streamGenerateContent
```

When calling the REST API directly, the model ID and action must appear in the path as shown above.

## Error handling

| Status            | Message                                                                       | Cause                                                                 |
| ----------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `400 Bad Request` | `unknown model "<model-id>"`                                                  | Model ID not in the catalog                                           |
| `400 Bad Request` | `model "<model-id>" is not available on the gemini_generate_content endpoint` | Non-Google model sent to this endpoint                                |
| `404 Not Found`   | `unsupported gemini action`                                                   | Action other than `generateContent` or `streamGenerateContent` in URL |
| `404 Not Found`   | `invalid gemini model path`                                                   | Malformed `model:action` segment in URL                               |

For authentication, quota, and upstream errors, see [Troubleshooting](/docs/ai-gateway/troubleshooting).

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog
- [Chat completions](/docs/ai-gateway/chat-completions): use Gemini models via the unified OpenAI-compatible endpoint
- [Authentication](/docs/ai-gateway/authentication): credential scopes and branch binding

<NeedHelp/>
