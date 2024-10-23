---
title: "PostgreSQL TRIM_SCALE() Function"
page_title: "PostgreSQL TRIM_SCALE() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL TRIM_SCALE() function to reduce the value's scale by removing trailing zeroes."
prev_url: "https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-trim_scale/"
ogImage: ""
updatedOn: "2024-02-18T03:02:25+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL TRUNC() Function"
  slug: "postgresql-math-functions/postgresql-trunc"
nextLink: 
  title: "PostgreSQL WIDTH_BUCKET() Function"
  slug: "postgresql-math-functions/postgresql-width_bucket"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TRIM_SCALE()` function to reduce the value’s scale by removing trailing zeroes.


## Introduction to the PostgreSQL TRIM\_SCALE() function

The `TRIM_SCALE()` function allows you to reduce the scale of a number by removing trailing zeroes.

Note that the scale of a number is a number of fractional decimal digits.

Here’s the syntax of the `TRIM_SCALE()` function:


```csssql
TRIM_SCALE(numeric_value)
```
In this syntax, the `numeric_value` is a value that you want to trim the scale.

The `TRIM_SCALE()` function returns a numeric value with the numeric type after removing trailing zeroes.

It returns `NULL` if the `numeric_value` is `NULL`.


## PostgreSQL TRIM\_SCALE() function examples

Let’s take some examples of using the `TRIM_SCALE()` function.


### 1\) Basic TRIM\_SCALE() function example

The following example uses the `TRIM_SCALE()` function to reduce the trailing zeroes of the number `123.45000`:


```sql
SELECT TRIM_SCALE(123.45000);
```
Output:


```sql
 trim_scale
------------
     123.45
(1 row)
```
In this example, the `TRIM_SCALE()` function removes the trailing zeroes from the `123.45`000, resulting in `123.45`.


### 2\) Using the TRIM\_SCALE() function with table data

We’ll show you an example of using the `TRIM_SCALE()` function to standardize the numeric values in a table.

First, [create a table](../postgresql-tutorial/postgresql-create-table) called `products` to store product data:


```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC NOT NULL
);
```
Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `products` table:


```sql
INSERT INTO products (name, price) 
VALUES
    ('Smartphone', 699.9900),
    ('Laptop', 1299.99),
    ('Headphones', 149.5000),
    ('Tablet', 449.00),
    ('Smartwatch', 299.00),
    ('Wireless Speaker', 79.9900)
RETURNING *;
```
Output:


```sql
 id |       name       |  price
----+------------------+----------
  1 | Smartphone       | 699.9900
  2 | Laptop           |  1299.99
  3 | Headphones       | 149.5000
  4 | Tablet           |   449.00
  5 | Smartwatch       |   299.00
  6 | Wireless Speaker |  79.9900
(6 rows)
```
Third, [update](../postgresql-tutorial/postgresql-update) the prices to remove trailing zeroes using the `TRIM_SCALE()` function:


```sql
UPDATE products
SET price = TRIM_SCALE(price)
RETURNING *;
```
Output:


```sql
 id |       name       |  price
----+------------------+---------
  1 | Smartphone       |  699.99
  2 | Laptop           | 1299.99
  3 | Headphones       |   149.5
  4 | Tablet           |     449
  5 | Smartwatch       |     299
  6 | Wireless Speaker |   79.99
(6 rows)
```

## Summary

* Use the `TRIM_SCALE()` function to reduce the scale of a number scale by removing trailing zeroes.

