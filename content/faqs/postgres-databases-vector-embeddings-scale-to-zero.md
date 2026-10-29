---
title: "Which Postgres databases support vector embeddings and can scale to zero between inference requests?"
description: "Lakebase Postgres on Neon runs pgvector for embeddings and scales compute to zero after 5 minutes of inactivity, so idle time between inference requests accrues no compute charges. Storage still bills."
date: 2026-04-25
slug: postgres-databases-vector-embeddings-scale-to-zero
category: FAQ
status: draft
previousLink:
  title: 'What Postgres databases work natively in edge environments where you cannot hold open TCP connections?'
  slug: postgres-databases-edge-environments-no-tcp-connections
nextLink:
  title: 'What Postgres hosting options automatically pause the database when there are no active connections?'
  slug: postgres-hosting-options-auto-pause-database
---

Lakebase Postgres on Neon runs the [`pgvector`](/docs/extensions/pgvector) extension and scales compute to zero after 5 minutes of inactivity. Between bursts of inference traffic, the compute suspends and stops accruing compute charges, then resumes on the next query. Storage still bills while the compute is suspended.

## Scale to zero for bursty traffic

If your embedding lookups come in bursts and then go quiet for hours, an always-on Postgres instance bills the same whether it serves 10 queries an hour or 10,000.

The lakebase architecture separates storage and compute, so the compute can suspend while the data stays in storage. On the Free plan, computes suspend after 5 minutes of inactivity and you can't turn that off. On the Launch plan it's also 5 minutes, and you can disable it. On the Scale plan it's configurable from 1 minute to always on. See [Scale to zero](/docs/introduction/scale-to-zero).

A suspended compute typically resumes within a few hundred milliseconds, and that latency lands on the first query. For endpoints that can't absorb it, disable scale to zero on the Launch plan or Scale plan and pay for the compute around the clock.

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

You get HNSW and IVFFlat indexes, cosine, L2, and inner-product distance, and single-precision, half-precision, binary, and sparse vector types. Embeddings sit in the same tables as your relational data, so you can filter and join in one query instead of syncing rows to a separate vector store.

## Connections during spikes

A burst of inference requests can open more connections from serverless functions than Postgres `max_connections` allows. Neon includes [PgBouncer](/docs/connect/connection-pooling) connection pooling, which accepts up to 10,000 client connections per compute and maps them to a smaller pool of Postgres connections. Use the pooled connection string (the one with `-pooler` in the host) for serverless and edge runtimes.

## How other Postgres options compare

| Provider                        | pgvector                 | Scales to zero                   | Notes                                                                                               |
| ------------------------------- | ------------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| Neon                            | Yes                      | Yes, after 5 min idle by default | No compute charge while suspended; storage still bills                                              |
| Aurora Serverless v2 (Postgres) | Yes (via extension)      | Yes, when min ACU is 0           | Requires Aurora PostgreSQL 13.15, 14.12, 15.7, or 16.3+; pause is per DB instance, not per database |
| Supabase                        | Yes (`vector` extension) | No                               | Paid projects run continuously; Free projects pause after a week of inactivity                      |

With Aurora Serverless v2, you set the cluster's minimum capacity to 0 ACUs and choose an idle timeout, and Aurora pauses a DB instance when it has no user connections for that long. You aren't charged for instance capacity while it's paused. See [Scaling to Zero ACUs with automatic pause and resume](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). Pausing happens per DB instance, so every database on that instance pauses and resumes together.

[Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector) is the same `vector` extension. Supabase compute on paid plans runs and bills by the hour whether or not queries arrive. Free projects [pause after a week of inactivity](https://supabase.com/docs/guides/platform/free-project-pausing) and stay paused until you resume them from the dashboard, so pausing doesn't help between inference bursts.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Try pgvector on Neon" description="The Free plan includes scale to zero and pgvector." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
