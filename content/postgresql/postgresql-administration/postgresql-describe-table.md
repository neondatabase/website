---
title: "PostgreSQL Describe Table"
page_title: "PostgreSQL DESCRIBE TABLE"
page_description: "Show you how to query information on columns of a table using psql tool and information_schema in PostgreSQL, like DESCRIBE TABLE in MySQL."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-describe-table/"
ogImage: ""
updatedOn: "2024-02-01T08:44:30+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL Show Tables"
  slug: "postgresql-administration/postgresql-show-tables"
nextLink: 
  title: "17 Practical psql Commands You Don’t Want to Miss"
  slug: "postgresql-administration/psql-commands"
---




**Summary**: in this tutorial, you will learn how to use the `psql` tool and `information_schema` to describe tables in PostgreSQL.

If you have been using MySQL, you typically use the [`DESCRIBE`](https://www.mysqltutorial.org/mysql-administration/mysql-show-columns/) statement to find the information about a table.

PostgreSQL does not support the `DESCRIBE`statement. However, you can query the information in columns of a table in a couple of ways.


## 1\) PostgreSQL DESCRIBE TABLE using psql

First, [connect to the PostgreSQL server](../postgresql-getting-started/connect-to-postgresql-database) using the `psql` tool:


```shellsql
psql -U postgres
```
It’ll prompt you to enter a password for the `postgres` user.

Second, change the current database to `dvdrental` [sample database](../postgresql-getting-started/postgresql-sample-database):


```shell
\c dvdrental
```
Third, execute the `\d table_name` to or `\d+ table_name` to show the structure of a table. For example, the following shows the structure of the `film` table in the sample database:


```php
\d film
```
Output:


```
                                              Table "public.film"
      Column      |            Type             | Collation | Nullable |                Default
------------------+-----------------------------+-----------+----------+---------------------------------------
 film_id          | integer                     |           | not null | nextval('film_film_id_seq'::regclass)
 title            | character varying(255)      |           | not null |
 description      | text                        |           |          |
 release_year     | year                        |           |          |
 language_id      | smallint                    |           | not null |
 rental_duration  | smallint                    |           | not null | 3
 rental_rate      | numeric(4,2)                |           | not null | 4.99
 length           | smallint                    |           |          |
 replacement_cost | numeric(5,2)                |           | not null | 19.99
 rating           | mpaa_rating                 |           |          | 'G'::mpaa_rating
 last_update      | timestamp without time zone |           | not null | now()
 special_features | text[]                      |           |          |
 fulltext         | tsvector                    |           | not null |
Indexes:
    "film_pkey" PRIMARY KEY, btree (film_id)
    "film_fulltext_idx" gist (fulltext)
    "idx_fk_language_id" btree (language_id)
    "idx_title" btree (title)
Foreign-key constraints:
    "film_language_id_fkey" FOREIGN KEY (language_id) REFERENCES language(language_id) ON UPDATE CASCADE ON DELETE RESTRICT
Referenced by:
    TABLE "film_actor" CONSTRAINT "film_actor_film_id_fkey" FOREIGN KEY (film_id) REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT
    TABLE "film_category" CONSTRAINT "film_category_film_id_fkey" FOREIGN KEY (film_id) REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT
    TABLE "inventory" CONSTRAINT "inventory_film_id_fkey" FOREIGN KEY (film_id) REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT
Triggers:
    film_fulltext_trigger BEFORE INSERT OR UPDATE ON film FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger('fulltext', 'pg_catalog.english', 'title', 'description')
    last_updated BEFORE UPDATE ON film FOR EACH ROW EXECUTE FUNCTION last_updated()
```
The command returns a lot of information on the structure of the `film` table. Additionally, it returns [indexes](../postgresql-indexes), [foreign key constraints](../postgresql-tutorial/postgresql-foreign-key), and [triggers](../postgresql-triggers).


## 2\) PostgreSQL DESCRIBE TABLE using information\_schema

The `information_schema.columns` catalog contains the information on columns of all tables. To get information on columns of a table, you query the `information_schema.columns` catalog.

For example:


```php
SELECT 
  column_name, 
  data_type, 
  character_maximum_length, 
  is_nullable, 
  column_default 
FROM 
  information_schema.columns 
WHERE 
  table_name = 'film';
```
Output:


```
   column_name    |          data_type          | character_maximum_length | is_nullable |            column_default
------------------+-----------------------------+--------------------------+-------------+---------------------------------------
 film_id          | integer                     |                     null | NO          | nextval('film_film_id_seq'::regclass)
 title            | character varying           |                      255 | NO          | null
 description      | text                        |                     null | YES         | null
 release_year     | integer                     |                     null | YES         | null
 language_id      | smallint                    |                     null | NO          | null
 rental_duration  | smallint                    |                     null | NO          | 3
 rental_rate      | numeric                     |                     null | NO          | 4.99
 length           | smallint                    |                     null | YES         | null
 replacement_cost | numeric                     |                     null | NO          | 19.99
 rating           | USER-DEFINED                |                     null | YES         | 'G'::mpaa_rating
 last_update      | timestamp without time zone |                     null | NO          | now()
 special_features | ARRAY                       |                     null | YES         | null
 fulltext         | tsvector                    |                     null | NO          | null
(13 rows)
```
Note that the `SELECT *`  from the `information_schema.columns` will retrieve a comprehensive set of information.


## Summary

* Use the `\d table_name` to show the structure of the table using `psql`.
* Query data from the `information_schema.columns` to retrieve the column information.

