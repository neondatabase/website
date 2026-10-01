---
title: 'Lakebase Search: the retrieval primitive for agents on Neon'
description: High-performance vector and BM25 search to build fast, scalable agents
excerpt: >-
  Build the search engine, ingestion layer, and serving layer for agent
  retrieval with Lakebase Search, Functions, Object Storage, and AI Gateway.
date: '2026-09-30T12:00:00'
category: product
categories:
  - product
authors:
  - pranav-aurora
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-on-neon/cover.png'
  alt: 'Lakebase Search for agent retrieval on Neon'
isFeatured: false
draft: false
seo:
  title: 'Lakebase Search: the retrieval primitive for agents on Neon'
  description: High-performance vector and BM25 search to build fast, scalable agents.
  keywords: []
  noindex: false
  ogTitle: 'Lakebase Search: the retrieval primitive for agents on Neon'
  ogDescription: >-
    Build the search engine, ingestion layer, and serving layer for agent
    retrieval with Lakebase Search and Neon.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-on-neon/cover.png'
---

<Admonition type="note" title="Lakebase Search is now generally available">
Lakebase Search just reached GA. Read the [Databricks announcement](https://www.databricks.com/blog/lakebase-search-state-art-full-text-and-vector-search-postgres).
</Admonition>

**[Lakebase Search](https://neon.com/docs/ai/lakebase-search) gives agents fast vector and BM25 search inside [Lakebase Postgres](https://neon.com/docs/introduction/neon-and-lakebase), without moving data to a separate search system. Combined with [Neon Functions](https://neon.com/docs/compute/functions/overview), [Object Storage](https://neon.com/docs/storage/overview), and [AI Gateway](https://neon.com/docs/ai-gateway/overview), it supports the full path from ingesting documents to serving hybrid search, with compute that scales independently of the index.**

High-quality search was once limited to companies such as Google and Amazon. Building it required search specialists and dedicated infrastructure. It was hard to get right, but small improvements in recall could materially affect the quality of the results.

Today, search is a core primitive for apps and AI agents. It connects operational data to models and underpins memory, personalization, and context. The quality of an agentic experience often depends on how well the agent can query that data.

Building retrieval for agents requires three components:

- **The search engine:** Runs fast, efficient search at scale.
- **The ingestion layer:** Turns raw data and documents into searchable indexes.
- **The serving layer:** Exposes the right query tools to agents through a consistent interface.

Neon [provides the primitives](https://neon.com/blog/neon-backend-is-ga) to build this pipeline around your data: [Lakebase Postgres](https://neon.com/docs/introduction/neon-and-lakebase) for storage and search, [Functions](https://neon.com/docs/compute/functions/overview) for TypeScript ingestion and serving, [Object Storage](https://neon.com/docs/storage/overview) for raw files, and [AI Gateway](https://neon.com/docs/ai-gateway/overview) for generating embeddings.

## Fast, scalable search in Postgres

[Lakebase Search](https://neon.com/docs/ai/lakebase-search) brings vector, keyword, and hybrid search to Neon through two Postgres extensions:

- `lakebase_vector` for semantic search
- `lakebase_text` for BM25 full-text search

You can use them together to build fast, scalable agents while keeping search alongside your operational data in Lakebase Postgres.

### Vector search with lakebase_vector

Standard HNSW indexes perform best when their working set remains in memory. As the corpus grows, this ties search capacity to the memory available on the serving compute.

`lakebase_vector` is designed for Lakebase Postgres's separated compute and storage architecture. Its durable index lives in object storage, while RAM and local storage cache frequently accessed data.

<figure>
<video autoPlay muted loop playsInline width="708" height="398" aria-label="Lakebase Postgres cache and storage hierarchy">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/cache-data-tiers-1416.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/cache-data-tiers-1416.mp4" type="video/mp4" />
</video>
<figcaption className="wp-element-caption"><em>The durable index lives in object storage. Frequently accessed pages move through the cache hierarchy into local NVMe and RAM, while compute can come and go independently.</em></figcaption>
</figure>

To work efficiently with this storage hierarchy, `lakebase_vector` combines hierarchical IVF with RaBitQ quantization. IVF narrows the search to a small set of relevant clusters, while RaBitQ compresses vectors so more index data fits in the faster cache layers.

<figure>
<video autoPlay muted loop playsInline width="708" height="282" aria-label="Hierarchical IVF and RaBitQ on object storage">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/ivf-rabitq-object-store-1416.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/ivf-rabitq-object-store-1416.mp4" type="video/mp4" />
</video>
<figcaption className="wp-element-caption"><em>Hierarchical IVF narrows each query to a small set of relevant clusters. Those clusters map to contiguous blocks that can be read in parallel, while RaBitQ reduces how much data each block contains.</em></figcaption>
</figure>

**Fully compatible with scale to zero.** The index stays in object storage when compute suspends. When traffic returns, compute reconnects to the same index instead of rebuilding it. This keeps idle compute costs down without making you rebuild the index before search can resume.

**Compatible with pgvector.** If you already use pgvector, switching to `lakebase_vector` does not require migrating data or changing queries. You add a `lakebase_ann` index while keeping the same vector types, distance operators, and query syntax.

**Built for better price-performance.** Because the durable index lives in object storage and compute scales independently, you do not have to size always-on compute around the full index. In our VectorDBBench tests on LAION-100M, Lakebase Search led the tested systems on price-performance:

![VectorDBBench price-performance comparison on LAION-100M](https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-retrieval-agents/chart.png)

The [Databricks announcement](https://www.databricks.com/blog/lakebase-search-state-art-full-text-and-vector-search-postgres) includes the results and methodology.

### Full-text search with lakebase_text

Agents also need another type of search: full-text search. Vector search finds similar meaning, while full-text search finds exact words and phrases.

`lakebase_text` adds the `lakebase_bm25` index type for BM25 keyword search. It preserves standard Postgres `tsvector` types and query operators while adding corpus-wide BM25 ranking and top-K pushdown.

Applications can combine vector and keyword results in one SQL query, giving agents both semantic matches and exact-term results.

## Build the ingestion pipeline with Neon Functions

Before data can be searched, it must be parsed, chunked, embedded, and indexed. A TypeScript [Neon Function](https://neon.com/docs/compute/functions/overview) can run these steps next to the data in Lakebase Postgres.

AI Gateway provides an OpenAI-compatible embeddings endpoint, so the Function can generate embeddings without configuring a separate model provider:

```ts
// functions/lib/embed.ts: turn text into vectors via AI Gateway
export async function embed(input: string[]): Promise<number[][]> {
  const response = await fetch(
    `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1/embeddings`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3-embedding-0-6b',
        input,
        encoding_format: 'float',
      }),
    }
  );

  return (await response.json()).data.map(
    (item: { embedding: number[] }) => item.embedding
  );
}
```

## Index documents when they are uploaded

With [Function Triggers](https://neon.com/docs/compute/functions/triggers/object-storage), raw files uploaded to Object Storage can become searchable automatically. A `storage_object_created` trigger invokes the ingestion Function with the bucket and object key:

```ts
// functions/ingest.ts: runs on storage_object_created
import { Hono } from 'hono';
import { pool } from './lib/db';
import { embed } from './lib/embed';
import { readObject, chunk } from './lib/docs';

const app = new Hono();

app.post('/', async (c) => {
  const { data } = await c.req.json();
  const chunks = chunk(await readObject(data.object_key));
  const vectors = await embed(chunks);

  for (let i = 0; i < chunks.length; i++) {
    await pool.query(
      `INSERT INTO chunks (source, ordinal, content, embedding)
       VALUES ($1, $2, $3, $4::vector)
       ON CONFLICT (source, ordinal) DO NOTHING`,
      [data.object_key, i, chunks[i], JSON.stringify(vectors[i])]
    );
  }

  return c.json({ indexed: chunks.length });
});

export default app;
```

## Expose retrieval as one tool

The final layer determines how the agent reaches your data. Another [Neon Function](https://neon.com/docs/compute/functions/overview) can wrap the hybrid query and expose it as one tool call.

That call runs vector and keyword search in Postgres and returns ranked passages with their sources:

```ts
// functions/search.ts: one tool call for hybrid search
import { Hono } from 'hono';
import { embed } from './lib/embed';
import { hybridSearch } from './lib/search';

const app = new Hono();

app.post('/', async (c) => {
  const { query, filters = {}, top_k = 8 } = await c.req.json();

  const [queryVector] = await embed([query]);
  const results = await hybridSearch(
    queryVector,
    query,
    filters,
    top_k
  );

  return c.json({
    results: results.map((result) => ({
      content: result.content,
      source: result.source,
    })),
  });
});

export default app;
```

## Let the agent search in a loop

Agents change the retrieval pattern. Instead of relying on one hand-tuned query, the agent can search, inspect the results, and decide whether to proceed or try again with a sharper query, tighter filters, or a different angle.

The loop has three steps:

- **Search:** Run a vector, keyword, or hybrid query.
- **Evaluate:** Let the agent inspect the returned passages.
- **Retry:** Rewrite the query or adjust its filters when the results are not good enough.

```ts
let hits = await searchDocs({ query });

while (needsMore(hits) && budget-- > 0) {
  query = await rewrite(query, hits);
  hits = await searchDocs({ query });
}
```

This pattern depends on search that can handle repeated queries without requiring permanently provisioned compute. With Lakebase Search, compute follows active demand and can suspend between periods of activity. The indexes remain durable in storage and are available when compute restarts.

## Build the retrieval stack around your data

Neon brings together the primitives needed for retrieval: [Lakebase Postgres](https://neon.com/docs/introduction/neon-and-lakebase), [Object Storage](https://neon.com/docs/storage/overview), [Neon Functions](https://neon.com/docs/compute/functions/overview), and [AI Gateway](https://neon.com/docs/ai-gateway/overview). Applications can store operational data, build vector and BM25 indexes, run ingestion code, and expose retrieval tools from the same backend.

The result is a retrieval stack built with familiar tools: Postgres for data and search, and TypeScript for ingestion and serving. Lakebase Search also preserves the price-performance benefits described above: the durable index lives in object storage while compute scales with query demand and can suspend when idle.
