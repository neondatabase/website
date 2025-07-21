---
title: Comparing Text Search Strategies pg_search vs. tsvector vs. External Engines
subtitle: Choosing the Right Search Approach for Your Application with PostgreSQL and Neon
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-04-06T00:00:00.000Z'
updatedOn: '2025-04-06T00:00:00.000Z'
---

When implementing search in your application, you need to choose the right text search approach. This guide compares PostgreSQL's built-in [`tsvector`](/guides/full-text-search), the [`pg_search`](docs/extensions/pg_search) extension, and external search engines to help you select the best option for your needs.

## Built-in PostgreSQL `tsvector` for Text Search

PostgreSQL includes native full-text search capabilities using the `tsvector` data type and `tsquery` search expressions. The `tsvector` data type is a specialized data structure that PostgreSQL uses to represent documents in a form optimized for search.

This built-in functionality works for basic search needs without requiring any additional extensions. It's perfect for smaller applications or when you don't require advanced search features.

### Example of Using `tsvector`

To use `tsvector`, you need to create a table with a column to store the search vector. You can then convert text into the `tsvector` format and create an index for efficient searching. This allows your queries to run faster, even as your dataset grows.

```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector tsvector
);

-- Update the search vector
UPDATE articles
SET search_vector = to_tsvector('english', title || ' ' || content);

-- Create an index on the search vector
CREATE INDEX idx_search_vector ON articles USING GIN (search_vector);

-- Query using tsquery
SELECT id, title
FROM articles
WHERE search_vector @@ to_tsquery('english', 'database & performance');
```

This example shows how to:

- Create a table with a column to store search vectors
- Convert text to the `tsvector` format using the `to_tsvector` function
- Create a GIN index to speed up searches
- Search for articles containing both "database" and "performance"

While `tsvector` meets basic search needs, it has limitations with relevance ranking, handling typos, and complex search patterns. It’s suitable for small to medium-sized datasets where advanced features aren’t necessary.

### Pros of `tsvector`

- **Simplicity**: No need for any extensions, just native PostgreSQL functionality.
- **Integrated with Postgres**: Works seamlessly within the same database, avoiding the need for additional services.
- **Low overhead**: Since `tsvector` is part of Postgres, it doesn’t require a separate system to maintain.

### Cons of `tsvector`

- **Limited relevance ranking**: It doesn't automatically rank search results based on relevance.
- **No typo tolerance**: Exact matches are required, so if a user misspells a search term, it won’t return relevant results.
- **Complex queries**: Handling more complex queries like fuzzy matching or phrase proximity is not possible out-of-the-box.

## Extending `tsvector` with `pg_search`

The `pg_search` extension builds on PostgreSQL's search capabilities by adding better relevance ranking with the BM25 algorithm, fuzzy matching for handling typos, and more flexible search options.

This extension is particularly useful for applications that require more sophisticated search features without needing a separate search engine.

With `pg_search`, you get features such as:

- **Relevance Ranking**: The BM25 algorithm provides an automatic ranking of search results based on how relevant they are to the query.
- **Fuzzy Matching**: It allows for typo tolerance, meaning searches will return relevant results even when a user makes small errors.
- **Phrase Search**: You can search for exact phrases or words that are close together, which can be especially useful in content-heavy applications.
- **Flexible Queries**: `pg_search` supports more complex search expressions like partial word matches, stemming, and stop-word filtering.

### Enabling `pg_search` on Neon

<Admonition type="note" title="pg_search on Neon">

