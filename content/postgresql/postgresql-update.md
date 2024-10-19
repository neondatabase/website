---
prevPost: /postgresql/how-to-kill-a-process-specified-by-pid-in-postgresql
nextPost: /postgresql/postgresql-update-join
createdAt: 2013-06-02T05:40:05.000Z
title: 'PostgreSQL UPDATE'
redirectFrom:
  - /postgresql/postgresql-tutorial/postgresql-update
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `UPDATE` statement to update existing data in a table.

## Introduction to the PostgreSQL UPDATE statement

The PostgreSQL `UPDATE` statement allows you to update data in one or more columns of one or more rows in a table.

Here's the basic syntax of the `UPDATE` statement:

```sql
UPDATE table_name
SET column1 = value1,
    column2 = value2,
    ...
WHERE condition;
```

In this syntax:

- First, specify the name of the table that you want to update data after the `UPDATE` keyword.
-
- Second, specify columns and their new values after `SET` keyword. The columns that do not appear in the `SET` clause retain their original values.
-
- Third, determine which rows to update in the condition of the [`WHERE`](/postgresql/postgresql-where) clause.

The `WHERE` clause is optional. If you omit the `WHERE` clause, the `UPDATE` statement will update all rows in the table.

When the `UPDATE` statement is executed successfully, it returns the following command tag:

```sql
UPDATE count
```

The `count` is the number of rows updated including rows whose values did not change.

### Returning updated rows

The `UPDATE` statement has an optional `RETURNING` clause that returns the updated rows:

```sql
UPDATE table_name
SET column1 = value1,
    column2 = value2,
    ...
WHERE condition
RETURNING * | output_expression AS output_name;
```

## PostgreSQL UPDATE examples

Let's take some examples of using the PostgreSQL `UPDATE` statement.

### Setting up a sample table

The following statements [create a table](/postgresql/postgresql-create-table) called `courses` and [insert](/postgresql/postgresql-tutorial/postgresql-insert) data into it:

```sql
CREATE TABLE courses(
  course_id serial PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description VARCHAR(500),
  published_date date
);


INSERT INTO courses( course_name, price, description, published_date)
VALUES
('PostgreSQL for Developers', 299.99, 'A complete PostgreSQL for Developers', '2020-07-13'),
('PostgreSQL Admininstration', 349.99, 'A PostgreSQL Guide for DBA', NULL),
('PostgreSQL High Performance', 549.99, NULL, NULL),
('PostgreSQL Bootcamp', 777.99, 'Learn PostgreSQL via Bootcamp', '2013-07-11'),
('Mastering PostgreSQL', 999.98, 'Mastering PostgreSQL in 21 Days', '2012-06-30');

SELECT * FROM courses;
```

Output:

```
 course_id |         course_name         | price  |             description              | published_date
-----------+-----------------------------+--------+--------------------------------------+----------------
         1 | PostgreSQL for Developers   | 299.99 | A complete PostgreSQL for Developers | 2020-07-13
         2 | PostgreSQL Admininstration  | 349.99 | A PostgreSQL Guide for DBA           | null
         3 | PostgreSQL High Performance | 549.99 | null                                 | null
         4 | PostgreSQL Bootcamp         | 777.99 | Learn PostgreSQL via Bootcamp        | 2013-07-11
         5 | Mastering PostgreSQL        | 999.98 | Mastering PostgreSQL in 21 Days      | 2012-06-30
(5 rows)
```

### 1) Basic PostgreSQL UPDATE example

The following statement uses the `UPDATE` statement to update the course with id 3 by changing the `published_date` to `'2020-08-01'`.

```sql
UPDATE courses
SET published_date = '2020-08-01'
WHERE course_id = 3;
```

The statement returns the following message indicating that one row has been updated:

```sql
UPDATE 1
```

The following statement retrieves the course with id 3 to verify the update:

```sql
SELECT course_id, course_name, published_date
FROM courses
WHERE course_id = 3;
```

Output:

```
 course_id |         course_name         | published_date
-----------+-----------------------------+----------------
         3 | PostgreSQL High Performance | 2020-08-01
(1 row)
```

### 2) Updating a row and returning the updated row

The following statement uses the `UPDATE` statement update `published_date` of the course id 2 to `2020-07-01` and returns the updated course.

```sql
UPDATE courses
SET published_date = '2020-07-01'
WHERE course_id = 2
RETURNING *;
```

Output:

```
 course_id |        course_name         | price  |        description         | published_date
-----------+----------------------------+--------+----------------------------+----------------
         2 | PostgreSQL Admininstration | 349.99 | A PostgreSQL Guide for DBA | 2020-07-01
(1 row)
```

### 3) Updating a column with an expression

The following statement uses an `UPDATE` statement to increase the price of all the courses 5%:

```sql
UPDATE courses
SET price = price * 1.05;
```

Because we don't use a WHERE clause, the UPDATE statement updates all the rows in the `courses` table.

Output:

```sql
UPDATE 5
```

The following statement retrieves data from the `courses` table to verify the update:

```sql
SELECT * FROM courses;
```

Output:

```sql
SELECT
  course_name,
  price
FROM
  courses;
```

Output:

```
         course_name         |  price
-----------------------------+---------
 PostgreSQL for Developers   |  314.99
 PostgreSQL Bootcamp         |  816.89
 Mastering PostgreSQL        | 1049.98
 PostgreSQL High Performance |  577.49
 PostgreSQL Admininstration  |  367.49
(5 rows)
```

## Summary

- Use the `UPDATE` statement to update data in one or more columns of a table.
-
- Specify a condition in a WHERE clause to determine which rows to update data.
-
- Use the `RETURNING` clause to return the updated rows from the `UPDATE` statement
