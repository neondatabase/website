---
title: 'PostgreSQL Rename Table: A Step-by-Step Guide'
redirectFrom: 
            - /docs/postgresql/postgresql-rename-table
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will show how to rename a table using the PostgreSQL `ALTER TABLE RENAME TO` statement.





## Introduction to PostgreSQL RENAME TABLE statement





To change the name of an existing table, you use the `ALTER TABLE... RENAME TO` statement as follows:





```
ALTER TABLE table_name
RENAME TO new_table_name;
```





In this statement:





- 
- First, specify the name of the table which you want to rename after the `ALTER TABLE` clause.
- 
-
- 
- Second, assign the new table name after the `RENAME TO` clause.
- 





If you rename a table that does not exist, PostgreSQL will issue an error.





To avoid the error, you can use the the `IF EXISTS` option:





```
ALTER TABLE IF EXISTS table_name
RENAME TO new_table_name;
```





In this case, if the `table_name` does not exist, PostgreSQL will issue a notice instead.





To rename multiple tables, you have to execute multiple `ALTER TABLE ... RENAME TO` statements. It's not possible to rename multiple tables using a single `ALTER TABLE` statement.





## PostgreSQL rename table examples





Let's take some examples of using the `ALTER TABLE ... RENAME TO` statement.





### 1) Basic PostgreSQL rename table statement example





First, [create a new table](/docs/postgresql/postgresql-create-table) called `vendors` for the demonstration purpose:





```
CREATE TABLE vendors (
    id serial PRIMARY KEY,
    name VARCHAR NOT NULL
);
```





Second, describe the `vendors` table using the `\d` command in `psql`:





```
\d vendors
```





Output:





```
                                 Table "public.vendors"
 Column |       Type        | Collation | Nullable |               Default
--------+-------------------+-----------+----------+-------------------------------------
 id     | integer           |           | not null | nextval('vendors_id_seq'::regclass)
 name   | character varying |           | not null |
Indexes:
    "vendors_pkey" PRIMARY KEY, btree (id)
```





Third, change the name of the `vendors` table to `suppliers` using the `ALTER TABLE...RENAME TO` statement:





```
ALTER TABLE vendors
RENAME TO suppliers;
```





Finally, describe the `suppliers` table:





```
                                Table "public.suppliers"
 Column |       Type        | Collation | Nullable |               Default
--------+-------------------+-----------+----------+-------------------------------------
 id     | integer           |           | not null | nextval('vendors_id_seq'::regclass)
 name   | character varying |           | not null |
Indexes:
    "vendors_pkey" PRIMARY KEY, btree (id)
```





Notice that the name of the table changed but the [sequence](/docs/postgresql/postgresql-sequences) (`vendors_id_seq`) remains intact.





### 1) Renaming a table that has dependent objects





First, create new tables called `customers` and `groups`:





```
CREATE TABLE customer_groups(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES customer_groups(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);
```





Second, [create a view](https://www.postgresqltutorial.com/postgresql-views/postgresql-materialized-views/) based on the `customers` and `customer_groups` tables:





```
CREATE VIEW customer_data
AS SELECT
    c.id,
    c.name,
    g.name customer_group
FROM
    customers c
INNER JOIN customer_groups g ON g.id = c.group_id;
```





When you rename a table, PostgreSQL will automatically update its dependent objects such as [foreign key constraints](/docs/postgresql/postgresql-foreign-key/), [views](https://www.postgresqltutorial.com/postgresql-views/), and [indexes](https://www.postgresqltutorial.com/postgresql-indexes).





Third, rename the `customer_groups` table to `groups`:





```
ALTER TABLE customer_groups
RENAME TO groups;
```





Fourth, verify the foreign key constraint in the `customers` table by showing the table via `\d` command in `psql`:





```
\d customers
```





Output:





```
                                     Table "public.customers"
  Column  |          Type          | Collation | Nullable |                Default
----------+------------------------+-----------+----------+---------------------------------------
 id       | integer                |           | not null | nextval('customers_id_seq'::regclass)
 name     | character varying(255) |           | not null |
 group_id | integer                |           | not null |
Indexes:
    "customers_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "customers_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE
```





The output indicates that the foreign key constraint was updated and referenced the `groups` table instead of the `customer_groups` table.





Fifth, show the `customer_data` view in psql:





```
\d+ customer_data
```





Output:





```
                                    View "public.customer_data"
     Column     |          Type          | Collation | Nullable | Default | Storage  | Description
----------------+------------------------+-----------+----------+---------+----------+-------------
 id             | integer                |           |          |         | plain    |
 name           | character varying(255) |           |          |         | extended |
 customer_group | character varying      |           |          |         | extended |
View definition:
 SELECT c.id,
    c.name,
    g.name AS customer_group
   FROM customers c
     JOIN groups g ON g.id = c.group_id;
```





The output shows that the `supplier_groups` table in the [`SELECT`](/docs/postgresql/postgresql-select) statement of the view was also updated to `groups` table.





## Summary





- 
- Use the `ALTER TABLE ... RENAME TO` statement to rename a table.
- 