`pg_search` is currently only available on Neon projects created in an [AWS region](/docs/introduction/regions#aws-regions).

</Admonition>

Adding `pg_search` to your Neon database is simple - just run this single SQL command:

```sql
CREATE EXTENSION IF NOT EXISTS pg_search;
```

That's all it takes to enable the extension. You can then use the `pg_search` features in your queries. The setup is straightforward, and you don’t need any additional infrastructure to get started.

### Example of Using `pg_search`

After enabling the extension, you can create search indexes and run more sophisticated queries:

```sql
-- Create a BM25 index on multiple columns
CREATE INDEX article_search_idx ON articles
USING bm25 (id, title, content)
WITH (key_field='id');

-- Simple keyword search
SELECT title
FROM articles
WHERE title @@@ 'database';

-- Handling typos with fuzzy matching
SELECT title
FROM articles
WHERE id @@@ paradedb.match('title', 'database', distance => 1);

-- Sorting by relevance score
SELECT title, paradedb.score(id) AS relevance
FROM articles
WHERE content @@@ 'performance'
ORDER BY paradedb.score(id) DESC;
```

This code shows how to:

- Create a BM25 index that covers multiple columns
- Perform a basic keyword search using the `@@@` operator
- Find results even when the search term has typos
- Sort results by relevance so the most relevant results appear first

### Why Use `pg_search` on Neon?

Using `pg_search` on Neon gives you:

- **Better search capabilities**: With ranking, typo tolerance, and complex query options, `pg_search` provides much more functionality than `tsvector`.
- **A fully managed PostgreSQL experience**: You don’t need to set up or maintain a separate search service. Neon handles everything for you, from scaling to backups.
- **Data consistency**: Since the search index is part of your PostgreSQL database, there’s no need to worry about synchronizing data between separate systems.
- **Simple architecture**: With `pg_search` running on Neon, you avoid the complexity of managing an external search engine while still getting advanced search features.

`pg_search` is a great choice for applications that need more advanced search features but want to avoid the complexity of managing a separate search engine.

## External Search Engines (e.g., Elasticsearch)

External search engines like Elasticsearch provide specialized search features for complex use cases and very large datasets. These engines are designed to scale out across many servers and handle high-performance, low-latency search queries.

While these engines offer powerful capabilities, they come with trade-offs:

- **You need to set up and maintain additional infrastructure**: External search engines require managing separate servers or cloud services, which can increase operational overhead.
- **You must keep your database and search index synchronized**: Ensuring that your external search engine stays in sync with your PostgreSQL database can introduce complexity, especially as your data changes.
- **Increased complexity**: Managing another system means additional configuration, monitoring, and troubleshooting.
- **Higher operational costs**: Running an external search engine comes with extra costs, both in terms of infrastructure and developer time.

External search engines like Elasticsearch provide powerful features such as:

- Distributed search: Handles large-scale search queries across many machines.
- Complex querying: Offers advanced querying capabilities such as aggregations, nested fields, and more.
- Real-time indexing: Updates search results in real time as new data is indexed.

### Use Cases for External Search Engines

You might choose an external search engine when:

- **You have extremely large datasets** (billions of records) that require distributed search across multiple servers.
- **Your search needs include specialized features** not available in PostgreSQL, such as advanced analytics, geographic search, or machine learning integration.
- **You have the resources** to manage additional infrastructure and complexity.

## Comparison Summary

| Feature               | `tsvector`             | `pg_search` on Neon | External Engines                                   |
| --------------------- | ---------------------- | ------------------- | -------------------------------------------------- |
| **Setup**             | Built into Postgres    | Easy setup on Neon  | Separate system to install, configure and maintain |
| **Relevance Ranking** | Basic                  | BM25 ranking        | Advanced ranking options                           |
| **Typo Tolerance**    | No                     | Yes                 | Yes                                                |
| **Query Flexibility** | Limited                | Good                | Extensive                                          |
| **Scaling**           | Limited by Postgres    | Managed by Neon     | Requires manual scaling                            |
| **Cost**              | Included with Postgres | Included with Neon  | Additional infrastructure costs                    |
| **Maintenance**       | Minimal                | Handled by Neon     | Requires ongoing maintenance                       |

## Which Option Should You Choose?

With all these options available, how do you choose the right one for your application? Here are some guidelines:

### Use built-in `tsvector` when:

- You have simple search requirements
- Your dataset is small to medium-sized
- You want to use only built-in PostgreSQL features

### Use `pg_search` on Neon when:

- You need better search relevance and typo tolerance
- You want to avoid setting up separate systems
- You prefer a managed database experience
- Your search needs are important but don't require specialized features

### Consider external search engines when:

- You have extremely large datasets (billions of records)
- Your search needs include specialized features not available in PostgreSQL
- You have the resources to manage additional infrastructure

For most web applications, content sites, and e-commerce platforms, `pg_search` on Neon provides a great balance between search features and simplicity. It extends PostgreSQL's capabilities without requiring you to manage separate systems or synchronize data.

## Conclusion

When choosing a search strategy, start with the simplest option that meets your needs. For many applications, `pg_search` on Neon offers a great middle ground - better search features than native PostgreSQL without the complexity of a separate search system.

Selecting the right search approach allows you to provide good search functionality to your users while keeping your application architecture as simple as possible.

<NeedHelp />
