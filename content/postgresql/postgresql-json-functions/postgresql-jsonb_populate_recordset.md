---
title: 'PostgreSQL jsonb_populate_recordset() Function'
page_title: 'PostgreSQL jsonb_populate_recordset() Function'
page_description: 'How to se the PostgreSQL jsonb_popuplate_recordset() function to populate the fields of a record type from a JSON object.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_populate_recordset/'
ogImage: ''
updatedOn: '2024-02-26T04:22:02+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL jsonb_populate_record() Function'
  slug: 'postgresql-json-functions/postgresql-jsonb_populate_record'
nextLink:
  title: 'PostgreSQL PHP'
  slug: 'postgresql-json-functions/../postgresql-php'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_popuplate_recordset()` function to populate the fields of a record type from a JSON array of objects.

## Introduction to the PostgreSQL jsonb_popuplate_recordset() function

The `jsonb_populate_recordset()` function allows you to populate the fields of a record type from a JSON array of objects.

In other words, the `jsonb_popuplate_recordset()` function converts a JSON array of objects with the JSONB type into a set of records of a specified type.

Here’s the syntax of the `jsonb_populate_recordset()` function:

```sql
jsonb_populate_recordset(
   target anyelement,
   json_array jsonb
) RETURNS SETOF anyelement
```

In this syntax:

- `target` represents the target record type to which the JSONB data will be mapped.
- `json_object` is a JSON array of objects from which the records will be populated. The jsonb_array has the type of JSONB.

The `jsonb_populate_recordset()` function returns a set of records of a specified type, with each record’s fields populated using the corresponding key\-value pairs from the JSONB objects in the array.

## PostgreSQL jsonb_popuplate_recordset() function examples

Let’s explore some examples of using the `jsonb_populate_recordset()` function.

### 1\) Basic jsonb_populate_recordset() function example

First, [create a new type](../postgresql-tutorial/postgresql-user-defined-data-types) called `address`:

```sql
CREATE TYPE address_type AS (
    street VARCHAR(100),
    city VARCHAR(50),
    zipcode VARCHAR(5)
);
```

Second, use the `jsonb_populate_recordset()` function to populate the address custom type from a JSON array of objects:

```sql
SELECT
  *
FROM
  jsonb_populate_recordset(
    null :: address_type, '[{"street": "123 Main St", "city": "New York", "zipcode": "10001"}, {"street": "456 Elm St", "city": "Los Angeles", "zipcode": "90001"}]' :: jsonb
  ) AS address;
```

Output:

```text
   street    |    city     | zipcode
-------------+-------------+---------
 123 Main St | New York    | 10001
 456 Elm St  | Los Angeles | 90001
(2 rows)
```

### 2\) Using the jsonb_populate_recordset() function with table data

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `employees`:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    salary NUMERIC NOT NULL
);
```

Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `employees` table:

```sql
INSERT INTO employees (name, age, salary)
VALUES
  ('John Doe', 25, 70000),
  ('Jane Smith', 22, 80000);
```

Third, use `jsonb_populate_recordset()` to query the data from the `employees` table in a structured format:

```sql
SELECT
  jsonb_populate_recordset(
    null :: employees,
    json_agg(jsonb_build_object(
      'id', id, 'name', name, 'age', age, 'salary',
      salary
    ))
  ) AS employees
FROM
  employees;
```

Output:

```text
         employees
---------------------------
 (1,"John Doe",25,70000)
 (2,"Jane Smith",22,80000)
(2 rows)
```

## Summary

- Use the `jsonb_popuplate_recordset()` function to populate the fields of a record type or a custom composite type from a JSON object.
