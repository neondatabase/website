---
createdAt: 2024-02-24T04:18:10.000Z
title: 'PostgreSQL jsonb_array_elements() Function'
redirectFrom:
            - /postgresql/postgresql-jsonb_array_elements 
            - /postgresql/postgresql-json-functions/postgresql-jsonb_array_elements
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_array_elements()` function to expand the top-level JSON array into a set of JSON values.

## Introduction to the PostgreSQL jsonb_array_elements() function

The `jsonb_array_elements()` function allows you to expand the top-level [JSON](/postgresql/postgresql-json) array into a set of JSON values.

Here's the basic syntax of the `jsonb_array_elements()` function:

```
jsonb_array_elements(json_array)
```

In this syntax, you specify a JSON array with a JSONB type that you want to expand its elements.

The `jsonb_array_elements()` function will expand the elements of the `json_array` into individual elements.

If you pass a non-array to the function, it'll issue an error. If the `json_array` is `NULL`, the function returns an empty result set.

## PostgreSQL jsonb_array_elements() function examples

Let's explore some examples of using the `jsonb_array_elements()` function.

### 1) Basic PostgreSQL jsonb_array_elements() function examples

The following example uses the `jsonb_array_elements()` function to expand elements of a JSON array:

```sql
SELECT jsonb_array_elements('[1,2,3]');
```

Output:

```
 jsonb_array_elements
----------------------
 1
 2
 3
(3 rows)
```

Note that the numbers 1, 2, 3 are the JSON values.

The following example uses the `jsonb_array_elements()` function to expand an array of strings:

```sql
SELECT jsonb_array_elements('["red","green","blue"]');
```

Output:

```
 jsonb_array_elements
----------------------
 "red"
 "green"
 "blue"
(3 rows)
```

### 2) Using the jsonb_array_elements() function with nested arrays example

The following example uses the `jsonb_array_elements()` function to expand elements of an array that contains another array:

```sql
SELECT jsonb_array_elements('[1,2,3, [4,5], 6]');
```

Output:

```
 jsonb_array_elements
----------------------
 1
 2
 3
 [4, 5]
 6
(5 rows)
```

### 3) Using the jsonb_array_elements() function with table data

First, [create a table](/postgresql/postgresql-create-table) called `employees`:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    skills JSONB
);
```

The `skills` column has the JSONB type, which stores the skills of employees.

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `employees` table:

```sql
INSERT INTO employees (name, skills)
VALUES
('John Doe', '["Java", "Python", "SQL"]'),
('Jane Smith', '["C++", "JavaScript", "HTML/CSS"]'),
('Alice Johnson', '["Python", "Data Analysis", "Machine Learning"]'),
('Bob Brown', '["Java", "SQL", "Spring Framework"]');
```

Third, retrieve all skills of employees:

```sql
SELECT jsonb_array_elements(skills) skills
FROM employees;
```

Output:

```
       skills
--------------------
 "Java"
 "Python"
 "SQL"
 "C++"
 "JavaScript"
 "HTML/CSS"
 "Python"
 "Data Analysis"
 "Machine Learning"
 "Java"
 "SQL"
 "Spring Framework"
(12 rows)
```

It returns 12 skills.

It's possible to use the `DISTINCT` to get unique skills of all employees:

```sql
SELECT DISTINCT jsonb_array_elements(skills) skills
FROM employees;
```

Output:

```
       skills
--------------------
 "C++"
 "Python"
 "SQL"
 "HTML/CSS"
 "JavaScript"
 "Java"
 "Data Analysis"
 "Spring Framework"
 "Machine Learning"
(9 rows)
```

## Summary

- Use the `jsonb_array_elements()` function to expand elements of the top-level JSON array.
