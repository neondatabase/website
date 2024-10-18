---
title: 'PostgreSQL jsonb_object_agg() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_object_agg/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_object_agg()` function to aggregate key/value pairs into a JSON object.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_object_agg() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `jsonb_object_agg()` function is an [aggregate function](https://www.postgresqltutorial.com/postgresql-aggregate-functions/) that allows you to collect key/value pairs into a [JSON](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/) object.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `jsonb_object_agg()` can be useful when you want to aggregate data from multiple rows into a single JSON object or construct complex JSON output.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `jsonb_object_agg()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_object_agg(key, value)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `key` represents the key for the JSON object. The key must not be null.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `value` represents the value for the corresponding key.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `jsonb_object_agg()` returns a JSON object that consists of key/value pairs.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_object_agg() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the PostgreSQL `jsonb_object_agg()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL jsonb_object_agg() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `departments`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE departments(
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `departments` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO departments(department_name)
VALUES
   ('Sales'),
   ('Marketing')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, use the `jsonb_object_agg()` function to create an object whose key is the department name and value is the id:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_object_agg(department_name, id) departments
FROM
  departments;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
         departments
------------------------------
 {"Sales": 1, "Marketing": 2}
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the jsonb_object_agg() function with GROUP BY clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `employees`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2),
    department_id INT NOT NULL,
    FOREIGN KEY(department_id)
       REFERENCES departments(id) ON DELETE CASCADE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO employees (name, salary, department_id)
VALUES
  ('John Doe', 60000, 1),
  ('Jane Smith', 65000, 1),
  ('Alice Johnson', 55000, 2),
  ('Bob Williams', 70000, 2),
  ('Alex Miller', NULL , 2)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, use the `jsonb_object_agg()` function to get the department name and a JSON object that contains employee details of the department including employee name and salary:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that we use the `jsonb_pretty()` function to format JSON.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Alex Miller has not had a salary yet so his salary is null. The `jsonb_object_agg()` also collects the null into the JSON object.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To skip nulls, you can use the `jsonb_object_agg_strict()` function as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

The `jsonb_object_agg_strict()` function works like the `jsonb_object_agg()` function except that it skips null values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_object_agg()` function to aggregate key/value pairs into a JSON object.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `jsonb_object_agg()` function to aggregate key/value pairs into a JSON object and skip null values.
- <!-- /wp:list-item -->

<!-- /wp:list -->
