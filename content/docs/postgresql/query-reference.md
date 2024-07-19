---
title: Postgres query reference
subtitle: Find examples of commonly-used Postgres queries for basic to advanced
  operations
enableTableOfContents: true
redirectFrom:
  - /docs/postgres/query-reference
updatedOn: '2024-07-19T21:48:31.743Z'
---

<CTA />

## Create a table

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

See [CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html) for more information.

## Add, rename, drop a column

```sql
-- Add a column to the table
ALTER TABLE users ADD COLUMN date_of_birth DATE;

-- Rename a column in the table
ALTER TABLE users RENAME COLUMN email TO user_email;

-- Drop a column from the table
ALTER TABLE users DROP COLUMN date_of_birth;
```

See [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) for more information.

## Insert, update, delete data

```sql
-- Insert data into the users table
INSERT INTO users (username, email) VALUES ('alex', 'alex@domain.com');

-- Update data in the users table
UPDATE users SET email = 'new.alex@domain.com' WHERE user_id = 1;

-- Delete data from the users table
DELETE FROM users WHERE user_id = 1;
```

See [INSERT](https://www.postgresql.org/docs/current/sql-insert.html), [UPDATE](https://www.postgresql.org/docs/current/sql-update.html), and [DELETE](https://www.postgresql.org/docs/current/sql-delete.html) for more information.

## SELECT queries

These Postgres `SELECT` query examples cover a number of common use cases.

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

See [SELECT](https://www.postgresql.org/docs/current/sql-select.html) for more information.

## Filter data

These Postgres `WHERE` clause examples showcase various filtering scenarios.

{/*

CREATE TABLE orders (
order_id SERIAL PRIMARY KEY,
customer_id INT NOT NULL,
order_date DATE NOT NULL,
total_amount DECIMAL NOT NULL
);

INSERT INTO orders (customer_id, order_date, total_amount) VALUES
(1, '2023-01-10', 100.00),
(2, '2023-01-20', 150.50),
(3, '2023-02-05', 200.75);

CREATE TABLE products (
product_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
category_id INT NOT NULL,
price DECIMAL NOT NULL
);

INSERT INTO products (name, category_id, price) VALUES
('Laptop', 1, 1200.00),
('Smartphone', 2, 800.00),
('Headphones', 5, 150.00);

CREATE TABLE employees (
employee_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
department_id INT NOT NULL
);

INSERT INTO employees (name, department_id) VALUES
('John Doe', 1),
('Jane Smith', 2),
('Alice Johnson', 3);

CREATE TABLE customers (
customer_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
country VARCHAR(50) NOT NULL
);

INSERT INTO customers (name, email, country) VALUES
('Customer One', 'one@domain.com', 'Spain'),
('Customer Two', 'two@otherdomain.com', 'France'),
('Customer Three', 'three@domain.com', 'Spain');

CREATE TABLE sales (
sale_id SERIAL PRIMARY KEY,
amount DECIMAL NOT NULL,
sales_date DATE NOT NULL
);

INSERT INTO sales (amount, sales_date) VALUES
(550.00, '2023-01-15'),
(450.00, '2023-02-10'),
(600.00, '2023-01-25');

CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
last_login DATE
);

INSERT INTO users (username, last_login) VALUES
('alex', NULL),
('dana', '2023-01-01'),
('pat', NULL);

*/}

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

See [WHERE clause](https://www.postgresql.org/docs/7.1/queries.html#QUERIES-WHERE) for more information and examples.

## Sort data

These sorting examples demonstrate various ways to order your query results.

{/*

CREATE TABLE orders (
order_id SERIAL PRIMARY KEY,
customer_id INT,
status VARCHAR(50),
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO orders (customer_id, status, created_at) VALUES
(1, 'shipped', '2023-03-20 10:00:00'),
(2, 'pending', '2023-03-21 08:30:00'),
(3, 'completed', '2023-03-19 09:45:00');

CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, created_at) VALUES
('john_doe', '2022-01-15 07:00:00'),
('jane_smith', '2021-05-20 13:00:00'),
('alice_jones', '2023-02-11 16:30:00');

CREATE TABLE tasks (
task_id SERIAL PRIMARY KEY,
description TEXT,
due_date DATE NULL
);

INSERT INTO tasks (description, due_date) VALUES
('Finish project report', '2023-04-20'),
('Prepare for presentation', NULL),
('Update website', '2023-03-25');

*/}

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

For additional information, see [Sorting Rows](https://www.postgresql.org/docs/current/queries-order.html).

## Join tables

These examples illustrate different ways to join tables in Postgres for queries involving data that spans multiple tables.

{/*

CREATE TABLE employees (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
department_id INT,
manager_id INT REFERENCES employees(id)
);

-- Sample inserts
INSERT INTO employees (name, department_id, manager_id) VALUES
('John Doe', 1, NULL), -- Assuming John Doe is a manager
('Jane Smith', 1, 1),
('Alice Johnson', 2, NULL); -- Assuming Alice Johnson is a manager

CREATE TABLE departments (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
office_id INT -- This will reference `offices` table
);

-- Sample inserts
INSERT INTO departments (name, office_id) VALUES
('Engineering', 1),
('Marketing', 2);

CREATE TABLE projects (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL
);

-- Sample inserts (Optional for CROSS JOIN, but provides context)
INSERT INTO projects (title) VALUES
('Project Alpha'),
('Project Beta');

CREATE TABLE offices (
id SERIAL PRIMARY KEY,
location VARCHAR(255) NOT NULL
);

-- Sample inserts
INSERT INTO offices (location) VALUES
('New York'),
('San Francisco');

-- Last join

CREATE TABLE departments (
department_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL
);

CREATE TABLE employees (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Insert into departments
INSERT INTO departments (name) VALUES ('Engineering'), ('Marketing');

-- Assuming 'Engineering' has department_id = 1, 'Marketing' = 2
-- Insert into employees
INSERT INTO employees (name, department_id) VALUES ('John Doe', 1), ('Jane Smith', 2);

SELECT employees.name, departments.name AS department_name
FROM employees
JOIN departments USING(department_id);

*/}

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

For additional examples and information, see [Joins between tables](https://www.postgresql.org/docs/current/tutorial-join.html).

## Transactions

Transactions in Postgres ensure that a sequence of operations is executed as a single unit of work, either completely succeeding or failing together. Here are basic examples demonstrating how to use transactions in Postgres:

{/*

CREATE TABLE accounts (
account_id SERIAL PRIMARY KEY,
user_id INT NOT NULL,
balance DECIMAL NOT NULL
);

INSERT INTO accounts (user_id, balance) VALUES
(1, 1000), -- Initial balance for user 1
(2, 500), -- Initial balance for user 2
(3, 200); -- Initial balance for user 3

*/}

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

For additional information, see [Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html).

## Indexes

Creating and managing indexes is crucial for improving query performance in Postgres. Here are some basic examples of how to work with indexes:

{/*

CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL,
username VARCHAR(50) NOT NULL UNIQUE,
active BOOLEAN NOT NULL,
preferences JSONB
);

-- Sample inserts
INSERT INTO users (email, username, active, preferences) VALUES
('john.doe@example.com', 'johndoe', TRUE, '{"theme": "dark", "notifications": "enabled"}'),
('jane.doe@example.com', 'janedoe', FALSE, '{"theme": "light", "notifications": "disabled"}');

CREATE TABLE events (
event_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
event_date DATE NOT NULL
);

-- Sample inserts
INSERT INTO events (name, event_date) VALUES
('Product Launch', '2023-05-15'),
('Annual Meeting', '2023-12-20');

*/}

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

For more information about indexes in Postgres, see [Indexes](https://www.postgresql.org/docs/current/indexes.html).

## Views

These examples demonstrate how to work with views in Postgres, which can help simplify complex queries, provide a level of abstraction, or secure data access.

{/*

CREATE TABLE employees (
employee_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
department VARCHAR(100) NOT NULL,
position VARCHAR(100) NOT NULL,
active BOOLEAN NOT NULL,
hire_date DATE NOT NULL,
salary DECIMAL(10, 2) NOT NULL
);

-- Inserting sample data into the employees table
INSERT INTO employees (name, department, position, active, hire_date, salary) VALUES
('John Doe', 'Engineering', 'Software Engineer', true, '2018-06-12', 90000.00),
('Jane Smith', 'Marketing', 'Marketing Manager', true, '2019-07-16', 85000.00),
('Jim Brown', 'Engineering', 'DevOps Specialist', false, '2020-08-20', 95000.00),
('Emily White', 'Sales', 'Sales Representative', true, '2021-09-23', 65000.00);

*/}

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

Standard views are virtual tables that do not store the data directly but represent the results of a query. Materialized views, on the other hand, store the result of the query on disk, acting like a snapshot that can boost performance for costly operations, at the expense of needing periodic refreshes to stay up-to-date.

For more information about views in Postgres, see [Views](https://www.postgresql.org/docs/current/tutorial-views.html).

## Stored procedures

Stored procedures in Postgres are used for performing actions that do not necessarily return a result set, such as modifying data or working with transaction control statements like `COMMIT` and `ROLLBACK`.

{/*

CREATE TABLE accounts (
account_id SERIAL PRIMARY KEY,
balance DECIMAL(10, 2) NOT NULL
);

INSERT INTO accounts (account_id, balance) VALUES
(1, 1000.00),
(2, 500.00);

*/}

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

-- See result
SELECT * FROM accounts;
```

For additional information and syntax, see [CREATE PROCEDURE](https://www.postgresql.org/docs/current/sql-createprocedure.html).

## Functions

Functions in Postgres can return a single value, a record, or a set of records.

{/*

CREATE TABLE employees (
id SERIAL PRIMARY KEY,
name VARCHAR(255),
department VARCHAR(100)
);

INSERT INTO employees (name, department) VALUES
('John Doe', 'Engineering'),
('Jane Smith', 'Marketing'),
('Alice Johnson', 'Human Resources'),
('Bob Brown', 'Engineering');

*/}

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

Functions are typically used to perform computations. For additional information and syntax, see [CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html).

## Performance tuning

To analyze query performance in Postgres, you can use a combination of built-in views, extensions, and commands that help identify performance bottlenecks and optimize query execution. Here are some examples:

### Use pg_stat_statements

`pg_stat_statements` is an extension that provides a means to track execution statistics of all executed SQL statements.

First, ensure the extension is enabled in your Postgres database:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Then, you can query the `pg_stat_statements` view to analyze query performance. For example, this query lists the top 100 most frequently executed queries in the database:

```sql
SELECT
  userid,
  query,
  calls,
  total_exec_time / 1000 AS total_seconds,
  mean_exec_time AS avg_ms
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 100;
```

For more information and examples, refer to our [pg_stat_statements extension guide](/docs/extensions/pg_stat_statements), or [Gathering statistics](/docs/postgresql/query-performance#gather-statistics) in our query optimization guide.

### Use EXPLAIN

The `EXPLAIN` command shows the execution plan of a query, detailing how tables are scanned, joined, and which indexes are used.

```sql
EXPLAIN SELECT * FROM employees WHERE department_id = 1;
```

Using `EXPLAIN ANALYZE` is a step further than `EXPLAIN`, as it executes the query, providing actual execution times and row counts instead of estimated values.

```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE department_id = 1;
```

For more information, refer to the [EXPLAIN](/docs/postgresql/query-performance#use-explain) section in our query optimization guide.

### Index metrics

This query lists the number of index scans performed for all user-defined indexes.

```sql
SELECT indexrelname, relname, idx_scan FROM pg_stat_user_indexes;
```

The query returns the number of sequential scans for all user-defined tables, indicating missing indexes.

```sql
SELECT relname, seq_scan FROM pg_stat_user_tables;
```

For related information and more queries, see [Use indexes](/docs/postgresql/query-performance#use-indexes) in our query optimization guide.

### Read metrics

This query returns the number of rows fetched per database from storage or memory. It includes rows that are accessed to fulfill queries, which may involve filtering, joining, or processing of data. Not all fetched rows are necessarily sent back to the client, as some may be intermediate results used for query processing.

```sql
SELECT datname, tup_fetched FROM pg_stat_database;
```

This query returns the number of rows returned per database to the client after a query. This is the final set of rows after applying any filters, aggregates, or transformations specified by the query. These are typically the number of rows the client application or user sees as the query result.

```sql
SELECT datname, tup_returned FROM pg_stat_database;
```

### Write metrics

This query returns the number of rows inserted, updated, or deleted _per database_.

```sql
SELECT datname, tup_inserted, tup_updated, tup_deleted FROM pg_stat_database;
```

This query returns the number of rows inserted, updated, or deleted _per table_.

```sql
SELECT relname, n_tup_ins, n_tup_upd, n_tup_del FROM pg_stat_user_tables;
```

### List running queries by duration

To see currently running queries and their execution time, which can help identify long-running queries.

```sql
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

### Check for locks waiting to be granted

This query checks for locks that are currently waiting to be granted, which can be a sign of potential performance issues or deadlocks.

```sql
SELECT pg_locks.pid, relation::regclass, mode, query
FROM pg_locks
JOIN pg_stat_activity ON pg_locks.pid = pg_stat_activity.pid
WHERE NOT granted;
```

### Check for deadlocks by database

This query checks for deadlocks that have occurred, summarized by database.

```sql
SELECT datname, deadlocks FROM pg_stat_database;
```

### Count locks by table and lock mode

This query counts the number of locks per lock mode and table in a Postgres database, excluding system tables prefixed with `pg_`.

```sql
SELECT
    mode,
    pg_class.relname,
    COUNT(*)
FROM
    pg_locks
    JOIN pg_class ON pg_locks.relation = pg_class.oid
WHERE
    pg_locks.mode IS NOT NULL
    AND pg_class.relname NOT LIKE 'pg_%' ESCAPE '\'
GROUP BY
    pg_class.relname,
    mode;
```

### Index usage

Run this query to assess how effectively your queries are using indexes.

```sql
SELECT relname, seq_scan, idx_scan, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables
WHERE idx_scan < seq_scan AND idx_scan > 0
ORDER BY seq_scan DESC;
```

This `pg_stat_user_tables` query helps identify tables where sequential scans are more common than index scans, indicating potential areas for performance improvement through better indexing. The `pg_stat_user_tables` view is part of the Postgres [Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html).

Also, see the [Use indexes](/docs/postgresql/query-performance#use-indexes) section in our query optimization guide.

### Table access statistics

This query shows how frequently tables are accessed, which can help in identifying which tables are hot for reads or writes.

```sql
SELECT relname, seq_scan, idx_scan, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;
```

### VACUUM and ANALYZE statistics

This query checks the last time vacuum and analyze were run on each table, which helps ensure that your database is being maintained properly for query optimization.

```sql
SELECT schemaname, relname, last_vacuum, last_autovacuum, last_analyze, last_autoanalyze
FROM pg_stat_user_tables;
```

### Check for dead rows

This query fetches the names of user tables and the number of dead tuples (rows) in each.

```sql
SELECT relname, n_dead_tup FROM pg_stat_user_tables;
```

### Dead row percentage

This query calculates the percentage of dead rows compared to the total number of rows (alive and dead) in each user table within a Postgres database, helping identify potential table bloat and optimization opportunities. For related information, see [Check for table or index bloat](/docs/postgresql/query-performance#check-for-table-or-index-bloat).

```sql
SELECT
    relname,
    n_dead_tup,
    (CASE WHEN (n_live_tup + n_dead_tup) > 0 THEN
        ROUND((n_dead_tup::FLOAT / (n_live_tup + n_dead_tup))::numeric, 2)
    ELSE
        0
    END) AS dead_rows_percentage
FROM
    pg_stat_user_tables;
```

## Connections

The queries in this section use the [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) view, which is part of the Postgres [Cumulative Statistics System](https://www.postgresql.org/docs/current/monitoring-stats.html).

### Get the number of active connections

```sql
SELECT COUNT(*) FROM pg_stat_activity WHERE state='active';
```

### Get the maximum number of connections

Get the maximum number of connections for your Postgres instance.

```sql
SHOW max_connections;
```

The `max_connections` setting is configured by Neon according to your compute size. See [Connection limits without connection pooling](https://neon.tech/docs/connect/connection-pooling#connection-limits-without-connection-pooling).

<Admonition type="tip">
You can use [connection pooling](https://neon.tech/docs/connect/connection-pooling#connection-pooling) to increase your concurrent connection limit.
</Admonition>

### Get the percentage of maximum connections in use

```sql
SELECT (SELECT SUM(numbackends) FROM pg_stat_database) / (SELECT
setting::float FROM pg_settings WHERE name = 'max_connections');
```

This query only considers your `max_connections` setting. It does not account for [connection pooling](https://neon.tech/docs/connect/connection-pooling#connection-pooling).

### Get the current number of connections for a database

```sql
SELECT COUNT(*) FROM pg_stat_activity WHERE datname = 'your_database_name';
```

### Check for connections by user

```sql
SELECT usename, count(*)
FROM pg_stat_activity
GROUP BY usename;
```

### Find long-running or idle connections

```sql
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM
  pg_stat_activity
WHERE
  (now() - pg_stat_activity.query_start) > INTERVAL '1 minute'
  OR state = '<idle>';
```

### Drop long-running or idle connections

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'databasename'
  AND pid <> pg_backend_pid()
  AND state IN ('idle');
```

<Admonition type="note">
To terminate a session, you can run `pg_cancel_backend(pid)` or `pg_terminate_backend(pid)`. The first command terminates the currently executing query, and the second one (used in the query above) terminates both the query and the session.
</Admonition>

## Postgres version

Run this query to view your Postgres version.

```sql
SELECT version();
```

## Postgres settings

Run this query to view parameter settings for your Postgres instance.

```sql
SHOW ALL;
```

## Data size

Run this query to check the logical data size for a branch in Neon.

```sql
SELECT pg_size_pretty(sum(pg_database_size(datname)))
FROM pg_database;
```

Alternatively, you can check the **Data size** value on the **Branches** page in the Neon Console, which gives you the data size for the databases on that branch.

<Admonition type="note">
Data size does not include the [history](/docs/reference/glossary#history) that is maintained in Neon to support features like point-in-time restore.
</Admonition>

<NeedHelp/>
