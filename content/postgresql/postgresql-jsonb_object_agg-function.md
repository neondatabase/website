---
prevPost: /postgresql/postgresql-drop-procedure-statement
nextPost: /postgresql/postgresql-drop-tablespace-statement
createdAt: 2024-02-25T08:47:58.000Z
title: 'PostgreSQL jsonb_object_agg() Function'
redirectFrom:
            - /postgresql/postgresql-jsonb_object_agg 
            - /postgresql/postgresql-json-functions/postgresql-jsonb_object_agg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_object_agg()` function to aggregate key/value pairs into a JSON object.

## Introduction to the PostgreSQL jsonb_object_agg() function

The PostgreSQL `jsonb_object_agg()` function is an [aggregate function](/postgresql/postgresql-aggregate-functions) that allows you to collect key/value pairs into a [JSON](/postgresql/postgresql-json) object.

The `jsonb_object_agg()` can be useful when you want to aggregate data from multiple rows into a single JSON object or construct complex JSON output.

Here's the syntax of the `jsonb_object_agg()` function:

```
jsonb_object_agg(key, value)
```

In this syntax:

- `key` represents the key for the JSON object. The key must not be null.
-
- `value` represents the value for the corresponding key.

The `jsonb_object_agg()` returns a JSON object that consists of key/value pairs.

## PostgreSQL jsonb_object_agg() function examples

Let's explore some examples of using the PostgreSQL `jsonb_object_agg()` function.

### 1) Basic PostgreSQL jsonb_object_agg() function example

First, [create a table](/postgresql/postgresql-create-table) called `departments`:

```sql
CREATE TABLE departments(
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL
);
```

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `departments` table:

```sql
INSERT INTO departments(department_name)
VALUES
   ('Sales'),
   ('Marketing')
RETURNING *;
```

Third, use the `jsonb_object_agg()` function to create an object whose key is the department name and value is the id:

```sql
SELECT
  jsonb_object_agg(department_name, id) departments
FROM
  departments;
```

Output:

```
         departments
------------------------------
 {"Sales": 1, "Marketing": 2}
(1 row)
```

### 2) Using the jsonb_object_agg() function with GROUP BY clause

First, [create a new table](/postgresql/postgresql-create-table) called `employees`:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2),
    department_id INT NOT NULL,
    FOREIGN KEY(department_id)
       REFERENCES departments(id) ON DELETE CASCADE
);
```

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `employees` table:

```sql
INSERT INTO employees (name, salary, department_id)
VALUES
  ('John Doe', 60000, 1),
  ('Jane Smith', 65000, 1),
  ('Alice Johnson', 55000, 2),
  ('Bob Williams', 70000, 2),
  ('Alex Miller', NULL , 2)
RETURNING *;
```

Output:

```
 id |     name      |  salary  | department_id
----+---------------+----------+---------------
  1 | John Doe      | 60000.00 |             1
  2 | Jane Smith    | 65000.00 |             1
  3 | Alice Johnson | 55000.00 |             2
  4 | Bob Williams  | 70000.00 |             2
  5 | Alex Miller   |     null |             2
(5 rows)
```

Third, use the `jsonb_object_agg()` function to get the department name and a JSON object that contains employee details of the department including employee name and salary:

```sql
SELECT
  department_name,
  jsonb_pretty(
    jsonb_object_agg(e.name, e.salary)
  ) AS employee_details
FROM
  departments d
  INNER JOIN employees e ON e.department_id = d.id
GROUP BY
  department_name;
```

Output:

```
 department_name |       employee_details
-----------------+-------------------------------
 Marketing       | {                            +
                 |     "Alex Miller": null,     +
                 |     "Bob Williams": 70000.00,+
                 |     "Alice Johnson": 55000.00+
                 | }
 Sales           | {                            +
                 |     "John Doe": 60000.00,    +
                 |     "Jane Smith": 65000.00   +
                 | }
(2 rows)
```

Note that we use the `jsonb_pretty()` function to format JSON.

Alex Miller has not had a salary yet so his salary is null. The `jsonb_object_agg()` also collects the null into the JSON object.

To skip nulls, you can use the `jsonb_object_agg_strict()` function as follows:

```sql
SELECT
  department_name,
  jsonb_pretty(
    jsonb_object_agg_strict(e.name, e.salary)
  ) AS employee_details
FROM
  departments d
  INNER JOIN employees e ON e.department_id = d.id
GROUP BY
  department_name;
```

Output:

```
 department_name |       employee_details
-----------------+-------------------------------
 Marketing       | {                            +
                 |     "Bob Williams": 70000.00,+
                 |     "Alice Johnson": 55000.00+
                 | }
 Sales           | {                            +
                 |     "John Doe": 60000.00,    +
                 |     "Jane Smith": 65000.00   +
                 | }
(2 rows)
```

The `jsonb_object_agg_strict()` function works like the `jsonb_object_agg()` function except that it skips null values.

## Summary

- Use the `jsonb_object_agg()` function to aggregate key/value pairs into a JSON object.
-
- Use the `jsonb_object_agg()` function to aggregate key/value pairs into a JSON object and skip null values.
