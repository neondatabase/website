---
title: 'Semantic search using OpenAI, pg_embedding and Neon'
description: >-
  Learn how to build semantic search experiences using OpenAI, Neon and
  pg_embedding
excerpt: >-
  A few weeks back, we published an AI-powered app where you can submit an idea
  for a startup and get a list of similar companies YCombinator has invested in.
  The app got attention on HackerNews and Twitter, resulting in 5,000+ visitors
  and 2,500+ submissions. If you haven’t had a...
date: '2023-08-25T14:54:35'
updatedOn: '2024-01-24T22:21:27'
category: community
categories:
  - community
  - product
authors:
  - mahmoud-abdelwahab
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/semantic-search/cover.png'
  alt: null
isFeatured: false
seo:
  title: 'Semantic search using OpenAI, pg_embedding and Neon - Neon'
  description: >-
    Learn how to build semantic search experiences using OpenAI, Neon and
    pg_embedding
  keywords: []
  noindex: false
  ogTitle: 'Semantic search using OpenAI, pg_embedding and Neon - Neon'
  ogDescription: >-
    Learn how to build semantic search experiences using OpenAI, Neon and
    pg_embedding
  image: 'https://cdn.neonapi.io/public/images/pages/blog/semantic-search/social.png'
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/semantic-search/image-6-73bc1d13.png)

