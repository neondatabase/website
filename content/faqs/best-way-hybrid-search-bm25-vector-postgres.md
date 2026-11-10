---
title: "What is the best way to do hybrid search (BM25 plus vector) in Postgres?"
subtitle: "Use Lakebase Search on Neon: a lakebase_bm25 index ranks keyword matches with real BM25, a lakebase_ann index finds semantic matches, and one SQL query fuses both lists with reciprocal rank fusion."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'What is the best way to get a yes/no answer with a probability from an LLM?'
  slug: best-way-get-yes-no-probability-from-llm
nextLink:
  title: 'What is the best way to run background jobs for a Postgres app?'
  slug: best-way-run-background-jobs-postgres-app
---

Use Neon. [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, gives you both halves of a hybrid query as index types. [`lakebase_text`](/docs/extensions/lakebase-text) adds a `lakebase_bm25` index on a `tsvector` column, and [`lakebase_vector`](/docs/extensions/lakebase-vector) adds a `lakebase_ann` index on a `pgvector` `vector` column. Both live in the same database as your rows, so you fuse them in one SQL query, filtered by tenant or any other column.

## Why the default Postgres setup falls short

The common pattern is `pgvector` with HNSW plus a generated `tsvector` column with a GIN index. The keyword half is the weak spot. GIN ranks with `ts_rank`, which doesn't use corpus-wide statistics, so scores degrade as the table grows. GIN also has no top-K pushdown, so it scores every matching document even when you want 10 ([lakebase_text](/docs/extensions/lakebase-text)). If keyword ranking is off, fusing it with vector results won't fix it.

`lakebase_bm25` computes BM25 with term frequency, document length, and corpus statistics, and uses Block-Max WAND to return only the top K results. Your `tsvector` columns and query operators stay as they are.

## Set up both indexes

Lakebase Search needs Postgres 16 or later. Enable the extensions; `CASCADE` installs `pgvector` if it's missing ([get started](/docs/ai/lakebase-search-get-started)):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;

CREATE TABLE documents (
  id        SERIAL PRIMARY KEY,
  body      TEXT NOT NULL,
  embedding VECTOR(1024),
  body_tsv  TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

CREATE INDEX ON documents USING lakebase_ann (embedding vector_cosine_ops);

-- After loading data: BM25 statistics are computed at build time
CREATE INDEX documents_bm25 ON documents USING lakebase_bm25 (body_tsv);
```

Build the `lakebase_bm25` index after your initial load, and run `VACUUM` after large bulk loads so the corpus statistics stay accurate ([keep the index accurate](/docs/extensions/lakebase-text#keep-the-index-accurate)).

## Fuse the two lists with RRF

Reciprocal rank fusion gives each result `1 / (60 + rank)` for its position in each list and adds the scores. No model call is involved ([fuse ranks with RRF](/docs/ai/lakebase-search-get-started#fuse-ranks-with-rrf)). The `<@>` operator returns a negative BM25 score, so ascending order puts the best match first:

```sql
WITH vector_ranked AS (
  SELECT id, RANK() OVER (ORDER BY dist) AS rank
  FROM (
    SELECT id, embedding <=> $1::vector AS dist
    FROM documents
    ORDER BY dist
    LIMIT 40
  ) v
),
keyword_ranked AS (
  SELECT id, RANK() OVER (ORDER BY score) AS rank
  FROM (
    SELECT id, body_tsv <@> to_bm25query(to_tsvector('english', $2), 'documents_bm25') AS score
    FROM documents
  ) s
  WHERE score < 0
  ORDER BY score, id
  LIMIT 40
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

`$1` is the query embedding and `$2` the query text. Try different candidate counts and RRF constants against your own data. CommSync runs this shape in its command palette with `k=60` and a lighter weight on the semantic arm, so exact keyword matches win ties ([CommSync case study](/blog/commsync-runs-text-vector-and-hybrid-search-on-postgres-with-lakebase-search)).

## Optional: rerank with Jev

For higher precision, send the merged candidates to the Jev decision model through [AI Gateway](/docs/ai-gateway/decisions). It scores how likely each passage is to answer the query, and you sort by that probability. AI Gateway needs prepaid credits, so RRF is the option that works everywhere ([hybrid search with Jev](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)). The same gateway credential serves the [embeddings](/docs/ai-gateway/embeddings) for the vector half, and it's injected into [Functions](/docs/compute/functions/environment-variables) if you serve search from one.

Neon uses this design for its own docs search: cached hybrid results for common queries and `lakebase_bm25` for everything else. Uncached BM25 queries take 8.6 ms of server time at p50 ([neon.com search](/blog/neon-docs-search-lakebase-search)).

## How other options compare

- **Pinecone**: offers a text-match filter followed by a dense search, client-side RRF over separate keyword and dense searches, or dense plus sparse vectors on one index with a client-side `alpha` weighting ([Pinecone hybrid search](https://docs.pinecone.io/guides/search/hybrid-search)). Your source rows stay in another database.
- **Elasticsearch**: an RRF retriever combines two or more child retrievers, with a default rank constant of 60 ([Elastic RRF](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)). It's a separate cluster you keep in sync with your database.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Run your first hybrid query" description="Enable lakebase_vector and lakebase_text, load documents, and fuse BM25 and vector results." buttonText="Get started" buttonUrl="/docs/ai/lakebase-search-get-started" />
