---
title: Embeddings
subtitle: The OpenAI-compatible embeddings endpoint
summary: >-
  Neon AI Gateway serves text-embedding models on an OpenAI-compatible
  /v1/embeddings endpoint. Use short model IDs like qwen3-embedding-0-6b or
  gte-large-en, both 1024-dimensional, with the same Neon credential you use for
  chat completions.
enableTableOfContents: true
updatedOn: '2026-09-26T00:49:26.569Z'
---

Embeddings turn text into vectors that capture meaning, so you can match text by what it means rather than by the exact words. They power semantic search, recommendations, clustering, and retrieval-augmented generation (RAG).

The Neon AI Gateway embeddings endpoint generates those vectors so you can store and search them in Postgres. It's compatible with the [OpenAI Embeddings API](https://platform.openai.com/docs/api-reference/embeddings): the same OpenAI SDK you use elsewhere works against the gateway, using the same Neon credential as the other AI Gateway endpoints.

**Base URL:** `https://<branch-host>/v1`

This endpoint is also reachable at the longer `/ai-gateway/mlflow/v1/embeddings` path. Both behave identically and neither is deprecated. See [Shorter paths](/docs/ai-gateway/models#shorter-paths).

<Admonition type="important" title="OpenAI JavaScript SDK v6: pass encoding_format: float">
On the `openai` JavaScript/TypeScript SDK **v6**, pass `encoding_format: "float"` on embedding calls (as shown below), or upgrade to v7 or later. Without it, v6 returns a broken all-zeros vector with no error. The Python SDK and raw HTTP are unaffected.
</Admonition>

## Models

Two embedding models are available today. Both return **1024-dimensional** vectors and are billed on **input tokens only**.

| Model ID               | Dimensions | Notes                                                                                                                            |
| ---------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `qwen3-embedding-0-6b` | 1024       | Unit-normalized (L2 norm = 1), so dot product equals cosine similarity. Supports the `dimensions` parameter for shorter vectors. |
| `gte-large-en`         | 1024       | Not normalized (L2 norm ≈ 24). Use cosine distance, or normalize the vectors yourself. Ignores the `dimensions` parameter.       |

Use the short model IDs shown above. The `databricks-` prefixed forms (`databricks-qwen3-embedding-0-6b`, `databricks-gte-large-en`) are also accepted.

## Setup

The examples use two environment variables:

```bash
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://br-...
```

Run `neon env pull --file .env` to write both to your `.env` for the current branch (`neon deploy` and `neon config apply` also pull them). You can also copy them from the Neon Console's **Connect** panel, on the **AI Gateway** tab. Inside Neon Functions they're injected automatically. See [Authentication](/docs/ai-gateway/authentication) for details.

The examples below use the `openai` SDK. Install it with `npm install openai` or `pip install openai`.

## Basic request

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const response = await client.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: 'The quick brown fox jumps over the lazy dog.',
  encoding_format: 'float', // required on the openai SDK v6; harmless on v7+
});

console.log(response.data[0].embedding.length); // 1024
```

```python shouldWrap
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1",
)

response = client.embeddings.create(
    model="qwen3-embedding-0-6b",
    input="The quick brown fox jumps over the lazy dog.",
)

print(len(response.data[0].embedding))  # 1024
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/v1/embeddings" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-embedding-0-6b",
    "input": "The quick brown fox jumps over the lazy dog."
  }'
```

</CodeTabs>

## Response shape

The response is OpenAI-compatible: a list of embedding objects, one per input, each with the vector and its position.

```json
{
  "id": "...",
  "object": "list",
  "model": "qwen3-embedding-0-6b-112025",
  "data": [
    {
      "index": 0,
      "object": "embedding",
      "embedding": [-0.0149, 0.0172, -0.0119, "..."]
    }
  ],
  "usage": { "prompt_tokens": 11, "total_tokens": 11 }
}
```

The `model` field reports the resolved, versioned name that served the request (`qwen3-embedding-0-6b-112025` here), which is handy for logging. Keep sending the short model ID (`qwen3-embedding-0-6b` or `gte-large-en`) in your requests.

## Batch input

Pass an array of strings to embed many inputs in one request. The response returns one embedding per input, in the same order, with a matching `index`.

<CodeTabs labels={["TypeScript (OpenAI SDK)", "Python (OpenAI SDK)"]}>

```typescript shouldWrap
const response = await client.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: ['First document.', 'Second document.', 'Third document.'],
  encoding_format: 'float',
});

for (const item of response.data) {
  console.log(item.index, item.embedding.length);
}
```

```python shouldWrap
response = client.embeddings.create(
    model="qwen3-embedding-0-6b",
    input=["First document.", "Second document.", "Third document."],
)

for item in response.data:
    print(item.index, len(item.embedding))
```

</CodeTabs>

## Shorter vectors with `dimensions`

`qwen3-embedding-0-6b` supports the `dimensions` parameter to return a shorter, Matryoshka-style vector (for example `dimensions: 256`), which trades some accuracy for smaller storage and faster search. `gte-large-en` ignores this parameter and always returns 1024 dimensions.

```typescript shouldWrap
const response = await client.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: 'A shorter embedding.',
  dimensions: 256,
  encoding_format: 'float',
});

console.log(response.data[0].embedding.length); // 256
```

## Choosing a distance operator

The two models differ in how their vectors are scaled, which affects the pgvector operator class you index and query with:

- **`qwen3-embedding-0-6b`** is unit-normalized (every vector has L2 norm 1), so cosine distance and inner product rank results identically. Cosine (`vector_cosine_ops`, `<=>`) is a safe default.
- **`gte-large-en`** is not normalized (L2 norm ≈ 24). Use cosine distance (`vector_cosine_ops`, `<=>`), which is scale-invariant, or normalize the vectors before storing them.

For an end-to-end example that stores AI Gateway embeddings in Postgres and searches them, see [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started).

## Not supported

- **Streaming.** Embeddings don't stream. A request with `stream: true` returns `400`.
- **Wrong endpoint.** An embedding model called on a chat endpoint (or a chat model on this endpoint) is rejected. Send embedding requests to `/v1/embeddings`.

## Error handling

| Status                  | Meaning               | Common cause                                                                                     |
| ----------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `400 Bad Request`       | Invalid request       | Unknown model ID, an embedding model used on a chat endpoint, or `stream: true`                  |
| `401 Unauthorized`      | Authentication failed | Missing or invalid `NEON_AI_GATEWAY_TOKEN`                                                       |
| `403 Forbidden`         | Access denied         | Credential lacks `ai_gateway:invoke` scope, or branch not in credential lineage                  |
| `429 Too Many Requests` | Quota or rate limited | Account quota or per-minute token limit. See [Rate limits](/docs/ai-gateway/models#rate-limits). |

## Next steps

- [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started): store and search AI Gateway embeddings in Postgres
- [Models](/docs/ai-gateway/models): full model catalog
- [Chat completions](/docs/ai-gateway/chat-completions): the OpenAI-compatible chat endpoint

<NeedHelp/>
