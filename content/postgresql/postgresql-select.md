---
title: 'PostgreSQL SELECT'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/
ogImage: ./img/wp-content-uploads-2020-07-PostgreSQL-Select.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you are going to learn how to use the basic **PostgreSQL SELECT** statement to query data from a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Note that if you don't know how to execute a query against the PostgreSQL database using the **psql** command-line tool or **pgAdmin** GUI tool, you can check [the connection to the PostgreSQL database tutorial](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

One of the most common tasks, when you work with the database, is to retrieve data from tables using the `SELECT` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `SELECT` statement is one of the most complex statements in PostgreSQL. It has many clauses that you can use to form a flexible query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Due to its complexity, we will break it down into many shorter and easy-to-understand tutorials so that you can learn about each clause faster.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `SELECT` statement has the following clauses:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Select distinct rows using `DISTINCT` operator.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Sort rows using `ORDER BY` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Filter rows using `WHERE` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Select a subset of rows from a table using `LIMIT` or `FETCH` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Group rows into groups using `GROUP BY` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Filter groups using `HAVING` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Join with other tables using [joins](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/) such as `INNER JOIN`, `LEFT JOIN`, `FULL OUTER JOIN`, `CROSS JOIN` clauses.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Perform set operations using `UNION`, `INTERSECT`, and `EXCEPT`.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

