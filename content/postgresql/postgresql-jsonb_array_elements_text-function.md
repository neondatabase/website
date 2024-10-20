---
prevPost: postgresql-sqrt-function
nextPost: postgresql-at-time-zone-operator
createdAt: 2024-02-24T08:05:50.000Z
title: 'PostgreSQL jsonb_array_elements_text() Function'
redirectFrom:
            - /postgresql/postgresql-jsonb_array_elements_text 
            - /postgresql/postgresql-json-functions/postgresql-jsonb_array_elements_text
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_array_elements_text()` function to expand the elements of a top-level JSON array into a set of text values.

## Introduction to the PostgreSQL jsonb_array_elements_text() function

The `jsonb_array_elements_text()` function allows you to expand the elements of a top-level [JSON](/postgresql/postgresql-json) array into a set of JSON values.

The following shows the basic syntax of the `jsonb_array_elements_text()` function:

```
jsonb_array_elements_text(json_array)
```

In this syntax:

- `json_array` is a JSON array with the `JSONB` type, which you want to expand the elements.

The `jsonb_array_elements_text()` function will expand the elements in the `json_array` into individual text values.

If you pass an object to the function, it'll issue an error. In case the `json_array` is `NULL`, the function returns an empty result set.

## PostgreSQL jsonb_array_elements_text() function examples

Let's take some examples of using the `jsonb_array_elements_text()` function.

### 1) Basic PostgreSQL jsonb_array_elements_text() function examples

The following example uses the `jsonb_array_elements_text()` function to expand elements of a JSON array:

```sql
SELECT jsonb_array_elements_text('["orange","banana","watermelon"]');
```

Output:

```
 jsonb_array_elements_text
---------------------------
 orange
 banana
 watermelon
(3 rows)
```

The following example uses the `jsonb_array_elements_text()` function to expand an array of numbers:

```sql
SELECT jsonb_array_elements_text('[1,2,3]');
```

Output:

```
 jsonb_array_elements_text
---------------------------
 1
 2
 3
(3 rows)
```

Note that 1, 2, and 3 are text values, not numbers. To convert them to numbers, you need to have an explicit cast.

### 2) Using the jsonb_array_elements_text() function with nested arrays example

The following example uses the `jsonb_array_elements_text()` function to expand elements of an array that contains another array:

```sql
SELECT jsonb_array_elements_text('[1,2,3, [4,5], 6]');
```

Output:

```
 jsonb_array_elements_text
---------------------------
 1
 2
 3
 [4, 5]
 6
(5 rows)
```

### 3) Using the jsonb_array_elements_text() function with table data

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
SELECT jsonb_array_elements_text(skills) skills
FROM employees;
```

Output:

```
      skills
------------------
 Java
 Python
 SQL
 C++
 JavaScript
 HTML/CSS
 Python
 Data Analysis
 Machine Learning
 Java
 SQL
 Spring Framework
(12 rows)
```

It returns 12 skills as text values.

If you want to get unique skills, you can use the `DISTINCT` operator:

```sql
SELECT DISTINCT jsonb_array_elements_text(skills) skills
FROM employees;
```

Output:

```
      skills
------------------
 Data Analysis
 C++
 JavaScript
 SQL
 Python
 Machine Learning
 Spring Framework
 HTML/CSS
 Java
(9 rows)
```

## Summary

- Use the `jsonb_array_elements_text()` function to expand elements of the top-level JSON array into a set of text values.
