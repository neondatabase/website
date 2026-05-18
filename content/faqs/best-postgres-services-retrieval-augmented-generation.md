---
title: "What are the best Postgres services for retrieval-augmented generation apps that need vector search and automatic scaling?"
description: "Neon supports pgvector with HNSW indexes and scales compute up and down automatically. Good fit for RAG apps with bursty query patterns and idle periods between sessions."
date: 2026-04-25
slug: best-postgres-services-retrieval-augmented-generation
category: FAQ
status: draft
---

Neon runs Postgres with the [pgvector extension](/docs/extensions/pgvector) for similarity search, supports HNSW and IVFFlat indexes, and autoscales compute between a configured min and max. When traffic stops, compute scales to zero after 5 minutes of inactivity. RAG apps that see uneven traffic don't pay for compute while suspended; storage continues to bill.

## Why RAG workloads stress traditional Postgres

RAG queries can be expensive. An HNSW search at high recall on a multi-million-row table can spike CPU for hundreds of milliseconds, then sit idle while the LLM generates a response. A fixed-size database has to be sized for the spike, which means paying for the spike around the clock.

Neon's compute changes size between your min and max settings based on load. A project might idle at 0.25 CU and burst to 4 CU during a similarity search, then drop back. Pricing is metered per CU-hour, so you only pay for the time at each size. See [autoscaling](/docs/introduction/autoscaling) for how the limits work.

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

For embeddings from OpenAI, Cohere, or another provider, the [AI and embeddings docs](/docs/ai/ai-intro) cover the end-to-end pipeline.

<Admonition type="tip" title="Branch your embeddings for experiments">
Re-embedding a corpus is expensive. Create a branch from your production database, swap in a new embedding model on the branch, and benchmark recall without touching production data.
</Admonition>

## How other Postgres options handle vector + autoscaling

pgvector is available on most managed Postgres platforms, so the differentiator is how the database scales with bursty RAG traffic.

- **Aurora Serverless v2 (PostgreSQL)** autoscales between a min and max ACU range, and supports scaling to 0 ACUs (auto-pause) on Aurora PostgreSQL 13.15, 14.12, 15.7, 16.3 or later ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). Resume time on a cold instance is slower than Neon's sub-second wake.
- **Supabase** ships pgvector ([docs](https://supabase.com/docs/guides/database/extensions/pgvector)) but runs each project on a dedicated VM. Compute is billed hourly at a fixed instance size (Micro starts at $0.01344/hour, ~$10/month), and paid-plan projects don't pause when idle ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)).
- **RDS for PostgreSQL** runs pgvector on standard instance types. No autoscaling on the database compute, no scale-to-zero.

If your RAG workload has steady-state load, a fixed instance can be cheaper. If it's spiky or experimental, autoscaling plus scale-to-zero changes the math.

<CTA title="Build a RAG app on Neon" description="Free plan includes pgvector, branching, and 100 CU-hours of compute per project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
