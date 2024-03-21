---
title: Postgres query reference
subtitle: Find examples and templates for commonly-used Postgres queries
enableTableOfContents: true
---

This page provides a reference for common Postgres queries, providing examples for basic operations to advanced use cases.

## Basic operations

Here are some examples of basic database operations in Postgres:

### Creating a table

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

See [CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html) for more information. 

### Inserting data

```sql
INSERT INTO users (username, email) VALUES ('alex', 'alex@domain.com');
```

See [INSERT](https://www.postgresql.org/docs/current/sql-insert.html) for more information.

### Updating data

```sql
UPDATE users SET email = 'new.alex@domain.com' WHERE user_id = 1;
```

See [Update](https://www.postgresql.org/docs/current/sql-update.html) for more information.

### Deleting data

```sql
DELETE FROM users WHERE user_id = 1;
```

See [Delete](https://www.postgresql.org/docs/current/sql-delete.html) for more information.

## Querying data

### Select queries

Here are a few examples of `SELECT` queries in Postgres that cover common use cases:


```sql
-- Basic SELECT to retrieve all columns from a table
SELECT * FROM users;

-- SELECT specific columns from a table
SELECT username, email FROM users;

-- SELECT with filtering using WHERE clause
SELECT * FROM users WHERE user_id > 10;

-- SELECT with ordering and limiting the results
SELECT username, email FROM users ORDER BY created_at DESC LIMIT 5;

-- SELECT with aggregation and grouping
SELECT COUNT(*) AS total_users, EXTRACT(YEAR FROM created_at) AS year FROM users GROUP BY year ORDER BY year;
```

These examples show how to perform a basic retrieval of all or specific columns from a table, filter results using a condition, order and limit the output, and use aggregation functions along with grouping to summarize data.

See [SELECT](https://www.postgresql.org/docs/current/sql-select.html) for more information.

### Filtering data

Here are some examples of using the `WHERE` clause to filter data in Postgres, showcasing various filtering scenarios:

```sql
-- Filter by an exact match
SELECT * FROM users WHERE username = 'alex';

-- Filter by a range
SELECT * FROM orders WHERE order_date BETWEEN '2023-01-01' AND '2023-01-31';

-- Filter using a list of values (IN operator)
SELECT * FROM products WHERE category_id IN (1, 2, 5);

-- Filter excluding a set of values (NOT IN operator)
SELECT * FROM employees WHERE department_id NOT IN (3, 4);

-- Filter using pattern matching (LIKE operator)
SELECT * FROM customers WHERE email LIKE '%@domain.com';

-- Combine multiple conditions (AND, OR)
SELECT * FROM sales WHERE amount > 500 AND (sales_date >= '2023-01-01' AND sales_date <= '2023-01-31');

-- Filter using NULL values
SELECT * FROM users WHERE last_login IS NULL;

-- Filter using subqueries
SELECT * FROM orders WHERE customer_id IN (SELECT customer_id FROM customers WHERE country = 'Spain');
```

These examples illustrate how to filter query results based on exact matches, ranges, lists of values, pattern matching with `LIKE`, combining multiple conditions with `AND` and `OR`, handling `NULL` values, and leveraging subqueries for more complex conditions.

See [WHERE clause](https://www.postgresql.org/docs/7.1/queries.html#QUERIES-WHERE) for more information and examples.

### Sorting data

Here are examples of sorting data in Postgres, demonstrating various ways to order your query results:

```sql
-- Sort results in ascending order by a single column
SELECT * FROM users ORDER BY username ASC;

-- Sort results in descending order by a single column
SELECT * FROM users ORDER BY created_at DESC;

-- Sort results by multiple columns
-- First by status in ascending order, then by created_at in descending order
SELECT * FROM orders ORDER BY status ASC, created_at DESC;

-- Sort using a column alias
SELECT username, created_at, EXTRACT(YEAR FROM created_at) AS year FROM users ORDER BY year DESC;

-- Sort by an expression
SELECT username, LENGTH(username) AS username_length FROM users ORDER BY username_length ASC;

-- Sort NULL values to the end (using NULLS LAST)
SELECT * FROM tasks ORDER BY due_date ASC NULLS LAST;

-- Sort NULL values to the start (using NULLS FIRST)
SELECT * FROM tasks ORDER BY due_date DESC NULLS FIRST;
```

These queries demonstrate the flexibility of the Postgres `ORDER BY` clause, enabling sorting by single or multiple columns, using column aliases, sorting by computed expressions, and explicitly controlling the order of null values.

For additional information, see [Sorting Rows](https://www.postgresql.org/docs/current/queries-order.html).

### Joining tables

Here are some examples illustrating different ways to join tables in Postgres, which can be essential for queries involving data that spans multiple tables:

```sql
-- INNER JOIN to select rows that have matching values in both tables
SELECT employees.name, departments.name AS department_name
FROM employees
INNER JOIN departments ON employees.department_id = departments.id;

-- LEFT JOIN (or LEFT OUTER JOIN) to include all rows from the left table and matched rows from the right table
SELECT employees.name, departments.name AS department_name
FROM employees
LEFT JOIN departments ON employees.department_id = departments.id;

-- RIGHT JOIN (or RIGHT OUTER JOIN) to include all rows from the right table and matched rows from the left table
SELECT employees.name, departments.name AS department_name
FROM employees
RIGHT JOIN departments ON employees.department_id = departments.id;

-- FULL OUTER JOIN to select rows when there is a match in one of the tables
SELECT employees.name, departments.name AS department_name
FROM employees
FULL OUTER JOIN departments ON employees.department_id = departments.id;

-- CROSS JOIN to produce a Cartesian product of the two tables
SELECT employees.name, projects.title
FROM employees
CROSS JOIN projects;

-- SELF JOIN to join a table to itself, as if the table were two tables, temporarily renaming at least one table in the SQL statement
SELECT a.name AS employee_name, b.name AS manager_name
FROM employees a, employees b
WHERE a.manager_id = b.id;

-- Joining Multiple Tables
SELECT employees.name, departments.name AS department_name, offices.location
FROM employees
INNER JOIN departments ON employees.department_id = departments.id
INNER JOIN offices ON departments.office_id = offices.id;

-- Using USING() to specify join condition when both tables have the same column name
SELECT employees.name, departments.name AS department_name
FROM employees
JOIN departments USING(department_id);
```

These examples cover the different types of joins available in Postgres, from the basic inner join to more complex scenarios involving multiple tables, self-joins, and using the `USING()` clause for join conditions.

For additional examples and information, see [Joins between tables](https://www.postgresql.org/docs/current/tutorial-join.html).

## Advanced topics
### Transactions

Transactions in Postgres ensure that a sequence of operations is executed as a single unit of work, either completely succeeding or failing together. Here are basic examples demonstrating how to use transactions in Postgres:

```sql
-- Start a transaction
BEGIN;

-- Perform several operations within the transaction
INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- Commit the transaction to make changes permanent
COMMIT;

-- Start another transaction
BEGIN;

-- Perform operations
UPDATE accounts SET balance = balance - 50 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 50 WHERE user_id = 3;

-- Rollback the transaction in case of an error or if operations should not be finalized
ROLLBACK;

-- Demonstrating transaction with SAVEPOINT
BEGIN;
INSERT INTO accounts (user_id, balance) VALUES (3, 500);

-- Create a savepoint
SAVEPOINT my_savepoint;

UPDATE accounts SET balance = balance - 100 WHERE user_id = 3;
-- Assume an error or a need to revert to the savepoint
ROLLBACK TO SAVEPOINT my_savepoint;

-- Proceed with other operations or end transaction
COMMIT;
```

These examples show the basic structure of transactions in Postgres, including how to start (`BEGIN`), commit (`COMMIT`), and roll back (`ROLLBACK`) transactions. The use of a savepoint (`SAVEPOINT`) is also demonstrated, allowing partial rollback within a transaction. Transactions are important for maintaining data integrity, especially when multiple related operations must either all succeed or fail together.

For additional information, see [Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html).

### Indexes

Creating and managing indexes is crucial for improving query performance in Postgres. Here are some basic examples of how to work with indexes:

```sql
-- Create a basic index on a single column
CREATE INDEX idx_user_email ON users(email);

-- Create a unique index to enforce uniqueness and improve lookup performance
CREATE UNIQUE INDEX idx_unique_username ON users(username);

-- Create a composite index on multiple columns
CREATE INDEX idx_name_date ON events(name, event_date);

-- Create a partial index for a subset of rows that meet a certain condition
CREATE INDEX idx_active_users ON users(email) WHERE active = TRUE;

-- Create an index on an expression (function-based index)
CREATE INDEX idx_lower_email ON users(LOWER(email));

-- Drop an index
DROP INDEX idx_user_email;

-- Create a GIN index on a jsonb column to improve search performance on keys or values within the JSON document
CREATE INDEX idx_user_preferences ON users USING GIN (preferences);

-- Reindex an existing index to rebuild it, useful for improving index performance or reducing physical size
REINDEX INDEX idx_user_email;

-- Create a CONCURRENTLY index, which allows the database to be accessed normally during the indexing operation
CREATE INDEX CONCURRENTLY idx_concurrent_email ON users(email);
```

These examples showcase the variety of indexes that can be created in Postgres, including basic, unique, composite, partial, expression-based, and GIN indexes. They also cover index maintenance operations such as dropping, reindexing, and creating indexes concurrently to minimize lock contention.

For more information about indexes in Postgres, see [Indexes](https://www.postgresql.org/docs/current/indexes.html).

### Views

Here are some examples of how to work with views in Postgres, which can help simplify complex queries, provide a level of abstraction, or secure data access:

```sql
-- Creating a view
CREATE VIEW employee_info AS
SELECT employee_id, name, department, position
FROM employees
WHERE active = true;

-- Querying a view
-- Just like querying a table, you can perform SELECT operations on views.
SELECT * FROM employee_info;

-- Updating a view
-- This requires the view to be updatable, which generally means it must directly map to a single underlying table.
CREATE OR REPLACE VIEW employee_info AS
SELECT employee_id, name, department, position, hire_date
FROM employees
WHERE active = true;

-- Dropping a view
DROP VIEW IF EXISTS employee_info;

-- Creating a materialized view
-- Materialized views store the result of the query physically, and hence, can improve performance but require refreshes.
CREATE MATERIALIZED VIEW department_summary AS
SELECT department, COUNT(*) AS total_employees, AVG(salary) AS average_salary
FROM employees
GROUP BY department;

-- Refreshing a materialized view
REFRESH MATERIALIZED VIEW department_summary;

-- Querying a materialized view
SELECT * FROM department_summary;

-- Dropping a materialized view
DROP MATERIALIZED VIEW IF EXISTS department_summary;
```

These examples cover creating and using both standard and materialized views in Postgres. Standard views are virtual tables that do not store the data directly but represent the results of a query. Materialized views, on the other hand, store the result of the query on disk, acting like a snapshot that can boost performance for costly operations, at the expense of needing periodic refreshes to stay up-to-date.

For more information about views in Postgres, see [Views](https://www.postgresql.org/docs/current/tutorial-views.html).

### Stored procedures

Stored procedures in Postgres are used for performing actions that do not necessarily return a result set, such as modifying data or working with transaction control.

```sql
-- Creating a stored procedure
CREATE OR REPLACE PROCEDURE transfer_funds(source_acc INT, dest_acc INT, transfer_amount DECIMAL)
LANGUAGE plpgsql AS $$
BEGIN
  -- Subtracting amount from source account
  UPDATE accounts SET balance = balance - transfer_amount WHERE account_id = source_acc;
  
  -- Adding amount to destination account
  UPDATE accounts SET balance = balance + transfer_amount WHERE account_id = dest_acc;
  
  COMMIT;
END;
$$;

-- Calling the stored procedure
CALL transfer_funds(1, 2, 100.00);
```

Stored procedures are typically used for executing tasks that may or may not return data and can include transaction control statements like `COMMIT` and `ROLLBACK`.

For additional information and syntax, see [CREATE PROCEDURE](https://www.postgresql.org/docs/current/sql-createprocedure.html).

## Functions

Functions in Postgres can return a single value, a record, or a set of records.

```sql
-- Creating a simple function
CREATE OR REPLACE FUNCTION get_employee_count()
RETURNS integer AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM employees);
END;
$$ LANGUAGE plpgsql;

-- Calling the function
SELECT get_employee_count();

-- Creating a function that takes parameters
CREATE OR REPLACE FUNCTION get_employee_department(emp_id integer)
RETURNS text AS $$
DECLARE
  department_name text;
BEGIN
  SELECT INTO department_name department FROM employees WHERE id = emp_id;
  RETURN department_name;
END;
$$ LANGUAGE plpgsql;

-- Calling the function with a parameter
SELECT get_employee_department(1);
```

Functions are typically used for computations and can return data. For additional information and syntax, see [CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html).

## Performance tuning

To analyze query performance in Postgres, you can use a combination of built-in views, extensions, and commands that help identify performance bottlenecks and optimize query execution. Here are some examples:

### Using EXPLAIN

The `EXPLAIN` command shows the execution plan of a query, detailing how tables are scanned, joined, and which indexes are used.

```sql
EXPLAIN SELECT * FROM employees WHERE department_id = 1;
```

Using `EXPLAIN ANALYZE` is a step further than `EXPLAIN`, as it executes the query and provides actual execution times and row counts.

```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE department_id = 1;
```

For more information, refer to the [EXPLAIN](/docs/postgres/query-performance#use-explain) section in our query optimization guide.

### Using pg_stat_statements

`pg_stat_statements` is an extension that provides a means to track execution statistics of all executed SQL statements.

First, ensure the extension is enabled in your Postgres database:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Then, you can query the `pg_stat_statements` view to analyze query performance:

```sql
SELECT query, calls, total_exec_time, rows, avg_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

For more information and examples, refer to our [pg_stat_statements extension guide](/docs/extensions/pg_stat_statements).

### Viewing activity and locks

To see currently running queries and their execution time, which can help identify long-running queries:

```sql
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

To check for locks that might be affecting performance:

```sql
SELECT pid, relation::regclass, mode, query FROM pg_locks
JOIN pg_stat_activity ON pg_locks.pid = pg_stat_activity.pid
WHERE NOT granted;
```

The queries above use the [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) view, which is part of the Postgres [Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html).

### Analyzing index usage

To assess how effectively your queries are using indexes:

```sql
SELECT relname, seq_scan, idx_scan, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables
WHERE idx_scan < seq_scan AND idx_scan > 0
ORDER BY seq_scan DESC;
```

This `pg_stat_user_tables` query helps identify tables where sequential scans are more common than index scans, indicating potential areas for performance improvement through better indexing. The `pg_stat_user_tables` view is part of the Postgres [Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html).

Also see the [Use indexes](/docs/postgres/query-performance#use-indexes) section in our query performance optimization guide.

## Troubleshooting

### View running queries

```sql
SELECT pid, query, state FROM pg_stat_activity WHERE state != 'idle';
```

This query uses the [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) view, which is part of the Postgres [Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html).

### Cancel a running query

```sql
SELECT pg_cancel_backend(pid);
```

<NeedHelp/>
