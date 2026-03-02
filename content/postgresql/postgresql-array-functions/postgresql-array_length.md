---
title: 'PostgreSQL array_length() Function'
page_title: 'PostgreSQL array_length() Function'
page_description: 'Learn how to use the PostgreSQL array_length() function to get the number of elements in a specific dimension of an array.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL unnest() Function'
  slug: 'postgresql-array-functions/postgresql-unnest'
nextLink:
  title: 'PostgreSQL cardinality() Function'
  slug: 'postgresql-array-functions/postgresql-cardinality'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `array_length()` function to return the length of an array dimension.

## Introduction to PostgreSQL array_length() function

The `array_length()` function returns the number of elements in a specific dimension of an array. Here's the syntax:

```sql
array_length(array, dimension)
```

In this syntax:

- `array` is the array whose length you want to measure.
- `dimension` is an integer specifying which dimension to measure, starting at `1` for the first dimension.

The function returns an integer, or `NULL` if the array is `NULL` or the specified dimension does not exist.

For one-dimensional arrays (the most common case), always pass `1` as the dimension.

## PostgreSQL array_length() function examples

### 1) Basic array_length() example

The following example returns the length of a one-dimensional integer array:

```sql
SELECT array_length(ARRAY[10, 20, 30, 40, 50], 1) AS len;
```

Output:

```text
 len
-----
   5
(1 row)
```

### 2) Using array_length() with a text array

```sql
SELECT array_length(ARRAY['a', 'b', 'c'], 1) AS len;
```

Output:

```text
 len
-----
   3
(1 row)
```

### 3) Measuring a multidimensional array

For multidimensional arrays, pass the dimension number you want to measure:

```sql
SELECT
  array_length('{{1,2,3},{4,5,6}}'::int[], 1) AS rows,
  array_length('{{1,2,3},{4,5,6}}'::int[], 2) AS cols;
```

Output:

```text
 rows | cols
------+------
    2 |    3
(1 row)
```

- Dimension `1` returns `2` (the number of sub-arrays/rows).
- Dimension `2` returns `3` (the number of elements in each sub-array/column).

### 4) Handling NULL and empty arrays

`array_length()` returns `NULL` for `NULL` arrays and for empty arrays:

```sql
SELECT
  array_length(NULL::int[], 1)   AS null_array,
  array_length(ARRAY[]::int[], 1) AS empty_array;
```

Output:

```text
 null_array | empty_array
------------+-------------
            |
(1 row)
```

To distinguish between `NULL` and empty arrays, use [`cardinality()`](postgresql-cardinality) instead, which returns `0` for empty arrays.

### 5) Using array_length() with a table column

Suppose you have a `products` table with a `tags` column storing an array of tags per product:

```sql
CREATE TABLE products (
  id   INT PRIMARY KEY,
  name TEXT,
  tags TEXT[]
);

INSERT INTO products VALUES
  (1, 'Laptop',    ARRAY['electronics', 'computers', 'portable']),
  (2, 'Desk',      ARRAY['furniture', 'office']),
  (3, 'Pen',       ARRAY['stationery']);
```

The following query returns how many tags each product has:

```sql
SELECT
  name,
  array_length(tags, 1) AS tag_count
FROM products
ORDER BY tag_count DESC;
```

Output:

```text
  name  | tag_count
--------+-----------
 Laptop |         3
 Desk   |         2
 Pen    |         1
(3 rows)
```

### 6) Filtering by array length

You can use `array_length()` in a `WHERE` clause to filter rows based on the number of elements in an array column:

```sql
SELECT name
FROM products
WHERE array_length(tags, 1) >= 2;
```

Output:

```text
  name
--------
 Laptop
 Desk
(2 rows)
```

## Summary

- Use `array_length(array, dimension)` to get the number of elements in a specific array dimension.
- Always pass `1` as the dimension for one-dimensional arrays.
- Returns `NULL` for `NULL` arrays and empty arrays; use [`cardinality()`](postgresql-cardinality) if you need `0` for empty arrays.
