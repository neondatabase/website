---
title: Full Text Search using tsvector with Neon Postgres
subtitle: A step-by-step guide describing how to implement full text search with tsvector in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2024-09-17T13:24:36.612Z'
updatedOn: '2024-09-17T13:24:36.612Z'
---


The `tsvector` type enables you to use full text search on your text content in Postgres. Full text search allows you to search text content in a more flexible way than using `LIKE`. Full text search also supports features like _stemming_, which means searching for the word "run" will match variations like "ran" and "running".

## Steps

* Set up a table with a `tsvector` column
* Execute your first full text search
* Search for multiple words
* Rank the results
* Create a GIN index

## Set up a table with a `tsvector` column

To set up full text search, you need to create a column of type `tsvector` that will enable full text search. You can run the following `CREATE TABLE` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to Neon. This statement will create a table with a column `searchable` of type `tsvector`.

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title TEXT,
  body TEXT,
  searchable tsvector
);
```

Next, insert two new rows into the `documents` table. The [to_tsvector()] (https://www.postgresql.org/docs/current/textsearch-controls.html) function takes in a language and the text content to tokenize. In the following example, the text content is the `title` and `body` columns concatenated together.

```sql
INSERT INTO documents (title, body, searchable)
  VALUES (
    'PostgreSQL Full-Text Search',
    'This is an introduction to full-text search in PostgreSQL.',
    to_tsvector('english', 'PostgreSQL Full-Text Search This is an introduction to full-text search in PostgreSQL.')
  );

INSERT INTO documents (title, body, searchable)
  VALUES (
    'My Mashed Potatoes Recipe',
    'These amazing homemade mashed potatoes are perfectly rich and creamy, full of great flavor, easy to make, and always a crowd fave!',
    to_tsvector('english', 'My Mashed Potatoes Recipe These amazing homemade mashed potatoes are perfectly rich and creamy, full of great flavor, easy to make, and always a crowd fave!')
  );
```

Once you have inserted the new rows, try running `SELECT * FROM documents;`. You will see that the data stored in the `searchable` column looks like the following.

```
'full':3,12 'full-text':2,11 'introduct':9 'postgresql':1,16 'search':5,14 'text':4,13
```

Internally, `to_tsvector()` uses a parser to break the text content into tokens for easier searching.

## Execute your first full text search

You can execute a full text search query using a `WHERE` clause with `@@ to_tsquery('english', 'content here')` as shown below. The following query returns the "mashed potatoes" row because, although the word "flavorful" does not appear in that row's text content, the word "flavor" does. And "flavor" matches "flavorful".

```sql
SELECT
    *
  FROM documents
  WHERE searchable @@ to_tsquery('english', 'flavorful');
```

Similarly, the following query returns the "PostgeSQL" row, even though the word "searching" does not appear in that row's text content, but "search" does.

```sql
SELECT
    *
  FROM documents
  WHERE searchable @@ to_tsquery('english', 'searching');
```

The `@@` operator is a special operator which compares the `tsvector` value stored in the `searchable` column with the `tsquery` value provided in the query. The `tsquery` type is different from the `tsvector` type. For example, if you run the following command, Postgres will return the string "searching".

```sql
SELECT to_tsquery('english', 'searching');
```

## Search for multiple words

If you try using `to_tsquery()` with multiple words, like `to_tsquery('english', 'searching text');`, Postgres will throw the following error.

```
ERROR: syntax error in tsquery: "searching text" (SQLSTATE 42601)
```

That's because the input to `to_tsquery()` must be tokens separated by `tsquery` operators like `&`. The correct way to search for "searching" and "text" would be `to_tsquery('english', 'searching & text');`. To make full text search easier to work with, Postgres also has a `phraseto_tsquery()` function that converts text into a `tsquery` with no need for operators. The following query will successfully return the "PostgreSQL" row.

```sql
SELECT
    *
  FROM documents
  WHERE searchable @@ phraseto_tsquery('english', 'searching text');
```

`tsquery` also supports negations. For example, the following query will search for rows whose text content matches "searching" and does **not** match "text".

```sql
SELECT
    *
  FROM documents
  WHERE searchable @@ to_tsquery('english', 'searching & !text');
