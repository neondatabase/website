---
title: The pg_stat_statements extension
subtitle: pg_stat_statements enables tracking, planning and execution statistics for SQL statements.
enableTableOfContents: true
---


The `pg_stat_statements` extension provides a detailed statistical view of SQL statement execution within a PostgreSQL database. It tracks information such as execution counts, total and average execution times, and more, helping database administrators and developers analyze and optimize SQL query performance. It also helps analyze usage patterns to right-size your database and tune configuration parameters.

This guide covers:

- Enabling `pg_stat_statements`
- Querying the extension's view
- Identifying slow queries 
- Finding queries that return many rows
- Resetting statistics

<Admonition type="note">
`pg_stat_statements` is an open-source extension for Postgres that can be installed on any Neon Project using the instructions below.
</Admonition>


**Version availability:**


The version of `pg_stat_statements` available on Neon depends on the version of Postgres you select for your Neon project.


- Postgres 14 - `pg_stat_statements` 1.9
- Postgres 15 - `pg_stat_statements` 1.10
- Postgres 16 - `pg_stat_statements` 1.10


_Only [Apache-2](https://docs.timescale.com/about/latest/timescaledb-editions/) licensed features are supported. Compression is not supported._




## Enable the `pg_stat_statements` extension


You can enable the extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.


```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```


For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).


## Usage examples


**Query the pg_stat_statements view**


The main interface is a view - `pg_stat_statements` - that contains one row per distinct database query, showing various statistics.

```sql
SELECT * FROM pg_stat_statements LIMIT 10;
```

Output contains details like:

```text
| userid | dbid  | queryid               | query                 | calls |
|--------|-------|-----------------------|-----------------------|-------|
| 16391  | 16384 | -9047282044438606287  | SELECT * FROM users;  | 10    |
```


Let's explore some example usage patterns.

**Find most executed queries**

Most frequently run queries often are critical paths and optimization candidates. 

In the below query, you select the `query` and `calls` columns, representing the SQL statement and the number of times each statement has been executed, respectively - only the top 10 rows are returned (`LIMIT 10`).


```sql
SELECT query, calls 
FROM pg_stat_statements  
ORDER BY calls DESC
LIMIT 10;
```

```text
| Query                                                                                      | Calls |
|--------------------------------------------------------------------------------------------|-------|
| SELECT * FROM products WHERE inventory > 10;                                               |  8723 |
| SELECT * FROM users WHERE last_login >= '2023-01-01';                                      |  5892 |
| UPDATE products SET price = price * 1.10;                                                  |  4231 |
| SELECT * FROM orders WHERE delivery_date BETWEEN '2023-01-01' AND '2023-01-31';            |  2938 |
| INSERT INTO audit_log (user_id, action, changed_on) VALUES ($1, $2, CURRENT_TIMESTAMP);    |  1849 |
```




**Monitor slow queries**


High average runtime can indicate an inefficient query.


In the query below, you use the `query`, `mean_exec_time` (average execution time per call), and `calls` columns. The condition `WHERE mean_exec_time > 1` filters out queries with an average execution time greater than 1 unit (you may adjust this threshold as needed).


```sql
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 1
ORDER BY mean_exec_time DESC;
```


```text
| Query                                         | Mean Time | Calls |
|-----------------------------------------------|-----------|-------|
| SELECT p.*, c.name AS category FROM products  | 250.60ms  |  723  |
```


**Identify queries that return many rows**


You can select the `query` and `rows` columns, representing the SQL statement and the number of rows returned by each statement, respectively.


```sql
SELECT query, rows
FROM pg_stat_statements
ORDER BY rows DESC
LIMIT 10;
```


```
| Query                                             | Rows    |
|---------------------------------------------------|---------|
| SELECT * FROM products;                           | 112,394 |
| SELECT * FROM users;                              | 98,723  |
| SELECT p.*, c.name AS category FROM products      | 23,984  |
```


**Reset**


When executed, `pg_stat_statements_reset()` command resets the accumulated statistical data, such as execution times and counts for SQL statements, to zero. It's particularly useful in scenarios where you want to start fresh with collecting performance statistics without restarting the entire PostgreSQL server.


```sql
SELECT pg_stat_statements_reset();
```


## Resources

- [PostgreSQL documentation for `pgstatstatements`](https://www.postgresql.org/docs/current/pgstatstatements.html)
