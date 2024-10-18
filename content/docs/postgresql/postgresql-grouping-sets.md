---
title: 'PostgreSQL GROUPING SETS'
ogImage: /postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Grouping-Sets-GROUPING-function-in-HAVING-clause.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about grouping sets and how to use the PostgreSQL `GROUPING SETS` clause to generate multiple grouping sets in a query.





## Setup a sample table





Let's get started by [creating a new table](/docs/postgresql/postgresql-create-table) called `sales` for the demonstration.





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





Output:





```
 brand | segment | quantity
-------+---------+----------
 ABC   | Premium |      100
 ABC   | Basic   |      200
 XYZ   | Premium |      100
 XYZ   | Basic   |      300
(4 rows)
```





The `sales` table stores the number of products sold by brand and segment.





## Introduction to PostgreSQL GROUPING SETS





A grouping set is a set of columns by which you group using the `GROUP BY` clause.





A grouping set is denoted by a comma-separated list of columns placed inside parentheses:





```
(column1, column2, ...)
```





For example, the following query uses the `GROUP BY` clause to return the number of products sold by brand and segment. In other words, it defines a grouping set of the brand and segment which is denoted by `(brand, segement)`





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





Output:





```
 brand | segment | sum
-------+---------+-----
 XYZ   | Basic   | 300
 ABC   | Premium | 100
 ABC   | Basic   | 200
 XYZ   | Premium | 100
(4 rows)
```





The following query finds the number of products sold by a brand. It defines a grouping set `(brand)`:





```
SELECT
    brand,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand;
```





Output:





```
 brand | sum
-------+-----
 ABC   | 300
 XYZ   | 400
(2 rows)
```





The following query finds the number of products sold by segment. It defines a grouping set `(segment)`:





```
SELECT
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    segment;
```





Output:





```
 segment | sum
---------+-----
 Basic   | 500
 Premium | 200
(2 rows)
```





The following query finds the number of products sold for all brands and segments. It defines an empty grouping set which is denoted by `()`.





```
SELECT SUM (quantity) FROM sales;
```





Output:





```
 sum
-----
 700
(1 row)
```





Suppose you want to get all the grouping sets using a single query. To achieve this, you can use the `UNION ALL` to combine all the result sets of the queries above.





Because `UNION ALL` requires all result sets to have the same number of columns with compatible data types, you need to adjust the queries by adding `NULL` to the selection list of each as shown below:





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





Output:





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





This query generated a single result set with the aggregates for all grouping sets.





Even though the above query works as you expected, it has two main problems.





- 
- First, it is quite lengthy.
- 
-
- 
- Second, it has a performance issue because PostgreSQL has to scan the `sales` table separately for each query.
- 





To make it more efficient, PostgreSQL provides the `GROUPING SETS` clause which is the subclause of the `GROUP BY` clause.





The `GROUPING SETS` allows you to define multiple grouping sets in the same query.





The general syntax of the `GROUPING SETS` is as follows:





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





In this syntax, we have four grouping sets `(c1,c2)`, `(c1)`, `(c2)`, and `()`.





To apply this syntax to the above example, you can use `GROUPING SETS` clause instead of the `UNION ALL` clause like this:





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





Output:





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





This query is much shorter and more readable. In addition, PostgreSQL will optimize the number of times it scans the `sales` table and will not scan multiple times.





## Grouping function





The `GROUPING()` function accepts an argument which can be a column name or an expression:





```
GROUPING( column_name | expression)
```





The `column_name` or `expression` must match with the one specified in the `GROUP BY` clause.





The `GROUPING()` function returns bit 0 if the argument is a member of the current grouping set and 1 otherwise.





See the following example:





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





![PostgreSQL GROUPING SETS - GROUPING function.](https://www.postgresqltutorial.com/wp-content/uploads/2020/07/PostgreSQL-Grouping-Sets-GROUPING-function-1.png)





As shown in the screenshot, when the value in the `grouping_brand` is 0, the `sum` column shows the subtotal of the `brand`.





When the value in the `grouping_segment` is zero, the sum column shows the subtotal of the `segment`.





You can use the `GROUPING()` function in the `HAVING` clause to find the subtotal of each brand like this:





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





![PostgreSQL GROUPING SETS - GROUPING function in HAVING clause](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Grouping-Sets-GROUPING-function-in-HAVING-clause.png)





## Summary





- 
- Use the PostgreSQL `GROUPING SETS` to generate multiple grouping sets.
- 


