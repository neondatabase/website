---
title: 'PostgreSQL CREATE TABLE'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL CREATE TABLE** statement to create a new table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL CREATE TABLE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

Typically, a relational database consists of multiple related tables. Tables allow you to store structured data like customers, products, and employees.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create a new table, you use the `CREATE TABLE` statement. Here's the basic syntax of the `CREATE TABLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE [IF NOT EXISTS] table_name (
   column1 datatype(length) column_constraint,
   column2 datatype(length) column_constraint,
   ...
   table_constraints
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, specify the name of the table that you want to create after the `CREATE TABLE` keywords. The table name must be unique in a [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/). If you create a table with a name that already exists, you'll get an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

A [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/) is a named collection of database objects including tables. If you create a table without a schema, it defaults to public. You'll learn more about the schema in the schema tutorial.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, use the `IF NOT EXISTS` option to create a new table only if it does not exist. When you use the `IF NOT EXISTS` option and the table already exists, PostgreSQL will issue a notice instead of an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, specify table columns separated by commas. Each column definition consists of the column name, data type, size, and constraint.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The constraint of a column specifies a rule that is applied to data within a column to ensure data integrity. The column constraints include [primary key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key/), [foreign key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/), [not null](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-not-null-constraint/), [unique](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-unique-constraint/), [check](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-check-constraint/), and default.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the `NOT NULL` constraint ensures that the values in a column cannot be NULL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Finally, specify constraints for the table including primary key, foreign key, and check constraints.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A table constraint is a rule that is applied to the data within the table to maintain data integrity.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that some column constraints can be defined as table constraints such as primary key, foreign key, unique, and check constraints.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Constraints

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL includes the following column constraints:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [NOT NULL ](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-not-null-constraint/)- ensures that the values in a column cannot be `NULL`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [UNIQUE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-unique-constraint/) - ensures the values in a column are unique across the rows within the same table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [PRIMARY KEY](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key/) - a primary key column uniquely identifies rows in a table. A table can have one and only one primary key. The primary key constraint allows you to define the primary key of a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [CHECK](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-check-constraint/) - ensures the data must satisfy a boolean expression. For example, the value in the price column must be zero or positive.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [FOREIGN KEY](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/) - ensures that the values in a column or a group of columns from a table exist in a column or group of columns in another table. Unlike the primary key, a table can have many foreign keys.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Table constraints are similar to column constraints except that you can include more than one column in the table constraint.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CREATE TABLE example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will create a new table called `accounts` in the `dvdrental` [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/). The `accounts` table has the following columns:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `user_id` - primary key
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `username` - unique and not null
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `password` - not null
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `email` - unique and not null
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `created_at` - not null
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `last_login` - null
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following example uses the `CREATE TABLE` statement to create the `accounts` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE accounts (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To create a table in a database, you need to execute the `CREATE TABLE` statement using a PostgreSQL client such as psql and pgAdmin.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

We'll show you step-by-step how to create the `accounts` table using the psql client tool.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It'll prompt you to enter a password for the user `postgres`.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
Password for user postgres:
```

<!-- /wp:code -->

<!-- wp:paragraph -->

When you enter a password correctly, you'll see the following command prompt:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
postgres=#
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, connect to the `dvdrental` database:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\c dvdrental
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, enter the following `CREATE TABLE` statement and press Enter:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE accounts (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the table has been created.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To view the accounts table, you can use the `\d` command:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\d accounts
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `CREATE TABLE` statement to create a new table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `IF NOT EXISTS` option to create the new table only if it does not exist.
- <!-- /wp:list-item -->

<!-- /wp:list -->
