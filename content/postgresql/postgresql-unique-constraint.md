---
title: 'PostgreSQL UNIQUE Constraint'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-unique-constraint/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about PostgreSQL `UNIQUE` constraint to make sure that values stored in a column or a group of columns are unique across rows in a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL UNIQUE constraint

<!-- /wp:heading -->

<!-- wp:paragraph -->

Sometimes, you want to ensure that values stored in a column or a group of columns are unique across the whole table such as email addresses or usernames.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL provides you with the `UNIQUE` constraint that maintains the uniqueness of the data correctly.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When a `UNIQUE` constraint is in place, every time you [insert a new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/), it checks if the value is already in the table. It rejects the change and issues an error if the value already exists. The same process is carried out for [updating existing data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you add a `UNIQUE` constraint to a column or a group of columns, PostgreSQL will automatically create a [unique index](https://www.postgresqltutorial.com/postgresql-indexes/postgresql-unique-index/) on the column or the group of columns.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL UNIQUE constraint example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement [creates a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named `person` with a `UNIQUE` constraint for the `email` column.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (50),
  last_name VARCHAR (50),
  email VARCHAR (50) UNIQUE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that the `UNIQUE` constraint above can be rewritten as a table constraint as shown in the following query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (50),
  last_name VARCHAR (50),
  email VARCHAR (50),
  UNIQUE(email)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

First, insert a new row into the `person` table using `INSERT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO person(first_name,last_name,email)
VALUES('john','doe','j.doe@postgresqltutorial.com');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, insert another row with a duplicate email.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO person(first_name,last_name,email)
VALUES('jack','doe','j.doe@postgresqltutorial.com');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issued an error message.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
[Err] ERROR:  duplicate key value violates unique constraint "person_email_key"
DETAIL:  Key (email)=(j.doe@postgresqltutorial.com) already exists.
```

<!-- /wp:code -->

<!-- wp:heading -->

## Creating a UNIQUE constraint on multiple columns

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL allows you to create a `UNIQUE` constraint to a group of columns using the following syntax:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE table (
    c1 data_type,
    c2 data_type,
    c3 data_type,
    UNIQUE (c2, c3)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The combination of values in the columns c2 and c3 will be unique across the whole table. The value of the column c2 or c3 needs not to be unique.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Adding unique constraints using a unique index

<!-- /wp:heading -->

<!-- wp:paragraph -->

Sometimes, you may want to add a unique constraint to an existing column or group of columns. Let's take a look at the following example.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, suppose you have a table named `equipment`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  equip_id VARCHAR (16) NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a unique index based on the `equip_id` column.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE UNIQUE INDEX CONCURRENTLY equipment_equip_id
ON equipment (equip_id);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, add a unique constraint to the `equipment` table using the `equipment_equip_id` index.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE equipment
ADD CONSTRAINT unique_equip_id
UNIQUE USING INDEX equipment_equip_id;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that the `ALTER TABLE` statement acquires an exclusive lock on the table. If you have any pending transactions, it will wait for all transactions to complete before changing the table. Therefore, you should check the pg_stat_activity table to see the current pending transactions that are ongoing using the following query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  datid,
  datname,
  usename,
  state
FROM
  pg_stat_activity;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You should look at the result to find the `state` column with the value `idle in transaction`. Those are the transactions that are pending to complete.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `UNIQUE` constraints to enforce values stored in a column or a group of columns unique across rows within the same table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
