---
title: 'Building a knowledge base with vector and BM25 search using Neon Lakebase Extensions'
subtitle: 'Learn how to build a scalable, highly-relevant semantic and full-text search application using Next.js and Neon’s lakebase_vector and lakebase_text extensions.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-06-15T00:00:00.000Z'
updatedOn: '2026-06-11T09:07:49.857Z'
---

When building an AI application, like a knowledge base, a support agent, or a retrieval-augmented generation (RAG) pipeline, you typically need two types of search:

1. **Semantic (Vector) Search:** To find documents based on meaning and context using AI embeddings.
2. **Keyword (Full-Text) Search:** To find documents based on exact keyword matches.

Historically, doing this in Postgres meant using `pgvector` with an HNSW index for vectors, and built-in full-text search with a GIN index for keywords. While functional, this approach hits scaling limits. HNSW indexes consume massive amounts of memory and build slowly. Meanwhile, GIN indexes lack native BM25 relevance scoring and must scan every single match before applying a `LIMIT` (no top-K pushdown), making keyword search sluggish on large tables.

Neon's new Lakebase Search extensions, `lakebase_vector` and `lakebase_text`, solve these problems by introducing two new index types:

- **`lakebase_vector`**: A drop-in upgrade for `pgvector` that uses IVF partitioning and RaBitQ quantization to scale to over 1 billion vectors on a single index, with 50-100x faster index builds.
- **`lakebase_text`**: A BM25 full-text search index that seamlessly integrates with native Postgres `tsvector` types, providing true BM25 relevance scoring and rapid top-K pushdown.

Because these indexes live in storage rather than being bound to compute memory, they survive Neon's scale-to-zero cold starts instantly and carry over effortlessly when you branch your database.

In this guide, you will build a functional **knowledge base** using **Next.js**, the Neon serverless driver, and OpenAI. Your application will feature a UI that lets users toggle between Vector Search and BM25 Keyword Search so you can see the strengths of both engines in action.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `18` or later installed.
- **Neon account:** A Neon project with Postgres 16 or later. If you don't have one, [sign up for free](https://console.neon.tech/signup).
- **OpenAI API key:** An active API key from [OpenAI](https://platform.openai.com/api-keys) to generate text embeddings.

<Steps>

## Set up your Neon database

First, enable the required extensions in your Neon database.

1. Navigate to your project in the [Neon Console](https://console.neon.tech).
2. Open the **SQL Editor**.
3. Run the following command to enable both extensions:

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;
```

<Admonition type="note">
The `CASCADE` keyword on `lakebase_vector` automatically installs the standard `pgvector` extension if it isn't already present, since `lakebase_vector` relies on standard `pgvector` data types.
</Admonition>

4. Navigate to your project **Dashboard** and copy your Postgres connection string (ensure you select the "Pooled connection").

## Initialize the Next.js project

Create a new Next.js application and install the necessary dependencies for database connectivity and AI embeddings.

1. **Create the app:**

```bash
npx create-next-app@latest next-lakebase-search --yes
cd next-lakebase-search
```

2. **Install dependencies:**

```bash
npm install @neondatabase/serverless openai dotenv
npm install -D tsx
```

3. **Configure environment variables:**

Create a `.env.local` file in the root of your project and add your database and OpenAI credentials:

```env filename=".env.local"
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
OPENAI_API_KEY="your-openai-api-key"
```

## Create the Database Schema and Seed Script

We need a table to hold our knowledge base articles. We'll use a Next.js script to create the table, insert data (while generating embeddings via OpenAI), and _then_ create our Lakebase indexes.

<Admonition type="important" title="Create indexes after inserting data">
Both `lakebase_ann` and `lakebase_bm25` compute statistics at index build time. Building the index *after* you populate your initial data ensures accurate BM25 scoring (which relies on corpus-wide statistics) and optimal vector partitioning.
</Admonition>

Create a `scripts` folder in the root of your project, and add a `seed.ts` file:

```typescript filename="scripts/seed.ts" shouldWrap
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';

const sql = neon(process.env.DATABASE_URL!);
const openai = new OpenAI();

const articles = [
  {
    title: 'How to reset your password',
    category: 'Account',
    content: 'If you forgot your password, click the "Forgot Password" link on the login page. You will receive an email with a secure reset link. Passwords must be at least 12 characters long.'
  },
  {
    title: 'Understanding Database Branching',
    category: 'Engineering',
    content: 'Neon branching allows you to instantly copy your database copy-on-write. This is perfect for testing schema migrations or running CI/CD pipelines without affecting production.'
  },
  {
    title: 'PostgreSQL Full-Text Search Guide',
    category: 'Engineering',
    content: 'Standard Postgres uses GIN indexes for text search. However, the lakebase_text extension introduces the lakebase_bm25 index, offering true BM25 scoring and top-K pushdown for faster queries.'
  },
  {
    title: 'Billing and Subscription Tiers',
    category: 'Billing',
    content: 'We offer a Free Tier for hobbyists, a Pro Tier for growing applications, and Custom Enterprise plans. Usage is billed based on active compute time and storage.'
  }
];

async function seed() {
  console.log('Creating table...');
  await sql`
    CREATE TABLE IF NOT EXISTS kb_articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      embedding VECTOR(1536),
      content_tsv TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || content)) STORED
    );
  `;

  console.log('Clearing existing data...');
  await sql`TRUNCATE kb_articles RESTART IDENTITY;`;

  console.log('Embedding and inserting articles...');
  for (const article of articles) {
    const { data } = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: article.title + ' ' + article.content,
    });

    await sql`
      INSERT INTO kb_articles (title, category, content, embedding)
      VALUES (
        ${article.title},
        ${article.category},
        ${article.content},
        ${JSON.stringify(data[0].embedding)}::vector
      )
    `;
  }

  console.log('Building Vector and BM25 Indexes...');

  // Create lakebase_ann vector index
  await sql`
    CREATE INDEX IF NOT EXISTS kb_articles_ann_idx
    ON kb_articles USING lakebase_ann (embedding vector_cosine_ops);
  `;

  // Create lakebase_bm25 text index
  await sql`
    CREATE INDEX IF NOT EXISTS kb_articles_bm25_idx
    ON kb_articles USING lakebase_bm25 (content_tsv bm25_ops)
    WITH (default_limit = 10);
  `;

  console.log('✅ Database seeded successfully.');
}

