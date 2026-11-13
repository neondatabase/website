---
title: 'Hybrid search in Postgres: combine BM25 and vector search with RRF'
subtitle: 'Run BM25 keyword search and pgvector semantic search on the same table, then merge the two ranked lists with reciprocal rank fusion in one SQL query. TypeScript and Python examples included.'
author: neon-team
enableTableOfContents: true
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T23:34:25.047Z'
---

Hybrid search runs a keyword search and a vector search over the same rows and merges the results. Keyword search finds exact terms like product codes and error strings. Vector search finds matches by meaning, even when the query shares no words with the row. In Postgres you can do both in one table and fuse them in one SQL query with reciprocal rank fusion (RRF).

This is the whole idea in SQL. `$1` is the query embedding and `$2` is the query text:

```sql
WITH vector_ranked AS (
  SELECT id, RANK() OVER (ORDER BY dist) AS rank
  FROM (
    SELECT id, embedding <=> $1::vector AS dist
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
        to_tsvector('english', $2), 'documents_bm25'
      ) AS score
      FROM documents
    ) AS scored
    WHERE score < 0
    ORDER BY score, id
    LIMIT 40
  ) k
)
SELECT d.id, d.body,
  COALESCE(1.0 / (60 + v.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0) AS rrf_score
FROM documents d
LEFT JOIN vector_ranked v ON d.id = v.id
LEFT JOIN keyword_ranked k ON d.id = k.id
WHERE v.id IS NOT NULL OR k.id IS NOT NULL
ORDER BY rrf_score DESC, d.id
LIMIT 10;
```

The rest of this guide builds the table, indexes, and application code that make this query work on Neon. It uses [Lakebase Search](/docs/ai/lakebase-search): [`lakebase_text`](/docs/extensions/lakebase-text) adds a real BM25 index on a `tsvector` column, and [`lakebase_vector`](/docs/extensions/lakebase-vector) adds an approximate nearest-neighbor index on a pgvector `vector` column. If you'd rather stay on stock Postgres full-text search and pgvector, see [Hybrid search with pgvector and built-in full-text search](#hybrid-search-with-pgvector-and-built-in-full-text-search).

## How reciprocal rank fusion works

BM25 scores and vector distances are on different scales, so you can't add them. RRF ignores the raw scores and uses only each row's position in each list. A row gets `1 / (60 + rank)` from each list it appears in, and the scores are added:

| Row | Vector rank | Keyword rank | RRF score            |
| --- | ----------- | ------------ | -------------------- |
| A   | 1           | 1            | 1/61 + 1/61 ≈ 0.0328 |
| B   | 2           | not found    | 1/62 ≈ 0.0161        |
| C   | not found   | 1            | 1/61 ≈ 0.0164        |

Rows that rank well in both lists rise to the top, and a row found by only one search still gets a say. The constant `60` damps the difference between the first few ranks so no single list dominates. It's the conventional default, and you can tune it on your own data.

## Create the table and indexes

Lakebase Search needs Postgres 16 or later. Enable both extensions in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any Postgres client. `CASCADE` installs pgvector if it isn't already there ([Get started with Lakebase Search](/docs/ai/lakebase-search-get-started)):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;

