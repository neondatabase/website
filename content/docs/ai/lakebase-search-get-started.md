---
title: Get started with Lakebase Search
subtitle: Set up vector and full-text search on Neon in minutes
summary: >-
  Step-by-step guide to enabling lakebase_vector and lakebase_text on a Neon
  Postgres database, creating a documents table with vector embeddings and a
  BM25 full-text index, and running vector and keyword searches from a
  TypeScript application using @neondatabase/serverless and OpenAI.
enableTableOfContents: true
updatedOn: '2026-10-23T11:22:59.906Z'
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
    SELECT id, title, score
    FROM (
      SELECT id, title,
             body_tsv <@> to_bm25query(
               to_tsvector('english', ${query}),
               'documents_bm25'
             ) AS score
      FROM documents
    ) AS scored
    WHERE score < 0
    ORDER BY score, id
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

Vector search finds matches by meaning, while keyword search finds matches by wording. You can combine their results in two ways:

- **Jev through Neon AI Gateway** reads each result alongside your query and scores how likely it is to answer your question.
- **Reciprocal Rank Fusion (RRF)** uses each result's position in the two search lists to build a combined ranking, without an extra model call.

### Use Jev through Neon AI Gateway

Jev reads each result alongside your query and estimates how likely it is to answer your question. The example below combines both searches, removes duplicates, and puts the most likely answers first. It follows the [TypeSafe reranking cookbook](https://docs.typesafe.ai/cookbooks/rerank_typesafe).

This example needs Node.js 22 or later. Install the SDK versions used here:

```bash
npm install @neon/ai-sdk-provider@1.1.0 ai@7.0.133
```

Add the following code to `search.ts`. It uses the same `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` you set up for embeddings. See [Decision models](/docs/ai-gateway/decisions#use-with-the-vercel-ai-sdk) for more about the SDK.

```typescript filename="search.ts"
import { neon as neonAi } from '@neon/ai-sdk-provider';
import { experimental_decide as decide } from 'ai';

type Candidate = { id: number; title: string; body: string };

async function hybridSearchWithJev(query: string, limit = 5): Promise<Candidate[]> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('limit must be a positive integer');
  }

  const { data } = await openai.embeddings.create({
    model: 'qwen3-embedding-0-6b',
    input: query,
    encoding_format: 'float',
  });
  const queryVector = JSON.stringify(data[0].embedding);
  const candidates = (await sql`
    WITH vector_candidates AS (
      SELECT id
      FROM documents
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${queryVector}::vector
      LIMIT 40
    ),
    keyword_candidates AS (
      SELECT id
      FROM (
        SELECT id, body_tsv <@> to_bm25query(
          to_tsvector('english', ${query}), 'documents_bm25'
        ) AS score
        FROM documents
      ) AS scored
      WHERE score < 0
      ORDER BY score, id
      LIMIT 40
    ),
    candidate_ids AS (
      SELECT id FROM vector_candidates
      UNION
      SELECT id FROM keyword_candidates
    )
    SELECT d.id, d.title, d.body
    FROM candidate_ids AS c
    JOIN documents AS d ON d.id = c.id
    ORDER BY d.id
  `) as Candidate[];
  if (candidates.length === 0) return [];

  const { answers } = await decide({
    model: neonAi.decisionModel('typesafeai-jev-1-14-0'),
    state: { query },
    questions: Object.fromEntries(
      candidates.map((doc, index) => [
        `d${index}`,
        {
          type: 'boolean' as const,
          instructions: {
            question:
              'Given the search query in state.query, does this candidate passage supply the specific information the user is looking for?',
            candidate: { title: doc.title, body: doc.body },
          },
          criteria: {
            true: 'The candidate states the specific facts or steps the query asks for.',
            false:
              'The candidate only shares keywords or a topic with the query, answers a different question, or lacks the requested information.',
          },
        },
      ])
    ),
    maxRetries: 0,
    abortSignal: AbortSignal.timeout(10_000),
  });

  return candidates
    .map((doc, index) => {
      const answer = answers[`d${index}`];
      if (answer.type !== 'boolean') {
        throw new Error(`Missing relevance probability for d${index}`);
      }
      return { doc, index, probability: answer.probability };
    })
    .sort((a, b) => b.probability - a.probability || a.index - b.index)
    .slice(0, limit)
    .map(({ doc }) => doc);
}
```

Call `hybridSearchWithJev(query)` after inserting the documents and building the indexes. It sends the query and all the search results to Jev in one request, which must fit within the model's 65,536-token context window. For long documents, search shorter passages or send fewer results. If your app restricts documents by tenant or user, apply those filters to both searches before limiting the results.

One result will always rank first, even if none answers the query. If your app needs to say "no answer," test it with unanswered queries to choose a minimum score for accepting a result. If the Jev call fails, you can catch the error and fall back to `hybridSearch`.

### Fuse ranks with RRF

RRF gives each result a score of `1 / (60 + rank)` for its position in each search list, then adds the two scores. Results near the top of either list get higher scores.

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
        FROM documents
        WHERE embedding IS NOT NULL
        ORDER BY dist
        FETCH FIRST 40 ROWS WITH TIES
      ) v
    ),
    keyword_ranked AS (
      SELECT id, RANK() OVER (ORDER BY score) AS rank
      FROM (
        SELECT id, score
        FROM (
          SELECT id, body_tsv <@> to_bm25query(
            to_tsvector('english', ${query}), 'documents_bm25'
          ) AS score
          FROM documents
        ) AS scored
        WHERE score < 0
        ORDER BY score, id
        LIMIT 40
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

`WITH TIES` keeps vector results that share the 40th result's distance, so the search can return more than 40 rows. The keyword search leaves out non-matches and stops at 40 because many BM25 matches can have the same score. `RANK()` gives tied results the same rank, and `d.id` keeps the final order stable when scores are equal. Try different candidate counts and RRF constants to find what works best for your data.

</Steps>

## Next steps

- [lakebase_vector reference](/docs/extensions/lakebase-vector): index options, operator classes, tuning guide
- [lakebase_text reference](/docs/extensions/lakebase-text): BM25 operators, functions, fallback parameters, prefilter
- [lakebase_tokenizer reference](/docs/extensions/lakebase-tokenizer): optional configurable tokenization, stop words, synonyms, and stemming

<NeedHelp />
