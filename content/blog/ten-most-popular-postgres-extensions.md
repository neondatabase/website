---
title: The 10 Most Popular Postgres Extensions on Neon
description: And why developers love them
excerpt: >-
  Postgres is loved not just for what it is, but for what it can become: its
  extension system lets you transform your database into a full-text search
  engine, a geospatial powerhouse, or a vector store for embeddings – all
  without switching tools. With many thousands of active data...
date: '2025-08-21T16:04:10'
updatedOn: '2025-08-21T16:04:16'
category: postgres
categories:
  - postgres
authors:
  - ben-hagan
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ten-most-popular-postgres-extensions/cover.jpg
  alt: null
isFeatured: true
seo:
  title: The 10 Most Popular Postgres Extensions on Neon - Neon
  description: >-
    We share numbers for the 10 most popular Postgres extensions on Neon,
    including and an interactive dashboard built with v0.
  keywords: []
  noindex: false
  ogTitle: The 10 Most Popular Postgres Extensions on Neon - Neon
  ogDescription: >-
    We share numbers for the 10 most popular Postgres extensions on Neon,
    including and an interactive dashboard built with v0.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ten-most-popular-postgres-extensions/social.jpg
source:
  wpId: 10709
  wpSlug: ten-most-popular-postgres-extensions
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/ten-most-popular-postgres-extensions/neon-extensions-1-1-1024x576-40c04f92.jpg)

Postgres is loved not just for what it is, but for what it can become: its extension system lets you transform your database into a full-text search engine, a geospatial powerhouse, or a vector store for embeddings – all without switching tools.

