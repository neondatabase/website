---
title: 'Comparing Native Postgres, ElasticSearch, and pg_search for Full-Text Search'
description: Inverted indexes take Postgres search to the next level
excerpt: >-
  Implementing text search in Postgres is trivial. You can do it as simply as
  this: But like most simple things in SQL, it’s only simple when your data is
  simple—when you hit anything approaching scale, the simple things become hard.
  Full-text search is precisely one of these cases...
date: '2025-06-13T16:26:49'
updatedOn: '2025-08-28T18:36:35'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - ben-hagan
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-full-text-search-vs-elasticsearch/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Comparing Native Postgres, ElasticSearch, and pg_search for Full-Text Search
    - Neon
  description: >-
    Do you need to reach for ElasticSearch for full-text search, or can you
    double down on Postgres? We explore your options in this blog post.
  keywords: []
  noindex: false
  ogTitle: >-
    Comparing Native Postgres, ElasticSearch, and pg_search for Full-Text Search
    - Neon
  ogDescription: >-
    Do you need to reach for ElasticSearch for full-text search, or can you
    double down on Postgres? We explore your options in this blog post.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-full-text-search-vs-elasticsearch/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-full-text-search-vs-elasticsearch/neon-comparing-postgres-1-1024x576-59cb3f11.jpg)

Implementing text search in Postgres is trivial. You can do it as simply as this:

```sql
SELECT * FROM articles WHERE content ILIKE '%search term%';
```

But like most simple things in SQL, it’s only simple when your data is simple—when you hit anything approaching scale, the simple things become hard.

Full-text search is precisely one of these cases. While a basic ILIKE query works fine for a few thousand records, it quickly becomes a performance nightmare as your dataset grows. The query has to scan every row and check every character in the content field, and the lack of index support means response times grow linearly with your data. What started as a 50ms query on your development database becomes a 5-second query in production, bringing your application to its knees. ILIKE is not tokenized, not stemmed, and lacks efficient indexing for large-scale text search.

This is where you face a critical architectural decision: double down on Postgres and use its built-in full-text search capabilities, or reach for a purpose-built option like ElasticSearch? But what if you could get ElasticSearch-level search capabilities without leaving Postgres, without managing a separate cluster, and without the complexity of keeping two data stores in sync?

