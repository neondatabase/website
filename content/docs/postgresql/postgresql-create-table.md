---
title: 'PostgreSQL CREATE TABLE'
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the **PostgreSQL CREATE TABLE** statement to create a new table.

## Introduction to PostgreSQL CREATE TABLE statement

Typically, a relational database consists of multiple related tables. Tables allow you to store structured data like customers, products, and employees.

To create a new table, you use the `CREATE TABLE` statement. Here's the basic syntax of the `CREATE TABLE` statement:

```sql
CREATE TABLE [IF NOT EXISTS] table_name (
   column1 datatype(length) column_constraint,
   column2 datatype(length) column_constraint,
   ...
   table_constraints
);
```

In this syntax:

First, specify the name of the table that you want to create after the `CREATE TABLE` keywords. The table name must be unique in a [schema](/docs/postgresql/postgresql-administration/postgresql-schema). If you create a table with a name that already exists, you'll get an error.

A [schema](/docs/postgresql/postgresql-administration/postgresql-schema) is a named collection of database objects including tables. If you create a table without a schema, it defaults to public. You'll learn more about the schema in the schema tutorial.

Second, use the `IF NOT EXISTS` option to create a new table only if it does not exist. When you use the `IF NOT EXISTS` option and the table already exists, PostgreSQL will issue a notice instead of an error.

Third, specify table columns separated by commas. Each column definition consists of the column name, data type, size, and constraint.

The constraint of a column specifies a rule that is applied to data within a column to ensure data integrity. The column constraints include [primary key](/docs/postgresql/postgresql-primary-key), [foreign key](/docs/postgresql/postgresql-tutorial/postgresql-foreign-key), [not null](/docs/postgresql/postgresql-tutorial/postgresql-not-null-constraint), [unique](/docs/postgresql/postgresql-tutorial/postgresql-unique-constraint), [check](/docs/postgresql/postgresql-tutorial/postgresql-check-constraint), and default.

For example, the `NOT NULL` constraint ensures that the values in a column cannot be NULL.

Finally, specify constraints for the table including primary key, foreign key, and check constraints.

A table constraint is a rule that is applied to the data within the table to maintain data integrity.

Note that some column constraints can be defined as table constraints such as primary key, foreign key, unique, and check constraints.

### Constraints

PostgreSQL includes the following column constraints:

- [NOT NULL](/docs/postgresql/postgresql-not-null-constraint)- ensures that the values in a column cannot be `NULL`.
-
- [UNIQUE](/docs/postgresql/postgresql-unique-constraint) - ensures the values in a column are unique across the rows within the same table.
-
- [PRIMARY KEY](/docs/postgresql/postgresql-primary-key) - a primary key column uniquely identifies rows in a table. A table can have one and only one primary key. The primary key constraint allows you to define the primary key of a table.
-
- [CHECK](/docs/postgresql/postgresql-check-constraint) - ensures the data must satisfy a boolean expression. For example, the value in the price column must be zero or positive.
-
- [FOREIGN KEY](/docs/postgresql/postgresql-foreign-key) - ensures that the values in a column or a group of columns from a table exist in a column or group of columns in another table. Unlike the primary key, a table can have many foreign keys.

Table constraints are similar to column constraints except that you can include more than one column in the table constraint.

## PostgreSQL CREATE TABLE example

We will create a new table called `accounts` in the `dvdrental` [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database). The `accounts` table has the following columns:

- `user_id` - primary key
-
- `username` - unique and not null
-
- `password` - not null
-
- `email` - unique and not null
-
- `created_at` - not null
-
- `last_login` - null

The following example uses the `CREATE TABLE` statement to create the `accounts` table:

```sql
CREATE TABLE accounts (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
```

To create a table in a database, you need to execute the `CREATE TABLE` statement using a PostgreSQL client such as psql and pgAdmin.

We'll show you step-by-step how to create the `accounts` table using the psql client tool.

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL:

```
psql -U postgres
```

It'll prompt you to enter a password for the user `postgres`.

```sql
Password for user postgres:
```

When you enter a password correctly, you'll see the following command prompt:

```
postgres=#
```

Second, connect to the `dvdrental` database:

```
\c dvdrental
```

Third, enter the following `CREATE TABLE` statement and press Enter:

```sql
CREATE TABLE accounts (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
```

Output:

```sql
CREATE TABLE
```

The output indicates that the table has been created.

To view the accounts table, you can use the `\d` command:

```
\d accounts
```

Output:

```
                                           Table "public.accounts"
   Column   |            Type             | Collation | Nullable |                  Default
------------+-----------------------------+-----------+----------+-------------------------------------------
 user_id    | integer                     |           | not null | nextval('accounts_user_id_seq'::regclass)
 username   | character varying(50)       |           | not null |
 password   | character varying(50)       |           | not null |
 email      | character varying(255)      |           | not null |
 created_at | timestamp without time zone |           | not null |
 last_login | timestamp without time zone |           |          |
Indexes:
    "accounts_pkey" PRIMARY KEY, btree (user_id)
    "accounts_email_key" UNIQUE CONSTRAINT, btree (email)
    "accounts_username_key" UNIQUE CONSTRAINT, btree (username)
```

## Summary

- Use the `CREATE TABLE` statement to create a new table.
-
- Use the `IF NOT EXISTS` option to create the new table only if it does not exist.
