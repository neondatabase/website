---
title: "PostgreSQL FETCH"
page_title: "PostgreSQL FETCH NEXT n ROWS ONLY OFFSET m ROWS"
page_description: "Use the PostgreSQL FETCH clause to skip a certain number of rows and retrieve a specific number of rows from a query."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-fetch/"
ogImage: "/postgresqltutorial/film_table.png"
updatedOn: "2024-01-17T04:54:54+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL LIMIT"
  slug: "postgresql-tutorial/postgresql-limit"
next_page: 
  title: "PostgreSQL IN"
  slug: "postgresql-tutorial/postgresql-in"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `FETCH` clause to retrieve a portion of rows returned by a query.


## Introduction to PostgreSQL FETCH clause

To skip a certain number of rows and retrieve a specific number of rows, you often use the [`LIMIT`](postgresql-limit) clause in the `SELECT` statement.

The `LIMIT` clause is widely used by many Relational Database Management Systems such as MySQL, H2, and HSQLDB. However, the `LIMIT` clause is not a SQL standard.

To conform with the SQL standard, PostgreSQL supports the `FETCH` clause to skip a certain number of rows and then fetch a specific number of rows.

Note that the `FETCH` clause was introduced as a part of the SQL standard in SQL:2008\.

The following illustrates the syntax of the PostgreSQL `FETCH` clause:


```sql
OFFSET row_to_skip { ROW | ROWS }
FETCH { FIRST | NEXT } [ row_count ] { ROW | ROWS } ONLY
```
In this syntax:

First, specify the number of rows to skip (`row_to_skip`) after the `OFFSET` keyword. The start is an integer that is zero or positive. It defaults to 0, meaning the query will skip no rows.

If the `row_to_skip` is higher than the number of rows in the table, the query will return no rows.

Second, provide the number of rows to retrieve (`row_count`) in the `FETCH` clause. The `row_count` must be an integer 1 or greater. The `row_count` defaults to 1\.

The `ROW` is the synonym for `ROWS`, `FIRST` is the synonym for `NEXT` so you can use them interchangeably.

Because the table stores the rows in an unspecified order, you should always use the `FETCH` clause with the [`ORDER BY`](postgresql-order-by) clause to make the order of rows consistent.

Note that the `OFFSET` clause must come before the `FETCH` clause in SQL:2008\. However, `OFFSET` and `FETCH` clauses can appear in any order in PostgreSQL.


### FETCH vs. LIMIT

The `FETCH` clause is functionally equivalent to the `LIMIT` clause. If you plan to make your application compatible with other database systems, you should use the `FETCH` clause because it follows the standard SQL.


## PostgreSQL FETCH examples

Let’s use the `film` table in the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration.

![Film Table](/postgresqltutorial/film_table.png)The following query uses the `FETCH` clause to select the first film sorted by titles in ascending order:


```sql
SELECT
    film_id,
    title
FROM
    film
ORDER BY
    title 
FETCH FIRST ROW ONLY;
```
Output:


```sql
 film_id |      title
---------+------------------
       1 | Academy Dinosaur
(1 row)
```
It is equivalent to the following query:


```
SELECT
    film_id,
    title
FROM
    film
ORDER BY
    title 
FETCH FIRST 1 ROW ONLY;
```
The following query uses the `FETCH` clause to select the first five films sorted by titles:


```sql
SELECT
    film_id,
    title
FROM
    film
ORDER BY
    title 
FETCH FIRST 5 ROW ONLY;
```
Output:


```sql
 film_id |      title
---------+------------------
       1 | Academy Dinosaur
       2 | Ace Goldfinger
       3 | Adaptation Holes
       4 | Affair Prejudice
       5 | African Egg
(5 rows)
```
The following statement returns the next five films after the first five films sorted by titles:


```
SELECT
    film_id,
    title
FROM
    film
ORDER BY
    title 
OFFSET 5 ROWS 
FETCH FIRST 5 ROW ONLY; 
```
Output:


```
 film_id |      title
---------+------------------
       6 | Agent Truman
       7 | Airplane Sierra
       8 | Airport Pollock
       9 | Alabama Devil
      10 | Aladdin Calendar
(5 rows)
```

## Summary

* Use the PostgreSQL `FETCH` clause to skip a certain number of rows and retrieve a specific number of rows from a query.

