---
title: "A Look at PostgreSQL User-defined Data Types"
page_title: "A Look at PostgreSQL User-defined Data Types"
page_description: "This tutorial shows you how to create PostgreSQL user-defined data type using CREATE DOMAIN and CREATE TYPE statements."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-user-defined-data-types/"
ogImage: "/postgresqltutorial/PostgreSQL-User-defined-Type-Example.png"
updatedOn: "2020-07-10T01:18:36+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL JSON"
  slug: "postgresql-tutorial/postgresql-json"
nextLink: 
  title: "PostgreSQL enum"
  slug: "postgresql-tutorial/postgresql-enum"
---




**Summary**: in this tutorial, you will learn how to create PostgreSQL user\-defined data type using `CREATE DOMAIN` and `CREATE TYPE` statements.

Besides built\-in [data types](postgresql-data-types), PostgreSQL allows you to create user\-defined data types through the following statements:

* `CREATE DOMAIN` creates a user\-defined data type with constraints such as [`NOT NULL`](postgresql-not-null-constraint), [`CHECK`](postgresql-check-constraint), etc.
* `CREATE TYPE` creates a composite type used in [stored procedures](https://neon.tech/postgresql/postgresql-stored-procedures/) as the data types of returned values.


## PostgreSQL CREATE DOMAIN statement

In PostgreSQL, a domain is a data type with optional constraints e.g., [`NOT NULL`](postgresql-not-null-constraint) and [`CHECK`](postgresql-check-constraint). A domain has a unique name within the schema scope.

Domains are useful for centralizing the management of fields with common constraints. For example, some tables may have the same column that do not accept NULL and spaces.

The following statement [create a table](postgresql-create-table) named `mailing_list`:


```sqlsql
CREATE TABLE mailing_list (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    CHECK (
        first_name !~ '\s'
        AND last_name !~ '\s'
    )
);
```
In this table, both `first_name` and `last_name` columns do not accept null and spaces. Instead of defining the `CHECK` constraint, you can create a `contact_name` domain and reuse it in multiple columns.

The following statement uses the `CREATE DOMAIN` to create a new domain called `contact_name` with the `VARCHAR` datatype and do not accept NULL and spaces:


```sql
CREATE DOMAIN contact_name AS 
   VARCHAR NOT NULL CHECK (value !~ '\s');
```
And you use `contact_name` as the datatype of the `first_name` and `last_name` columns as a regular built\-in type:


```sql
CREATE TABLE mailing_list (
    id serial PRIMARY KEY,
    first_name contact_name,
    last_name contact_name,
    email VARCHAR NOT NULL
);
```
The following statement inserts a new row into the `mailing_list` table:


```sql
INSERT INTO mailing_list (first_name, last_name, email)
VALUES('Jame V','Doe','[[email protected]](../cdn-cgi/l/email-protection.html)');
```
PostgreSQL issued the following error because the first name contains a space:


```sql
ERROR:  value for domain contact_name violates check constraint "contact_name_check"

```
The following statement works because it does not violate any constraints of the `contact_name` type:


```sql
INSERT INTO mailing_list (first_name, last_name, email)
VALUES('Jane','Doe','[[email protected]](../cdn-cgi/l/email-protection.html)');
```
To change or remove a domain, you use the `ALTER DOMAIN` or `DROP DOMAIN` respectively.

To view all domains in the current database, you use the `\dD` command as follows:


```sql
test=#\dD
                                     List of domains
 Schema |     Name     |       Type        | Modifier |               Check
--------+--------------+-------------------+----------+-----------------------------------
 public | contact_name | character varying | not null | CHECK (VALUE::text !~ '\s'::text)
(1 row)

```

### Getting domain information

To get all domains in a specific schema, you use the following query:


```sql
SELECT typname 
FROM pg_catalog.pg_type 
  JOIN pg_catalog.pg_namespace 
  	ON pg_namespace.oid = pg_type.typnamespace 
WHERE 
	typtype = 'd' and nspname = '<schema_name>';
```
The following statement returns domains in the `public` schema of the current database:


```sql
SELECT typname 
FROM pg_catalog.pg_type 
  JOIN pg_catalog.pg_namespace 
  	ON pg_namespace.oid = pg_type.typnamespace 
WHERE 
	typtype = 'd' and nspname = 'public';
```

![](/postgresqltutorial/PostgreSQL-User-defined-Type-Example.png)

## PostgreSQL CREATE TYPE

The `CREATE TYPE` statement allows you to create a composite type, which can be used as the return type of a function.

Suppose you want to have a function that returns several values: `film_id`, `title`, and `release_year`. The first step is to create a type e.g., `film_summary` as follows:


```
CREATE TYPE film_summary AS (
    film_id INT,
    title VARCHAR,
    release_year SMALLINT
); 

```
Second, use the `film_summary` data type as the return type of a function:


```sql
CREATE OR REPLACE FUNCTION get_film_summary (f_id INT) 
    RETURNS film_summary AS 
$$ 
SELECT
    film_id,
    title,
    release_year
FROM
    film
WHERE
    film_id = f_id ; 
$$ 
LANGUAGE SQL;
```
Third, call the `get_film_summary()` function:


```sql
SELECT * FROM get_film_summary (40);
```

![PostgreSQL user-defined type example](/postgresqltutorial/postgresql-user-defined-type.png)
To change a user\-defined type, you use the `ALTER TYPE` statement. To remove a user\-defined type, you use the `DROP TYPE` statement.

If you use the `psql` program, you can list all user\-defined types in the current database using the `\dT` or `\dT+` command:


```sql
dvdrental=# \dT
         List of data types
 Schema |     Name     | Description
--------+--------------+-------------
 public | contact_name |
 public | film_summary |
 public | mpaa_rating  |
(3 rows)
```
In this tutorial, you have learned how to create PostgreSQL user\-defined types using the `CREATE DOMAIN` and `CREATE TYPE` statements.

