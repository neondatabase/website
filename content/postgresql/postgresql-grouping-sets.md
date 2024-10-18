---
title: 'PostgreSQL GROUPING SETS'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-grouping-sets/
ogImage: ./img/wp-content-uploads-2020-07-PostgreSQL-Grouping-Sets-GROUPING-function-in-HAVING-clause.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about grouping sets and how to use the PostgreSQL `GROUPING SETS` clause to generate multiple grouping sets in a query.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Setup a sample table

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's get started by [creating a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `sales` for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
    brand VARCHAR NOT NULL,
    segment VARCHAR NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (brand, segment)
);

INSERT INTO sales (brand, segment, quantity)
VALUES
    ('ABC', 'Premium', 100),
    ('ABC', 'Basic', 200),
    ('XYZ', 'Premium', 100),
    ('XYZ', 'Basic', 300)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 brand | segment | quantity
-------+---------+----------
 ABC   | Premium |      100
 ABC   | Basic   |      200
 XYZ   | Premium |      100
 XYZ   | Basic   |      300
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `sales` table stores the number of products sold by brand and segment.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL GROUPING SETS

<!-- /wp:heading -->

<!-- wp:paragraph -->

A grouping set is a set of columns by which you group using the `GROUP BY` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A grouping set is denoted by a comma-separated list of columns placed inside parentheses:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
(column1, column2, ...)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, the following query uses the `GROUP BY` clause to return the number of products sold by brand and segment. In other words, it defines a grouping set of the brand and segment which is denoted by `(brand, segement)`

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand,
    segment;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 brand | segment | sum
-------+---------+-----
 XYZ   | Basic   | 300
 ABC   | Premium | 100
 ABC   | Basic   | 200
 XYZ   | Premium | 100
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following query finds the number of products sold by a brand. It defines a grouping set `(brand)`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    brand,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 brand | sum
-------+-----
 ABC   | 300
 XYZ   | 400
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following query finds the number of products sold by segment. It defines a grouping set `(segment)`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    segment;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 segment | sum
---------+-----
 Basic   | 500
 Premium | 200
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following query finds the number of products sold for all brands and segments. It defines an empty grouping set which is denoted by `()`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT SUM (quantity) FROM sales;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 sum
-----
 700
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Suppose you want to get all the grouping sets using a single query. To achieve this, you can use the `UNION ALL` to combine all the result sets of the queries above.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Because `UNION ALL` requires all result sets to have the same number of columns with compatible data types, you need to adjust the queries by adding `NULL` to the selection list of each as shown below:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand,
    segment

UNION ALL

SELECT
    brand,
    NULL,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand

UNION ALL

SELECT
    NULL,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    segment

UNION ALL

SELECT
    NULL,
    NULL,
    SUM (quantity)
FROM
    sales;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 brand | segment | sum
-------+---------+-----
 XYZ   | Basic   | 300
 ABC   | Premium | 100
 ABC   | Basic   | 200
 XYZ   | Premium | 100
 ABC   | null    | 300
 XYZ   | null    | 400
 null  | Basic   | 500
 null  | Premium | 200
 null  | null    | 700
(9 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This query generated a single result set with the aggregates for all grouping sets.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Even though the above query works as you expected, it has two main problems.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, it is quite lengthy.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, it has a performance issue because PostgreSQL has to scan the `sales` table separately for each query.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

To make it more efficient, PostgreSQL provides the `GROUPING SETS` clause which is the subclause of the `GROUP BY` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `GROUPING SETS` allows you to define multiple grouping sets in the same query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The general syntax of the `GROUPING SETS` is as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    c1,
    c2,
    aggregate_function(c3)
FROM
    table_name
GROUP BY
    GROUPING SETS (
        (c1, c2),
        (c1),
        (c2),
        ()
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, we have four grouping sets `(c1,c2)`, `(c1)`, `(c2)`, and `()`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To apply this syntax to the above example, you can use `GROUPING SETS` clause instead of the `UNION ALL` clause like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    GROUPING SETS (
        (brand, segment),
        (brand),
        (segment),
        ()
    );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 brand | segment | sum
-------+---------+-----
 null  | null    | 700
 XYZ   | Basic   | 300
 ABC   | Premium | 100
 ABC   | Basic   | 200
 XYZ   | Premium | 100
 ABC   | null    | 300
 XYZ   | null    | 400
 null  | Basic   | 500
 null  | Premium | 200
(9 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This query is much shorter and more readable. In addition, PostgreSQL will optimize the number of times it scans the `sales` table and will not scan multiple times.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Grouping function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `GROUPING()` function accepts an argument which can be a column name or an expression:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
GROUPING( column_name | expression)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `column_name` or `expression` must match with the one specified in the `GROUP BY` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `GROUPING()` function returns bit 0 if the argument is a member of the current grouping set and 1 otherwise.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

See the following example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	GROUPING(brand) grouping_brand,
	GROUPING(segment) grouping_segment,
	brand,
	segment,
	SUM (quantity)
FROM
	sales
GROUP BY
	GROUPING SETS (
		(brand),
		(segment),
		()
	)
ORDER BY
	brand,
	segment;
```

<!-- /wp:code -->

<!-- wp:image {"id":5058,"sizeSlug":"full","className":"is-resized"} -->

![PostgreSQL GROUPING SETS - GROUPING function.](https://www.postgresqltutorial.com/wp-content/uploads/2020/07/PostgreSQL-Grouping-Sets-GROUPING-function-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

As shown in the screenshot, when the value in the `grouping_brand` is 0, the `sum` column shows the subtotal of the `brand`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When the value in the `grouping_segment` is zero, the sum column shows the subtotal of the `segment`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

You can use the `GROUPING()` function in the `HAVING` clause to find the subtotal of each brand like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
	GROUPING(brand) grouping_brand,
	GROUPING(segment) grouping_segment,
	brand,
	segment,
	SUM (quantity)
FROM
	sales
GROUP BY
	GROUPING SETS (
		(brand),
		(segment),
		()
	)
HAVING GROUPING(brand) = 0
ORDER BY
	brand,
	segment;
```

<!-- /wp:code -->

<!-- wp:image {"id":5061,"sizeSlug":"full"} -->

![PostgreSQL GROUPING SETS - GROUPING function in HAVING clause](./img/wp-content-uploads-2020-07-PostgreSQL-Grouping-Sets-GROUPING-function-in-HAVING-clause.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `GROUPING SETS` to generate multiple grouping sets.
- <!-- /wp:list-item -->

<!-- /wp:list -->
