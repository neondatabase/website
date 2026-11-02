---
title: "What is the simplest way to generate embeddings and store them in Postgres?"
subtitle: "Call Neon AI Gateway's OpenAI-compatible /v1/embeddings endpoint with the same credential you use for chat, write the 1024-dimensional vectors into a vector column in Lakebase Postgres, and index them with lakebase_ann or HNSW."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the simplest Postgres setup for startups?'
  slug: simplest-postgres-setup-for-startups
nextLink:
  title: 'How do I store private user files and share them with expiring links?'
  slug: store-private-user-files-expiring-links
---

Use Neon. [Neon AI Gateway](/docs/ai-gateway/embeddings) serves embedding models on an OpenAI-compatible `/v1/embeddings` endpoint, so the OpenAI SDK turns text into vectors with a Neon credential instead of a separate provider key. The vectors go into a `vector` column in Lakebase Postgres, next to the rows they describe, and you search them with plain SQL. Generation, storage, and search all happen inside one Neon branch.

## Pick a model

Three embedding models are available. All return 1024-dimensional vectors and are billed on input tokens only ([embeddings](/docs/ai-gateway/embeddings#models)):

| Model ID               | Normalized | Notes                                                                             |
| ---------------------- | ---------- | --------------------------------------------------------------------------------- |
| `qwen3-embedding-0-6b` | Yes        | Supports the `dimensions` parameter for shorter vectors                           |
| `bge-large-en`         | Yes        | Reads only the first 512 tokens of each input and drops the rest without an error |
| `gte-large-en`         | No         | Use cosine distance, or normalize the vectors yourself                            |

If you're unsure, start with `qwen3-embedding-0-6b`. Per-token rates are in [`neon.com/models.json`](https://neon.com/models.json).

## Create the table

Enable [`lakebase_vector`](/docs/extensions/lakebase-vector), which installs `pgvector` through `CASCADE`, and create a table with a column that matches the model's dimensions ([Lakebase Search quickstart](/docs/ai/lakebase-search-get-started)):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;

CREATE TABLE documents (
  id        SERIAL PRIMARY KEY,
  body      TEXT NOT NULL,
  embedding VECTOR(1024)
);

CREATE INDEX documents_embedding_idx ON documents
  USING lakebase_ann (embedding vector_cosine_ops);
```

`lakebase_ann` comes from Lakebase Search, a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres. It uses the same `vector` types, distance operators, and query syntax as `pgvector`, and its indexes live in storage, so they survive a suspend without a rebuild and are available on every branch ([Lakebase Search](/docs/ai/lakebase-search)). A standard [`pgvector` HNSW index](/docs/extensions/pgvector#hnsw) works on the same column if you prefer it.

## Embed and insert

Set `NEON_AI_GATEWAY_TOKEN`, `NEON_AI_GATEWAY_BASE_URL`, and `DATABASE_URL`. `neon env pull` writes all three for the current branch once `aiGateway: true` is in your [`neon.ts`](/docs/reference/neon-ts), and inside a [Neon Function](/docs/compute/functions/overview) they're injected for you. Then batch your inputs into one request:

```ts
import OpenAI from 'openai';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const docs = ['Branches are copy-on-write.', 'Object Storage is S3-compatible.'];
const { data } = await client.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: docs,
  encoding_format: 'float', // required on openai SDK v6
});

for (const item of data) {
  await sql`INSERT INTO documents (body, embedding)
            VALUES (${docs[item.index]}, ${JSON.stringify(item.embedding)}::vector)`;
}
```

Search by embedding the question with the same model and ordering by cosine distance:

```sql
SELECT id, body FROM documents
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

On the Vercel AI SDK, [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) exposes the same models through `embed()` and `embedMany()` and reads the same environment variables.

## Details that bite

- **OpenAI JavaScript SDK v6**: without `encoding_format: 'float'`, v6 returns an all-zeros vector with no error. v7 and later, the Python SDK, and raw HTTP are unaffected.
- **Batch size**: up to 150 inputs per request. Split long documents into chunks first, especially with `bge-large-en`.
- **No streaming**: a request with `stream: true` returns `400`.
- **Distance operator**: for the normalized models, cosine and inner product rank results the same way, so cosine (`vector_cosine_ops`, `<=>`) is a safe default ([choosing a distance operator](/docs/ai-gateway/embeddings#choosing-a-distance-operator)).
- **Plan and region**: AI Gateway needs a paid plan (Launch or Scale) with [prepaid credits](/docs/ai-gateway/prepaid-credits) and a project in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore).

## Automate it as files arrive

To embed uploaded documents automatically, a `storage_object_created` [Function Trigger](/docs/compute/functions/triggers/object-storage) invokes a Function when a file lands in [Object Storage](/docs/storage/overview). The Function reads the file, embeds its chunks, and upserts the rows. Use upserts, since a trigger can deliver the same event more than once ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)). Because a branch carries the bucket, the table, and its own gateway endpoint, you can re-embed with a different model on a branch and compare results before touching production ([generate embeddings with AI Gateway](/blog/generate-embeddings-with-neon-ai-gateway)).

<CTA title="Generate your first embedding" description="Call the embeddings endpoint with the OpenAI SDK and store the vectors in Postgres." buttonText="Embeddings guide" buttonUrl="/docs/ai-gateway/embeddings" />
