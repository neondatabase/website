---
title: Search From a Million Books in Milliseconds With Neon and pg_search
description: >-
  We forked the Book Inventory template by Vercel and swapped in pg_search for
  200x faster full-text search
excerpt: >-
  We just announced that pg_search is available on Neon, making it easier than
  ever to build fast, full-text search experiences with Postgres. To demonstrate
  its performance, we forked Vercel’s Book Inventory template and replaced the
  AI-powered search with native PostgreSQL full-t...
date: "2025-03-26T18:04:24"
updatedOn: "2025-04-15T19:18:05"
category: postgres
categories:
  - postgres
authors:
  - rishi-raj-jain
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/search-in-milliseconds-pgsearch/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Search From a Million Books in Milliseconds With Neon and pg_search - Neon
  description: >-
    To demonstrate what pg_search can do, we built a book inventory with 1
    million titles—search it in milliseconds using nothing but Postgres.
  keywords: []
  noindex: false
  ogTitle: Search From a Million Books in Milliseconds With Neon and pg_search - Neon
  ogDescription: >-
    To demonstrate what pg_search can do, we built a book inventory with 1
    million titles—search it in milliseconds using nothing but Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/search-in-milliseconds-pgsearch/social.jpg
---

<figure>
  <video
    height="1350"
    style={{ aspectRatio: '2400 / 1350' }}
    width="2400"
    autoPlay
    loop
    muted
    src="https://cdn.neonapi.io/public/images/pages/blog/search-in-milliseconds-pgsearch/neon-millionbooks-1-1-e1fa55dd.jpg"
    playsInline
  ></video>
</figure>

