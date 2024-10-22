---
title: "PostgreSQL MERGE Statement"
page_title: "PostgreSQL MERGE Statement"
page_description: "In this tutorial, you will learn how to use the PostgreSQL MERGE statement to conditionally insert, update, and delete rows of a table."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-merge/"
ogImage: ""
updatedOn: "2024-03-27T06:10:50+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL UPSERT using INSERT ON CONFLICT Statement"
  slug: "postgresql-tutorial/postgresql-upsert"
nextLink: 
  title: "PostgreSQL Transaction"
  slug: "postgresql-tutorial/postgresql-transaction"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `MERGE` statement to conditionally insert, update, and delete rows of a table.


## Introduction to the PostgreSQL MERGE statement

PostgreSQL 15 introduced the `MERGE` statement that simplifies data manipulation by combining [`INSERT`](postgresql-insert), [`UPDATE`](postgresql-update), and [`DELETE`](postgresql-delete) operations into a single statement. The `MERGE` statement is often referred to as [`UPSERT`](postgresql-upsert) statement.

If you use an earlier version, you should consider the `INSERT... ON CONFLICT` statement

Here’s the syntax of the `MERGE` statement:


```sql
MERGE INTO target_table
USING source_query
ON merge_condition
WHEN MATCH [AND condition] THEN {merge_update | merge_delete | DO NOTHING }
WHEN NOT MATCHED [AND condition] THEN { merge_insert | DO NOTHING };
```
In this syntax:

* `target_table` is the table you want to modify data (`INSERT`, `UPDATE`, and `DELETE`).
* `source_query` is a source table or a [SELECT](postgresql-select) statement that provides the data for the merge operation.
* `ON merge_condition`: This clause specifies the conditions for matching rows between the source and target tables.
* `WHEN MATCHED THEN`: This clause defines the statement on rows that match the merge condition. The condition provides additional conditions for performing either update or delete statements. If you don’t want to do anything for the matching rows, you can use the `DO` `NOTHING` option.
* `WHEN NOT MATCHED THEN`: This clause defines a statement on rows that don’t match the merge condition. You can specify either insert statement to add a new row to the target table or use `DO` `NOTHING` to ignore the matching rows.

Please note that `merge_insert`, `merg_update`, and `merge_delete` statements are slightly different from the regular `INSERT`, `UPDATE`, and `DELETE` statements.

The `merge_insert` is the `INSERT` statement without the table name:


```sql
INSERT (column1, ...)
VALUES(value1,...);
```
The `merge_update` statement is the `UPDATE` statement without the table name and `WHERE` clause:


```sql
UPDATE SET 
   column1 = value1, 
   column2 =value2,
   ...;
```
The `merge_delete` statement is the only `DELETE` keyword:


```sql
DELETE
```
Once completed successfully, the `MERGE` statement returns the following command tag:


```sql
MERGE total_count
```
In this tag, the `total_acount` is the total number of rows inserted, updated, or deleted. If the `total_count` is zero, it means that no rows were changed.

The `MERGE` statement can be useful for synchronizing data between tables, allowing you to efficiently keep a target table up\-to\-date with changes in a source table.


## PostgreSQL MERGE statement examples

Let’s explore some examples of using the `MERGE` statement.


### 0\) Setting up sample tables

First, [create two tables](postgresql-create-table) called `leads` and `customers`:


```sql
CREATE TABLE leads(
    lead_id serial PRIMARY key,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    active bool NOT NULL DEFAULT TRUE
);
CREATE TABLE customers(
    customer_id serial PRIMARY key,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    active bool NOT NULL DEFAULT TRUE
);
```
We’ll use the `MERGE` statement to merge the data of the two tables.


### 1\) Using the PostgreSQL MERGE statement to insert rows from the source table into the table

First, [insert two rows](postgresql-insert-multiple-rows) into the `leads` table:


```sql
INSERT INTO leads(name, email)
VALUES
   ('John Doe', '[[email protected]](../cdn-cgi/l/email-protection.html)'),
   ('Jane Doe', '[[email protected]](../cdn-cgi/l/email-protection.html)')
RETURNING *;
```
Output:


```sql
 lead_id |   name   |       email        | active
---------+----------+--------------------+--------
       1 | John Doe | [[email protected]](../cdn-cgi/l/email-protection.html) | t
       2 | Jane Doe | [[email protected]](../cdn-cgi/l/email-protection.html) | t
(2 rows)
```
Second, insert rows from the `leads` table into the `customers` table using the `MERGE` statement:


```sql
MERGE INTO customers c
USING leads l ON c.email = l.email
WHEN NOT MATCHED THEN 
   INSERT (name, email)
   VALUES(l.name, l.email);
```
In this statement, we use the `email` columns of the `leads` and `customers` tables for the merge condition.

If the `email` in the `leads` table does not match the `email` in `customers` table, the `MERGE` statement inserts a new row into the `customers` table.

