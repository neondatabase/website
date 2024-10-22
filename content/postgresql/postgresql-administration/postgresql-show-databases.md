---
title: "PostgreSQL Show Databases"
page_title: "PostgreSQL Show Databases"
page_description: "In this tutorial, you will learn how to show databases in a PostgreSQL server using psql and pg_database catalog."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-show-databases/"
ogImage: ""
updatedOn: "2024-02-07T13:11:13+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Restore Database"
  slug: "postgresql-administration/postgresql-restore-database"
next_page: 
  title: "PostgreSQL Show Tables"
  slug: "postgresql-administration/postgresql-show-tables"
---




**Summary**: in this tutorial, you will learn how to show databases in a PostgreSQL database server.

In MySQL, you can show all databases in the server using [`SHOW DATABASES`](https://www.mysqltutorial.org/mysql-administration/mysql-show-databases/) statement.

PostgreSQL does not directly support the `SHOW DATABASES` statement but offers you something similar. PostgreSQL provides you with two ways to show databases in a PostgreSQL database server.


## Listing databases in PostgreSQL using psql command

First, open the Command Prompt on Windows or Terminal on Unix\-like systems and connect to the PostgreSQL server:


```phpsql
psql -U postgres
```
This statement uses the postgres user to connect to the local PostgreSQL server. It’ll prompt you to enter a password.

Second, show all the databases in the current server using the `\l` command:


```
\l
```
It’ll show the following output:


```
                                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |          Collate           |           Ctype            | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+----------------------------+----------------------------+------------+-----------+-----------------------
 dvdrental | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
 postgres  | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
 template0 | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           | =c/postgres          +
           |          |          |                 |                            |                            |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           | =c/postgres          +
           |          |          |                 |                            |                            |            |           | postgres=CTc/postgres
(4 rows)
```
To display more information on databases, you can use the `\l+` command:


```shell
\l+
```

## Listing databases in PostgreSQL using SELECT statement

The following statement retrieves the database names from the `pg_database` view:


```shell
SELECT datname FROM pg_database;
```
Output:


```
  datname
-----------
 postgres
 dvdrental
 template1
 template0
(4 rows)
```
The query returns four databases in the current PostgreSQL server.


## Summary

* Use `\l` or `\l+` in `psql` to show all databases in a PostgreSQL database server.
* Use the `SELECT` statement to query data from the `pg_database` to retrieve all the database names in a PostgreSQL database server.

