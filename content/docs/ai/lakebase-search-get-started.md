---
title: Get started with Lakebase Search
subtitle: Set up vector and full-text search on Neon in minutes
summary: >-
  Step-by-step guide to enabling lakebase_vector and lakebase_text on a Neon
  Postgres database, creating a documents table with vector embeddings and a
  BM25 full-text index, and running vector and keyword searches from a
  TypeScript application using @neondatabase/serverless and OpenAI.
enableTableOfContents: true
updatedOn: '2026-09-26T00:49:26.569Z'
---

This guide sets up Lakebase Search on a Neon project: enabling both extensions, creating a schema that supports vector and full-text search, inserting documents with embeddings, and querying from TypeScript.

## Prerequisites

- A Neon project. You enable Lakebase Search on it in the first step below.
- Postgres 16 or later (Lakebase Search requires PG16+)
- Node.js 18 or later
- Choose an embedding provider to turn text into vectors:
  - **Neon AI Gateway** (this guide's default): set `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` (see [Get started](/docs/ai-gateway/get-started)) and use the [`qwen3-embedding-0-6b`](/docs/ai-gateway/embeddings) model (1024 dimensions). Requires a paid plan in a [Neon AI Gateway region](/docs/ai-gateway/overview).
  - **OpenAI directly**: set `OPENAI_API_KEY` and drop both client overrides so it's just `new OpenAI()`, then change the model to `text-embedding-3-small` (1536 dimensions).
  - **Any other provider**: generate the vector with its SDK and match the `VECTOR` column to its dimensions.

<Steps>

## Enable the extensions

Install the extensions in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any connected Postgres client:

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;
```

`CASCADE` automatically installs `pgvector` if it is not already present, since `lakebase_vector` depends on it.

## Create a table

```sql
CREATE TABLE documents (
  id        SERIAL PRIMARY KEY,
  title     TEXT NOT NULL,
  body      TEXT NOT NULL,
  embedding VECTOR(1024),
  body_tsv  TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

CREATE INDEX documents_embedding_idx ON documents
  USING lakebase_ann (embedding vector_cosine_ops);
```

The `lakebase_bm25` index is created in a later step, after data is inserted. BM25 computes corpus-wide statistics (document count, term frequencies) at index build time, so the index must be built on populated data to return meaningful scores.

## Set up your project

The remaining steps run from a local TypeScript project. Install dependencies:

```bash
npm install @neondatabase/serverless openai dotenv
```

<Admonition type="note">
This guide uses the `openai` SDK pointed at the Neon AI Gateway. Version 6 of the SDK requires `encoding_format: 'float'` on embedding calls (included below); on v7 and later it's optional. See [Embeddings](/docs/ai-gateway/embeddings) for details.
</Admonition>

Create a `.env` file with your Neon connection string and AI Gateway credentials. See [Get started with AI Gateway](/docs/ai-gateway/get-started) for how to obtain the gateway values:

```ini filename=".env"
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://[branch-host]
```

## Run the demo

Create `search.ts` and paste the following. It inserts documents with embeddings, creates the `lakebase_bm25` index, runs a vector search, then runs a BM25 text search:

```typescript filename="search.ts"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';

const sql = neon(process.env.DATABASE_URL!);

// Point the OpenAI SDK at the Neon AI Gateway.
const openai = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const documents = [
  {
    title: 'Vector search on Postgres',
    body: 'lakebase_vector adds a lakebase_ann index to Postgres for fast approximate nearest-neighbor search at billion-vector scale.',
  },
  {
    title: 'BM25 full-text search',
    body: 'lakebase_text adds a lakebase_bm25 index that provides BM25 ranking and top-K pushdown while preserving standard tsvector types.',
  },
  {
    title: 'AI agent memory',
    body: 'Store conversation history, session state, and vector embeddings in a single Postgres database to power AI agent backends.',
  },
  {
    title: 'Branching for retrieval experiments',
    body: 'Neon branching lets you test new chunking strategies or embedding models on a branch without rebuilding your search indexes.',
  },
  {
    title: 'Scale-to-zero search',
    body: 'Lakebase Search indexes survive cold starts. Your vector and BM25 indexes are available immediately after a Neon compute wakes up.',
  },
];

async function embedAndInsert() {
  for (const doc of documents) {
    const { data } = await openai.embeddings.create({
      model: 'qwen3-embedding-0-6b',
      input: doc.body,
      encoding_format: 'float', // required on the openai SDK v6; harmless on v7+
    });

    await sql`
      INSERT INTO documents (title, body, embedding)
      VALUES (${doc.title}, ${doc.body}, ${JSON.stringify(data[0].embedding)}::vector)
    `;
  }
}

async function vectorSearch(query: string, limit = 5) {
  const { data } = await openai.embeddings.create({
    model: 'qwen3-embedding-0-6b',
    input: query,
    encoding_format: 'float',
  });

  return sql`
    SELECT id, title,
           embedding <=> ${JSON.stringify(data[0].embedding)}::vector AS distance
    FROM documents
    ORDER BY distance
    LIMIT ${limit}
  `;
}

// BM25 scores are negative — lower (more negative) means more relevant
async function textSearch(query: string, limit = 5) {
  return sql`
    SELECT id, title,
           body_tsv <@> to_bm25query(
             to_tsvector('english', ${query}),
             'documents_bm25'
           ) AS score
    FROM documents
    ORDER BY score
    LIMIT ${limit}
  `;
}

async function main() {
  console.log('Inserting documents...');
  await embedAndInsert();

  console.log('Building BM25 index...');
  await sql`
    CREATE INDEX IF NOT EXISTS documents_bm25 ON documents
    USING lakebase_bm25 (body_tsv)
    WITH (default_limit = 10)
  `;

  console.log('\nVector search — "how do agents store memory?":');
  console.log(await vectorSearch('how do agents store memory?'));

  console.log('\nBM25 search — "vector search":');
  console.log(await textSearch('vector search'));
}

main();
```

Run it:

```bash
npx tsx search.ts
```

## Combine results with hybrid search

Vector and keyword search each catch matches the other misses, so most real-world search combines them. There's no built-in hybrid function; you write one query that runs both searches and merges their results. The technique here is Reciprocal Rank Fusion (RRF): take the top candidates from each search, rank each list, then score every row by `1 / (60 + rank)` summed across both lists, so rows that rank well in either or both come out on top.

Add a `hybridSearch` function to `search.ts`, alongside `vectorSearch` and `textSearch`. It reuses the `documents` table and indexes from above:

```typescript filename="search.ts"
async function hybridSearch(query: string, limit = 5) {
  const { data } = await openai.embeddings.create({
    model: 'qwen3-embedding-0-6b',
    input: query,
    encoding_format: 'float',
  });
  const queryVector = JSON.stringify(data[0].embedding);

  return sql`
    WITH vector_ranked AS (
      SELECT id, RANK() OVER (ORDER BY dist) AS rank
      FROM (
        SELECT id, embedding <=> ${queryVector}::vector AS dist
        FROM documents ORDER BY dist LIMIT 40
      ) v
    ),
    keyword_ranked AS (
      SELECT id, RANK() OVER (ORDER BY score) AS rank
      FROM (
        SELECT id, body_tsv <@> to_bm25query(to_tsvector('english', ${query}), 'documents_bm25') AS score
        FROM documents ORDER BY score LIMIT 40
      ) k
    )
    SELECT d.id, d.title,
      COALESCE(1.0 / (60 + v.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0) AS rrf_score
    FROM documents d
    LEFT JOIN vector_ranked v ON d.id = v.id
    LEFT JOIN keyword_ranked k ON d.id = k.id
    WHERE v.id IS NOT NULL OR k.id IS NOT NULL
    ORDER BY rrf_score DESC, d.id
    LIMIT ${limit}
  `;
}
```

Each search contributes its top 40 candidates. `RANK()` gives tied scores the same rank, the constant `60` keeps low-ranked results from dominating, and `d.id` breaks ties for stable ordering. Tune the per-search `LIMIT` and the RRF constant for your data; weighted scoring is another common approach.

</Steps>

## Next steps

- [lakebase_vector reference](/docs/extensions/lakebase-vector): index options, operator classes, tuning guide
- [lakebase_text reference](/docs/extensions/lakebase-text): BM25 operators, functions, fallback parameters, prefilter

<NeedHelp />