Output:


```sql
MERGE 2
```
The output indicates that two rows have been inserted successfully.

Third, retrieve data from the `customers` table:


```sql
SELECT * FROM customers;
```
Output:


```sql
 customer_id |   name   |       email        | active
-------------+----------+--------------------+--------
           1 | John Doe | [[email protected]](../cdn-cgi/l/email-protection.html) | t
           2 | Jane Doe | [[email protected]](../cdn-cgi/l/email-protection.html) | t
(2 rows)
```

### 2\) Using the MERGE statement to update and insert rows from the source table into the table

First, [insert a new row](postgresql-insert) into the `leads` table and [update](postgresql-update) the `name` of the row with id 2:


```sql
INSERT INTO leads(name, email)
VALUES('Alice Smith', '[[email protected]](../cdn-cgi/l/email-protection.html)');
	
UPDATE leads
SET name = 'Jane Gate'
WHERE lead_id = 2;
```
Second, retrieve data from the `leads` table:


```sql
SELECT * FROM leads
ORDER BY id;
```
Output:


```sql
 lead_id |    name     |          email          | active
---------+-------------+-------------------------+--------
       1 | John Doe    | [[email protected]](../cdn-cgi/l/email-protection.html)      | t
       2 | Jane Gate   | [[email protected]](../cdn-cgi/l/email-protection.html)      | t
       3 | Alice Smith | [[email protected]](../cdn-cgi/l/email-protection.html) | t
(3 rows)
```
The `leads` table has a modified row with id 2 and a new row with id 3\.

Third, add the new row from `leads` table to the `customers` table and update the `name` and `email` for the updated row:


```sql
MERGE INTO customers c
USING leads l ON c.email = l.email
WHEN NOT MATCHED THEN 
   INSERT (name, email)
   VALUES(l.name, l.email)
WHEN MATCHED THEN
   UPDATE SET 
      name = l.name, 
      email = l.email;
```
This `MERGE` statement matches the `email` column, insert a new row into to the `customers` table, and updates existing rows in the `customers` table based on data from the `leads` table.

Output:


```sql
MERGE 3
```
The output indicates that three rows have been modified:

* Insert a new row.
* Update two matching rows.


### 3\) Using the MERGE statement to update, insert, and delete rows

First, insert a new row into the `leads` table:


```sql
INSERT INTO leads(name, email)
VALUES('Bob Climo', '[[email protected]](../cdn-cgi/l/email-protection.html)');
```
Second, set the `active` of the lead id 2 to `false`:


```sql
UPDATE leads
SET active = false
WHERE lead_id = 2;
```
Third, change the email of the lead id 1 to ‘`[[email protected]](../cdn-cgi/l/email-protection.html)`‘:


```sql
UPDATE leads
SET email = '[[email protected]](../cdn-cgi/l/email-protection.html)'
WHERE lead_id = 1;
```
Fourth, retrieve data from the `leads` table:


```sql
SELECT * FROM leads
ORDER BY lead_id;
```
Output:


```sql
 lead_id |    name     |          email          | active
---------+-------------+-------------------------+--------
       1 | John Doe    | [[email protected]](../cdn-cgi/l/email-protection.html)    | t
       2 | Jane Gate   | [[email protected]](../cdn-cgi/l/email-protection.html)      | f
       3 | Alice Smith | [[email protected]](../cdn-cgi/l/email-protection.html) | t
       4 | Bob Climo   | [[email protected]](../cdn-cgi/l/email-protection.html)    | t
(4 rows)
```
Fifth, insert the new row from the `leads` table into the `customers` table, delete a row whose active is false from the `customers` table, and update the `name` and `email` for the row whose `active` is true:


```sql
MERGE INTO customers c
USING leads l ON c.email = l.email
WHEN NOT MATCHED THEN 
   INSERT (name, email)
   VALUES(l.name, l.email)
WHEN MATCHED AND l.active = false THEN
   DELETE
WHEN MATCHED AND l.active = true THEN
   UPDATE SET 
      name = l.name, 
      email = l.email;
```
Output:


```sql
MERGE 4
```
Finally, retrieve rows from the `customers` table:


```sql
SELECT * FROM customers;
```
Output:


```sql
 customer_id |    name     |          email          | active
-------------+-------------+-------------------------+--------
           1 | John Doe    | [[email protected]](../cdn-cgi/l/email-protection.html)      | t
           3 | Alice Smith | [[email protected]](../cdn-cgi/l/email-protection.html) | t
           4 | Bob Climo   | [[email protected]](../cdn-cgi/l/email-protection.html)    | t
           5 | John Doe    | [[email protected]](../cdn-cgi/l/email-protection.html)    | t
(4 rows)
```

## Summary

* Use the `MERGE` statement to conditionally insert, update, and delete rows of a table.

