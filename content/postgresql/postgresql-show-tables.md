---
title: 'PostgreSQL Show Tables'
redirectFrom: 
            - /postgresql/postgresql-administration/postgresql-show-tables
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to show tables in PostgreSQL using `psql` tool and `pg_catalog` schema.

MySQL offers a popular [`SHOW TABLES`](http://www.mysqltutorial.org/mysql-show-tables/) statement that displays all tables in a specific database.

Unfortunately, PostgreSQL does not support the `SHOW TABLES` statement directly but provides you with alternatives.

## Showing tables from PostgreSQL using psql

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL using psql client tool:

```
psql -U postgres
```

Second, change the current database to the one that you want to show tables:

```
\c dvdrental
```

Note that you can connect to a specific database when you log in to the PostgreSQL database server:

```
psql -U postgres -d dvdrental
```

In this command, the `-d` flag means **d**atabase. In this command, you connect to the `dvdrental` database using the `postgres` user.

Third, use the `\dt` command from the PostgreSQL command prompt to show tables in the `dvdrental` database:

```
\dt
```

Output:

```
             List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | actor         | table | postgres
 public | address       | table | postgres
 public | category      | table | postgres
 public | city          | table | postgres
 public | country       | table | postgres
 public | customer      | table | postgres
 public | film          | table | postgres
 public | film_actor    | table | postgres
 public | film_category | table | postgres
 public | inventory     | table | postgres
 public | language      | table | postgres
 public | payment       | table | postgres
 public | rental        | table | postgres
 public | staff         | table | postgres
 public | store         | table | postgres
(15 rows)
```

To get more information on tables, you can use the `\dt+` command. It will add the `size` and `description` columns:

```
\dt+
```

Output:

```
                                         List of relations
 Schema |     Name      | Type  |  Owner   | Persistence | Access method |    Size    | Description
--------+---------------+-------+----------+-------------+---------------+------------+-------------
 public | actor         | table | postgres | permanent   | heap          | 40 kB      |
 public | address       | table | postgres | permanent   | heap          | 88 kB      |
 public | category      | table | postgres | permanent   | heap          | 8192 bytes |
 public | city          | table | postgres | permanent   | heap          | 64 kB      |
 public | country       | table | postgres | permanent   | heap          | 8192 bytes |
 public | customer      | table | postgres | permanent   | heap          | 96 kB      |
 public | film          | table | postgres | permanent   | heap          | 736 kB     |
 public | film_actor    | table | postgres | permanent   | heap          | 272 kB     |
 public | film_category | table | postgres | permanent   | heap          | 72 kB      |
 public | inventory     | table | postgres | permanent   | heap          | 232 kB     |
 public | language      | table | postgres | permanent   | heap          | 8192 bytes |
 public | payment       | table | postgres | permanent   | heap          | 896 kB     |
 public | rental        | table | postgres | permanent   | heap          | 1232 kB    |
 public | staff         | table | postgres | permanent   | heap          | 16 kB      |
 public | store         | table | postgres | permanent   | heap          | 8192 bytes |
(15 rows)
```

To show the details of a specific table, you can specify the name of the table after the \\d command:

```
\d table_name
```

Or

```
\d+ table_name
```

For example, the following shows the structure of the actor table:

```
\d actor
```

Output:

```
                                            Table "public.actor"
   Column    |            Type             | Collation | Nullable |                 Default
-------------+-----------------------------+-----------+----------+-----------------------------------------
 actor_id    | integer                     |           | not null | nextval('actor_actor_id_seq'::regclass)
 first_name  | character varying(45)       |           | not null |
 last_name   | character varying(45)       |           | not null |
 last_update | timestamp without time zone |           | not null | now()
Indexes:
    "actor_pkey" PRIMARY KEY, btree (actor_id)
    "idx_actor_first_name" btree (first_name)
    "idx_actor_last_name" btree (last_name)
Referenced by:
    TABLE "film_actor" CONSTRAINT "film_actor_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES actor(actor_id) ON UPDATE CASCADE ON DELETE RESTRICT
Triggers:
    last_updated BEFORE UPDATE ON actor FOR EACH ROW EXECUTE FUNCTION last_updated()
```

## Showing tables using pg_catalog schema

The following statement retrieves the table in PostgreSQL from the `pg_catalog.pg_tables` view:

```sql
SELECT *
FROM pg_catalog.pg_tables
WHERE schemaname != 'pg_catalog' AND
    schemaname != 'information_schema';
```

Output:

```
 schemaname |   tablename   | tableowner | tablespace | hasindexes | hasrules | hastriggers | rowsecurity
------------+---------------+------------+------------+------------+----------+-------------+-------------
 public     | actor         | postgres   | null       | t          | f        | t           | f
 public     | store         | postgres   | null       | t          | f        | t           | f
 public     | address       | postgres   | null       | t          | f        | t           | f
 public     | category      | postgres   | null       | t          | f        | t           | f
 public     | city          | postgres   | null       | t          | f        | t           | f
 public     | country       | postgres   | null       | t          | f        | t           | f
 public     | customer      | postgres   | null       | t          | f        | t           | f
 public     | film_actor    | postgres   | null       | t          | f        | t           | f
 public     | film_category | postgres   | null       | t          | f        | t           | f
 public     | inventory     | postgres   | null       | t          | f        | t           | f
 public     | language      | postgres   | null       | t          | f        | t           | f
 public     | rental        | postgres   | null       | t          | f        | t           | f
 public     | staff         | postgres   | null       | t          | f        | t           | f
 public     | payment       | postgres   | null       | t          | f        | t           | f
 public     | film          | postgres   | null       | t          | f        | t           | f
(15 rows)
```

In this query, we use a condition in the `WHERE` clause to exclude the system tables. If you omit the `WHERE` clause, you will get many tables including the system ones.

## Summary

- Use the `\dt` or `\dt+` command in `psql` to show tables in a specific database.
- Use the `SELECT` statement to query table information from the `pg_catalog.pg_tables` catalog.
