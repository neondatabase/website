---
title: 'PostgreSQL Full Text Search'
redirectFrom: 
            - /postgresql/postgresql-indexes/postgresql-full-text-search
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about PostgreSQL full text search and how to use it to perform complex searches on text stored in the database.

## Introduction to the PostgreSQL full-text search

In PostgreSQL, full-text search is a built-in feature that allows you to perform complex searches on text stored in the database.

Full-text search enables efficient searching of documents, articles, or any form of text-based content by indexing their words and phrases.

The following describes an overview of how the PostgreSQL full text search works:

- **Indexing**: PostgreSQL allows you to create indexes on columns with the tsvector data type. When creating a full-text search index, PostgreSQL analyzes text data and generates a specialized data structure called **tsvector**, which represents the indexed document in a format optimized for searches.
- **Text analysis**: For building a full text index, PostgreSQL performs a text analysis process that involves tokenizing text into individual words or tokens, removing stop words ( like `the`, `and`,..) applying stemming (or lemmatization) to reduce words to their root forms, and performing other linguistic transformations to prepare the text for indexing.
- **Querying**: Once PostgreSQL creates the full text index, you can perform full-text search queries using dedicated full text search functions and operators. For example, you can search for specific words or phrases, apply boolean operators to combine search terms, and more.
- **Ranking**: allows you to rank the search results based on their relevance to the query. PostgreSQL offers the `ts_rank()` function to calculate a rank score for each document based on its similarity to the search query. You can use the ranking feature to sort the search results based on relevance.
- **Highlighting**: PostgreSQL can generate snippets or summaries of documents containing the matching words from the search query.

In practice, you often use the full text search feature in applications including content management systems (`CMS`), document management systems, and so on to enable fast searches on a large volume of text.

## PostgreSQL full text search data types

PostgreSQL provides you with two data types unique to full text search: `tsvector` and `tsquery`:

### tsvector

`tsvector` is a data type that allows you to store preprocessed documents in a format optimized for efficient searching and retrieval of text.

A `tsvector` value contains a sorted list of lexemes (words) and their positions and weight within a document.

Note that lexemes are words without the variation created by suffixes, for example, `watches`, `watched`, and `watching` words have the lexeme `watch`.

For example, the following uses the `to_tsvector()` function to convert the words `watches`, `watched`, and `watching` to `tsvector`:

```sql
SELECT to_tsvector('waches'),
       to_tsvector('wached'),
       to_tsvector('waching');
```

Output:

```
 to_tsvector | to_tsvector | to_tsvector
-------------+-------------+-------------
 'wach':1    | 'wach':1    | 'wach':1
(1 row)
```

In this example, the `to_tsvector()` function converts the words into tsvector values. Instead of returning the original words, it returns the lexemes of these words, which is `watch`.

The following example uses the `to_tsvector()` function to convert a string to a tsvector value. For example:

```sql
SELECT to_tsvector('The quick brown fox jumps over the lazy dog.');
```

Output:

```
                      to_tsvector
-------------------------------------------------------
 'brown':3 'dog':9 'fox':4 'jump':5 'lazi':8 'quick':2
(1 row)
```

In this example:

- Each entry in the tsvector value represents a word (lexeme) and its position within the string (or document). For example, the word `quick` appears at position 2, the word `brown` appears at position 3, and so on.
- Words are sorted in alphabetical order.
- Articles and stop words are omitted like `The` and `over`.

### tsquery

`tsquery` is a data type that represents search queries in full-text searches. It allows you to specify search conditions containing the indexed document's words or phrases.

Additionally, a `tsquery` value can include search operators to refine the search conditions.

- **Boolean operators** AND (&), OR (|), and NOT (!): can combine search terms and define logical relationships between them.
- **Phrase search**(""): Double quotes ("") indicate that the enclosed words must appear together in the index document in the specified order.
- **Prefix search**(:) : A colon (:) after a word indicates that the search term should match words with the same prefix.
- **Negation** (-): a negation excludes specific terms from the search results.
- **Grouping** (): You can use parentheses to group terms and operators to define flexible search conditions.

