---
title: 'PostgreSQL ALL Operator'
page_title: 'PostgreSQL ALL Operator'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL ALL operator to compare a value with a list of values returned by a subquery.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-all/'
ogImage: ''
updatedOn: '2024-07-01T01:08:50+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL ANY Operator'
  slug: 'postgresql-tutorial/postgresql-any'
nextLink:
  title: 'PostgreSQL EXISTS Operator'
  slug: 'postgresql-tutorial/postgresql-exists'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALL` operator to compare a value with a list of values returned by a subquery.

## Overview of the PostgreSQL ALL operator

The PostgreSQL `ALL` operator allows you to compare a value with all values in a set returned by a [subquery](postgresql-subquery).

Here’s the basic syntax of the `ALL` operator:

```sql
expression operator ALL(subquery)
```

In this syntax:

- The `ALL` operator must be preceded by a comparison operator such as equal (\=), not equal (\<\>), greater than (\>), greater than or equal to (\>\=), less than (\<), and less than or equal to (\<\=).
- The `ALL` operator must be followed by a subquery which also must be surrounded by the parentheses.

If the subquery returns a non\-empty result set, the `ALL` operator works as follows:

- `value > ALL (subquery)` returns true if the value is greater than the biggest value returned by the subquery.
- `value >= ALL (subquery)` returns true if the value is greater than or equal to the biggest value returned by the subquery.
- `value < ALL (subquery)` returns true if the value is less than the smallest value returned by the subquery.
- `value <= ALL (subquery)` returns true if the value is less than or equal to the smallest value returned by the subquery.
- `value = ALL (subquery)` returns true if the value equals every value returned by the subquery.
- `value != ALL (subquery)` returns true if the value does not equal any value returned by the subquery.

If the subquery returns no row, then the `ALL` operator always evaluates to true.

## PostgreSQL ALL operator examples

Let’s explore some examples of using the PostgreSQL `ALL` operator.

### Setting up a sample table

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
('Bob', 'Williams', 75000.00),
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

### 1\) Using the ALL operator with the greater than operator (\>) example

The following example uses the `ALL` operator for employees who have salaries greater than all managers

```sql
SELECT
  *
FROM
  employees
WHERE
  salary > ALL(
    select
      salary
    from
      managers
  );
```

Output:

```sql
 id | first_name | last_name |  salary
----+------------+-----------+----------
  1 | Bob        | Williams  | 75000.00
(1 row)
```

The query returns one row with a salary of 75K greater than the highest salary of all managers (60K).

### 2\) Using the ALL operator with the less than operator (\<) example

The following example uses the `ALL` operator for employees who have salaries less than all managers:

```
SELECT
  *
FROM
  employees
WHERE
  salary < ALL(
    select
      salary
    from
      managers
  )
ORDER BY salary DESC;
```

Output:

```
 id | first_name | last_name |  salary
----+------------+-----------+----------
  7 | Harry      | Taylor    | 53000.00
  5 | Frank      | Miller    | 52000.00
  3 | David      | Jones     | 50000.00
  6 | Grace      | Wilson    | 49000.00
  4 | Emma       | Brown     | 48000.00
  8 | Ivy        | Moore     | 47000.00
 10 | Kate       | Hill      | 44000.00
 12 | Mia        | Parker    | 42000.00
(8 rows)
```

It returns all the employees whose salaries are less than the lowest salary of all managers which is 55K.

## Summary

- Use the PostgreSQL `ALL` operator to compare a value with all values in a set of values returned by a subquery.
