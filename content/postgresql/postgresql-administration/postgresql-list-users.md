---
title: "PostgreSQL List Users"
page_title: "PostgreSQL List Users: Shows PostgreSQL Users"
page_description: "This tutorial shows you how to use the PostgreSQL list users command to show all users in a database server."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-list-users/"
ogImage: "/postgresqltutorial/PostgreSQL-List-User-Example-1.png"
updatedOn: "2024-02-15T02:21:52+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL DROP ROLE Statement"
  slug: "postgresql-administration/postgresql-drop-role"
next_page: 
  title: "How to Create Superuser in PostgreSQL"
  slug: "postgresql-administration/create-superuser-postgresql"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL list user command to show all users in a PostgreSQL database server.


## Listing users using the psql tool

First, [connect to the PostgreSQL database server](../postgresql-jdbc/connecting-to-postgresql-database) using the `postgres` user:


```shellsql
psql -U postgres
```
It will prompt you for a password:


```
Password:
```
Once you enter the password for the `postgres` user, you will see the following PostgreSQL command prompt:


```shell
postgres=#
```
Second, use the `\du` to list all user accounts (or roles) in the current PostgreSQL database server:


```shell
\du 
```
![](/postgresqltutorial/PostgreSQL-List-User-Example-1.png)If you want to show more information, you can use the `\du+` command:


```shell
postgres=#\du+
```
The `\du+`  command adds column called `description`.


## Listing users using SQL statement

The following statement returns all users in the current database server by [querying data](../postgresql-tutorial/postgresql-select) from the `pg_catalog.pg_user` catalog:


```
SELECT usename AS role_name,
  CASE 
     WHEN usesuper AND usecreatedb THEN 
	   CAST('superuser, create database' AS pg_catalog.text)
     WHEN usesuper THEN 
	    CAST('superuser' AS pg_catalog.text)
     WHEN usecreatedb THEN 
	    CAST('create database' AS pg_catalog.text)
     ELSE 
	    CAST('' AS pg_catalog.text)
  END role_attributes
FROM pg_catalog.pg_user
ORDER BY role_name desc;
```

![](/postgresqltutorial/PostgreSQL-List-User-Using-SQL-example.png)

## Summary

* Use `\du` or `\du+` psql command to list all users in the current database server.
* Use the `SELECT` statement to query the user information from the `pg_catalog.pg_user` catalog.