seed().catch(console.error);
```

Run the script to populate your database:

```bash
npx tsx scripts/seed.ts
```

Notice the `WITH (default_limit = 10)` parameter on the text index. This tells Postgres to only calculate the top 10 results from the index before applying query limits. This is the "top-K pushdown" feature that makes `lakebase_text` incredibly fast.

## Create Server Actions for Search

Next, we'll create the backend logic to handle search queries from our frontend. We will use Next.js Server Actions to securely query the database.

Create a file named `app/actions.ts`:

```typescript filename="app/actions.ts" shouldWrap
'use server';

import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';

const sql = neon(process.env.DATABASE_URL!);
const openai = new OpenAI();

export type SearchResult = {
  id: number;
  title: string;
  category: string;
  content: string;
  score: number;
};

export async function vectorSearch(query: string, limit = 3): Promise<SearchResult[]> {
  if (!query) return [];

  // 1. Convert user query to vector embedding
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const queryEmbedding = data[0].embedding;

  // 2. Query using the standard pgvector <=> (cosine distance) operator
  const results = await sql`
    SELECT id, title, category, content,
           (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) AS score
    FROM kb_articles
    ORDER BY score ASC
    LIMIT ${limit}
  `;

  return results as SearchResult[];
}

export async function keywordSearch(query: string, limit = 3): Promise<SearchResult[]> {
  if (!query) return [];

  // Query using the lakebase_text <&> operator and to_bm25query function
  const results = await sql`
    SELECT id, title, category, content,
           (content_tsv <&> to_bm25query(
             to_tsvector('english', ${query}),
             'kb_articles_bm25_idx'
           )) AS score
    FROM kb_articles
    ORDER BY score ASC
    LIMIT ${limit}
  `;

  return results as SearchResult[];
}
```

### Understanding the queries

- **Vector Search:** We use the `<=>` operator to calculate the cosine distance between the query embedding and the document embedding. Lower distance means higher similarity, so we order by `score ASC`.
- **Keyword Search:** We use `to_bm25query()`, passing our `tsvector` query and the exact name of our BM25 index (`'kb_articles_bm25_idx'`). The `<&>` operator calculates the **negative** BM25 score. By ordering `ASC`, the lowest negative number (the highest relevance) comes first.

## Build the User Interface

Now let's build a simple UI that allows users to search the knowledge base and toggle between the two search engines.

Replace the contents of `app/page.tsx` with the following code:

```tsx filename="app/page.tsx" shouldWrap
'use client';

