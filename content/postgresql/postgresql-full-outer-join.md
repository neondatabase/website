---
title: 'PostgreSQL FULL OUTER JOIN'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-full-outer-join/
ogImage: ./img/wp-content-uploads-2018-12-PostgreSQL-Join-Full-Outer-Join.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `FULL OUTER JOIN` to query data from two tables.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL FULL OUTER JOIN clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `FULL OUTER JOIN` combine data from two tables and returns all rows from both tables, including matching and non-matching rows from both sides.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In other words, the `FULL OUTER JOIN` combines the results of both the [left join](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-left-join/) and the [right join](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-right-join/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of `FULL OUTER JOIN` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT select_list
FROM table1
FULL OUTER JOIN table2
   ON table1.column_name = table2.column_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the columns from `table1` and `table2` in the `select_list`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the `table1` that you want to retrieve data in the `FROM` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, specify the `table2` that you want to join with the `table1` in the `FULL OUTER JOIN` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Finally, define a condition for joining two tables.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `FULL OUTER JOIN` is also known as `FULL JOIN`. The `OUTER` keyword is optional.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### How the FULL OUTER JOIN works

<!-- /wp:heading -->

<!-- wp:paragraph -->

**Step 1. Initialize the result set:**

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `FULL OUTER JOIN` starts with an empty result set.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

**Step 2. Match rows:**

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, identify rows in `table1` and `table2` where the values in the specified `column_name` match.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Then, include these matching rows in the result set.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

**Step 3. Include non-matching rows from the `table1` and `table2`:**

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, include rows from `table1` that do not have a match in `table2`. For the columns from `table2` in these rows, include NULLs.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, include rows from `table2` that do not have a match in `table1`. For the columns from `table1` in these rows, include NULLs.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

**Step 4. Return the result set:**

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Return the final result set will contain all rows from both tables, with matching rows and non-matching rows from both `table1` and `table2`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- If a row has a match on both sides, combine the values into a single row.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- If there is no match on one side, the columns from the non-matching side will have NULLs.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following Venn diagram illustrates the `FULL OUTER JOIN` operation:

<!-- /wp:paragraph -->

<!-- wp:image {"id":3680,"sizeSlug":"large"} -->

![PostgreSQL Join - Full Outer Join](./img/wp-content-uploads-2018-12-PostgreSQL-Join-Full-Outer-Join.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Setting up sample tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create two new tables](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) for the demonstration: `employees` and `departments`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE departments (
  department_id serial PRIMARY KEY,
  department_name VARCHAR (255) NOT NULL
);
CREATE TABLE employees (
  employee_id serial PRIMARY KEY,
  employee_name VARCHAR (255),
  department_id INTEGER
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Each department has zero or many employees and each employee belongs to zero or one department.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, insert some sample data into the `departments` and `employees` tables.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO departments (department_name)
VALUES
  ('Sales'),
  ('Marketing'),
  ('HR'),
  ('IT'),
  ('Production');
INSERT INTO employees (employee_name, department_id)
VALUES
  ('Bette Nicholson', 1),
  ('Christian Gable', 1),
  ('Joe Swank', 2),
  ('Fred Costner', 3),
  ('Sandra Kilmer', 4),
  ('Julia Mcqueen', NULL);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, query data from the `departments` and `employees` tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM departments;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 department_id | department_name
---------------+-----------------
             1 | Sales
             2 | Marketing
             3 | HR
             4 | IT
             5 | Production
(5 rows)
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM employees;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 employee_id |  employee_name  | department_id
-------------+-----------------+---------------
           1 | Bette Nicholson |             1
           2 | Christian Gable |             1
           3 | Joe Swank       |             2
           4 | Fred Costner    |             3
           5 | Sandra Kilmer   |             4
           6 | Julia Mcqueen   |          null
(6 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL FULL OUTER JOIN examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `FULL OUTER JOIN` clause.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic FULL OUTER JOIN examaple

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses the `FULL OUTER JOIN` to query data from both `employees` and `departments` tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  employee_name,
  department_name
FROM
  employees e
FULL OUTER JOIN departments d
  ON d.department_id = e.department_id;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
  employee_name  | department_name
-----------------+-----------------
 Bette Nicholson | Sales
 Christian Gable | Sales
 Joe Swank       | Marketing
 Fred Costner    | HR
 Sandra Kilmer   | IT
 Julia Mcqueen   | null
 null            | Production
(7 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result set includes every employee who belongs to a department and every department which have an employee.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Additionally, it includes every employee who does not belong to a department and every department that does not have an employee.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using FULL OUTER JOIN with WHERE clause example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example use the `FULL OUTER JOIN` with a [WHERE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/) clause to find the department that does not have any employees:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  employee_name,
  department_name
FROM
  employees e
FULL OUTER JOIN departments d
  ON d.department_id = e.department_id
WHERE
  employee_name IS NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 employee_name | department_name
---------------+-----------------
 null          | Production
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result shows that the `Production` department does not have any employees.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example use the `FULL OUTER JOIN` cluase with a `WHERE` clause to find employees who do not belong to any department:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  employee_name,
  department_name
FROM
  employees e
FULL OUTER JOIN departments d
  ON d.department_id = e.department_id
WHERE
  department_name IS NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 employee_name | department_name
---------------+-----------------
 Julia Mcqueen | null
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows that `Juila Mcqueen` does not belong to any department.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `FULL OUTER JOIN` clause to combine data from both tables, ensuring that matching rows are included from both the left and right tables, as well as unmatched rows from either table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
