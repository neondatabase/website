---
title: 'PostgreSQL UPDATE'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `UPDATE` statement to update existing data in a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL UPDATE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `UPDATE` statement allows you to update data in one or more columns of one or more rows in a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `UPDATE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE table_name
SET column1 = value1,
    column2 = value2,
    ...
WHERE condition;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table that you want to update data after the `UPDATE` keyword.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify columns and their new values after `SET` keyword. The columns that do not appear in the `SET` clause retain their original values.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, determine which rows to update in the condition of the [`WHERE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/) clause.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `WHERE` clause is optional. If you omit the `WHERE` clause, the `UPDATE` statement will update all rows in the table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When the `UPDATE` statement is executed successfully, it returns the following command tag:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
UPDATE count
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `count` is the number of rows updated including rows whose values did not change.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Returning updated rows

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `UPDATE` statement has an optional `RETURNING` clause that returns the updated rows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE table_name
SET column1 = value1,
    column2 = value2,
    ...
WHERE condition
RETURNING * | output_expression AS output_name;
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL UPDATE examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the PostgreSQL `UPDATE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Setting up a sample table

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statements [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `courses` and [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) data into it:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL UPDATE example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `UPDATE` statement to update the course with id 3 by changing the `published_date` to `'2020-08-01'`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE courses
SET published_date = '2020-08-01'
WHERE course_id = 3;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The statement returns the following message indicating that one row has been updated:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
UPDATE 1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement retrieves the course with id 3 to verify the update:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT course_id, course_name, published_date
FROM courses
WHERE course_id = 3;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 course_id |         course_name         | published_date
-----------+-----------------------------+----------------
         3 | PostgreSQL High Performance | 2020-08-01
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Updating a row and returning the updated row

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `UPDATE` statement update `published_date` of the course id 2 to `2020-07-01` and returns the updated course.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE courses
SET published_date = '2020-07-01'
WHERE course_id = 2
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 course_id |        course_name         | price  |        description         | published_date
-----------+----------------------------+--------+----------------------------+----------------
         2 | PostgreSQL Admininstration | 349.99 | A PostgreSQL Guide for DBA | 2020-07-01
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Updating a column with an expression

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses an `UPDATE` statement to increase the price of all the courses 5%:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
UPDATE courses
SET price = price * 1.05;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Because we don't use a WHERE clause, the UPDATE statement updates all the rows in the `courses` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
UPDATE 5
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement retrieves data from the `courses` table to verify the update:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM courses;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  course_name,
  price
FROM
  courses;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `UPDATE` statement to update data in one or more columns of a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Specify a condition in a WHERE clause to determine which rows to update data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `RETURNING` clause to return the updated rows from the `UPDATE` statement
- <!-- /wp:list-item -->

<!-- /wp:list -->
