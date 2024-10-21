---
modifiedAt: 2024-03-16 01:19:05
prevPost: postgresql-or-operator
nextPost: postgresql-jsonb_path_query_array-function
createdAt: 2024-01-25T13:02:26.000Z
title: 'PostgreSQL List Views'
redirectFrom: 
            - /postgresql/postgresql-views/postgresql-list-views
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to list views in the PostgreSQL database server using the `psql` command and SQL statements.

In PostgreSQL, views are named queries stored directly within the database server. These views allow you to encapsulate complex SQL queries, enabling you to retrieve specific subset data from underlying tables easily.

PostgreSQL offers some options for listing views within the current database. You can either use the `\dv` command in `psql` or query the `information_schema.views` and `pg_matviews` views directly.

## Listing views using psql

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL using the following `psql` command:

```
psql -U postgres
```

It'll prompt you to enter a password for the `postgres` user.

Second, change the current database to the desired one where you want to list the views, for example, `dvdrental`:

```
\c dvdrental
```

Finally, list the view in the database using the `\dv` command:

```
\dv
```

In this command, `dv` stands for **d**isplay **v**iews. The `\dv` command allows you to quickly examine the views in the database without having to write SQL queries.

Output:

```
                   List of relations
 Schema |            Name            | Type |  Owner
--------+----------------------------+------+----------
 public | actor_info                 | view | postgres
 public | contact                    | view | postgres
 public | customer_info              | view | postgres
 public | customer_list              | view | postgres
 public | customer_usa               | view | postgres
 public | film_list                  | view | postgres
 public | nicer_but_slower_film_list | view | postgres
 public | sales_by_film_category     | view | postgres
 public | sales_by_store             | view | postgres
 public | staff_list                 | view | postgres
(10 rows)
```

The output has four columns:

- `Schema`: Indicates the schema of the view. When you create a view without a schema, it defaults to public.
- `Name`: Specifies the name of the view.
- `Type`: Denotes the type of the object, which is `view` in this case.
- `Owner`: Shows the user account that created the view.

## Listing view using SQL statement

PostgreSQL offers various database views that contain information about objects defined in the current database through the information schema.

To retrieve the information about database views, you can execute the following SQL statement:

```sql
SELECT
  table_schema,
  table_name
FROM
  information_schema.views
WHERE
  table_schema NOT IN (
    'information_schema', 'pg_catalog'
  )
ORDER BY
  table_schema,
  table_name;
```

The output will display the schema and the name of the views:

```
 table_schema |         table_name
--------------+----------------------------
 public       | actor_info
 public       | contact
 public       | customer_info
 public       | customer_list
 public       | customer_usa
 public       | film_list
 public       | nicer_but_slower_film_list
 public       | sales_by_film_category
 public       | sales_by_store
 public       | staff_list
 web          | film_rating
(11 rows)
```

## Listing materialized views

To retrieve all [materialized views](/postgresql/postgresql-views/postgresql-materialized-views), you can query them from the `pg_matviews` view:

```sql
SELECT * FROM pg_matviews\G
```

Output:

```
 schemaname |    matviewname     | matviewowner | tablespace | hasindexes | ispopulated |                          definition
------------+--------------------+--------------+------------+------------+-------------+---------------------------------------------------------------
 public     | rental_by_category | postgres     | null       | t          | t           |  SELECT c.name AS category,                                  +
            |                    |              |            |            |             |     sum(p.amount) AS total_sales                             +
            |                    |              |            |            |             |    FROM (((((payment p                                       +
            |                    |              |            |            |             |      JOIN rental r ON ((p.rental_id = r.rental_id)))         +
            |                    |              |            |            |             |      JOIN inventory i ON ((r.inventory_id = i.inventory_id)))+
            |                    |              |            |            |             |      JOIN film f ON ((i.film_id = f.film_id)))               +
            |                    |              |            |            |             |      JOIN film_category fc ON ((f.film_id = fc.film_id)))    +
            |                    |              |            |            |             |      JOIN category c ON ((fc.category_id = c.category_id)))  +
            |                    |              |            |            |             |   GROUP BY c.name                                            +
            |                    |              |            |            |             |   ORDER BY (sum(p.amount)) DESC;
(1 row)
```

The output includes detailed information about materialized views, including their definitions.

If you solely want to get the names of the materialized view, you can use the following query:

```sql
SELECT
  matviewname AS materialized_view_name
FROM
  pg_matviews
ORDER BY
  materialized_view_name;
```

This query will return only the names of the materialized views.

Output:

```
 materialized_view_name
------------------------
 rental_by_category
(1 row)
```

## Summary

- Utilize the `\dv` command to list all views of a database using the `psql` program.
- Use the `information_schemas.views` view to retrieve information about views.
- Use the `pg_matviews` view to obtain the materialized views.
