---
title: "PostgreSQL Copy Table: A Step-by-Step Guide with Practical Examples"
page_title: "PostgreSQL Copy Table: A Step-by-Step Guide"
page_description: "In this tutorial, you will learn how to copy an existing table to a new one using various PostgreSQL copy table statements."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-copy-table/"
ogImage: "/postgresqltutorial/PostgreSQL-Copy-Table-300x260.png"
updatedOn: "2024-02-18T08:28:51+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Temporary Table"
  slug: "postgresql-tutorial/postgresql-temporary-table"
next_page: 
  title: "PostgreSQL Primary Key"
  slug: "postgresql-tutorial/postgresql-primary-key"
---




![PostgreSQL Copy Table](/postgresqltutorial/PostgreSQL-Copy-Table-300x260.png?alignright)**Summary**: in this tutorial, we will show you step by step how to copy an existing table including table structure and data by using the various forms of PostgreSQL copy table statement.


## Introduction to PostgreSQL copy table statement

To copy a table completely, including both table structure and data, you use the following statement:


```sql
CREATE TABLE new_table AS 
TABLE existing_table;
```
To copy a table structure without data, you add the `WITH NO DATA` clause to the `CREATE TABLE` statement as follows:


```sql
CREATE TABLE new_table AS 
TABLE existing_table 
WITH NO DATA;
```
To copy a table with partial data from an existing table, you use the following statement:


```sql
CREATE TABLE new_table AS 
SELECT
*
FROM
    existing_table
WHERE
    condition;

```
The condition of the [`WHERE`](postgresql-where) clause of the query defines which rows of the existing table that you want to copy to the new table.

Note that all the statements above copy table structure and data but do not copy indexes and constraints of the existing table.


## PostgreSQL copy table example

First, [create a new table](postgresql-create-table) named `contacts` for the demonstration:


```sql
CREATE TABLE contacts(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE
);
```
In this table, we have two indexes: one index for the [primary key](postgresql-primary-key) and another for the [`UNIQUE`](postgresql-unique-constraint) constraint.

Second, [insert](postgresql-insert) some rows into the `contacts` table:


```sql
INSERT INTO contacts(first_name, last_name, email) 
VALUES('John','Doe','[[email protected]](../cdn-cgi/l/email-protection.html)'),
      ('David','William','[[email protected]](../cdn-cgi/l/email-protection.html)')
RETURNING *;
```
Output:


```sql
 id | first_name | last_name |                email
----+------------+-----------+--------------------------------------
  1 | John       | Doe       | [[email protected]](../cdn-cgi/l/email-protection.html)
  2 | David      | William   | [[email protected]](../cdn-cgi/l/email-protection.html)
(2 rows)
```
Third, create a copy the `contacts` to a new table such as `contacts_backup` table using the following statement:


```
CREATE TABLE contact_backup 
AS TABLE contacts;
```
This statement creates a new table called `contact_backup` whose structure is the same as the `contacts` table. Additionally, it copies data from the `contacts` table to the `contact_backup` table.

Fourth, verify the data of the `contact_backup` table by using the following [`SELECT`](postgresql-select) statement:


```sql
SELECT * FROM contact_backup;
```
Output:


```
id | first_name | last_name |                email
----+------------+-----------+--------------------------------------
  1 | John       | Doe       | [[email protected]](../cdn-cgi/l/email-protection.html)
  2 | David      | William   | [[email protected]](../cdn-cgi/l/email-protection.html)
(2 rows)
```
It returns two rows as expected.

Fifth, examine the structure of the `contact_backup` table:


```sql
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

Sixth, add the primary key and `UNIQUE` constraints to the `contact_backup` table using the following [`ALTER TABLE`](postgresql-alter-table) statements:


```sql
ALTER TABLE contact_backup ADD PRIMARY KEY(id);
ALTER TABLE contact_backup ADD UNIQUE(email);
```
Finally, view the structure of the `contact_backup` table:


```sql
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

* Use the `CREATE TABLE table_name AS TABLE table_copy` statement to make a copy of a table to a new one.

