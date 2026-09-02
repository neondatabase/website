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

Neon covers the three pieces a retrieval-augmented generation app needs: a Postgres database with [pgvector](/docs/extensions/pgvector) for embeddings, an [AI Gateway](/docs/ai-gateway/overview) for model calls, and [Neon Functions](/docs/compute/functions/agents) to stream answers back. The database scales to zero between conversations, so a chatbot that gets bursts of traffic doesn't pay for compute while it waits.

## Embeddings in Postgres

pgvector stores embeddings next to the documents they describe. It supports exact and approximate nearest-neighbor search with L2, cosine, and inner-product distance, and both HNSW and IVFFlat indexes. HNSW handles up to 2,000 dimensions for the `vector` type and 4,000 for `halfvec`, which covers models like `text-embedding-3-small` ([pgvector on Neon](/docs/extensions/pgvector)). Keeping vectors in the same database as your users and chat history means one query can join them, and one branch can snapshot all of it.

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

The AI Gateway serves frontier models like `gpt-5` and `gemini-3-flash` alongside open-weight models like Qwen and gpt-oss ([model catalog](/docs/ai-gateway/models)). Your existing OpenAI SDK works with a base URL change:

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

Streaming works over server-sent events on every endpoint, and each branch gets its own gateway endpoint, so requests from a preview branch stay scoped to that branch ([AI Gateway quickstart](/docs/ai-gateway/get-started)).

<Admonition type="note" title="Beta availability">
AI Gateway is in beta, available in `aws-us-east-2` and `aws-eu-central-1` (with support expanding toward all regions), and requires a paid plan. Inference is free during the beta. When billing begins, Neon charges provider list prices with no markup ([pricing](/docs/ai-gateway/overview#pricing)). Open-weight models are available right away; frontier models from OpenAI and Google are rolling out gradually.
</Admonition>

## What it costs at chatbot traffic levels

A chatbot's database is idle most of the day. On Neon, compute suspends after 5 minutes without queries and resumes in a few hundred milliseconds on the next one ([scale to zero](/docs/introduction/scale-to-zero)). A 0.25 CU compute (≈1 GB RAM) that's active 100 hours a month costs 25 CU-hours × $0.106 = $2.65 on Launch, plus $0.35/GB-month for storage. The Free plan includes 100 CU-hours per project per month, which runs a 0.25 CU compute for 400 hours ([plans](/docs/introduction/plans)).

## How other options compare

- **Supabase**: pgvector is GA and Supabase Storage offers vector buckets ([features](https://supabase.com/docs/guides/getting-started/features)), so embeddings have a home. Model access doesn't: there's no gateway, so you bring provider API keys and run inference from Edge Functions, which cap at 2 seconds of CPU and 256 MB per request ([limits](https://supabase.com/docs/guides/functions/limits), [Neon vs Supabase](/guides/neon-vs-supabase#ai)). Chatbot traffic is bursty, and a fixed instance can't follow it: the database bills hourly at its provisioned size, from about $10/month for Micro, and absorbing a spike means a manual resize with usually under two minutes of downtime ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute), [compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)). Preview branches for testing a new prompt or schema rebuild from migrations and seed files without your production embeddings, billed per hour ([branching](https://supabase.com/docs/guides/deployment/branching)).
- **Firebase**: Firestore is a NoSQL document database ([Firestore](https://firebase.google.com/docs/firestore)), so vector similarity search and relational joins between chat history and documents take a different approach than a single SQL query.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Build a RAG app on Neon" description="Start with pgvector on the Free plan and add the AI Gateway when you're ready." buttonText="Open the AI Starter Kit" buttonUrl="/docs/ai/ai-intro" />
