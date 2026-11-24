---
title: 'Generate embeddings and store them in Postgres with pgvector'
subtitle: 'Turn text into vectors with the OpenAI SDK, store them in a pgvector column, and search them by meaning, in TypeScript or Python. No OpenAI API key required.'
author: neon-team
enableTableOfContents: true
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T23:21:12.096Z'
---

To generate embeddings and store them in Postgres, create a `vector` column with the [pgvector](/docs/extensions/pgvector) extension, call an embeddings API for each piece of text, and insert the vectors next to the rows they describe. Then search by embedding the question with the same model and ordering by distance.

This guide uses [Neon AI Gateway](/docs/ai-gateway/embeddings) to generate the vectors. Its embeddings endpoint is compatible with the OpenAI Embeddings API, so the OpenAI SDK works as is, with a Neon credential instead of an OpenAI key. The embedding model and the database live in the same Neon project, and both follow you onto every [branch](/docs/introduction/branching).

## Create the table

Enable pgvector and create a table with a `vector` column. The size must match the model's output: Neon AI Gateway's embedding models return 1024 dimensions ([embeddings](/docs/ai-gateway/embeddings#models)).

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  body      TEXT NOT NULL,
  embedding VECTOR(1024)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

Run it in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any Postgres client. The HNSW index keeps similarity search fast as the table grows, and `vector_cosine_ops` matches the `<=>` cosine distance operator used below ([pgvector indexing](/docs/extensions/pgvector#hnsw)).

## Embed text and insert it

Send a batch of strings in one request, then write each vector to its row. The response returns one embedding per input, in the same order:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap filename="embed.ts"
import 'dotenv/config';
import OpenAI from 'openai';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

const docs = [
  'Neon branches are copy-on-write clones of your database.',
  'Neon Object Storage is S3-compatible.',
  'Neon Functions run TypeScript next to your database.',
];

const { data } = await client.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: docs,
  encoding_format: 'float', // required on the openai SDK v6; harmless on v7+
});

for (const item of data) {
  await sql`
    INSERT INTO documents (body, embedding)
    VALUES (${docs[item.index]}, ${JSON.stringify(item.embedding)}::vector)
  `;
}
```

```python shouldWrap filename="embed.py"
import os

import psycopg
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1",
)

docs = [
    "Neon branches are copy-on-write clones of your database.",
    "Neon Object Storage is S3-compatible.",
    "Neon Functions run TypeScript next to your database.",
]

response = client.embeddings.create(model="qwen3-embedding-0-6b", input=docs)

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        cur.executemany(
            "INSERT INTO documents (body, embedding) VALUES (%s, %s::vector)",
            [(docs[item.index], str(item.embedding)) for item in response.data],
        )
```

</CodeTabs>

Install the dependencies with `npm install openai @neondatabase/serverless dotenv` or `pip install openai "psycopg[binary]" python-dotenv`. Both scripts pass the vector as text in pgvector's `[0.1, 0.2, ...]` format and cast it with `::vector`.

## Search by meaning

Embed the question with the same model, then order rows by cosine distance. Smaller distances are closer matches. These snippets reuse `client` and the database connection from the previous step:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap filename="search.ts"
const question = 'How do I get a copy of my database for testing?';

const { data } = await client.embeddings.create({
  model: 'qwen3-embedding-0-6b',
  input: question,
  encoding_format: 'float',
});

const rows = await sql`
  SELECT body, embedding <=> ${JSON.stringify(data[0].embedding)}::vector AS distance
  FROM documents
  ORDER BY distance
  LIMIT 3
`;

console.log(rows);
```

```python shouldWrap filename="search.py"
question = "How do I get a copy of my database for testing?"

response = client.embeddings.create(model="qwen3-embedding-0-6b", input=question)

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    rows = conn.execute(
        """
        SELECT body, embedding <=> %s::vector AS distance
        FROM documents
        ORDER BY distance
        LIMIT 3
        """,
        (str(response.data[0].embedding),),
    ).fetchall()

print(rows)
```

</CodeTabs>

The question shares almost no words with the branching row, but you'd expect that row to rank first, because the match is on meaning rather than keywords.

## Set the environment variables

The scripts read three variables:

```ini filename=".env"
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://[branch-host]
```

With the [Neon CLI](/docs/cli), `neon env pull --file .env` writes all three for the current branch ([`neon env pull`](/docs/cli/env#pull)). You can also copy them from the Neon Console: click **Connect**, then open the **AI Gateway** tab for the gateway values.

AI Gateway needs [prepaid credits](/docs/ai-gateway/prepaid-credits), which you can buy on any Neon plan, including Free, with a $5 minimum. Your project must be in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions).

## Pick an embedding model

All three models return 1024-dimensional vectors and bill on input tokens only ([embeddings](/docs/ai-gateway/embeddings#models), [model catalog](https://neon.com/models.json)):

| Model ID               | Price per 1M input tokens | Notes                                                                     |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `qwen3-embedding-0-6b` | $0.02                     | Unit-normalized. Supports `dimensions` for shorter vectors. Start here.   |
| `bge-large-en`         | $0.10                     | Unit-normalized. Reads only the first 512 tokens of each input.           |
| `gte-large-en`         | $0.13                     | Not normalized, so use cosine distance or normalize the vectors yourself. |

To store smaller vectors, pass `dimensions: 256` with `qwen3-embedding-0-6b` and create the column as `VECTOR(256)` ([shorter vectors](/docs/ai-gateway/embeddings#shorter-vectors-with-dimensions)).

## Use the Vercel AI SDK instead

In TypeScript apps on the [Vercel AI SDK](https://ai-sdk.dev), [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) reads the same environment variables. `embedMany()` embeds a batch in one call:

```typescript shouldWrap
import { neon } from '@neon/ai-sdk-provider';
import { embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: neon.embeddingModel('qwen3-embedding-0-6b'),
  values: docs,
});
```

## Test a new model or chunking strategy on a branch

You can't mix vectors from different models in one column, so changing models means re-embedding everything. A Neon branch is a copy-on-write clone of your database, with its own AI Gateway endpoint, so you can re-embed and compare results against real data without touching production:

```bash
neon branches create --name embeddings-test
neon env pull --branch embeddings-test --file .env.embeddings-test
```

Point the scripts at `.env.embeddings-test`, re-embed with the new model or chunk size, and run your search queries on both branches. Keep the change only if results improve. See [How do I test a new embedding model or chunking strategy on production data without affecting production?](/faqs/test-embedding-model-chunking-changes-production-data) for the full loop.

## Things to watch for

- **openai SDK v6 for JavaScript**: without `encoding_format: 'float'`, v6 returns an all-zeros vector with no error. v7 and later, the Python SDK, and raw HTTP aren't affected.
- **Batch size**: send up to 150 inputs per request. Split long documents into chunks first, especially with `bge-large-en`, which silently ignores everything after 512 tokens.
- **Dimensions must match**: inserting a 1024-dimensional vector into a `VECTOR(1536)` column fails. If you're moving from OpenAI's `text-embedding-3-small` (1536 dimensions), create a new column and re-embed.
- **Same model for questions and documents**: a question embedded with a different model than the stored rows returns meaningless distances.

## Scale up with Lakebase Search

The same `vector` column works with [`lakebase_vector`](/docs/extensions/lakebase-vector), which adds the `lakebase_ann` index with pgvector's types, operators, and query syntax. Its indexes live in storage, so they're ready after a compute wakes from scale to zero and on every branch without a rebuild ([Lakebase Search](/docs/ai/lakebase-search)):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE INDEX documents_embedding_ann ON documents USING lakebase_ann (embedding vector_cosine_ops);
```

To combine vector search with keyword search, see [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started). To embed files automatically as they're uploaded, see [How do I automatically index uploaded documents for search in Postgres?](/faqs/index-uploaded-documents-for-search-automatically)

## Related resources

- [Embeddings reference](/docs/ai-gateway/embeddings)
- [The pgvector extension](/docs/extensions/pgvector)
- [Generate embeddings with Neon AI Gateway](/blog/generate-embeddings-with-neon-ai-gateway)
- [Building semantic search with AI embeddings, Neon, and pgvector](/guides/ai-embeddings-postgres-search)

<NeedHelp/>
