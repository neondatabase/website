---
title: 'PostgreSQL List Users'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-list-users/
ogImage: ./img/wp-content-uploads-2020-07-PostgreSQL-List-User-Example-1.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL list user command to show all users in a PostgreSQL database server.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Listing users using the psql tool

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [connect to the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-jdbc/connecting-to-postgresql-database/) using the `postgres` user:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It will prompt you for a password:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
Password:
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Once you enter the password for the `postgres` user, you will see the following PostgreSQL command prompt:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
postgres=#
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, use the `\du` to list all user accounts (or roles) in the current PostgreSQL database server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
\du
```

<!-- /wp:code -->

<!-- wp:image {"id":5606,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-List-User-Example-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

If you want to show more information, you can use the `\du+` command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
postgres=#\du+
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `\du+`command adds column called `description`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Listing users using SQL statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement returns all users in the current database server by [querying data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) from the `pg_catalog.pg_user` catalog:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:image {"id":5607,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-List-User-Using-SQL-example.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use `\du` or `\du+` psql command to list all users in the current database server.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `SELECT` statement to query the user information from the `pg_catalog.pg_user` catalog.
- <!-- /wp:list-item -->

<!-- /wp:list -->
