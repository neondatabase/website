---
title: 'PostgreSQL ADD COLUMN:  Add One or More Columns to a Table'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-add-column/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-Add-Column-300x128.png
tableOfContents: true
---
<!-- wp:image {"align":"right","id":2603} -->

![PostgreSQL Add Column](./img/wp-content-uploads-2016-06-PostgreSQL-Add-Column-300x128.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ADD COLUMN` statement to add one or more columns to an existing table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL ADD COLUMN statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To add a new column to an existing table, you use the [`ALTER TABLE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alter-table/) `ADD COLUMN` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ADD COLUMN new_column_name data_type constraint;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table to which you want to add a new column after the `ALTER TABLE` keyword.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the name of the new column as well as its data type and constraint after the `ADD COLUMN` keywords.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

When you add a new column to the table, PostgreSQL appends it at the end of the table. PostgreSQL has no option to specify the position of the new column in the table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To add multiple columns to an existing table, you use multiple `ADD COLUMN` clauses in the `ALTER TABLE` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ADD COLUMN column_name1 data_type constraint,
ADD COLUMN column_name2 data_type constraint,
...
ADD COLUMN column_namen data_type constraint;
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL ADD COLUMN statement examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `ALTER TABLE...ADD COLUMN` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Creating a sample table

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following `CREATE TABLE` statement creates a new table named `customers` with two columns: `id` and `customer_name`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Adding a new column to a table

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, add the `phone` column to the `customers` table using the `ALTER TABLE...ADD COLUMN` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customers
ADD COLUMN phone VARCHAR(25);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, view the `customers` table in psql:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\d customers
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                                       Table "public.customers"
    Column     |          Type          | Collation | Nullable |                Default
---------------+------------------------+-----------+----------+---------------------------------------
 id            | integer                |           | not null | nextval('customers_id_seq'::regclass)
 customer_name | character varying(255) |           | not null |
 phone         | character varying(25)  |           |          |
Indexes:
    "customers_pkey" PRIMARY KEY, btree (id)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Adding multiple columns to a table

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, add the `fax` and `email` columns to the `customers` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customers
ADD COLUMN fax VARCHAR (25),
ADD COLUMN email VARCHAR (400);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, view the structure of the `customers` table in `psql`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\d customers
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                                       Table "public.customers"
    Column     |          Type          | Collation | Nullable |                Default
---------------+------------------------+-----------+----------+---------------------------------------
 id            | integer                |           | not null | nextval('customers_id_seq'::regclass)
 customer_name | character varying(255) |           | not null |
 phone         | character varying(25)  |           |          |
 fax           | character varying(25)  |           |          |
 email         | character varying(400) |           |          |
Indexes:
    "customers_pkey" PRIMARY KEY, btree (id)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows the `fax` and `email` columns were added to the `customers` table.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Adding a column with a NOT NULL constraint to a table that already has data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [insert data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `customers` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO
   customers (customer_name)
VALUES
   ('Apple'),
   ('Samsung'),
   ('Sony')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id | customer_name | phone | fax  | email
----+---------------+-------+------+-------
  4 | Apple         | null  | null | null
  5 | Samsung       | null  | null | null
  6 | Sony          | null  | null | null
(3 rows)


INSERT 0 3
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, attempt to add the `contact_name` column to the `customers` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customers
ADD COLUMN contact_name VARCHAR(255) NOT NULL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issued an error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  column "contact_name" of relation "customers" contains null values
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This is because the `contact_name` column has the [`NOT NULL`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-not-null-constraint/) constraint. When PostgreSQL added the column, this new column received `NULL`, which violates the `NOT NULL` constraint.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To address this issue, you can follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, add the `contact_name` column without the `NOT NULL` constraint:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customers
ADD COLUMN contact_name VARCHAR(255);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, update the values in the `contact_name` column.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE customers
SET contact_name = 'John Doe'
WHERE id = 1;

UPDATE customers
SET contact_name = 'Mary Doe'
WHERE id = 2;

UPDATE customers
SET contact_name = 'Lily Bush'
WHERE id = 3;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you have contact data from other tables, you can update the contact names in the `customers` table based on the data from those tables using the [update join statement](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update-join/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, modify the `contact_name` column to add the `NOT NULL` constraint:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customers
ALTER COLUMN contact_name
SET NOT NULL;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `ALTER TABLE...ADD COLUMN` statement to add one or more columns to a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
