---
title: The silent syntax difference in foreign keys between Postgres and MySQL
description: Review your schema definitions when migrating databases
excerpt: >-
  Foreign keys are a concept embedded in almost every relational database. If
  you are normalizing your database, you will expect to use foreign keys
  throughout. And they seem simple. But simplicity often belies the subtle
  differences that can trip you up when switching between data...
date: '2024-06-05T16:25:00'
updatedOn: '2024-06-05T17:56:53'
category: postgres
categories:
  - postgres
authors:
  - rishi-raj-jain
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-silent-syntax-difference-in-foreign-keys-between-postgres-and-mysql/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    The silent syntax difference in foreign keys between Postgres and MySQL -
    Neon
  description: >-
    If you're migrating between MySQL and Postgres, take one extra look to your
    schema definitions to make sure foreign keys behave properly.
  keywords: []
  noindex: false
  ogTitle: >-
    The silent syntax difference in foreign keys between Postgres and MySQL -
    Neon
  ogDescription: >-
    If you're migrating between MySQL and Postgres, take one extra look to your
    schema definitions to make sure foreign keys behave properly.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-silent-syntax-difference-in-foreign-keys-between-postgres-and-mysql/social.jpg
source:
  wpId: 6181
  wpSlug: the-silent-syntax-difference-in-foreign-keys-between-postgres-and-mysql
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-silent-syntax-difference-in-foreign-keys-between-postgres-and-mysql/neon-foreign-keys-1-1024x576-431098fe.jpg)

[Foreign keys](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/) are a concept embedded in almost every relational database. If you are normalizing your database, you will expect to use foreign keys throughout. And they seem simple. But simplicity often belies the subtle differences that can trip you up when switching between database systems.

One significant difference is how Postgres and MySQL handle the syntax for defining foreign keys. Both databases support foreign key constraints, but the way you define them can lead to unexpected behavior if you’re unaware of the nuances.

## A refresher on foreign keys

Foreign keys are a crucial concept in relational database design and play a significant role in maintaining data integrity and establishing relationships between tables. A foreign key is a column or a set of columns in one table that refers to the primary key or a unique key in another table. It establishes a link between two tables, defining a parent-child relationship.

