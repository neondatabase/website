---
title: 'PostgreSQL SELECT'
redirectFrom:
   - /docs/postgresql/postgresql-tutorial/postgresql-select
ogImage: /postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Select.png
tableOfContents: true
---


**Summary**: in this tutorial, you are going to learn how to use the basic **PostgreSQL SELECT** statement to query data from a table.

Note that if you don't know how to execute a query against the PostgreSQL database using the **psql** command-line tool or **pgAdmin** GUI tool, you can check [the connection to the PostgreSQL database tutorial](/docs/postgresql/postgresql-getting-started/connect-to-postgresql-database).

One of the most common tasks, when you work with the database, is to retrieve data from tables using the `SELECT` statement.

The `SELECT` statement is one of the most complex statements in PostgreSQL. It has many clauses that you can use to form a flexible query.

Due to its complexity, we will break it down into many shorter and easy-to-understand tutorials so that you can learn about each clause faster.

The `SELECT` statement has the following clauses:

- Select distinct rows using `DISTINCT` operator.
-
- Sort rows using `ORDER BY` clause.
-
- Filter rows using `WHERE` clause.
-
- Select a subset of rows from a table using `LIMIT` or `FETCH` clause.
-
- Group rows into groups using `GROUP BY` clause.
-
- Filter groups using `HAVING` clause.
-
- Join with other tables using [joins](/docs/postgresql/postgresql-joins) such as `INNER JOIN`, `LEFT JOIN`, `FULL OUTER JOIN`, `CROSS JOIN` clauses.
-
- Perform set operations using `UNION`, `INTERSECT`, and `EXCEPT`.

In this tutorial, you are going to focus on the `SELECT`and `FROM` clauses.

## PostgreSQL SELECT statement syntax

Let’s start with the basic form of the `SELECT` statement that retrieves data from a single table.

The following illustrates the syntax of the `SELECT` statement:

```
SELECT
   select_list
FROM
   table_name;
```

In this syntax:

- First, specify a select list that can be a column or a list of columns in a table from which you want to retrieve data. If you specify a list of columns, you need to place a comma (`,`) between two columns to separate them. If you want to select data from all the columns of the table, you can use an asterisk (`*`) shorthand instead of specifying all the column names. The select list may also contain expressions or literal values.
-
- Second, provide the name of the table from which you want to query data after the `FROM` keyword.

The `FROM` clause is optional. If you are not querying data from any table, you can omit the `FROM` clause in the `SELECT` statement.

PostgreSQL evaluates the `FROM` clause before the `SELECT` clause in the `SELECT` statement:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Select.png)

Note that the SQL keywords are case-insensitive. It means that `SELECT` is equivalent to `select` or `Select`. By convention, we will use all the SQL keywords in uppercase to make the queries easier to read.

## PostgreSQL SELECT examples

Let's explore some examples of using the `SELECT` statement.

