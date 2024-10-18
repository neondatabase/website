---
title: 'PostgreSQL Copy Table: A Step-by-Step Guide with Practical Examples'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-copy-table/
ogImage: ./img/wp-content-uploads-2017-03-PostgreSQL-Copy-Table-300x260.png
tableOfContents: true
---
<!-- wp:image {"align":"right","id":2707} -->

![PostgreSQL Copy Table](./img/wp-content-uploads-2017-03-PostgreSQL-Copy-Table-300x260.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

**Summary**: in this tutorial, we will show you step by step how to copy an existing table including table structure and data by using the various forms of PostgreSQL copy table statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL copy table statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To copy a table completely, including both table structure and data, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE new_table AS
TABLE existing_table;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To copy a table structure without data, you add the `WITH NO DATA` clause to the `CREATE TABLE` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE new_table AS
TABLE existing_table
WITH NO DATA;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To copy a table with partial data from an existing table, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE new_table AS
SELECT
*
FROM
    existing_table
WHERE
    condition;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The condition of the [`WHERE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/) clause of the query defines which rows of the existing table that you want to copy to the new table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that all the statements above copy table structure and data but do not copy indexes and constraints of the existing table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL copy table example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named `contacts` for the demonstration:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE contacts(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this table, we have two indexes: one index for the [primary key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key/) and another for the [`UNIQUE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-unique-constraint/) constraint.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) some rows into the `contacts` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO contacts(first_name, last_name, email)
VALUES('John','Doe','john.doe@postgresqltutorial.com'),
      ('David','William','david.william@postgresqltutorial.com')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id | first_name | last_name |                email
----+------------+-----------+--------------------------------------
  1 | John       | Doe       | john.doe@postgresqltutorial.com
  2 | David      | William   | david.william@postgresqltutorial.com
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a copy the `contacts` to a new table such as `contacts_backup` table using the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE contact_backup
AS TABLE contacts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This statement creates a new table called `contact_backup` whose structure is the same as the `contacts` table. Additionally, it copies data from the `contacts` table to the `contact_backup` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, verify the data of the `contact_backup` table by using the following [`SELECT`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM contact_backup;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
id | first_name | last_name |                email
----+------------+-----------+--------------------------------------
  1 | John       | Doe       | john.doe@postgresqltutorial.com
  2 | David      | William   | david.william@postgresqltutorial.com
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns two rows as expected.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, examine the structure of the `contact_backup` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\d contact_backup;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
                  Table "public.contact_backup"
   Column   |       Type        | Collation | Nullable | Default
------------+-------------------+-----------+----------+---------
 id         | integer           |           |          |
 first_name | character varying |           |          |
 last_name  | character varying |           |          |
 email      | character varying |           |          |
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the structure of the `contact_backup` table is the same as the `contacts` table except for the indexes.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Sixth, add the primary key and `UNIQUE` constraints to the `contact_backup` table using the following [`ALTER TABLE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alter-table/) statements:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE contact_backup ADD PRIMARY KEY(id);
ALTER TABLE contact_backup ADD UNIQUE(email);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, view the structure of the `contact_backup` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\d contact_backup;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `CREATE TABLE table_name AS TABLE table_copy` statement to make a copy of a table to a new one.
- <!-- /wp:list-item -->

<!-- /wp:list -->
