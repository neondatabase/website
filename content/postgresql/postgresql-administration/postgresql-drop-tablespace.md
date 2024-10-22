---
title: "PostgreSQL DROP TABLESPACE Statement"
page_title: "PostgreSQL DROP TABLESPACE Statement"
page_description: "In this tutorial, you will learn how to remove a tablespace by using the PostgreSQL DROP TABLESPACE statement."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-tablespace/"
ogImage: ""
updatedOn: "2024-02-15T01:34:04+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL ALTER TABLESPACE"
  slug: "postgresql-administration/postgresql-alter-tablespace"
nextLink: 
  title: "PostgreSQL Backup"
  slug: "postgresql-administration/postgresql-backup-database"
---




**Summary**: in this tutorial, you will learn how to use the **PostgreSQL DROP TABLESPACE** statement to remove a tablespace.


## Introduction to PostgreSQL DROP TABLESPACE statement

The `DROP TABLESPACE` statement delete a tablespace from a database:

Here’s the syntax of the `DROP TABLE` statement:


```phpsqlsql
DROP TABLESPACE [IF EXISTS] tablespace_name;
```
In this syntax:

* First, specify the name of the tablespace that you want to remove after the `DROP TABLESPACE` keywords.
* Second, use the `IF EXISTS` option to instruct PostgreSQL to issue a notice instead of an error when the tablespace does not exist.

Only tablespace owners or superusers can execute the `DROP TABLESPACE` statement to drop the tablespace.


## PostgreSQL DROP TABLESPACE examples

Let’s explore some examples of using the `DROP TABLESPACE` statement.


### 1\) Basic DROP TABLESPACE statement example

First, open the Command Prompt or Terminal on a Unix\-like system and create a new directory for the tablespace such as `C:\pgdata\demo`:


```sql
mkdir C:\pgdata\sample
```
Next, connect to the PostgreSQL server:


```
psql -U postgres
```
Then, create a new tablespace called sample\_ts:


```
CREATE TABLESPACE sample_ts
LOCATION 'C:/pgdata/demo';
```
After that, drop the `sample_ts` tablespace using the `DROP TABLESPACE` statement:


```
DROP TABLESPACE sample_ts;
```
Finally, exit psql:


```
exit
```

### 2\) Dropping a tablespace that has objects

First, create a new directory called `C:/pgdata/demo` on your server. Replace the path with the actual one that you use:


```php
mkdir C:\pgdata\demo
```
Second, [create a new tablespace](postgresql-create-tablespace "PostgreSQL Creating Tablespace") named `demo` and map it to the `c:\pgdata\demo` directory.


```
CREATE TABLESPACE demo_ts 
LOCATION 'C:/pgdata/demo';
```
Third, [create a new database](postgresql-create-database "PostgreSQL CREATE DATABASE") named `dbdemo` and set its tablespace to `demo`:


```sql
CREATE DATABASE demodb
TABLESPACE = demo;
```
Fourth, connect to the `demodb` database:


```sql
\c demodb
```
Fifth, [create a new table](../postgresql-tutorial/postgresql-create-table "PostgreSQL CREATE TABLE") named `test`in the `dbdemo` and set it `tablespace` to `demo_ts`:


```
CREATE TABLE test (
  id serial PRIMARY KEY, 
  title VARCHAR (255) NOT NULL
) TABLESPACE demo;
```
Sixth, attempt to drop the `demo` tablespace:


```sql
DROP TABLESPACE demo_ts;
```
PostgreSQL issues an error:


```sql
[Err] ERROR: tablespace "demo_ts" is not empty
```
Because the `demo_ts` tablespace is not empty, you cannot drop it.

Seventh, connect to the `postgres` database:


```
\c postgres
```
Eight, drop the `demodb` database:


```
DROP DATABASE demodb;
```
Ninth, drop the `demo_ts` tablespace:


```
DROP TABLESPACE demo_ts;
```
Instead of [dropping the database](postgresql-drop-database "PostgreSQL DROP DATABASE"), you can move it to another tablespace such as `pg_default` by using the [ALTER TABLE](postgresql-alter-database "PostgreSQL ALTER DATABASE") statement as follows:


```sql
ALTER DATABASE demodb
SET TABLESPACE = pg_default;
```
And then delete the `demo_ts` tablespace again:


```sql
DROP TABLESPACE demo_ts
```

## Summary

* Use the PostgreSQL `DROP TABLESPACE` statement to drop a tablespace.

