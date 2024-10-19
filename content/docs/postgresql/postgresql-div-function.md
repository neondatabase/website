---
title: 'PostgreSQL DIV() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-div
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DIV()` function to perform integer division.

## Introduction to the PostgreSQL DIV() function

The `DIV()` function is a useful tool for performing integer division. Unlike the division operator (`/`), which returns a floating-point result, the `DIV()` function provides an integer quotient.

Here's the basic syntax of the `DIV()` function:

```
DIV(dividend, divisor)
```

In this syntax:

- `dividend` is the number that you want to divide.
- `divisor` is the number to which to divide the dividend.

The `DIV()` function returns the integer quotient of the division.

## PostgreSQL DIV() function examples

Let's explore some examples of using the `DIV()` function.

### 1) Basic DIV() function example

The following uses the `DIV()` function to return the result of dividing 10 by 3:

```
SELECT DIV(10,3) as result;
```

Output:

```
 result
--------
      3
(1 row)
```

The result is 3.

Unlike regular division, the `DIV()` function truncates any fractional part of the result and returns only the integer part.

### 2) Grouping data into bins

You can group numerical data data into bins using the `DIV()` function. For example, you can group film from the `film` table of the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database) into bins of 30 minutes:

```
SELECT
  title,
  DIV(length, 30) * 30 as bin
FROM
  film
GROUP BY
  bin,
  title
ORDER BY
  title;
```

Output:

```
            title            | bin
-----------------------------+-----
 Academy Dinosaur            |  60
 Ace Goldfinger              |  30
 Adaptation Holes            |  30
 Affair Prejudice            |  90
 African Egg                 | 120
 Agent Truman                | 150
 Airplane Sierra             |  60
...
```

In this example, we group the lengths of films into bins of 30 minutes.

### 3) Using the PostgreSQL DIV() for calculating ages

First, [create a new table](/docs/postgresql/postgresql-create-table) called `employees` and [insert some data into it](/docs/postgresql/postgresql-tutorial/postgresql-insert-multiple-rows):

```
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL
);

INSERT INTO employees (name, birthdate)
VALUES
    ('John Doe', '1990-05-15'),
    ('Jane Smith', '1985-09-20'),
    ('Michael Johnson', '1982-03-10'),
    ('Emily Brown', '1995-11-28')
RETURNING *;
```

Output:

```
 id |      name       | birthdate
----+-----------------+------------
  1 | John Doe        | 1990-05-15
  2 | Jane Smith      | 1985-09-20
  3 | Michael Johnson | 1982-03-10
  4 | Emily Brown     | 1995-11-28
(4 rows)
```

Second, calculate the age of each employee:

```
SELECT name, DIV(EXTRACT(YEAR FROM AGE(current_date, birthdate)), 1) AS age
FROM employees;
```

Output:

```
      name       | age
-----------------+-----
 John Doe        |  33
 Jane Smith      |  38
 Michael Johnson |  41
 Emily Brown     |  28
(4 rows)
```

How it works.

- Use the [AGE()](/docs/postgresql/postgresql-date-functions/postgresql-age) function to calculate age.
- Use the [EXTRACT()](/docs/postgresql/postgresql-date-functions/postgresql-extract) function to extract the year from the age.
- Use the `DIV()` function to return the integer part of the age.

## Summary

- Use the PostgreSQL `DIV()` function to perform integer division.
