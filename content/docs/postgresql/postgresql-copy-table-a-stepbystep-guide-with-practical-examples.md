---
title: 'PostgreSQL Copy Table: A Step-by-Step Guide with Practical Examples'
redirectFrom: 
            - /docs/postgresql/postgresql-copy-table
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-03-PostgreSQL-Copy-Table-300x260.png
tableOfContents: true
---


![PostgreSQL Copy Table](/postgresqltutorial_data/wp-content-uploads-2017-03-PostgreSQL-Copy-Table-300x260.png)

**Summary**: in this tutorial, we will show you step by step how to copy an existing table including table structure and data by using the various forms of PostgreSQL copy table statement.

## Introduction to PostgreSQL copy table statement

To copy a table completely, including both table structure and data, you use the following statement:

```
CREATE TABLE new_table AS
TABLE existing_table;
```

To copy a table structure without data, you add the `WITH NO DATA` clause to the `CREATE TABLE` statement as follows:

```
CREATE TABLE new_table AS
TABLE existing_table
WITH NO DATA;
```

To copy a table with partial data from an existing table, you use the following statement:

```
CREATE TABLE new_table AS
SELECT
*
FROM
    existing_table
WHERE
    condition;
```

The condition of the [`WHERE`](/docs/postgresql/postgresql-where) clause of the query defines which rows of the existing table that you want to copy to the new table.

Note that all the statements above copy table structure and data but do not copy indexes and constraints of the existing table.

## PostgreSQL copy table example

First, [create a new table](/docs/postgresql/postgresql-create-table) named `contacts` for the demonstration:

```
CREATE TABLE contacts(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE
);
```

In this table, we have two indexes: one index for the [primary key](/docs/postgresql/postgresql-primary-key) and another for the [`UNIQUE`](/docs/postgresql/postgresql-tutorial/postgresql-unique-constraint) constraint.

Second, [insert](/docs/postgresql/postgresql-insert) some rows into the `contacts` table:

```
INSERT INTO contacts(first_name, last_name, email)
VALUES('John','Doe','john.doe@postgresqltutorial.com'),
      ('David','William','david.william@postgresqltutorial.com')
RETURNING *;
```

Output:

```
 id | first_name | last_name |                email
----+------------+-----------+--------------------------------------
  1 | John       | Doe       | john.doe@postgresqltutorial.com
  2 | David      | William   | david.william@postgresqltutorial.com
(2 rows)
```

Third, create a copy the `contacts` to a new table such as `contacts_backup` table using the following statement:

```
CREATE TABLE contact_backup
AS TABLE contacts;
```

This statement creates a new table called `contact_backup` whose structure is the same as the `contacts` table. Additionally, it copies data from the `contacts` table to the `contact_backup` table.

Fourth, verify the data of the `contact_backup` table by using the following [`SELECT`](/docs/postgresql/postgresql-select) statement:

```
SELECT * FROM contact_backup;
```

Output:

```
id | first_name | last_name |                email
----+------------+-----------+--------------------------------------
  1 | John       | Doe       | john.doe@postgresqltutorial.com
  2 | David      | William   | david.william@postgresqltutorial.com
(2 rows)
```

It returns two rows as expected.

Fifth, examine the structure of the `contact_backup` table:

```
\d contact_backup;
```

Output:

```
                  Table "public.contact_backup"
   Column   |       Type        | Collation | Nullable | Default
------------+-------------------+-----------+----------+---------
 id         | integer           |           |          |
 first_name | character varying |           |          |
 last_name  | character varying |           |          |
 email      | character varying |           |          |
```

The output indicates that the structure of the `contact_backup` table is the same as the `contacts` table except for the indexes.

Sixth, add the primary key and `UNIQUE` constraints to the `contact_backup` table using the following [`ALTER TABLE`](/docs/postgresql/postgresql-alter-table) statements:

```
ALTER TABLE contact_backup ADD PRIMARY KEY(id);
ALTER TABLE contact_backup ADD UNIQUE(email);
```

Finally, view the structure of the `contact_backup` table:

```
\d contact_backup;
```

Output:

```
                  Table "public.contact_backup"
   Column   |       Type        | Collation | Nullable | Default
------------+-------------------+-----------+----------+---------
 id         | integer           |           | not null |
 first_name | character varying |           |          |
 last_name  | character varying |           |          |
 email      | character varying |           |          |
Indexes:
    "contact_backup_pkey" PRIMARY KEY, btree (id)
    "contact_backup_email_key" UNIQUE CONSTRAINT, btree (email)
```

## Summary

- Use the `CREATE TABLE table_name AS TABLE table_copy` statement to make a copy of a table to a new one.
