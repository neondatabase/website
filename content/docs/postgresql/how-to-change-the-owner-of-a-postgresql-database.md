---
title: 'How to Change the Owner of a PostgreSQL Database'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgres-change-database-owner/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to change the owner of a database to another in PostgreSQL.

In PostgreSQL, a database object always has an owner which is the role that created the object including the database.

To change the owner of a database to another, you can use the `ALTER` `DATABASE` statement:

```
ALTER DATABASE dbname
OWNER TO new_owner;
```

In this syntax:

- First, specify the database name that you want to change the owner after the `ALTER` `DATABASE` keyword
- Second, specify the new owner, an existing role, in the `OWNER` `TO` clause.

## Changing database owner example

First, [connect to the PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/) using `postgres` user via `psql`:

```
psql -U postgres
```

Second, [create a new role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/) with the `CREATEDB` privilege:

```
CREATE ROLE alex
WITH CREATEDB LOGIN PASSWORD 'Abcd1234';
```

Third, create another role called `steve`:

```
CREATE ROLE steve;
```

Fourth, connect to the PostgreSQL server using the `alex` role:

```
psql -U alex
```

Fifth, create a new database called `scm`:

```
CREATE DATABASE scm;
```

Sixth, quit `alex`'s session:

```
\q
```

Seven, show the `scm` database in the `postgres`' session:

```
\l scm
```

Output:

```
 Name | Owner | Encoding | Locale Provider |          Collate           |           Ctype            | ICU Locale | ICU Rules | Access privileges
------+-------+----------+-----------------+----------------------------+----------------------------+------------+-----------+-------------------
 scm  | alex  | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
(1 row)
```

The output shows that the owner of `scm` database is `alex`.

Eight, change the owner of the `scm` database from `alex` to `steve`:

```
ALTER DATABASE scm
OWNER TO steve;
```

Ninth, show the `scm` database again:

```
\l scm
```

Output:

```
                                                                List of databases
 Name | Owner | Encoding | Locale Provider |          Collate           |           Ctype            | ICU Locale | ICU Rules | Access privileges
------+-------+----------+-----------------+----------------------------+----------------------------+------------+-----------+-------------------
 scm  | steve | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
(1 row)
```

The output shows that the owner of the `scm` changed to `steve`.

## Summary

- Use the `ALTER DATABASE...OWNER TO` statement to change the owner of a database to a new one.
