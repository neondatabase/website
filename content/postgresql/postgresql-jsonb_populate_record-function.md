---
modifiedAt: 2024-02-25 20:13:15
prevPost: postgresql-grouping-sets
nextPost: postgresql-show-databases
createdAt: 2024-02-26T01:39:59.000Z
title: 'PostgreSQL jsonb_populate_record() Function'
redirectFrom:
            - /postgresql/postgresql-jsonb_populate_record 
            - /postgresql/postgresql-json-functions/postgresql-jsonb_populate_record
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_populate_record()` function to populate the fields of a record type from a JSON object.

## Introduction to the PostgreSQL jsonb_populate_record() function

The `jsonb_populate_record()` function expands the top-level JSON object of type JSONB to a row of a specified composite type.

In other words, the `jsonb_populate_record()` function converts a JSON object into a row of a specified composite type.

Here's the basic syntax of the `jsonb_populate_record()` function:

```
jsonb_populate_record (
   target anyelement,
   json_object jsonb
) → anyelement
```

In this syntax:

- `target` is a composite type to which you want to expand the JSONB value.
- `json_object` is a JSON object of the JSONB type that you want to expand.

The `jsonb_populate_record()` function returns a record of the specified type with its fields populated using the key-value pairs from the JSON object.

## PostgreSQL jsonb_populate_record() function examples

Let's explore some examples of using the `jsonb_populate_record()` function.

### 1) Basic jsonb_populate_record() function example

First, [create a new type](/postgresql/postgresql-user-defined-data-types) called `person`:

```sql
CREATE TYPE person AS (
  id INT,
  name VARCHAR,
  age INT
);
```

Second, use the `jsonb_populate_record()` function to expand the JSON object to a row of the `person` type:

```sql
SELECT
  jsonb_populate_record(
    null :: person,
   '{"id": 1, "name": "John", "age": 22}' :: jsonb
  );
```

Output:

```
 jsonb_populate_record
-----------------------
 (1,John,22)
(1 row)
```

### 2) Using the jsonb_populate_record() function with table data

First, [create a new table](/postgresql/postgresql-create-table) called `employees`:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    salary NUMERIC NOT NULL
);
```

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `employees` table:

```sql
INSERT INTO employees (name, age, salary)
VALUES
  ('John Doe', 25, 70000),
  ('Jane Smith', 22, 80000);
```

Third, use `jsonb_populate_record()` to query the data from the `employees` table in a structured format:

```sql
SELECT
  jsonb_populate_record(
    null :: employees,
    jsonb_build_object(
      'id', id, 'name', name, 'age', age, 'salary',
      salary
    )
  ) AS employees
FROM
  employees;
```

Output:

```
         employees
---------------------------
 (1,"John Doe",25,70000)
 (2,"Jane Smith",22,80000)
(2 rows)
```

## Summary

- Use the `jsonb_populate_record()` function to populate the fields of a record type or a custom composite type from a JSON object.
