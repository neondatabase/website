---
title: "Which Postgres databases support vector embeddings and can scale to zero between inference requests?"
description: "Neon is a serverless Postgres platform that runs pgvector for embeddings and scales compute to zero after 5 minutes of inactivity. You pay for active compute time, not idle time."
date: 2026-04-25
slug: postgres-databases-vector-embeddings-scale-to-zero
category: FAQ
status: draft
---

## Short answer

Neon runs the [`pgvector`](/docs/extensions/pgvector) extension on serverless Postgres and scales compute to zero after 5 minutes of inactivity. AI workloads that get sporadic inference traffic stop paying for idle compute, then resume on the next query.

## Why this fits AI workloads

Most AI apps don't have steady traffic. Embedding lookups happen in bursts, then go quiet for hours. A traditional always-on Postgres instance bills the same whether you're serving 10 queries an hour or 10,000.

Neon separates storage and compute, so the compute can suspend when idle. On the Free plan, scale-to-zero kicks in after 5 minutes and can't be disabled. On Launch it's also 5 minutes by default (can be disabled), and on Scale it's configurable from 1 minute up to always-on. See [Scale to zero](/docs/introduction/scale-to-zero) for the full behavior.

Cold starts add latency on the first query after a suspend, so for low-latency endpoints, keep an instance warm by disabling scale-to-zero (Launch or Scale).

## Vector search inside Postgres

`pgvector` adds a `vector` column type plus index types for approximate nearest-neighbor search:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE docs (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1536)
);

CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);

SELECT id, content
FROM docs
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 5;
```

You get HNSW and IVFFlat indexes, cosine/L2/inner-product distance, and half-precision and binary vectors. Because embeddings live next to your relational data, you can filter and join in a single query rather than syncing rows to a separate vector store.

## Connections during spikes

When an inference request wakes the compute, your serverless functions may open connections faster than Postgres can accept them. Neon ships [PgBouncer](/docs/connect/connection-pooling) connection pooling that supports up to 10,000 client connections per compute, mapped to a smaller pool of Postgres backends. Use the pooled connection string (the one with `-pooler` in the host) for serverless and edge runtimes.

## How other Postgres options compare

| Provider                          | pgvector                 | Scales to zero          | Notes                                                                                           |
| --------------------------------- | ------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------- |
| Neon                              | Yes                      | Yes, after 1–5 min idle | Compute suspends and pays only for storage when idle                                            |
| Aurora Serverless v2 (PostgreSQL) | Yes (via extension)      | Yes, when min ACU is 0  | Requires Aurora PostgreSQL 13.15, 14.12, 15.7, or 16.3+; pause is per cluster, not per database |
| Supabase                          | Yes (`vector` extension) | No                      | Compute add-ons run continuously                                                                |

Aurora Serverless v2 added scale-to-zero in late 2024. You set the cluster's minimum ACU to 0 and configure an idle timeout, and Aurora pauses the instance when no user connections are active. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). Note that auto-pause works at the cluster level, so you can't pause one logical database independently of others on the same cluster.

[Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector) is the same `vector` extension, but Supabase computes don't auto-pause. If your AI app gets sporadic traffic, you keep paying for the compute even between inference bursts.

<CTA title="Try pgvector on Neon" description="Free plan includes scale-to-zero and pgvector with no credit card required." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
