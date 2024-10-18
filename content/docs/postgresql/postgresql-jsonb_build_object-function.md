---
title: 'PostgreSQL jsonb_build_object() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_build_object/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_build_object()` function to create a JSON object based on a variadic argument list.



## Introduction to the PostgreSQL jsonb_build_object() function



The `jsonb_build_object()` function allows you to build an object out of a variadic argument list.



Here's the basic syntax of the `jsonb_build_object()` function:



```
jsonb_build_object ( VARIADIC "any" ) → jsonb
```



In this syntax, you pass a list of alternative keys and values. The list must have an even number of elements or you'll get an error.



The function will coerce the key to text and value to a JSON value using the `to_jsonb()` function.



The `jsonb_build_object()` function returns a JSON object with the specified key and values.



## PostgreSQL jsonb_build_object() function examples



Let's explore some examples of using the PostgreSQL `jsonb_build_object()` function.



### 1) Basic jsonb_build_object() function example



The following example uses the `jsonb_build_object()` function to build an object out of the alternating keys and values:



```
SELECT
  jsonb_build_object(
    'title', 'Academy Dinosaur', 'length',
    86
  );
```



Output:



```
             jsonb_build_object
---------------------------------------------
 {"title": "Academy Dinosaur", "length": 86}
(1 row)
```



### 2) Using jonb_build_object() function with table data example



The following example uses the `jsonb_build_object()` function to create a JSON object based on the title and length of films in the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):



```
SELECT
  jsonb_build_object('title', title, 'length', length)
FROM
  film
ORDER BY
  length DESC;
```



Output:



```
                   jsonb_build_object
---------------------------------------------------------
 {"title": "Muscle Bright", "length": 185}
 {"title": "Control Anthem", "length": 185}
 {"title": "Sweet Brotherhood", "length": 185}
...
```



### 3) Using the jonb_build_object() function with an odd number of values



The following example attempts to use the `jsonb_build_object()` function with an odd number of values:



```
SELECT
  jsonb_build_object(
    'title', 'Theory Mermaid', 'length'
  );
```



It returns the following error:



```
ERROR:  argument list must have even number of elements
HINT:  The arguments of jsonb_build_object() must consist of alternating keys and values.
```



## Summary



- Use the PostgreSQL `jsonb_build_object()` function to build a JSON object out of a variadic argument list.
- 
