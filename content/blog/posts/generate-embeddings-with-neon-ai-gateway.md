---
title: Generate embeddings with Neon AI Gateway
description: The embedding step of your retrieval pipeline now runs on your branch
excerpt: >-
  Neon AI Gateway now serves embedding models on the same OpenAI-compatible
  endpoint and with the same credential you already use for chat. Generate
  vectors, store them in Lakebase Postgres, and query them with Lakebase Search,
  all inside one Neon branch.
date: '2026-10-02T12:00:00'
updatedOn: '2026-10-02T12:00:00.000Z'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/generate-embeddings-with-neon-ai-gateway/cover.jpg
  alt: 'Generate embeddings with Neon AI Gateway'
isFeatured: true
seo:
  title: Generate embeddings with Neon AI Gateway - Neon
  description: The embedding step of your retrieval pipeline now runs on your branch
  keywords: []
  noindex: false
  ogTitle: Generate embeddings with Neon AI Gateway - Neon
  ogDescription: The embedding step of your retrieval pipeline now runs on your branch
  image: https://cdn.neonapi.io/public/images/pages/blog/generate-embeddings-with-neon-ai-gateway/social.jpg
---

<Admonition type="note" title="We're building backends">
When a coding agent ships an app today, it deploys the [Neon backend](/blog/neon-backend-is-ga) - [Lakebase Postgres](/docs/postgres/overview) (our database) plus [Object Storage](/docs/storage/overview), [Functions](/docs/compute/functions/overview), [Managed Better Auth](/docs/auth/overview), and [AI Gateway](/docs/ai-gateway/overview). Every primitive branches with your data.
</Admonition>

Neon now includes [AI Gateway](/blog/llms-belong-in-your-backend), our primitive for calling LLMs. You get frontier and open-weight models hosted by Databricks, billed through Neon at the labs' own prices (no markup).

**The latest addition to AI Gateway: it now [serves embedding models](/docs/ai-gateway/embeddings) on the same OpenAI-compatible endpoint and with the same credential you already use for chat.** Point your SDK at `/v1/embeddings`, write the vectors into [Lakebase Postgres](/lakebase), and query them with [Lakebase Search](/docs/ai/lakebase-search). The whole retrieval pipeline, from the uploaded file to the generated answer, runs inside one Neon branch.

Ask your agent to set it up:

```text
> Add embeddings to my Neon branch. Enable Neon AI Gateway, generate a vector for "The quick brown fox jumps over the lazy dog." with qwen3-embedding-0-6b, and print its dimensions.
```

Or set it up yourself with the OpenAI SDK:

```ts
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

## Quick intro on the primitives

The pipeline above involves three pieces of the Neon backend: [Lakebase Postgres](/docs/postgres/overview) (our database), [AI Gateway](/docs/ai-gateway/overview), and [Lakebase Search](/docs/ai/lakebase-search). In case you're new here, here's a quick primer on each.

### Lakebase Postgres

[Lakebase Postgres](/docs/postgres/overview) is the Neon database, the center of the Neon backend:

- It's 100% Postgres, but serverless: instant to provision, with autoscaling, and scale to zero, with [usage-based pricing](/pricing) and a [generous free plan](/pricing)
- It's built on the [lakebase architecture](/docs/introduction/architecture-overview): compute is separated from versioned, copy-on-write storage
- Lakebase Postgres also branches: a [branch](/docs/introduction/branching) is an isolated copy of your database that's ready in seconds and doesn't duplicate storage - teams use it to automate all kinds of workflows that would otherwise involve a "dev instance". The rest of the Neon backend primitives also branch, following the database

### AI Gateway

[AI Gateway](/docs/ai-gateway/overview) lets you call models from Neon instead of collecting lab accounts:

- A Neon credential with the `ai_gateway:invoke` scope reaches the whole [model catalog](/docs/ai-gateway/models). Switching models means changing a string
- Models are served on Databricks [Foundation Model APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/), and we pass through each lab's published per-token price
- Chat completions and embeddings sit on an OpenAI-compatible `/v1` path, so the OpenAI SDK works once you change the base URL and key
- Every branch gets its own gateway host, and `neon env pull` writes `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` for the branch you're on. Inside a [Neon Function](/functions), both are injected for you

### Lakebase Search

[Lakebase Search](/docs/ai/lakebase-search) is vector, keyword, and hybrid search inside Lakebase Postgres, delivered as two extensions:

- **`lakebase_vector`** adds the `lakebase_ann` index for vector similarity search. It uses the same `vector` types, distance operators, and query syntax as `pgvector`, so there's nothing to migrate, and a single index scales past 1 billion vectors.
- **`lakebase_text`** adds the `lakebase_bm25` index for keyword search, with real BM25 ranking and top-K pushdown on standard `tsvector` columns.

Both indexes live in the same Postgres as your app data, so one query can combine them, join your tables, and filter by tenant. **Lakebase Search is also built for scale to zero:** indexes live in storage, so they're ready after a cold start and available on every branch with no rebuild.

<Admonition type="tip" title="Leading on price-performance">
We recently ran VectorDBBench on LAION-100M, and Lakebase Search led the tested systems on price-performance. See the results in [Lakebase Search: the retrieval primitive for agents on Neon](/blog/lakebase-search-retrieval-agents).
</Admonition>

## What's new: embeddings on AI Gateway

AI Gateway now exposes `POST /v1/embeddings`. It accepts a single string or a batch of up to 150 strings in one request, and returns vectors in the standard OpenAI response shape. Two models are available at launch:

| Model                  | Dimensions          | Normalized              | Price (as of Oct 2026)    |
| ---------------------- | ------------------- | ----------------------- | ------------------------- |
| `qwen3-embedding-0-6b` | 1024 (configurable) | Yes                     | $0.02 per 1M input tokens |
| `gte-large-en`         | 1024                | No, use cosine distance | $0.13 per 1M input tokens |

<Admonition type="note" title="Availability">
AI Gateway is available on the Launch and Scale plans, paid with [prepaid credits](/docs/ai-gateway/prepaid-credits). If you'd like to try it for free, [tell us on Discord](https://discord.gg/92vNTzKDGp): we have credits to give.
</Admonition>

<Admonition type="tip" title="Choosing a model">
If you're unsure what to choose, start with `qwen3-embedding-0-6b`, since it's the cheapest option. Use `gte-large-en` if you already have vectors produced by it and need new embeddings to match.
</Admonition>

The [Embeddings guide](/docs/ai-gateway/embeddings) covers the request and response fields, Python and curl examples, the `dimensions` parameter, and how to use the embedding models with the Vercel AI SDK through [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider).

## Build a complete retrieval pipeline on a Neon branch

**[ADD DIAGRAM]**

Having embeddings in AI Gateway is useful on its own, but it gets more interesting when you zoom out and look at the whole pipeline they're part of.

If you think about the features teams are constantly shipping these days (a support bot that answers from your docs, search across the files your users upload, an agent with memory), under the hood, they all have a similar shape. Content comes in → gets turned into vectors → gets stored → gets searched when a question arrives → the best matches go to a model that writes the answer.

Now that AI Gateway serves embeddings, every step is backed by a Neon primitive:

1. **Ingest → Object Storage + Functions:** e.g. a user uploads a file to [Object Storage](/docs/storage/overview), and a [Function Trigger](/docs/compute/functions/triggers/object-storage) invokes a [Neon Function](/docs/compute/functions/overview) to process it
2. **Embed → AI Gateway:** the Function splits the file into chunks and turns each one into a vector with AI Gateway's `/v1/embeddings` endpoint
3. **Store → Lakebase Postgres:** the chunks and their vectors go into Lakebase Postgres, next to the rest of your app data, so they can be joined and filtered like any other rows
4. **Retrieve → Lakebase Search:** when a question arrives, Lakebase Search finds the most relevant chunks with vector, keyword, or hybrid search
5. **Generate → AI Gateway:** the matches go to a chat model through the same gateway and credential, and the model writes the answer

To build something like this, hand a prompt like this to your agent:

```text
Build a retrieval pipeline on my Neon branch, using the Neon skills and docs:

