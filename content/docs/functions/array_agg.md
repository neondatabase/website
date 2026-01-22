---
title: Postgres array_agg() function
subtitle: Aggregate values into an array
enableTableOfContents: true
updatedOn: '2024-06-28T22:54:53.164Z'
---

The Postges `array_agg()` function collects values from multiple rows into a single array.

It's particularly useful for denormalizing data, creating comma-separated lists, or preparing data for JSON output. For example, you can use it to list all products in a category from a products catalog table or all orders for a customer from an orders table.

<CTA />

## Function signature

The `array_agg()` function has this simple form:

```sql
array_agg(expression) -> anyarray
```

- `expression`: The value to be aggregated into an array. This can be a column or expression of any data type.

```sql
array_agg(expression ORDER BY sort_expression [ASC | DESC] [NULLS { FIRST | LAST }]) -> anyarray
```

- `expression`: The value to be aggregated into an array.
- `ORDER BY`: Specifies the order in which the values should be aggregated.
- `sort_expression`: The expression to sort by.
- `ASC | DESC`: Specifies ascending or descending order (default is ASC).
- `NULLS { FIRST | LAST }`: Specifies whether nulls should be first or last in the ordering (default depends on ASC or DESC).

## Example usage

Consider an `orders` table with columns `order_id`, `product_id`, and `quantity`. You can use `array_agg()` to list all the product IDs for each order.

```sql
WITH orders AS (
  SELECT 1 AS order_id, 101 AS product_id, 2 AS quantity
  UNION ALL SELECT 1, 102, 1
  UNION ALL SELECT 2, 103, 3
  UNION ALL SELECT 2, 104, 1
  UNION ALL SELECT 3, 101, 1
)
SELECT
  order_id,
  array_agg(product_id) AS products
FROM orders
GROUP BY order_id
ORDER BY order_id;
```

This query groups the orders by `order_id` and aggregates the `product_id` values into an array for each order.

```text
 order_id | products
----------+-----------
        1 | {101,102}
        2 | {103,104}
        3 | {101}
(3 rows)
```

## Advanced examples

### Ordered array aggregation

You can specify an order for the elements in the resulting array:

```sql
WITH employees AS (
  SELECT 1 AS emp_id, 'John' AS name, 'SQL' AS skill
  UNION ALL SELECT 1, 'John', 'Python'
  UNION ALL SELECT 1, 'John', 'Java'
  UNION ALL SELECT 2, 'Jane', 'C++'
  UNION ALL SELECT 2, 'Jane', 'Ruby'
)
SELECT
  emp_id,
  name,
  array_agg(skill ORDER BY skill) AS skills
FROM employees
GROUP BY emp_id, name
ORDER BY emp_id;
```

This query aggregates the listed skills for each employee into an alphabetically ordered array.

```text
 emp_id | name |      skills
--------+------+-------------------
      1 | John | {Java,Python,SQL}
      2 | Jane | {C++,Ruby}
(2 rows)
```

### Combining with other aggregate functions

`array_agg()` can be used in combination with other aggregate functions:

```sql
WITH sales(category, product, price, sale_date) AS (
  VALUES
    ('Electronics', 'Laptop', 1200, '2023-01-15'::date),
    ('Electronics', 'Smartphone', 800, '2023-01-20'::date),
    ('Electronics', 'Tablet', 500, '2023-02-10'::date),
    ('Books', 'Novel', 20, '2023-02-05'::date),
    ('Books', 'Textbook', 100, '2023-02-15'::date),
    ('Books', 'Cookbook', 30, '2023-03-01'::date)
)
SELECT
  category,
  array_agg(
    (SELECT product || ': ' || SUM(price)::text
     FROM sales s2
     WHERE s2.category = s1.category AND s2.product = s1.product
     GROUP BY s2.product)
  ) AS product_sales
FROM sales s1
GROUP BY category;
```

This query aggregates products into an array with their total sales, for each category.

```text
  category   |                  product_sales
-------------+--------------------------------------------------
 Electronics | {"Laptop: 1200","Smartphone: 800","Tablet: 500"}
 Books       | {"Novel: 20","Textbook: 100","Cookbook: 30"}
(2 rows)
```

### Using array_agg() with DISTINCT

You can use `DISTINCT` with `array_agg()` to remove duplicates from the output array:

```sql
WITH user_logins AS (
  SELECT 1 AS user_id, 'Chrome' AS browser
  UNION ALL SELECT 1, 'Firefox'
  UNION ALL SELECT 1, 'Chrome'
  UNION ALL SELECT 2, 'Safari'
  UNION ALL SELECT 2, 'Chrome'
)
SELECT
  user_id,
  array_agg(DISTINCT browser ORDER BY browser) AS browsers_used
FROM user_logins
GROUP BY user_id;
```

This query creates an array of the browsers used by each user, without duplicates and in alphabetical order.

```text
 user_id |  browsers_used
---------+------------------
       1 | {Chrome,Firefox}
       2 | {Chrome,Safari}
(2 rows)
```

## Additional considerations

### Performance implications

While `array_agg()` is powerful, it can be memory-intensive for large datasets. The function needs to hold all the aggregated values in memory before creating the final array. For very large result sets, consider using pagination or limiting the number of rows before aggregating.

### NULL handling

By default, `array_agg()` includes NULL values in the resulting array. If you want to exclude NULL values, you can use it in combination with `FILTER`:

```sql
SELECT array_agg(column_name) FILTER (WHERE column_name IS NOT NULL)
FROM table_name;
```

### Alternative functions

- `string_agg()`: Concatenates string values into a single string, separated by a delimiter.
- `json_agg()`: Aggregates values into a JSON array.

## Resources

- [PostgreSQL documentation: Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [PostgreSQL documentation: Array Functions and Operators](https://www.postgresql.org/docs/current/functions-array.html)
