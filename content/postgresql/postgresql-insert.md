---
prevPost: /postgresql/how-to-restart-postgresql-on-ubuntu
nextPost: /postgresql/how-to-restart-postgresql-on-windows
createdAt: 2013-06-02T03:12:31.000Z
title: 'PostgreSQL INSERT'
redirectFrom:
  - /postgresql/postgresql-tutorial/postgresql-insert
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `INSERT` statement to insert a new row into a table.

## Introduction to PostgreSQL INSERT statement

The PostgreSQL `INSERT` statement allows you to insert a new row into a table.

Here's the basic syntax of the `INSERT` statement:

```sql
INSERT INTO table1(column1, column2, …)
VALUES (value1, value2, …);
```

In this syntax:

- First, specify the name of the table (`table1`) that you want to insert data after the `INSERT INTO` keywords and a list of comma-separated columns (`colum1, column2, ....`).
- Second, supply a list of comma-separated values in parentheses `(value1, value2, ...)` after the `VALUES` keyword. The column and value lists must be in the same order.

The `INSERT` statement returns a command tag with the following form:

```sql
INSERT oid count
```

In this syntax:

- The `OID` is an object identifier. PostgreSQL used the `OID` internally as a [primary key](/postgresql/postgresql-primary-key) for its system tables. Typically, the `INSERT` statement returns `OID` with a value of 0.
- The `count` is the number of rows that the `INSERT` statement inserted successfully.

If you insert a new row into a table successfully, the return will typically look like:

```sql
INSERT 0 1
```

### RETURNING clause

The `INSERT` statement has an optional `RETURNING` clause that returns the information of the inserted row.

If you want to return the entire inserted row, you use an asterisk (`*`) after the `RETURNING` keyword:

```sql
INSERT INTO table1(column1, column2, …)
VALUES (value1, value2, …)
RETURNING *;
```

If you want to return some information about the inserted row, you can specify one or more columns after the `RETURNING` clause.

For example, the following statement returns the `id` of the inserted row:

```sql
INSERT INTO table1(column1, column2, …)
VALUES (value1, value2, …)
RETURNING id;
```

To rename the returned value, you use the `AS` keyword followed by the name of the output. For example:

```sql
INSERT INTO table1(column1, column2, …)
VALUES (value1, value2, …)
RETURNING output_expression AS output_name;
```

To insert multiple rows into a table simultaneously, you can use the [INSERT multiple rows statement](/postgresql/postgresql-insert-multiple-rows).

## PostgreSQL INSERT statement examples

The following statement [creates a new table](/postgresql/postgresql-create-table "PostgreSQL CREATE TABLE") called `links` for the demonstration:

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR (255),
  last_update DATE
);
```

Note that you will learn how to [create a new table](/postgresql/postgresql-create-table "PostgreSQL CREATE TABLE") in the subsequent tutorial. In this tutorial, you need to execute it to create a new table.

### 1) Basic PostgreSQL INSERT statement example

The following example uses the `INSERT` statement to insert a new row into the `links` table:

```sql
INSERT INTO links (url, name)
VALUES('https://www.postgresqltutorial.com','PostgreSQL Tutorial');
```

The statement returns the following output:

```sql
INSERT 0 1
```

To insert [character data](/postgresql/postgresql-char-varchar-text), you enclose it in single quotes (') for example `'PostgreSQL Tutorial'`.

If you omit the not null columns in the `INSERT` statement, PostgreSQL will issue an error. But if you omit the null column, PostgreSQL will use the column default value for insertion.

In this example, the `description` is a nullable column because it doesn't have a `NOT NULL` constraint. Therefore, PostgreSQL uses `NULL` to insert into the `description` column.

PostgreSQL automatically generates a sequential number for the [serial column](/postgresql/postgresql-serial) so you do not have to supply a value for the serial column in the `INSERT` statement.

The following `SELECT` statement shows the contents of the `links` table:

```sql
SELECT * FROM links;
```

Output:

```
 id |                url                 |        name         | description | last_update
----+------------------------------------+---------------------+-------------+-------------
  1 | https://www.postgresqltutorial.com | PostgreSQL Tutorial | null        | null
(1 row)
```

### 2) Inserting character string that contains a single quote

If you want to insert a string that contains a single quote (`'`) such as `O'Reilly Media`, you have to use an additional single quote (`'`) to escape it. For example:

```sql
INSERT INTO links (url, name)
VALUES('http://www.oreilly.com','O''Reilly Media');
```

Output:

```sql
INSERT 0 1
```

The following statement verifies the insert:

```sql
SELECT * FROM links;
```

Output:

```
 id |                url                 |        name         | description | last_update
----+------------------------------------+---------------------+-------------+-------------
  1 | https://www.postgresqltutorial.com | PostgreSQL Tutorial | null        | null
  2 | http://www.oreilly.com             | O'Reilly Media      | null        | null
(2 rows)
```

### 3) Inserting a date value

To insert a date into a `DATE` column, you use the date in the format `'YYYY-MM-DD'`.

For example, the following statement inserts a new row with a specified date into the `links` table:

```sql
INSERT INTO links (url, name, last_update)
VALUES('https://www.google.com','Google','2013-06-01');
```

Output:

```sql
INSERT 0 1
```

The following statement retrieves all data from the links table to verify the insert:

```
 id |                url                 |        name         | description | last_update
----+------------------------------------+---------------------+-------------+-------------
  1 | https://www.postgresqltutorial.com | PostgreSQL Tutorial | null        | null
  2 | http://www.oreilly.com             | O'Reilly Media      | null        | null
  3 | https://www.google.com             | Google              | null        | 2013-06-01
(3 rows)
```

### 4) Getting the last inserted ID

To get the last inserted ID from the inserted row, you use the `RETURNING` clause of the `INSERT`statement.

For example, the following statement inserts a new row into the `links` table and returns the last inserted id:

```sql
INSERT INTO links (url, name)
VALUES('https://www.postgresql.org','PostgreSQL')
RETURNING id;
```

Output:

```
 id
----
  4
(1 row)
```

## Summary

- Use PostgreSQL `INSERT` statement to insert a new row into a table.
- Use the `RETURNING` clause to get the inserted rows.
