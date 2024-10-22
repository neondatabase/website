---
title: "PostgreSQL List Indexes"
page_title: "PostgreSQL List Indexes"
page_description: "In this tutorial, you will learn how to list indexes from a PostgreSQL database using either pg_indexes view or psql command."
prev_url: "https://www.postgresqltutorial.com/postgresql-indexes/postgresql-list-indexes/"
ogImage: ""
updatedOn: "2024-06-07T14:04:49+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL DROP INDEX"
  slug: "postgresql-indexes/postgresql-drop-index"
nextLink: 
  title: "PostgreSQL Index Types"
  slug: "postgresql-indexes/postgresql-index-types"
---




**Summary**: in this tutorial, you will learn how to list indexes from a PostgreSQL database by using either `pg_indexes` view or `psql` command.

PostgreSQL does not provide a command like [`SHOW INDEXES`](http://www.mysqltutorial.org/mysql-index/mysql-show-indexes/) to list the index information of a table or database.

However, it does provide you with access to the `pg_indexes` view so that you can query the index information.

If you use the `psql` program to interact with the PostgreSQL database, you can use the `\d` command to view the index information for a table.


## PostgreSQL List Indexes using pg\_indexes View

The `pg_indexes` view allows you to access useful information on each index in the PostgreSQL database.

The `pg_indexes` view consists of five columns:

* `schemaname`: stores the name of the schema that contains tables and indexes.
* `tablename`: indicates the name of the table to which the index belongs.
* `indexname`: represents the name of the index.
* `tablespace`: identifies the name of the tablespace that contains indexes.
* `indexdef`: contains the index definition command in the form of [`CREATE INDEX`](postgresql-create-index) statement.

The following statement lists all indexes of the schema `public` in the current database:


```phpsql
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;
```
Output:


```sql
     tablename      |                      indexname                      |                                                                   indexdef
--------------------+-----------------------------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------
 accounts           | accounts_email_key                                  | CREATE UNIQUE INDEX accounts_email_key ON public.accounts USING btree (email)
 accounts           | accounts_pkey                                       | CREATE UNIQUE INDEX accounts_pkey ON public.accounts USING btree (user_id)
 accounts           | accounts_username_key                               | CREATE UNIQUE INDEX accounts_username_key ON public.accounts USING btree (username)
 actor              | actor_pkey                                          | CREATE UNIQUE INDEX actor_pkey ON public.actor USING btree (actor_id)
 actor              | idx_actor_first_name                                | CREATE INDEX idx_actor_first_name ON public.actor USING btree (first_name)
 actor              | idx_actor_last_name                                 | CREATE INDEX idx_actor_last_name ON public.actor USING btree (last_name)
...
```
To show all the indexes of a table, you use the following statement:


```pgsql
SELECT 
  indexname, 
  indexdef 
FROM 
  pg_indexes 
WHERE 
  tablename = 'table_name';
```
For example, to list all the indexes for the `customer` table, you use the following statement:


```
SELECT
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename = 'customer';
```
Here is the output:


```php
     indexname     |                                    indexdef
-------------------+--------------------------------------------------------------------------------
 customer_pkey     | CREATE UNIQUE INDEX customer_pkey ON public.customer USING btree (customer_id)
 idx_fk_address_id | CREATE INDEX idx_fk_address_id ON public.customer USING btree (address_id)
 idx_fk_store_id   | CREATE INDEX idx_fk_store_id ON public.customer USING btree (store_id)
 idx_last_name     | CREATE INDEX idx_last_name ON public.customer USING btree (last_name)
(4 rows)

```
If you want to get a list of indexes for tables whose names start with the letter `c`, you can use the following query:


```pgsql
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename LIKE 'c%'
ORDER BY
    tablename,
    indexname;
```
The following shows the output:


```php
 tablename  |     indexname     |                                      indexdef
------------+-------------------+------------------------------------------------------------------------------------
 categories | categories_pkey   | CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (category_id)
 category   | category_pkey     | CREATE UNIQUE INDEX category_pkey ON public.category USING btree (category_id)
 city       | city_pkey         | CREATE UNIQUE INDEX city_pkey ON public.city USING btree (city_id)
 city       | idx_fk_country_id | CREATE INDEX idx_fk_country_id ON public.city USING btree (country_id)
 country    | country_pkey      | CREATE UNIQUE INDEX country_pkey ON public.country USING btree (country_id)
 customer   | customer_pkey     | CREATE UNIQUE INDEX customer_pkey ON public.customer USING btree (customer_id)
 customer   | idx_fk_address_id | CREATE INDEX idx_fk_address_id ON public.customer USING btree (address_id)
 customer   | idx_fk_store_id   | CREATE INDEX idx_fk_store_id ON public.customer USING btree (store_id)
 customer   | idx_last_name     | CREATE INDEX idx_last_name ON public.customer USING btree (last_name)
(9 rows)

```

## PostgreSQL List Indexes using psql command

If you use `psql` to connect to a PostgreSQL database and want to list all indexes of a table, you can use the `\d` [psql command](../postgresql-administration/psql-commands) as follows:


```plaintext
\d table_name
```
The command will return all information about the table including the table’s structure, indexes, constraints, and [triggers](../postgresql-triggers).

For example, the following statement returns detailed information about the `customer` table:


```plaintext
\d customer
```
The output is:


```plaintext
                                             Table "public.customer"
   Column    |            Type             | Collation | Nullable |                    Default
-------------+-----------------------------+-----------+----------+-----------------------------------------------
 customer_id | integer                     |           | not null | nextval('customer_customer_id_seq'::regclass)
 store_id    | smallint                    |           | not null |
 first_name  | character varying(45)       |           | not null |
 last_name   | character varying(45)       |           | not null |
 email       | character varying(50)       |           |          |
 address_id  | smallint                    |           | not null |
 activebool  | boolean                     |           | not null | true
 create_date | date                        |           | not null | 'now'::text::date
 last_update | timestamp without time zone |           |          | now()
 active      | integer                     |           |          |
Indexes:
    "customer_pkey" PRIMARY KEY, btree (customer_id)
    "idx_fk_address_id" btree (address_id)
    "idx_fk_store_id" btree (store_id)
    "idx_last_name" btree (last_name)
Foreign-key constraints:
    "customer_address_id_fkey" FOREIGN KEY (address_id) REFERENCES address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT
Referenced by:
    TABLE "payment" CONSTRAINT "payment_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT
    TABLE "rental" CONSTRAINT "rental_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT
Triggers:
    last_updated BEFORE UPDATE ON customer FOR EACH ROW EXECUTE FUNCTION last_updated()

```
The output shows the index of the table under the **Indexes** section.


## Summary

* Query data from the `pg_indexes` view to retrieve the index information.
* Use the `\d table_name` command to display the table information along with indexes.

