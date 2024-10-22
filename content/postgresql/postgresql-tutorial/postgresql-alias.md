---
title: "PostgreSQL Table Aliases"
page_title: "PostgreSQL Table Aliases"
page_description: "This tutorial shows you how to use a table alias to assign a temporary name to a table during the query execution."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alias/"
ogImage: ""
updatedOn: "2024-01-17T06:08:13+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Joins"
  slug: "postgresql-tutorial/postgresql-joins"
next_page: 
  title: "PostgreSQL INNER JOIN"
  slug: "postgresql-tutorial/postgresql-inner-join"
---




**Summary**: in this tutorial, you will learn about the PostgreSQL table aliases and their practical applications.


## Introduction to the PostgreSQL table aliases

A table alias is a feature in SQL that allows you to assign a temporary name to a table during the execution of a query.

The following illustrates the syntax of defining a table alias:


```csssql
table_name AS alias_name
```
In this syntax:

* `table_name`: Specify the name of the table that you want to give an alias.
* `alias_name`: Provide the alias for the table.

Like [column aliases](postgresql-column-alias), the `AS` keyword is optional, meaning that you can omit it like this:


```sql
table_name alias_name
```

## PostgreSQL table alias examples

Let’s take some examples of using table aliases.


### 1\) Basic PostgreSQL table alias example

The following example uses a table alias to retrieve five titles from the `film` table:


```
SELECT f.title
FROM film AS f
ORDER BY f.title
LIMIT 5;
```
Output:


```sql
      title
------------------
 Academy Dinosaur
 Ace Goldfinger
 Adaptation Holes
 Affair Prejudice
 African Egg
(5 rows)
```
In this example, we assign the `film` table an alias `f` and use the table alias to fully qualify the `title` column.

Since the `AS` keyword is optional, you can remove it as follows:


```
SELECT f.title
FROM film f
ORDER BY f.title
LIMIT 5;
```

### 2\) Using table aliases in join clauses

Typically, you use table aliases in a query that has a [join](postgresql-joins) clause to retrieve data from multiple related tables that share the same column name.

If you use the same column name that comes from multiple tables in the same query without fully qualifying them, you will get an error.

To avoid this error, you can qualify the columns using the following syntax:


```sql
table_name.column_name
```
If the table has an alias, you can qualify its column using the alias:


```css
alias.column_name
```
For example, the following query uses an [`INNER JOIN`](postgresql-inner-join) clause to retrieve data from the `customer` and `payment` tables:


```
SELECT 
  c.customer_id, 
  c.first_name, 
  p.amount, 
  p.payment_date 
FROM 
  customer c 
  INNER JOIN payment p ON p.customer_id = c.customer_id 
ORDER BY 
  p.payment_date DESC;
```
Output:


```sql
 customer_id | first_name  | amount |        payment_date
-------------+-------------+--------+----------------------------
          94 | Norma       |   4.99 | 2007-05-14 13:44:29.996577
         264 | Gwendolyn   |   2.99 | 2007-05-14 13:44:29.996577
         263 | Hilda       |   0.99 | 2007-05-14 13:44:29.996577
         252 | Mattie      |   4.99 | 2007-05-14 13:44:29.996577
```
Note that you’ll learn about [INNER JOIN](postgresql-inner-join) in the upcoming tutorial.


### 3\) Using table aliases in self\-join

When you join a table to itself (a.k.a [self\-join](postgresql-self-join)), you need to use table aliases. This is because referencing the same table multiple times within a query will result in an error.

The following example shows how to reference the `film` table twice in the same query using the table aliases:


```
SELECT
    f1.title,
    f2.title,
    f1.length
FROM
    film f1
INNER JOIN film f2 
    ON f1.film_id <> f2.film_id AND 
       f1.length = f2.length;
```
Output:


```
            title            |            title            | length
-----------------------------+-----------------------------+--------
 Chamber Italian             | Resurrection Silverado      |    117
 Chamber Italian             | Magic Mallrats              |    117
 Chamber Italian             | Graffiti Love               |    117
 Chamber Italian             | Affair Prejudice            |    117
 Grosse Wonderful            | Hurricane Affair            |     49
 Grosse Wonderful            | Hook Chariots               |     49
 Grosse Wonderful            | Heavenly Gun                |     49
 Grosse Wonderful            | Doors President             |     49
...
```
Note that you’ll learn about [self\-join](postgresql-inner-join) in the upcoming tutorial.


## Summary

* Use PostgreSQL table aliases to assign a temporary name to a table during the execution of a query.

