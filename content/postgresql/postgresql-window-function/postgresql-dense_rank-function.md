---
title: "PostgreSQL DENSE_RANK Function"
page_title: "PostgreSQL DENSE_RANK() Function By Practical Examples"
page_description: "In this tutorial, you are going to learn how to use the PostgreSQL DENSE_RANK() function to assign a rank with no gaps to every row in a result set."
prev_url: "index.html"
ogImage: "/postgresqltutorial/PostgreSQL-DENSE_RANK-Function-Sample-Table.png"
updatedOn: "2020-07-10T04:55:06+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL CUME_DIST Function"
  slug: "postgresql-window-function/postgresql-cume_dist-function"
nextLink: 
  title: "PostgreSQL FIRST_VALUE Function"
  slug: "postgresql-window-function/postgresql-first_value-function"
---




**Summary**: in this tutorial, you are going to learn how to use the PostgreSQL `DENSE_RANK()` function to assign a rank to each row within a partition of a result set, with no gaps in ranking values.


## Introduction to PostgreSQL DENSE\_RANK() function

The `DENSE_RANK()` assigns a rank to every row in each partition of a result set. Different from the `RANK()` function, the `DENSE_RANK()` function always returns consecutive rank values.

For each partition, the `DENSE_RANK()` function returns the same rank for the rows which have the same values

The following shows the syntax of the `DENSE_RANK()` function:


```csssql
DENSE_RANK() OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)
```
The `DENSE_RANK()` function is applied to every row in each partition defined by the `PARTITION BY` clause, in the sort order specified by `ORDER BY` clause. It will reset the rank when crossing the partition boundary.

The `PARITION BY` clause is optional. If you skip it, the `DENSE_RANK()` function will treat the whole result set as a single partition.


## PostgreSQL DENSE\_RANK() function demo

First, [create a table](../postgresql-tutorial/postgresql-create-table) named `dense_ranks` that has one column:


```php
CREATE TABLE dense_ranks (
	c VARCHAR(10)
);
```
Second, [insert some rows](../postgresql-tutorial/postgresql-insert) into the `dense_ranks` table:


```
INSERT INTO dense_ranks(c)
VALUES('A'),('A'),('B'),('C'),('C'),('D'),('E');
```
Third, [query data](../postgresql-tutorial/postgresql-select) from the `dense_ranks` table:


```sql
SELECT c from dense_ranks;
```

![](/postgresqltutorial/PostgreSQL-DENSE_RANK-Function-Sample-Table.png)
Fourth, use the `DENSE_RANK()` function to assign a rank to each row in the result set:


```
SELECT
	c,
	DENSE_RANK() OVER (
		ORDER BY c
	) dense_rank_number
FROM
	dense_ranks;
```
Here is the output:

![PostgreSQL DENSE_RANK Function example](/postgresqltutorial/PostgreSQL-DENSE_RANK-Function-example.png)
## PostgreSQL DENSE\_RANK() function examples

We will use the `products` table to demonstrate the `DENSE_RANK()` function.


![](/postgresqltutorial/products_product_groups_tables.png)

![](/postgresqltutorial/products-table-sample-data.png)

### 1\) Using PostgreSQL DENSE\_RANK() function over a result set example

This statement uses the `DENSE_RANK()` function to rank products by list prices:


```
SELECT
	product_id,
	product_name,
	price,
	DENSE_RANK () OVER ( 
		ORDER BY price DESC
	) price_rank 
FROM
	products;
```
Here is the output:


![](/postgresqltutorial/PostgreSQL-DENSE_RANK-Function-over-a-result-set.png)
In this example, we skipped the `PARTITION BY` clause, therefore, the `DENSE_RANK()` function treated the whole result set as a single partition.

The `DENSE_RANK()` function assigned a rank to each product based on the price order from high to low specified by the `ORDER BY` clause.


### 2\) Using PostgreSQL DENSE\_RANK() function over partitions example

The following example assigns a rank to every product in each product group:


```
SELECT
	product_id,
	product_name,
	group_id,
	price,
	DENSE_RANK () OVER ( 
		PARTITION BY group_id
		ORDER BY price DESC
	) price_rank 
FROM
	products;
```
This picture shows the output:


![](/postgresqltutorial/PostgreSQL-DENSE_RANK-Function-over-a-partition.png)
In this example, the `PARTITION BY` clause distributed the products into product groups. The `ORDER BY` clause sorted products in each group by their prices from high to low to which the `DENSE_RANK()` function is applied.


### 3\) Using PostgreSQL DENSE\_RANK() function with a CTE example

The following statement uses the `DENSE_RANK()` function with a CTE to return the most expensive product in each product group:


```
WITH cte AS(
	SELECT
		product_id,
		product_name,
		group_id,
		price,
		DENSE_RANK () OVER ( 
			PARTITION BY group_id
			ORDER BY price DESC
		) price_rank 
	FROM
		products
) 
SELECT 
	product_id, 
	product_name, 
	price
FROM 
	cte
WHERE 
	price_rank = 1;
```

![PostgreSQL DENSE_RANK Function top rows example](/postgresqltutorial/PostgreSQL-DENSE_RANK-Function-top-rows-example.png)
In this tutorial, you have learned how to use the PostgreSQL `DENSE_RANK()` function to calculate a rank to each row within a partition of a result set, with no gaps in rank values.

