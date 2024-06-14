---
title: Postgres concat() function
subtitle: Concatenate strings in Postgres with the concat() function
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.373Z'
---

The `concat()` function in Postgres is used to concatenate two or more strings into a single string. It is a variadic function, meaning it can accept any number of arguments.

It is useful for combining data from multiple columns, generating custom identifiers or labels, or constructing dynamic SQL statements.

<CTA />

## Function signature

The `concat()` function has two forms:

```sql
concat(str "any" [, str "any" [, ...] ]) → text
```

- `str`: The strings/values to concatenate. Numeric values are automatically converted to strings, while `NULL` values are treated as empty strings.

```sql
concat(variadic str "any"[]) → text
```

- `variadic str`: An array of strings/values to concatenate. This form is useful when you have an array of strings to concatenate.

## Example usage

Consider a table `customers` with `first_name` and `last_name` columns. We can use `concat()` to combine these into a full name.

```sql
WITH customers AS (
  SELECT 'John' AS first_name, 'Doe' AS last_name
  UNION ALL
  SELECT 'Jane' AS first_name, 'Smith' AS last_name
)
SELECT concat(first_name, ' ', last_name) AS full_name
FROM customers;
```

This query concatenates the `first_name`, a space character, and the `last_name` to generate the `full_name`.

```text
  full_name
-------------
 John Doe
 Jane Smith
(2 rows)
```

We can concatenate more than two strings by providing additional arguments.

```sql
WITH products AS (
  SELECT 'Laptop' AS name, 'A' AS variant, 100 AS price
  UNION ALL
  SELECT 'Kindle' AS name, NULL AS variant, 200 AS price
  UNION ALL
  SELECT 'Table' AS name, 'C' AS variant, 300 AS price
)
SELECT concat(name, CASE WHEN variant IS NOT NULL THEN ' - Variant ' ELSE '' END, variant, ' ($', price, ')') AS product_info
FROM products;
```

This query generates a descriptive `product_info` string by concatenating the `name`, `variant`, and `price` columns along with some constant text. We used a `CASE` statement to conditionally include the variant in the output.

```text
       product_info
---------------------------
 Laptop - Variant A ($100)
 Kindle ($200)
 Table - Variant C ($300)
(3 rows)
```

## Advanced examples

### Concatenate an array of strings

You can use the `variadic` form of `concat()` to concatenate an array of strings.

```sql
WITH data AS (
  SELECT ARRAY['apple', 'banana', 'cherry'] AS fruits
)
SELECT concat(variadic fruits) AS fruit_string
FROM data;
```

This query concatenates the elements of the `fruits` array into a single string.

```text
  fruit_string
----------------
 applebananacherry
(1 row)
```

### Concatenate columns to generate custom keys

`concat()` can be used to generate custom identifiers as keys, which you can use for further processing or analysis.

```sql
WITH page_interactions AS (
  SELECT 1 AS user_id, '/home' AS page, '2023-06-01 10:00:00' AS ts
  UNION ALL
  SELECT 1 AS user_id, '/products' AS page, '2023-06-01 10:30:00' AS ts
  UNION ALL
  SELECT 2 AS user_id, '/home' AS page, '2023-06-01 11:00:00' AS ts
  UNION ALL
  SELECT 1 AS user_id, '/home' AS page, '2023-06-01 12:00:00' AS ts
)
SELECT unique_visit, count(*) AS num_interactions
FROM (
    SELECT ts, concat(user_id, ':', page) AS unique_visit
    FROM page_interactions
)
GROUP BY unique_visit;
```

This query generates a unique identifier for each page visit by concatenating the `user_id` and `page` columns. We then count the number of interactions for each unique visit.

```text
 unique_visit | num_interactions
--------------+------------------
 1:/home      |                2
 2:/home      |                1
 1:/products  |                1
(3 rows)
```

## Additional considerations

### Handling NULL values

Any null arguments to `concat()` are treated as empty strings in the output. This is in contrast to the behavior of the `||` operator, which treats `NULL` values as `NULL`.

```sql
SELECT
    concat('Hello', NULL, 'World') AS join_concat,
    'Hello' || NULL || 'World' AS join_operator;
```

Pick the right function based on how you want to handle `NULL` values.

```text
 join_concat | join_operator
-------------+---------------
 HelloWorld  |
(1 row)
```

### Alternative functions

- `concat_ws`: Concatenates strings with a separator string between each element.
- `string_agg`: An aggregation function that combines strings from a column into a single string with a separator.
- `||` operator: Can also be used to concatenate strings. It treats `NULL` values differently than `concat()`.

## Resources

- [PostgreSQL documentation: String functions](https://www.postgresql.org/docs/current/functions-string.html)
