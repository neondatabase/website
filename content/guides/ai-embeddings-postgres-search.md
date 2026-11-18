---
title: Build and deploy a Lakebase Search API as a Neon Function
subtitle: Wire vector, full-text, and hybrid search into a serverless HTTP API that runs next to your database.
author: neon-team
enableTableOfContents: true
createdAt: '2026-11-18T00:00:00.000Z'
updatedOn: '2026-11-18T18:35:25.107Z'
---

In this guide, you build a search API and deploy it as a [Neon Function](/docs/compute/functions/overview), a long-running serverless function that runs on your Neon branch. The function embeds documents, stores them in Postgres, and answers queries with vector, full-text, and hybrid search.

The stack is [Lakebase Search](/docs/ai/lakebase-search-get-started) for the queries (`lakebase_vector` for vector search, `lakebase_text` for BM25 full-text search) and the [AI Gateway](/docs/ai-gateway/overview) for embeddings. Because the function runs on your branch, Neon injects `DATABASE_URL` and the AI Gateway credentials at runtime. [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started) covers running these queries from a script; this guide wires them into a deployed function.

## What you'll build

An HTTP API with two endpoints, running as a Neon Function:

- `POST /documents` embeds a document with the AI Gateway and stores it.
- `POST /search` embeds a query, runs vector and BM25 search, and fuses the results.

Embeddings come from the AI Gateway's `qwen3-embedding-0-6b` model (1024 dimensions), so the same Neon credential that reaches your database also reaches the model. At the end, you add optional reranking with a decision model.

## Prerequisites

- A Neon project on Postgres 16 or later, in an [AI Gateway region](/docs/ai-gateway/overview). Lakebase Search and the AI Gateway both require PG16+.
- The latest `neon` CLI, installed and authenticated (`npm install -g neon@latest`). Functions commands change often, so upgrade before you start.
- Node.js 20 or later. Deployed functions run on Node.js 24, so 24 is the closest local match.
- [Prepaid AI Gateway credits](/docs/ai-gateway/prepaid-credits), available on any plan. Embeddings and the decision model both bill against them.

## Set up the schema

Enable the extensions and create the table in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any connected client:

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;

