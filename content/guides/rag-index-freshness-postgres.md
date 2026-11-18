---
title: 'Schedule a RAG re-index job with Neon Function Triggers'
subtitle: 'Keep a pgvector index on Postgres in sync with a scheduled Neon Function and AI Gateway embeddings'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-11-18T00:00:00.000Z'
updatedOn: '2026-11-18T16:40:23.122Z'
---

If you've built RAG workflows, you've probably run into this problem: someone updates a price in your documentation, but your assistant keeps quoting the old one for days. Nothing errors and no alert fires. Your application is working as expected, but your vector index is out of date.

The simplest way to fix this is to rebuild the entire index periodically: read every document, generate its embeddings again, and replace the existing vectors. This works, but it gets expensive as your corpus grows. If 10 documents change overnight in a corpus of 10,000, you end up embedding all 10,000 just to update 10.

A better approach is incremental indexing: detect which documents have changed and re-embed only those. To do this, you can maintain a version number for each document and increment it whenever the document is updated. Your sync job compares each document's current version with the version stored in its indexed chunks. If they don't match, process the document. If they do, skip it. This way, unchanged documents never reach the embedding API.

To keep the index up to date, this sync job needs to run periodically. [Neon Function Triggers](/docs/compute/functions/triggers/overview) make this possible by letting you schedule a function to run at regular intervals, without setting up a separate scheduler or worker.

In this guide, you'll build an incremental indexing pipeline using a scheduled [Neon Function](/docs/compute/functions/overview). It identifies documents that need re-indexing, generates embeddings only for those documents through the [Neon AI Gateway](/docs/ai-gateway/overview), and stores their chunks and vectors in Postgres using [pgvector](/docs/extensions/pgvector).

Here's what you'll build:

- A `documents` table with a `version` column and a `chunks` table that stores the embeddings.
- A `/sync` route that embeds only the documents whose current version isn't indexed yet.
- A schedule trigger in `neon.ts` that calls `/sync` every 15 minutes.

<CopyPrompt
  src="/prompts/rag-index-freshness-postgres-prompt.md"
  description="Use this prompt to customize the guide and build it with your AI agent."
  buttonText="Copy prompt"
/>

## How it works

The `documents` table holds the current state: one row per document, and every edit bumps its `version`. The `chunks` table holds the index: each row records the `version` its vector was built from.

A sync job looks for documents whose current `version` has no chunk, embeds only those, and writes a new chunk row. Because `version` is part of the chunk's primary key, a re-index adds rows next to the old ones instead of replacing them. Superseded chunks stay in the table, and the search query filters them out by matching the document's current version.

## Prerequisites

Before you begin, make sure you have the following:

