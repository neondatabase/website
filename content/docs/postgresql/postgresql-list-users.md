---
title: 'PostgreSQL List Users'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-list-users
ogImage: /postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-List-User-Example-1.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL list user command to show all users in a PostgreSQL database server.

## Listing users using the psql tool

First, [connect to the PostgreSQL database server](/docs/postgresql/postgresql-jdbc/connecting-to-postgresql-database) using the `postgres` user:

```
psql -U postgres
```

It will prompt you for a password:

```
Password:
```

Once you enter the password for the `postgres` user, you will see the following PostgreSQL command prompt:

```
postgres=#
```

Second, use the `\du` to list all user accounts (or roles) in the current PostgreSQL database server:

```
\du
```

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-List-User-Example-1.png)

If you want to show more information, you can use the `\du+` command:

```
postgres=#\du+
```

The `\du+`command adds column called `description`.

## Listing users using SQL statement

The following statement returns all users in the current database server by [querying data](/docs/postgresql/postgresql-select) from the `pg_catalog.pg_user` catalog:

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

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-List-User-Using-SQL-example.png)

## Summary

- Use `\du` or `\du+` psql command to list all users in the current database server.
-
- Use the `SELECT` statement to query the user information from the `pg_catalog.pg_user` catalog.
