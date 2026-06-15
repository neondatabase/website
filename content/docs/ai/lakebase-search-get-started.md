---
title: Get started with Lakebase Search
subtitle: Set up vector and full-text search on Neon in minutes
summary: >-
  Step-by-step guide to enabling lakebase_vector and lakebase_text on a Neon
  Postgres database, creating a documents table with vector embeddings and a
  BM25 full-text index, and running vector and keyword searches from a
  TypeScript application using @neondatabase/serverless and OpenAI.
enableTableOfContents: true
updatedOn: '2026-06-09T17:17:42.901Z'
---

<EarlyAccessProps feature_name="Lakebase Search" />

This guide sets up Lakebase Search on a Neon project: enabling both extensions, creating a schema that supports vector and full-text search, inserting documents with embeddings, and querying from TypeScript.

## Prerequisites

- A Neon project with Lakebase Search enabled. See [Lakebase Search](/docs/ai/lakebase-search) to request access.
- Postgres 16 or later (Lakebase Search requires PG16+)
- Node.js 18 or later
- An [OpenAI API key](https://platform.openai.com/api-keys) for generating embeddings

<Steps>

## Enable the extensions

Run the following in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any connected Postgres client:

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
  embedding VECTOR(1536),
  body_tsv  TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

CREATE INDEX ON documents
  USING lakebase_ann (embedding vector_cosine_ops);
```

The `lakebase_bm25` index is created in a later step, after data is inserted. BM25 computes corpus-wide statistics (document count, term frequencies) at index build time, so the index must be built on populated data to return meaningful scores.

## Set up your project

The remaining steps run from a local TypeScript project. Install dependencies:

```bash
npm install @neondatabase/serverless openai dotenv
```

Create a `.env` file with your Neon connection string and OpenAI API key:

```ini filename=".env"
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require
OPENAI_API_KEY=your-openai-api-key
```

## Run the demo

Create `search.ts` and paste the following. It inserts documents with embeddings, creates the `lakebase_bm25` index, runs a vector search, then runs a BM25 text search:

```typescript filename="search.ts"
import 'dotenv/config';
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

// BM25 scores are negative — lower (more negative) means more relevant
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

async function main() {
  console.log('Inserting documents...');
  await embedAndInsert();

  console.log('Building BM25 index...');
  await sql`
    CREATE INDEX IF NOT EXISTS documents_bm25 ON documents
    USING lakebase_bm25 (body_tsv bm25_ops)
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

</Steps>

## Next steps

- [lakebase_vector reference](/docs/extensions/lakebase-vector): index options, operator classes, tuning guide
- [lakebase_text reference](/docs/extensions/lakebase-text): BM25 operators, functions, fallback parameters, prefilter

<NeedHelp />
