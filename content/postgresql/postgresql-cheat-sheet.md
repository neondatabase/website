---
title: 'PostgreSQL Cheat Sheet'
page_title: 'PostgreSQL Cheat Sheet - Download the Cheat Sheet in PDF Format'
page_description: 'The PostgreSQL cheat sheet provides you with the common PostgreSQL commands and statements that enable you to work with PostgreSQL quickly and effectively.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-cheat-sheet/'
ogImage: '/postgresqltutorial/PostgreSQL-Cheat-Sheet-300x204.png'
updatedOn: '2024-01-16T00:36:34+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL C#: Call a Stored Procedure'
  slug: 'postgresql-csharp/postgresql-csharp-call-a-stored-procedure'
nextLink:
  title: 'PostgreSQL Resources'
  slug: 'postgresql-resources'
---

![PostgreSQL Cheat Sheet](/postgresqltutorial/PostgreSQL-Cheat-Sheet-300x204.png?alignright)The **PostgreSQL cheat sheet** provides you with the common PostgreSQL commands and statements that enable you to work with PostgreSQL quickly and effectively.

## Download the PostgreSQL cheat sheet

We provide you with a 3\-page PostgreSQL cheat sheet in PDF format. You can download and print it out for a quick reference to the most commonly used statements in PostgreSQL:

[Download the PostgreSQL Cheat Sheet](/postgresqltutorial/PostgreSQL-Cheat-Sheet.pdf)

## PostgreSQL commands

Access the PostgreSQL server from **psql** with a specific user:

```csssql
psql -U [username];
```

For example, the following command uses the `postgres` user to access the PostgreSQL database server:

```
psql -U postgres
```

Connect to a specific database:

```sql
\c database_name;
```

For example, the following command connects to the `dvdrental` database:

```
\c dvdrental;
You are now connected to database "dvdrental" as user "postgres".
```

To quit the psql:

```sql
\q
```

[List all databases](postgresql-administration/postgresql-show-databases) in the PostgreSQL database server

```
\l
```

List all schemas:

```
\dn
```

