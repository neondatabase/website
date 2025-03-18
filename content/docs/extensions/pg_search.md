---
title: The pg_search extension
subtitle: An Elasticsearch alternative for full-text search and analytics on Postgres
tag: new
enableTableOfContents: true
updatedOn: '2025-03-18T00:42:18.071Z'
---

The `pg_search` extension by [ParadeDB](https://www.paradedb.com/) adds functions and operators to Postgres that use [BM25 (Best Matching 25)](https://en.wikipedia.org/wiki/Okapi_BM25) indexes for efficient, high-relevance text searches. It supports standard SQL syntax and JSON query objects, offering features similar to those in Elasticsearch.

`pg_search` eliminates the need to integrate external search engines, simplifying your architecture and providing real-time search functionality that's tightly coupled with your transactional data.

<CTA />

In this guide, you'll learn how to enable `pg_search` on Neon, understand the fundamentals of BM25 scoring and inverted indexes, and explore hands-on examples to create indexes and perform full-text searches on your Postgres database.

<Admonition type="note" title="pg_search on Neon">

`pg_search` is currently only available on Neon projects using Postgres 17 and created in an [AWS region](/docs/introduction/regions#aws-regions).

</Admonition>

## Enable the `pg_search` extension

You can install the `pg_search` extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS pg_search;
```

## Understanding text search with `pg_search`

`pg_search` enables text searching within your Postgres database, helping you find rows containing specific keywords or phrases in text columns. Unlike basic `LIKE` queries, `pg_search` offers advanced scoring, relevance ranking, and language handling to deliver more accurate and context-aware search results. It also addresses major performance limitations of native Postgres full-text search (FTS) by using a **BM25 covering index**, which indexes text along with metadata (numeric, datetime, JSON, etc.), enabling complex boolean, aggregate, and ordered queries to be processed significantly faster—often reducing query times from minutes to seconds.

Key features include:

- **Advanced relevance ranking:** Orders search results by relevance, incorporating phrase, regex, fuzzy matching, and other specialized FTS queries.
- **Powerful indexing with flexible tokenization:** Supports multiple tokenizers (e.g., ICU, Lindera) and token filters (e.g., language-aware stemmers), improving search accuracy across different languages.
- **Hybrid search:** Combines BM25 scores with `pgvector` embeddings to enhance search experiences.
- **Faceted search:** Allows categorization and filtering of search results based on query parameters.
- **Expressive query builder:** Provides an Elastic DSL-like query syntax for constructing complex search queries.

By leveraging these features, `pg_search` enhances both performance and flexibility, making full-text search in Postgres more efficient and developer-friendly.

### BM25: The Relevance scoring algorithm

`pg_search` utilizes the [**BM25 (Best Matching 25)**](https://en.wikipedia.org/wiki/Okapi_BM25) algorithm, a widely adopted ranking function by modern search engines, to calculate relevance scores for full-text search results. BM25 considers several factors to determine relevance:

- **Term Frequency (TF):** How often a search term appears in a row's text. More occurrences suggest higher relevance.
- **Inverse Document Frequency (IDF):** How common or rare your search term is across all rows. Less common words often indicate more specific results.
- **Document Length Normalization:** BM25 adjusts for text length, preventing longer rows from automatically seeming more relevant.

BM25 assigns a relevance score to each row, with higher scores indicating better matches.

### Inverted Index for efficient searching

For fast searching, `pg_search` uses an **inverted index**. Think of it as an index in the back of a book, but instead of mapping topics to page numbers, it maps words (terms) to the database rows (documents) where they appear.

This index structure lets `pg_search` quickly find rows containing your search terms without scanning every table row, greatly speeding up queries.

With these basics in mind, let's learn how to create a BM25 index and start performing full-text searches with `pg_search` on Neon.

## Getting started with `pg_search`

`pg_search` has a special operator, `@@@`, that you can use in SQL queries to perform full-text searches. This operator allows you to search for specific words or phrases within text columns, returning rows that match your search criteria. You can also sort results by relevance and highlight matched terms. Let us create a sample table, set up a BM25 index, and run some search queries to explore `pg_search` in action.

### Creating a sample table for text search

To demonstrate how `pg_search` functions, we'll begin by creating a sample table named `mock_items` and populating it with example data. ParadeDB provides a convenient tool to generate a test table with sample data for experimentation.

First, connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a client like [psql](/docs/connect/query-with-psql-editor). Once connected, execute the following SQL command:

```sql
CALL paradedb.create_bm25_test_table(
  schema_name => 'public',
  table_name => 'mock_items'
);
```

It will generate a table named `mock_items`, which include the columns: `id`, `description`, `rating`, and `category`, which we will utilize in our search examples.

Let's examine the initial items within our newly created `mock_items` table. Run the following SQL query:

```sql
SELECT description, rating, category
FROM mock_items
LIMIT 3;
```

The output will display the first three rows from the `mock_items` table:

```text
       description               | rating |  category
--------------------------+--------+-------------
 Ergonomic metal keyboard |      4 | Electronics
 Plastic Keyboard         |      4 | Electronics
 Sleek running shoes      |      5 | Footwear
(3 rows)
```

Next, let's create our first search index, named `item_search_idx`, on the `mock_items` table. This index will enable searching across the `id`, `description`, and `category` columns. It's necessary to designate one column as the `key_field`; we will use `id` for this purpose. The `key_field` serves as a unique identifier for each item within the index.

<Admonition type="note" title="Key Field Selection">
It is crucial to select a column that consistently contains a unique value for every row. This ensures the search index operates as intended.
</Admonition>

Run the following SQL command to create the `item_search_idx` index:

```sql
CREATE INDEX item_search_idx ON mock_items
USING bm25 (id, description, category)
WITH (key_field='id');
```

This will create a BM25 index on the `mock_items` table, enabling us to search within the `id`, `description`, and `category` columns. The `key_field` parameter specifies that the `id` column serves as the unique identifier for each row in the index.

Now that we have our `item_search_idx` index, let's explore some searches using the `@@@` operator in our SQL queries.

### Simple keyword search

Let's begin by finding all items where the `description` contains the word **'shoes'**. Run the following SQL query:

```sql
SELECT description, category
FROM mock_items
WHERE description @@@ 'shoes';
```

This query will locate all rows in `mock_items` where the `description` column includes the word **'shoes'**.

```text
     description           | category
----------------------+----------
 Sleek running shoes  | Footwear
 White jogging shoes  | Footwear
 Generic shoes        | Footwear
(3 rows)
```

### Searching for exact phrases

To search for a specific phrase, enclose it in double quotes. Let's find items where the `description` contains the exact phrase **"metal keyboard"**:

```sql
SELECT description, category
FROM mock_items
WHERE description @@@ '"metal keyboard"';
```

This search will exclusively find rows that contain the exact phrase **"metal keyboard"**.

```text
description               | category
--------------------------+------------
 Ergonomic metal keyboard | Electronics
(1 row)
```

If we remove the double quotes, the search will find rows containing both **'metal'** and **'keyboard'**, but the words are not required to be adjacent.

```sql

SELECT description, category
FROM mock_items
WHERE description @@@ 'metal keyboard';
```

The output is:

```text
description               | category
--------------------------+------------
 Ergonomic metal keyboard | Electronics
 Plastic Keyboard         | Electronics
(2 rows)
```

### Advanced search options

#### paradedb.match: Similar word search and keyword matching

The `paradedb.match` function is used for keyword searches and for finding words similar to your search term, even with typos.

For example, to find items similar to **'running shoes'**, use:

```sql
SELECT description, category
FROM mock_items
WHERE id @@@ paradedb.match('description', 'running shoes');
```

```text
  description            | category
-----------------------+----------
  Sleek running shoes  | Footwear
  White jogging shoes  | Footwear
  Generic shoes        | Footwear
(3 rows)
```

You can also use `paradedb.match` with JSON syntax. For instance, to find items with a description similar to **'running shoes'**:

```sql
SELECT description, category
FROM mock_items
WHERE id @@@ '{"match": {"field": "description", "value": "running shoes"}}'::jsonb;
```

#### Searching with typos: Fuzzy matching

To retrieve results even with minor errors in the search term, you can use `paradedb.match` with the `distance` option.

Suppose you mistyped **'running'** as **'runing'**. You can still find relevant results using fuzzy matching:

```sql
SELECT description, category
FROM mock_items
WHERE id @@@ paradedb.match('description', 'runing', distance => 1);
```

This will find items where the `description` is similar to **'runing'** within a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) of 1.

```text
  description              | category
-------------------------+----------
    Sleek running shoes  | Footwear
(1 rows)
```

#### paradedb.phrase: Searching for phrases with words nearby

The `paradedb.phrase` function, combined with the `slop` option, helps you find phrases even if the words are not immediately adjacent. The `slop` value specifies the number of intervening words allowed. A `slop` of 1 permits one extra word in between.

```sql
SELECT description, category
FROM mock_items
WHERE id @@@ paradedb.phrase('description', ARRAY['white', 'shoes'], slop => 1);
```

This query will find rows where **'white'** and **'shoes'** are within one word or less of each other.

```text
  description              | category
-------------------------+----------
    White jogging shoes  | Footwear
(1 rows)
```

### Sorting search results by relevance

To ensure the most relevant results are displayed first, you can sort your search results by relevance. Utilize `paradedb.score()` with `ORDER BY` to achieve this:

```sql
SELECT description, category, rating, paradedb.score(id)
FROM mock_items
WHERE description @@@ 'shoes'
ORDER BY paradedb.score(id) DESC;
```

This query will find items matching **'shoes'** and then present them in order from most to least relevant based on their search score (BM25 relevance score).

```text
description           | category | rating | score
----------------------+----------+--------+-------------
  Generic shoes       |	Footwear |	 4   |	2.8772602
  Sleek running shoes |	Footwear |	 5   |	2.4849067
  White jogging shoes |	Footwear |   3   |	2.4849067
(3 rows)
```

### Highlighting search results

To highlight matched terms in the search results, you can use the `paradedb.snippet()` function. This function generates snippets of text containing the matched words, making it easier to identify relevant content.

```sql
SELECT id, paradedb.snippet(description)
FROM mock_items
WHERE description @@@ 'shoes'
LIMIT 3;
```

This will provide snippets of the `description` where the words matching your search are wrapped in `<b></b>` tags by default. This visual cue makes the matched terms stand out when results are displayed in your application.

```text
  id  | snippet
----+-----------------------------------
  3 | Sleek running <b>shoes</b>
  4 | White jogging <b>shoes</b>
  5 | Generic <b>shoes</b>
(3 rows)
```

If you prefer different tags, you can customize the tags using the `start_tag` and `end_tag` options with `paradedb.snippet()`. For example:

```sql
SELECT id, paradedb.snippet(description, start_tag => '<start>', end_tag => '</end>')
FROM mock_items
WHERE description @@@ 'shoes'
LIMIT 3;
```

This will wrap the matched words in `<start>` and `</end>` tags instead of the default `<b>` and `</b>`.

```text
  id  | snippet
----+-----------------------------------
  3 | Sleek running <start>shoes</end>
  4 | White jogging <start>shoes</end>
  5 | Generic <start>shoes</end>
(3 rows)
```

### Combining search words with `AND/OR`

To create more complex searches, you can use `OR` and `AND` operators to combine keywords. For instance, to retrieve items with **'shoes'** in the `description` OR **'Electronics'** in the `category`, you can use:

```sql
SELECT description, category
FROM mock_items
WHERE description @@@ 'shoes' OR category @@@ 'Electronics'
LIMIT 3;
```

This will find items that satisfy either of these conditions.

```text
     description               | category
--------------------------+------------
 Ergonomic metal keyboard | Electronics
 Plastic Keyboard         | Electronics
 Sleek running shoes      | Footwear
(3 rows)
```

### Query builder functions

In addition to query strings, query builder functions can be used to compose various types of complex queries.

For a list of supported query builder functions, refer to ParadeDB's [Query Builder](https://docs.paradedb.com/documentation/advanced/overview) documentation.

## Performance optimizations for `pg_search`

To optimize `pg_search` performance, adjust both Postgres and `pg_search` settings for indexing and query speed.

`pg_search` parameter names start with `paradedb`. You can configure both Postgres and `pg_search` settings for the current session using `SET`.

### Index build time

Optimize index build time with these settings. The `maintenance_work_mem` setting is typically only one requiring tuning. The other two setting have proven default values that typically do not require modification.

- **`maintenance_work_mem`**: : Sets the maximum amount of memory used for maintenance operations such as `CREATE INDEX`. Increasing this setting can speed up index builds by improving Write-Ahead Log (WAL) performance. For example, on a 100-million-row table, allocating multiple GBs can reduce index build time from hours to minutes.

  In Neon, `maintenance_work_mem` is set based on your compute size. You can increase it for the current session. Do not exceed 50–60% of your compute's available RAM. See [Neon parameter settings by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size).

      ```sql
      SET maintenance_work_mem = '10 GB';
      ```

- **`paradedb.create_index_memory_budget`**: Defines the memory per indexing thread before writing index segments to disk. The default is 1024 MB (1 GB). Large tables may need a higher value. If set to `0`, the budget is derived from `maintenance_work_mem` and `paradedb.create_index_parallelism`.

  ```sql
  SET paradedb.create_index_memory_budget = 2048;
  ```

- **`paradedb.create_index_parallelism`**: Controls the number of threads used during `CREATE INDEX`. The default is `0`, which automatically detects the available parallelism of your Neon compute. You can explicitly set:

      ```sql
      SET paradedb.create_index_parallelism = 8;
      ```

For more information about optimizing BM25 index size, see [ParadeDB — Index Size](https://docs.paradedb.com/documentation/configuration/index_size).

### Throughput

<Admonition type="note">
Most users will not need to adjust these advanced throughput settings.
</Admonition>

Tune `INSERT/UPDATE/COPY` throughput for the BM25 index with these settings:

- **`paradedb.statement_parallelism`**: Controls indexing threads during `INSERT/UPDATE/COPY`. Default is `0` (auto-detects parallelism).

  - Use `1` for single-row atomic inserts/updates to avoid unnecessary threading.
  - Use a higher value for bulk inserts and updates.

    ```sql
    SET paradedb.statement_parallelism = 1;
    ```

- **`paradedb.statement_memory_budget`**: Memory per indexing thread before writing to disk. Default is 1024 MB (1 GB). Higher values may improve indexing performnace. See [ParadeDB — Statement Memory Budget](https://docs.paradedb.com/documentation/configuration/write#statement-memory-budget).

  - If set to `0`, `maintenance_work_mem / paradedb.statement_parallelism` is used.
  - For single-row updates, 15 MB prevents excess memory allocation.
  - For bulk inserts/updates, increase as needed.

    ```sql
    SET paradedb.statement_memory_budget = 15;
    ```

### Search performance

Expensive search queries benefit from parallel workers and increased shared buffer memory.

#### Parallel workers

Increase parallel workers to speed up indexing:

- **`max_worker_processes`**: Controls total worker processes across all connections.

      ```sql
      SET max_worker_processes = 8;
      ```

- **`max_parallel_workers`**: Defines the number of workers available for parallel scans.

      ```sql
      SET max_parallel_workers = 8;
      ```

- **`max_parallel_workers_per_gather`**: Limits parallel workers per query. The default in Neon is `2`, but you can adjust. The total number of parallel workers should not exceed your Neon compute's vCPU count. See [Neon parameter settings by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size).
  `sql
SET max_parallel_workers_per_gather = 8;
`

#### Shared buffers

Keeping indexes in memory improves performance. `shared_buffers` defines Postgres buffer cache size. In Neon, this is set based on compute size. Additionally, **Neon’s Local File Cache (LFC)** extends shared buffers and can use up to 75% of your compute’s RAM.

For LFC sizes by compute size, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

#### Prewarming your indexes

Using the Postgres `pg_prewarm` extension to preload data into into your buffers and cache can significantly improve query response times by ensuring that your data is readily available in memory. Do this after index creation and also after any restart of your Neon compute, which runs Postgres.

Refer to the [pg_prewarm extension](/docs/extensions/pg_prewarm) guide for how to install the `pg_prewarm` extension.

To run `pg_prewarm` on a search index:

```sql
pg_prewarm('index_name')
```

For additional details, see [Running pg_prewarm on indexes](/docs/extensions/pg_prewarm#running-pgprewarm-on-indexes).

## Best practices for using `pg_search`

To optimize your search functionality and ensure efficient performance, consider the following best practices when using `pg_search`:

- **Analyze query plans:** Use `EXPLAIN` to analyze query plans and identify potential bottlenecks.
- **Index all relevant columns:** Include all columns used in search queries, sorting, or filtering for optimal performance.
- **Utilize query builder functions:** Leverage query builder functions or JSON syntax for complex queries like fuzzy matching and phrase matching.

## Conclusion

You have successfully learned how to enable and utilize the `pg_search` extension on Neon for full-text search. By leveraging BM25 scoring and inverted indexes, `pg_search` provides powerful search capabilities directly within your Postgres database, eliminating the need for external search engines and ensuring real-time, ACID-compliant search functionality.

While this guide provides a comprehensive introduction to `pg_search` on Neon, it is not exhaustive. We haven't covered topics like:

- **Advanced tokenization and language handling:** Exploring specialized [tokenizers](https://docs.paradedb.com/documentation/indexing/tokenizers#tokenizers) and language-specific features.
- **The full range of query types:** Exploring the full range of query functions like `more_like_this`, `regex_phrase`, and compound queries for complex search needs.
- **Leveraging fast fields:** Optimizing performance with [fast fields](https://docs.paradedb.com/documentation/indexing/fast_fields#fast-fields) for aggregations, filtering, and sorting, and understanding their configuration.
- **Query-time boosting:** Fine-tuning search relevance by applying [boosts](https://docs.paradedb.com/documentation/advanced/compound/boost#boost) to specific fields or terms within your queries.

For a deeper dive into these and other advanced features, please refer to the official [ParadeDB documentation](https://docs.paradedb.com/welcome/introduction).

## Resources

- [ParadeDB Documentation](https://docs.paradedb.com/welcome/introduction)
- [Stemming in ParadeDB](https://docs.paradedb.com/documentation/indexing/token_filters#stemmer)
- [BM25 Algorithm](https://en.wikipedia.org/wiki/Okapi_BM25)
- [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
