---
title: 'PostgreSQL array_cat() Function'
page_title: 'PostgreSQL array_cat() Function'
page_description: 'Learn how to use the PostgreSQL array_cat() function to concatenate two arrays into one.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL array_prepend() Function'
  slug: 'postgresql-array-functions/postgresql-array_prepend'
nextLink:
  title: 'PostgreSQL array_to_string() Function'
  slug: 'postgresql-array-functions/postgresql-array_to_string'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `array_cat()` function to concatenate two arrays.

## Introduction to PostgreSQL array_cat() function

The `array_cat()` function concatenates two arrays into one. Here's the syntax:

```sql
array_cat(array1, array2)
```

In this syntax:

- `array1` is the first array.
- `array2` is the second array.

Both arrays must have compatible element types. The function returns a new array containing all elements from `array1` followed by all elements from `array2`.

You can also use the `||` operator as a shorthand:

```sql
array1 || array2
```

## PostgreSQL array_cat() function examples

### 1) Basic array_cat() example

The following example concatenates two integer arrays:

```sql
SELECT array_cat(ARRAY[1, 2, 3], ARRAY[4, 5, 6]) AS result;
```

Output:

```text
    result
--------------
 {1,2,3,4,5,6}
(1 row)
```

### 2) Concatenating text arrays

```sql
SELECT array_cat(ARRAY['a', 'b'], ARRAY['c', 'd', 'e']) AS result;
```

Output:

```text
    result
--------------
 {a,b,c,d,e}
(1 row)
```

### 3) Using the || operator

The `||` operator is a shorthand for `array_cat()` when both operands are arrays:

```sql
SELECT ARRAY[1, 2] || ARRAY[3, 4] AS result;
```

Output:

```text
  result
----------
 {1,2,3,4}
(1 row)
```

### 4) Handling NULL arrays

If either argument is `NULL`, `array_cat()` returns `NULL`:

```sql
SELECT
  array_cat(ARRAY[1, 2], NULL::int[])   AS first_null,
  array_cat(NULL::int[], ARRAY[3, 4])   AS second_null;
```

Output:

```text
 first_null | second_null
------------+-------------
            |
(1 row)
```

To safely concatenate when one array might be `NULL`, use [`COALESCE()`](../postgresql-tutorial/postgresql-coalesce):

```sql
SELECT array_cat(COALESCE(ARRAY[1, 2], ARRAY[]::int[]), ARRAY[3, 4]) AS result;
```

### 5) Merging tag arrays from two tables

Suppose you have a `products` table and a `promotions` table, each with a `tags` column. You want to combine the tags for matching products:

```sql
CREATE TABLE products (
  id   INT PRIMARY KEY,
  name TEXT,
  tags TEXT[]
);

CREATE TABLE promotions (
  product_id INT,
  promo_tags TEXT[]
);

INSERT INTO products VALUES (1, 'Widget', ARRAY['sale', 'new']);
INSERT INTO promotions VALUES (1, ARRAY['featured', 'homepage']);
```

```sql
SELECT
  p.name,
  array_cat(p.tags, pr.promo_tags) AS all_tags
FROM products p
JOIN promotions pr ON p.id = pr.product_id;
```

Output:

```text
  name  |           all_tags
--------+------------------------------
 Widget | {sale,new,featured,homepage}
(1 row)
```

### 6) Appending to an array column

Use `array_cat()` in an `UPDATE` to append multiple elements at once:

```sql
UPDATE products
SET tags = array_cat(tags, ARRAY['clearance', 'limited'])
WHERE id = 1;
```

## Summary

- Use `array_cat(array1, array2)` to concatenate two arrays of compatible types.
- The `||` operator is equivalent to `array_cat()` when both operands are arrays.
- If either argument is `NULL`, the result is `NULL`; use `COALESCE()` to handle `NULL` arrays safely.
