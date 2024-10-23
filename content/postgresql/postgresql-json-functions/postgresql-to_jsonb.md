---
title: "PostgreSQL to_jsonb() Function"
page_title: "PostgreSQL to_jsonb() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL to_jsonb() function to convert an SQL value to a value of JSONB type."
prev_url: "https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-to_jsonb/"
ogImage: ""
updatedOn: "2024-02-25T02:38:36+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL JSON Functions"
  slug: "postgresql-json-functions/"
nextLink: 
  title: "PostgreSQL jsonb_build_array() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_build_array"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `to_jsonb()` function to convert an SQL value to a value of `JSONB` type.


## Introduction to the PostgreSQL to\_jsonb() function

The `to_jsonb()` function allows you to convert an SQL value to a `JSONB` value.

Here’s the syntax of the `to_jsonb()` function:


```sqlsql
to_jsonb ( value ) → jsonb
```
In this syntax, you specify an SQL value that you want to convert to a `JSONB` value.

The `to_jsonb()` function returns a value converted to a `JSONB` value. If the value is an array or a composite value, the function will convert to arrays or objects in JSON.


## PostgreSQL to\_jsonb() function examples

Let’s explore some examples of using the `to_jsonb()` function.


### 1\) Converting a text string to a JSONB value

The following example uses the `to_jsonb()` function to convert a text string into a `JSONB` value:


```sql
SELECT to_jsonb('Hello'::text);
```
Output:


```sql
 to_jsonb
----------
 "Hello"
(1 row)
```
The “Hello” is a `JSONB` value.

To verify it, you can pass the result of the `to_jsonb()` function to the `jsonb_typeof()` function.

The `jsonb_typeof()` function returns the type of a top\-level JSON value as a text string.

For example:


```sql
SELECT 
  JSONB_TYPEOF(
    to_jsonb('Hello' :: text)
  );
```
Output:


```sql
 jsonb_typeof
--------------
 string
(1 row)
```

### 2\) Converting numbers to a JSONB values

The following example uses the `to_jsonb()` function to convert numbers to `JSONB` values:


```sql
SELECT 
  to_jsonb(10 :: int), 
  to_jsonb(9.99 :: numeric);
```
Output:


```sql
 to_jsonb | to_jsonb
----------+----------
 10       | 9.99
(1 row)
```

### 3\) Converting bool values to a JSONB values

The following example uses the `to_jsonb()` function to convert boolean values to `JSONB` values:


```sql
SELECT 
  to_jsonb(true :: bool), 
  to_jsonb(false :: bool);
```
Output:


```sql
 to_jsonb | to_jsonb
----------+----------
 true     | false
(1 row)
```

### 4\) Converting NULL to a JSONB value

The following example uses the `to_jsonb()` function to convert `NULL` to a `JSONB` value:


```sql
SELECT 
  to_jsonb(NULL::text);
```
Output:


```sql
 to_jsonb
----------
 null
(1 row)
```

### 5\) Converting a PostgreSQL array into a JSON array

The following example uses the `to_jsonb()` function to convert an array in PostgreSQL to a JSON array with the `JSONB` type:


```sql
SELECT 
  to_jsonb(
    ARRAY[ 'red', 'green', 'blue' ]
  ) AS jsonb_array;
```
Output:


```sql
       jsonb_array
--------------------------
 ["red", "green", "blue"]
(1 row)
```

### 6\) Using the to\_jsonb() function with table data

We’ll use the `to_jsonb()` function to convert data in the `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) to `JSONB` values:


```
SELECT 
  to_jsonb(title), 
  to_jsonb(length) 
FROM 
  film 
ORDER BY 
  title;
```
Output:


```
           to_jsonb            | to_jsonb
-------------------------------+----------
 "Academy Dinosaur"            | 86
 "Ace Goldfinger"              | 48
 "Adaptation Holes"            | 50
...
```

## Summary

* Use the PostgreSQL `to_jsonb()` function to convert an SQL value to a `JSONB` value.

