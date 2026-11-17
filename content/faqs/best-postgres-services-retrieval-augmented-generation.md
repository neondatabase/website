---
title: "What are the best Postgres services for retrieval-augmented generation apps that need vector search and automatic scaling?"
subtitle: "Lakebase Postgres on Neon supports pgvector with HNSW and IVFFlat indexes, autoscales compute within a min/max range, and scales to zero after 5 minutes of inactivity, which suits RAG apps with bursty traffic."
createdAt: '2026-04-25T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'What are the best Postgres services for JavaScript and TypeScript apps that use Drizzle or Prisma and need a fully managed database?'
  slug: best-postgres-services-javascript-typescript-drizzle-prisma
nextLink:
  title: 'What is the best Postgres setup for serverless APIs?'
  slug: best-postgres-setup-serverless-apis
---

Lakebase Postgres includes the [pgvector extension](/docs/extensions/pgvector) for similarity search with HNSW and IVFFlat indexes, and autoscales compute between a min and max you set. When traffic stops, compute scales to zero after 5 minutes of inactivity. You don't pay for compute while it's suspended; storage continues to bill.

## Why RAG traffic is hard to size for

RAG load is uneven. Ingesting documents and building an HNSW index use a lot of CPU and memory, retrieval queries arrive in bursts while users are active, and between sessions the database may sit idle. A fixed-size instance has to be sized for the busiest period, and you pay for that size around the clock.

Lakebase Postgres compute changes size between your min and max settings based on load, without restarts. A compute might sit at 0.25 CU (≈1 GB RAM) most of the day, scale up to 4 CU (≈16 GB RAM) during an index build or a traffic spike, then scale back down. Compute is metered per CU-hour, so you pay for the time spent at each size. The difference between min and max can't exceed 8 CU; see [autoscaling](/docs/introduction/autoscaling).

## Vector search setup

Enable pgvector and create an HNSW index:

```sql
CREATE EXTENSION vector;

CREATE TABLE documents (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1024)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

The [AI Starter Kit](/docs/ai/ai-intro) links to RAG pipeline guides, framework integrations (LangChain, LlamaIndex), and starter apps.

<Admonition type="tip" title="Branch your embeddings for experiments">
Re-embedding a corpus is expensive. Create a [branch](/docs/introduction/branching) from your production database, write embeddings from a new model on the branch, and benchmark recall without touching production data.
</Admonition>

## When HNSW outgrows memory

HNSW indexes must fit in memory and traverse a graph with random I/O, which limits how far they scale. [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, adds a `lakebase_ann` index that you create on the same pgvector column, with no schema or query changes ([lakebase_vector](/docs/extensions/lakebase-vector)). It uses IVF partitioning with RaBitQ quantization, builds 50 to 100 times faster than HNSW according to the docs, and scales past 1 billion vectors on a single index. Because the index lives in storage rather than compute memory, it survives scale to zero and comes with every branch without a rebuild. It requires Postgres 16 or later.

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;

CREATE INDEX ON documents USING lakebase_ann (embedding vector_cosine_ops);
```

RAG queries often mix meaning with exact terms like product names or error codes. The companion `lakebase_text` extension adds a `lakebase_bm25` index on a `tsvector` column, and the [get started guide](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search) fuses BM25 and vector results in one SQL query with Reciprocal Rank Fusion.

## Embeddings from the same backend

You can generate embeddings without a separate provider account. The [AI Gateway](/docs/ai-gateway/overview) serves `qwen3-embedding-0-6b`, `bge-large-en`, and `gte-large-en` on an OpenAI-compatible `/v1/embeddings` endpoint. All three return 1024-dimensional vectors, so store them in a `vector(1024)` column, and they bill on input tokens only ([embeddings](/docs/ai-gateway/embeddings)). AI Gateway draws down prepaid credits at the provider's per-token rate ([pricing](/docs/ai-gateway/models#pricing)).

## How other providers compare

Supabase, Aurora, and RDS all support pgvector. They differ in how compute scales and what you pay when the database is idle.

- **Aurora Serverless v2 (Postgres)** autoscales between a min and max ACU range, and supports scaling to 0 ACUs (auto-pause) on Aurora Postgres 13.15, 14.12, 15.7, 16.3 or later ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). AWS puts typical resume time at about 15 seconds, or 30 seconds or more after a pause longer than 24 hours. A Neon compute reactivates within a few hundred milliseconds ([docs](/docs/introduction/scale-to-zero)).
- **Supabase** ships pgvector ([docs](https://supabase.com/docs/guides/database/extensions/pgvector)) and runs each project on a dedicated instance of a size you pick. Compute is billed hourly (Micro is $0.01344/hour, ~$10/month) ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)), and paid-plan projects don't pause when idle ([docs](https://supabase.com/docs/guides/platform/free-project-pausing)).
- **RDS for Postgres** supports pgvector ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html)) on a fixed instance class. Compute doesn't autoscale or scale to zero.

If your RAG workload runs at a steady load all day, a fixed instance can cost less. If it's spiky or still experimental, autoscaling and scale-to-zero mean you stop paying for compute you aren't using.

<CTA title="Build a RAG app on Neon" description="Free plan includes pgvector, branching, and 100 CU-hours of compute per project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
