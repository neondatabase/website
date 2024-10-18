---
title: 'PostgreSQL ADD COLUMN:  Add One or More Columns to a Table'
redirectFrom: 
            - /docs/postgresql/postgresql-add-column
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Add-Column-300x128.png
tableOfContents: true
---


![PostgreSQL Add Column](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Add-Column-300x128.png)





**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ADD COLUMN` statement to add one or more columns to an existing table.





## Introduction to the PostgreSQL ADD COLUMN statement





To add a new column to an existing table, you use the [`ALTER TABLE`](/docs/postgresql/postgresql-alter-table) `ADD COLUMN` statement as follows:





```
ALTER TABLE table_name
ADD COLUMN new_column_name data_type constraint;
```





In this syntax:





- 
- First, specify the name of the table to which you want to add a new column after the `ALTER TABLE` keyword.
- 
-
- 
- Second, specify the name of the new column as well as its data type and constraint after the `ADD COLUMN` keywords.
- 





When you add a new column to the table, PostgreSQL appends it at the end of the table. PostgreSQL has no option to specify the position of the new column in the table.





To add multiple columns to an existing table, you use multiple `ADD COLUMN` clauses in the `ALTER TABLE` statement as follows:





```
ALTER TABLE table_name
ADD COLUMN column_name1 data_type constraint,
ADD COLUMN column_name2 data_type constraint,
...
ADD COLUMN column_namen data_type constraint;
```





## PostgreSQL ADD COLUMN statement examples





Let's take some examples of using the `ALTER TABLE...ADD COLUMN` statement.





### Creating a sample table





The following `CREATE TABLE` statement creates a new table named `customers` with two columns: `id` and `customer_name`:





```
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL
);
```





### 1) Adding a new column to a table





First, add the `phone` column to the `customers` table using the `ALTER TABLE...ADD COLUMN` statement:





```
ALTER TABLE customers
ADD COLUMN phone VARCHAR(25);
```





Second, view the `customers` table in psql:





```
\d customers
```





Output:





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





### 2) Adding multiple columns to a table





First, add the `fax` and `email` columns to the `customers` table:





```
ALTER TABLE customers
ADD COLUMN fax VARCHAR (25),
ADD COLUMN email VARCHAR (400);
```





Second, view the structure of the `customers` table in `psql`:





```
\d customers
```





Output:





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





The output shows the `fax` and `email` columns were added to the `customers` table.





### 3) Adding a column with a NOT NULL constraint to a table that already has data





First, [insert data](/docs/postgresql/postgresql-insert) into the `customers` table:





```
INSERT INTO
   customers (customer_name)
VALUES
   ('Apple'),
   ('Samsung'),
   ('Sony')
RETURNING *;
```





Output:





```
 id | customer_name | phone | fax  | email
----+---------------+-------+------+-------
  4 | Apple         | null  | null | null
  5 | Samsung       | null  | null | null
  6 | Sony          | null  | null | null
(3 rows)


INSERT 0 3
```





Second, attempt to add the `contact_name` column to the `customers` table:





```
ALTER TABLE customers
ADD COLUMN contact_name VARCHAR(255) NOT NULL;
```





PostgreSQL issued an error:





```
ERROR:  column "contact_name" of relation "customers" contains null values
```





This is because the `contact_name` column has the [`NOT NULL`](/docs/postgresql/postgresql-not-null-constraint) constraint. When PostgreSQL added the column, this new column received `NULL`, which violates the `NOT NULL` constraint.





To address this issue, you can follow these steps:





First, add the `contact_name` column without the `NOT NULL` constraint:





```
ALTER TABLE customers
ADD COLUMN contact_name VARCHAR(255);
```





Second, update the values in the `contact_name` column.





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





If you have contact data from other tables, you can update the contact names in the `customers` table based on the data from those tables using the [update join statement](/docs/postgresql/postgresql-update-join).





Third, modify the `contact_name` column to add the `NOT NULL` constraint:





```
ALTER TABLE customers
ALTER COLUMN contact_name
SET NOT NULL;
```





## Summary





- 
- Use the PostgreSQL `ALTER TABLE...ADD COLUMN` statement to add one or more columns to a table.
- 

