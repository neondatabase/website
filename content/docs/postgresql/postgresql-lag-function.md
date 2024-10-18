---
title: 'PostgreSQL LAG Function'
redirectFrom:
            - /docs/postgresql/postgresql-lag 
            - /docs/postgresql/postgresql-window-function/postgresql-lag-function/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LAG()` function to access data of the previous row from the current row.





## Introduction to PostgreSQL LAG() function





PostgreSQL `LAG()` function allows you to access data of the previous row from the current row. It can be very useful for comparing the value of the current row with the value of the previous row.





Here's the basic syntax of the `LAG()` function:





```
LAG(expression [,offset [,default_value]])
OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)
```





In this syntax:





### `expression`





The `expression` is evaluated against the previous row at a specified offset. It can be a column, expression, or [subquery](/docs/postgresql/postgresql-subquery).





The `expression` must return a single value, and cannot be a [window function](https://www.postgresqltutorial.com/postgresql-window-function/).





### `offset`





The `offset` is a positive integer that specifies the number of rows that come before the current row from which to access data. The `offset` can be an expression, subquery, or column. It defaults to 1 if you don't specify it.





### `default_value`





The `LAG()` function will return the `default_value` in case the `offset` goes beyond the scope of the partition. The function will return NULL if you omit the `default_value`.





### PARTITION BY clause





The `PARTITION BY` clause divides rows into partitions to which the `LAG()` function is applied.





By default, the function will treat the whole result set as a single partition if you omit the `PARTITION BY` clause.





### ORDER BY clause





The `ORDER BY` clause specifies the order of the rows in each partition to which the `LAG()` function is applied.





## PostgreSQL LAG() function examples





We'll use the `sales` table from the `LEAD()` function tutorial for the demonstration:





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





Here is the data from the `sales` function:





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





### 1) Using PostgreSQL LAG() function over a result set example





This example uses the `LAG()` function to return the sales amount of the current year and the previous year of the group id 1:





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





Output:





```
 year | amount  | previous_year_sales
------+---------+---------------------
 2018 | 1474.00 |                null
 2019 | 1915.00 |             1474.00
 2020 | 1646.00 |             1915.00
(3 rows)
```





In this example:





- 
- The `WHERE` clause retrieves only the rows with the group id 1.
- 
-
- 
- The `LAG()` function returns the sales amount of the previous year from the current year.
- 





Since the sales table has no data for the year before 2018, the `LAG()` function returns NULL.





### 2) Using PostgreSQL LAG() function over a partition example





The following example uses the `LAG()` function to compare the sales of the current year with the sales of the previous year of each product group:





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





Output:





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





In this example:





- 
- The `PARTITION BY` clause divides the rows into partitions by the group id.
- 
-
- 
- The `ORDER BY` clause sorts rows in each product group by years in ascending order.
- 
-
- 
- The `LAG()` function is applied to each partition to return the sales of the previous year.
- 





## Summary





- 
- Use the PostgreSQL `LAG()` function to access the data of the previous row from the current row.
- 