With many thousands of active databases running on our platform at any given time, at Neon we have a front-row seat to how developers actually use Postgres extensions in the wild. And now, you can too: we vibed an [interactive dashboard](https://v0-neon-postgres-extensions.vercel.app/) with [v0](https://v0.app/) to display the top extensions across our platform in real-time, ranked by monthly install count, trending usage, and more. It’s a fun way to see which extensions have gained wide traction across the Postgres ecosystem.

<video autoPlay muted loop width="3124" height="1472">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/ten-most-popular-postgres-extensions/extensions-07fc5907.mov" />
</video>

**Explore the numbers:** [https://v0-neon-postgres-extensions.vercel.app/](https://v0-neon-postgres-extensions.vercel.app/)

## Most used Postgres extensions

These are the ten most installed extensions on Neon of all time, according to platform-wide stats:

### plpgsql

> **Installed in 1M+ databases**. If you’re writing Postgres functions, you’re using plpgsql, whether you know it or not.

`plpgsql` powers stored procedures and custom business logic inside the database. While you might not reach for it in every project, it’s essential for things like encapsulating complex operations, enforcing data rules, or handling triggers. Many ORMs and tools depend on it behind the scenes, which is why it’s active in every Neon database by default.

**Quick example:** “Create a simple function that adds two numbers”

```sql
CREATE FUNCTION add_numbers(a int, b int) RETURNS int AS $$
BEGIN
  RETURN a + b;
END;
$$ LANGUAGE plpgsql;
```

Read more about it in the [Postgres Tutorial.](https://neon.com/postgresql/postgresql-plpgsql)

### pg_stat_statements

> **Installed in 1M+ databases.** It’s the go-to tool for spotting slow queries and understanding what your database is actually doing.

`pg_stat_statements` records execution statistics for every SQL statement run by the database. It’s used daily by thousands of Neon users for performance monitoring, debugging latency spikes, generating insights into query patterns… It works outside your application code, and it’s a very powerful tool for database observability.

**Quick example: “** Find the top 5 queries by total execution time”

```sql
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 5;
```

If you’re not yet familiar, [check out this guide](https://neon.com/docs/extensions/pg_stat_statements) to learn about `pg_stat_statements`.

### uuid-ossp

> **Installed in 80k+ databases.** It’s the most common way to generate UUIDs directly inside Postgres.

`uuid-ossp` is a must-have when you want opaque, collision-resistant identifiers, especially for primary keys, API tokens, or any value you don’t want to expose sequentially. It’s widely used by developers who prefer UUIDs over serial IDs, and by platforms that require externally generated IDs to be persisted or compared in the database.

**Quick example:** “Generate a random UUID (v5)”

```sql
SELECT uuid_generate_v5();
```

[Here’s a user guide](https://neon.com/docs/data-types/uuid) on UUIDs in Neon.

### pg_vector

> **Installed in 30k+ databases.** pgvector allows you to store and search embedding vectors inside Postgres, turning it into a vector database.

`pg_vector` adds a vector datatype and indexing for similarity search, enabling RAG use cases, personalized recommendations, or semantic search. With pg_vector, developers can keep both vector and relational data in the same Postgres database, [which simplifies their stack and makes operations easier](https://neon.com/blog/vecstore-replacing-pinecone-and-rds-with-neon). On Neon, running vector workloads is especially efficient due to autoscaling.

**Quick example:** “Find the 5 closest matches to a query vector”

```sql
SELECT id, embedding <#> '[0.1, 0.2, 0.3]' AS distance
FROM items
ORDER BY distance
LIMIT 5;
```

[Check out this guide](https://neon.com/guides/vector-search) to get started with pgvector.

### pgcrypto

> **Installed in 20k+ databases.** pgcrypto is useful for secure hashing, encryption, and random value generation.

`pgcrypto` brings cryptographic functions directly into Postgres. It’s a favorite among developers building auth systems or storing sensitive metadata – you can use it for password hashing, token generation, secure comparisons, and even lightweight encryption of sensitive fields. Because it runs inside the database, you don’t need to round-trip data to your application just to hash or verify it.

**Quick example:** “Hash a password with bcrypt”

```sql
SELECT crypt('my_password', gen_salt('bf'));
```

[Keep reading about this extension](https://neon.com/docs/extensions/pgcrypto) in our docs.

### pg_trgm

> **Installed in 10k+ databases.** This extension makes Postgres great at finding similar strings.

`pg_trgm (trigram)` is used in autocomplete, typo-tolerant search, name or email matching, and other features where “close enough” matters. Behind the scenes, it breaks strings into overlapping trigrams and indexes them efficiently, making fuzzy search queries faster.

**Quick example:** “Find users with names similar to John”

```sql
SELECT * FROM users
WHERE name % 'John'
ORDER BY similarity(name, 'John') DESC;
```

[Check out our docs](https://neon.com/docs/extensions/pg_trgm) for more.

### postgis

> **Installed in 8k+ databases.** postgis turns Postgres into a full-featured spatial database, making it one of the most powerful extensions out there.

If your app needs to know _where_ something is, you probably want PostGIS. It gives you spatial datatypes (like `geometry` and `geography`), spatial indexing, and hundreds of functions for working with location data, from distance calculations to complex shape operations. It’s used for logistics apps, real estate, ride-sharing, or mapping platforms.

**Quick example:** “Find all locations within 5km of a point”

```sql
SELECT * FROM locations
WHERE ST_DWithin(geom, ST_MakePoint(-122.4, 37.8)::geography, 5000);
```

[Get more info about postgis in our docs.](https://neon.com/docs/extensions/postgis)

### citext

> **Installed in 4k+ databases.** citext enables case-insensitive text matching without workarounds.

`citext` stands for case-insensitive text. It behaves just like text, but treats Foo and foo as equal – it’s perfect for fields where case shouldn’t matter, like emails, usernames, or tags, and helps avoid bugs caused by inconsistent casing in user input.

**Quick example:** “Match emails regardless of case”

```sql
SELECT * FROM users WHERE email = 'Alice@example.com';
```

See [more examples](https://neon.com/docs/extensions/citext) of how to use citext.

### unaccent

> **Installed in 2.5k+ databases.** `unaccent` strips accents from characters for more flexible text search.

This extension is a hidden gem for internationalized applications. It removes diacritics (accents, cedillas, etc) from text, making search queries more forgiving. For example, it lets users find “Resume” even if the data contains “Résumé.”

**Quick example:** “Strip accents from a string”

```sql
SELECT unaccent('Crème Brûlée');  -- Returns 'Creme Brulee'
```

### hstore

> **Installed in 1k+ databases.** hstore lets you store key-value pairs inside a single column.

`hstore` lets you attach semi-structured data to your rows without the overhead of JSON parsing. It’s great for cases where you need fast reads on dynamic fields and you want to index or query them individually. JSONB has become more popular in recent years, but `hstore` is still loved for its performance and simplicity.

**Quick example:** “Grab the value of a key inside an hstore column”

```sql
SELECT settings -> 'theme' FROM users;
```

[This guide](https://chatgpt.com/c/6883e7fb-4f90-832f-9ebd-4e9b8f64f574) tells you how to use hstore and JSONB for storing key-value pairs in Postgres.

## Postgres is What You Make of It

One of Postgres’s greatest strengths is its adaptability: with the right extensions, you can bring logic directly into the database and simplify your stack in the process. The ten extensions above are the most widely installed on Neon, but we’re also seeing adoption of next-generation extensions like [pg_search](https://neon.com/blog/pgsearch-on-neon) or [mooncake](https://www.mooncake.dev/).

If you discovered some new extensions in this list, [spin up a free Neon project and give them a try.](https://console.neon.tech/signup)

<Admonition type="tip" title="track it live">
Explore the full list of extensions - and see what’s trending - in our [Postgres Extensions Analytics dashboard](https://v0-neon-postgres-extensions.vercel.app/). Built with v0, powered by Neon.
</Admonition>
