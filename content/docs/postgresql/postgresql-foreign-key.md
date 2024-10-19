---
title: 'PostgreSQL Foreign Key'
redirectFrom:
   - /docs/postgresql/postgresql-tutorial/postgresql-foreign-key
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL foreign key and how to add foreign keys to tables using foreign key constraints.

## Introduction to PostgreSQL Foreign Key Constraint

In PostgreSQL, a foreign key is a column or a group of columns in a table that uniquely identifies a row in **another table**.

A foreign key establishes a link between the data in two tables by referencing the [primary key](/docs/postgresql/postgresql-primary-key) or a [unique constraint](/docs/postgresql/postgresql-tutorial/postgresql-unique-constraint) of the referenced table.

The table containing a foreign key is referred to as the referencing table or child table. Conversely, the table referenced by a foreign key is known as the referenced table or parent table.

The main purpose of foreign keys is to maintain referential integrity in a relational database, ensuring that relationships between the parent and child tables are valid.

For example, a foreign key prevents the insertion of values that do not have corresponding values in the referenced table.

Additionally, a foreign key maintains consistency by automatically updating or deleting related rows in the child table when changes occur in the parent table.

A table can have multiple foreign keys depending on its relationships with other tables.

To define a foreign key, you can use a foreign key constraint.

## PostgreSQL foreign key constraint syntax

The following illustrates a foreign key constraint syntax:

```
[CONSTRAINT fk_name]
   FOREIGN KEY(fk_columns)
   REFERENCES parent_table(parent_key_columns)
   [ON DELETE delete_action]
   [ON UPDATE update_action]
```

In this syntax:

- First, specify the name for the foreign key constraint after the `CONSTRAINT` keyword. The `CONSTRAINT` clause is optional. If you omit it, PostgreSQL will assign an auto-generated name.
- Second, specify one or more foreign key columns in parentheses after the `FOREIGN KEY` keywords.
- Third, specify the parent table and parent key columns referenced by the foreign key columns in the `REFERENCES` clause.
- Finally, specify the desired delete and update actions in the`ON DELETE` and `ON UPDATE` clauses.

The delete and update actions determine the behaviors when the primary key in the parent table is deleted and updated.

Since the primary key is rarely updated, the `ON UPDATE action` is infrequently used in practice. We'll focus on the `ON DELETE` action.

PostgreSQL supports the following actions:

- SET NULL
- SET DEFAULT
- RESTRICT
- NO ACTION
- CASCADE

## PostgreSQL foreign key constraint examples

The following statements create the `customers` and `contacts` tables:

```sql
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS contacts;

CREATE TABLE customers(
   customer_id INT GENERATED ALWAYS AS IDENTITY,
   customer_name VARCHAR(255) NOT NULL,
   PRIMARY KEY(customer_id)
);

CREATE TABLE contacts(
   contact_id INT GENERATED ALWAYS AS IDENTITY,
   customer_id INT,
   contact_name VARCHAR(255) NOT NULL,
   phone VARCHAR(15),
   email VARCHAR(100),
   PRIMARY KEY(contact_id),
   CONSTRAINT fk_customer
      FOREIGN KEY(customer_id)
        REFERENCES customers(customer_id)
);
```

In this example, the `customers` table is the parent table and the `contacts` table is the child table.

Each customer has zero or many contacts and each contact belongs to zero or one customer.

The `customer_id` column in the `contacts` table is the foreign key column that references the primary key column with the same name in the `customers` table.

The following foreign key constraint `fk_customer` in the `contacts` table defines the `customer_id` as the foreign key:

```sql
CONSTRAINT fk_customer
   FOREIGN KEY(customer_id)
      REFERENCES customers(customer_id)
```

Because the foreign key constraint does not have the `ON DELETE` and `ON UPDATE` action, they default to `NO ACTION`.

### NO ACTION

The following inserts data into the `customers` and `contacts` tables:

```sql
INSERT INTO customers(customer_name)
VALUES('BlueBird Inc'),
      ('Dolphin LLC');

INSERT INTO contacts(customer_id, contact_name, phone, email)
VALUES(1,'John Doe','(408)-111-1234','john.doe@bluebird.dev'),
      (1,'Jane Doe','(408)-111-1235','jane.doe@bluebird.dev'),
      (2,'David Wright','(408)-222-1234','david.wright@dolphin.dev');
```

The following statement deletes the customer id 1 from the `customers` table:

```sql
DELETE FROM customers
WHERE customer_id = 1;
```

Because of the `ON DELETE NO ACTION`, PostgreSQL issues a constraint violation because the referencing rows of the customer id 1 still exist in the `contacts` table:

```sql
ERROR:  update or delete on table "customers" violates foreign key constraint "fk_customer" on table "contacts"
DETAIL:  Key (customer_id)=(1) is still referenced from table "contacts".
SQL state: 23503
```

The `RESTRICT` action is similar to the `NO ACTION`. The difference only arises when you define the foreign key constraint as `DEFERRABLE` with an `INITIALLY DEFERRED` or `INITIALLY IMMEDIATE` mode. We'll discuss more on this in the upcoming tutorial.

### SET NULL

The `SET NULL` automatically sets `NULL` to the foreign key columns in the referencing rows of the child table when the referenced rows in the parent table are deleted.