For example:

```
'quick' & 'brown' | 'fox'
```

This `tsquery` searches for the documents that contain the words "quick" and "brown" together (in any order), or the word "fox".

The `to_tsquery()` converts a string to a `tsquery`. For example, the following statement uses the `to_tsquery()` to convert the word "jumping" to a `tsquery`:

```sql
SELECT to_tsquery('jumping');
```

Output:

```
 to_tsquery
------------
 'jump'
(1 row)
```

### The match operator (@@)

The match operator (`@@`) evaluates the similarity between the text in a document (`tsvector`) and the terms specified in the search query (`tsquery`) and returns true if there is a match or false otherwise.

```
tsvector @@ tsquery
```

For example, the following statement uses the `@@` operator to determine if the string matches the `tsquery`:

```sql
SELECT
  to_tsvector(
    'The quick brown fox jumps over the lazy dog.'
  ) @@ to_tsquery('jumping') result;
```

Output:

```
 result
--------
 t
(1 row)
```

It returns true because the tsvector contains the word jump which is the lexeme of the word jumping.

The following example uses the match operator (`@@`) to determine if the string contains the word cat:

```sql
SELECT
  to_tsvector(
    'The quick brown fox jumps over the lazy dog.'
  ) @@ to_tsquery('cat') result;
```

Output:

```
 result
--------
 f
(1 row)
```

## Using PostgreSQL full-text search index with table data

Let's take some examples of using full-text searches with boolean operators.

### 1) Setting up a sample table

First, [create a new table](/postgresql/postgresql-create-table) called `posts`:

```sql
CREATE TABLE posts(
   id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   body TEXT,
   body_search TSVECTOR
      GENERATED ALWAYS AS (to_tsvector(body)) STORED
);
```

In the `posts` table, the `body_search` is a [generated column](/postgresql/postgresql-generated-columns) with the data type `tsvector`.

Whenever you change data in the `body` column, PostgreSQL will convert it to a `tsvector` using the `to_tsvector()` function and store it in the `body_search` column.

Second, [insert some rows](/postgresql/postgresql-insert) into the `posts` table:

```sql
INSERT INTO posts (title, body)
VALUES
    ('Introduction to PostgreSQL', 'This is an introductory post about PostgreSQL. It covers basic concepts and features.'),
    ('Advanced PostgresSQL Techniques', 'In this post, we delve into advanced PostgreSQL techniques for efficient querying and data manipulation.'),
    ('PostgreSQL Optimization Strategies', 'This post explores various strategies for optimizing PostgreSQL database performance and efficiency.');
```

Third, retrieve data from the `id` and `body_search` columns:

```sql
SELECT
  id,
  body_search
FROM
  posts;
```

Output:

```
 id |                                                body_search
----+------------------------------------------------------------------------------------------------------------
  1 | 'basic':10 'concept':11 'cover':9 'featur':13 'introductori':4 'post':5 'postgresql':7
  2 | 'advanc':7 'data':14 'delv':5 'effici':11 'manipul':15 'post':3 'postgresql':8 'queri':12 'techniqu':9
  3 | 'databas':9 'effici':12 'explor':3 'optim':7 'perform':10 'post':2 'postgresql':8 'strategi':5 'various':4
(3 rows)
```

### 2) Simple full-text search

The following example uses the match operator (`@@`) to search for posts whose `body` contains the word `"PostgreSQL"`:

```sql
SELECT
  id,
  body
FROM
  posts
WHERE
  body_search @@ to_tsquery('PostgreSQL');
```

Output:

```
 id |                                                   body
----+----------------------------------------------------------------------------------------------------------
  1 | This is an introductory post about PostgreSQL. It covers basic concepts and features.
  2 | In this post, we delve into advanced PostgreSQL techniques for efficient querying and data manipulation.
  3 | This post explores various strategies for optimizing PostgreSQL database performance and efficiency.
(3 rows)
```

