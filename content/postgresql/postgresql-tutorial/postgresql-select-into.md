---
title: "PostgreSQL SELECT INTO"
page_title: "PostgreSQL SELECT INTO Statement by Practical Examples"
page_description: "This tutorial shows you how to use the PostgreSQL SELECT INTO statement to create a new table and fill it with the data returned by a query."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select-into/"
ogImage: "/postgresqltutorial/film_table.png"
updatedOn: "2024-01-24T04:16:44+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL CREATE TABLE"
  slug: "postgresql-tutorial/postgresql-create-table"
next_page: 
  title: "PostgreSQL CREATE TABLE AS"
  slug: "postgresql-tutorial/postgresql-create-table-as"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `SELECT INTO` statement to create a new table from the result set of a query.

If you want to select data into variables, check out the [PL/pgSQL SELECT INTO statement](https://neon.tech/postgresql/plpgsql-select-into/).


## Introduction to PostgreSQL SELECT INTO statement

The PostgreSQL `SELECT INTO` statement [creates a new table](postgresql-create-table) and [inserts data](postgresql-insert) returned from a query into the table.

The new table will have columns with the same names as the columns of the result set of the query. Unlike a regular [`SELECT`](postgresql-select) statement, the `SELECT INTO` statement does not return a result to the client.

Here’s the basic syntax of the PostgreSQL `SELECT INTO` statement:


```sql
SELECT 
  select_list I
INTO [ TEMPORARY | TEMP ] [ TABLE ] new_table_name 
FROM 
  table_name 
WHERE 
  search_condition;
```
To create a new table with the structure and data derived from a result set, you specify the new table name after the `INTO` keyword.

The `TEMP` or `TEMPORARY` keyword is optional; it allows you to create a [temporary table](postgresql-temporary-table) instead.

The `TABLE` keyword is optional, which enhances the clarity of the statement.

The [`WHERE`](postgresql-where) clause allows you to specify a condition that determines which rows from the original tables should be filled into the new table.

Besides the `WHERE` clause, you can use other clauses in the `SELECT` statement for the `SELECT INTO` statement such as [`INNER JOIN`](postgresql-inner-join), [`LEFT JOIN`](postgresql-left-join), [`GROUP BY`](postgresql-group-by), and [`HAVING`](postgresql-having).

Note that you cannot use the [`SELECT INTO`](https://neon.tech/postgresql/plpgsql-select-into/) statement in PL/pgSQL because it interprets the `INTO` clause differently. In this case, you can use the [`CREATE TABLE AS`](postgresql-create-table-as) statement which provides more functionality than the `SELECT INTO` statement.


## PostgreSQL SELECT INTO examples

We will use the `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration.

![PostgreSQL SELECT INTO sample table](/postgresqltutorial/film_table.png)
### 1\) Basic PostgreSQL SELECT INTO statement example

The following statement uses the `SELECT INTO` statement to create a new table called `film_r` that contains films with the rating `R` and rental duration 5 days from the `film` table.


```sql
SELECT
    film_id,
    title,
    rental_rate
INTO TABLE film_r
FROM
    film
WHERE
    rating = 'R'
AND rental_duration = 5
ORDER BY
    title;
```
To verify the table creation, you can query data from the `film_r` table:


```sql
SELECT * FROM film_r;
```

![](/postgresqltutorial/PostgreSQL-Select-Into-Example.png)

### 2\) Using the SELECT INTO statement to create a new temporary table

The following example uses the `SELECT INTO` statement to create a temporary table named `short_film` that contains films whose lengths are under 60 minutes.


```sql
SELECT
    film_id,
    title,
    length 
INTO TEMP TABLE short_film
FROM
    film
WHERE
    length < 60
ORDER BY
    title;
```
The following shows the data from the `short_film` table:


```sql
SELECT * FROM short_film
ORDER BY length DESC;
```
Output:


```
 film_id |        title         | length
---------+----------------------+--------
     486 | Jet Neighbors        |     59
     465 | Interview Liaisons   |     59
     409 | Heartbreakers Bright |     59
     947 | Vision Torque        |     59
...
```

## Summary

* Use the PostgreSQL `SELECT INTO` statement to create a new table from the result set of a query.