First, drop the sample tables and re-create them with the foreign key that uses the `SET NULL` action in the `ON DELETE` clause:

```sql
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers(
   customer_id INT GENERATED ALWAYS AS IDENTITY,
   customer_name VARCHAR(255) NOT NULL,
   PRIMARY KEY(customer_id)
);

CREATE TABLE contacts(
   contact_id INT GENERATED ALWAYS AS IDENTITY,
   customer_id INT,
   contact_name VARCHAR(255) NOT NULL,
   phone VARCHAR(15),
   email VARCHAR(100),
   PRIMARY KEY(contact_id),
   CONSTRAINT fk_customer
      FOREIGN KEY(customer_id)
   REFERENCES customers(customer_id)
   ON DELETE SET NULL
);
```

Second, insert data into the `customers` and `contacts` tables:

```sql
INSERT INTO customers(customer_name)
VALUES('BlueBird Inc'),
      ('Dolphin LLC');

INSERT INTO contacts(customer_id, contact_name, phone, email)
VALUES(1,'John Doe','(408)-111-1234','john.doe@bluebird.dev'),
      (1,'Jane Doe','(408)-111-1235','jane.doe@bluebird.dev'),
      (2,'David Wright','(408)-222-1234','david.wright@dolphin.dev');
```

Third, delete the customer with id 1 from the `customers` table:

```sql
DELETE FROM customers
WHERE customer_id = 1;
```

Because of the `ON DELETE SET NULL` action, the referencing rows in the `contacts` table are set to NULL.

Finally, display the data in the `contacts` table:

```sql
SELECT * FROM contacts;
```

Output:

```
 contact_id | customer_id | contact_name |     phone      |          email
------------+-------------+--------------+----------------+--------------------------
          3 |           2 | David Wright | (408)-222-1234 | david.wright@dolphin.dev
          1 |        null | John Doe     | (408)-111-1234 | john.doe@bluebird.dev
          2 |        null | Jane Doe     | (408)-111-1235 | jane.doe@bluebird.dev
(3 rows)
```

The output indicates that the values of customer id 1 changed to `NULL`.

### CASCADE

The `ON DELETE CASCADE` automatically deletes all the referencing rows in the child table when the referenced rows in the parent table are deleted. In practice, the `ON DELETE CASCADE` is the most commonly used option.

The following statements recreate the sample tables with the delete action of the `fk_customer` changes to `CASCADE`:

```sql
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers(
   customer_id INT GENERATED ALWAYS AS IDENTITY,
   customer_name VARCHAR(255) NOT NULL,
   PRIMARY KEY(customer_id)
);

CREATE TABLE contacts(
   contact_id INT GENERATED ALWAYS AS IDENTITY,
   customer_id INT,
   contact_name VARCHAR(255) NOT NULL,
   phone VARCHAR(15),
   email VARCHAR(100),
   PRIMARY KEY(contact_id),
   CONSTRAINT fk_customer
      FOREIGN KEY(customer_id)
   REFERENCES customers(customer_id)
   ON DELETE CASCADE
);

INSERT INTO customers(customer_name)
VALUES('BlueBird Inc'),
      ('Dolphin LLC');

INSERT INTO contacts(customer_id, contact_name, phone, email)
VALUES(1,'John Doe','(408)-111-1234','john.doe@bluebird.dev'),
      (1,'Jane Doe','(408)-111-1235','jane.doe@bluebird.dev'),
      (2,'David Wright','(408)-222-1234','david.wright@dolphin.dev');
```

The following statement deletes the customer id 1:

```sql
DELETE FROM customers
WHERE customer_id = 1;
```

Because of the `ON DELETE CASCADE` action, all the referencing rows in the `contacts` table are automatically deleted:

```sql
SELECT * FROM contacts;
```

Output:

```
 contact_id | customer_id | contact_name |     phone      |          email
------------+-------------+--------------+----------------+--------------------------
          3 |           2 | David Wright | (408)-222-1234 | david.wright@dolphin.dev
(1 row)
```

### SET DEFAULT

The `ON DELETE SET DEFAULT` sets the default value to the foreign key column of the referencing rows in the child table when the referenced rows from the parent table are deleted.

## Add a foreign key constraint to an existing table

To add a foreign key constraint to the existing table, you use the following form of the [ALTER TABLE](/docs/postgresql/postgresql-alter-table)statement:

```sql
ALTER TABLE child_table
ADD CONSTRAINT constraint_name
FOREIGN KEY (fk_columns)
REFERENCES parent_table (parent_key_columns);
```

When adding a foreign key constraint with `ON DELETE CASCADE` option to an existing table, you need to follow these steps:

First, drop existing foreign key constraint:

```sql
ALTER TABLE child_table
DROP CONSTRAINT constraint_fkey;
```

Second, add a new foreign key constraint with `ON DELETE CASCADE` action:

```sql
ALTER TABLE child_table
ADD CONSTRAINT constraint_fk
FOREIGN KEY (fk_columns)
REFERENCES parent_table(parent_key_columns)
ON DELETE CASCADE;
```

## Summary

- Use foreign keys to ensure the referential integrity and consistency of data between two tables.
- Use the `FOREIGN KEY` constraint to define a foreign key constraint when creating a table.
- Use the `ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY` to add a foreign key constraint to an existing table.
