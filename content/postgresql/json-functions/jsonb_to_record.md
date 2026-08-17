---
title: PostgreSQL jsonb_to_record() Function
page_title: PostgreSQL jsonb_to_record() Function
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL jsonb_to_record()
  function to convert a JSON object into a PostgreSQL record type.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_to_record/
ogImage: ''
updatedOn: '2026-06-03T13:01:21.685Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL jsonb_object_keys() Function
  slug: postgresql-json-functions/postgresql-jsonb_object_keys
nextLink:
  title: PostgreSQL jsonb_populate_record() Function
  slug: postgresql-json-functions/postgresql-jsonb_populate_record
---

<Admonition type="info" id="CTA">
The jsonb_to_record() function is part of standard PostgreSQL. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_to_record()` function to convert a JSON object into a PostgreSQL record type.

## Introduction to the PostgreSQL JSONB jsonb_to_record() function

The `jsonb_to_record()` function allows you to convert a [JSON](../postgresql-tutorial/postgresql-json) object into a PostgreSQL record type.

Here’s the basic syntax of the `jsonb_to_record()` function:

```sql
jsonb_to_record(json_object)
  as record_type (column1 type, column2 type,...)
```

In this syntax:

- First, specify a JSON object (`json_object`) of type JSONB that you want to convert into a record type.
- Second, define the `record_type` with a list of columns that have the same names as the keys in the JSON object. The record may have fewer columns than the number of keys in the JSON object. If the names of the columns of the `record_type` are not the same as the names of the keys in the JSON object, they will be ignored.

The function `jsonb_to_record()` returns a record type representing the structure of a JSON object.

If the `json_object` is null, the `jsonb_to_record()` function returns null.

## PostgreSQL jsonb_to_record() function examples

Let’s take some examples of using the `jsonb_to_record()` function.

### 1\) Basic PostgreSQL jsonb_to_record() function examples

The following example uses the `jsonb_to_record()` function to convert a JSON object into a record:

```sql
SELECT
  *
FROM
  jsonb_to_record(
    '{"id": 1, "name": "Alice", "age": 30}'
  ) AS person (id INT, name TEXT, age INT);
```

Output:

```text
 id | name  | age
----+-------+-----
  1 | Alice |  30
(1 row)
```

The following example converts a JSON object into a record type but with fewer keys:

```sql
SELECT
  *
FROM
  jsonb_to_record(
    '{"id": 1, "name": "Alice", "age": 30}'
  ) AS person (id INT, name TEXT);
```

Output:

```text
 id | name
----+-------
  1 | Alice
(1 row)
```

### 2\) Using jsonb_to_record() function with user\-defined type

First, create a new custom type called `pet` with two fields `type` and `name`:

```sql
CREATE TYPE pet AS (type VARCHAR, name VARCHAR);
```

Second, use the pet type with the `jsonb_to_record()` function:

```sql
SELECT
  *
FROM
  jsonb_to_record(
    '{"id": 1, "name": "Alice", "age": 30, "pets": [{"type":"cat", "name": "Ellie"}, {"type":"dog", "name": "Birdie"}]}'
  ) AS person (id INT, name TEXT, pets pet[]);
```

Output:

```text
 id | name  |              pets
----+-------+--------------------------------
  1 | Alice | {"(cat,Ellie)","(dog,Birdie)"}
(1 row)
```

## Summary

- Use the `jsonb_to_record()` function to convert a JSON object into a PostgreSQL record type.
