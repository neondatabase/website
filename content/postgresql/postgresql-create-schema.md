---
prevPost: postgresql-index-types
nextPost: postgresql-percent_rank-function
createdAt: 2019-05-11T08:13:04.000Z
title: 'PostgreSQL CREATE SCHEMA'
redirectFrom: 
            - /postgresql/postgresql-administration/postgresql-create-schema
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-postgresql-create-schema-example.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE SCHEMA` statement to create a new schema in a database.

## Introduction to PostgreSQL CREATE SCHEMA statement

The `CREATE SCHEMA` statement allows you to create a new [schema](/postgresql/postgresql-administration/postgresql-schema) in the current database.

The following illustrates the syntax of the `CREATE SCHEMA` statement:

```sql
CREATE SCHEMA [IF NOT EXISTS] schema_name;
```

In this syntax:

- First, specify the name of the schema after the `CREATE SCHEMA` keywords. The schema name must be unique within the current database.
- Second, optionally use `IF NOT EXISTS` to conditionally create the new schema only if it does not exist. Attempting to create a new schema that already exists without using the `IF NOT EXISTS` option will result in an error.

Note that to execute the `CREATE SCHEMA` statement, you must have the `CREATE` privilege in the current database.

You can also create a schema for a user:

```sql
CREATE SCHEMA [IF NOT EXISTS]
AUTHORIZATION username;
```

In this case, the schema will have the same name as the `username`.

PostgreSQL allows you to create a schema and a list of objects such as tables and [views](/postgresql/postgresql-views) using a single statement as follows:

```sql
CREATE SCHEMA schema_name
    CREATE TABLE table_name1 (...)
    CREATE TABLE table_name2 (...)
    CREATE VIEW view_name1
        SELECT select_list FROM table_name1;
```

Notice that each subcommand does not end with a semicolon (;).

## PostgreSQL CREATE SCHEMA statement examples

Let's take some examples of using the `CREATE SCHEMA` statement.

### 1) Basic CREATE SCHEMA statement example

The following statement uses the `CREATE SCHEMA` statement to create a new schema named `marketing`:

```sql
CREATE SCHEMA marketing;
```

The following statement returns all schemas from the current database:

```sql
SELECT *
FROM pg_catalog.pg_namespace
ORDER BY nspname;
```

This picture shows the output:

![postgresql create schema example](/postgresqltutorial_data/wp-content-uploads-2019-05-postgresql-create-schema-example.png)

### 2) Using CREATE SCHEMA statement to create a schema for a user example

First, [create a new role](/postgresql/postgresql-administration/postgresql-roles) with named `john`:

```sql
CREATE ROLE john
LOGIN
PASSWORD 'Postgr@s321!';
```

Second, create a schema for `john`:

```sql
CREATE SCHEMA AUTHORIZATION john;
```

Third, create a new schema called `doe` that will be owned by `john`:

```sql
CREATE SCHEMA IF NOT EXISTS doe AUTHORIZATION john;
```

### 3) Using CREATE SCHEMA statement to create a schema and its objects example

The following example uses the `CREATE SCHEMA` statement to create a new schema named `scm`. It also creates a table named `deliveries` and a view named `delivery_due_list` that belongs to the `scm` schema:

```sql
CREATE SCHEMA scm
    CREATE TABLE deliveries(
        id SERIAL NOT NULL,
        customer_id INT NOT NULL,
        ship_date DATE NOT NULL
    )
    CREATE VIEW delivery_due_list AS
        SELECT ID, ship_date
        FROM deliveries
        WHERE ship_date <= CURRENT_DATE;
```

## Summary

- Use the PostgreSQL `CREATE SCHEMA` statement to create a new schema in a database.