[We just announced that pg_search is available on Neon](https://neon.tech/blog/pgsearch-on-neon), making it easier than ever to build fast, full-text search experiences with Postgres. To demonstrate its performance, we forked [Vercel’s Book Inventory template](https://github.com/vercel-labs/book-inventory) and replaced the AI-powered search with native PostgreSQL full-text search using pg_search.

**The results are blazing fast—up to 200x faster**. No need for OpenAI or embedding costs. Skip the complexity of generating and inserting embeddings: keep your data as-is and search across millions of books with ranked results in milliseconds.

Try it live: [https://fyi.neon.tech/books](https://fyi.neon.tech/books)

Here’s the repo: [https://github.com/neondatabase-labs/book-inventory](https://github.com/neondatabase-labs/book-inventory)

## The Next.js Book Inventory template

Vercel’s [Book Inventory template](https://github.com/vercel-labs/book-inventory) is a full-stack demo built with Next.js that showcases how to build a rich, searchable book catalog using modern developer tools and services — Next.js, Vercel, OpenAI and Postgres.

The original demo was designed to show how AI can enhance user interfaces by making them feel more intuitive: the AI model interprets the meaning behind the query, enabling more human-like interactions. It’s a great showcase of what’s possible when you combine full-stack frameworks with powerful AI tools.

- The application is built with Next.js, Drizzle and Postgres. It uses the experimental [PPR](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering#background) mode to be able to immediately send prerendered content and in parallel stream the dynamic components of the application.
- The search is powered by semantic search on top of filters like year, number of pages, etc. — going beyond simple text matching. Using embeddings with Postgres’ vector extension, queries are interpreted to semantically locate the nearest record intent and return the most relevant results.
- The template is optimized for Vercel’s serverless platform, making it scalable and easy to deploy.

## Forking the template and adding pg_search with Neon

The AI-powered search in the original Vercel demo is impressive, but as we launched pg_search, we were instantly curious to see how performance and results would look like with pg_search. This avoids relying on similarity search, external APIs for generating embeddings and modifying schema to accommodate vector embeddings.

So, we forked the template, and introduced this core change: **instead of using Postgres semantic search with OpenAI embeddings, the forked version now queries the database directly using Postgres’ full-text search boosted with pg_search**.

## A recap on pg_search

[If you missed our launch blog post](https://neon.tech/blog/pgsearch-on-neon), pg_search is a high-performance full-text search extension that brings Elasticsearch-grade speed and ranking into Postgres—and it’s now available on Neon.

Built in Rust using the pgrx framework, pg_search addresses key gaps in Postgres’ native full-text search (FTS). While Postgres FTS uses tsvector and tsquery, it struggles with relevance ranking, fuzzy matches, and faceted search at scale. But with pg_search, you get:

- Advanced ranking with BM25, the same algorithm used by Elasticsearch
- Typo tolerance, prefix search, and highlighted matches
- Faceted search and filtering across multiple fields—including JSON
- A custom BM25 index that’s blazing fast and MVCC-safe
- Real-time indexing, with no ETL or manual reindexing required

## Implementation details

### Database setup

To build this demo, we first downloaded the `goodreads_books.json.gz` dataset using a script from [MengtingWan’s Goodreads GitHub repository](https://github.com/MengtingWan/Goodreads). After downloading, we decompressed it to extract the raw JSON data:

```bash
gzip -d genre/goodreads_books.json.gz
```

We then created a `books` table using a custom SQL schema. After defining the schema, we loaded the dataset into Postgres, running on Neon in the `us-east-2` region, and using a Python script to transform and insert the records cleanly.

To optimize search and query performance, we installed the `pg_prewarm` and `pg_search` extensions. We preloaded the `books` table into memory using `pg_prewarm` to reduce query latency. Then, we created a `pg_search` BM25 index with the following SQL:

```sql
CREATE INDEX book_search_idx ON public.books
USING bm25 (
  book_id, url, link, description, isbn13, isbn, language_code,
  num_pages, title, publication_day, publication_month,
  publication_year, publisher, work_id, image_url
) WITH (key_field='book_id');
```

We also prewarmed the `book_search_idx` to further improve performance.

To verify everything was working, we ran an initial query using the `@@@` syntax:

```sql
EXPLAIN ANALYZE
SELECT book_id, title, image_url
FROM books
WHERE publication_year BETWEEN 1950 AND 2023
  AND average_rating >= 0
  AND num_pages <= 1000
  AND image_url IS NOT NULL
  AND book_id @@@ paradedb.match('title', 'diary', conjunction_mode => true)
ORDER BY book_id
LIMIT 12 OFFSET 1200;
```

Here’s the result:

```sql
Limit  (cost=16309.34..16309.34 rows=1 width=114) (actual time=12.815..12.818 rows=12 loops=1)
  ->  Sort  (cost=16307.64..16309.34 rows=679 width=114) (actual time=12.616..12.780 rows=1212 loops=1)
        Sort Key: book_id
        Sort Method: quicksort  Memory: 604kB
        ->  Index Scan using book_search_idx on books
            (cost=10.00..16275.70 rows=679 width=114)
            (actual time=0.293..11.956 rows=2382 loops=1)
              Index Cond: (book_id @@@ '{"with_index":{"oid":292855,"query":{"match":{"field":"title","value":"diary","conjunction_mode":true}}}}'::paradedb.searchqueryinput)
              Filter: ((image_url IS NOT NULL) AND (publication_year >= 1950) AND (publication_year <= 2023) AND (average_rating >= '0') AND (num_pages <= 1000))
              Rows Removed by Filter: 1652
Planning Time: 0.792 ms
Execution Time: 13.034 ms
```

### Application changes

To improve search relevance, we updated the `searchFilter` function to use `paradedb.match` with `conjunction_mode => true`, enabling more precise multi-word matching.

We also refactored the database connection, replacing Drizzle with Neon’s serverless driver (which queries over HTTP). We used a Direct connection string from the Neon console.

To keep latency low between the app and the database, we deployed our Vercel functions in the `us-east-2 region`, matching our Neon region.

## Performance highlights

As we were hoping, the demo is _fast_! We saw major performance gains—over **200x faster**—with pg_search on Neon, without any need for external services or infrastructure.

Some standout improvements:

- **Optimized sorting:** Result ordering is significantly faster thanks to the covering BM25 index.
- **Accelerated field search:** Searching titles now completes in milliseconds.
- **Efficient AND search:** Multi-term queries with AND conditions are much faster and return highly relevant results without sacrificing performance.

Here are few query examples we tested under the hood. We’re including the full query in case you want to reproduce the setup:

| Query: Plain Postgres                                                                                                                                                                                                                                                                                                                  | Query response time (ms) | Query: Neon with pg_search                                                                                                                                                                                                                                                                                                                       | Query response time (ms) | Speedup      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ------------ |
| <code>SELECT book_id, title, image_url<br />FROM books<br />WHERE publication_year BETWEEN 1950 AND 2023<br />AND average_rating &gt;= 0<br />AND num_pages &lt;= 1000<br />AND image_url IS NOT NULL<br />AND to_tsvector('english', title) @@ to_tsquery('english', 'diary')<br />ORDER BY book_id<br />LIMIT 12 OFFSET 1200;</code> | 2733.443                 | <code>SELECT book_id, title, image_url<br />FROM books<br />WHERE publication_year BETWEEN 1950 AND 2023<br />AND average_rating &gt;= 0<br />AND num_pages &lt;= 1000<br />AND image_url IS NOT NULL<br />AND book_id @@@ paradedb.match(‘title’, ‘diary’, conjunction_mode =&gt; true)<br />ORDER BY book_id<br />LIMIT 12 OFFSET 1200;</code> | 11.600                   | ~236x faster |
| <code>SELECT book_id, title, image_url<br />FROM books<br />WHERE publication_year BETWEEN 1950 AND 2023<br />AND average_rating &gt;= 2.5<br />AND num_pages &lt;= 1000<br />AND to_tsvector('english', title) @@ to_tsquery('english', 'Air')<br />LIMIT 12 OFFSET 1200;</code>                                                      | 2614.142                 | <code>SELECT book_id, title, image_url<br />FROM books<br />WHERE publication_year BETWEEN 1950 AND 2023<br />AND average_rating &gt;= 2.5<br />AND num_pages &lt;= 1000<br />AND book_id @@@ paradedb.match('title', 'Air', conjunction_mode =&gt; true)<br />LIMIT 12 OFFSET 1200;</code>                                                      | 14.347                   | ~182x faster |
| <code>SELECT book_id, title, image_url<br />FROM books<br />WHERE publication_year BETWEEN 1950 AND 2023<br />AND average_rating &gt;= 0<br />AND num_pages &lt;= 1000<br />AND to_tsvector('english', title) @@ to_tsquery('english', 'Air &amp; To')<br />LIMIT 2000;</code>                                                         | 2746.212                 | <code>SELECT book_id, title, image_url<br />FROM books<br />WHERE publication_year BETWEEN 1950 AND 2023<br />AND average_rating &gt;= 0<br />AND num_pages &lt;= 1000<br />AND book_id @@@ paradedb.match('title', 'Air To', conjunction_mode =&gt; true)<br />LIMIT 2000;</code>                                                               | 13.287                   | ~207x faster |

## Wrap up

The code for the demo is available here: [https://github.com/neondatabase-labs/book-inventory](https://github.com/neondatabase-labs/book-inventory)

Feel free to explore it or fork the repo for your own experimentation. To learn more about pg_search, check out the documentation from [ParadeDB](https://www.paradedb.com) (the team behind the extension) alongside [this guide](https://neon.tech/blog/pgsearch-on-neon).

You can start building with pg_search today on any Neon database running Postgres 17! Sign up for Neon [here](https://console.neon.tech/signup) (we have a Free plan).
