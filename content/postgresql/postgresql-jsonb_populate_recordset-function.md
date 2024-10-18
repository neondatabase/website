---
title: 'PostgreSQL jsonb_populate_recordset() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_populate_recordset/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_popuplate_recordset()` function to populate the fields of a record type from a JSON array of objects.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_popuplate_recordset() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_populate_recordset()` function allows you to populate the fields of a record type from a JSON array of objects.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In other words, the `jsonb_popuplate_recordset()` function converts a JSON array of objects with the JSONB type into a set of records of a specified type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `jsonb_populate_recordset()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_populate_recordset(
   target anyelement,
   json_array jsonb
) RETURNS SETOF anyelement
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `target` represents the target record type to which the JSONB data will be mapped.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `json_object` is a JSON array of objects from which the records will be populated. The jsonb_array has the type of JSONB.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `jsonb_populate_recordset()` function returns a set of records of a specified type, with each record's fields populated using the corresponding key-value pairs from the JSONB objects in the array.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_popuplate_recordset() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `jsonb_populate_recordset()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic jsonb_populate_recordset() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-user-defined-data-types/) called `address`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TYPE address_type AS (
    street VARCHAR(100),
    city VARCHAR(50),
    zipcode VARCHAR(5)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, use the `jsonb_populate_recordset()` function to populate the address custom type from a JSON array of objects:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  *
FROM
  jsonb_populate_recordset(
    null :: address_type, '[{"street": "123 Main St", "city": "New York", "zipcode": "10001"}, {"street": "456 Elm St", "city": "Los Angeles", "zipcode": "90001"}]' :: jsonb
  ) AS address;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
   street    |    city     | zipcode
-------------+-------------+---------
 123 Main St | New York    | 10001
 456 Elm St  | Los Angeles | 90001
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the jsonb_populate_recordset() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `employees`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    salary NUMERIC NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO employees (name, age, salary)
VALUES
  ('John Doe', 25, 70000),
  ('Jane Smith', 22, 80000);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, use `jsonb_populate_recordset()` to query the data from the `employees` table in a structured format:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
         employees
---------------------------
 (1,"John Doe",25,70000)
 (2,"Jane Smith",22,80000)
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_popuplate_recordset()` function to populate the fields of a record type or a custom composite type from a JSON object.
- <!-- /wp:list-item -->

<!-- /wp:list -->
