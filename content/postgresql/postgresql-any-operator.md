---
prevPost: postgresql-correlated-subquery
nextPost: how-to-uninstall-postgresql-from-ubuntu
createdAt: 2017-08-19T10:42:10.000Z
title: 'PostgreSQL ANY Operator'
redirectFrom: 
            - /postgresql/postgresql-any
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ANY` operator to compare a scalar value with a set of values returned by a subquery.

## Introduction to PostgreSQL ANY operator

The PostgreSQL `ANY` operator compares a value with a set of values returned by a [subquery](/postgresql/postgresql-subquery). It is commonly used in combination with comparison operators such as =, &lt;, >, &lt;=, >=, and &lt;>.

Here's the basic syntax of the `ANY` operator:

```
expression operator ANY(subquery)
```

In this syntax:

- `expression` is a value that you want to compare.
- `operator` is a comparison operator including =, &lt;, >, &lt;=, >=, and &lt;>.
- `subquery` is a subquery that returns a set of values to compare against. It must return exactly one column.

The `ANY` operator returns `true` if the comparison returns `true` for at least one of the values in the set, and `false` otherwise.

If the subquery returns an empty set, the result of `ANY` comparison is always `true`.

Besides the subquery, you can use any construct that returns a set of values such as an `ARRAY`.

Note that `SOME` is a synonym for `ANY`, which means that you can use them interchangeably.

## PostgreSQL ANY operator examples

Let's take some examples of using the `ANY` operator.

### Setting up a sample table

First, create a table called `employees` and `managers`, and insert some data into it:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL
);

CREATE TABLE managers(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL
);

INSERT INTO employees (first_name, last_name, salary)
VALUES
('Bob', 'Williams', 45000.00),
('Charlie', 'Davis', 55000.00),
('David', 'Jones', 50000.00),
('Emma', 'Brown', 48000.00),
('Frank', 'Miller', 52000.00),
('Grace', 'Wilson', 49000.00),
('Harry', 'Taylor', 53000.00),
('Ivy', 'Moore', 47000.00),
('Jack', 'Anderson', 56000.00),
('Kate', 'Hill',  44000.00),
('Liam', 'Clark', 59000.00),
('Mia', 'Parker', 42000.00);

INSERT INTO managers(first_name, last_name, salary)
VALUES
('John', 'Doe',  60000.00),
('Jane', 'Smith', 55000.00),
('Alice', 'Johnson',  58000.00);
```

Second, retrieve the data from the `employees` table:

```sql
SELECT * FROM employees;
```

Output:

```
 id | first_name | last_name |  salary
----+------------+-----------+----------
  1 | Bob        | Williams  | 45000.00
  2 | Charlie    | Davis     | 55000.00
  3 | David      | Jones     | 50000.00
  4 | Emma       | Brown     | 48000.00
  5 | Frank      | Miller    | 52000.00
  6 | Grace      | Wilson    | 49000.00
  7 | Harry      | Taylor    | 53000.00
  8 | Ivy        | Moore     | 47000.00
  9 | Jack       | Anderson  | 56000.00
 10 | Kate       | Hill      | 44000.00
 11 | Liam       | Clark     | 59000.00
 12 | Mia        | Parker    | 42000.00
 13 | John       | Doe       | 60000.00
 14 | Jane       | Smith     | 55000.00
 15 | Alice      | Johnson   | 58000.00
(15 rows)
```

Third, retrieve the data from the `managers` table:

```sql
SELECT * FROM managers;
```

Output:

```
 id | first_name | last_name |  type   |  salary
----+------------+-----------+---------+----------
  1 | John       | Doe       | manager | 60000.00
  2 | Jane       | Smith     | manager | 55000.00
  3 | Alice      | Johnson   | manager | 58000.00
(3 rows)
```

### 1) Using ANY operator with the = operator example

The following statement uses the ANY operator to find employees who have the salary the same as manager:

```sql
SELECT
  *
FROM
  employees
WHERE
  salary = ANY (
    SELECT
      salary
    FROM
      managers
  );
```

It returns one row:

```
 id | first_name | last_name |  salary
----+------------+-----------+----------
  2 | Charlie    | Davis     | 55000.00
(1 row)
```

How it works.

First, execute the subquery in the `ANY` operator that returns the salary of managers:

```sql
SELECT salary FROM managers;
```

Output:

```
  salary
----------
 60000.00
 55000.00
 58000.00
(3 rows)
```

Second, compare the salary of each row in the `employees` table with the values returned by the subquery and include the row that has a salary equal to the one in the set (`60K`, `55K`, and `58K`).

### 2) Using ANY operator with > operator example

The following example uses the `ANY` operator to find employees who have salaries greater than the manager's salaries:

```sql
SELECT
  *
FROM
  employees
WHERE
  salary > ANY (
    SELECT
      salary
    FROM
      managers
  );
```

Output:

```
 id | first_name | last_name |  salary
----+------------+-----------+----------
  9 | Jack       | Anderson  | 56000.00
 11 | Liam       | Clark     | 59000.00
(2 rows)
```

The output indicates that the two employees have a higher salary than the manager's.

- Jack has a salary of 56K which is greater than 55K.
- Liam has a salary of 59K which is greater than 55K and 58K.

### 3) Using ANY operator with &lt; operator example

The following example uses the `ANY` operator to find employees who have salaries less than the manager's salaries:

```sql
SELECT
  *
FROM
  employees
WHERE
  salary < ANY (
    SELECT
      salary
    FROM
      employees
  );
```

Output:

```
 id | first_name | last_name |  salary
----+------------+-----------+----------
  1 | Bob        | Williams  | 45000.00
  2 | Charlie    | Davis     | 55000.00
  3 | David      | Jones     | 50000.00
  4 | Emma       | Brown     | 48000.00
  5 | Frank      | Miller    | 52000.00
  6 | Grace      | Wilson    | 49000.00
  7 | Harry      | Taylor    | 53000.00
  8 | Ivy        | Moore     | 47000.00
  9 | Jack       | Anderson  | 56000.00
 10 | Kate       | Hill      | 44000.00
 12 | Mia        | Parker    | 42000.00
(11 rows)
```

It returns all the rows with the `employee` type because they have a value in the `salary` column less than any value in the set (55K, 58K, and 60K).

## Summary

- Use the PostgreSQL `ANY` operator to compare a value to a set of values returned by a subquery.
