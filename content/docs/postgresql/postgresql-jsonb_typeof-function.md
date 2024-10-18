---
title: 'PostgreSQL jsonb_typeof() Function'
redirectFrom:
            - /docs/postgresql/postgresql-jsonb_typeof 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_typeof/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_typeof()` function to return the type of the top-level JSON value as a text string.

## Introduction to the PostgreSQL jsonb_typeof() function

The `jsonb_typeof()` function allows you to get the type of a top-level JSONB value as a text string.

Here's the syntax of the `jsonb_typeof()` function:

```
jsonb_typeof(jsonb_value)
```

In this syntax:

- `jsonb_value` is a JSONB value of which you want to get the type as a text string.

The `jsonb_typeof()` function returns a text string representing the type of the input JSONB value. The possible return values are object, array, string, number, and null.

## PostgreSQL jsonb_typeof() function examples

Let's take some examples of using the `jsonb_typeof()` function.

The following example uses the `jsonb_typeof()` function to return the type of a JSON object:

```
SELECT jsonb_typeof('{}');
```

Output:

```
 jsonb_typeof
--------------
 object
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of a JSON array:

```
select jsonb_typeof('[]');
```

Output:

```
 jsonb_typeof
--------------
 array
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of a number:

```
SELECT jsonb_typeof('1'::jsonb);
```

Output:

```
 jsonb_typeof
--------------
 number
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of null:

```
SELECT jsonb_typeof('null'::jsonb);
```

Output:

```
 jsonb_typeof
--------------
 null
(1 row)
```

The following example uses the `jsonb_typeof()` function to return the type of string:

```
SELECT
  jsonb_typeof(
    jsonb_path_query('{"name": "Alice"}', '$.name')
  );
```

Output:

```
 jsonb_typeof
--------------
 string
(1 row)
```

## Summary

- Use the `jsonb_typeof()` function to return the type of the top-level JSON value as a text string.