import { useState } from 'react';
import { vectorSearch, keywordSearch, type SearchResult } from './actions';

export default function Home() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'vector' | 'keyword'>('vector');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      if (mode === 'vector') {
        const res = await vectorSearch(query);
        setResults(res);
      } else {
        const res = await keywordSearch(query);
        setResults(res);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Knowledge Base
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Powered by Neon Lakebase Search (Vector + BM25)
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question or search keywords..."
              className="flex-1 rounded-md border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="flex items-center gap-6 justify-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="radio"
                name="mode"
                value="vector"
                checked={mode === 'vector'}
                onChange={() => setMode('vector')}
                className="text-blue-600 focus:ring-blue-500"
              />
              Semantic Vector Search
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="radio"
                name="mode"
                value="keyword"
                checked={mode === 'keyword'}
                onChange={() => setMode('keyword')}
                className="text-blue-600 focus:ring-blue-500"
              />
              BM25 Keyword Search
            </label>
          </div>
        </form>

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{result.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {result.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{result.content}</p>
                <div className="text-xs text-gray-400 font-mono bg-gray-50 inline-block px-2 py-1 rounded">
                  {mode === 'vector' ? 'Cosine distance: ' : 'BM25 score: '}
                  {result.score.toFixed(4)}
                </div>
              </div>
            ))
          ) : (
            query && !isSearching && (
              <p className="text-center text-gray-500 py-8">No results found.</p>
            )
          )}
        </div>
      </div>
    </main>
  );
}
```

## Run and test the application

Start your Next.js development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. You can now test how the two different search algorithms behave:

1. **Test Semantic Vector Search:**
   Select _Semantic Vector Search_ and search for: `"How do I safely duplicate my database?"`
   Even though the exact words "duplicate" and "safely" might not be in the articles, the vector search understands the _meaning_ and will successfully return the "Understanding Database Branching" article.

2. **Test BM25 Keyword Search:**
   Select _BM25 Keyword Search_ and search for: `"password reset"`
   Keyword search excels at exact terminology matches. It will bypass unrelated articles and hone in immediately on the "How to reset your password" article based on term frequency.

</Steps>

## Why Lakebase Search changes the game

By writing a simple Next.js app, you've built a search system that mirrors the capabilities of heavy, dedicated search infrastructure (like Elasticsearch paired with Pinecone), all living entirely inside Neon Postgres.

But the real magic happens as your application grows:

- **Massive Vector Scaling:** As your knowledge base grows, standard HNSW indexes eventually exhaust compute RAM. `lakebase_ann` utilizes IVF partitioning and [RaBitQ quantization](https://www.elastic.co/search-labs/blog/rabitq-explainer-101), dramatically shrinking index size and utilizing sequential storage I/O. It handles **over 1 billion vectors** smoothly.
- **Instant Cold Starts:** AI agents and development environments often sit idle. When a Neon database scales to zero and wakes up, your `lakebase_ann` and `lakebase_bm25` indexes are available immediately without needing to load massive graphs into memory.
- **Painless Branching:** Want to test a new OpenAI embedding model (`text-embedding-3-large`) or a different text chunking strategy? Create a Neon branch. Your Lakebase Search indexes instantly carry over via copy-on-write, with zero rebuild time required.

## Source Code

You can find the complete source code for this example on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase-labs/next-lakebase-search-example" description="Complete source code for the Next.js Lakebase Search example" icon="github">Lakebase Search Example Repository</a>
</DetailIconCards>

## Resources

To take your application further, explore the official extension documentation to learn about fine-tuning your indexes:

- [The `lakebase_vector` extension](/docs/extensions/lakebase-vector) - Learn how to tune lists, probes, and configure residual quantization.
- [The `lakebase_text` extension](/docs/extensions/lakebase-text) - Learn how to optimize queries with the `prefilter` GUC for lightning-fast filtered text searches.

<NeedHelp />
