---
title: Postgres tsvector data type
subtitle: Optimize full-text search in Postgres with the tsvector data type
enableTableOfContents: true
updatedOn: '2024-06-30T17:25:28.127Z'
---

`tsvector` is a specialized Postgres data type designed for full-text search operations. It represents a document in a form optimized for text search, where each word is reduced to its root form (lexeme) and stored with information about its position and importance.

In Postgres, the `tsvector` data type is useful for implementing efficient full-text search capabilities, allowing for fast and flexible searching across large volumes of text data.

<CTA />

## Storage and syntax

A `tsvector` value is a sorted list of distinct lexemes, which are words that have been normalized to merge different variants of the same word. Each lexeme can be followed by position(s) and/or weight(s).

The general syntax for a `tsvector` is:

```
'word1':1,3 'word2':2A ...
```

Where:

- `word1`, `word2`, etc., are the lexemes
- `1`, `3`, etc. are integers indicating the position of the word in the document
- positions can sometimes be followed by a letter to indicate a weight ('A', 'B', 'C' or 'D'), like `2A`. The default weight is 'D'.

For example:

- `'a':1A 'cat':2 'sat':3 'on':4 'the':5 'mat':6`

When a document is cast to `tsvector`, it doesn't perform any normalization and just splits the text into lexemes. To normalize the text, you can use the `to_tsvector` function with a specific text search configuration. For example:

```sql
SELECT
    'The quick brown fox jumps over the lazy dog.'::tsvector as colA,
    to_tsvector('english', 'The quick brown fox jumps over the lazy dog.') as colB;
```

This query produces the following output. The function `to_tsvector()` tokenizes the input document and computes the normalized lexemes based on the specified text search configuration (in this case, 'english'). The output is a `tsvector` with the normalized lexemes and their positions.

```text
                              cola                              |                         colb
----------------------------------------------------------------+-------------------------------------------------------
 'The' 'brown' 'dog.' 'fox' 'jumps' 'lazy' 'over' 'quick' 'the' | 'brown':3 'dog':9 'fox':4 'jump':5 'lazi':8 'quick':2
(1 row)
```

## Example usage

Consider a scenario where we're building a blog platform and want to implement full-text search for articles. We'll use `tsvector` to store the searchable content of each article.

The query below creates a table and inserts some sample blog data:

```sql
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    search_vector tsvector
);

INSERT INTO blog_posts (title, content)
VALUES
    ('PostgreSQL Full-Text Search', 'PostgreSQL offers powerful full-text search capabilities using tsvector and tsquery.'),
    ('Indexing in Databases', 'Proper indexing is crucial for database performance. It can significantly speed up query execution.'),
    ('ACID Properties', 'ACID (Atomicity, Consistency, Isolation, Durability) properties ensure reliable processing of database transactions.');

UPDATE blog_posts
SET search_vector = to_tsvector('english', title || ' ' || content);

CREATE INDEX idx_search_vector ON blog_posts USING GIN (search_vector);
```

To search for blog posts containing specific words, we can use the match operator `@@`, with a `tsquery` search expression:

```sql
SELECT title
FROM blog_posts
WHERE search_vector @@ to_tsquery('english', 'database & performance');
```

This query returns the following output:

```text
         title
-----------------------
 Indexing in Databases
(1 row)
```

## Other examples

### Use different text search configurations with `tsvector`

Postgres supports text search configurations for multiple languages. Here's an example using the 'spanish' configuration:

```sql
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    review TEXT NOT NULL,
    search_vector tsvector
);

INSERT INTO product_reviews (product_name, review)
VALUES
    ('Laptop XYZ', 'Este laptop es muy rápido y tiene una excelente batería.'),
    ('Smartphone ABC', 'La cámara del teléfono es increíble, pero la batería no dura mucho.'),
    ('Tablet 123', 'La tablet es ligera y fácil de usar, perfecta para leer libros.');

UPDATE product_reviews
SET search_vector = to_tsvector('spanish', product_name || ' ' || review);

SELECT product_name
FROM product_reviews
WHERE search_vector @@ to_tsquery('spanish', 'batería & (excelente | dura)');
```

This query returns the following output:

```text
  product_name
----------------
 Laptop XYZ
 Smartphone ABC
(2 rows)
```

### Rank the search results from a `tsvector` column

We can use the `ts_rank` function to rank search results based on relevance:

```sql
CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    headline TEXT NOT NULL,
    body TEXT NOT NULL,
    search_vector tsvector
);

INSERT INTO news_articles (headline, body)
VALUES
    ('Climate Change Summit Concludes', 'World leaders agreed on new measures to combat global warming at the climate summit.'),
    ('New Study on Climate Change', 'Scientists publish groundbreaking research on the effects of climate change on biodiversity.'),
    ('Tech Giant Announces Green Initiative', 'Major tech company pledges to be carbon neutral by 2030 in fight against climate change.');

UPDATE news_articles
SET search_vector = to_tsvector('english', headline || ' ' || body);

SELECT headline, ts_rank(search_vector, query) AS rank
FROM news_articles, to_tsquery('english', 'climate & change') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

This query returns the following output:

```text
               headline                |    rank
---------------------------------------+------------
 New Study on Climate Change           |  0.2532141
 Climate Change Summit Concludes       | 0.10645772
 Tech Giant Announces Green Initiative | 0.09910322
(3 rows)
```

All the articles were related to climate change, but the first article was ranked higher due to the higher relevance for the search terms.

## Additional considerations

- **Performance**: While `tsvector` enables fast full-text search, creating and updating `tsvector` columns can be computationally expensive. Consider using triggers or background jobs to update `tsvector` columns asynchronously.
- **Storage**: `tsvector` columns can significantly increase the size of your database. Monitor your database size and consider using partial indexes if full-text search is only needed for a subset of your data.
- **Language support**: PostgreSQL supports many languages out of the box, but you may need to install additional dictionaries for some languages.
- **Stemming and stop words**: The text search configuration determines how words are stemmed and which words are ignored as stop words. Choose the appropriate configuration for your use case.

## Resources

- [PostgreSQL Full Text Search documentation](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL tsvector data type documentation](https://www.postgresql.org/docs/current/datatype-textsearch.html)

<NeedHelp />
