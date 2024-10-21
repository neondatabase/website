---
modifiedAt: 2024-03-28 19:17:22
prevPost: postgresql-jsonb_extract_path-function
nextPost: postgresql-like
createdAt: 2024-03-29T01:58:26.000Z
title: 'PostgreSQL BEFORE TRUNCATE Trigger'
redirectFrom: 
            - /postgresql/postgresql-triggers/postgresql-before-truncate-trigger
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to define a PostgreSQL `BEFORE TRUNCATE` trigger that fires before a `TRUNCATE` event occurs on a table.

## Introduction to the PostgreSQL BEFORE TRUNCATE trigger

A `TRUNCATE TABLE` statement removes all from a table without creating any logs, making it faster than a `DELETE` operation.

PostgreSQL allows you to [create a trigger](/postgresql/postgresql-triggers/creating-first-trigger-postgresql) that fires before a `TRUNCATE` event occurs.

A `BEFORE TRUNCATE` trigger is a statement-level trigger because the `TRUNCATE` statement deletes all the rows from the table, not individual rows.

Although the `TRUNCATE` operation deletes rows from a table, it does not activate the `DELETE` trigger including `BEFORE` and `AFTER DELETE` triggers.

Here's the step for creating a `BEFORE TRUNCATE` trigger:

First, [define a user-defined function](/postgresql/postgresql-plpgsql/postgresql-create-function) that will execute before the `TRUNCATE` event:

```sql
CREATE OR REPLACE FUNCTION trigger_function_name()
RETURNS TRIGGER AS
$$
BEGIN
    -- This logic will be executed before the TRUNCATE operation
    -- ...
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;
```

The function returns `NULL` indicating that the trigger doesn't return additional output.

Second, create a `BEFORE TRUNCATE` trigger and associate the function with it:

```sql
CREATE TRIGGER trigger_name
BEFORE TRUNCATE ON table_name
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_function_name();
```

Since the `BEFORE TRUNCATE` trigger is a statement-level trigger, you need to specify the `FOR EACH STATEMENT` clause in the `CREATE TRIGGER` statement.

Unlike `INSERT`, `UPDATE`, or `DELETE`, which support `BEFORE` and `AFTER` trigger types, `TRUNCATE` only supports `BEFORE` triggers.

## PostgreSQL BEFORE TRUNCATE trigger example

We'll create a `BEFORE TRUNCATE` trigger to prevent applications from truncating a table.

First, [create a new table](/postgresql/postgresql-create-table) called `companies` to store company data:

```sql
CREATE TABLE companies(
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL
);
```

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `companies` table:

```sql
INSERT INTO companies(name)
VALUES ('Apple'),
       ('Microsoft'),
       ('Google')
RETURNING *;
```

Output:

```
 id |   name
----+-----------
  1 | Apple
  2 | Microsoft
  3 | Google
(3 rows)
```

Third, define a function that will execute when a `TRUNCATE` event occurs:

```sql
CREATE OR REPLACE FUNCTION before_truncate_companies()
RETURNS TRIGGER AS
$$
BEGIN
    RAISE NOTICE 'Truncating the companies table is not allowed';
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;
```

Fourth, create a trigger that fires before a `TRUNCATE` event occurs:

```sql
CREATE TRIGGER before_truncate_companies_trigger
BEFORE TRUNCATE ON companies
FOR EACH STATEMENT
EXECUTE FUNCTION before_truncate_companies();
```

Fifth, attempt to truncate the `companies` table:

```sql
TRUNCATE TABLE companies;
```

Output:

```sql
NOTICE:  Truncating the companies table is not allowed
TRUNCATE TABLE
```

The output indicates that the `BEFORE TRUNCATE` trigger fires, raising an exception that aborts the `TRUNCATE` operation.

## Summary

- A `BEFORE TRUNCATE` trigger is a statement-level trigger.
- Create a `BEFORE TRUNCATE` trigger to fire before a `TRUNCATE` event.
