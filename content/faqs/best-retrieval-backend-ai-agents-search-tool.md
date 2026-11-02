---
title: "What is the best retrieval backend for an AI agent's search tool?"
subtitle: "Use Neon: Lakebase Search runs vector, BM25, and hybrid search inside Lakebase Postgres, a Neon Function wraps the query as one tool call, and AI Gateway embeds the agent's queries with credentials injected into the Function."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best Postgres setup for serverless APIs?'
  slug: best-postgres-setup-serverless-apis
nextLink:
  title: 'What is the best Supabase alternative for a Postgres app that also needs auth, file storage, and functions?'
  slug: best-supabase-alternative-postgres-backend
---

Use Neon. Three pieces cover the retrieval path: [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, is the search engine. A [Neon Function](/docs/compute/functions/overview) is the tool endpoint the agent calls. [AI Gateway](/docs/ai-gateway/embeddings) turns each query into an embedding. They run in the same backend, and the Function gets `DATABASE_URL` and the gateway credentials injected ([environment variables](/docs/compute/functions/environment-variables)).

## Why agents stress a search backend

A person runs one search and reads the results. An agent searches, inspects what came back, and searches again with a sharper query or tighter filters until the results are good enough ([retrieval for agents](/blog/lakebase-search-retrieval-agents)):

```ts
let hits = await searchDocs({ query });
while (needsMore(hits) && budget-- > 0) {
  query = await rewrite(query, hits);
  hits = await searchDocs({ query });
}
```

That loop needs both semantic search, for questions phrased differently from the source, and exact-term search, for IDs, error strings, and names. It also produces bursts of queries separated by idle time.

## The search engine: Lakebase Search

[`lakebase_vector`](/docs/extensions/lakebase-vector) adds a `lakebase_ann` index on `pgvector` columns. It uses IVF with RaBitQ quantization and scales to over 1 billion vectors on one index. [`lakebase_text`](/docs/extensions/lakebase-text) adds a `lakebase_bm25` index that ranks `tsvector` columns with BM25 and returns the top K without scoring every match. You fuse the two lists in one SQL query with reciprocal rank fusion ([hybrid search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)).

Both indexes live in storage, so they survive scale-to-zero without a rebuild. Between bursts the compute can suspend, and you don't pay for compute while it's suspended ([scale to zero](/docs/introduction/scale-to-zero)). Tenant and permission rules are `WHERE` clauses in the same query, because the chunks sit next to the rest of your data.

## The tool: one Function, one endpoint

```ts
import { Hono } from 'hono';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const app = new Hono();

async function embed(text: string): Promise<number[]> {
  const res = await fetch(`${process.env.NEON_AI_GATEWAY_BASE_URL}/v1/embeddings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'qwen3-embedding-0-6b', input: text }),
  });
  return (await res.json()).data[0].embedding;
}

app.post('/search', async (c) => {
  const { query, top_k = 8 } = await c.req.json();
  const vector = await embed(query);
  const { rows } = await pool.query(
    `SELECT content, source FROM chunks ORDER BY embedding <=> $1::vector LIMIT $2`,
    [JSON.stringify(vector), top_k]
  );
  return c.json({ results: rows });
});

export default app;
```

Swap the single vector query for the hybrid RRF query when you need exact terms too. The `pg` pool at module scope with `attachDatabasePool` is the documented way to connect from a Function ([get started](/docs/compute/functions/get-started)). Function URLs are public, so verify the caller before searching ([Functions authentication](/docs/compute/functions/authentication)).

Declare the pieces in [`neon.ts`](/docs/reference/neon-ts) and run `neon deploy`:

```ts
aiGateway: true,
functions: { search: { name: 'Search tool', source: './functions/search.ts' } },
```

The agent can call this endpoint as a tool, or the agent itself can run on Functions: handlers have 15 minutes to start responding and can stream while they call models and tools ([agents on Functions](/docs/compute/functions/agents)). For MCP clients, the Functions docs include an [MCP server example](/docs/compute/functions/overview).

## Getting documents in

Raw files can go in [Object Storage](/docs/storage/overview). A `storage_object_created` [trigger](/docs/compute/functions/triggers/object-storage) invokes an ingestion Function with the bucket and key of each new object, and the Function chunks, embeds, and inserts rows. Keep it idempotent: a delivery can arrive more than once ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)).

## Limits to know

- AI Gateway is available on paid plans with prepaid credits. Embedding models return 1024 dimensions and accept up to 150 inputs per request. You can use another embedding provider and match the column size.
- Lakebase Search requires Postgres 16 or later. Build the `lakebase_bm25` index after the initial load and `VACUUM` after bulk loads so BM25 statistics stay accurate.
- Functions run on Node.js 24, with an account-wide default of 100 concurrent invocations ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

Branches carry the whole backend, so you can test a new chunking strategy or embedding model on a branch with production-shaped data and the same indexes before changing production ([branching](/docs/introduction/branching)).

<CTA title="Build your agent's search tool" description="Set up Lakebase Search, then expose it from a Neon Function." buttonText="Get started" buttonUrl="/docs/ai/lakebase-search-get-started" />
