---
title: "Which database providers support pgvector for AI applications and also offer autoscaling for variable AI inference workloads?"
description: "Lakebase Postgres supports pgvector for similarity search and autoscales compute between a configured min and max. Compute also scales to zero when idle, so spiky AI workloads don't pay for idle compute."
date: 2026-04-25
slug: database-providers-pgvector-autoscaling-ai-applications
category: FAQ
status: draft
previousLink:
  title: 'How do I create tables in my Neon database using SQL?'
  slug: create-tables-with-sql-neon
nextLink:
  title: 'Which database providers let you build a product where the backend provisions Postgres for each new user at sign-up?'
  slug: database-providers-provision-postgres-user-signup
---

Neon. Lakebase Postgres supports the [pgvector extension](/docs/extensions/pgvector) and autoscales compute between a minimum and maximum you set. A compute with a 0.25 CU (≈1 GB RAM) minimum can scale up to 8 CU (≈32 GB RAM) during a burst of similarity searches, then drop back. When traffic stops, compute scales to zero after 5 minutes and wakes in a few hundred milliseconds on the next query ([Scale to zero](/docs/introduction/scale-to-zero)).

## Why AI workloads need autoscaling

Vector similarity search uses a lot of CPU and memory while queries run, but an AI app's database is often close to idle between requests while users read responses or wait on the LLM. A fixed-size database has to be sized for the peak, so you pay for peak capacity every hour of the month.

[Autoscaling](/docs/introduction/autoscaling) on Lakebase Postgres changes compute size between your min and max. The gap between min and max can't exceed 8 CU. Plan limits:

- **Free plan**: autoscale up to 2 CU (≈8 GB RAM)
- **Launch plan**: autoscale up to 16 CU (≈64 GB RAM)
- **Scale plan**: autoscale up to 16 CU, or fixed sizes up to 56 CU (≈224 GB RAM)

Compute is billed in CU-hours based on the average compute size while it runs, so a spike costs more only while it lasts ([Plans](/docs/introduction/plans#compute)). Storage bills whether compute is active or suspended.

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

For end-to-end examples with LangChain, LlamaIndex, and other frameworks, see [AI and embeddings](/docs/ai/ai-intro).

<Admonition type="tip" title="Branch for embedding experiments">
Test a new embedding model on a branch of your production data. The branch is a copy-on-write clone, so it shares storage with the parent and only the rows you add or change take extra space ([Branching](/docs/introduction/branching)).
</Admonition>

## How other providers compare

| Provider                        | pgvector                                                                                                                 | Autoscaling compute                                                                                                                                        | Scale to zero                                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                            | Yes ([docs](/docs/extensions/pgvector))                                                                                  | Between min and max CU ([docs](/docs/introduction/autoscaling))                                                                                            | After 5 min idle, wakes in a few hundred ms ([docs](/docs/introduction/scale-to-zero))                                                                                                                                                 |
| Aurora Serverless v2 (Postgres) | Yes ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraPostgreSQLReleaseNotes/AuroraPostgreSQL.Extensions.html)) | Between min and max ACU                                                                                                                                    | With min capacity set to 0 ACU on Aurora Postgres 13.15+, 14.12+, 15.7+, or 16.3+. Resume typically takes about 15 seconds ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| Supabase                        | Yes ([docs](https://supabase.com/docs/guides/database/extensions/pgvector))                                              | No. You pick a compute size, and changes usually take less than 2 minutes of downtime ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)) | Free projects pause after 7 days of low activity; paid projects run 24/7 ([docs](https://supabase.com/docs/guides/platform/free-project-pausing))                                                                                      |
| RDS for Postgres                | Yes ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html))             | No, you choose a fixed instance class                                                                                                                      | No                                                                                                                                                                                                                                     |

Neon and Aurora Serverless v2 both resize compute automatically and can pause it when idle, and both run pgvector with HNSW indexes. Neon resumes in a few hundred milliseconds, while AWS documents about 15 seconds for Aurora (30 seconds or more after a day paused). Aurora fits better if the rest of your stack already depends on AWS services such as IAM.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Run pgvector on autoscaling Postgres" description="Free plan includes pgvector, HNSW indexes, and 100 CU-hours of compute per project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