Foreign keys enforce [referential integrity](https://www.ibm.com/docs/en/informix-servers/14.10?topic=integrity-referential), ensuring the relationships between tables remain consistent and valid. They prevent orphaned records and maintain data consistency across related tables.

How foreign keys work:

- The table containing the foreign key is called the child table or referencing table.
- The table referenced by the foreign key is called the parent table or referenced table.
- The foreign key in the child table must reference a primary or unique key in the parent table.
- The values in the foreign key column of the child table must match the values in the referenced column of the parent table or be null if the foreign key allows null values.

Consider two tables: `orders` and `customers`. The orders table has a foreign key `customer_id` that references the `customer_id` primary key in the `customers` table. Let’s build these in Postgres:

```sql
-- Create the customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20)
);

-- Create the orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers (customer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2)
);
```

The foreign key assignment is done in this line:

```sql
customer_id INT REFERENCES customers (customer_id) ON DELETE CASCADE ON UPDATE CASCADE
```

- `customer_id INT` defines the `customer_id` column in the `orders` table as an integer data type.
- `REFERENCES customers (customer_id)` establishes a foreign key constraint on the `customer_id` column in the `orders` table. It specifies that the `customer_id` column references the `customer_id` column in the `customers` table. This means that the values in the `customer_id` column of the `orders` table must exist in the `customer_id` column of the `customers` table.
- `ON DELETE CASCADE` specifies the action to be taken when a referenced row in the `customers` table is deleted. In this case, `CASCADE` means that if a customer is deleted from the `customers` table, all the corresponding orders in the `orders` table that reference that customer will also be automatically deleted. This ensures data consistency and prevents orphaned records in the orders table.
- `ON UPDATE CASCADE` specifies the action to be taken when the `customer_id` value in the `customers` table is updated. In this case, `CASCADE` means that if the `customer_id` of a customer is updated in the `customers` table, all the corresponding `customer_id` values in the orders table will also be automatically updated to match the new value. This ensures data consistency and maintains the integrity of the foreign key relationship.

Foreign keys define the relationships between tables, making it easier to understand and query the data based on those relationships. What happens if we try to add an order with an invalid `customer_id`?

```sql
ERROR:  insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"
DETAIL:  Key (customer_id)=(4) is not present in table "customers".
```

We get an error telling us that this `customer_id` isn’t in customers and thus `violates foreign key constraint`.

## The subtle difference in defining foreign keys in MySQL and Postgres

Let’s use the same SQL to create those tables in MySQL:

```sql
-- Create the customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20)
);

-- Create the orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers (customer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2)
);
```

We’ll again populate data and try to add an order with a `customer_id` that doesn’t exist.

```sql
Query OK, 1 row affected (0.00 sec)
```

Wait, what? Let’s take a look at our `orders` table:

```sql
SELECT * FROM orders;
+----------+-------------+------------+--------------+
| order_id | customer_id | order_date | total_amount |
+----------+-------------+------------+--------------+
|        1 |           1 | 2023-05-01 |       100.50 |
|        2 |           1 | 2023-05-15 |        75.20 |
|        3 |           2 | 2023-05-10 |       200.00 |
|        4 |           3 | 2023-05-20 |        50.75 |
|        5 |           4 | 2023-05-01 |       100.50 |
+----------+-------------+------------+--------------+
5 rows in set (0.00 sec)
```

Hmm, we have an order from a customer that doesn’t exist. Not great. Why? Well, check out this excerpt from the [MySQL docs](https://dev.mysql.com/doc/mysql-reslimits-excerpt/8.0/en/ansi-diff-foreign-keys.html):

_MySQL parses but ignores “inline `REFERENCES` specifications” (as defined in the SQL standard) where the references are defined as part of the column specification. MySQL accepts `REFERENCES` clauses only when specified as part of a separate `FOREIGN KEY` specification._

_Defining a column to use a `REFERENCES tbl_name(col_name)` clause has no actual effect and_ **_serves only as a memo or comment to you that the column which you are currently defining is intended to refer to a column in another table_**_. It is important to realize when using this syntax that:_

- _MySQL does not perform any sort of check to make sure that `col_name` actually exists in `tbl_name` (or even that `tbl_name` itself exists)._
- _MySQL does not perform any sort of action on `tbl_name` such as deleting rows in response to actions taken on rows in the table which you are defining; in other words, this syntax induces no `ON DELETE` or `ON UPDATE` behavior whatsoever. (Although you can write an `ON DELETE` or `ON UPDATE` clause as part of the `REFERENCES` clause, it is also ignored.)_
- _This syntax creates a_**_column_**_; it does_**_not_**_create any sort of index or key._

What does all that mean? The key takeaway is that **MySQL ignores foreign key constraints when they are defined inline with the column definition. Instead, MySQL only recognizes foreign key constraints when specified as a separate clause using the `FOREIGN KEY` keyword.**

Even though the SQL code defines the foreign key inline, MySQL treats it as a comment and does not enforce the constraint or perform referential actions. As a result, it allows inserting records that violate the foreign key relationship, leading to inconsistencies in the data. Not great, and unfortunately not something evident if you are porting your code over from Postgres to MySQL.

Here’s what MySQL wants you to do:

```sql
CREATE TABLE child_table (
    child_id INT PRIMARY KEY,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES parent_table(parent_id)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
);
```

<br />Here, the foreign key constraint is defined as a separate clause using the `FOREIGN KEY` keyword, followed by the column name and the `REFERENCES` keyword to specify the referenced table and column. The `ON DELETE` and `ON UPDATE` clauses can be added to define the referential actions.

By defining the foreign key constraint in this manner, MySQL properly enforces the constraint and maintains the referential integrity between the tables. This is simply good practice in both Postgres and MySQL. Explicitly naming and defining the FOREIGN KEY helps self-document the code better. The inline version is a bit of a footgun for any future changes.

There are a few other [differences between the SQL standard for foreign keys and MySQL foreign keys](https://dev.mysql.com/doc/mysql-reslimits-excerpt/8.0/en/ansi-diff-foreign-keys.html). This example highlights something most database developers know but don’t always grok–Postgres!= MySQL!= SQL. All look the same but have different implementations. If you expect clear errors as you switch between different versions, you will be disappointed when your database doesn’t act as expected.

## Conclusion

If you are planning to move from MySQL to Postgres:

1. Review your schema definitions: ensure that all foreign key constraints are explicitly defined using the FOREIGN KEY clause, especially if you are porting over schemas from MySQL.
2. Test rigorously!

> If you’re looking for a developer-friendly Postgres with database branching, check out [Neon](https://neon.tech/). [It’s free to get started](https://console.neon.tech/signup)!
