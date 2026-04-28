---
title: PostgreSQL CREATE SCHEMA
page_title: PostgreSQL CREATE SCHEMA Statement
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL CREATE SCHEMA
  statement to create a new schema in a database.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-schema/
ogImage: /postgresqltutorial/postgresql-create-schema-example.png
updatedOn: '2024-02-12T12:34:40+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL Schema
  slug: postgresql-administration/postgresql-schema
nextLink:
  title: PostgreSQL ALTER SCHEMA
  slug: postgresql-administration/postgresql-alter-schema
---
<Admonition type="info" id="CTA">
The CREATE SCHEMA statement works the same way on any PostgreSQL database, so what you learn here applies whether you run Postgres on your laptop or in production. If you're an enterprise organizing schemas across analytics and AI workloads, [Lakebase](https://www.databricks.com/product/lakebase) delivers the best managed cloud Postgres for the AI era, with strong performance, enterprise-grade security, and native integration into the Lakehouse. If you're a developer or startup who needs to ship features and scale quickly, [Neon](https://neon.com) is the Postgres platform built for your speed, with instant provisioning, branching, and serverless economics.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE SCHEMA` statement to create a new schema in a database.

## Introduction to PostgreSQL CREATE SCHEMA statement

The `CREATE SCHEMA` statement allows you to create a new [schema](postgresql-schema) in the current database.

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

PostgreSQL allows you to create a schema and a list of objects such as tables and [views](../postgresql-views) using a single statement as follows:

```sql
CREATE SCHEMA schema_name
    CREATE TABLE table_name1 (...)
    CREATE TABLE table_name2 (...)
    CREATE VIEW view_name1
        SELECT select_list FROM table_name1;
```

Notice that each subcommand does not end with a semicolon (;).

## PostgreSQL CREATE SCHEMA statement examples

Let’s take some examples of using the `CREATE SCHEMA` statement.

### 1\) Basic CREATE SCHEMA statement example

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

![postgresql create schema example](/postgresqltutorial/postgresql-create-schema-example.png)

### 2\) Using CREATE SCHEMA statement to create a schema for a user example

First, [create a new role](postgresql-roles) with named `john`:

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

### 3\) Using CREATE SCHEMA statement to create a schema and its objects example

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