CREATE TABLE documents (
  id        SERIAL PRIMARY KEY,
  body      TEXT NOT NULL,
  embedding VECTOR(1024),
  body_tsv  TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

CREATE INDEX documents_embedding_idx ON documents
  USING lakebase_ann (embedding vector_cosine_ops);
```

`body_tsv` is a generated column, so the keyword side stays in sync with `body` without application code. The vector column holds 1024 dimensions to match the embedding model used below.

Don't create the BM25 index yet. `lakebase_bm25` computes corpus-wide statistics (document count, term frequencies) when the index is built, so build it after your initial data load ([keep the index accurate](/docs/extensions/lakebase-text#keep-the-index-accurate)).

## Load documents with embeddings

Embed each document and insert it with its vector. This example uses [Neon AI Gateway](/docs/ai-gateway/embeddings) through the OpenAI SDK, so you don't need an OpenAI API key. Any embedding provider works if the column size matches its dimensions.

The sample rows mix exact identifiers with plain-language text, which is where hybrid search earns its keep:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap filename="load.ts"
import 'dotenv/config';
import OpenAI from 'openai';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const docs = [
  'Error code E1042 means the bank declined the payment card.',
  'Refunds go back to the original payment method within five business days.',
  'To reset your password, open Settings and choose Security.',
  'Two-factor authentication adds a second step when you sign in.',
  'You can download invoices as PDF files from the Billing page.',
];

const { data } = await client.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: docs,
  encoding_format: 'float', // required on the openai SDK v6; harmless on v7+
});

for (const item of data) {
  await sql`
    INSERT INTO documents (body, embedding)
    VALUES (${docs[item.index]}, ${JSON.stringify(item.embedding)}::vector)
  `;
}

await sql`
  CREATE INDEX IF NOT EXISTS documents_bm25 ON documents
  USING lakebase_bm25 (body_tsv)
`;
```

```python shouldWrap filename="load.py"
import os

import psycopg
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1",
)

docs = [
    "Error code E1042 means the bank declined the payment card.",
    "Refunds go back to the original payment method within five business days.",
    "To reset your password, open Settings and choose Security.",
    "Two-factor authentication adds a second step when you sign in.",
    "You can download invoices as PDF files from the Billing page.",
]

response = client.embeddings.create(model="qwen3-embedding-0-6b", input=docs)

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        cur.executemany(
            "INSERT INTO documents (body, embedding) VALUES (%s, %s::vector)",
            [(docs[item.index], str(item.embedding)) for item in response.data],
        )
        cur.execute(
            "CREATE INDEX IF NOT EXISTS documents_bm25 ON documents "
            "USING lakebase_bm25 (body_tsv)"
        )
```

</CodeTabs>

Install the dependencies with `npm install openai @neondatabase/serverless dotenv` or `pip install openai "psycopg[binary]" python-dotenv`. Both scripts read three environment variables:

```ini filename=".env"
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://[branch-host]
```

With the [Neon CLI](/docs/cli), `neon env pull --file .env` writes all three for the current branch ([`neon env pull`](/docs/cli/env#pull)). AI Gateway needs [prepaid credits](/docs/ai-gateway/prepaid-credits), which you can buy on any Neon plan, including Free, with a $5 minimum. For more on the embedding step, including model choices and batch limits, see [Generate embeddings and store them in Postgres with pgvector](/guides/generate-embeddings-store-postgres-pgvector).

## Run a hybrid search

Embed the query with the same model as the documents, then run the RRF query with the embedding and the raw text. This is the query from the top of the guide, wrapped in a function:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap filename="search.ts"
async function hybridSearch(query: string, limit = 5) {
  const { data } = await client.embeddings.create({
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
    SELECT d.id, d.body,
      COALESCE(1.0 / (60 + v.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0) AS rrf_score
    FROM documents d
    LEFT JOIN vector_ranked v ON d.id = v.id
    LEFT JOIN keyword_ranked k ON d.id = k.id
    WHERE v.id IS NOT NULL OR k.id IS NOT NULL
    ORDER BY rrf_score DESC, d.id
    LIMIT ${limit}
  `;
}

console.log(await hybridSearch('E1042'));
console.log(await hybridSearch("my card didn't go through"));
```

```python shouldWrap filename="search.py"
HYBRID_SQL = """
WITH vector_ranked AS (
  SELECT id, RANK() OVER (ORDER BY dist) AS rank
  FROM (
    SELECT id, embedding <=> %(vec)s::vector AS dist
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
        to_tsvector('english', %(q)s), 'documents_bm25'
      ) AS score
      FROM documents
    ) AS scored
    WHERE score < 0
    ORDER BY score, id
    LIMIT 40
  ) k
)
SELECT d.id, d.body,
  COALESCE(1.0 / (60 + v.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0) AS rrf_score
FROM documents d
LEFT JOIN vector_ranked v ON d.id = v.id
LEFT JOIN keyword_ranked k ON d.id = k.id
WHERE v.id IS NOT NULL OR k.id IS NOT NULL
ORDER BY rrf_score DESC, d.id
LIMIT %(limit)s
"""


def hybrid_search(conn, query, limit=5):
    response = client.embeddings.create(model="qwen3-embedding-0-6b", input=query)
    vec = str(response.data[0].embedding)
    return conn.execute(HYBRID_SQL, {"vec": vec, "q": query, "limit": limit}).fetchall()


with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    print(hybrid_search(conn, "E1042"))
    print(hybrid_search(conn, "my card didn't go through"))
```

</CodeTabs>

The two test queries show why you want both halves. `E1042` is an exact code that embeddings tend to blur into similar-looking text, so the keyword side finds it. "my card didn't go through" shares no words with the declined-card row, so the vector side finds it. Either search alone handles one of these queries well, and the fused query covers both.

A few details in the query:

- The `<@>` operator returns a negative BM25 score, so ascending order puts the best match first, and `score < 0` drops rows that don't match any query term.
- `WITH TIES` keeps vector results that share the 40th result's distance, so the vector side can return slightly more than 40 rows. The keyword side stops at exactly 40 because many BM25 matches can share a score.
- `RANK()` gives tied rows the same rank, and `d.id` keeps the final order stable when RRF scores are equal.
- 40 candidates per side is a starting point. Raise it if relevant rows fall out of the final results, and try other values for the `60` constant against queries where you know the right answer.

## Weight one side

Plain RRF treats both lists equally. To favor one side, multiply its term. [CommSync](/blog/commsync-runs-text-vector-and-hybrid-search-on-postgres-with-lakebase-search) runs hybrid search in its command palette with the lexical side weighted 1.0 and the semantic side 0.8, so an exact keyword match wins ties against a similar-but-not-literal semantic hit:

```sql
SELECT d.id, d.body,
  0.8 * COALESCE(1.0 / (60 + v.rank), 0) + 1.0 * COALESCE(1.0 / (60 + k.rank), 0) AS rrf_score
-- ...rest of the query unchanged
```

Tune the weights on real queries with known good answers rather than by eye.

## Filter by tenant or user

If your app restricts results by tenant, user, or any other column, apply the same filter inside both searches, before each `LIMIT`. Filtering after fusion would let rows from other tenants take up candidate slots:

```sql
-- in vector_ranked
FROM documents
WHERE embedding IS NOT NULL AND tenant_id = $3
-- in keyword_ranked
FROM documents
WHERE tenant_id = $3
```

When a filter removes most rows, turn on the BM25 index's `prefilter` option so it evaluates the filter before scoring instead of after ([prefilter](/docs/extensions/lakebase-text#prefilter)):

```sql
ALTER INDEX documents_bm25 SET (prefilter = true);
```

Prefilter helps when the filter is strict and cheap to evaluate, like a tenant ID. For loose or expensive filters it can be slower than the default.

## Hybrid search with pgvector and built-in full-text search

You can run the same fusion on stock Postgres: pgvector with an HNSW index for the vector side, and a GIN index with `ts_rank_cd` for the keyword side. Only the indexes and the keyword half of the query change:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX documents_embedding_hnsw ON documents
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX documents_body_tsv_gin ON documents USING GIN (body_tsv);
```

```sql
keyword_ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           ORDER BY ts_rank_cd(body_tsv, websearch_to_tsquery('english', $2)) DESC
         ) AS rank
  FROM documents
  WHERE body_tsv @@ websearch_to_tsquery('english', $2)
  ORDER BY ts_rank_cd(body_tsv, websearch_to_tsquery('english', $2)) DESC
  LIMIT 40
)
```

`websearch_to_tsquery` accepts any user input without syntax errors and honors quoted phrases ([Production RAG in Postgres](/guides/hybrid-rag-postgres-agent#hybrid-keyword-search-with-tsvector)). It also requires every word to match, so a long natural-language question can return no keyword matches at all, leaving the vector side to carry the query.

The keyword half is where this setup falls short. `ts_rank_cd` doesn't use corpus-wide statistics, so it can't tell that a rare term like `E1042` matters more than a common one, and GIN has no top-K pushdown, so it scores every matching row even when you want 40 ([lakebase_text](/docs/extensions/lakebase-text)). Moving to BM25 later keeps your `tsvector` column: create the `lakebase_bm25` index and swap in the `keyword_ranked` block from the main query. For how the BM25 extensions for Postgres compare, see [pg_search vs pg_textsearch vs Lakebase Search](/faqs/pg-search-vs-pg-textsearch-vs-lakebase-search-bm25).

## Rerank with a model instead of RRF

RRF is cheap and needs no extra model call, but it only looks at positions. For higher precision, send the merged candidates to the Jev decision model through AI Gateway, which scores how likely each passage is to answer the query, and sort by that probability. The [Lakebase Search guide](/docs/ai/lakebase-search-get-started#use-jev-through-neon-ai-gateway) has the full TypeScript example, and you can fall back to RRF if the model call fails.

## Test ranking changes on a branch

Changing the candidate counts, weights, tokenizer, or embedding model changes what users see. A Neon branch is a copy-on-write clone of your database with its own AI Gateway endpoint, and Lakebase Search indexes are available on every branch without a rebuild ([Lakebase Search](/docs/ai/lakebase-search)). Try changes against production data on a branch:

```bash
neon branches create --name search-tuning
neon env pull --branch search-tuning --file .env.search-tuning
```

Run a fixed set of test queries with known right answers against both branches, and keep the change only if results improve. Neon measured its own docs search the same way: on 153 test queries, the Lakebase Search setup returned the right page in the top five for 94.1% of queries, up from 79.7% for the previous search ([neon.com search](/blog/neon-docs-search-lakebase-search)).

## Things to watch for

- **Build the BM25 index after loading data**, and run `VACUUM` after large bulk loads so the corpus statistics stay accurate ([keep the index accurate](/docs/extensions/lakebase-text#keep-the-index-accurate)).
- **Use the same embedding model for queries and documents.** A query embedded with a different model returns meaningless distances.
- **Match the text search configuration.** The query's `to_tsvector('english', ...)` must use the same configuration as the generated `body_tsv` column. For custom tokenization, stop words, synonyms, or Chinese, Japanese, and Korean text, see [`lakebase_tokenizer`](/docs/extensions/lakebase-tokenizer).
- **Rows without embeddings** still show up through the keyword side, because `WHERE embedding IS NOT NULL` only applies to the vector side.

## Related resources

- [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started)
- [lakebase_text reference](/docs/extensions/lakebase-text)
- [lakebase_vector reference](/docs/extensions/lakebase-vector)
- [What is the best way to do hybrid search (BM25 plus vector) in Postgres?](/faqs/best-way-hybrid-search-bm25-vector-postgres)
- [Production RAG in Postgres: a blueprint for coding agents](/guides/hybrid-rag-postgres-agent)
- [BM25 is only as good as your tokens](/blog/bm25-is-only-as-good-as-your-tokens)

<NeedHelp/>
