---
title: "Do I need a separate vector database for RAG?"
subtitle: "Usually not. With Lakebase Search on Neon, embeddings, BM25 text, and your app data live in one Postgres database, so retrieval is a SQL query with your tenant and permission filters in the WHERE clause, and there's nothing to sync."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I delete a database in Neon?'
  slug: delete-database-neon
nextLink:
  title: 'How do I create and download a backup of my Neon database to my local machine?'
  slug: download-database-backup-locally
---

Usually not. On Neon, [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, puts retrieval in the same database as your users, documents, and permissions. Your chunks and embeddings are another table. A RAG lookup is a top-K query that joins and filters like any other SQL.

## What a second database costs you

A separate vector store means every document exists twice: once in Postgres, once in the index. You need a pipeline that copies inserts, updates, and deletes, and you need to handle the window where the two disagree. A deleted document can still come back in retrieval until the sync catches up.

Permissions are the harder part. The vector store doesn't know who can see what, so you copy tenant IDs, ACLs, or document allowlists onto every vector as metadata and keep that copy current too. CommSync, which runs inbox search and agent retrieval on Lakebase Search, described the alternative: "Our agents' knowledge base is just another table. Retrieval is a cosine top-K where tenancy and each agent's document whitelist are WHERE clauses in the same query. There's no second vector database to mirror our permission model into" ([CommSync case study](/blog/commsync-runs-text-vector-and-hybrid-search-on-postgres-with-lakebase-search)).

## Retrieval in the same query as your data

```sql
SELECT c.content, c.source
FROM chunks c
JOIN documents d ON d.id = c.document_id
WHERE d.org_id = $2
  AND d.id = ANY($3)          -- documents this agent may read
ORDER BY c.embedding <=> $1::vector
LIMIT 8;
```

The `lakebase_ann` index from [`lakebase_vector`](/docs/extensions/lakebase-vector) serves the `ORDER BY`. It uses the same `vector` type, distance operators, and query syntax as `pgvector`, so existing `pgvector` tables need no migration: you add the index to the column you already have. For selective filters like the ones above, `SET lakebase_ann.prefilter TO on` evaluates them before full-precision reranking ([prefilter](/docs/extensions/lakebase-vector#prefilter)). The write path is one transaction: the document row and its chunks commit together or not at all.

## Will Postgres keep up?

The usual reason teams move vectors out of Postgres is HNSW memory. HNSW indexes must fit in memory, which ties search capacity to compute size. `lakebase_ann` uses IVF partitioning with RaBitQ quantization, keeps the index in storage, and scales to over 1 billion vectors on a single index, with builds the docs put at 50 to 100x faster than HNSW ([why lakebase_vector](/docs/extensions/lakebase-vector)).

Because the index lives in storage, it survives scale-to-zero without a rebuild. You don't pay for compute while it's suspended (storage still bills), and the next query reconnects to the same index ([scale to zero](/docs/introduction/scale-to-zero)). For latency-sensitive workloads, `lakebase_ann_prewarm` loads the hot parts of the index into memory after a compute starts ([prewarm](/docs/extensions/lakebase-vector#prewarm-an-index)).

RAG often needs exact terms too: product codes, error strings, names. [`lakebase_text`](/docs/extensions/lakebase-text) adds a BM25 index on `tsvector` in the same database, and you can fuse both result lists in one query ([hybrid search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)).

## The rest of the RAG backend

Embeddings can come from [AI Gateway](/docs/ai-gateway/embeddings), which serves 1024-dimension models such as `qwen3-embedding-0-6b` on an OpenAI-compatible endpoint (paid plans, prepaid credits). Any other provider works too: match the `vector` column to its dimensions. A [Neon Function](/docs/compute/functions/overview) can run ingestion and serve retrieval next to the database, with `DATABASE_URL` and the AI Gateway credentials injected ([environment variables](/docs/compute/functions/environment-variables)). Branches copy the database copy-on-write, so a test branch gets the same chunks and indexes without re-embedding ([branching](/docs/introduction/branching)).

A separate vector database can still make sense if vectors are your only data and you already run that system. If your app data lives in Postgres, keeping retrieval there removes the sync job and the permission copy.

## How other options compare

- **Pinecone**: you filter search results with metadata stored on each record or document, using operators such as `$eq` and `$in` (up to 10,000 values per array) ([Pinecone metadata filtering](https://docs.pinecone.io/guides/search/filter-by-metadata)). Tenant and permission data has to be written onto those records and kept current from your source database.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Add retrieval to your database" description="Enable lakebase_vector, index your embeddings, and run your first top-K query." buttonText="Get started" buttonUrl="/docs/ai/lakebase-search-get-started" />
