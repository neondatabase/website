---
title: "PostgreSQL COUNT Function"
page_title: "PostgreSQL COUNT() Function"
page_description: "You will learn how to use the PostgreSQL COUNT() function to get the number of rows that satisfy a specific condition."
prev_url: "https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-count-function/"
ogImage: "/postgresqltutorial/payment.png"
updatedOn: "2024-01-26T02:50:46+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL AVG Function"
  slug: "postgresql-aggregate-functions/postgresql-avg-function"
nextLink: 
  title: "PostgreSQL MAX Function"
  slug: "postgresql-aggregate-functions/postgresql-max-function"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `COUNT()` function to count the number of rows in a table.


## Introduction to PostgreSQL COUNT() function

The `COUNT()` function is an aggregate function that allows you to obtain the number of rows that match a specific condition.

The following statement illustrates various ways of using the `COUNT()` function.


### COUNT(\*)

The `COUNT(*)` function returns the number of rows returned by a  [`SELECT`](../postgresql-tutorial/postgresql-select) statement, including NULL and duplicates.


```sqlsql
SELECT 
   COUNT(*) 
FROM 
   table_name
WHERE
   condition;
```
When you apply the `COUNT(*)` function to the entire table, PostgreSQL has to scan the whole table sequentially. If you use the `COUNT(*)` function on a big table, the query will be slow. This is related to the PostgreSQL MVCC implementation.

Due to multiple transactions seeing different states of data simultaneously, there is no direct way for `COUNT(*)` function to count across the entire table. Therefore, PostgreSQL must scan all rows.


### COUNT(column)

Similar to the `COUNT(*)` function, the `COUNT(column_name)` function returns the number of rows returned by a `SELECT` clause. However, it does not consider `NULL` values in the `column_name`.


```sql
SELECT 
   COUNT(column_name) 
FROM 
   table_name
WHERE
   condition;
```

### COUNT(DISTINCT column)

In this syntax, the `COUNT(DISTINCT column_name)` returns the number of unique non\-null values in the `column_name`.


```sql
SELECT 
   COUNT(DISTINCT column_name) 
FROM 
   table_name
WHERE
   condition;
```
In practice, you often use the `COUNT()` function with the [`GROUP BY`](../postgresql-tutorial/postgresql-group-by) clause to return the number of items for each group.

For example, you can use the `COUNT()` with the `GROUP BY` clause to return the number of films in each film category.


## PostgreSQL COUNT() function examples

Let’s use the `payment` table in the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration.


![payment](/postgresqltutorial/payment.png)

### 1\) Basic PostgreSQL COUNT(\*) example

The following statement uses the `COUNT(*)` function to return the number of transactions in the `payment` table:


```sql
SELECT
   COUNT(*)
FROM
   payment;
```
Output:


```sql
 count
-------
 14596
(1 row)
```

### 2\) PostgreSQL COUNT(DISTINCT column) example

To get the distinct amounts that customers paid, you use the `COUNT(DISTINCT amount)` function as shown in the following example:


```
SELECT 
  COUNT (DISTINCT amount) 
FROM 
  payment;
```
Output:


```sql
 count
-------
    19
(1 row)
```

### 3\) Using PostgreSQL COUNT() function with GROUP BY clause example

The following example uses the `COUNT()` function with the `GROUP BY` function to return the number of payments of each customer:


```
SELECT 
  customer_id, 
  COUNT (customer_id) 
FROM 
  payment 
GROUP BY 
  customer_id;
```
Output:


```sql
 customer_id | count
-------------+-------
         184 |    20
          87 |    28
         477 |    21
         273 |    28
...
```
If you want to display the customer name instead of id, you can join the payment table with the customer table:


```
SELECT 
  first_name || ' ' || last_name full_name, 
  COUNT (customer_id) 
FROM 
  payment 
INNER JOIN customer USING (customer_id)
GROUP BY 
  customer_id;
```
Output:


```
       full_name       | count
-----------------------+-------
 Vivian Ruiz           |    20
 Wanda Patterson       |    28
 Dan Paine             |    21
 Priscilla Lowe        |    28
...
```

### 4\) Using PostgreSQL COUNT() function with HAVING clause

You can use the `COUNT` function in a  [`HAVING`](../postgresql-tutorial/postgresql-having) clause to apply a specific condition to groups. For example, the following statement finds customers who have made over 40 payments:


```
SELECT 
  first_name || ' ' || last_name full_name, 
  COUNT (customer_id) 
FROM 
  payment 
INNER JOIN customer USING (customer_id)
GROUP BY 
  customer_id
HAVING 
  COUNT (customer_id) > 40
```
Output:


```
  full_name   | count
--------------+-------
 Karl Seal    |    42
 Eleanor Hunt |    45
(2 rows)
```

## Summary

* Use the PostgreSQL `COUNT()` function to return the number of rows in a table.