CREATE TABLE documents (
  id        SERIAL PRIMARY KEY,
  title     TEXT NOT NULL,
  body      TEXT NOT NULL,
  embedding VECTOR(1024),
  body_tsv  TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

CREATE INDEX documents_embedding_idx ON documents
  USING lakebase_ann (embedding vector_cosine_ops);
```

`CASCADE` pulls in `pgvector`, which `lakebase_vector` depends on. The `VECTOR(1024)` column matches the `qwen3-embedding-0-6b` output size. The `lakebase_bm25` index comes later, after documents exist, because BM25 computes corpus-wide statistics at build time. For index tuning and the full schema walkthrough, see [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started).

<Steps>

## Set up the project

Create a directory and link it to your Neon project. `neon link` writes a `.neon` file and pulls the branch's environment variables into a local `.env`:

```bash
mkdir lakebase-search-api && cd lakebase-search-api
neon link
```

Install the dependencies. Inside a function you use a pooled `pg` client, not the serverless driver:

```bash
npm install @neon/config @neon/functions hono pg @neon/ai-sdk-provider@1.1.0 ai@7.0.133
npm install -D @types/pg
```

Keep the `ai` and `@neon/ai-sdk-provider` versions pinned while `experimental_decide` (used for reranking at the end) is experimental.

## Declare the function and AI Gateway

Create `neon.ts` at the project root. It declares your function and turns on the AI Gateway. `neon deploy` reads this file, provisions the gateway, and injects its credentials at runtime:

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  aiGateway: true,
  functions: {
    search: {
      name: 'Lakebase Search API',
      source: './functions/search.ts',
    },
  },
});
```

The key (`search`) is the function's slug: a permanent ID of 1 to 20 lowercase letters and digits, used in CLI commands and the URL. See the [neon.ts reference](/docs/reference/neon-ts) for all options.

## Write the handler

A function is any module whose default export has a `fetch(request)` method returning a `Response`. A [Hono](https://hono.dev) app exports that shape, so you can route multiple endpoints in one function.

Create `functions/search.ts`. It opens a `pg` pool once at module scope, reads the injected AI Gateway credentials through `@neon/ai-sdk-provider`, and exposes the two endpoints:

```ts filename="functions/search.ts"
import { Hono } from 'hono';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';
import { neon } from '@neon/ai-sdk-provider';
import { embed } from 'ai';

// Create the pool once at module scope so it's reused across requests.
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const app = new Hono();

// Embed text with the AI Gateway. The provider reads the injected
// credentials on its own, so the model ID is the only configuration.
async function embedText(text: string): Promise<string> {
  const { embedding } = await embed({
    model: neon.embeddingModel('qwen3-embedding-0-6b'),
    value: text,
  });
  return JSON.stringify(embedding);
}

// Ingest: embed a document and store it.
app.post('/documents', async (c) => {
  const { title, body } = await c.req.json();
  const vector = await embedText(body);

  const { rows } = await pool.query(
    `INSERT INTO documents (title, body, embedding)
     VALUES ($1, $2, $3::vector)
     RETURNING id, title`,
    [title, body, vector],
  );
  return c.json(rows[0]);
});

// Hybrid search: embed the query, then fuse vector and BM25 results with RRF.
// Returns rows shaped { id, title, score }.
async function hybridSearch(query: string, limit = 5) {
  const queryVector = await embedText(query);

  const { rows } = await pool.query(
    `WITH vector_ranked AS (
       SELECT id, RANK() OVER (ORDER BY dist) AS rank
       FROM (
         SELECT id, embedding <=> $1::vector AS dist
         FROM documents
         WHERE embedding IS NOT NULL
         ORDER BY dist
         FETCH FIRST 40 ROWS WITH TIES
       ) v
     ),
     keyword_ranked AS (
       SELECT id, RANK() OVER (ORDER BY score) AS rank
       FROM (
         SELECT id, score
         FROM (
           SELECT id, body_tsv <@> to_bm25query(
             to_tsvector('english', $2), 'documents_bm25'
           ) AS score
           FROM documents
         ) AS scored
         WHERE score < 0
         ORDER BY score, id
         LIMIT 40
       ) k
     )
     SELECT d.id, d.title,
       COALESCE(1.0 / (60 + v.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0) AS score
     FROM documents d
     LEFT JOIN vector_ranked v ON d.id = v.id
     LEFT JOIN keyword_ranked k ON d.id = k.id
     WHERE v.id IS NOT NULL OR k.id IS NOT NULL
     ORDER BY score DESC, d.id
     LIMIT $3`,
    [queryVector, query, limit],
  );
  return rows;
}

// Search: embed the query and return the fused ranking.
app.post('/search', async (c) => {
  const { query, limit = 5 } = await c.req.json();
  return c.json({ query, results: await hybridSearch(query, limit) });
});

export default app;
```

The vector search orders by cosine distance (`<=>`) against the `lakebase_ann` index. The BM25 search uses the `<@>` operator with `to_bm25query`, which returns negative scores, so lower is more relevant. Reciprocal Rank Fusion (RRF) scores each result by its position in the two lists (`1 / (60 + rank)`) and adds the scores. See [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search) for how these queries work in depth.

<Admonition type="important" title="Use a connection pool, not the serverless driver">
A function keeps running across requests, so connect to Postgres with a long-lived `pg` `Pool` created once at module scope. Don't use `@neondatabase/serverless` here: it's built for short-lived, per-request invocations. Call `attachDatabasePool(pool)` once after creating the pool (requires `@neon/functions` 0.8.0 or later) so an idle disconnect can't crash the isolate. See [Connecting to Postgres](/docs/compute/functions/get-started#connect-to-postgres).
</Admonition>

## Run it locally

`neon dev` serves the function with hot reload, injecting `DATABASE_URL` and the AI Gateway credentials from the linked branch:

```bash
neon dev
```

The terminal prints a local URL for the function:

```text
  Neon Functions dev server

  search               http://localhost:8787
```

## Load documents and build the BM25 index

With the dev server running, add a few documents through the ingest endpoint:

```bash shouldWrap
curl -X POST http://localhost:8787/documents \
  -H 'content-type: application/json' \
  -d '{"title":"Vector search on Postgres","body":"lakebase_vector adds a lakebase_ann index to Postgres for fast approximate nearest-neighbor search at billion-vector scale."}'

curl -X POST http://localhost:8787/documents \
  -H 'content-type: application/json' \
  -d '{"title":"BM25 full-text search","body":"lakebase_text adds a lakebase_bm25 index that provides BM25 ranking and top-K pushdown while preserving standard tsvector types."}'
```

Now that the table has data, create the BM25 index once in the SQL Editor:

```sql
CREATE INDEX documents_bm25 ON documents
  USING lakebase_bm25 (body_tsv)
  WITH (default_limit = 10);
```

After bulk-loading more documents later, run `VACUUM documents` to keep BM25 scores accurate. See [The lakebase_text extension](/docs/extensions/lakebase-text) for the details.

## Deploy

`neon deploy` reads `neon.ts`, bundles the function with esbuild, uploads it, and waits for the deployment to finish:

```bash
neon deploy
```

Retrieve the public URL once the deployment reaches `completed`:

```bash
neon functions get search
```

The `URL` field holds the public HTTPS URL for your function (`invocation_url` in `--output json`).

## Call the deployed API

Point the same requests at the deployed URL. Search returns the fused ranking:

```bash shouldWrap
curl -X POST https://<branch_id>-search.compute.<cell>.us-east-2.aws.neon.tech/search \
  -H 'content-type: application/json' \
  -d '{"query":"approximate nearest neighbor search","limit":5}'
```

```json
{
  "query": "approximate nearest neighbor search",
  "results": [{ "id": 1, "title": "Vector search on Postgres", "score": 0.032 }]
}
```

</Steps>

## Optional: rerank with a decision model

RRF ranks by position alone. To rank by whether each result actually answers the query, add reranking with [Jev](/docs/ai-gateway/decisions), a decision model served through the AI Gateway. It reads each candidate alongside the query and returns a probability, with no change to your schema. Jev bills against the same AI Gateway credits as embeddings.

Add the import and a reranking function to `functions/search.ts`:

```ts filename="functions/search.ts"
import { experimental_decide as decide } from 'ai';

type Candidate = { id: number; title: string; body: string };

// Returns rows shaped { id, title, score }, the same shape as hybridSearch.
async function rerankWithJev(query: string, limit = 5) {
  const queryVector = await embedText(query);

  const candidates = (
    await pool.query(
      `WITH vector_candidates AS (
         SELECT id
         FROM documents
         WHERE embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector
         LIMIT 40
       ),
       keyword_candidates AS (
         SELECT id
         FROM (
           SELECT id, body_tsv <@> to_bm25query(
             to_tsvector('english', $2), 'documents_bm25'
           ) AS score
           FROM documents
         ) AS scored
         WHERE score < 0
         ORDER BY score, id
         LIMIT 40
       ),
       candidate_ids AS (
         SELECT id FROM vector_candidates
         UNION
         SELECT id FROM keyword_candidates
       )
       SELECT d.id, d.title, d.body
       FROM candidate_ids AS c
       JOIN documents AS d ON d.id = c.id
       ORDER BY d.id`,
      [queryVector, query],
    )
  ).rows as Candidate[];
  if (candidates.length === 0) return [];

  const { answers } = await decide({
    model: neon.decisionModel('typesafeai-jev-1-14-0'),
    state: { query },
    questions: Object.fromEntries(
      candidates.map((doc, index) => [
        `d${index}`,
        {
          type: 'boolean' as const,
          instructions: {
            question:
              'Given the search query in state.query, does this candidate passage supply the specific information the user is looking for?',
            candidate: { title: doc.title, body: doc.body },
          },
          criteria: {
            true: 'The candidate states the specific facts or steps the query asks for.',
            false:
              'The candidate only shares keywords or a topic with the query, answers a different question, or lacks the requested information.',
          },
        },
      ]),
    ),
    maxRetries: 0,
    abortSignal: AbortSignal.timeout(10_000),
  });

  return candidates
    .map((doc, index) => {
      const answer = answers[`d${index}`];
      if (answer?.type !== 'boolean') {
        throw new Error(`Missing relevance probability for d${index}`);
      }
      return { doc, index, probability: answer.probability };
    })
    .sort((a, b) => b.probability - a.probability || a.index - b.index)
    .slice(0, limit)
    .map(({ doc, probability }) => ({ id: doc.id, title: doc.title, score: probability }));
}
```

Then update the `/search` handler to rerank when a request passes `rerank: true`, and fall back to RRF when it's absent. Both paths return the same `{ id, title, score }` shape:

```ts filename="functions/search.ts"
app.post('/search', async (c) => {
  const { query, limit = 5, rerank = false } = await c.req.json();

  const results = rerank
    ? await rerankWithJev(query, limit)
    : await hybridSearch(query, limit);

  return c.json({ query, results });
});
```

Jev sends the query and all candidates in one request, which must fit the model's 65,536-token context window. For long documents, search shorter passages or send fewer candidates. One result always ranks first even when none answers the query, so test with unanswered queries to pick a minimum probability for accepting a result. See [Decisions](/docs/ai-gateway/decisions) for the model and SDK details.

## Next steps

- [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started): the raw SQL for vector, BM25, and hybrid search
- [The lakebase_vector extension](/docs/extensions/lakebase-vector): `lakebase_ann` index options, operator classes, and tuning
- [The lakebase_text extension](/docs/extensions/lakebase-text): BM25 operators, functions, and index parameters
- [Neon Functions](/docs/compute/functions/overview): triggers, custom domains, authentication, and logs
- [Embeddings](/docs/ai-gateway/embeddings) and [Decisions](/docs/ai-gateway/decisions): the AI Gateway models this guide uses

<NeedHelp />
