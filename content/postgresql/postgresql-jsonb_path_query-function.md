---
title: 'PostgreSQL jsonb_path_query() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_path_query/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_path_query()` function to query `JSONB` data using JSON path expressions.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_path_query() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_path_query()` function allows you to query [JSONB](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/) data based on a JSON path expression.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `jsonb_path_query()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_path_query(jsonb_data, path_expression)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `jsonb_data` is the JSONB data that you want to query.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `path_expression` is a JSON path expression that locates values or elements in the JSONB data.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `jsonb_path_query()` function returns JSONB data that matches the specified JSON path expression.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `path_expression` does not locate any element in the `jsonb_data`, the function returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_path_query() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `jsonb_path_query()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Setting up a sample table

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named `products`with a JSONB column names `attributes` to store product attributes:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    attributes JSONB
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO products (name, attributes)
VALUES
    ('Laptop', '{"brand": "Dell", "price": 1200, "specs": {"cpu": "Intel i7", "ram": "16GB"}}'),
    ('Smartphone', '{"brand": "Samsung", "price": 800, "specs": {"os": "Android", "storage": "128GB"}}');
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) A basic jsonb_path_query() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `jsonb_path_query()` function to retrieve the brand and price of all products:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_path_query(attributes, '$.brand') AS brand,
       jsonb_path_query(attributes, '$.price') AS price
FROM products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
   brand   | price
-----------+-------
 "Dell"    | 1200
 "Samsung" | 800
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) More complex JSON path example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `jsonb_path_query()` function to query nested attributes such as retrieving the CPU specification of laptops:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_path_query(attributes, '$.specs.cpu') AS cpu
FROM products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
    cpu
------------
 "Intel i7"
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_path_query()` function to query JSONB data based on JSON path expressions.
- <!-- /wp:list-item -->

<!-- /wp:list -->
