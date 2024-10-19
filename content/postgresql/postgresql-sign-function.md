---
createdAt: 2024-02-17T08:11:33.000Z
title: 'PostgreSQL SIGN() Function'
redirectFrom: 
            - /postgresql/postgresql-sign
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `SIGN()` function to determine the sign of a number.

## Introduction to the PostgreSQL SIGN() function

The `SIGN()` function allows you to determine the sign of a number.

Here's the syntax of the `SIGN()` function:

```sql
SIGN(numeric_value)
```

The `SIGN()` function accepts a numeric value (`numeric_value`) and returns -1 if the value is negative, 0 if the value is zero, and 1 if the value is positive. Additionally, it returns `NULL` if the value is `NULL`.

The `SIGN()` function can be handy when you're working with financial data, performing mathematical calculations, or handling data validation activities.

## PostgreSQL SIGN() function examples

Let's explore some examples of using the `SIGN()` function.

### 1) Basic SIGN() function example

The following example uses the `SIGN()` function to get the sign of various numbers:

```sql
SELECT
  SIGN(-10),
  SIGN(0),
  SIGN(10),
  SIGN(NULL);
```

Output:

```
 sign | sign | sign | sign
------+------+------+------
   -1 |    0 |    1 | null
(1 row)
```

The `SIGN()` returns -1 for -10, 0 for 0, 1 for 10, and `NULL` for `NULL`.

### 2) Using the SIGN() function with table data

First, [create a table](/postgresql/postgresql-create-table) called `sales` to store the sales amount by year:

```sql
CREATE TABLE sales (
    year INTEGER PRIMARY KEY,
    sales_amount NUMERIC NOT NULL
);
```

Second, [insert rows](/postgresql/postgresql-insert-multiple-rows) into the `sales` table:

```sql
INSERT INTO sales (year, sales_amount)
VALUES
    (2013, 10000),
    (2014, 12000),
    (2015, 15000),
    (2016, 15000),
    (2017, 20000),
    (2018, 22000),
    (2019, 22000),
    (2020, 23000),
    (2021, 22000),
    (2022, 24000),
    (2023, 26000)
RETURNING *;
```

Third, compare the sales of a year with the previous year and use the `SIGN()` function to output the sales trend:

```sql
SELECT
    year,
    sales_amount,
    LAG(sales_amount) OVER (ORDER BY year) AS previous_year_sales,
    CASE
        WHEN LAG(sales_amount) OVER (ORDER BY year) IS NULL THEN 'N/A'
        WHEN SIGN(sales_amount - LAG(sales_amount) OVER (ORDER BY year)) = 1 THEN 'up'
        WHEN SIGN(sales_amount - LAG(sales_amount) OVER (ORDER BY year)) = -1 THEN 'down'
        ELSE 'unchanged'
    END AS sales_trend
FROM
    sales;
```

Output:

```
 year | sales_amount | previous_year_sales | sales_trend
------+--------------+---------------------+-------------
 2013 |        10000 |                null | N/A
 2014 |        12000 |               10000 | up
 2015 |        15000 |               12000 | up
 2016 |        15000 |               15000 | unchanged
 2017 |        20000 |               15000 | up
 2018 |        22000 |               20000 | up
 2019 |        22000 |               22000 | unchanged
 2020 |        23000 |               22000 | up
 2021 |        22000 |               23000 | down
 2022 |        24000 |               22000 | up
 2023 |        26000 |               24000 | up
(11 rows)
```

How it works.

- Use the `LAG()` window function to retrieve the `sales_amount` from the previous year utilizing the `ORDER` `BY` year clause to specify the order of rows.
- Use the `CASE` expression to evaluate each row's sales data and assign a corresponding value to the `sales_trend` column.

If you want to reuse the result of the LAG() function, you can use a [common table expression](/postgresql/postgresql-cte):

```sql
WITH sales_data AS (
    SELECT
        year,
        sales_amount,
        LAG(sales_amount) OVER (ORDER BY year) AS previous_year_sales
    FROM
        sales
)
SELECT
    year,
    sales_amount,
    previous_year_sales,
    CASE
        WHEN previous_year_sales IS NULL THEN 'N/A'
        WHEN SIGN(sales_amount - previous_year_sales) = 1 THEN 'up'
        WHEN SIGN(sales_amount - previous_year_sales) = -1 THEN 'down'
        ELSE 'unchanged'
    END AS sales_trend
FROM
    sales_data;
```

## Summary

- Use the `SIGN()` function to determine the sign of a number.
