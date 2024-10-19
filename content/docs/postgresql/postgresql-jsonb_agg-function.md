---
title: 'PostgreSQL jsonb_agg() Function'
redirectFrom:
            - /docs/postgresql/postgresql-jsonb_agg 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_agg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_agg()` function to aggregate values into a JSON array.

## Introduction to the PostgreSQL jsonb_agg() function

The `jsonb_agg()` function is an [aggregate function](/docs/postgresql/postgresql-aggregate-functions) that allows you to aggregate values into a JSON array.

The `jsonb_agg()` function can be particularly useful when you want to create a JSON array from data of multiple rows.

Here's the syntax of the `jsonb_agg()` function:

```
jsonb_agg(expression)
```

In this syntax:

- `expression`: is any valid expression that evaluates to a JSON value.

The `jsonb_agg()` function returns a JSON array that consists of data from multiple rows.

## PostgreSQL jsonb_agg() function example

Let's explore some examples of using the `jsonb_agg()` function.

### 1) Basic jsonb_agg() function example

First, [create a new table](/docs/postgresql/postgresql-create-table) called `products`:

```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
```

Second, [insert some rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `products` table:

```
INSERT INTO products (name, price)
VALUES
('Laptop', 1200.00),
('Smartphone', 800.00),
('Headphones', 100.00);
```

Third, use the `jsonb_agg()` function to aggregate product information into a JSON array:

```
SELECT
  jsonb_agg(
    jsonb_build_object('name', name, 'price', price)
  ) AS products
FROM
  products;
```

Output:

```
                                                         products
--------------------------------------------------------------------------------------------------------------------------
 [{"name": "Laptop", "price": 1200.00}, {"name": "Smartphone", "price": 800.00}, {"name": "Headphones", "price": 100.00}]
(1 row)
```

### 2) Using jsonb_agg() function with GROUP BY clause

First, [create new tables](/docs/postgresql/postgresql-create-table) called `departments` and `employees`:

```
CREATE TABLE departments(
   id SERIAL PRIMARY KEY,
   department_name VARCHAR(255) NOT NULL
);

CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
        REFERENCES departments(id) ON DELETE CASCADE
);
```

Second, insert rows into `departments` and `employees` tables:

```
INSERT INTO departments (department_name)
VALUES
  ('Engineering'),
  ('Sales')
RETURNING *;

INSERT INTO employees (employee_name, department_id)
VALUES
  ('John Doe', 1),
  ('Jane Smith', 1),
  ('Alice Johnson', 1),
  ('Bob Brown', 2)
RETURNING *;
```

The `departments` table:

```
 id | department_name
----+-----------------
  1 | Engineering
  2 | Sales
(2 rows)
```

The `employees` table:

```
 id | employee_name | department_id
----+---------------+---------------
  1 | John Doe      |             1
  2 | Jane Smith    |             1
  3 | Alice Johnson |             1
  4 | Bob Brown     |             2
(4 rows)
```

Third, use the `jsonb_agg()` function to retrieve departments and a list of employees for each department in the form of a JSON array:

```
SELECT
  department_name,
  jsonb_agg(employee_name) AS employees
FROM
  employees e
  INNER JOIN departments d ON d.id = e.department_id
GROUP BY
  department_name;
```

Output:

```
 department_name |                  employees
-----------------+---------------------------------------------
 Engineering     | ["John Doe", "Jane Smith", "Alice Johnson"]
 Sales           | ["Bob Brown"]
(2 rows)
```

### 3) Using jsonb_agg() function with NULLs

First, drop the departments and employees tables:

```
DROP TABLE employees;
DROP TABLE departments;
```

Second, recreate the departments and employees tables:

```
CREATE TABLE departments(
   id SERIAL PRIMARY KEY,
   department_name VARCHAR(255) NOT NULL
);

CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
        REFERENCES departments(id) ON DELETE CASCADE
);
```

Third, insert rows into the departments and employees tables:

```
INSERT INTO departments (department_name)
VALUES
  ('Engineering'),
  ('Sales'),
  ('IT')
RETURNING *;

INSERT INTO employees (employee_name, department_id)
VALUES
  ('John Doe', 1),
  ('Jane Smith', 1),
  ('Alice Johnson', 1),
  ('Bob Brown', 2)
RETURNING *;
```

Output:

The `departments` table:

```
 id | department_name
----+-----------------
  1 | Engineering
  2 | Sales
  3 | IT
(3 rows)
```

The `employees` table:

```
 id | employee_name | department_id
----+---------------+---------------
  1 | John Doe      |             1
  2 | Jane Smith    |             1
  3 | Alice Johnson |             1
  4 | Bob Brown     |             2
(4 rows)
```

Third, use the `jsonb_agg()` function to retrieve departments and a list of employees for each department in the form of a JSON array:

```
SELECT
  department_name,
  jsonb_agg (employee_name) AS employees
FROM
  departments d
  LEFT JOIN employees e ON d.id = e.department_id
GROUP BY
  department_name;
```

Output:

```
 department_name |                  employees
-----------------+---------------------------------------------
 Engineering     | ["John Doe", "Jane Smith", "Alice Johnson"]
 Sales           | ["Bob Brown"]
 IT              | [null]
(3 rows)
```

In this example, the IT department has no employees therefore `jsonb_agg()` function returns an array that contains a null value.

To skip the null and make the JSON array an empty array, you can use the `jsonb_agg_strict()` function:

```
SELECT
  department_name,
  jsonb_agg_strict (employee_name) AS employees
FROM
  departments d
  LEFT JOIN employees e ON d.id = e.department_id
GROUP BY
  department_name;
```

Output:

```
 department_name |                  employees
-----------------+---------------------------------------------
 Engineering     | ["John Doe", "Jane Smith", "Alice Johnson"]
 Sales           | ["Bob Brown"]
 IT              | []
(3 rows)
```

The `jsonb_agg_strict()` function works like the `jsonb_agg()` except that it skips the null values.

## Summary

- Use the `jsonb_agg()` function to aggregate values into a JSON array.
