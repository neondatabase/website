---
title: 'PostgreSQL cardinality() Function'
page_title: 'PostgreSQL cardinality() Function'
page_description: 'Learn how to use the PostgreSQL cardinality() function to get the total number of elements in an array.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL array_length() Function'
  slug: 'postgresql-array-functions/postgresql-array_length'
nextLink:
  title: 'PostgreSQL array_append() Function'
  slug: 'postgresql-array-functions/postgresql-array_append'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `cardinality()` function to return the total number of elements in an array.

## Introduction to PostgreSQL cardinality() function

The `cardinality()` function returns the total number of elements in an array, counting across all dimensions. Here's the syntax:

```sql
cardinality(array)
```

The function returns an integer. It returns `0` for an empty array and `NULL` if the array is `NULL`.

The key difference between `cardinality()` and [`array_length()`](postgresql-array_length):

| Function               | Empty array | One-dimensional | Multidimensional          |
| ---------------------- | ----------- | --------------- | ------------------------- |
| `cardinality(arr)`     | `0`         | length of array | total element count       |
| `array_length(arr, 1)` | `NULL`      | length of array | length of first dimension |

For one-dimensional arrays, both functions return the same result except for empty arrays.

## PostgreSQL cardinality() function examples

### 1) Basic cardinality() example

The following example returns the total number of elements in a simple integer array:

```sql
SELECT cardinality(ARRAY[10, 20, 30, 40, 50]) AS total;
```

Output:

```text
 total
-------
     5
(1 row)
```

### 2) Empty array vs. NULL array

Unlike `array_length()`, `cardinality()` returns `0` for empty arrays and `NULL` only for `NULL` arrays:

```sql
SELECT
  cardinality(ARRAY[]::int[]) AS empty_array,
  cardinality(NULL::int[])    AS null_array;
```

Output:

```text
 empty_array | null_array
-------------+------------
           0 |
(1 row)
```

This makes `cardinality()` more convenient when you want to check if an array has any elements:

```sql
SELECT cardinality(ARRAY[]::int[]) = 0 AS is_empty;
```

Output:

```text
 is_empty
----------
 t
(1 row)
```

### 3) Multidimensional arrays

For multidimensional arrays, `cardinality()` returns the total number of elements across all dimensions:

```sql
SELECT cardinality('{{1,2,3},{4,5,6}}'::int[]) AS total;
```

Output:

```text
 total
-------
     6
(1 row)
```

This 2×3 array has 6 total elements. Compare this with `array_length()`, which only measures one dimension at a time.

### 4) Using cardinality() with a table column

Suppose you have an `orders` table where each order stores its item IDs as an array:

```sql
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  item_ids INT[]
);

INSERT INTO orders VALUES
  (1, ARRAY[101, 102, 103]),
  (2, ARRAY[201]),
  (3, ARRAY[]::INT[]),
  (4, ARRAY[301, 302]);
```

The following query returns how many items each order has:

```sql
SELECT
  order_id,
  cardinality(item_ids) AS item_count
FROM orders;
```

Output:

```text
 order_id | item_count
----------+------------
        1 |          3
        2 |          1
        3 |          0
        4 |          2
(4 rows)
```

### 5) Filtering for non-empty arrays

Use `cardinality()` in a `WHERE` clause to exclude empty arrays:

```sql
SELECT order_id
FROM orders
WHERE cardinality(item_ids) > 0;
```

Output:

```text
 order_id
----------
        1
        2
        4
(3 rows)
```

## Summary

- Use `cardinality(array)` to get the total number of elements across all array dimensions.
- Returns `0` for empty arrays and `NULL` for `NULL` arrays.
- Prefer `cardinality()` over `array_length()` when you need to handle empty arrays safely, since `array_length()` returns `NULL` for empty arrays.
