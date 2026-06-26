---
title: Get started with Lakebase Search
subtitle: Set up vector and full-text search on Neon in minutes
summary: >-
  Step-by-step guide to enabling lakebase_vector and lakebase_text on a Neon
  Postgres database, creating a documents table with vector embeddings and a
  BM25 full-text index, and running vector and keyword searches from a
  TypeScript application using @neondatabase/serverless and OpenAI.
enableTableOfContents: true
updatedOn: '2026-06-26T12:58:36.951Z'
---

<Admonition type="note" title="Beta">
Lakebase Search is in Beta. Share your feedback on [Discord](https://discord.gg/92vNTzKDGp) or via the [Neon Console](https://console.neon.tech/app/projects?modal=feedback).
</Admonition>

This guide sets up Lakebase Search on a Neon project: enabling both extensions, creating a schema that supports vector and full-text search, inserting documents with embeddings, and querying from TypeScript.

## Prerequisites

- A Neon project. You enable Lakebase Search on it in the first step below.
- Postgres 16 or later (Lakebase Search requires PG16+)
- Node.js 18 or later
- An [OpenAI API key](https://platform.openai.com/api-keys) for generating embeddings

<Steps>

## Enable the preload libraries

`lakebase_vector` and `lakebase_text` rely on preloaded libraries that aren't enabled by default. Check your project's current state in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor):

```sql
SHOW shared_preload_libraries;
```

If the list already includes `lakebase_vector` and `lakebase_text`, skip to [Install the extensions](#install-the-extensions). If not, you'll add them with the Neon API, using a [Neon API key](/docs/manage/api-keys) and your project ID.

First, confirm the libraries are available to your project:

```bash
export NEON_API_KEY=...
export PROJECT_ID=...

curl -sS \
  -H "authorization: Bearer $NEON_API_KEY" \
  -H "accept: application/json" \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/available_preload_libraries" \
| jq '.libraries[] | select(.library_name | test("lakebase"))'
```

If that returns the two libraries, enable them. The Neon API replaces the preload list rather than appending, so the command below reads your current libraries (plus the defaults) and re-sends them with the Lakebase Search libraries added, leaving your existing preloads in place:

```bash
AVAILABLE="$(curl -sS \
  -H "authorization: Bearer $NEON_API_KEY" \
  -H "accept: application/json" \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/available_preload_libraries")"

CURRENT="$(curl -sS \
  -H "authorization: Bearer $NEON_API_KEY" \
  -H "accept: application/json" \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID")"

BODY="$(jq -n --argjson avail "$AVAILABLE" --argjson cur "$CURRENT" '
  { project: { settings: { preload_libraries: { enabled_libraries: (
    [$avail.libraries[] | select(.is_default == true) | .library_name]
    + ($cur.project.settings.preload_libraries.enabled_libraries // [])
    + ["lakebase_vector", "lakebase_text"]
    | unique
  ) } } } }
')"

curl -sS -X PATCH \
  -H "authorization: Bearer $NEON_API_KEY" \
  -H "accept: application/json" \
  -H "content-type: application/json" \
  --data "$BODY" \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID"
```

For more on how Neon handles preloaded libraries, see [Extensions with preloaded libraries](/docs/extensions/pg-extensions#extensions-with-preloaded-libraries).

## Restart the compute

The new `shared_preload_libraries` setting applies after the compute restarts, which drops current connections. Restart it with your `endpoint_id`, or let an idle compute pick up the change when it next wakes:

```bash
export ENDPOINT_ID=...

curl -sS -X POST \
  -H "authorization: Bearer $NEON_API_KEY" \
  -H "accept: application/json" \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/endpoints/$ENDPOINT_ID/restart"
```

## Enable the extensions

Run the following in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any connected Postgres client:

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;
```

`CASCADE` automatically installs `pgvector` if it is not already present, since `lakebase_vector` depends on it.

<Admonition type="note">
If you get `ERROR: lakebase_vector must be loaded via shared_preload_libraries`, the preload step hasn't taken effect on the running compute yet. Confirm the libraries are enabled (the step above) and that the compute has restarted or woken since, then try again.
</Admonition>

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
    model: 'text-embedding-3-small',
    input: query,
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
