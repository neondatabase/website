---
title: "PostgreSQL jsonb_typeof() Function"
page_title: "PostgreSQL jsonb_typeof() Function"
page_description: ""
prev_url: "https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_typeof/"
ogImage: ""
updatedOn: "2024-02-24T11:07:59+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL jsonb_object_agg() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_object_agg"
nextLink: 
  title: "PostgreSQL jsonb_pretty() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_pretty"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_typeof()` function to return the type of the top\-level JSON value as a text string.


## Introduction to the PostgreSQL jsonb\_typeof() function

The `jsonb_typeof()` function allows you to get the type of a top\-level JSONB value as a text string.

Here’s the syntax of the `jsonb_typeof()` function:


```sql
jsonb_typeof(jsonb_value)
```
In this syntax:

* `jsonb_value` is a JSONB value of which you want to get the type as a text string.

The `jsonb_typeof()` function returns a text string representing the type of the input JSONB value. The possible return values are object, array, string, number, and null.


## PostgreSQL jsonb\_typeof() function examples

Let’s take some examples of using the `jsonb_typeof()` function.

The following example uses the `jsonb_typeof()` function to return the type of a JSON object:


```sql
SELECT jsonb_typeof('{}');
```
Output:


```sql
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


```sql
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


```sql
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


```sql
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


```sql
 jsonb_typeof
--------------
 string
(1 row)
```

## Summary

* Use the `jsonb_typeof()` function to return the type of the top\-level JSON value as a text string.

