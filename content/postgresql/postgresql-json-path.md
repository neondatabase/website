---
title: 'PostgreSQL JSON Path'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-path/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL JSON path and how to use it to locate an element within a JSON document.



## Introduction to PostgreSQL JSON Path



JSON path is a query language that allows you to locate specific values or elements within a JSON document.



JSON path offers a way to match elements within JSON data, similar to how `XPATH` is used for XML documents.



To construct JSON path expressions, you can use the combination of the following operators:



- - `$` - Represent the root element to query.
- -
- - `.key` - Use a dot (.) followed by a key name (`.key`) to access a field of a JSON object or (`.*`) to access all properties of a JSON object.
- -
- - `[n]` - Use square brackets (`[]`) to access an array element by its index (n), or \[\*] to access all array elements.
- -
- - `@` - Represent the current node being processed by a filter predicate.
- -
- - `[start: end]` - Array slice operator.
- -
- - `[?(expression)]` - Filter expression that evaluates to a boolean value.
- 


To extract specific elements from a JSON path `jsonb_path_query()` function:



```
jsonb_path_query(jsonb_data, json_path)
```



The function returns all JSON items for the `jsonb_data` based on a JSON path.



## PostgreSQL JSON Path examples



Let's take some examples of using JSON paths.



### Setting up a sample table



First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `person` that includes a `JSONB` column:



```
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    info JSONB
);
```



Second, [insert a new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `person` table:



```
INSERT INTO person (info)
VALUES
    ('{"name": "John", "age": 30, "city": "New York", "pets": [{"name": "Max", "species": "Dog"}, {"name": "Whiskers", "species": "Cat"}]}')
RETURNING *;
```



Output:



```
 id |                                                                 info
----+--------------------------------------------------------------------------------------------------------------------------------------
  1 | {"age": 30, "city": "New York", "name": "John", "pets": [{"name": "Max", "species": "Dog"}, {"name": "Whiskers", "species": "Cat"}]}
(1 row)
```



The JSON data in the `info` column of the `person` table looks like the following:



```
{
  "name": "John",
  "age": 30,
  "city": "New York",
  "pets": [
    {"name": "Max", "species": "Dog"},
    {"name": "Whiskers", "species": "Cat"}
  ]
}
```



### 1) Extracting the name of the person



The following statement uses the `jsonb_path_query()` to extract the name of the person:



```
SELECT
  jsonb_path_query(info, '$.name')
FROM
  person;
```



Output:



```
 jsonb_path_query
------------------
 "John"
(1 row)
```



In this example, we use the `$.name` path to access the value of the `name` property of the top-level JSON object.



### 2) Extracting all values of a JSON object



The following example uses the `jsonb_path_query()` function to retrieve all values of the JSON object in the `info` column:



```
SELECT
  jsonb_path_query(info, '$.*')
FROM
  person;
```



Output:



```
                              jsonb_path_query
-----------------------------------------------------------------------------
 30
 "New York"
 "John"
 [{"name": "Max", "species": "Dog"}, {"name": "Whiskers", "species": "Cat"}]
(4 rows)
```



In this example, the `$.*` path locates the values of all properties of the top-level JSON object. Therefore, the `jsonb_path_query` returns the values of all properties of the JSON object.



### 3) Extracting array elements



The following example uses the `jsonb_path_query()` function to get the name of the first pet:



```
SELECT
  jsonb_path_query(info, '$.pets[0].name')
FROM
  person;
```



Output:



```
 jsonb_path_query
------------------
 "Max"
(1 row)
```



In this example, we use the JSON path `$.pets[0].name` to locate the name of the first pet:



- - `$`: represents the top-level JSON object.
- -
- - `$.pets` locates the values of the property with the name `pets`, which is a JSON array.
- -
- - `$.pets[0]` returns the first element of the `$.pets` array, which is a JSON object.
- -
- - `$.pets[0].name` returns the value of the property `name` of the `$.pets[0]` object.
- 


The following example uses the JSON path `$.pets[*].name` to return all pet names of a person object:



```
SELECT
  jsonb_path_query(info, '$.pets[*].name')
FROM
  person;
```



Output:



```
 jsonb_path_query
------------------
 "Max"
 "Whiskers"
(2 rows)
```



The wildcard `*` means all elements.



### 4) Filter JSON



The following example uses a filter expression to find the pet whose species is cat:



```
SELECT
  jsonb_path_query(
    info, '$.pets[*] ? (@.species == "Cat")'
  ) AS cat
FROM
  person;
```



Output:



```
                  cat
----------------------------------------
 {"name": "Whiskers", "species": "Cat"}
```



Here's the break-down of the JSON path expression `$.pets[*] ? (@.species == "Cat")`:



- - `$.pets[*]`: selects all elements (`*`) within the "pets" array. The `$.` denotes the root of the JSON document and `pets[*]` represents all array elements of the `pets` array.
- -
- - `? (@.species == "Cat")`: filters the selected elements from the `pets` array. The `?` is used to apply the filter condition `(@.species == "Cat")`, which checks if the value of the `species` key in each selected element is equal to `Cat`.
- 


In short, the JSON path `$.pets[*] ? (@.species == "Cat")` matches all objects within the `pets` array where the value of the `species` key is `Cat`.



## JSON path mode



PostgreSQL allows you to optionally specify a path mode at the beginning of the JSON path expression:



```
'mode json_path'
```



The mode can be `lax` or `strict`:



- - In `lax` mode, the function returns an empty value (result set) if the JSON path expression has an error. For example, if you use the `$.email` path for the JSON document that doesn't contain the `email` key, the function returns an empty result set.
- -
- - In `strict` mode, the function issues an error if the path expression contains an error.
- 


The default is `lax` mode.



The following statement attempts to extract the `email` from the JSON data in the `info` column of the `person` table:



```
SELECT
  jsonb_path_query(info, '$.email')
FROM
  person;
```



Output:



```
 jsonb_path_query
------------------
(0 rows)
```



It returns no row because the JSON object does not have the `email` key.



The following statement extracts the `email` key but uses the `strict` mode for the JSON path:



```
SELECT
  jsonb_path_query(info, 'strict $.email')
FROM
  person;
```



Output:



```
ERROR:  JSON object does not contain key "email"

SQL state: 2203A
```



The output shows that the function raises an error.



## Summary



- - Use JSON paths to locate specific values or elements within a JSON document.
- -
- - Use the `jsonb_path_query()` function to return all items within a JSON document that match a specified JSON path.
- 