List all [stored procedures](https://neon.tech/postgresql/postgresql-plpgsql) and functions:

```sql
\df
```

List all [views](postgresql-views):

```
\dv
```

[Lists all tables](postgresql-administration/postgresql-show-tables) in a current database.

```sql
\dt
```

Or to get more information on tables in the current database:

```
\dt+
```

Get detailed information on a table.

```
\d+ table_name
```

Show a [stored procedure](https://neon.tech/postgresql/postgresql-plpgsql) or function code:

```
\df+ function_name
```

Show query output in the pretty format:

```
\x
```

List all users:

```
\du
```

Create a new [role](postgresql-administration/postgresql-roles):

```
CREATE ROLE role_name;
```

Create a new role with a `username` and `password`:

```
CREATE ROLE username NOINHERIT LOGIN PASSWORD password;
```

Change the role for the current session to the `new_role`:

```
SET ROLE new_role;
```

Allow `role_1` to set its role as `role_2:`

```
GRANT role_2 TO role_1;
```

## Managing databases

[Create a new database](postgresql-administration/postgresql-create-database):

```sql
CREATE DATABASE [IF NOT EXISTS] db_name;
```

[Delete a database permanently](postgresql-administration/postgresql-drop-database):

```sql
DROP DATABASE [IF EXISTS] db_name;
```

## Managing tables

[Create a new table](postgresql-tutorial/postgresql-create-table) or a [temporary table](postgresql-tutorial/postgresql-temporary-table)

```sql
CREATE [TEMP] TABLE [IF NOT EXISTS] table_name(
   pk SERIAL PRIMARY KEY,
   c1 type(size) NOT NULL,
   c2 type(size) NULL,
   ...
);
```

[Add a new column](postgresql-tutorial/postgresql-add-column) to a table:

```sql
ALTER TABLE table_name ADD COLUMN new_column_name TYPE;
```

[Drop a column](postgresql-tutorial/postgresql-drop-column) in a table:

```sql
ALTER TABLE table_name
DROP COLUMN column_name;
```

[Rename a column](postgresql-tutorial/postgresql-rename-column):

```sql
ALTER TABLE table_name
RENAME column_name TO new_column_name;
```

Set or remove a default value for a column:

```sql
ALTER TABLE table_name
ALTER COLUMN [SET DEFAULT value | DROP DEFAULT]
```

Add a [primary key](postgresql-tutorial/postgresql-primary-key)to a table.

```sql
ALTER TABLE table_name
ADD PRIMARY KEY (column,...);
```

Remove the primary key from a table.

```
ALTER TABLE table_name
DROP CONSTRAINT primary_key_constraint_name;
```

[Rename a table](postgresql-tutorial/postgresql-rename-table).

```sql
ALTER TABLE table_name
RENAME TO new_table_name;
```

[Drop a table](postgresql-tutorial/postgresql-drop-table) and its dependent objects:

```sql
 DROP TABLE [IF EXISTS] table_name CASCADE;
```

## Managing views

[Create a view](postgresql-views/managing-postgresql-views):

```sql
CREATE OR REPLACE view_name AS
query;
```

[Create a recursive view](postgresql-views/postgresql-recursive-view):

```sql
CREATE RECURSIVE VIEW view_name(column_list) AS
SELECT column_list;
```

[Create a materialized view](postgresql-views/postgresql-materialized-views):

```sql
CREATE MATERIALIZED VIEW view_name
AS
query
WITH [NO] DATA;
```

Refresh a materialized view:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY view_name;
```

Drop a view:

```sql
DROP VIEW [ IF EXISTS ] view_name;
```

Drop a materialized view:

```sql
DROP MATERIALIZED VIEW view_name;
```

Rename a view:

```sql
ALTER VIEW view_name RENAME TO new_name;
```

## Managing indexes

Creating an index with the specified name on a table

```sql
CREATE [UNIQUE] INDEX index_name
ON table (column,...)
```

Removing a specified index from a table

```sql
DROP INDEX index_name;
```

## Querying data from tables

Query all data from a table:

```sql
SELECT * FROM table_name;
```

Query data from specified columns of all rows in a table:

```sql
SELECT column_list
FROM table;
```

Query data and select unique rows:

```sql
SELECT DISTINCT (column)
FROM table;
```

Query data from a table with a filter:

```sql
SELECT *
FROM table
WHERE condition;
```

Assign an [alias](postgresql-tutorial/postgresql-alias) to a column in the result set:

```sql
SELECT column_1 AS new_column_1, ...
FROM table;
```

Query data using the [`LIKE`](postgresql-tutorial/postgresql-like) operator:

```sql
SELECT * FROM table_name
WHERE column LIKE '%value%'
```

Query data using the [BETWEEN](postgresql-tutorial/postgresql-between) operator:

```sql
SELECT * FROM table_name
WHERE column BETWEEN low AND high;
```

Query data using the [IN](postgresql-tutorial/postgresql-in) operator:

```sql
SELECT *
FROM table_name
WHERE column IN (value1, value2,...);
```

Constrain the returned rows with the [`LIMIT`](postgresql-tutorial/postgresql-limit) clause:

```sql
SELECT *
FROM table_name
LIMIT limit OFFSET offset
ORDER BY column_name;
```

Query data from multiple using the [inner join](postgresql-tutorial/postgresql-inner-join), [left join](postgresql-tutorial/postgresql-left-join), [full outer join](postgresql-tutorial/postgresql-full-outer-join), [cross join](postgresql-tutorial/postgresql-cross-join) and [natural join](postgresql-tutorial/postgresql-natural-join):

```sql
SELECT *
FROM table1
INNER JOIN table2 ON conditions
```

```sql
SELECT *
FROM table1
LEFT JOIN table2 ON conditions
```

```sql
SELECT *
FROM table1
FULL OUTER JOIN table2 ON conditions
```

```sql
SELECT *
FROM table1
CROSS JOIN table2;
```

```sql
SELECT *
FROM table1
NATURAL JOIN table2;
```

Return the number of rows of a table.

```sql
SELECT COUNT (*)
FROM table_name;
```

Sort rows in ascending or descending order:

```sql
SELECT select_list
FROM table
ORDER BY column ASC [DESC], column2 ASC [DESC],...;
```

Group rows using [`GROUP BY`](postgresql-tutorial/postgresql-group-by) clause.

```sql
SELECT *
FROM table
GROUP BY column_1, column_2, ...;
```

Filter groups using the [`HAVING`](postgresql-tutorial/postgresql-having) clause.

```sql
SELECT *
FROM table
GROUP BY column_1
HAVING condition;
```

## Set operations

Combine the result set of two or more queries with [`UNION`](postgresql-tutorial/postgresql-union) operator:

```sql
SELECT * FROM table1
UNION
SELECT * FROM table2;
```

Minus a result set using [`EXCEPT`](https://neon.tech/postgresql/postgresql-tutorial/postgresql-tutorial/postgresql-except/) operator:

```sql
SELECT * FROM table1
EXCEPT
SELECT * FROM table2;
```

Get the intersection of the result sets of two queries:

```sql
SELECT * FROM table1
INTERSECT
SELECT * FROM table2;
```

## Modifying data

[Insert a new row into a table](postgresql-tutorial/postgresql-insert):

```sql
INSERT INTO table(column1,column2,...)
VALUES(value_1,value_2,...);
```

Insert multiple rows into a table:

```sql
INSERT INTO table_name(column1,column2,...)
VALUES(value_1,value_2,...),
      (value_1,value_2,...),
      (value_1,value_2,...),
      ...;
```

[Update](postgresql-tutorial/postgresql-update) data for all rows:

```sql
UPDATE table_name
SET column_1 = value_1,
    ...;
```

Update data for a set of rows specified by a condition in the `WHERE` clause.

```sql
UPDATE table
SET column_1 = value_1,
    ...
WHERE condition;
```

[Delete all rows](postgresql-tutorial/postgresql-delete) of a table:

```sql
DELETE FROM table_name;
```

Delete specific rows based on a condition:

```sql
DELETE FROM table_name
WHERE condition;
```

## Performance

Show the query plan for a query:

```sql
EXPLAIN query;
```

Show and execute the query plan for a query:

```sql
EXPLAIN ANALYZE query;
```

Collect statistics:

```sql
ANALYZE table_name;
```