A few weeks back, we published an AI-powered app where you can submit an idea for a startup and get a list of similar companies [YCombinator](https://www.google.com/url?q=https://ycombinator.com/&sa=D&source=editors&ust=1692973719736459&usg=AOvVaw0ozJ64gLXNprdZ3egLgAFh) has invested in. The app got attention on HackerNews and Twitter, resulting in 5,000+ visitors and 2,500+ submissions.

If you haven’t had a chance to try it out, go to [neon.tech/ycmatcher](https://www.google.com/url?q=https://neon.tech/ycmatcher&sa=D&source=editors&ust=1692973719736971&usg=AOvVaw3iq6JVIlLaP_junsRXY_As)

<video autoPlay playsInline muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/semantic-search/8e41c070-23a2-4ccd-961f-5abd8eccd94a-5ac64ad4.mp4" />
</video>

In this blog post, we will cover how we built the app using [OpenAI](https://www.google.com/url?q=https://openai.com/&sa=D&source=editors&ust=1692973719737663&usg=AOvVaw01dFs052syNHfRqGB2tjm_), Neon, and [pg_embedding](https://www.google.com/url?q=https://github.com/neondatabase/pg_embedding&sa=D&source=editors&ust=1692973719737975&usg=AOvVaw2ndvmUSRJCinLA_RLwezjM).

## How the app works

The app uses semantic search, a search technique that understands the meaning behind a user’s search query. This is more powerful than keyword-based search that looks for exact string matches.

For example, consider these two search queries:

- “Ride-sharing for friends.”
- “An app that allows you to get from point A to point B, and you split the fee.”

Even though they’re completely different and have nothing in common from a lexical perspective, you will find that the app returns similar results. This is possible because we rely on vector embeddings and vector similarity search.

### What are vector embeddings?

A vector embedding is a vector (list) of floating point numbers. We can use it to represent unstructured data (e.g., text, images, audio, or other types of information).

What’s powerful about embeddings is they can capture the meaning behind the text and be used to measure the relatedness of text strings. The smaller the distance between two vectors, the more they’re related to each other and vice-versa.

Consider the following three sentences summarizing different books:

1. “A young wizard attends a magical school and battles against an evil dark lord.”
2. “A group of friends embarks on an adventurous journey to destroy a powerful ring and save the world.”
3. “A detective investigates a series of mysterious murders in a small town.”

For example, we can have the following embeddings:

- Summary #1 → `[0.1, 0.1, 0.1]`
- Summary #2 → `[-0.2, 0.2, 0.3]`
- Summary #3 → `[0.3, -0.2, 0.4]`

If we want to find out which two summaries are most related, we can calculate the distance between every two embeddings ( #1 and #2, #2 and #3, #1 and #3). The two embeddings closest to each other distance-wise are the most similar.

At a high level, this is how the YC idea matcher app works:

1. Convert the user’s search query into an embedding
2. Go through every company description and return the most similar ones

### Generating vector embeddings using OpenAI

One way to generate embeddings is by using [OpenAI’s Embeddings API](https://www.google.com/url?q=https://platform.openai.com/docs/guides/embeddings/how-to-get-embeddings&sa=D&source=editors&ust=1692973719741653&usg=AOvVaw2pm8aBBvdqENhJqx3uPaaW). It enables sending a text string to an API endpoint and returning a corresponding vector embedding.

Here’s an example API call using the `text-embedding-ada-002` model:

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-ada-002"
  }'
```

Example response:

```javascript
{
  "data": [
    {
      "embedding": [
        -0.006929283495992422,
        -0.005336422007530928,
        ...
        -4.547132266452536e-05,
        -0.024047505110502243
      ],
      "index": 0,
      "object": "embedding"
    }
  ],
  "model": "text-embedding-ada-002",
  "object": "list",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```

<blockquote>
<p>The <code>text-embedding-ada-002</code> has an output dimension of 1536. This means that the embedding array included in the response will have a size of 1536. There are other embedding models out there that you can use. However, keep in mind that when comparing the distance between two vectors, they must be of similar length.</p>
</blockquote>

### Vector similarity search in Postgres using pg_embedding

The process of representing data into embeddings and calculating the similarity between one or more items is known as vector search (or similarity search). It has a wide range of applications:

- Information Retrieval: you can retrieve relevant information based on user queries since you can accurately search based on the meaning of the user query. (This is what YC idea matcher does)
- Natural Language Processing: since embeddings capture the meaning of the text, you can use them to classify text and run sentiment analysis.
- Recommendation Systems: You can recommend similar items based on a given set of items. (e.g., movies/products/books, etc.)
- Anomaly Detection: since you can determine the similarity between items in a given dataset, you can determine items that don’t belong.

Storing and retrieving vector embeddings can be done in Postgres. This is incredibly useful because it eliminates the need to introduce an external vector store when building AI and LLM applications if you’re already using Postgres.

To get started, you can use [pg_embedding](https://github.com/neondatabase/pg_embedding) or [pgvector](https://github.com/pgvector/pgvector), which are two Postgres extensions that allow you to do vector similarity search.

<blockquote>
<p>YC idea matcher uses pg_embedding. However, since pg_embedding is compatible with pgvector, the YC idea matcher app can easily be converted to use pgvector instead.</p>
</blockquote>

To get started:

1\. Enable pg_embedding

```sql
CREATE EXTENSION embedding
```

2\. Create a column for storing vector data (this step was done in the data collection step for YC idea matcher)

```sql
CREATE TABLE documents(id integer PRIMARY KEY, embedding real[]);
INSERT INTO documents(id, embedding) VALUES (1, '{1.1, 2.2, 3.3}'),(2, '{4.4, 5.5, 6.6}');
```

3\. Run similarity search queries

```sql
SELECT id FROM documents ORDER BY embedding <=> ARRAY[1.1, 2.2, 3.3] LIMIT 1;
```

This query retrieves the ID from the documents table, sorts the results by the shortest distance between the embedding column and the array `[1.1, 2.2, 3.3]`, and returns only the first result.

The `<=>` operator calculates the [Cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) between two vectors. pg_embedding supports [Euclidean (L2) distance](https://en.wikipedia.org/wiki/Euclidean_distance) using the `<->` operator as well as [Manhattan distance](https://en.wikipedia.org/wiki/Taxicab_geometry) using the `<~>` . Cosine similarity works best when comparing vector embeddings that represent text.

## Code deep dive

You can find the app’s [source code on GitHub](https://github.com/neondatabase/yc-idea-matcher). In this section, we’ll cover how it works.

### Gathering the data

The first step was to gather company data from the [YCombinator public API](https://api.ycombinator.com/v0.1/companies). The API returns the data in the following format:

```javascript
{
  "companies": [
    {
      "id": 64,
      "name": "Y Combinator",
      "slug": "y-combinator",
      "website": "https://www.ycombinator.com",
      "smallLogoUrl": "https://bookface-images.s3.amazonaws.com/small_logos/2db694dd7905db37d037821a2fdaf9fa0708a964.png",
      "oneLiner": "Not your average fixed point combinator.",
      "longDescription": "Make something people want.",
      "teamSize": 100,
      "url": "https://www.ycombinator.com/companies/y-combinator",
      "batch": "",
      "tags": [

      ],
      "status": "Active",
      "industries": [
        "Fintech"
      ],
      "regions": [
        "United States of America",
        "America / Canada",
        "Remote",
        "Partly Remote"
      ],
      "locations": [
        "Mountain View, CA, USA"
      ],
      "badges": [
        "isHiring"
      ]
    },
    ...
  ],
  "nextPage": "https://api.ycombinator.com/v0.1/companies?page=2",
  "page": 1,
  "totalPages": 177
}
```

- `companies`: is an array of objects, where each object contains data about a specific company
- `nextPage`: contains the API endpoint URL with the page number specified as a query parameter
- `page`: the current page number
- `totalPages`: total number of pages. There are 177 in total, and each page returns an array of 25 companies (the last page returns three companies, so we have 4,403 companies in total. However, some companies didn’t have a long description, so we removed them.)

We then wrote a script that went through each page, and for each company’s long description, we generated an embedding and stored the company data in a Neon database.

```javascript
// generate-embeddings.ts
import { Pool } from 'pg';
import axios from 'axios';

const DATABASE_URL = '';
const OPENAI_API_KEY = '';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function createCompaniesTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS embedding;
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name TEXT,
        slug TEXT,
        website TEXT,
        "smallLogoUrl" TEXT,
        "oneLiner" TEXT,
        "longDescription" TEXT,
        "teamSize" INTEGER,
        url TEXT,
        batch TEXT,
        tags TEXT [],
        status TEXT,
        industries TEXT [],
        regions TEXT [],
        locations TEXT [],
        badges TEXT [],
        embedding REAL []
      );
    `);
    console.log('Companies table created successfully');
  } catch (error) {
    console.error('Error creating companies table:', error);
  } finally {
    client.release();
  }
}

async function scrapeCompanies(url: string) {
  try {
    const response = await axios.get(url);
    const { companies, nextPage } = response.data;

    for (const company of companies) {
      const { longDescription } = company;
      const embedding = await generateEmbedding(longDescription);
      await storeCompany(company, embedding);
    }

    if (nextPage) {
      await scrapeCompanies(nextPage);
    }
  } catch (error) {
    console.error('Error scraping companies:', error);
  }
}

async function generateEmbedding(text: string): Promise<number []> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-ada-002',
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const { data } = response.data;
    return data [0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
  }

  return [];
}

async function storeCompany(company: any, embedding: number []) {
  const {
    name,
    slug,
    website,
    smallLogoUrl,
    oneLiner,
    longDescription,
    teamSize,
    url,
    batch,
    tags,
    status,
    industries,
    regions,
    locations,
    badges,
  } = company;
  const client = await pool.connect();

  try {
    await client.query(
      `
      INSERT INTO companies (
        name, slug, website, "smallLogoUrl", "oneLiner", "longDescription", "teamSize", url, batch, tags, status, industries, regions, locations, badges, embedding
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `,
      [
        name,
        slug,
        website,
        smallLogoUrl,
        oneLiner,
        longDescription,
        teamSize,
        url,
        batch,
        tags,
        status,
        industries,
        regions,
        locations,
        badges,
        embedding,
      ]
    );

    console.log(`Company '${name}' stored successfully`);
  } catch (error) {
    console.error(`Error storing company '${name}':`, error);
  } finally {
    client.release();
  }
}

async function runScript() {
  await createCompaniesTable();
  await scrapeCompanies('https://api.ycombinator.com/v0.1/companies?page=1');
  await pool.end();
}

runScript();
```

Once we had the data, the last step was building the app. We used [Next.js](https://nextjs.org/), a React framework for building full-stack web applications.

### Building the UI and API

On the frontend, a form captures user submissions, tracks the submit event using Vercel analytics, and sends a POST request to an API endpoint.

We then render the API response, which is a list of companies. You can check out the frontend code [in the page.tsx file](https://github.com/neondatabase/yc-idea-matcher/blob/main/src/app/page.tsx)

As for the API, it has the following code:

```javascript
// app/api/idea/route.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { neon, neonConfig } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import { generateEmbeddings } from '~/utils';
import { z } from 'zod';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

neonConfig.fetchConnectionCache = true;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  analytics: true,
  limiter: Ratelimit.slidingWindow(2, '5s'),
});

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  const id = request.ip?? 'anonymous';
  const limit = await ratelimit.limit(id?? 'anonymous');

  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await request.json();

  const schema = z.object({
    idea: z
      .string()
      .min(20, {
        message: 'Idea must be at least 20 characters.',
      })
      .max(140, {
        message: 'Idea should be at most 140 characters.',
      }),
  });

  const validated = schema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: `Invalid request ${validated.error.message}` },
      { status: 400 }
    );
  }

  const { idea } = validated.data;

  try {
    const embedding = await generateEmbeddings(idea);

    const result = await sql(
      `SELECT id, name, "smallLogoUrl", website, "oneLiner", "longDescription", batch, url, status, industries FROM companies ORDER BY embedding <=> array[${embedding}] LIMIT 5;`
    );

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
```

The API endpoint is a serverless edge function deployed to the `us-east-1` region (Washington, D.C., USA) on Vercel. We specified this region since it’s the same region where the Neon database is deployed.

The [Neon serverless driver](https://github.com/neondatabase/serverless) is used to connect and send queries to the database. We’re enabling [experimental connection caching](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#fetchconnectioncache-boolean), which improves the performance of subsequent database queries.

We then use [Upstash](https://upstash.com/) to rate limit the API endpoint and [Zod](https://zod.dev/) to validate the incoming request body.

Lastly, we generate an embedding for the user-submitted query and return the five most similar companies as JSON.

## Final thoughts

The end result is fast since it uses a small data set. However, it’s important to create an index when working with a large amount of data (e.g., tens of thousands of rows or more). You can check out pg_embedding’s documentation to learn how to [create an HNSW index to optimize search behavior](https://neon.tech/docs/extensions/pg_embedding#create-an-hnsw-index).

If you have questions about building AI apps on Neon, feel free to reach out on [Twitter](https://twitter.com/neondatabase) or our [community forum](https://community.neon.tech/). We’d love to hear from you.

Also, if you’re new to Neon, you can [sign up for free](https://console.neon.tech/).
