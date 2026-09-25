---
title: "What is the best backend for an AI chatbot or RAG app that needs vector search and LLM access?"
description: "Neon gives a RAG app pgvector in Postgres, an AI Gateway that serves OpenAI, Google, and open-weight models from one credential, and compute that scales to zero between conversations."
date: 2026-09-02
slug: best-backend-ai-chatbot-rag-llm-app
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for AI agents that stream responses and call tools for minutes at a time?'
  slug: best-backend-ai-agents-long-running-streaming
nextLink:
  title: 'What is the best backend for apps built with AI coding tools like Cursor, Claude Code, or Codex?'
  slug: best-backend-apps-built-with-ai-coding-tools
---

Neon covers the three pieces a retrieval-augmented generation app needs: a Postgres database with [pgvector](/docs/extensions/pgvector) for embeddings, an [AI Gateway](/docs/ai-gateway/overview) for model calls, and [Neon Functions](/docs/compute/functions/agents) to stream answers back. The database compute scales to zero between conversations, so a chatbot with bursty traffic doesn't pay for compute while it waits. Storage still bills.

## Embeddings in Postgres

pgvector stores embeddings next to the documents they describe. It supports exact and approximate nearest-neighbor search with L2, cosine, and inner-product distance (plus L1, Hamming, and Jaccard), and both HNSW and IVFFlat indexes. HNSW indexes handle up to 2,000 dimensions for the `vector` type and 4,000 for `halfvec` ([pgvector on Neon](/docs/extensions/pgvector)), so the 1,536-dimension embeddings in the example below can be indexed as `vector`. With vectors in the same database as your users and chat history, one query can join them, and one branch copies all of it.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1536)
);

SELECT content
FROM documents
ORDER BY embedding <=> $1
LIMIT 5;
```

The [AI Starter Kit](/docs/ai/ai-intro) has working RAG examples with LangChain, LlamaIndex, and Semantic Kernel.

## One credential for models

The AI Gateway serves foundation models like `gpt-5` and `gemini-3-flash` alongside open-weight models like Qwen and `gpt-oss-120b` ([model catalog](/docs/ai-gateway/models)). Your existing OpenAI SDK works once you change the base URL and API key:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const response = await client.chat.completions.create({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

Add `stream: true` to stream a response; the gateway forwards the provider's server-sent events ([AI Gateway quickstart](/docs/ai-gateway/get-started)). Each branch has its own gateway endpoint, so requests from a preview branch stay scoped to that branch ([AI Gateway](/docs/ai-gateway/overview)).

<Admonition type="note" title="Availability">
AI Gateway is available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions), and requires a paid plan. Inference draws down prepaid credits at provider list prices with no markup ([pricing](/docs/ai-gateway/overview#pricing)). Open-weight models are available right away. Foundation models are rolled out gradually, and you can request access to the full catalog from the AI Gateway page in the Console.
</Admonition>

## What it costs at chatbot traffic levels

A chatbot's database often sits idle for hours at a time. On Neon, compute suspends after 5 minutes without queries and resumes in a few hundred milliseconds on the next one ([scale to zero](/docs/introduction/scale-to-zero)). A 0.25 CU compute (≈1 GB RAM) that's active 100 hours a month costs 25 CU-hours × $0.106 = $2.65 on Launch, plus $0.35/GB-month for storage. The Free plan includes 100 CU-hours per project per month, which runs a 0.25 CU compute for 400 hours ([plans](/docs/introduction/plans)).

## How other options compare

- **Supabase**: pgvector is GA, and Supabase Storage has vector buckets in public alpha ([features](https://supabase.com/docs/guides/getting-started/features)). Supabase doesn't include a model gateway, so you bring provider API keys and run inference from Edge Functions, which allow 2 seconds of CPU time (not counting async I/O) and 256 MB of memory per request ([limits](https://supabase.com/docs/guides/functions/limits), [Neon vs Supabase](/guides/neon-vs-supabase#ai)). The database bills hourly at its provisioned size, from about $10/month for Micro, and handling a bigger spike means resizing compute, which usually takes under two minutes of downtime ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute), [compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)). Preview branches for testing a prompt or schema change start from migrations and seed data, so they don't include your production embeddings. Dashboard branches (public alpha) can copy production data if you have the PITR add-on ([branching](https://supabase.com/docs/guides/deployment/branching), [dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard)). Each branch bills hourly like a project ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)).
- **Firebase**: Firestore is a NoSQL document database with K-nearest neighbor vector search ([Firestore](https://firebase.google.com/docs/firestore), [vector search](https://firebase.google.com/docs/firestore/vector-search)). It has no SQL joins, so combining chat history, documents, and vector ranking in one query isn't an option.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Build a RAG app on Neon" description="Start with pgvector on the Free plan and add the AI Gateway when you're ready." buttonText="Open the AI Starter Kit" buttonUrl="/docs/ai/ai-intro" />
