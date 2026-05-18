---
title: "Which database providers support pgvector for AI applications and also offer autoscaling for variable AI inference workloads?"
description: "Neon supports pgvector for similarity search and autoscales compute between a configured min and max. Compute also scales to zero when idle, so spiky AI workloads don't pay for downtime."
date: 2026-04-25
slug: database-providers-pgvector-autoscaling-ai-applications
category: FAQ
status: draft
---

Neon runs Postgres with the [pgvector extension](/docs/extensions/pgvector) and autoscales compute based on load. The same compute that idles at 0.25 CU between requests can scale up to 16 CU during a burst of similarity searches, then drop back. When traffic stops entirely, compute scales to zero after 5 minutes. AI workloads that go from quiet to busy and back fit this model well.

## Why AI workloads need autoscaling

Vector similarity searches are CPU-heavy. An HNSW query on a few million embeddings can pin a CPU for hundreds of milliseconds, but the rest of the time the database may be nearly idle while users read responses or wait on the LLM. A fixed-size database has to be provisioned for the spike, which means paying for the spike every hour of the month.

Neon's [autoscaling](/docs/introduction/autoscaling) changes compute size between a min and max you set:

- **Free**: autoscale up to 2 CU
- **Launch**: autoscale up to 16 CU
- **Scale**: autoscale up to 16 CU, fixed sizes up to 56 CU

Compute is billed in CU-hours at the average size during each hour, so you pay for the spike only while it lasts.

## pgvector setup

```sql
CREATE EXTENSION vector;

CREATE TABLE embeddings (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1536)
);

CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops);
```

For end-to-end examples with OpenAI, LangChain, and LlamaIndex, see [AI and embeddings](/docs/ai/ai-intro).

<Admonition type="tip" title="Branch for embedding experiments">
Test a new embedding model on a branch of your production data without re-embedding the whole corpus twice. Branches start instantly and share storage until you change something.
</Admonition>

## How other providers stack up

| Provider                          | pgvector                                                                    | Autoscaling compute                                                                                             | Scale to zero                                                                                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                              | Yes ([docs](/docs/extensions/pgvector))                                     | Between min/max CU, second-level scaling ([docs](/docs/introduction/autoscaling))                               | 5 min idle, sub-second wake                                                                                                                                                 |
| Aurora Serverless v2 (PostgreSQL) | Yes                                                                         | ACU range, scales automatically                                                                                 | 0 ACU auto-pause on Aurora PostgreSQL 13.15+/14.12+/15.7+/16.3+ ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| Supabase                          | Yes ([docs](https://supabase.com/docs/guides/database/extensions/pgvector)) | Manual compute size change, brief downtime ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)) | Paid plans run 24/7                                                                                                                                                         |
| RDS for PostgreSQL                | Yes                                                                         | None on the database compute                                                                                    | None                                                                                                                                                                        |

For AI inference workloads that swing between dozens of queries per second and idle minutes, the architectures that match are Neon and Aurora Serverless v2. Both bill compute by the moment-in-time size, both run pgvector with HNSW indexes. Neon's wake time is faster; Aurora's regional and IAM integration is deeper if you're already on AWS.

<CTA title="Run pgvector on autoscaling Postgres" description="Free plan includes pgvector, HNSW indexes, and 100 CU-hours of compute." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
