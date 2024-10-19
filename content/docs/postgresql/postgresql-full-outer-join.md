---
title: 'PostgreSQL FULL OUTER JOIN'
redirectFrom:
  - /docs/postgresql/postgresql-tutorial/postgresql-full-outer-join
ogImage: /postgresqltutorial_data/wp-content-uploads-2018-12-PostgreSQL-Join-Full-Outer-Join.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `FULL OUTER JOIN` to query data from two tables.

## Introduction to the PostgreSQL FULL OUTER JOIN clause

The `FULL OUTER JOIN` combine data from two tables and returns all rows from both tables, including matching and non-matching rows from both sides.

In other words, the `FULL OUTER JOIN` combines the results of both the [left join](/docs/postgresql/postgresql-left-join) and the [right join](/docs/postgresql/postgresql-tutorial/postgresql-right-join).

Here's the basic syntax of `FULL OUTER JOIN` clause:

```sql
SELECT select_list
FROM table1
FULL OUTER JOIN table2
   ON table1.column_name = table2.column_name;
```

In this syntax:

- First, specify the columns from `table1` and `table2` in the `select_list`.
-
- Second, specify the `table1` that you want to retrieve data in the `FROM` clause.
-
- Third, specify the `table2` that you want to join with the `table1` in the `FULL OUTER JOIN` clause.
-
- Finally, define a condition for joining two tables.

The `FULL OUTER JOIN` is also known as `FULL JOIN`. The `OUTER` keyword is optional.

### How the FULL OUTER JOIN works

**Step 1. Initialize the result set:**

- The `FULL OUTER JOIN` starts with an empty result set.

**Step 2. Match rows:**

- First, identify rows in `table1` and `table2` where the values in the specified `column_name` match.
-
- Then, include these matching rows in the result set.

**Step 3. Include non-matching rows from the `table1` and `table2`:**

- First, include rows from `table1` that do not have a match in `table2`. For the columns from `table2` in these rows, include NULLs.
-
- Second, include rows from `table2` that do not have a match in `table1`. For the columns from `table1` in these rows, include NULLs.

**Step 4. Return the result set:**

- Return the final result set will contain all rows from both tables, with matching rows and non-matching rows from both `table1` and `table2`.
-
- If a row has a match on both sides, combine the values into a single row.
-
- If there is no match on one side, the columns from the non-matching side will have NULLs.

The following Venn diagram illustrates the `FULL OUTER JOIN` operation:

![PostgreSQL Join - Full Outer Join](/postgresqltutorial_data/wp-content-uploads-2018-12-PostgreSQL-Join-Full-Outer-Join.png)

## Setting up sample tables

First, [create two new tables](/docs/postgresql/postgresql-create-table) for the demonstration: `employees` and `departments`:

```sql
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

Each department has zero or many employees and each employee belongs to zero or one department.

Second, insert some sample data into the `departments` and `employees` tables.

```sql
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

Third, query data from the `departments` and `employees` tables:

```sql
SELECT * FROM departments;
```

Output:

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

```sql
SELECT * FROM employees;
```

Output:

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

## PostgreSQL FULL OUTER JOIN examples

Let's take some examples of using the `FULL OUTER JOIN` clause.

### 1) Basic FULL OUTER JOIN examaple

The following query uses the `FULL OUTER JOIN` to query data from both `employees` and `departments` tables:

```sql
SELECT
  employee_name,
  department_name
FROM
  employees e
FULL OUTER JOIN departments d
  ON d.department_id = e.department_id;
```

Output:

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

The result set includes every employee who belongs to a department and every department which have an employee.

Additionally, it includes every employee who does not belong to a department and every department that does not have an employee.

### 2) Using FULL OUTER JOIN with WHERE clause example

The following example use the `FULL OUTER JOIN` with a [WHERE](/docs/postgresql/postgresql-where) clause to find the department that does not have any employees:

```sql
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

Output:

```
 employee_name | department_name
---------------+-----------------
 null          | Production
(1 row)
```

The result shows that the `Production` department does not have any employees.

The following example use the `FULL OUTER JOIN` cluase with a `WHERE` clause to find employees who do not belong to any department:

```sql
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

Output:

```
 employee_name | department_name
---------------+-----------------
 Julia Mcqueen | null
(1 row)
```

The output shows that `Juila Mcqueen` does not belong to any department.

## Summary

- Use the PostgreSQL `FULL OUTER JOIN` clause to combine data from both tables, ensuring that matching rows are included from both the left and right tables, as well as unmatched rows from either table.
