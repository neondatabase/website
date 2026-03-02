---
title: 'PostgreSQL unnest() Function'
page_title: 'PostgreSQL unnest() Function'
page_description: 'Learn how to use the PostgreSQL unnest() function to expand an array into a set of rows.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Array Functions'
  slug: 'postgresql-array-functions'
nextLink:
  title: 'PostgreSQL array_length() Function'
  slug: 'postgresql-array-functions/postgresql-array_length'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `unnest()` function to expand an array into a set of rows.

## Introduction to PostgreSQL unnest() function

The `unnest()` function expands an array into a set of rows, one row per element. Here's the syntax:

```sql
unnest(array)
```

The function returns a set of rows (a `SETOF` type), where each row contains one element from the array. The returned column has the same data type as the array elements.

## PostgreSQL unnest() function examples

### 1) Basic unnest() example

The following example expands a simple integer array into rows:

```sql
SELECT unnest(ARRAY[1, 2, 3]) AS n;
```

Output:

```text
 n
---
 1
 2
 3
(3 rows)
```

### 2) Expanding a text array

```sql
SELECT unnest(ARRAY['red', 'green', 'blue']) AS color;
```

Output:

```text
 color
-------
 red
 green
 blue
(3 rows)
```

### 3) Using unnest() with a table column

Suppose you have a `posts` table where each post stores its tags as an array:

```sql
CREATE TABLE posts (
  id    INT PRIMARY KEY,
  title TEXT,
  tags  TEXT[]
);

INSERT INTO posts VALUES
  (1, 'PostgreSQL Arrays', ARRAY['postgresql', 'arrays', 'sql']),
  (2, 'JSON in Postgres',  ARRAY['postgresql', 'json']),
  (3, 'Indexing Tips',     ARRAY['postgresql', 'indexes', 'performance']);
```

You can use `unnest()` to expand the tags into individual rows, which is useful for counting or filtering by tag:

```sql
SELECT id, title, unnest(tags) AS tag
FROM posts;
```

Output:

```text
 id |        title        |     tag
----+---------------------+-------------
  1 | PostgreSQL Arrays   | postgresql
  1 | PostgreSQL Arrays   | arrays
  1 | PostgreSQL Arrays   | sql
  2 | JSON in Postgres    | postgresql
  2 | JSON in Postgres    | json
  3 | Indexing Tips       | postgresql
  3 | Indexing Tips       | indexes
  3 | Indexing Tips       | performance
(8 rows)
```

### 4) Counting tag occurrences

Building on the previous example, you can count how many posts use each tag:

```sql
SELECT
  unnest(tags) AS tag,
  COUNT(*) AS post_count
FROM posts
GROUP BY tag
ORDER BY post_count DESC, tag;
```

Output:

```text
     tag     | post_count
-------------+------------
 postgresql  |          3
 arrays      |          1
 indexes     |          1
 json        |          1
 performance |          1
 sql         |          1
(6 rows)
```

### 5) Expanding multiple arrays in parallel

You can pass multiple arrays to `unnest()` in a single call using the multi-argument form. The arrays are expanded in parallel, and the result is padded with `NULL` if the arrays have different lengths:

```sql
SELECT
  unnest(ARRAY['a', 'b', 'c']) AS letter,
  unnest(ARRAY[1, 2])          AS num;
```

Output:

```text
 letter | num
--------+-----
 a      |   1
 b      |   2
 c      |
(3 rows)
```

### 6) Using unnest() with WITH ORDINALITY

Add the `WITH ORDINALITY` clause to include the element's position (1-based index) in the output:

```sql
SELECT element, position
FROM unnest(ARRAY['first', 'second', 'third']) WITH ORDINALITY AS t(element, position);
```

Output:

```text
 element | position
---------+----------
 first   |        1
 second  |        2
 third   |        3
(3 rows)
```

`WITH ORDINALITY` is useful when you need to preserve the original order of array elements in a query.

## Summary

- Use `unnest(array)` to expand an array into a set of rows, one row per element.
- Use `unnest()` in the `SELECT` list to expand array columns alongside other columns.
- Use `WITH ORDINALITY` to include the element's position in the result.
- Pass multiple arrays to `unnest()` to expand them in parallel (shorter arrays are padded with `NULL`).
