---
title: "PostgreSQL PERCENT_RANK Function"
page_title: "PostgreSQL PERCENT_RANK() Function By Practical Examples"
page_description: "In this tutorial, you will learn how to use the PostgreSQL PERCENT_RANK() function to calculate the relative rank of a value within a set of values."
prev_url: "index.html"
ogImage: "/postgresqltutorial/sales_stats-table.png"
updatedOn: "2020-04-11T10:53:00+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL NTH_VALUE Function"
  slug: "postgresql-window-function/postgresql-nth_value-function"
nextLink: 
  title: "PostgreSQL RANK Function"
  slug: "postgresql-window-function/postgresql-rank-function"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `PERCENT_RANK()` function to calculate the relative rank of a value within a set of values.


## Introduction to PostgreSQL PERCENT\_RANK() function

The `PERCENT_RANK()` function is like the `CUME_DIST()` function. The `PERCENT_RANK()` function evaluates the relative standing of a value within a set of values.

The following illustrates the syntax of the `PERCENT_RANK()` function:


```sql
PERCENT_RANK() OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)

```
In this syntax:


### PARTITION BY

The `PARTITION BY` clause divides rows into multiple partitions to which the `PERCENT_RANK()` function is applied.

The `PARTITION BY` clause is optional. If you omit it, the function treats the whole result set as a single partition.


### ORDER BY

The `ORDER BY` clause specifies the order of rows in each partition to which the function is applied.


### Return value

The `PERCENT_RANK()` function returns a result that is greater than 0 and less than or equal to 1\.


```sql
0 < PERCENT_RANK() <= 1

```
The first value always receives a rank of zero. Tie values evaluate to the same cumulative distribution value.


## PostgreSQL PERCENT\_RANK() examples

We will use the `sales_stats` table created in the `CUME_DIST()` function tutorial for the demonstration.


```sql
SELECT 
	year,
	name,
	amount
FROM 
	actual_sales
ORDER BY 
	year, name;
```
![sales_stats table](/postgresqltutorial/sales_stats-table.png)
### 1\) Using PostgreSQL PERCENT\_RANK() function over a result set example

The following example uses the `PERCENT_RANK()` function to calculate the sales percentile of each employee in 2019:


```sql
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
Here is the output:


![PostgreSQL PERCENT_RANK Function Over a Result Set example](/postgresqltutorial/PostgreSQL-PERCENT_RANK-Function-Over-a-Result-Set-example.png)

### 2\) Using PostgreSQL PERCENT\_RANK() function over a partition example

This statement uses the `PERCENT_RANK()` function to calculate the sales amount percentile by sales employees in both 2018 and 2019\.


```sql
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
Here is the output:


![PostgreSQL PERCENT_RANK Function Over a Partition example](/postgresqltutorial/PostgreSQL-PERCENT_RANK-Function-Over-a-Partition-example.png)
In this example:

* The `PARTITION BY`clause distributed the rows in the `sales_stats` table into two partitions, one for 2018 and the other for 2019\.
* The `ORDER BY` clause sorted rows in each partition by sales amount.
* The `PERCENT_RANK()` function is applied to each ordered partition to calculate the percent rank.

In this tutorial, you have learned how to use the PostgreSQL `PERCENT_RANK()` function to calculate the relative rank of a value within a set of values.