That’s what you get with [pg_search](https://neon.tech/blog/pgsearch-on-neon).

## The problems with Postgres full-text search

PostgreSQL ships with full-text search capabilities out of the box through its [tsvector and tsquery data types](https://www.postgresql.org/docs/current/datatype-textsearch.html). These work by converting text into a searchable format:

- tsvector stores a sorted list of distinct lexemes (normalized words)
- tsquery represents the search conditions.

You can create a [GIN (Generalized Inverted Index)](https://pganalyze.com/blog/gin-index) on a tsvector column to speed up searches, and use the [@@ operator](https://www.postgresql.org/docs/current/functions-textsearch.html) to match documents:

```sql
-- Basic full-text search setup
ALTER TABLE articles ADD COLUMN search_vector tsvector;
UPDATE articles SET search_vector = to_tsvector('english', title || ' ' || content);
CREATE INDEX articles_search_idx ON articles USING GIN(search_vector);

-- Query with ranking
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'postgres & search') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

This approach handles basic language processing—stemming, stop words, and simple boolean queries—entirely within the database. For small to medium datasets with straightforward search needs, it’s a good solution that avoids external dependencies.

However, native FTS quickly shows its age when you push beyond the basics:

- **Performance degrades dramatically at scale**. While a GIN index helps with matching, it’s not optimized for relevance ranking. When you need to sort millions of rows by [ts_rank](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING), Postgres must score every matching document—there’s no efficient way to retrieve just the top-N most relevant results. What starts as a 50ms query on 10,000 rows becomes a multi-second operation on 10 million rows.
- **Search quality suffers from limited functionality**. ts_rank is primitive compared to modern standards like [BM25](https://en.wikipedia.org/wiki/Okapi_BM25). There’s no fuzzy matching—users must spell terms exactly right or get zero results. Features that users expect from modern search, like typo tolerance or phrase likeness, are either missing or require complex workarounds.
- **The development experience is cumbersome**. Building search across multiple columns means manually concatenating fields into a single tsvector, losing field-specific relevance. Highlighting requires post-processing with [ts_headline](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-HEADLINE). JSON field searching is particularly painful, requiring you to extract and index specific paths ahead of time.

Native FTS works until it doesn’t, and by then, you’re often dealing with performance emergencies and user complaints about search quality. This is precisely why ElasticSearch was built.

## Choosing ElasticSearch for full-text search

When Postgres’s native full-text search hits its limits, [ElasticSearch](https://github.com/elastic/elasticsearch) often becomes the go-to solution. Built on [Apache Lucene](https://lucene.apache.org/), ElasticSearch was designed as a distributed search engine from the ground up, offering capabilities that Postgres simply wasn’t built to provide.

### The benefits of ElasticSearch

ElasticSearch excels at search where native Postgres struggles. Its inverted index structure is optimized for both matching and ranking, using the BM25 algorithm to deliver relevant results even on massive datasets. Queries that would take minutes in Postgres return in milliseconds. Beyond raw performance, ElasticSearch provides the search features users have come to expect: fuzzy matching that handles typos, phrase proximity search, field-specific boosting, and sophisticated aggregations for faceted navigation.

The developer experience is also vastly improved. While verbose, ElasticSearch’s JSON-based query DSL offers fine-grained control over every aspect of search. You can boost specific fields, apply custom analyzers per language, and build complex queries that would be nearly impossible in SQL. Features like highlighting, autocomplete, and “more like this” recommendations come built-in.

For many teams, adopting ElasticSearch feels like a revelation. Suddenly, search is fast, relevant, and feature-rich. But this power comes at a significant cost.

### The hidden costs of ElasticSearch

While ElasticSearch solves the search problem, it creates an entirely new set of operational challenges that teams often underestimate.

- **You now have two sources of truth**. Your data lives in Postgres, but must be duplicated into ElasticSearch for searching. This fundamental architectural decision cascades into numerous complications. You must build and maintain an ETL pipeline through custom scripts or Change Data Capture (CDC). Any bug in this pipeline means your search results diverge from reality. Worse, ElasticSearch is eventually consistent by design, so even when everything works perfectly, there’s always a window where search results lag behind database writes.
- **The operational burden is substantial**. ElasticSearch is a distributed system with clustering, sharding, and replication requirements. You need a capacity plan for both storage (your data is now stored twice) and memory (ElasticSearch is notoriously memory-hungry). The JVM needs tuning. Cluster state needs monitoring. Version upgrades require careful planning and often downtime. What started as “let’s add search” became a full-time infrastructure project.
- **Costs multiply across every dimension**. Beyond the obvious infrastructure costs of running additional servers, hidden expenses exist everywhere. You need different backup strategies for ElasticSearch. Security becomes more complex as you’re managing access controls in two systems. Your development environment needs both services running. Your CI/CD pipeline gets slower. Debugging production issues requires correlating logs across systems. Every new developer needs to learn both PostgreSQL and ElasticSearch.
- **Data consistency becomes your problem**. When users update their profiles and immediately search for themselves, will they appear in results? When you delete sensitive data for compliance, is it really gone from both systems? These questions have complex answers that vary based on your sync strategy, and wrong answers can mean anything from poor user experience to regulatory violations.

The tragedy is that for many applications, this is overkill. Introducing an entirely new addition to your infrastructure for search, can add significant cost and complexity. You probably don’t need a distributed search cluster if you’re not building the next Google. You need fast, relevant search that stays consistent with your data, precisely the gap that pg_search aims to fill.

## pg_search: The best of both worlds

[pg_search](https://www.paradedb.com/blog/introducing_search) represents a fundamental shift in how we think about full-text search in Postgres. Rather than accepting the limitations of native FTS or the complexity of ElasticSearch, it brings modern search capabilities directly into Postgres through a Rust-based extension.

### How pg_search works

pg_search creates a BM25 index that lives entirely within Postgres. When you create this index, you’re actually embedding a complete search engine—powered by [Tantivy](https://github.com/quickwit-oss/tantivy), Rust’s answer to Apache Lucene—inside your database:

```sql
-- Create a BM25 index on your table
CREATE INDEX articles_search_idx ON articles 
USING bm25 (id, title, content, author, tags)
WITH (key_field='id');

-- Search with the @@@ operator
SELECT *, paradedb.score(id) as score
FROM articles
WHERE title @@@ 'postgres' OR content @@@ 'search'
ORDER BY score DESC
LIMIT 10;
```

The `key_field` parameter is crucial. It must be a column with unique values that serves as the document identifier. This isn’t just a wrapper around Postgres’s existing functionality; it’s a complete search engine implementation that happens to run inside Postgres.

### The key capabilities of pg_search

- **Modern relevance ranking out of the box**. pg_search implements the BM25 algorithm, the same ranking system that ElasticSearch and other modern search engines use. This means your search results are automatically ordered by relevance based on term frequency, document length, and term rarity.
- **Fuzzy search and typo tolerance**. Users don’t have to spell perfectly. pg_search handles approximate matches through the paradedb.match function:

```sql
-- Find results even with typos (distance=1 allows one character difference)
SELECT * FROM articles 
WHERE id @@@ paradedb.match('title', 'postgre', distance => 1);
```

- **Advanced search patterns**. Beyond simple keyword matching, pg_search supports sophisticated query patterns:

```sql
-- Exact phrase search
SELECT * FROM articles WHERE content @@@ '"full text search"';

-- Phrase with proximity (slop allows words between)
SELECT * FROM articles 
WHERE id @@@ paradedb.phrase('content', ARRAY ['postgres', 'search'], slop => 2);

-- Complex queries with JSON syntax
SELECT * FROM articles 
WHERE id @@@ '{"match": {"field": "title", "value": "database"}}'::jsonb;
```

- **Fast aggregations and faceted search**. Because the BM25 index is a covering index that spans multiple columns, you can perform aggregations directly within the search operation:

```sql
-- Get search results grouped by category with counts
SELECT category, COUNT(*) 
FROM articles 
WHERE content @@@ 'database' 
GROUP BY category;
```

- **Real-time indexing with zero lag**. This is where pg_search truly shines. Because Postgres itself manages the index, updates are transactional. When you insert, update, or delete a row, the search index updates atomically within the same transaction. There’s no sync delay, no eventual consistency—if a transaction commits, the data is immediately searchable.
- **Highlighting and snippets**. pg_search can automatically highlight matched terms in search results:

```sql
-- Get snippets with highlighted matches
SELECT id, paradedb.snippet(content) 
FROM articles 
WHERE content @@@ 'postgres'
LIMIT 5;
```

### pg_search performance that matches ElasticSearch

The numbers speak for themselves. In [Neon’s benchmarks](https://neon.tech/blog/pgsearch-on-neon#appendix-detailed-benchmark-results) on a 10-million-row dataset, pg_search consistently outperformed native Postgres FTS by 20-1000x, while matching or exceeding ElasticSearch performance:

- Simple count queries: 770ms (pg_search) vs 22,214ms (native FTS)
- Filtered searches with highlighting: 34ms vs 758ms
- Top-N ranked results: 81ms vs 38,797ms
- Complex multi-condition searches: 29ms vs 31,890ms

The key is that pg_search’s index structure is optimized for search operations from the ground up. It can efficiently retrieve just the top-N most relevant results without scanning and ranking the entire result set—something native Postgres FTS simply cannot do.

### The operational wins of pg_search

The real magic of pg_search isn’t just performance—it’s simplicity. Your entire search infrastructure collapses into a single system:

- **No replication strategy required.** There is no requirement to replicate data between the system of record (likely Postgres) and a search service such as ElasticSearch. This reduces operational complexity as well as cost.
- **One backup strategy**. Your search index is just another Postgres index, backed up atomically with your data. No need to coordinate separate backup schedules or worry about restoring systems in sync.
- **One security model**. Postgres row-level security, column permissions, and role-based access control apply to search queries automatically. No need to replicate your authorization logic in a separate system.
- **One monitoring and observability setup**. Standard Postgres monitoring tools show you everything—query performance, index size, resource usage. Your existing alerting and observability stack just works.
- **One technology to learn**. New developers need to understand SQL and basic Postgres concepts. They don’t need to learn ElasticSearch’s query DSL, cluster management, or JVM tuning.

## When to choose pg_search over ElasticSearch

pg_search hits the sweet spot for most applications that need better search than native Postgres but don’t require a distributed search infrastructure. You should strongly consider pg_search if:

- You are already running Postgres – Your team already knows and trusts Postgres
- Your dataset fits on a single Postgres instance (up to hundreds of millions of documents)
- You need consistent search results that reflect the current state of your data
- You want modern search features without operational complexity

The pg_search extension is production-ready, actively maintained by ParadeDB, and [available to all Neon users](https://neon.tech/blog/pgsearch-on-neon). For most teams building modern applications, pg_search delivers ElasticSearch-quality search with Postgres-level simplicity—a combination that’s hard to beat.

---

_Try it in the [Neon Free Plan](https://console.neon.tech/signup), no credit card required._
