---
title: 'PostgreSQL Not-Null Constraint'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-not-null-constraint/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about PostgreSQL not-null constraints to ensure the values of a column are not null.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to NULL

<!-- /wp:heading -->

<!-- wp:paragraph -->

In the database world, NULL represents unknown or missing information. NULL is not the same as an empty string or the number zero.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Suppose you need to insert the email address of a contact into a table. You can request his or her email address.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

However, if you don't know whether the contact has an email address or not, you can insert NULL into the email address column. In this case, NULL indicates that the email address is unknown at the recording time.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

NULL is very special. It does not equal anything, even itself. The expression `NULL = NULL` returns NULL because it makes sense that two unknown values should not be equal.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To check if a value is NULL or not, you use the `IS NULL` boolean operator. For example, the following expression returns true if the value in the email address is NULL.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
email_address IS NULL
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `IS NOT NULL` operator negates the result of the `IS NULL` operator.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL NOT NULL constraints

<!-- /wp:heading -->

<!-- wp:paragraph -->

To control whether a column can accept NULL, you use the `NOT NULL` constraint:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE table_name(
   ...
   column_name data_type NOT NULL,
   ...
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If a column has a `NOT NULL` constraint, any attempt to [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) or [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) NULL in the column will result in an error.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Declaring NOT NULL columns

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following `CREATE TABLE` statement creates a new table name `invoices` with the not-null constraints.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE invoices(
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  qty numeric NOT NULL CHECK(qty > 0),
  net_price numeric CHECK(net_price > 0)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This example uses the `NOT NULL` keywords that follow the [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/) of the product_id and qty columns to declare `NOT NULL` constraints.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that a column can have multiple constraints such as `NOT NULL`, [check](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-check-constraint/), [unique](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-unique-constraint/), [foreign key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/) appearing next to each other. The order of the constraints is not important. PostgreSQL may check constraints in any order.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use `NULL` instead of `NOT NULL`, the column will accept both `NULL` and non-NULL values. If you don't explicitly specify `NULL` or `NOT NULL`, it will accept `NULL` by default.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Adding NOT NULL Constraints to existing columns

<!-- /wp:heading -->

<!-- wp:paragraph -->

To add the `NOT NULL` constraint to a column of an existing table, you use the following form of the `ALTER TABLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ALTER COLUMN column_name SET NOT NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To add multiple `NOT NULL` constraints to multiple columns, you use the following syntax:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ALTER COLUMN column_name_1 SET NOT NULL,
ALTER COLUMN column_name_2 SET NOT NULL,
...;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Let's take a look at the following example.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called production orders ( `production_orders`):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE production_orders (
	id SERIAL PRIMARY KEY,
	description VARCHAR (40) NOT NULL,
	material_id VARCHAR (16),
	qty NUMERIC,
	start_date DATE,
	finish_date DATE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Next, insert a new row into the `production_orders` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO production_orders (description)
VALUES('Make for Infosys inc.');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Then, to make sure that the `qty` field is not null, you can add the not-null constraint to the `qty` column. However, the column already contains data. If you try to add the not-null constraint, PostgreSQL will issue an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To add the `NOT NULL` constraint to a column that already contains NULL, you need to update `NULL` to non-NULL first, like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE production_orders
SET qty = 1;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The values in the `qty` column is updated to one. Now, you can add the `NOT NULL` constraint to the `qty` column:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE production_orders
ALTER COLUMN qty
SET NOT NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After that, you can update the not-null constraints for `material_id`, `start_date`, and `finish_date` columns:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE production_orders
SET material_id = 'ABC',
    start_date = '2015-09-01',
    finish_date = '2015-09-01';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Add not-null constraints to multiple columns:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE production_orders
ALTER COLUMN material_id SET NOT NULL,
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN finish_date SET NOT NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, attempt to update values in the `qty` column to NULL:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE production_orders
SET qty = NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issued an error message:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
[Err] ERROR:  null value in column "qty" violates not-null constraint
DETAIL:  Failing row contains (1, make for infosys inc., ABC, null, 2015-09-01, 2015-09-01).
```

<!-- /wp:code -->

<!-- wp:heading -->

## The special case of NOT NULL constraint

<!-- /wp:heading -->

<!-- wp:paragraph -->

Besides the `NOT NULL` constraint, you can use a [CHECK constraint](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-check-constraint/) to force a column to accept not NULL values. The `NOT NULL` constraint is equivalent to the following `CHECK` constraint:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CHECK(column IS NOT NULL)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This is useful because sometimes you may want either column `a` or `b` is not null, but not both.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, you may want either `username` or `email` column of the user tables is not null or empty. In this case, you can use the `CHECK` constraint as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE users (
  id serial PRIMARY KEY,
  username VARCHAR (50),
  password VARCHAR (50),
  email VARCHAR (50),
  CONSTRAINT username_email_notnull CHECK (
    NOT (
      (
        username IS NULL
        OR username = ''
      )
      AND (
        email IS NULL
        OR email = ''
      )
    )
  )
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement works.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO users (username, email)
VALUES
	('user1', NULL),
	(NULL, 'email1@example.com'),
	('user2', 'email2@example.com'),
	('user3', '');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

However, the following statement will not work because it violates the `CHECK` constraint:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO users (username, email)
VALUES
	(NULL, NULL),
	(NULL, ''),
	('', NULL),
	('', '');
```

<!-- /wp:code -->

<!-- wp:code -->

```
[Err] ERROR:  new row for relation "users" violates check constraint "username_email_notnull"
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `NOT NULL` constraint for a column to enforce a column not accept `NULL`. By default, a column can hold NULL.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- To check if a value is `NULL` or not, you use the `IS NULL` operator. The `IS NOT NULL` negates the result of the `IS NULL`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Never use equal operator `=` to compare a value with `NULL` because it always returns `NULL`.
- <!-- /wp:list-item -->

<!-- /wp:list -->
