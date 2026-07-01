---
title: 'Production RAG in Postgres: a blueprint for coding agents'
subtitle: Ship hybrid keyword and vector retrieval, reciprocal rank fusion, and session-aware context on Neon Postgres with copy-paste SQL and TypeScript patterns.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-06-08T00:00:00.000Z'
updatedOn: '2026-06-08T18:11:11.348Z'
---

When you start building retrieval-augmented generation (RAG), the typical first step is to choose an embedding model, turn on [pgvector](/docs/extensions/pgvector), add some chunks, and query with `ORDER BY embedding <=> query_vector LIMIT 5`. This vector search works for paraphrased questions, but has two main limitations as your project grows.

1. Embeddings approximate meaning, so exact tokens like product codes and error strings drift toward semantically similar text instead of the chunk that contains them verbatim.

2. A single query vector does not track previous messages. If a user asks a follow-up like "what about the second one?" the query will be embedded without any knowledge of the earlier conversation. The result is that the query lands in an area of the vector space that is unrelated to what came before.

![How vector-only retrieval misses on exact tokens and on follow-up questions that depend on earlier turns](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-vector-limits.svg 'no-border')

These are retrieval design problems, not model problems, and Postgres holds every layer that fixes them in one database, covering chunks, keyword indexes, vectors, and conversation state. This guide builds those layers with copy-paste SQL and TypeScript, in sections you can hand straight to a coding agent.

## Agent prompt

You can use the following prompt to generate a production-grade hybrid RAG application. This describes the schema, retrieval logic, history handling, and API design, ready to hand off to an agent or LLM to build. The following sections break down each component for further detail.

```bash shouldWrap
Create a new directory where you implement production grade RAG with Neon Postgres, FastAPI, Next.js and OpenAI with following:

- rag_chunks table: content, tsvector (GENERATED), pgvector embedding, tenant_id, content_hash, UNIQUE(document_id, chunk_index)
- ingest: chunk -> embedMany -> upsert ON CONFLICT (document_id, chunk_index), skip when content_hash is unchanged
- retrieve_hybrid() using RRF (k=60) over semantic + keyword lists, COALESCE content/metadata across a FULL OUTER JOIN, limit 8
- chat_sessions + chat_messages; embed last 6 turns + latest user message, keyword-search the latest message only
- Next.js route: hybrid retrieve -> stream LLM with recent turns passed as messages -> persist messages with chunk_ids in metadata
- Do not skip tenant_id filters. Do not use vector-only search in production without an eval comparison.

The documentation is at https://neon.com/docs/introduction which is the source of the information in the RAG.

Limit to 5 pages. Make sure to use relevant python libraries like langchain if required. Write the seed script to actually pick content from the website (vs picking it and hard-coding).
```

## Demo

