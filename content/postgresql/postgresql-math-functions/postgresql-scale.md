---
title: "PostgreSQL SCALE() Function"
page_title: "PostgreSQL SCALE() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL SCALE() function to retrieve the scale of a number."
prev_url: "https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-scale/"
ogImage: ""
updatedOn: "2024-02-17T07:51:05+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL SQRT() Function"
  slug: "postgresql-math-functions/postgresql-sqrt"
next_page: 
  title: "PostgreSQL SIGN() Function"
  slug: "postgresql-math-functions/postgresql-sign"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `SCALE()` function to retrieve the scale of a number.


## Introduction to the PostgreSQL SCALE() function

The scale of a number is the count of decimal digits in its fractional part. For example, the scale of `1.234` is 3 because it has three digits after the decimal point.

The `SCALE()` function allows you to determine the scale of a number.

Here’s the basic syntax of the `SCALE()` function:


```sql
SCALE(numeric_value)
```
The `SCALE()` function returns an integer representing the scale of the `numeric_value`. It returns `NULL` if the `numeric_value` is `NULL`.


## PostgreSQL SCALE() function examples

Let’s explore some examples of using the PostgreSQL `SCALE()` function.


### 1\) Basic SCALE() function example

The following example uses the `SCALE()` function to determine the scale of the number `3.141592653589793`:


```sql
SELECT SCALE(3.141592653589793);
```
Output:


```sql
 scale
-------
    15
(1 row)
```
It returns 15 indicating that there are 15 digits after the decimal point.


### 2\) Using the SCALE() table to examine table data

First, [create a table](../postgresql-tutorial/postgresql-create-table) called `product_prices` to store product prices with various scales:


```sql
CREATE TABLE product_prices (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL
);
```
Second, [insert some data](../postgresql-tutorial/postgresql-insert-multiple-rows) into the table:


```sql
INSERT INTO product_prices (product_name, price) 
VALUES
    ('T-Shirt', 10.123),
    ('Jeans', 20.5678),
    ('Sneakers', 30.45),
    ('Backpack', 40.12345),
    ('Watch', 50.6789),
    ('Sunglasses', 60.1),
    ('Headphones', 70.23456),
    ('Smartphone', 80.123),
    ('Laptop', 90.5),
    ('Camera', 100.1234)
RETURNING *;
```
Output:


```sql
 product_id | product_name |  price
------------+--------------+----------
          1 | T-Shirt      |   10.123
          2 | Jeans        |  20.5678
          3 | Sneakers     |    30.45
          4 | Backpack     | 40.12345
          5 | Watch        |  50.6789
          6 | Sunglasses   |     60.1
          7 | Headphones   | 70.23456
          8 | Smartphone   |   80.123
          9 | Laptop       |     90.5
         10 | Camera       | 100.1234
(10 rows)
```
Third, group the product prices by scales using the `SCALE()` function:


```sql
SELECT 
  scale(price) AS price_scale, 
  COUNT(*) AS count_of_products 
FROM 
  product_prices 
GROUP BY 
  price_scale 
ORDER BY 
  price_scale;
```
Output:


```sql
 price_scale | count_of_products
-------------+-------------------
           1 |                 2
           2 |                 1
           3 |                 2
           4 |                 3
           5 |                 2
(5 rows)
```
By understanding the scales of prices, you can identify the diverse decimal precisions and take appropriate action to standardize them.


## Summary

* Use the `SCALE()` function to retrieve the scale of a number.

