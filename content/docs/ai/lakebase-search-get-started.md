---
title: Get started with Lakebase Search
subtitle: Set up vector and full-text search on Neon in minutes
summary: >-
  Step-by-step guide to enabling lakebase_vector and lakebase_text on a Neon
  Postgres database, creating a documents table with vector embeddings and a
  BM25 full-text index, and running vector and keyword searches from a
  TypeScript application using @neondatabase/serverless and OpenAI.
enableTableOfContents: true
updatedOn: '2026-06-09T00:05:06.030Z'
---

<EarlyAccessProps feature_name="Lakebase Search" />

This guide sets up Lakebase Search on a Neon project: enabling both extensions, creating a schema that supports vector and full-text search, inserting documents with embeddings, and querying from TypeScript.

## Prerequisites

- A Neon project with Lakebase Search enabled — see [Lakebase Search](/docs/ai/lakebase-search) to request access
- Postgres 16 or later (Lakebase Search requires PG16+)
- Node.js 18 or later
- An [OpenAI API key](https://platform.openai.com/api-keys) for generating embeddings

## Install dependencies

```bash
npm install @neondatabase/serverless openai
```

## Enable the extensions

Run the following in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any connected Postgres client:

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;
```

`CASCADE` automatically installs `pgvector` if it is not already present, since `lakebase_vector` depends on it.

## Create a schema

Create a table that stores document content alongside a vector embedding and a generated `tsvector` column for full-text search:

```sql
CREATE TABLE documents (
  id        SERIAL PRIMARY KEY,
  title     TEXT NOT NULL,
  body      TEXT NOT NULL,
  embedding VECTOR(1536),
  body_tsv  TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

CREATE INDEX ON documents
  USING lakebase_ann (embedding vector_cosine_ops);

CREATE INDEX documents_bm25 ON documents
  USING lakebase_bm25 (body_tsv bm25_ops)
  WITH (default_limit = 10);
```

`default_limit = 10` stores the result limit in the index itself, so it applies without a `SET` command — useful for stateless serverless connections.

## Insert documents

Connect to your database and insert documents. Each document's body is embedded with OpenAI before insertion:

```typescript
import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';

const sql = neon(process.env.DATABASE_URL!);
const openai = new OpenAI();

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
      model: 'text-embedding-3-small',
      input: doc.body,
    });

    await sql`
      INSERT INTO documents (title, body, embedding)
      VALUES (${doc.title}, ${doc.body}, ${JSON.stringify(data[0].embedding)}::vector)
    `;
  }
}

await embedAndInsert();
```

## Run a vector search

Vector search finds documents semantically similar to a query, even when the exact words don't match:

```typescript
async function vectorSearch(query: string, limit = 5) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  return sql`
    SELECT id, title,
           embedding <=> ${JSON.stringify(data[0].embedding)}::vector AS distance
    FROM documents
    ORDER BY distance
    LIMIT ${limit}
  `;
}

const results = await vectorSearch('how do agents store memory?');
console.log(results);
```

## Run a BM25 text search

BM25 search ranks documents by keyword relevance, taking into account term frequency and document length:

```typescript
async function textSearch(query: string, limit = 5) {
  return sql`
    SELECT id, title,
           body_tsv <&> to_bm25query(
             to_tsvector('english', ${query}),
             'documents_bm25'
           ) AS score
    FROM documents
    ORDER BY score
    LIMIT ${limit}
  `;
}

const results = await textSearch('vector index postgres');
console.log(results);
```

Results are ordered by score ascending — a lower (more negative) score means higher relevance.

## Next steps

- [lakebase_vector reference](/docs/extensions/lakebase-vector) — index options, operator classes, tuning guide
- [lakebase_text reference](/docs/extensions/lakebase-text) — BM25 operators, functions, fallback parameters, prefilter

<NeedHelp />
