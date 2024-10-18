---
title: 'PostgreSQL Window Functions'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-window-function/
ogImage: ./img/wp-content-uploads-2016-06-products_product_groups_tables.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL window functions to perform the calculation across a set of rows related to the current row.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Setting up sample tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create two tables](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named `products` and `product_groups` for the demonstration:

<!-- /wp:paragraph -->

<!-- wp:image {"id":2268} -->

![](./img/wp-content-uploads-2016-06-products_product_groups_tables.png)

<!-- /wp:image -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE product_groups (
	group_id serial PRIMARY KEY,
	group_name VARCHAR (255) NOT NULL
);

CREATE TABLE products (
	product_id serial PRIMARY KEY,
	product_name VARCHAR (255) NOT NULL,
	price DECIMAL (11, 2),
	group_id INT NOT NULL,
	FOREIGN KEY (group_id) REFERENCES product_groups (group_id)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) some rows into these tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO product_groups (group_name)
VALUES
	('Smartphone'),
	('Laptop'),
	('Tablet');

INSERT INTO products (product_name, group_id,price)
VALUES
	('Microsoft Lumia', 1, 200),
	('HTC One', 1, 400),
	('Nexus', 1, 500),
	('iPhone', 1, 900),
	('HP Elite', 2, 1200),
	('Lenovo Thinkpad', 2, 700),
	('Sony VAIO', 2, 700),
	('Dell Vostro', 2, 800),
	('iPad', 3, 700),
	('Kindle Fire', 3, 150),
	('Samsung Galaxy Tab', 3, 200);
```

<!-- /wp:code -->

<!-- wp:image {"id":4170} -->

![](./img/wp-content-uploads-2019-05-products-table-sample-data.png)

<!-- /wp:image -->

<!-- wp:image {"id":4199} -->

![](./img/wp-content-uploads-2019-05-product_groups-table-data.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Introduction to PostgreSQL window functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

The easiest way to understand the window functions is to start by reviewing the [aggregate functions](https://www.postgresqltutorial.com/postgresql-aggregate-functions/). An aggregate function aggregates data from a set of rows into a single row.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the `AVG()` aggregate function to calculate the average price of all products in the `products` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	AVG (price)
FROM
	products;
```

<!-- /wp:code -->

<!-- wp:image {"id":3660} -->

![PostgreSQL Window Function - AVG function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-AVG-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

To apply the aggregate function to subsets of rows, you use the `GROUP BY` clause. The following example returns the average price for every product group.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	group_name,
	AVG (price)
FROM
	products
INNER JOIN product_groups USING (group_id)
GROUP BY
	group_name;
```

<!-- /wp:code -->

<!-- wp:image {"id":3659} -->

![PostgreSQL Window Function - AVG function with GROUP BY](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-AVG-function-with-GROUP-BY.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

As you see clearly from the output, the `AVG()` function reduces the number of rows returned by the queries in both examples.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Similar to an aggregate function, a window function operates on a set of rows. However, it does not reduce the number of rows returned by the query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The term _window_ describes the set of rows on which the window function operates. A window function returns values from the rows in a window.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For instance, the following query returns the product name, the price, product group name, along with the average prices of each product group.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	price,
	group_name,
	AVG (price) OVER (
	   PARTITION BY group_name
	)
FROM
	products
	INNER JOIN
		product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3661} -->

![](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-AVG-window-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this query, the `AVG()` function works as a _window function_ that operates on a set of rows specified by the `OVER` clause. Each set of rows is called a window.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The new syntax for this query is the `OVER` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
AVG(price) OVER (PARTITION BY group_name)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the `PARTITION BY` distributes the rows of the result set into groups and the `AVG()` function is applied to each group to return the average price for each.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that a window function always performs the calculation on the result set after the `JOIN`, `WHERE`, `GROUP BY` and `HAVING` clause and before the final `ORDER BY` clause in the evaluation order.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL Window Function Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL has a sophisticated [syntax for window function call](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS). The following illustrates the simplified version:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
window_function(arg1, arg2,..) OVER (
   [PARTITION BY partition_expression]
   [ORDER BY sort_expression [ASC | DESC] [NULLS {FIRST | LAST }])
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `window_function(arg1,arg2,...)`

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `window_function` is the name of the window function. Some window functions do not accept any argument.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `PARTITION BY` clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `PARTITION BY` clause divides rows into multiple groups or partitions to which the window function is applied. Like the example above, we used the product group to divide the products into groups (or partitions).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `PARTITION BY` clause is optional. If you skip the `PARTITION BY` clause, the window function will treat the whole result set as a single partition.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `ORDER BY` clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ORDER BY` clause specifies the order of rows in each partition to which the window function is applied.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ORDER BY` clause uses the `NULLS FIRST` or `NULLS LAST` option to specify whether nullable values should be first or last in the result set. The default is `NULLS LAST` option.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### `frame_clause`

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `frame_clause` defines a subset of rows in the current partition to which the window function is applied. This subset of rows is called a frame.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use multiple window functions in a query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    wf1() OVER(PARTITION BY c1 ORDER BY c2),
    wf2() OVER(PARTITION BY c1 ORDER BY c2)
FROM table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

you can use the `WINDOW` clause to shorten the query as shown in the following query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   wf1() OVER w,
   wf2() OVER w,
FROM table_name
WINDOW w AS (PARTITION BY c1 ORDER BY c2);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It is also possible to use the `WINDOW` clause even though you call one window function in a query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT wf1() OVER w
FROM table_name
WINDOW w AS (PARTITION BY c1 ORDER BY c2);
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL window function List

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following table lists all window functions provided by PostgreSQL. Note that some aggregate functions such as `AVG()`, `MIN()`, `MAX()`, `SUM()`, and `COUNT()` can be also used as window functions.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Type a window function name to search...

<!-- /wp:heading -->

<!-- wp:table {"className":"responsive functions"} -->

| Name                                                                                                            | Description                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [CUME_DIST](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-cume_dist-function/)       | Return the relative rank of the current row.                                                                                |
| [DENSE_RANK](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-dense_rank-function/)     | Rank the current row within its partition without gaps.                                                                     |
| [FIRST_VALUE](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-first_value-function/)   | Return a value evaluated against the first row within its partition.                                                        |
| [LAG](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-lag-function/)                   | Return a value evaluated at the row that is at a specified physical offset row before the current row within the partition. |
| [LAST_VALUE](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-last_value-function/)     | Return a value evaluated against the last row within its partition.                                                         |
| [LEAD](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-lead-function/)                 | Return a value evaluated at the row that is `offset`rows after the current row within the partition.                        |
| [NTILE](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-ntile-function/)               | Divide rows in a partition as equally as possible and assign each row an integer starting from 1 to the argument value.     |
| [NTH_VALUE](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-nth_value-function/)       | Return a value evaluated against the nth row in an ordered partition.                                                       |
| [PERCENT_RANK](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-percent_rank-function/) | Return the relative rank of the current row (rank-1) / (total rows - 1)                                                     |
| [RANK](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-rank-function/)                 | Rank the current row within its partition with gaps.                                                                        |
| [ROW_NUMBER](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-row_number/)              | Number the current row within its partition starting from 1.                                                                |

<!-- /wp:table -->

<!-- wp:heading -->

## The `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` functions assign an integer to each row based on its order in its result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ROW_NUMBER()` function assigns a sequential number to each row in each partition. See the following query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	group_name,
	price,
	ROW_NUMBER () OVER (
		PARTITION BY group_name
		ORDER BY
			price
	)
FROM
	products
INNER JOIN product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3658} -->

![PostgreSQL Window Function - ROW_NUMBER function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-ROW_NUMBER-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The `RANK()` function assigns ranking within an ordered partition. If rows have the same values, the `RANK()` function assigns the same rank, with the next ranking(s) skipped.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

See the following query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	group_name,
  price,
	RANK () OVER (
		PARTITION BY group_name
		ORDER BY
			price
	)
FROM
	products
INNER JOIN product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3657} -->

![PostgreSQL Window Function - RANK function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-RANK-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In the laptop product group, both `Dell Vostro` and `Sony VAIO` products have the same price, therefore, they receive the same rank 1. The next row in the group is `HP Elite` that receives the rank 3 because the rank 2 is skipped.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Similar to the `RANK()` function, the `DENSE_RANK()` function assigns a rank to each row within an ordered partition, but the ranks have no gap. In other words, the same ranks are assigned to multiple rows and no ranks are skipped.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	group_name,
	price,
	DENSE_RANK () OVER (
		PARTITION BY group_name
		ORDER BY
			price
	)
FROM
	products
INNER JOIN product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3652} -->

![PostgreSQL Window Function - DENSE_RANK function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-DENSE_RANK-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Within the laptop product group, rank 1 is assigned twice to `Dell Vostro` and `Sony VAIO`. The next rank is 2 assigned to `HP Elite`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## The `FIRST_VALUE` and `LAST_VALUE` functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `FIRST_VALUE()` function returns a value evaluated against the first row within its partition, whereas the `LAST_VALUE()` function returns a value evaluated against the last row in its partition.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement uses the `FIRST_VALUE()` to return the lowest price for every product group.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	group_name,
	price,
	FIRST_VALUE (price) OVER (
		PARTITION BY group_name
		ORDER BY
			price
	) AS lowest_price_per_group
FROM
	products
INNER JOIN product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3653} -->

![PostgreSQL Window Function - FIRST_VALUE function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-FIRST_VALUE-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement uses the `LAST_VALUE()` function to return the highest price for every product group.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	group_name,
	price,
	LAST_VALUE (price) OVER (
		PARTITION BY group_name
		ORDER BY
			price RANGE BETWEEN UNBOUNDED PRECEDING
		AND UNBOUNDED FOLLOWING
	) AS highest_price_per_group
FROM
	products
INNER JOIN product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3655} -->

![PostgreSQL Window Function - LAST_VALUE function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-LAST_VALUE-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Notice that we added the frame clause `RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` because by default the frame clause is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## The `LAG` and `LEAD` functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `LAG()` function has the ability to access data from the previous row, while the `LEAD()` function can access data from the next row.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Both `LAG()` and `LEAD()` functions have the same syntax as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
LAG  (expression [,offset] [,default]) over_clause;
LEAD (expression [,offset] [,default]) over_clause;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- `expression` - a column or expression to compute the returned value.
- `offset` - the number of rows preceding ( `LAG`)/ following ( `LEAD`) the current row. It defaults to 1.
- `default` - the default returned value if the `offset` goes beyond the scope of the window. The `default` is `NULL` if you skip it.

<!-- /wp:list -->

<!-- wp:paragraph -->

The following statement uses the `LAG()` function to return the prices from the previous row and calculates the difference between the price of the current row and the previous row.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	group_name,
	price,
	LAG (price, 1) OVER (
		PARTITION BY group_name
		ORDER BY
			price
	) AS prev_price,
	price - LAG (price, 1) OVER (
		PARTITION BY group_name
		ORDER BY
			price
	) AS cur_prev_diff
FROM
	products
INNER JOIN product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3654} -->

![PostgreSQL Window Function - LAG function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-LAG-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement uses the `LEAD()` function to return the prices from the next row and calculates the difference between the price of the current row and the next row.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	product_name,
	group_name,
	price,
	LEAD (price, 1) OVER (
		PARTITION BY group_name
		ORDER BY
			price
	) AS next_price,
	price - LEAD (price, 1) OVER (
		PARTITION BY group_name
		ORDER BY
			price
	) AS cur_next_diff
FROM
	products
INNER JOIN product_groups USING (group_id);
```

<!-- /wp:code -->

<!-- wp:image {"id":3656} -->

![PostgreSQL Window Function - LEAD function](./img/wp-content-uploads-2018-12-PostgreSQL-Window-Function-LEAD-function.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this tutorial, we have introduced you to the PostgreSQL window functions and shown you some examples of using them to query data.

<!-- /wp:paragraph -->
