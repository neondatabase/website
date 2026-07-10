---
title: PostgreSQL jsonb_typeof() Function
page_title: PostgreSQL jsonb_typeof() Function
page_description: ''
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_typeof/
ogImage: ''
updatedOn: '2026-06-03T13:01:21.685Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL jsonb_populate_recordset() Function
  slug: postgresql-json-functions/postgresql-jsonb_populate_recordset
nextLink:
  title: PostgreSQL jsonb_pretty() Function
  slug: postgresql-json-functions/postgresql-jsonb_pretty
---

<Admonition type="info" id="CTA">
The `jsonb_typeof()` function works the same way on any PostgreSQL deployment, so what you learn here applies wherever you run Postgres. If you're an enterprise building on the Lakehouse, [Lakebase](https://www.databricks.com/product/lakebase) delivers managed Postgres for the AI era with the performance, security, and integration your data platform demands. [Neon](https://neon.com) is the AI-native backend platform for apps and agents: Postgres Database, Auth, Storage, Functions and AI Gateway.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_typeof()` function to return the type of the top\-level JSON value as a text string.

## Introduction to the PostgreSQL jsonb_typeof() function

The `jsonb_typeof()` function allows you to get the type of a top\-level JSONB value as a text string.

Here’s the syntax of the `jsonb_typeof()` function:

```sql
jsonb_typeof(jsonb_value)
```

In this syntax:

- `jsonb_value` is a JSONB value of which you want to get the type as a text string.

The `jsonb_typeof()` function returns a text string representing the type of the input JSONB value. The possible return values are object, array, string, number, and null.

## PostgreSQL jsonb_typeof() function examples

Let’s take some examples of using the `jsonb_typeof()` function.

The following example uses the `jsonb_typeof()` function to return the type of a JSON object:

```sql
SELECT jsonb_typeof('{}');
```

Output:

```text
 jsonb_typeof
--------------
 object
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of a JSON array:

```sql
select jsonb_typeof('[]');
```

Output:

```text
 jsonb_typeof
--------------
 array
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of a number:

```sql
SELECT jsonb_typeof('1'::jsonb);
```

Output:

```text
 jsonb_typeof
--------------
 number
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of null:

```sql
SELECT jsonb_typeof('null'::jsonb);
```

Output:

```text
 jsonb_typeof
--------------
 null
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of string:

```sql
SELECT
  jsonb_typeof(
    jsonb_path_query('{"name": "Alice"}', '$.name')
  );
```

Output:

```text
 jsonb_typeof
--------------
 string
(1 row)
```

## Summary

- Use the `jsonb_typeof()` function to return the type of the top\-level JSON value as a text string.
