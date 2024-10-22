---
title: "PostgreSQL jsonb_agg() Function"
page_title: "PostgreSQL jsonb_agg() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL jsonb_agg() function to aggregate values into a JSON array."
prev_url: "https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_agg/"
ogImage: ""
updatedOn: "2024-02-25T08:14:43+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL jsonb_to_record() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_to_record"
next_page: 
  title: "PostgreSQL jsonb_object_agg() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_object_agg"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_agg()` function to aggregate values into a JSON array.


## Introduction to the PostgreSQL jsonb\_agg() function

The `jsonb_agg()` function is an [aggregate function](../postgresql-aggregate-functions) that allows you to aggregate values into a JSON array.

The `jsonb_agg()` function can be particularly useful when you want to create a JSON array from data of multiple rows.

Here’s the syntax of the `jsonb_agg()` function:


```sqlsql
jsonb_agg(expression)
```
In this syntax:

* `expression`: is any valid expression that evaluates to a JSON value.

The `jsonb_agg()` function returns a JSON array that consists of data from multiple rows.


## PostgreSQL jsonb\_agg() function example

Let’s explore some examples of using the `jsonb_agg()` function.


### 1\) Basic jsonb\_agg() function example

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `products`:


```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
```
Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `products` table:


```sql
INSERT INTO products (name, price) 
VALUES
('Laptop', 1200.00),
('Smartphone', 800.00),
('Headphones', 100.00);
```
Third, use the `jsonb_agg()` function to aggregate product information into a JSON array:


```sql
SELECT 
  jsonb_agg(
    jsonb_build_object('name', name, 'price', price)
  ) AS products 
FROM 
  products;
```
Output:


```sql
                                                         products
--------------------------------------------------------------------------------------------------------------------------
 [{"name": "Laptop", "price": 1200.00}, {"name": "Smartphone", "price": 800.00}, {"name": "Headphones", "price": 100.00}]
(1 row)
```

### 2\) Using jsonb\_agg() function with GROUP BY clause

First, [create new tables](../postgresql-tutorial/postgresql-create-table) called `departments` and `employees`:


```sql
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


```sql
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


```sql
 id | department_name
----+-----------------
  1 | Engineering
  2 | Sales
(2 rows)
```
The `employees` table:


```sql
 id | employee_name | department_id
----+---------------+---------------
  1 | John Doe      |             1
  2 | Jane Smith    |             1
  3 | Alice Johnson |             1
  4 | Bob Brown     |             2
(4 rows)
```
Third, use the `jsonb_agg()` function to retrieve departments and a list of employees for each department in the form of a JSON array:


```sql
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


```sql
 department_name |                  employees
-----------------+---------------------------------------------
 Engineering     | ["John Doe", "Jane Smith", "Alice Johnson"]
 Sales           | ["Bob Brown"]
(2 rows)
```

### 3\) Using jsonb\_agg() function with NULLs

First, drop the departments and employees tables:


```sql
DROP TABLE employees;
DROP TABLE departments;
```
Second, recreate the departments and employees tables:


```sql
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


```sql
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


```sql
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


```sql
 department_name |                  employees
-----------------+---------------------------------------------
 Engineering     | ["John Doe", "Jane Smith", "Alice Johnson"]
 Sales           | ["Bob Brown"]
 IT              | [null]
(3 rows)
```
In this example, the IT department has no employees therefore `jsonb_agg()` function returns an array that contains a null value.

To skip the null and make the JSON array an empty array, you can use the `jsonb_agg_strict()` function:


```sql
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

* Use the `jsonb_agg()` function to aggregate values into a JSON array.

