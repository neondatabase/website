---
title: "What are the best Postgres services for retrieval-augmented generation apps that need vector search and automatic scaling?"
description: "Lakebase Postgres on Neon supports pgvector with HNSW and IVFFlat indexes, autoscales compute within a min/max range, and scales to zero after 5 minutes of inactivity, which suits RAG apps with bursty traffic."
date: 2026-04-25
slug: best-postgres-services-retrieval-augmented-generation
category: FAQ
status: draft
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
  embedding vector(1536)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

The [AI Starter Kit](/docs/ai/ai-intro) links to RAG pipeline guides, framework integrations (LangChain, LlamaIndex), and starter apps.

<Admonition type="tip" title="Branch your embeddings for experiments">
Re-embedding a corpus is expensive. Create a [branch](/docs/introduction/branching) from your production database, write embeddings from a new model on the branch, and benchmark recall without touching production data.
</Admonition>

## How other providers compare

Supabase, Aurora, and RDS all support pgvector. They differ in how compute scales and what you pay when the database is idle.

- **Aurora Serverless v2 (Postgres)** autoscales between a min and max ACU range, and supports scaling to 0 ACUs (auto-pause) on Aurora Postgres 13.15, 14.12, 15.7, 16.3 or later ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). AWS puts typical resume time at about 15 seconds, or 30 seconds or more after a pause longer than 24 hours. A Neon compute reactivates within a few hundred milliseconds ([docs](/docs/introduction/scale-to-zero)).
- **Supabase** ships pgvector ([docs](https://supabase.com/docs/guides/database/extensions/pgvector)) and runs each project on a dedicated instance of a size you pick. Compute is billed hourly (Micro is $0.01344/hour, ~$10/month) ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)), and paid-plan projects don't pause when idle ([docs](https://supabase.com/docs/guides/platform/free-project-pausing)).
- **RDS for Postgres** supports pgvector ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html)) on a fixed instance class. Compute doesn't autoscale or scale to zero.

If your RAG workload runs at a steady load all day, a fixed instance can cost less. If it's spiky or still experimental, autoscaling and scale-to-zero mean you stop paying for compute you aren't using.

<CTA title="Build a RAG app on Neon" description="Free plan includes pgvector, branching, and 100 CU-hours of compute per project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
