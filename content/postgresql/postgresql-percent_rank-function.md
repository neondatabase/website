---
title: 'PostgreSQL PERCENT_RANK Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-window-function/postgresql-percent_rank-function/
ogImage: ./img/wp-content-uploads-2019-05-sales_stats-table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `PERCENT_RANK()` function to calculate the relative rank of a value within a set of values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL `PERCENT_RANK()` function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `PERCENT_RANK()` function is like the `CUME_DIST()` function. The `PERCENT_RANK()` function evaluates the relative standing of a value within a set of values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `PERCENT_RANK()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
PERCENT_RANK() OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `PARTITION BY`

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `PARTITION BY` clause divides rows into multiple partitions to which the `PERCENT_RANK()` function is applied.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `PARTITION BY` clause is optional. If you omit it, the function treats the whole result set as a single partition.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `ORDER BY`

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ORDER BY` clause specifies the order of rows in each partition to which the function is applied.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Return value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `PERCENT_RANK()` function returns a result that is greater than 0 and less than or equal to 1.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
0 < PERCENT_RANK() <= 1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The first value always receives a rank of zero. Tie values evaluate to the same cumulative distribution value.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL `PERCENT_RANK()` examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `sales_stats` table created in the `CUME_DIST()` function tutorial for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	year,
	name,
	amount
FROM
	actual_sales
ORDER BY
	year, name;
```

<!-- /wp:code -->

<!-- wp:image {"id":4249} -->

![sales_stats table](./img/wp-content-uploads-2019-05-sales_stats-table.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL `PERCENT_RANK()` function over a result set example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `PERCENT_RANK()` function to calculate the sales percentile of each employee in 2019:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    name,
	amount,
    PERCENT_RANK() OVER (
        ORDER BY amount
    )
FROM
    sales_stats
WHERE
    year = 2019;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4247} -->

![PostgreSQL PERCENT_RANK Function Over a Result Set example](./img/wp-content-uploads-2019-05-PostgreSQL-PERCENT_RANK-Function-Over-a-Result-Set-example.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL `PERCENT_RANK()` function over a partition example

<!-- /wp:heading -->

<!-- wp:paragraph -->

This statement uses the `PERCENT_RANK()` function to calculate the sales amount percentile by sales employees in both 2018 and 2019.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    name,
	amount,
    PERCENT_RANK() OVER (
		PARTITION BY year
        ORDER BY amount
    )
FROM
    sales_stats;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4248} -->

![PostgreSQL PERCENT_RANK Function Over a Partition example](./img/wp-content-uploads-2019-05-PostgreSQL-PERCENT_RANK-Function-Over-a-Partition-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this example:

<!-- /wp:paragraph -->

<!-- wp:list -->

- The `PARTITION BY`clause distributed the rows in the `sales_stats` table into two partitions, one for 2018 and the other for 2019.
- The `ORDER BY` clause sorted rows in each partition by sales amount.
- The `PERCENT_RANK()` function is applied to each ordered partition to calculate the percent rank.

<!-- /wp:list -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to use the PostgreSQL `PERCENT_RANK()` function to calculate the relative rank of a value within a set of values.

<!-- /wp:paragraph -->