The [agent prompt](#agent-prompt) above was used to generate a full reference app: hybrid retrieval, session-aware chat, live doc ingestion, and eval. The seed script fetches five pages from [Neon documentation](https://neon.com/docs/introduction) (introduction, Postgres overview, pgvector, full-backend quickstart, and the Cursor MCP guide), chunks them with LangChain, embeds with OpenAI, and upserts into Neon Postgres.

<DetailIconCards>

<a href="https://github.com/rishi-raj-jain/neon-production-rag" description="Production-grade hybrid RAG with FastAPI, Next.js, and OpenAI over live Neon documentation" icon="github">Production RAG in Neon</a>

</DetailIconCards>

<video controls playsInline loop width="800" height="600">
  <source type="video/mp4" src="https://github.com/user-attachments/assets/f7017dd8-ea23-44f1-bf36-5aeee743fa99"/>
</video>

## What agents should build first (checklist)

Build these three layers before you tune any prompts, in order.

1. **Chunk table** with stable ids, source metadata, and both `tsvector` and `vector` columns.
2. **Hybrid retrieval** that runs keyword and semantic search in parallel, then fuses the ranks.
3. **Session state** in Postgres so retrieval sees recent intent, not just the latest message.

![The chunk table, hybrid retrieval, and session state all living in one Postgres database and feeding a grounded answer to the LLM](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-layers.svg 'no-border')

If you leave out one of these layers, your model has to compensate. This leads to adding extra chunks to the prompt, which increases token cost and makes the answer less focused as lower-value content fills up the context window.

## Schema: organize your tables for RAG in Postgres

![Entity diagram showing rag_documents one-to-many rag_chunks, and chat_sessions one-to-many chat_messages, with the chunk table holding tsvector and vector columns](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-schema.svg 'no-border')

Neon is standard Postgres, so enable the `vector` extension once.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

The main data is organized in two tables. `rag_documents` stores information about each source, while `rag_chunks` contains the text chunks, their embeddings, and keyword vectors.

```sql
CREATE TABLE rag_documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id    text NOT NULL,          -- file, URL, or ticket identifier
  title        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rag_chunks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  uuid NOT NULL REFERENCES rag_documents(id) ON DELETE CASCADE,
  tenant_id    uuid NOT NULL,          -- keeps each customer's data separate
  chunk_index  int NOT NULL,
  content      text NOT NULL,
  metadata     jsonb NOT NULL DEFAULT '{}',
  searchable   tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(content, ''))
  ) STORED,
  embedding    vector(1536),           -- set to match your embedding model
  content_hash text NOT NULL,          -- detect when a source chunk actually changed
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, chunk_index)     -- stable identity, enables upserts
);

CREATE INDEX rag_chunks_searchable_idx ON rag_chunks USING GIN (searchable);
CREATE INDEX rag_chunks_embedding_idx ON rag_chunks
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX rag_chunks_tenant_idx ON rag_chunks (tenant_id);
```

<Admonition type="important" title="ANN recall under a tenant filter">
HNSW applies your `WHERE tenant_id = ...` filter around the approximate scan, not before it. For a small tenant inside a large index, that can return fewer than `LIMIT` rows or miss the best matches. If recall drops in production, raise `hnsw.ef_search` (for example `SET hnsw.ef_search = 100;`), enable iterative scans on pgvector 0.8 or later (`SET hnsw.iterative_scan = 'relaxed_order';`), or build a partial index for your largest tenants.
</Admonition>

Chat state has its own tables since the way you access messages is different from chunks. You retrieve chunks using vector and keyword searches, while messages are fetched by session and timestamp.

```sql
CREATE TABLE chat_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL,
  user_id      text NOT NULL,
  summary      text,                         -- can hold an optional summary of the chat
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chat_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role         text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content      text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX chat_messages_session_idx ON chat_messages (session_id, created_at DESC);
```

Always include a `tenant_id` filter in every retrieval query. If you leave it out, you risk showing one tenant's data in another tenant's results, since the model will use that data immediately before any other checks catch the mistake. To keep tenant data separate at the database level, see [Adopt Postgres RLS for Multi-Tenant Apps](/guides/rls-multi-tenant-apps).

<Callout title="Shared table vs project per customer">
The `tenant_id` column keeps every customer in one set of tables, which means one index and one migration to manage, but you carry the filter on every query and inherit the ANN recall caveat above. A [Neon project per customer](/use-cases/database-per-user) is the other option. Each customer gets isolated tables, so you drop the `tenant_id` filters entirely, each HNSW index holds only one customer's vectors (which removes that recall problem), and a delete is just dropping a project. The cost moves to routing connections per request and running migrations across many projects. For B2B with a bounded number of substantial tenants, the per-project model is often the better fit.
</Callout>

## Chunking: how to maximize retrieval quality

Chunk boundaries determine your maximum retrieval quality since each chunk is what you embed, rank, and send to the model. If a chunk is split in the middle of a sentence, it might rank highest but only contain part of the answer.

![A source document split on headings and paragraphs into chunks with shared overlap between neighbors, each chunk carrying source_id, title, and heading path metadata](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-chunking.svg 'no-border')

A few defaults that might help:

- 400 to 800 tokens for general docs, 150 to 300 for short answers like support tickets.
- Split on structure first (headings, paragraphs, message boundaries), and fall back to fixed character counts only when you must.
- Overlap adjacent chunks by 50 to 100 tokens so sentences on a boundary are not orphaned.
- Store `source_id`, `title`, and the heading path in metadata so citations render without re-fetching the parent.

A chunk's metadata might look like this:

```json
{
  "heading": "Refund policy",
  "page": 4,
  "url": "https://docs.example.com/billing/refunds"
}
```

When you split a document into chunks again, it's important to keep each chunk's identity stable. You can do this using a `UNIQUE` constraint on `(document_id, chunk_index)` and by storing a `content_hash` for each chunk. If the source document changes, upsert the chunks and update only those rows where the content_hash is different. This approach avoids re-embedding text that hasn't changed and keeps your results up to date. The next section covers how to perform this upsert.

## Ingest documents: chunk, embed, and upsert

![The write path: a source document split into chunks, embedded in one batch call, then upserted on document_id and chunk_index, writing only the chunks whose content_hash changed](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-ingest.svg 'no-border')

You need to populate the `embedding` column by splitting the document, embedding all the resulting chunks in a single batch, and upserting each one based on the `(document_id, chunk_index)` pair. The `searchable` column is generated automatically, so keyword search stays up to date without extra work.

```ts
import { createHash } from 'node:crypto';

// embedMany is a thin wrapper over your embeddings API, for example the Vercel AI SDK.
// pgvector accepts the embedding as its text format, e.g. '[0.1,0.2,...]'.
async function ingestDocument(opts: {
  tenantId: string;
  documentId: string;
  chunks: { index: number; content: string; metadata: Record<string, unknown> }[];
}) {
  const { tenantId, documentId, chunks } = opts;
  const embeddings = await embedMany(chunks.map((c) => c.content));

  for (const [i, chunk] of chunks.entries()) {
    const hash = createHash('sha256').update(chunk.content).digest('hex');

    await db.execute(sql`
      INSERT INTO rag_chunks
        (document_id, tenant_id, chunk_index, content, metadata, embedding, content_hash)
      VALUES
        (${documentId}, ${tenantId}, ${chunk.index}, ${chunk.content},
         ${JSON.stringify(chunk.metadata)}::jsonb, ${embeddings[i]}::vector, ${hash})
      ON CONFLICT (document_id, chunk_index) DO UPDATE
        SET content      = EXCLUDED.content,
            metadata     = EXCLUDED.metadata,
            embedding    = EXCLUDED.embedding,
            content_hash = EXCLUDED.content_hash
        WHERE rag_chunks.content_hash IS DISTINCT FROM EXCLUDED.content_hash;
    `);
  }
}
```

The `WHERE content_hash IS DISTINCT FROM EXCLUDED.content_hash` clause ensures that only rows with changed content are updated. This way, if you re-ingest a document that has only a few edits, the database updates just those specific chunks. To save on embedding costs, hash each chunk first and only call `embedMany` for chunks with a new hash.

## Baseline: vector-only retrieval (understand what you are improving)

![A query embedded into vector space, with the nearest chunks by cosine distance returned as the top k baseline result list](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-baseline.svg 'no-border')

Start by using semantic search on its own to retrieve the most relevant chunks for a given tenant. This approach provides a clear baseline to compare against once you introduce keyword search or fusion. Here’s an example query that returns the ten nearest chunks.

```sql
SELECT id, content, metadata,
       embedding <=> $1::vector AS distance
FROM rag_chunks
WHERE tenant_id = $2
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

`$1` refers to the embedding generated from your search query, using a model like OpenAI's `text-embedding-3-small`. Be sure to include this query in your evaluation suite so any future updates must demonstrate that they still handle paraphrased queries effectively.

## Hybrid keyword search with `tsvector`

Embeddings are great at capturing meaning, but they often overlook rare tokens like SKUs, error codes, or specific names. For example, searching for `ERR_4042` might bring up chunks with similar errors, not the exact match. Keyword search finds the exact token and helps retrieve those specific cases.

![A query fanning out to a semantic vector retriever that matches meaning and a keyword tsvector retriever that matches the exact token, then merging into one fused result](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-keyword-vs-vector.svg 'no-border')

When handling user input, `websearch_to_tsquery` treats it like a search box by splitting the text into words and honoring quoted phrases.

```sql
SELECT id, content, metadata,
       ts_rank_cd(searchable, websearch_to_tsquery('english', $1)) AS rank
FROM rag_chunks
WHERE tenant_id = $2
  AND searchable @@ websearch_to_tsquery('english', $1)
ORDER BY rank DESC
LIMIT 10;
```

Send user input to [`websearch_to_tsquery`](https://www.postgresql.org/docs/current/textsearch-controls.html) using a bound parameter. This function accepts any text without syntax errors, which is safer than `to_tsquery`, and using parameters protects against SQL injection. If your queries are machine-generated tokens like error codes, you may want to use `plainto_tsquery` instead. Keep in mind that `ts_rank_cd` uses Postgres's cover-density ranking system, not full [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25).

## Reciprocal rank fusion: merge vector and keyword lists in SQL

You handle fusion directly in SQL by running both retrievers and ranking the results in their own lists. Then, use reciprocal rank fusion (RRF) to merge the results. Each row gets a score calculated as the sum of `1 / (k + rank)` for every list where it appears. Set the constant `k` to 60 so that one top-ranked result does not completely control the final ranking.

![A semantic ranked list and a keyword ranked list scored by one over k plus rank, then merged so chunks that appear in both lists rise to the top](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-rrf.svg 'no-border')

```sql
WITH
  semantic AS (
    SELECT id, content, metadata,
           ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS rank
    FROM rag_chunks
    WHERE tenant_id = $3
    ORDER BY embedding <=> $1::vector
    LIMIT 20
  ),
  keyword AS (
    SELECT id, content, metadata,
           ROW_NUMBER() OVER (
             ORDER BY ts_rank_cd(searchable, websearch_to_tsquery('english', $2)) DESC
           ) AS rank
    FROM rag_chunks
    WHERE tenant_id = $3
      AND searchable @@ websearch_to_tsquery('english', $2)
    ORDER BY ts_rank_cd(searchable, websearch_to_tsquery('english', $2)) DESC
    LIMIT 20
  ),
  fused AS (
    SELECT id,
           COALESCE(s.content, k.content)   AS content,
           COALESCE(s.metadata, k.metadata) AS metadata,
           COALESCE(1.0 / (60 + s.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0) AS score
    FROM semantic s
    FULL OUTER JOIN keyword k USING (id)
  )
SELECT id, content, metadata, score
FROM fused
ORDER BY score DESC
LIMIT 8;
```

The `FULL OUTER JOIN` ensures that chunks found by either retriever are included. Since both subqueries return `content` and `metadata`, `COALESCE` selects whichever value is present in the merged result. The query uses three parameters: `$1` for the query embedding, `$2` for the raw query text, and `$3` for the tenant id. You can wrap this in a function such as `retrieve_hybrid(tenant_id, query_text, query_embedding)` so your app only needs to make a single call and you can manage the ranking logic in one place.

Hybrid retrieval shines on real datasets like support bots, internal documentation, or product catalogs where users search for codes and exact phrases. For very small datasets or short texts without identifiers, a pure vector search can perform just as well.

## Session-aware retrieval: bringing in thread state

Relying only on the most recent message creates a poor query. For example, "what about the second option?" is meaningless without the previous conversation, since the context is in earlier turns. Combine recent messages with the new input before generating the embedding.

![Recent turns, a rolling summary, and the latest message combined by buildRetrievalQuery into one string that is embedded and used for hybrid retrieval, with messages written back after each turn](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-session.svg 'no-border')

Combine the conversation history and the latest message for embedding, but perform keyword search on just the latest message. If your threads grow long, use a rolling summary that a background job updates every few turns. When users refer back to earlier content, you can boost chunks that were already cited in the session by adding a small constant to their fused score. Track these citations in `chat_messages.metadata`.

Start by reading the recent turns:

```sql
SELECT role, content
FROM chat_messages
WHERE session_id = $1
ORDER BY created_at DESC
LIMIT 6;
```

Build the retrieval string in TypeScript before creating the embedding, so the conversation thread provides context.

```ts
function buildRetrievalQuery(latestUserMessage: string, recent: { role: string; content: string }[]) {
  const history = recent
    .slice()
    .reverse()
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');
  return `Conversation:\n${history}\n\nLatest question:\n${latestUserMessage}`;
}
```

Instead of embedding only the latest message, embed the result from `buildRetrievalQuery(...)` so you capture the full conversation context. After each turn, store both the user message and this combined context, ensuring future retrievals include recent history. For conversations running beyond your fixed window, maintain a rolling summary on the session.

```sql
UPDATE chat_sessions
SET summary = $2, updated_at = now()
WHERE id = $1;
```

Once the window overflows, include the summary in your retrieval string. If retrieval does not work as expected, record the query string, embedding, and the ids of the returned chunks in an `ai_requests` table so you can later reproduce the exact scenario.

## End-to-end handler your agent can implement

![One chat request flowing through fetch recent turns, build and embed the query, hybrid retrieve, format context within a token budget, stream the LLM response, and persist the assistant message with cited chunk ids](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-request-flow.svg 'no-border')

A minimal Next.js route that ties chat, retrieval, and persistence together:

```ts
export async function POST(req: Request) {
  const { sessionId, tenantId, message } = await req.json();

  const recent = await db.query.chatMessages.findMany({
    where: eq(chatMessages.sessionId, sessionId),
    orderBy: desc(chatMessages.createdAt),
    limit: 6,
  });

  const retrievalText = buildRetrievalQuery(message, recent);
  const embedding = await embed(retrievalText);

  const chunks = await db.execute(sql`
    -- insert your fused hybrid SQL with ${tenantId}, ${retrievalText}, and ${embedding}
  `);

  await db.insert(chatMessages).values({ sessionId, role: 'user', content: message });

  // recent is newest-first from the query above, so flip it back to chronological order
  const history = recent
    .slice()
    .reverse()
    .map((m) => ({ role: m.role, content: m.content }));

  const stream = await streamText({
    model: openai('gpt-4o-mini'),
    system: formatChunksAsContext(chunks),
    messages: [...history, { role: 'user', content: message }],
    onFinish: async ({ text }) => {
      await db.insert(chatMessages).values({
        sessionId,
        role: 'assistant',
        content: text,
        metadata: { chunk_ids: chunks.map((c) => c.id) },
      });
    },
  });

  return stream.toDataStreamResponse();
}
```

The model takes in the recent turns as `messages` rather than just the latest one. This way, both retrieval and generation have access to the full conversation, so the model can handle references like "the second one" by itself.

Also, implement `formatChunksAsContext` so it extracts the title and url from each chunk's metadata ([example](https://github.com/rishi-raj-jain/neon-production-rag/blob/db7db273ce477271e602f073b38a8a654635b59c/frontend/lib/rag.ts#L104)). The function should track the total token count and remove the lowest scoring chunks first if including all of them would exceed the token limit for your context window. If you do not enforce a budget in this way, you may end up with too much context, and your model could silently truncate important information or degrade answer quality without any obvious error message to help you debug.

## Eval before you add complexity

Before you add rerankers or query rewriting, build a way to measure retrieval quality. A change that helps one query type often hurts another, and without a fixed set you will not see it.

- **Paraphrase questions**, where vector search should win.
- **Exact code or SKU lookups**, where keyword or hybrid should win.
- **Follow-ups** that only make sense with session context, like "tell me more about that."

![An eval set of paraphrase, exact-lookup, and follow-up queries run against a Neon branch, with a recall at k bar chart comparing vector-only against hybrid](/guides/images/hybrid-rag-postgres-agent/hybrid-rag-eval.svg 'no-border')

Test your retrieval approach on a [Neon branch](/docs/introduction/branching) that has a realistic number of chunks, similar to what you'll see in production. When your database is small, items often look more similar than they should, so the difference between good and bad chunk selection only becomes clear with a large enough dataset that includes real distractors.

After your basic recall is working well, try expanding the candidate pool to 50 or 100 results and use a [cross-encoder reranker](https://developers.openai.com/cookbook/examples/search_reranking_with_cross-encoders) to pick the best 8.

## Conclusion

Postgres on Neon brings all the essential pieces for a production-ready RAG system together in one place. It stores your chunks, indexes, vectors, and session data and gives you the flexibility to try out improvements in isolation before shipping to production. As you move from a prototype to a robust system, the real challenges are in designing your schema, building strong retrieval logic, and making sure your queries account for things like keyword accuracy and session context.
