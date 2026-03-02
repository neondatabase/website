---
title: 'PostgreSQL GREATEST() Function'
page_title: 'PostgreSQL GREATEST() Function'
page_description: 'Learn how to use the PostgreSQL GREATEST() function to return the largest value from a list of expressions.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL NULLIF Function'
  slug: 'postgresql-tutorial/postgresql-nullif'
nextLink:
  title: 'PostgreSQL LEAST() Function'
  slug: 'postgresql-tutorial/postgresql-least'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `GREATEST()` function to return the largest value from a list of expressions.

## Introduction to PostgreSQL GREATEST() function

The `GREATEST()` function returns the largest value from a list of expressions. Here's the syntax:

```sql
GREATEST(value1, value2, ...)
```

The `GREATEST()` function accepts any number of arguments. The arguments must all be convertible to a common data type, which is the type of the result.

`NULL` values in the list are **ignored**. The result is `NULL` only if all expressions evaluate to `NULL`.

Note that `GREATEST()` compares values within a single row across multiple expressions. This distinguishes it from the [`MAX()`](../postgresql-aggregate-functions/postgresql-max-function) aggregate function, which finds the maximum value across multiple rows in a single column.

## PostgreSQL GREATEST() function examples

### 1) Basic GREATEST() function example

The following example uses the `GREATEST()` function to find the largest value among three numbers:

```sql
SELECT GREATEST(1, 5, 3) AS result;
```

Output:

```text
 result
--------
      5
(1 row)
```

### 2) Using GREATEST() with strings

The `GREATEST()` function works with any comparable data type, including text. When comparing strings, PostgreSQL uses lexicographic ordering:

```sql
SELECT GREATEST('apple', 'banana', 'cherry') AS result;
```

Output:

```text
 result
--------
 cherry
(1 row)
```

### 3) Using GREATEST() with NULL values

The `GREATEST()` function ignores `NULL` values. It only returns `NULL` if all arguments are `NULL`:

```sql
SELECT
  GREATEST(1, NULL, 3) AS with_some_null,
  GREATEST(NULL, NULL) AS all_null;
```

Output:

```text
 with_some_null | all_null
----------------+----------
              3 |
(1 row)
```

In the first case, `GREATEST()` ignores the `NULL` and returns `3`. In the second case, all arguments are `NULL`, so the result is `NULL`.

### 4) Using GREATEST() with table columns

A common use case is finding the largest value across multiple columns in the same row. For example, suppose you have a `scores` table:

```sql
CREATE TABLE scores (
  student_id INT PRIMARY KEY,
  exam1      INT,
  exam2      INT,
  exam3      INT
);

INSERT INTO scores VALUES
  (1, 85, 90, 78),
  (2, 92, 88, 95),
  (3, 70, 75, 72);
```

The following query finds the highest score across the three exams for each student:

```sql
SELECT
  student_id,
  GREATEST(exam1, exam2, exam3) AS best_score
FROM scores;
```

Output:

```text
 student_id | best_score
------------+------------
          1 |         90
          2 |         95
          3 |         75
(3 rows)
```

### 5) Using GREATEST() to enforce a minimum value

You can use `GREATEST()` to enforce a minimum value. For example, to ensure a discount is never greater than the price, you can cap the final price at zero:

```sql
SELECT
  product_name,
  GREATEST(price - discount, 0) AS final_price
FROM products;
```

## Summary

- Use `GREATEST(value1, value2, ...)` to return the largest value from a list of expressions.
- `NULL` values are ignored; the result is `NULL` only if all arguments are `NULL`.
- Use `GREATEST()` to compare values across columns in the same row, unlike `MAX()` which aggregates across rows.
