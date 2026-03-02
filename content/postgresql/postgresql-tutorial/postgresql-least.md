---
title: 'PostgreSQL LEAST() Function'
page_title: 'PostgreSQL LEAST() Function'
page_description: 'Learn how to use the PostgreSQL LEAST() function to return the smallest value from a list of expressions.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL GREATEST() Function'
  slug: 'postgresql-tutorial/postgresql-greatest'
nextLink:
  title: 'PostgreSQL CAST'
  slug: 'postgresql-tutorial/postgresql-cast'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LEAST()` function to return the smallest value from a list of expressions.

## Introduction to PostgreSQL LEAST() function

The `LEAST()` function returns the smallest value from a list of expressions. Here's the syntax:

```sql
LEAST(value1, value2, ...)
```

The `LEAST()` function accepts any number of arguments. The arguments must all be convertible to a common data type, which is the type of the result.

`NULL` values in the list are **ignored**. The result is `NULL` only if all expressions evaluate to `NULL`.

`LEAST()` is the counterpart to the [`GREATEST()`](postgresql-greatest) function. It compares values within a single row across multiple expressions, unlike the [`MIN()`](../postgresql-aggregate-functions/postgresql-min-function) aggregate function which finds the minimum value across multiple rows in a single column.

## PostgreSQL LEAST() function examples

### 1) Basic LEAST() function example

The following example uses the `LEAST()` function to find the smallest value among three numbers:

```sql
SELECT LEAST(10, 3, 7) AS result;
```

Output:

```text
 result
--------
      3
(1 row)
```

### 2) Using LEAST() with strings

The `LEAST()` function works with any comparable data type, including text. When comparing strings, PostgreSQL uses lexicographic ordering:

```sql
SELECT LEAST('apple', 'banana', 'cherry') AS result;
```

Output:

```text
 result
--------
 apple
(1 row)
```

### 3) Using LEAST() with NULL values

The `LEAST()` function ignores `NULL` values. It only returns `NULL` if all arguments are `NULL`:

```sql
SELECT
  LEAST(10, NULL, 7) AS with_some_null,
  LEAST(NULL, NULL)  AS all_null;
```

Output:

```text
 with_some_null | all_null
----------------+----------
              7 |
(1 row)
```

In the first case, `LEAST()` ignores the `NULL` and returns `7`. In the second case, all arguments are `NULL`, so the result is `NULL`.

### 4) Using LEAST() with table columns

A common use case is finding the smallest value across multiple columns in the same row. For example, suppose you have a `delivery_times` table that tracks multiple estimated delivery times:

```sql
CREATE TABLE delivery_times (
  order_id      INT PRIMARY KEY,
  standard_days INT,
  express_days  INT,
  same_day_days INT
);

INSERT INTO delivery_times VALUES
  (101, 5, 2, 1),
  (102, 7, 3, NULL),
  (103, 4, 2, 1);
```

The following query finds the fastest available delivery option for each order:

```sql
SELECT
  order_id,
  LEAST(standard_days, express_days, same_day_days) AS fastest_days
FROM delivery_times;
```

Output:

```text
 order_id | fastest_days
----------+--------------
      101 |            1
      102 |            3
      103 |            1
(3 rows)
```

For order `102`, the same-day option is `NULL` (unavailable), so `LEAST()` ignores it and returns `3` from express delivery.

### 5) Using LEAST() to cap a maximum value

You can use `LEAST()` to cap a value at a maximum. For example, to limit a percentage discount to no more than 50%:

```sql
SELECT
  product_name,
  LEAST(discount_pct, 50) AS capped_discount
FROM products;
```

## Summary

- Use `LEAST(value1, value2, ...)` to return the smallest value from a list of expressions.
- `NULL` values are ignored; the result is `NULL` only if all arguments are `NULL`.
- Use `LEAST()` to compare values across columns in the same row, unlike `MIN()` which aggregates across rows.
