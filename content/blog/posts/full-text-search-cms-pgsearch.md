---
title: Build Your Own Full-Text Search CMS with Neon and pg_search
description: An example project using pg_search with Neon
excerpt: >-
  A CMS is a “must-have” for building a website. And your choices are many. If
  you want full-stack, you can go with WordPress or Webflow. If you want
  headless, you can go with Sanity or Contentful. Heck, with the aid of a GitHub
  Action, you can just turn your Notion pages directly...
date: '2025-07-07T16:22:34'
updatedOn: '2026-03-19T19:38:54'
category: postgres
categories:
  - postgres
authors:
  - tristan-partin
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Build Your Own Full-Text Search CMS with Neon and pg_search - Neon
  description: >-
    An example project showing how to build a full-text search app with
    pg_search and Neon Postgres.
  keywords: []
  noindex: false
  ogTitle: Build Your Own Full-Text Search CMS with Neon and pg_search - Neon
  ogDescription: >-
    An example project showing how to build a full-text search app with
    pg_search and Neon Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/neon-full-text-search-1-1024x576-511e69b4.jpg)

<Admonition type="important" title="Neon’s support for pg_search has been deprecated">
As of March 19, 2026, `pg_search` is longer available for new Neon projects. For alternatives, see [The pg_search extension](https://neon.com/docs/extensions/pg_search).
</Admonition>

A CMS is a “must-have” for building a website. And your choices are many. If you want full-stack, you can go with WordPress or Webflow. If you want headless, you can go with Sanity or Contentful. Heck, with the aid of a GitHub Action, you can just [turn your Notion pages directly into a CMS](https://www.notion.com/templates/cms?srsltid=AfmBOoqknO2b0epM9mx_d8uhUGNerwexj-VVV-vUkLn7Gk63I85jRG4x).

But sometimes these are overkill. If you really just need a place to store words, then that is literally what databases are designed for. All CMSes are DBs under the hood – why not just remove the middleman?

That is what we’re going to do here, using Neon and the [pg_search](https://neon.com/docs/extensions/pg_search) extension. By adding `pg_search` into the mix, we can drastically improve our CMS experience by adding full-text search capabilities straightforwardly into our application. Let’s do it.

## Setting up Neon as a CMS

This is very simple. If you don’t already have a Neon account, sign up for one here. Then, create a new project. Call it whatever you want, but make sure you create it using AWS (`pg_search` is only currently available with AWS on Neon. Sorry, Azurers.).

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxfnv4ljafhe6esk5c9jjg0hgbxozrrszm8fcyqykbsupyes8temqvcp2xaaelpq1tk5vsw58au7fvxfas4zxe-xwawsnync4eykexuevrv8gaph1kaqjbuyqsh4gbf5cw1phpgw-46032239.png)

Once created, grab your connection URL as we’ll need that within our application.

We just need one SQL command right now:

```sql
CREATE EXTENSION IF NOT EXISTS pg_search;
```

This will allow us to use `pg_search` with Neon. There is an optional step you could take here: creating your data tables. However, we’re going to use Prisma to do that directly from our application.

## Creating our application with Next.js, Prisma, and Zod

You know how to create an application with Next.js. If not, just check out their docs here for the latest version. You can find all the code for this CMS application in this [repo](https://github.com/argotdev/neon-cms).

Apart from Neon and pg_search, the core part of this application is [Prisma](https://www.prisma.io/orm). Prisma is a type-safe database toolkit that makes working with databases easy. It auto-generates TypeScript types from your schema, handles migrations elegantly, and provides an intuitive query API to make complex database operations simpler.

To use Prisma, first install it along with its CLI:

```
npm install prisma @prisma/client
npm install -D @types/node
```

Next, initialize Prisma in your project:

```
npx prisma init
```

This creates a prisma directory with a `schema.prisma` file. This is the only thing you’ll need to update to connect to your Neon database:

```typescript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title     String
  slug      String   @unique
  body      String
  tags      String []
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@map("posts")
}
```

Here’s what each part does:

- **Generator block**: Tells Prisma to generate a JavaScript/TypeScript client that you’ll use in your code.
- **Datasource block**: Configures the Postgres connection using the DATABASE_URL from your environment variables.
- **Model post**: Defines your database table structure:
  - `id`: Primary key using Postgres’ native UUID generation (gen_random_uuid())
  - `title`: Plain text field for the post title
  - `slug`: Unique URL-friendly identifier for each post
  - `body`: Main content field
  - `tags`: Postgres array field for categorization
  - `createdAt`: Timestamp with timezone, automatically set on creation
  - `@map("created_at")`: Maps the Prisma field name to a snake_case column in the database

`@@map("posts")` maps the model name to a lowercase table name. This means your database table will be named `posts` instead of `Post`, following Postgres naming conventions where tables are typically lowercase and plural.

After defining your schema, generate the Prisma client and push the schema to your database:

```
npx prisma generate
npx prisma db push
```

The first command generates the TypeScript client with all the type definitions based on your schema. The second creates the actual table in your Neon database (here, we’ve [seeded our database](https://github.com/argotdev/neon-cms/blob/main/prisma/seed.ts) with a few posts to start):

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxe31awbxedbepr7lcsqya15hkgd2picl94iumjxrbdehrkkhpkvs0qq-7v79opf07zbm6agkgixdrfa3c7zddbdibq2jkd1ctmkyecpq3stgy-1f0pigk7af-obogjonogsirpq-30961bd2.png)

You can import and use the Prisma client anywhere in your application. We’ll use it within a [lib/db.ts](https://github.com/argotdev/neon-cms/blob/main/lib/db.ts) file to set up our database connection:

```typescript

import { Pool } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import { PoolClient } from 'pg';

declare global {
 var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV!== 'production') {
 global.prisma = prisma;
}

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
});

export async function withClient<T>(
 callback: (client: PoolClient) => Promise<T>
): Promise<T> {
 const client = await pool.connect();
 try {
   return await callback(client);
 } finally {
   client.release();
 }
}
```

This file sets up the Prisma client. The `withClient` function is the critical function here as it provides direct Postgres access through Neon’s serverless driver. This is crucial for `pg_search` operations that require raw SQL queries beyond Prisma’s capabilities (we’ll get to those in a moment).

We’re also using [Zod](https://zod.dev/). Zod is used for runtime validation, ensuring that data coming from API requests matches our expected schema before it hits the database. While Prisma gives us compile-time type safety, Zod protects us at runtime from malformed or malicious input.

```typescript
//schema.ts
import { z } from 'zod';

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  body: z.string().min(1),
  tags: z.array(z.string()).min(1),
});

export type Post = z.infer<typeof postSchema>;
```

The schema enforces that titles and slugs can’t exceed 255 characters, slugs must be URL-friendly (lowercase letters, numbers, and hyphens only), and posts must have at least one tag. The z.infer utility extracts a TypeScript type from the schema, giving us a single source of truth for both validation and typing.

That is the core of our application. Now let’s move on to the fun part.

## Using pg_search to enable full-text search

As we said above, we’re not going to be using the built-in Prisma client query functionality. Instead, we want to roll our own so we can take complete advantage of `pg_search`. Before we start with the code, let’s create a special index in our Neon database:

```sql
CREATE INDEX posts_search_idx ON posts USING bm25 (id, title, body, tags) WITH (key_field='id');
```

This index is critical. It creates a [BM25 index](https://docs.paradedb.com/documentation/concepts/index#bm25-index) across all our searchable fields. BM25 is a ranking algorithm specifically designed for full-text search that considers both term frequency and document length. Unlike simple keyword matching, BM25 provides relevance scoring that naturally promotes documents where search terms appear more frequently while penalizing overly long documents that might dilute relevance.

We’ll contain all our Postgres search functionality within one file, [lib/search.ts](https://github.com/argotdev/neon-cms/blob/main/lib/search.ts). Let’s step through it to understand what is happening:

```typescript
export interface SearchResult {
  id: string;
  title: string;
  body: string;
  snippet: string;
  score: number;
}
```

This is the shape of our search results. Each result includes the full post data plus a snippet field containing a highlighted excerpt of the matching text and a score representing the BM25 relevance ranking.

```typescript
export interface SearchOptions {
  /**Maximum rows to return. Default = 20*/
  limit?: number;
  /**Tag that wraps the first character of each hit. Default = <b>*/
  startTag?: string;
  /**Closing tag for the hit wrapper. Default = </b>*/
  endTag?: string;
  /**Levenshtein distance for fuzzy search. Default ≈ 20 % of query length (1‑3)*/
  fuzzyDistance?: number;
}
```

This is our configuration object for search behavior. The `startTag` and `endTag` options let you customize how matching terms are highlighted in snippets (defaulting to bold tags). The `fuzzyDistance` parameter enables typo tolerance – a value of 2 means the search will match terms even if they’re off by up to 2 character edits, making searches more forgiving of user mistakes.

```typescript
export async function searchPosts(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult []> {
  const {
    limit = 20,
    startTag = '<b>',
    endTag = '</b>',
    fuzzyDistance = Math.min(3, Math.max(1, Math.floor(query.length * 0.2))),
  } = options;

  return withClient(async (client) => {
```

Finally, before we get into the SQL, this is our main search function that accepts a query string and optional configuration. The fuzzy distance calculation is particularly nice. It scales with query length, allowing one character difference for short queries (5 characters or less), 2 for medium queries (6-10 characters), and maxing out at 3 for longer queries. This adaptive approach ensures that short searches remain precise while longer searches become more forgiving of typos.

We’re going to have a three-fold approach to make sure we find the best documents. The first search will be a BM25 keyword search on the title and the body:

```typescript
/** 1 ▸ BM25 keyword search on title+body --------------------------- */
   const bm25 = await client.query<SearchResult>(
     `
     WITH bm25 AS (
       SELECT id,
              title,
              body,
              paradedb.snippet(body, start_tag => $2, end_tag => $3) AS snippet,
              paradedb.score(id)                    AS base_score,
              (title @@@ $1)::int                   AS hit_title,
              (body  @@@ $1)::int                   AS hit_body
       FROM   posts
       WHERE  title @@@ $1 OR body @@@ $1
     )
     SELECT id,
            title,
            body,
            snippet,
            base_score*
              CASE
                WHEN hit_title = 1 AND hit_body = 1 THEN 2.5
                WHEN hit_title = 1                    THEN 2.0
                ELSE 1.0
              END                                   AS score
     FROM   bm25
     ORDER  BY score DESC
     LIMIT  $4;
     `,
     [query, startTag, endTag, limit],
   );
   if (bm25.rows.length) return bm25.rows;
```

The query here uses pg_search’s `@@@` operator to perform BM25 searches on both title and body fields. The `paradedb.snippet()` function generates highlighted excerpts showing where matches occur, while `paradedb.score()` provides the raw BM25 relevance score.

We’ve included some score-boosting logic so if a search term appears in both the title and body, we multiply the score by 2.5. Title-only matches get a 2x boost, while body-only matches keep their base score. This reflects the reality that title matches are typically more relevant than body matches, and documents matching in multiple fields are the most relevant of all. If this search returns any results, we return them immediately without trying other search strategies.

If not, we move on to the next strategy:

```typescript
/** 2 ▸ Phrase search (words close together) ------------------------ */
    const words = query.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      const slop = Math.min(2, words.length - 1);

      const phrase = await client.query<SearchResult>(
        `
        WITH phrase AS (
          SELECT id,
                 title,
                 body,
                 paradedb.snippet(body, start_tag => $3, end_tag => $4) AS snippet,
                 paradedb.score(id) AS base_score
          FROM   posts
          WHERE  id @@@ paradedb.phrase('title', $1::text [], slop => $2)
              OR id @@@ paradedb.phrase('body',  $1::text [], slop => $2)
        )
        SELECT id, title, body, snippet, base_score AS score
        FROM   phrase
        ORDER  BY score DESC
        LIMIT  $5;
        `,
        [words, slop, startTag, endTag, limit],
      );
      if (phrase.rows.length) return phrase.rows;
    }
```

This handles multi-word queries by searching for the words appearing near each other, even if not in exact order. The `slop` parameter (set to the number of words minus 1, capped at 2) determines how many positions apart the words can be while still counting as a phrase match. For example, searching “full text search” with slop=2 would match “full powerful text search” or “text full search”.

The `paradedb.phrase()` function is more restrictive than the basic BM25 search – it requires all words to be present and relatively close together. This is perfect for when users type what they remember as a phrase, but might not recall the exact wording. If the first strategy found nothing, this approach helps catch documents where the search terms appear together as a meaningful unit rather than scattered throughout the text.

If that doesn’t return any results, we move on to our third option:

```typescript
/** 3 ▸ Fuzzy match fallback --------------------------------------- */
   const fuzzy = await client.query<SearchResult>(
     `
     WITH fuzzy AS (
       SELECT id,
              title,
              body,
              paradedb.snippet(body, start_tag => $3, end_tag => $4) AS snippet,
              paradedb.score(id) AS base_score
       FROM   posts
       WHERE  id @@@ paradedb.match('title', $1, distance => $2)
           OR id @@@ paradedb.match('body',  $1, distance => $2)
     )
     SELECT id, title, body, snippet, base_score AS score
     FROM   fuzzy
     ORDER  BY score DESC
     LIMIT  $5;
     `,
     [query, fuzzyDistance, startTag, endTag, limit],
   );
   return fuzzy.rows; // may be empty
```

This is our last resort for typo-tolerant searching. The `paradedb.match()` function with a distance parameter performs fuzzy matching using Levenshtein distance – it finds documents containing words that are similar to the search query within the specified number of character edits (insertions, deletions, or substitutions).

This catches common misspellings like “postgress” for “postgres” or “prizma” for “prisma”. The adaptive fuzzy distance we calculated earlier ensures we’re not too permissive with short queries (where a single character change could completely alter meaning) while being more forgiving with longer queries where typos are more likely. Even if this returns an empty array, at least we’ve exhausted all reasonable search strategies before giving up.

So, let’s try this in action. We can fire up our CMS with:

```
npm run dev
```

Then start using it. First, we’ll just go through the basics CRUD operations in the CMS. Showing our posts:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxc8-ub9q0boekabgppemx-y508pxmmjxb92t2xnnliplbrt7m6osggs4hxjlschuaq7us1yuy004-scgb8l52erdxyjts2g-com5jj-esaxmnvgbgpelvhfzyhnk2ghwucs-e3ef5dbe.png)

Creating a new post:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxd4edfdwzbkor6ldlz15kamrdaqcnuhsiwdvtnjplaa6li6vw2aqiy7nkkt92cufa1z6tc9zfqh9vwa2ns3ubiqa9lh9ywhliuiuaeirrkwty3pgquixndh1uatbm3jvs05n-1998eaf9.png)

Displaying a post:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxeppjldzznqcxixp1xz-fdrgogeepgjlxuzkhvlildtvakqw1vnafyh-0fkgrluexybgchxxgpkayj8waft3sihtmu7f5ph52jx29ugzqeanqdvec86qlkczlwcgtf-bkog-d6f3737a.png)

Editing a post:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxcyqhrzjbfch6fawfrwr3s2faobbfekbnqwfbu37xwvpflme6nmxkqeftbmjjqt-8v4lqghl3mnejkdosrl9t-hdudyba-7jlxkzeqyqze8horf87thnxfds04t3cwmvdkdow-e2eb411d.png)

And deleting a post:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxfphqxjw0kfctpdw03gjlzuzhft9fhge6zzqd8bikldxv7rye1n4besnkpj22dlv4kubc-7cb9mwppphdofa-g3gg7jmao5a42228alyfbdwcp3ug5mzdmqx4i-2ci6qdpwg-566648a9.png)

A fully functioning CMS! But what we really want is search. If we head to the search page, we can search for some of our articles. Let’s try searching for ‘postgres’:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxcrgg6kiics7hh7tebkzrrc6mylkigqqxiiqikznhxyiilhainbtg4krfzepiwefwiimjc2ipnvqimx1htpxbqmnozqtsvz9rngf5b3demuazodmyjdzdiwgu5txjvxpdhn2fla-e4761c03.png)

We get two matches, the post with “Postgres” in the title, but also the one with “PostgreSQL” in the title. Our search is smart enough to recognize that “postgres” and “PostgreSQL” are related terms, thanks to BM25’s partial matching capabilities.

What about if we drop the ‘t’?

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxfgq7xzh2khkv-utgz8eearnq3x5kiwm79knbboscm0gshzmzm-khqlxdba9njadmkjo6djllweo1obu8af6a10wkleqrrp61qi0dfkgzolppwr08iuv7efwo1dohfrspqsopviw-8735c0c0.png)

Our search still works because the fuzzy matching strategy kicks in when the exact BM25 search fails. With a Levenshtein distance of 1, “posgres” matches “postgres” by recognizing the single missing character. This typo tolerance is crucial for real-world usage, where users might misspell technical terms or type quickly. The scores are slightly lower than exact matches, but the results are still ranked by relevance, ensuring users find what they’re looking for even with imperfect queries.

What about a phrase, like “neon postgres”?

![Post image](https://cdn.neonapi.io/public/images/pages/blog/full-text-search-cms-pgsearch/ad4nxenmpaergutjctdbrqmk3-ua1lvgblggsf5pbcaznlhtqnj7kju6awmumpd8krkbqslk-dwdibu6ak1movtuqjrh6mvqb2ae5b7yzczykrd29g-5qxtuivfydtcfiau6obe0mjdtw-4735319e.png)

Yep, still works. This time, it’s using the phrase search strategy since we have multiple words. The search finds documents where “neon” and “postgres” appear near each other, with the slop parameter allowing them to be up to 2 positions apart.

## Taking Your CMS Further

And there you have it – a fully functional CMS with enterprise-grade search capabilities, all running on a single Postgres database. No Elasticsearch clusters to manage, no sync issues between your database and search index, and no complex infrastructure to maintain. Just pure, fast, ACID-compliant search that scales with your data.

The beauty of this approach is its simplicity. By leveraging `pg_search` on Neon, you’ve eliminated an entire layer of complexity from your stack while gaining features that rival dedicated search engines. Your search results update in real-time with your data, your relevance scoring adapts to your content, and typos don’t break the user experience.

There’s much more you can explore with `pg_search` to enhance your CMS:

- **Hybrid search**: Combine BM25 scores with `pgvector` embeddings for semantic search capabilities
- **Faceted search**: Enable category filtering and aggregations for e-commerce-style browsing
- **Advanced tokenizers**: Use ICU or Lindera tokenizers for better multilingual support
- **Fast fields**: Optimize aggregations and sorting with columnar storage
- **Query-Time boosting**: Dynamically adjust field importance based on context
- **Regex and wildcard queries**: Support complex pattern matching in searches
- **More like this**: Find similar documents based on content similarity
- **Custom scoring**: Implement your own relevance algorithms
- **Highlighting options**: Customize snippet generation with different strategies

What else could you build? With Neon and `pg_search`, the possibilities extend far beyond a simple CMS:

- **Knowledge base platform**: Build a Stack Overflow clone with instant search across millions of questions and answers
- **E-commerce search**: Create a product catalog with faceted search, price ranges, and typo-tolerant product discovery
- **Documentation site**: Develop a technical docs platform with code-aware search and version-specific results
- **Legal document repository**: Build a searchable archive with phrase matching for exact legal terminology
- **Log analysis tool**: Build a real-time log search system with regex support and time-based filtering
- **Customer support portal**: Create a help desk with intelligent FAQ search and ticket similarity matching

The combination of Neon’s serverless architecture and `pg_search` ‘s powerful features gives you the tools to build search experiences that would typically require a dedicated search team and infrastructure. Start simple, scale as needed, and keep your architecture clean.

---

_Neon is a serverless Postgres platform built to help developers ship and scale faster via autoscaling, branching, and instant restores. We have a Free Plan – sign up [here](https://console.neon.tech/signup)._
