---
title: 'PostgreSQL jsonb_path_query() Function'
page_title: 'PostgreSQL jsonb_path_query() Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL jsonb_path_query() function to query JSONB data using JSON path expressions.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_path_query/'
ogImage: ''
updatedOn: '2024-02-23T13:41:27+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL JSON Path'
  slug: 'postgresql-json-functions/postgresql-json-path'
nextLink:
  title: 'PostgreSQL jsonb_path_query_array() Function'
  slug: 'postgresql-json-functions/postgresql-jsonb_path_query_array'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_path_query()` function to query `JSONB` data using JSON path expressions.

## Introduction to the PostgreSQL jsonb_path_query() function

The `jsonb_path_query()` function allows you to query [JSONB](../postgresql-tutorial/postgresql-json) data based on a JSON path expression.

Here’s the basic syntax of the `jsonb_path_query()` function:

```sql
jsonb_path_query(jsonb_data, path_expression)
```

In this syntax:

- `jsonb_data` is the JSONB data that you want to query.
- `path_expression` is a JSON path expression that locates values or elements in the JSONB data.

The `jsonb_path_query()` function returns JSONB data that matches the specified JSON path expression.

If the `path_expression` does not locate any element in the `jsonb_data`, the function returns `NULL`.

## PostgreSQL jsonb_path_query() function example

Let’s take some examples of using the `jsonb_path_query()` function.

### Setting up a sample table

First, [create a table](../postgresql-tutorial/postgresql-create-table) named `products`with a JSONB column names `attributes` to store product attributes:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    attributes JSONB
);
```

Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `products` table:

```sql
INSERT INTO products (name, attributes)
VALUES
    ('Laptop', '{"brand": "Dell", "price": 1200, "specs": {"cpu": "Intel i7", "ram": "16GB"}}'),
    ('Smartphone', '{"brand": "Samsung", "price": 800, "specs": {"os": "Android", "storage": "128GB"}}');
```

### 1\) A basic jsonb_path_query() function example

The following example uses the `jsonb_path_query()` function to retrieve the brand and price of all products:

```sql
SELECT jsonb_path_query(attributes, '$.brand') AS brand,
       jsonb_path_query(attributes, '$.price') AS price
FROM products;
```

Output:

```sql
   brand   | price
-----------+-------
 "Dell"    | 1200
 "Samsung" | 800
(2 rows)
```

### 2\) More complex JSON path example

The following example uses the `jsonb_path_query()` function to query nested attributes such as retrieving the CPU specification of laptops:

```sql
SELECT jsonb_path_query(attributes, '$.specs.cpu') AS cpu
FROM products;
```

Output:

```sql
    cpu
------------
 "Intel i7"
(1 row)
```

## Summary

- Use the `jsonb_path_query()` function to query JSONB data based on JSON path expressions.
