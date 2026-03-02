---
title: 'PostgreSQL array_to_string() Function'
page_title: 'PostgreSQL array_to_string() Function'
page_description: 'Learn how to use the PostgreSQL array_to_string() function to convert an array to a delimited string.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL array_cat() Function'
  slug: 'postgresql-array-functions/postgresql-array_cat'
nextLink:
  title: 'PostgreSQL string_to_array() Function'
  slug: 'postgresql-array-functions/postgresql-string_to_array'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `array_to_string()` function to convert an array to a string with a specified delimiter.

## Introduction to PostgreSQL array_to_string() function

The `array_to_string()` function converts an array to a string by joining its elements with a delimiter. Here's the syntax:

```sql
array_to_string(array, delimiter [, null_string])
```

In this syntax:

- `array` is the input array.
- `delimiter` is the string used to separate array elements in the output.
- `null_string` (optional) is the string to substitute for `NULL` elements. If omitted, `NULL` elements are skipped.

The function returns a `TEXT` value.

`array_to_string()` is the inverse of [`string_to_array()`](postgresql-string_to_array).

## PostgreSQL array_to_string() function examples

### 1) Basic array_to_string() example

The following example joins an integer array into a comma-separated string:

```sql
SELECT array_to_string(ARRAY[1, 2, 3], ',') AS result;
```

Output:

```text
 result
--------
 1,2,3
(1 row)
```

### 2) Using a different delimiter

```sql
SELECT array_to_string(ARRAY['John', 'Jane', 'Bob'], ' | ') AS result;
```

Output:

```text
      result
------------------
 John | Jane | Bob
(1 row)
```

### 3) Handling NULL elements

By default, `NULL` elements are omitted from the output:

```sql
SELECT array_to_string(ARRAY[1, NULL, 3, NULL, 5], ',') AS result;
```

Output:

```text
 result
--------
 1,3,5
(1 row)
```

To include a placeholder for `NULL` elements, provide the optional third argument:

```sql
SELECT array_to_string(ARRAY[1, NULL, 3, NULL, 5], ',', 'N/A') AS result;
```

Output:

```text
    result
--------------
 1,N/A,3,N/A,5
(1 row)
```

### 4) Using array_to_string() with a table column

Suppose you have a `products` table with a `tags` array column:

```sql
CREATE TABLE products (
  id   INT PRIMARY KEY,
  name TEXT,
  tags TEXT[]
);

INSERT INTO products VALUES
  (1, 'Laptop',    ARRAY['electronics', 'computers', 'portable']),
  (2, 'Desk',      ARRAY['furniture', 'office']),
  (3, 'Notebook',  ARRAY['stationery', NULL, 'paper']);
```

Convert each product's tags to a human-readable string:

```sql
SELECT
  name,
  array_to_string(tags, ', ', 'unknown') AS tag_list
FROM products;
```

Output:

```text
   name   |            tag_list
----------+--------------------------------
 Laptop   | electronics, computers, portable
 Desk     | furniture, office
 Notebook | stationery, unknown, paper
(3 rows)
```

### 5) Building CSV output

`array_to_string()` is useful for generating CSV-formatted output:

```sql
SELECT array_to_string(ARRAY[id::text, name, array_to_string(tags, ';')], ',')
FROM products;
```

Output:

```text
                   array_to_string
----------------------------------------------------
 1,Laptop,electronics;computers;portable
 2,Desk,furniture;office
 3,Notebook,stationery;paper
(3 rows)
```

## Summary

- Use `array_to_string(array, delimiter)` to join array elements into a delimited string.
- Provide an optional third argument to substitute a placeholder for `NULL` elements; without it, `NULL` elements are skipped.
- `array_to_string()` is the inverse of [`string_to_array()`](postgresql-string_to_array).