We will use the following `customer` table in the `dvdrental` [sample\*\* \*\*database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration.

![customer table](/postgresqltutorial_data/wp-content-uploads-2019-05-customer.png)

First, [connect to the PostgreSQL server](/docs/postgresql/postgresql-getting-started/connect-to-postgresql-database) using the `postgres` user:

```
psql -U postgres
```

You'll be prompted to enter a password for the `postgres` user. After entering the password correctly, you will be connected to the PostgreSQL server:

```
postgres=#
```

Second, switch the current database to dvdrental:

```
\c dvdrental
```

Third, execute the query in the following examples.

### 1) Using PostgreSQL SELECT statement to query data from one column example

This example uses the `SELECT` statement to find the first names of all customers from the `customer` table:

```
SELECT first_name FROM customer;
```

Here is the partial output:

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

Notice that we added a semicolon (`;`) at the end of the `SELECT` statement. The semicolon is not a part of the SQL statement; rather, it serves as a signal of PostgreSQL indicating the conclusion of an SQL statement. Additionally, semicolons are used to separate two or more SQL statements.

### 2) Using PostgreSQL SELECT statement to query data from multiple columns example

The following query uses the `SELECT` statement to retrieve first name, last name, and email of customers from the `customer` table:

```
SELECT
   first_name,
   last_name,
   email
FROM
   customer;
```

Partial output:

```
 first_name  |  last_name   |                  email
-------------+--------------+------------------------------------------
 Jared       | Ely          | jared.ely@sakilacustomer.org
 Mary        | Smith        | mary.smith@sakilacustomer.org
 Patricia    | Johnson      | patricia.johnson@sakilacustomer.org
...
```

The output shows three corresponding columns first_name, last_name, and email.

### 3) Using PostgreSQL SELECT statement to query data from all columns of a table example

The following query uses the `SELECT *` statement to retrieve data from all columns of the `customer` table:

```
SELECT * FROM customer;
```

Partial output:

```
 customer_id | store_id | first_name  |  last_name   |                  email                   | address_id | activebool | create_date |       last_update       | active
-------------+----------+-------------+--------------+------------------------------------------+------------+------------+-------------+-------------------------+--------
         524 |        1 | Jared       | Ely          | jared.ely@sakilacustomer.org             |        530 | t          | 2006-02-14  | 2013-05-26 14:49:45.738 |      1
           1 |        1 | Mary        | Smith        | mary.smith@sakilacustomer.org            |          5 | t          | 2006-02-14  | 2013-05-26 14:49:45.738 |      1
           2 |        1 | Patricia    | Johnson      | patricia.johnson@sakilacustomer.org      |          6 | t          | 2006-02-14  | 2013-05-26 14:49:45.738 |      1
...
```

In this example, we used an asterisk (`*`) in the `SELECT` clause, which serves as a shorthand for all columns.

Instead of listing all columns in the `SELECT` clause individually, we can use the asterisk (`*`) to make the query shorter.

However, using the asterisk (`*`) in the `SELECT` statement is considered a bad practice when you embed SQL statements in the application code, such as [Python](/docs/postgresql/postgresql-python), [Java](/docs/postgresql/postgresql-jdbc), or [PHP](/docs/postgresql/postgresql-php) for the following reasons:

- Database performance. Suppose you have a table with many columns and substantial data, the `SELECT` statement with the asterisk (`*`) shorthand will select data from all the columns of the table, potentially retrieving more data than required for the application.
-
- Application performance. Retrieving unnecessary data from the database increases the traffic between the PostgreSQL server and the application server. Consequently, this can result in slower response times and reduced scalability for your applications.

For these reasons, it is recommended to explicitly specify the column names in the `SELECT` clause whenever possible. This ensures that only the necessary data is retrieved from the database, contributing to more efficient and optimized queries.

The asterisk (\*) shorthand should be reserved solely for the ad-hoc queries that examine data from the database.

### 4) Using PostgreSQL SELECT statement with expressions example

The following example uses the `SELECT` statement to return the full names and emails of all customers from the `customer` table:

```
SELECT
   first_name || ' ' || last_name,
   email
FROM
   customer;
```

Output:

```
       ?column?        |                  email
-----------------------+------------------------------------------
 Jared Ely             | jared.ely@sakilacustomer.org
 Mary Smith            | mary.smith@sakilacustomer.org
 Patricia Johnson      | patricia.johnson@sakilacustomer.org
...
```

In this example, we used the [concatenation operator](/docs/postgresql/postgresql-string-functions/postgresql-concat-function) `||` to concatenate the first name, space, and last name of every customer.

Notice the first column of the output doesn't have a name but `?column?`. To assign a name to a column temporarily in the query, you can use a [column alias](/docs/postgresql/postgresql-column-alias):

```
expression AS column_lias
```

The AS keyword is optional. Therefore, you can use a shorter syntax:

```
expression column_lias
```

For example, you can assign a column alias full_name to the first column of the query as follows:

```
SELECT
   first_name || ' ' || last_name full_name,
   email
FROM
   customer;
```

Output:

```
       full_name       |                  email
-----------------------+------------------------------------------
 Jared Ely             | jared.ely@sakilacustomer.org
 Mary Smith            | mary.smith@sakilacustomer.org
 Patricia Johnson      | patricia.johnson@sakilacustomer.org
...
```

### 5) Using PostgreSQL SELECT statement without a FROM clause

The `FROM` clause of the `SELECT` statement is optional. Therefore, you can omit it in the SELECT statement.

Typically, you use the `SELECT` clause with a function to retrieve the function result. For example:

```
SELECT NOW();
```

In this example, we use the `NOW()` function in the `SELECT` statement. It'll return the current date and time of the PostgreSQL server.

## Summary

- Use the `SELECT ... FROM` statement to retrieve data from a table.
-
- PostgreSQL evaluates the `FROM` clause before the `SELECT` clause.
-
- Use a column alias to assign a temporary name to a column or an expression in a query.
-
- In PostgreSQL, the `FROM` clause is optional.
