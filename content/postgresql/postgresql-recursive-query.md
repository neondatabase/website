---
prevPost: how-to-check-postgresql-version
nextPost: how-to-restart-postgresql-on-ubuntu
createdAt: 2016-07-02T09:18:43.000Z
title: 'PostgreSQL Recursive Query'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL recursive query using recursive common table expressions or CTEs.

## Introduction to the PostgreSQL recursive query

In PostgreSQL, a [common table expression (CTE)](/postgresql/postgresql-cte) is a named temporary result set within a query.

A recursive CTE allows you to perform recursion within a query using the `WITH RECURSIVE` syntax.

A recursive CTE is often referred to as a recursive query.

Here's the basic syntax of a recursive CTE:

```sql
WITH RECURSIVE cte_name (column1, column2, ...)
AS(
    -- anchor member
    SELECT select_list FROM table1 WHERE condition

    UNION [ALL]

    -- recursive term
    SELECT select_list FROM cte_name WHERE recursive_condition
)
SELECT * FROM cte_name;
```

In this syntax:

- `cte_name`: Specify the name of the CTE. You can reference this CTE name in the subsequent parts of the query.
- `column1`, `column2`, ... Specify the columns selected in both the anchor and recursive members. These columns define the CTE's structure.
- Anchor member: Responsible for forming the base result set of the CTE structure.
- Recursive member: Refer to the CTE name itself. It combines with the anchor member using the `UNION` or `UNION ALL` operator.
- `recursive_condition`: Is a condition used in the recursive member that determines how the recursion stops.

PostgreSQL executes a recursive CTE in the following sequence:

- First, execute the anchor member to create the base result set (R0).
- Second, execute the recursive member with Ri as an input to return the result set Ri+1 as the output.
- Third, repeat step 2 until an empty set is returned. (termination check)
- Finally, return the final result set that is a [UNION](/postgresql/postgresql-union) or `UNION ALL` of the result sets R0, R1, ... Rn.

A recursive CTE can be useful when dealing with hierarchical or nested data structures, such as trees or graphs.

## PostgreSQL recursive query example

Let's take an example of using a recursive query.

### 1) Setting up a sample table

First, [create a new table](/postgresql/postgresql-create-table) called employees:

```sql
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  manager_id INT
);
```

The `employees` table has three columns: `employee_id`, `full_name`, and `manager_id`. The `manager_id` column specifies the manager id of an employee.

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `employees` table:

```sql
INSERT INTO employees (employee_id, full_name, manager_id)
VALUES
  (1, 'Michael North', NULL),
  (2, 'Megan Berry', 1),
  (3, 'Sarah Berry', 1),
  (4, 'Zoe Black', 1),
  (5, 'Tim James', 1),
  (6, 'Bella Tucker', 2),
  (7, 'Ryan Metcalfe', 2),
  (8, 'Max Mills', 2),
  (9, 'Benjamin Glover', 2),
  (10, 'Carolyn Henderson', 3),
  (11, 'Nicola Kelly', 3),
  (12, 'Alexandra Climo', 3),
  (13, 'Dominic King', 3),
  (14, 'Leonard Gray', 4),
  (15, 'Eric Rampling', 4),
  (16, 'Piers Paige', 7),
  (17, 'Ryan Henderson', 7),
  (18, 'Frank Tucker', 8),
  (19, 'Nathan Ferguson', 8),
  (20, 'Kevin Rampling', 8);
```

### 2) Basic PostgreSQL recursive query example

The following statement uses a recursive CTE to find all subordinates of the manager with the id 2.

```sql
WITH RECURSIVE subordinates AS (
  SELECT
    employee_id,
    manager_id,
    full_name
  FROM
    employees
  WHERE
    employee_id = 2
  UNION
  SELECT
    e.employee_id,
    e.manager_id,
    e.full_name
  FROM
    employees e
    INNER JOIN subordinates s ON s.employee_id = e.manager_id
)
SELECT * FROM subordinates;
```

Output:

```
 employee_id | manager_id |    full_name
-------------+------------+-----------------
           2 |          1 | Megan Berry
           6 |          2 | Bella Tucker
           7 |          2 | Ryan Metcalfe
           8 |          2 | Max Mills
           9 |          2 | Benjamin Glover
          16 |          7 | Piers Paige
          17 |          7 | Ryan Henderson
          18 |          8 | Frank Tucker
          19 |          8 | Nathan Ferguson
          20 |          8 | Kevin Rampling
(10 rows)
```

How it works:

- The recursive CTE `subordinates` defines an anchor member and a recursive member.
- The anchor member returns the base result set R0 which is the employee with the id 2.

```
 employee_id | manager_id |  full_name
-------------+------------+-------------
           2 |          1 | Megan Berry
```

The recursive member returns the direct subordinate(s) of the employee id 2. This is the result of joining between the `employees` table and the `subordinates` CTE. The first iteration of the recursive term returns the following result set:

```
 employee_id | manager_id |    full_name
-------------+------------+-----------------
           6 |          2 | Bella Tucker
           7 |          2 | Ryan Metcalfe
           8 |          2 | Max Mills
           9 |          2 | Benjamin Glover
```

PostgreSQL executes the recursive member repeatedly. The second iteration of the recursive member uses the result set above step as the input value, and returns this result set:

```
 employee_id | manager_id |    full_name
-------------+------------+-----------------
          16 |          7 | Piers Paige
          17 |          7 | Ryan Henderson
          18 |          8 | Frank Tucker
          19 |          8 | Nathan Ferguson
          20 |          8 | Kevin Rampling
```

The third iteration returns an empty result set because no employee is reporting to the employee with the id 16, 17, 18, 19, and 20.

PostgreSQL returns the final result set which is the union of all result sets in the first and second iterations generated by the non-recursive and recursive members.

```
 employee_id | manager_id |    full_name
-------------+------------+-----------------
           2 |          1 | Megan Berry
           6 |          2 | Bella Tucker
           7 |          2 | Ryan Metcalfe
           8 |          2 | Max Mills
           9 |          2 | Benjamin Glover
          16 |          7 | Piers Paige
          17 |          7 | Ryan Henderson
          18 |          8 | Frank Tucker
          19 |          8 | Nathan Ferguson
          20 |          8 | Kevin Rampling
(10 rows)
```

## Summary

- Use the `WITH RECURSIVE` syntax to define a recursive query.
- Use a recursive query to deal with hierarchical or nested data structures such as trees or graphs.