In this tutorial, you are going to focus on the `SELECT`and `FROM` clauses.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL SELECT statement syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let’s start with the basic form of the `SELECT` statement that retrieves data from a single table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `SELECT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   select_list
FROM
   table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify a select list that can be a column or a list of columns in a table from which you want to retrieve data. If you specify a list of columns, you need to place a comma (`,`) between two columns to separate them. If you want to select data from all the columns of the table, you can use an asterisk (`*`) shorthand instead of specifying all the column names. The select list may also contain expressions or literal values.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide the name of the table from which you want to query data after the `FROM` keyword.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `FROM` clause is optional. If you are not querying data from any table, you can omit the `FROM` clause in the `SELECT` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL evaluates the `FROM` clause before the `SELECT` clause in the `SELECT` statement:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4805,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Select.png)

<!-- /wp:image -->

<!-- wp:paragraph {"className":"note"} -->

Note that the SQL keywords are case-insensitive. It means that `SELECT` is equivalent to `select` or `Select`. By convention, we will use all the SQL keywords in uppercase to make the queries easier to read.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL SELECT examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `SELECT` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

We will use the following `customer` table in the `dvdrental` [sample\*\* \*\*database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/ "PostgreSQL Sample Database") for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4011} -->

![customer table](./img/wp-content-uploads-2019-05-customer.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

First, [connect to the PostgreSQL server](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/) using the `postgres` user:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You'll be prompted to enter a password for the `postgres` user. After entering the password correctly, you will be connected to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
postgres=#
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, switch the current database to dvdrental:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\c dvdrental
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, execute the query in the following examples.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL SELECT statement to query data from one column example

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example uses the `SELECT` statement to find the first names of all customers from the `customer` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT first_name FROM customer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the partial output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 first_name
-------------
 Jared
 Mary
 Patricia
 Linda
 Barbara
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that we added a semicolon (`;`) at the end of the `SELECT` statement. The semicolon is not a part of the SQL statement; rather, it serves as a signal of PostgreSQL indicating the conclusion of an SQL statement. Additionally, semicolons are used to separate two or more SQL statements.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL SELECT statement to query data from multiple columns example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses the `SELECT` statement to retrieve first name, last name, and email of customers from the `customer` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   first_name,
   last_name,
   email
FROM
   customer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Partial output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 first_name  |  last_name   |                  email
-------------+--------------+------------------------------------------
 Jared       | Ely          | jared.ely@sakilacustomer.org
 Mary        | Smith        | mary.smith@sakilacustomer.org
 Patricia    | Johnson      | patricia.johnson@sakilacustomer.org
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows three corresponding columns first_name, last_name, and email.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using PostgreSQL SELECT statement to query data from all columns of a table example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses the `SELECT *` statement to retrieve data from all columns of the `customer` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM customer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Partial output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 customer_id | store_id | first_name  |  last_name   |                  email                   | address_id | activebool | create_date |       last_update       | active
-------------+----------+-------------+--------------+------------------------------------------+------------+------------+-------------+-------------------------+--------
         524 |        1 | Jared       | Ely          | jared.ely@sakilacustomer.org             |        530 | t          | 2006-02-14  | 2013-05-26 14:49:45.738 |      1
           1 |        1 | Mary        | Smith        | mary.smith@sakilacustomer.org            |          5 | t          | 2006-02-14  | 2013-05-26 14:49:45.738 |      1
           2 |        1 | Patricia    | Johnson      | patricia.johnson@sakilacustomer.org      |          6 | t          | 2006-02-14  | 2013-05-26 14:49:45.738 |      1
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we used an asterisk (`*`) in the `SELECT` clause, which serves as a shorthand for all columns.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Instead of listing all columns in the `SELECT` clause individually, we can use the asterisk (`*`) to make the query shorter.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

However, using the asterisk (`*`) in the `SELECT` statement is considered a bad practice when you embed SQL statements in the application code, such as [Python](https://www.postgresqltutorial.com/postgresql-python/), [Java](https://www.postgresqltutorial.com/postgresql-jdbc/), or [PHP](https://www.postgresqltutorial.com/postgresql-php/) for the following reasons:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Database performance. Suppose you have a table with many columns and substantial data, the `SELECT` statement with the asterisk (`*`) shorthand will select data from all the columns of the table, potentially retrieving more data than required for the application.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Application performance. Retrieving unnecessary data from the database increases the traffic between the PostgreSQL server and the application server. Consequently, this can result in slower response times and reduced scalability for your applications.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

For these reasons, it is recommended to explicitly specify the column names in the `SELECT` clause whenever possible. This ensures that only the necessary data is retrieved from the database, contributing to more efficient and optimized queries.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The asterisk (\*) shorthand should be reserved solely for the ad-hoc queries that examine data from the database.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 4) Using PostgreSQL SELECT statement with expressions example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `SELECT` statement to return the full names and emails of all customers from the `customer` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   first_name || ' ' || last_name,
   email
FROM
   customer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
       ?column?        |                  email
-----------------------+------------------------------------------
 Jared Ely             | jared.ely@sakilacustomer.org
 Mary Smith            | mary.smith@sakilacustomer.org
 Patricia Johnson      | patricia.johnson@sakilacustomer.org
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we used the [concatenation operator](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-concat-function/) `||` to concatenate the first name, space, and last name of every customer.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Notice the first column of the output doesn't have a name but `?column?`. To assign a name to a column temporarily in the query, you can use a [column alias](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-column-alias/):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
expression AS column_lias
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The AS keyword is optional. Therefore, you can use a shorter syntax:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
expression column_lias
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, you can assign a column alias full_name to the first column of the query as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
   first_name || ' ' || last_name full_name,
   email
FROM
   customer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
       full_name       |                  email
-----------------------+------------------------------------------
 Jared Ely             | jared.ely@sakilacustomer.org
 Mary Smith            | mary.smith@sakilacustomer.org
 Patricia Johnson      | patricia.johnson@sakilacustomer.org
...
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Using PostgreSQL SELECT statement without a FROM clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `FROM` clause of the `SELECT` statement is optional. Therefore, you can omit it in the SELECT statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Typically, you use the `SELECT` clause with a function to retrieve the function result. For example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT NOW();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we use the `NOW()` function in the `SELECT` statement. It'll return the current date and time of the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `SELECT ... FROM` statement to retrieve data from a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PostgreSQL evaluates the `FROM` clause before the `SELECT` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use a column alias to assign a temporary name to a column or an expression in a query.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- In PostgreSQL, the `FROM` clause is optional.
- <!-- /wp:list-item -->

<!-- /wp:list -->