1. **Node.js**: Version 22 or later (v24 recommended). Download from [nodejs.org](https://nodejs.org/).
2. **A Neon account with AI Gateway credits:** The AI Gateway needs [prepaid credits](/docs/ai-gateway/prepaid-credits), which you can buy on any plan, including Free. Sign up at [console.neon.tech](https://console.neon.tech/signup).
3. The **Neon CLI**, installed and authenticated:

   ```bash filename="Terminal"
   npm i -g neon@latest
   neon login
   ```

   See the [Neon CLI quickstart](/docs/cli/quickstart) for more details.

<Steps>

## Set up the project

Create a directory and link it to a Neon project:

```bash filename="Terminal"
mkdir rag-index-sync && cd rag-index-sync
npm init -y
neon link
```

Follow the prompts:

1. **Project**: Choose **Create new project** and name it `rag-index-sync`.
2. **Region**: Choose one of the [regions](/docs/compute/functions/overview#about-neon-functions) that support Neon Functions and the AI Gateway. This guide uses **AWS US East (Ohio)**.
3. **Setup as code**: Accept **Manage this project's Neon setup as code**, then select **Functions** and **AI Gateway**. Postgres is always included.

`neon link` creates a `.neon` context file, adds your branch variables to `.env.local`, installs the `@neon/config` and `@neon/env` packages, and generates a `neon.ts` configuration file. It also creates an example function, `hello.ts`.

Since you'll write your own function in the next step, delete the example file:

```bash filename="Terminal"
rm hello.ts
```

Optionally, install the [Neon](https://github.com/neondatabase/agent-skills/tree/main/skills/neon), [Postgres](https://github.com/neondatabase/agent-skills/tree/main/skills/neon-postgres), [Functions](https://github.com/neondatabase/agent-skills/tree/main/skills/neon-functions), and [AI Gateway](https://github.com/neondatabase/agent-skills/tree/main/skills/neon-ai-gateway) skills so your coding agent has the context for working with Neon:

```bash filename="Terminal"
neon skills -y -s neon -s neon-postgres -s neon-functions -s neon-ai-gateway
```

Install the dependencies the handler needs:

```bash filename="Terminal"
npm install hono pg openai @neon/functions
npm install -D typescript tsx @types/node @types/pg
```

## Create the schema

The RAG index uses two tables:

- **`documents`** is the source of truth. One row per logical document, with the `title`, `body` and a `version` for each version.
- **`chunks`** is the index. It stores the text that was embedded and the resulting `embedding`, keyed by `document_id`, `version`, and `chunk_index`. Because `version` is part of the key, a document can have chunks from several versions at once, so a re-index adds new rows instead of overwriting the old ones.

<Admonition type="note" title="Document-level versioning vs. chunk-level reuse">
This guide tracks changes at the document level. Whenever a document's `version` changes, the entire document is re-embedded. If documents are later split into multiple chunks, even a small edit to a single paragraph increments the document's `version`, triggering re-embedding of all its chunks rather than just the modified ones.

A more efficient approach is to reuse unchanged chunks across document revisions. Instead of relying solely on a document-level version counter, compute a fingerprint (hash) of each chunk's text. When a chunk's fingerprint remains unchanged, its existing embedding can be reused. Only newly added or modified chunks need to be embedded again.

However, editing one section can shift the boundaries of subsequent chunks, altering their text and fingerprints. As a result, those chunks may also need to be re-embedded, even when their underlying content has changed very little.
</Admonition>

Run the following SQL in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) to enable the `pgvector` extension and create the tables and the index.

```sql showLineNumbers
CREATE EXTENSION IF NOT EXISTS vector;

-- One row per logical document.
CREATE TABLE IF NOT EXISTS documents (
  id         text PRIMARY KEY,
  title      text NOT NULL,
  body       text NOT NULL,
  version    int  NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One row per chunk per document version.
CREATE TABLE IF NOT EXISTS chunks (
  id          text PRIMARY KEY,   -- `${document_id}:v${version}:${chunk_index}`
  document_id text NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version     int  NOT NULL,
  chunk_index int  NOT NULL,
  content     text NOT NULL,
  embedding   vector(1024) NOT NULL,
  synced_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chunks_embedding_idx
  ON chunks USING hnsw (embedding vector_cosine_ops);
```

Because `version` is part of the chunk key, the handler can tell old chunks from new ones by checking which version a document's chunks belong to.

Seed a couple of documents by inserting them into the `documents` table. Run the following SQL in the SQL Editor:

```sql showLineNumbers
INSERT INTO documents (id, title, body, version)
VALUES
  ('pricing-2026', 'Pricing 2026',
   'The Team plan costs $49 per month. The Growth plan costs $199 per month.',
   1),
  ('support-hours', 'Support hours',
   'Support is available Monday to Friday, 09:00 to 18:00 UTC.',
   1)
ON CONFLICT (id) DO NOTHING;
```

You'll embed them in the next step, then change one to test incremental indexing.

## Write the sync handler

In your project, create `functions/ragsync.ts` for the sync handler and add the following code:

```ts filename="functions/ragsync.ts" showLineNumbers
import { Hono } from 'hono';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';
import OpenAI from 'openai';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const MODEL = 'qwen3-embedding-0-6b';
const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const app = new Hono();

app.post('/sync', async (c) => {
  if (!c.req.header('x-neon-trigger-invocation-id')) {
    return c.json({ error: 'not a trigger call' }, 401);
  }

  const { rows: pendingDocs } = await pool.query<{
    id: string;
    title: string;
    body: string;
    version: number;
  }>(
    `SELECT d.id, d.title, d.body, d.version
       FROM documents d
      WHERE NOT EXISTS (
        SELECT 1 FROM chunks c
         WHERE c.document_id = d.id
           AND c.version = d.version
      )
      LIMIT 20`
  );

  let synced = 0;

  for (const doc of pendingDocs) {
    const text = `${doc.title}\n\n${doc.body}`;
    const response = await client.embeddings.create({
      model: MODEL,
      input: text,
      encoding_format: 'float',
    });
    const embedding = JSON.stringify(response.data[0].embedding);

    await pool.query(
      `INSERT INTO chunks (id, document_id, version, chunk_index, content, embedding)
       VALUES ($1, $2, $3, 0, $4, $5::vector)
       ON CONFLICT (id) DO NOTHING`,
      [`${doc.id}:v${doc.version}:0`, doc.id, doc.version, text, embedding]
    );

    synced += 1;
  }

  console.log(JSON.stringify({ event: 'rag_sync', scanned: pendingDocs.length, synced }));
  return c.json({ ok: true, scanned: pendingDocs.length, synced });
});

export default app;
```

The above code creates a Hono app with a single `/sync` route. It queries the `documents` table for up to 20 documents that have no chunk at their current `version`, generates embeddings for them using the AI Gateway, and inserts the resulting chunk into the `chunks` table.

Each document goes to the embedding model as one request, and the handler stores the result as a single chunk with `chunk_index` 0. In a real application, you would split long documents into multiple chunks and embed them in one request, as described in [Next steps](#next-steps).

The `/sync` route rejects any request without an `X-Neon-Trigger-Invocation-Id` header, which Neon adds to every trigger invocation and strips from client requests, so only triggers can reach it. See [Confirming a request came from Neon](/docs/compute/functions/triggers/overview#confirming-a-request-came-from-neon).

## Add the schedule trigger

Update `neon.ts` to add the `ragsync` function and a schedule trigger that calls its `/sync` route every 15 minutes. Also delete the `hello` function, which `neon link` created:

```ts filename="neon.ts" showLineNumbers
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  aiGateway: true,
  functions: {
    ragsync: {
      name: 'RAG index sync',
      source: './functions/ragsync.ts',
      dev: { port: 8787 },
    },
  },
  triggers: {
    'rag-sync-every-15': {
      type: 'schedule',
      function: 'ragsync',
      cron: '*/15 * * * *',
      functionPath: '/sync',
    },
  },
});
```

## Test it locally

You can test the function locally by first running `neon deploy` to register the scheduled trigger, then starting the dev server using the `neon dev` command. This starts a local server that listens for requests to your function. The dev server doesn't run the scheduled trigger, but you can invoke the `/sync` route manually to test the embedding logic.

Apply the `neon.ts` changes to register the function and trigger:

```bash filename="Terminal"
neon deploy
```

Start the dev server:

```bash filename="Terminal"
neon dev
```

Replay a scheduled invocation to embed the two seeded documents:

```bash filename="Terminal"
curl -s -X POST http://localhost:8787/sync \
  -H 'Content-Type: application/json' \
  -H 'X-Neon-Trigger-Invocation-Id: local-test-1' \
  -d '{"data":{"scheduled_at":"2026-11-14T10:00:00Z"}}'
```

```text
{"ok":true,"scanned":2,"synced":2}
```

The `scanned` count shows how many documents needed re-embedding, and `synced` shows the number of documents that were actually embedded. The first run embeds both documents, so both counts are 2. The handler logs the same counts to the console.

Run the same request again with a different invocation ID, as a redelivery would:

```bash filename="Terminal"
curl -s -X POST http://localhost:8787/sync \
  -H 'Content-Type: application/json' \
  -H 'X-Neon-Trigger-Invocation-Id: local-test-2' \
  -d '{"data":{"scheduled_at":"2026-11-14T10:15:00Z"}}'
```

```text
{"ok":true,"scanned":0,"synced":0}
```

The second run finds no documents to embed, so both counts are 0.

Now change one document and bump its `version` by running this SQL in the SQL Editor:

```sql showLineNumbers
UPDATE documents
SET body = 'The Team plan costs $59 per month. The Growth plan costs $199 per month.',
    version = version + 1
WHERE id = 'pricing-2026';
```

Replay the invocation again. The handler finds the updated document, embeds it, and adds a new chunk row:

```bash filename="Terminal"
curl -s -X POST http://localhost:8787/sync \
  -H 'Content-Type: application/json' \
  -H 'X-Neon-Trigger-Invocation-Id: local-test-3' \
  -d '{"data":{"scheduled_at":"2026-11-14T10:30:00Z"}}'
```

```text
{"ok":true,"scanned":1,"synced":1}
```

Both counts are 1, because one document's version changed since the last run.

## Search the index

Now run the query your application uses: embed the question, look up the most similar chunks at their current version, and print what comes back. Because `pricing-2026` was edited after its first sync, this also shows that the search only sees the updated text.

Create `search.mjs` in your project root and add the following code:

```js filename="search.mjs" showLineNumbers
import pg from 'pg';
import OpenAI from 'openai';

process.loadEnvFile('.env.local');

const QUESTION = process.argv[2] ?? 'How much does the Team plan cost?';

const ai = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const { data } = await ai.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: QUESTION,
  encoding_format: 'float',
});
const queryVector = JSON.stringify(data[0].embedding);

const { rows } = await pool.query(
  `SELECT c.document_id, c.version, c.content,
          round((1 - (c.embedding <=> $1::vector))::numeric, 4) AS similarity
     FROM chunks c
     JOIN documents d ON d.id = c.document_id AND d.version = c.version
    ORDER BY c.embedding <=> $1::vector
    LIMIT 3`,
  [queryVector]
);

console.log(`\nQuestion: ${QUESTION}\n`);
console.table(rows);

await pool.end();
```

The above code embeds the question, finds the three most similar chunks at their current version, and prints them in a table with their similarity score.

```bash filename="Terminal"
node search.mjs
```

```text
Question: How much does the Team plan cost?

┌─────────┬─────────────────┬─────────┬────────────────────────────────────────────────────────────────────────┬────────────┐
│ (index) │ document_id     │ version │ content                                                                │ similarity │
├─────────┼─────────────────┼─────────┼────────────────────────────────────────────────────────────────────────┼────────────┤
│ 0       │ 'pricing-2026'  │ 2       │ 'Pricing 2026\n\nThe Team plan costs $59 per month. The Growth plan…'  │ '0.7761'   │
│ 1       │ 'support-hours' │ 1       │ 'Support hours\n\nSupport is available Monday to Friday, 09:00 to 18…' │ '0.2046'   │
└─────────┴─────────────────┴─────────┴────────────────────────────────────────────────────────────────────────┴────────────┘
```

The updated `$59` text comes back at version 2. The `$49` chunk the first sync wrote is still in the `chunks` table, but the join excludes it because `documents.version` is now 2.

Pass a different question as an argument to try another query. The support question ranks `support-hours` first and `pricing-2026` second.

```bash filename="Terminal"
node search.mjs "When is support available?"
```

## Answer with the retrieved chunks

You can extend the search script to feed the retrieved chunks into a chat model and get an answer. This is what your application does in a typical RAG workflow: embed the question, retrieve the most similar chunks, then ask the model to answer from them.

Create `ask.mjs` in your project root and add the following code:

```js filename="ask.mjs" showLineNumbers
import pg from 'pg';
import OpenAI from 'openai';

process.loadEnvFile('.env.local');

const QUESTION = process.argv[2] ?? 'How much does the Team plan cost?';

const ai = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const { data } = await ai.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: QUESTION,
  encoding_format: 'float',
});
const queryVector = JSON.stringify(data[0].embedding);

const { rows } = await pool.query(
  `SELECT c.content
     FROM chunks c
     JOIN documents d ON d.id = c.document_id AND d.version = c.version
    ORDER BY c.embedding <=> $1::vector
    LIMIT 3`,
  [queryVector]
);

const context = rows.map((row) => row.content).join('\n\n---\n\n');

const response = await ai.chat.completions.create({
  model: 'gpt-5-mini',
  messages: [
    {
      role: 'system',
      content:
        'Answer the question using only the context below. If the context does not contain the answer, say so.',
    },
    { role: 'user', content: `Context:\n${context}\n\nQuestion: ${QUESTION}` },
  ],
});

console.log(response.choices[0].message.content);

await pool.end();
```

Run the script to see the answer:

```bash filename="Terminal"
node ask.mjs "How much does the Team plan cost?"
```

```text
The Team plan costs $59 per month.
```

Ask the follow-up to see the second document used:

```bash filename="Terminal"
node ask.mjs "When is support available?"
```

```text
Support is available Monday to Friday, 09:00 to 18:00 UTC.
```

## Verify the schedule

You can check that the schedule trigger is also deployed on Neon by listing the triggers:

```bash filename="Terminal"
neon functions get ragsync
neon triggers list
```

You should see the function and the schedule trigger in the output.

You can also check the logs for the last 30 minutes to see if the schedule has run:

```bash filename="Terminal"
neon logs query --since 30m --source function --service-name neon-function/ragsync
```

</Steps>

## Next steps

The example above is a simple versioned sync. In production, you may want to add the following improvements:

- **Chunk long documents.** The handler embeds the whole document as one vector, which works until documents outgrow the model's input limit. You can split on headings first, then sentence-split only the sections that exceed the model's token budget. Split on structure rather than fixed length, because a heading-based split keeps an edit from shifting every chunk that follows it. Store one chunk row per piece, keyed by `${id}:v${version}:${index}`, and send them in one request instead of one call per chunk.
- **Retire old versions.** The old chunks remain in the `chunks` table, but you may want to delete them after a certain period of time. You can add a separate scheduled trigger that deletes chunks whose `version` is older than the current version of their document and older than a certain age. This keeps the table size manageable and avoids returning stale chunks in search results.

## Resources

- [Schedule a function](/docs/compute/functions/triggers/schedule)
- [Function Triggers overview](/docs/compute/functions/triggers/overview)
- [Embeddings in the AI Gateway](/docs/ai-gateway/embeddings)
- [pgvector extension](/docs/extensions/pgvector)
- [neon.ts reference](/docs/reference/neon-ts)

<NeedHelp/>
