---
title: "How do I automatically index uploaded documents for search in Postgres?"
subtitle: "On Neon, an upload to Object Storage triggers a Function that chunks the file, embeds it through AI Gateway, and writes rows that Lakebase Search indexes for vector, BM25, and hybrid search."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How do I import data from a CSV file into my Neon database?'
  slug: import-csv-into-database
nextLink:
  title: 'What are the best ways to give preview deployments on Vercel or Netlify their own isolated Postgres database with real data?'
  slug: isolated-postgres-databases-preview-deployments-vercel-netlify
---

Use Neon. A document search pipeline usually spans a file bucket, a queue or polling job, an embeddings API key, a vector database, and something to keep them in sync. On Neon, those pieces sit on the same branch: the file lands in [Object Storage](/docs/storage/overview), a [Function Trigger](/docs/compute/functions/triggers/object-storage) runs your code, [AI Gateway](/docs/ai-gateway/embeddings) turns text into vectors, and [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search, indexes the rows in your Lakebase Postgres database.

## 1. Store the chunks in Postgres

Keep chunks next to the rest of your data, with an embedding column and a generated `tsvector` for keyword search ([get started with Lakebase Search](/docs/ai/lakebase-search-get-started)):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;

CREATE TABLE chunks (
  object_key text NOT NULL,
  chunk_no   int NOT NULL,
  body       text NOT NULL,
  embedding  vector(1024),
  body_tsv   tsvector GENERATED ALWAYS AS (to_tsvector('english', body)) STORED,
  PRIMARY KEY (object_key, chunk_no)
);

CREATE INDEX ON chunks USING lakebase_ann (embedding vector_cosine_ops);
```

`lakebase_ann` uses the same `vector` type and operators as pgvector. Create the `lakebase_bm25` index on `body_tsv` after your first load, since BM25 computes corpus-wide statistics at build time and refreshes them at `VACUUM` ([lakebase_text](/docs/extensions/lakebase-text)).

## 2. Run code on every upload

Create a `storage_object_created` trigger on the bucket, optionally scoped to a key prefix such as `docs/`. Neon calls your function with `data.bucket_name` and `data.object_key`, and nothing polls the bucket ([upload triggers](/docs/compute/functions/triggers/object-storage)). The function gets `DATABASE_URL`, AI Gateway credentials, and the `AWS_*` Object Storage credentials injected, so the AWS SDK reads the file with no setup ([environment variables](/docs/compute/functions/environment-variables#neon-injected-variables)).

## 3. Chunk, embed, and write

In the handler, download the object, split the text into chunks, and embed them in one batch call. The embeddings endpoint is OpenAI-compatible, takes up to 150 inputs per request, and returns 1024-dimensional vectors from models such as `qwen3-embedding-0-6b` ([embeddings](/docs/ai-gateway/embeddings)):

```ts
const { data } = await openai.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: chunks,
  encoding_format: 'float',
});
// INSERT ... ON CONFLICT (object_key, chunk_no) DO UPDATE
```

Make the write idempotent. Triggers deliver at least once and retry failed deliveries for up to 72 hours, so keying rows by object and chunk number turns a repeat into an overwrite ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)). Long files are fine: a function can take up to 15 minutes to respond ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

## 4. Query with SQL

Vector search orders by `embedding <=> $1::vector`. Keyword search uses `body_tsv <@> to_bm25query(...)` with BM25 ranking. Hybrid search fuses both, either with reciprocal rank fusion in SQL or a reranker through AI Gateway ([hybrid search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)). Because the chunks are ordinary rows, you can join them to your users, permissions, or tenants table in the same query. See [hybrid search in Postgres](/faqs/best-way-hybrid-search-bm25-vector-postgres).

## Branching the whole pipeline

Objects, functions, triggers, and indexed rows all branch together. A preview branch can read the parent's files and search the parent's chunks right away, and its triggers start disabled, so you can test a new parser on a copy without reprocessing production ([object branching](/docs/storage/objects#object-branching), [triggers and branching](/docs/compute/functions/triggers/overview#triggers-and-branching)). See [testing embedding and chunking changes](/faqs/test-embedding-model-chunking-changes-production-data).

## Cost and plans

AI Gateway draws from prepaid credits and bills embeddings on input tokens only ([embeddings](/docs/ai-gateway/embeddings), [hybrid search](/docs/ai/lakebase-search-get-started#use-jev-through-neon-ai-gateway)). If you embed elsewhere, the rest of the pipeline works the same. Functions bill only while processing a request ([plans](/docs/introduction/plans#functions)). Postgres compute scales to zero between uploads, and storage bills continuously.

<CTA title="Build search on Postgres" description="Install Lakebase Search, embed documents with AI Gateway, and run vector and BM25 queries." buttonText="Lakebase Search quickstart" buttonUrl="/docs/ai/lakebase-search-get-started" />