### 3) Full-text search with AND operator

The following example uses the AND operator (&) to search for posts whose body contains both words "PostgreSQL" and "techniques" that can appear in any order:

```sql
SELECT
  id,
  body
FROM
  posts
WHERE
  body_search @@ to_tsquery('PostgreSQL & techniques');
```

Output:

```
 id |                                                   body
----+----------------------------------------------------------------------------------------------------------
  2 | In this post, we delve into advanced PostgreSQL techniques for efficient querying and data manipulation.
(1 row)
```

### 4) Full-text search with OR operator

The following example uses the OR operator (|) to search for posts whose body contains either the word `"efficient"` or `"optimization"`:

```sql
SELECT
  id,
  body
FROM
  posts
WHERE
  body_search @@ to_tsquery('efficient | optimization');
```

Output:

```
 id |                                                   body
----+----------------------------------------------------------------------------------------------------------
  2 | In this post, we delve into advanced PostgreSQL techniques for efficient querying and data manipulation.
  3 | This post explores various strategies for optimizing PostgreSQL database performance and efficiency.
(2 rows)
```

### 5) full-text search with phrase

The following example searches for posts whose body contains the phrase "PostgreSQL technique":

```sql
SELECT
  id,
  body
FROM
  posts
WHERE
  body_search @@ to_tsquery('''PostgreSQL technique''');
```

Output:

```
 id |                                                   body
----+----------------------------------------------------------------------------------------------------------
  2 | In this post, we delve into advanced PostgreSQL techniques for efficient querying and data manipulation.
(1 row)
```

### 6) Full-text search with negation

The following example searches for posts whose body does not contain the word "efficient":

```sql
SELECT id, body
FROM posts
WHERE NOT body_search @@ to_tsquery('efficient');
```

Output:

```
 id |                                         body
----+---------------------------------------------------------------------------------------
  1 | This is an introductory post about PostgreSQL. It covers basic concepts and features.
(1 row)
```

## Full text search using GIN indexes

In PostgreSQL, GIN stands for Generalized Inverted Index. GIN index is a type of index that is optimized for full-text search vectors (`tsvector`).

First, drop the `posts` table and recreate it using the following statements:

```sql
DROP TABLE IF EXISTS posts;

CREATE TABLE posts(
   id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   body TEXT
);
```

Second, [insert rows](/postgresql/postgresql-insert) into the `posts` table:

```sql
INSERT INTO posts (title, body)
VALUES
    ('Introduction to PostgreSQL', 'This is an introductory post about PostgreSQL. It covers basic concepts and features.'),
    ('Advanced PostgresSQL Techniques', 'In this post, we delve into advanced PostgreSQL techniques for efficient querying and data manipulation.'),
    ('PostgreSQL Optimization Strategies', 'This post explores various strategies for optimizing PostgreSQL database performance and efficiency.');
```

Third, create a GIN index on the `body` column of the `posts` table:

```sql
CREATE INDEX body_fts
ON posts
USING GIN ((to_tsvector('english',body)));
```

Finally, search for the `posts` whose body contains either the word `basic` or `advanced`:

```sql
SELECT
  id,
  body
FROM
  posts
WHERE
  body @@ to_tsquery('basic | advanced');
```

Output:

```
 id |                                                   body
----+----------------------------------------------------------------------------------------------------------
  1 | This is an introductory post about PostgreSQL. It covers basic concepts and features.
  2 | In this post, we delve into advanced PostgreSQL techniques for efficient querying and data manipulation.
(2 rows)
```

## Summary

- Use PostgreSQL full text search feature to perform complex searches on text stored in the database.
- Use tsvector and tsquery data types for full text searches.
- Use the match operator (`@@`) to check if documents match a query.
- Use the generated column with `tsvector` type to store the tsvector data for full text searches.
- Use `GIN` indexes for full-text search vectors (`tsvector`).