```

Postgres also supports a `websearch_to_tsquery()` function, which uses an alternative syntax that doesn't require putting operators between all tokens. `websearch_to_tsquery()` supports negations by prefixing a token with `-`. The following query also searches for rows whose text content matches "searching" and does **not** match "text".

```sql
SELECT
    *
  FROM documents
  WHERE searchable @@ websearch_to_tsquery('english', 'searching -text');
```

## Rank the results

Postgres provides two functions for ranking the results, allowing you to sort by which results are the best match. The following statement sorts rows that match "searching text" using the `ts_rank()` function, which counts the number of tokens that match.

```sql
SELECT
    id,
    title,
    ts_rank(searchable, websearch_to_tsquery('english', 'searching text')) AS rank
  FROM documents
  WHERE searchable @@ websearch_to_tsquery('english', 'searching text')
  ORDER BY rank DESC;
```

To see how sorting works in practice, insert two more rows as follows. The first row contains 6 tokens that match "search" and "text", so it should show up first.

```sql
INSERT INTO documents (title, body, searchable)
  VALUES (
    'PostgreSQL Text Search',
    'A comprehensive, searchable guide in plain text format. Covers full text search in PostgreSQL',
    to_tsvector('english', 'PostgreSQL Text Search A comprehensive, searchable guide in plain text format. Covers full text search in PostgreSQL')
  );
```

Running the `ts_rank()` `SELECT` statement with these two new rows outputs rows in the following order. "PostgreSQL Text Search" appears first because it has the most occurrences of tokens that match "search" and "text". 

```sql
2	PostgreSQL Text Search	0.34941113
1	PostgreSQL Full-Text Search	0.3054688
```

Postgres also has a `ts_rank_cd()` function which uses an alternative ranking algorithm based on _cover density_. `ts_rank_cd()` also takes proximity of matching tokens into consideration, so the "PostgreSQL Text Search" row will rank slightly lower with `ts_rank_cd()` because there's more words between the matching tokens.

```sql
SELECT
    id,
    title,
    ts_rank_cd(searchable, websearch_to_tsquery('english', 'searching text')) AS rank
  FROM documents
  WHERE searchable @@ websearch_to_tsquery('english', 'searching text')
  ORDER BY rank DESC;
```

```
1	PostgreSQL Full-Text Search	0.21666667
2	PostgreSQL Text Search	0.21428572
```


## Create a GIN index

[GIN indexes](https://www.postgresql.org/docs/current/gin-intro.html) allow you to index your `tsvector` properties, which can make your full text search queries faster as your data grows. Just be careful, [GIN indexes can slow down your updates](https://pganalyze.com/blog/gin-index). Below is how you can create a GIN index on the `searchable` column.

```sql
CREATE INDEX searchable_idx ON documents USING GIN(searchable);
```

To test out the GIN index, let's first insert 100 copies of the "mashed potatoes" document. Sometimes Postgres decides to skip using indexes and use a sequential scan instead when a query matches most of the table.

```sql
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO documents (title, body, searchable)
    VALUES (
      'My Mashed Potatoes Recipe',
      'These amazing homemade mashed potatoes are perfectly rich and creamy, full of great flavor, easy to make, and always a crowd fave!',
      to_tsvector('english', 'My Mashed Potatoes Recipe These amazing homemade mashed potatoes are perfectly rich and creamy, full of great flavor, easy to make, and always a crowd fave!')
    );
  END LOOP;
END $$;
```

Next, you can run an `EXPLAIN ANALYZE` query (or just click the "Explain" button in the Neon SQL Editor) to confirm that Postgres is using your GIN index.

```sql
EXPLAIN ANALYZE
SELECT 
    id, title
  FROM documents
WHERE searchable @@ to_tsquery('english', 'search');
```

The `EXPLAIN ANALYZE` query should produce output that resembles the following. The `Bitmap Index Scan on searchable_idx` means that Postgres is using a GIN index rather than a sequential scan to answer the query.

```
Bitmap Heap Scan on documents  (cost=8.54..13.10 rows=2 width=29) (actual time=0.021..0.022 rows=2 loops=1)
  Recheck Cond: (searchable @@ '''search'''::tsquery)
  Heap Blocks: exact=1
  ->  Bitmap Index Scan on searchable_idx  (cost=0.00..8.54 rows=2 width=0) (actual time=0.009..0.009 rows=2 loops=1)
        Index Cond: (searchable @@ '''search'''::tsquery)
Planning Time: 0.095 ms
Execution Time: 0.105 ms
```
