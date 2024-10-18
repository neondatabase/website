---
title: 'PostgreSQL Rename Table: A Step-by-Step Guide'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-rename-table/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will show how to rename a table using the PostgreSQL `ALTER TABLE RENAME TO` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL RENAME TABLE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To change the name of an existing table, you use the `ALTER TABLE... RENAME TO` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
RENAME TO new_table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table which you want to rename after the `ALTER TABLE` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, assign the new table name after the `RENAME TO` clause.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

If you rename a table that does not exist, PostgreSQL will issue an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To avoid the error, you can use the the `IF EXISTS` option:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE IF EXISTS table_name
RENAME TO new_table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this case, if the `table_name` does not exist, PostgreSQL will issue a notice instead.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To rename multiple tables, you have to execute multiple `ALTER TABLE ... RENAME TO` statements. It's not possible to rename multiple tables using a single `ALTER TABLE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL rename table examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `ALTER TABLE ... RENAME TO` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL rename table statement example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `vendors` for the demonstration purpose:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE vendors (
    id serial PRIMARY KEY,
    name VARCHAR NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, describe the `vendors` table using the `\d` command in `psql`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\d vendors
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                                 Table "public.vendors"
 Column |       Type        | Collation | Nullable |               Default
--------+-------------------+-----------+----------+-------------------------------------
 id     | integer           |           | not null | nextval('vendors_id_seq'::regclass)
 name   | character varying |           | not null |
Indexes:
    "vendors_pkey" PRIMARY KEY, btree (id)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, change the name of the `vendors` table to `suppliers` using the `ALTER TABLE...RENAME TO` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE vendors
RENAME TO suppliers;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, describe the `suppliers` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                                Table "public.suppliers"
 Column |       Type        | Collation | Nullable |               Default
--------+-------------------+-----------+----------+-------------------------------------
 id     | integer           |           | not null | nextval('vendors_id_seq'::regclass)
 name   | character varying |           | not null |
Indexes:
    "vendors_pkey" PRIMARY KEY, btree (id)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that the name of the table changed but the [sequence](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-sequences/) (`vendors_id_seq`) remains intact.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Renaming a table that has dependent objects

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create new tables called `customers` and `groups`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [create a view](https://www.postgresqltutorial.com/postgresql-views/postgresql-materialized-views/) based on the `customers` and `customer_groups` tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

When you rename a table, PostgreSQL will automatically update its dependent objects such as [foreign key constraints](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/), [views](https://www.postgresqltutorial.com/postgresql-views/), and [indexes](https://www.postgresqltutorial.com/postgresql-indexes/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, rename the `customer_groups` table to `groups`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customer_groups
RENAME TO groups;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, verify the foreign key constraint in the `customers` table by showing the table via `\d` command in `psql`:

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

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the foreign key constraint was updated and referenced the `groups` table instead of the `customer_groups` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, show the `customer_data` view in psql:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\d+ customer_data
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows that the `supplier_groups` table in the [`SELECT`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) statement of the view was also updated to `groups` table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ALTER TABLE ... RENAME TO` statement to rename a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