1. In neon.ts, enable the AI Gateway, add a private `docs` bucket, add an `embed` function, and add a storage_object_created trigger on the bucket that invokes it. Run neon deploy.
2. In Postgres, enable the lakebase_vector and lakebase_text extensions. Create a `chunks` table (object_key, chunk_index, body, embedding VECTOR(1024), and a generated tsvector column) with a lakebase_ann index on the embedding.
3. In the `embed` function, read the uploaded file from the bucket, split it into chunks, embed them with qwen3-embedding-0-6b through the AI Gateway /v1/embeddings endpoint in batches of up to 150 inputs (pass encoding_format: 'float'), and upsert the rows so retries are idempotent.
4. Add an `ask` endpoint that embeds the question with the same model, runs a hybrid search (lakebase_ann plus a lakebase_bm25 index, merged with Reciprocal Rank Fusion), and sends the top chunks to a chat model through the gateway to answer.
5. Prove it works: upload a sample text file, confirm the rows landed, and show me an answer.

Docs: https://neon.com/docs/ai-gateway/embeddings.md, https://neon.com/docs/ai/lakebase-search-get-started.md, https://neon.com/docs/compute/functions/triggers/object-storage.md
```

### Branching is the connective tissue of this experience

Create a Neon branch and the whole pipeline follows: it reflects production exactly, it's ready immediately, and it stays lightweight, because none of your rows or files are duplicated.

For a retrieval pipeline, this makes it safe and easy to switch embedding models or vector sizes. On a branch, you can re-embed, run your evals against real production data, and keep the change only if it wins. The same loop works for all kinds of experiments: a new chunking strategy, a different hybrid-search weighting, or a different chat model.

## Try it

Generate, store, and search embeddings in one Neon backend. If you're building with a coding agent, start by [setting it up with Neon](/docs/get-started/with-an-agent): one command installs the Neon CLI, agent skills, and MCP server.

```bash
npx neon@latest init
```

It's also good to point your agent to these docs:

- [Embeddings on AI Gateway](/docs/ai-gateway/embeddings) - for the endpoint, models, and request options
- [Lakebase Search quickstart](/docs/ai/lakebase-search-get-started) - for vector, keyword, and hybrid search
- [Trigger a function on object upload](/docs/compute/functions/triggers/object-storage) - to automate the ingest step
- [Tour the Neon backend](/docs/get-started/backend-overview) - for how the primitives fit together in one `neon.ts`

Every docs page is also available as markdown (add `.md` to the URL), and [llms.txt](/docs/llms.txt) indexes all of them, so your agent can read the exact reference.
