---
title: 'PostgreSQL LAG Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-window-function/postgresql-lag-function/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LAG()` function to access data of the previous row from the current row.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL LAG() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL `LAG()` function allows you to access data of the previous row from the current row. It can be very useful for comparing the value of the current row with the value of the previous row.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `LAG()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
LAG(expression [,offset [,default_value]])
OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `expression`

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `expression` is evaluated against the previous row at a specified offset. It can be a column, expression, or [subquery](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-subquery/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `expression` must return a single value, and cannot be a [window function](https://www.postgresqltutorial.com/postgresql-window-function/).

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `offset`

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `offset` is a positive integer that specifies the number of rows that come before the current row from which to access data. The `offset` can be an expression, subquery, or column. It defaults to 1 if you don't specify it.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `default_value`

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `LAG()` function will return the `default_value` in case the `offset` goes beyond the scope of the partition. The function will return NULL if you omit the `default_value`.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### PARTITION BY clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `PARTITION BY` clause divides rows into partitions to which the `LAG()` function is applied.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

By default, the function will treat the whole result set as a single partition if you omit the `PARTITION BY` clause.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### ORDER BY clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ORDER BY` clause specifies the order of the rows in each partition to which the `LAG()` function is applied.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL LAG() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `sales` table from the `LEAD()` function tutorial for the demonstration:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE sales(
	year SMALLINT CHECK(year > 0),
	group_id INT NOT NULL,
	amount DECIMAL(10,2) NOT NULL,
	PRIMARY KEY(year,group_id)
);

INSERT INTO
	sales(year, group_id, amount)
VALUES
	(2018,1,1474),
	(2018,2,1787),
	(2018,3,1760),
	(2019,1,1915),
	(2019,2,1911),
	(2019,3,1118),
	(2020,1,1646),
	(2020,2,1975),
	(2020,3,1516)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the data from the `sales` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 year | group_id | amount
------+----------+---------
 2018 |        1 | 1474.00
 2018 |        2 | 1787.00
 2018 |        3 | 1760.00
 2019 |        1 | 1915.00
 2019 |        2 | 1911.00
 2019 |        3 | 1118.00
 2020 |        1 | 1646.00
 2020 |        2 | 1975.00
 2020 |        3 | 1516.00
(9 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL LAG() function over a result set example

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example uses the `LAG()` function to return the sales amount of the current year and the previous year of the group id 1:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  year,
  amount,
  LAG(amount, 1) OVER (
    ORDER BY
      year
  ) previous_year_sales
FROM
  sales
WHERE group_id = 1;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 year | amount  | previous_year_sales
------+---------+---------------------
 2018 | 1474.00 |                null
 2019 | 1915.00 |             1474.00
 2020 | 1646.00 |             1915.00
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `WHERE` clause retrieves only the rows with the group id 1.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `LAG()` function returns the sales amount of the previous year from the current year.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Since the sales table has no data for the year before 2018, the `LAG()` function returns NULL.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL LAG() function over a partition example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LAG()` function to compare the sales of the current year with the sales of the previous year of each product group:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  year,
  amount,
  group_id,
  LAG(amount, 1) OVER (
    PARTITION BY group_id
    ORDER BY
      year
  ) previous_year_sales
FROM
  sales;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 year | amount  | group_id | previous_year_sales
------+---------+----------+---------------------
 2018 | 1474.00 |        1 |                null
 2019 | 1915.00 |        1 |             1474.00
 2020 | 1646.00 |        1 |             1915.00
 2018 | 1787.00 |        2 |                null
 2019 | 1911.00 |        2 |             1787.00
 2020 | 1975.00 |        2 |             1911.00
 2018 | 1760.00 |        3 |                null
 2019 | 1118.00 |        3 |             1760.00
 2020 | 1516.00 |        3 |             1118.00
(9 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `PARTITION BY` clause divides the rows into partitions by the group id.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `ORDER BY` clause sorts rows in each product group by years in ascending order.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `LAG()` function is applied to each partition to return the sales of the previous year.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `LAG()` function to access the data of the previous row from the current row.
- <!-- /wp:list-item -->

<!-- /wp:list -->
