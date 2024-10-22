---
title: "PostgreSQL jsonb_insert() Function"
page_title: "PostgreSQL jsonb_insert() Function"
page_description: "How to use the PostgreSQL jsonb_insert() function to insert a new element into a JSON array or a key/value pair into a JSON object."
prev_url: "https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_insert/"
ogImage: ""
updatedOn: "2024-02-25T01:22:46+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL JSON Extract"
  slug: "postgresql-json-functions/postgresql-json-extract"
nextLink: 
  title: "PostgreSQL jsonb_set() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_set"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_insert()` function to insert a new element into a JSON array or a key/value pair into a JSON object.


## Introduction to the PostgreSQL jsonb\_insert() function

The `jsonb_insert()` function allows you to insert new values into a [JSON](../postgresql-tutorial/postgresql-json) document of the JSONB type.

More specifically, the `jsonb_insert()` function allows you to add a new element into an array or a new key/value pair into an object, or nested combinations of them.

Here’s the syntax of the `jsonb_insert()` function:


```phpsqlsql
jsonb_insert(
   target jsonb, 
   path text[], 
   new_value jsonb, 
   [insert_after boolean]
) → jsonb
```
In this syntax:

* `target`: The JSON document of the JSONB type into which you want to insert a new value.
* `path`: This is an array of text elements that specifies the path where you want to insert the new value.
* `new_value` is the new value that you want to insert into the JSON document.
* `insert_after`: This is an optional boolean parameter indicating whether you want to insert the new value after the specified path instead of before. It defaults to `false`, meaning that the function will insert a new value before the specified path.

The `jsonb_insert()` function returns a new JSON document with the `new_value` inserted before/after the specified `path`.


## PostgreSQL jsonb\_insert() function examples

Let’s take some examples of using the PostgreSQL `jsonb_insert()` function


### 1\) Inserting a new element into a JSON array

The following example uses the `jsonb_insert()` function to insert a new element into a JSON array:


```sql
 SELECT jsonb_insert('[1,2,3]', '{0}', '0');
```
Output:


```sql
 jsonb_insert
--------------
 [0, 1, 2, 3]
(1 row)
```
In this example:

* The original array is `[1,2,3]`.
* The path `\{0\}` indicates the first element of the array.
* The number 0 is the new value.

The `jsonb_insert()` function inserts the number 0 before the first element of the array.

To insert the number 0 after the first position, you set the `insert_after` parameter to true as follows:


```sql
SELECT jsonb_insert('[1,2,3]', '{0}', '0', true);
```
Output:


```sql
 jsonb_insert
--------------
 [1, 0, 2, 3]
(1 row)
```

### 2\) Inserting a new element into a nested JSON array

The following example uses the `jsonb_insert()` function to insert a new element into a nested array:


```sql
SELECT 
  jsonb_insert(
    '[1,2,[4,5],6]', '{2,0}', '3'
  );
```
Output:


```sql
     jsonb_insert
----------------------
 [1, 2, [3, 4, 5], 6]
(1 row)
```
In this example:

* The original array is `\[1,2,\[3,4],6]`.
* The path `\{2, 0\}`, `2` specifies the second element of the array which is the nested array `\[3,4]`, and `0` specifies the first element of the nested array.
* `3` is the new value.

Therefore the `jsonb_insert()` function inserts the new value 3 before the first element of the nested array.


### 3\) Inserting a new element into a JSON object

The following example uses the `jsonb_insert()` to add a new key/value pair to a JSON object:


```sql
SELECT 
  jsonb_insert('{"name": "John"}', '{age}', '2');
```
Output:


```sql
        jsonb_insert
----------------------------
 {"age": 2, "name": "John"}
(1 row)
```
In this example:

* `\{“name”: “John”\}` is the original object.
* `\{age\}` is the path that indicates the age property (or key).
* `2` is the new value to insert.

Therefore, the `jsonb_insert()` inserts the age property with value 2 into the JSON object.

Note that if you attempt to insert a key that already exists, you’ll get an error. For example:


```sql
SELECT jsonb_insert('{"name": "John"}', '{name}', '"Jane"');
```
Output:


```
ERROR:  cannot replace existing key
HINT:  Try using the function jsonb_set to replace key value.
```
In this case, you need to use the `jsonb_set()` function to replace the key value.


### 4\) Inserting a new element into a nested JSON object

The following example uses the `jsonb_insert()` to add a new key/value pair to a nested JSON object:


```
SELECT 
  jsonb_insert(
    '{"name":"John Doe", "address" : { "city": "San Francisco"}}', 
    '{address,state}', 
    '"California"'
  );
```
Output:


```sql
                                   jsonb_insert
-----------------------------------------------------------------------------------
 {"name": "John Doe", "address": {"city": "San Francisco", "state": "California"}}
(1 row)
```
In this example:

* `\{“name”:”John Doe”, “address” : \{ “city”: “San Francisco”\}\}` is the original JSON object.
* `\{address, state\}` is a path that specifies the address key whose value is an object and state is the new key of the address object.
* “California” is the value of the state key.

Therefore, the `jsonb_insert()` function inserts the state with the value California to the address object of the JSON document.

Note that to beautify the output, you can use the `jsonb_pretty()` function:


```sql
SELECT 
  jsonb_pretty(jsonb_insert(
    '{"name":"John Doe", "address" : { "city": "San Francisco"}}', 
    '{address,state}', 
    '"California"'
  ));
```
Output:


```sql
           jsonb_pretty
----------------------------------
 {                               +
     "name": "John Doe",         +
     "address": {                +
         "city": "San Francisco",+
         "state": "California"   +
     }                           +
 }
(1 row)
```

### 5\) Inserting a new element into an array of a nested object

The following example uses the `jsonb_insert()` to add a new element into an array of a nested object


```sql
SELECT 
  jsonb_insert(
    '{"name": "John", "skills" : ["PostgreSQL", "API"]}', 
    '{skills,1}', '"Web Dev"'
  );
```
Output:


```sql
                         jsonb_insert
--------------------------------------------------------------
 {"name": "John", "skills": ["PostgreSQL", "Web Dev", "API"]}
(1 row)
```
In this example:

* `\{“name”: “John”, “skills” : \[“PostgreSQL”, “API”\]\}` is the original JSON object.
* `\{skills,1\}` is a path that specifies the skills key, which is an array, and 1 specifies the second element of the array.
* “Web Dev” is the new value to insert.

The `jsonb_insert()` function inserts the “Web Dev” before the second element of the skills array of the JSON object.


### 6\) Using the PostgreSQL jsonb\_insert() function with table data

We’ll show you how to use the `jsonb_insert()` function to insert a new value into a JSON document and update it back to a table.

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `employee_profiles`:


```sql
CREATE TABLE employee_profiles(
    id INT PRIMARY KEY,
    profiles JSONB    
);
```
Second, [insert rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `employee_profiles` table:


```sql
INSERT INTO employee_profiles(id, profiles)
VALUES
   (1, '{"name": "John", "skills" : ["PostgreSQL", "API"]}'),
   (2, '{"name": "Jane", "skills" : ["SQL","Java"]}')
RETURNING *;
```
Output:


```sql
 id |                     profiles
----+---------------------------------------------------
  1 | {"name": "John", "skills": ["PostgreSQL", "API"]}
  2 | {"name": "Jane", "skills": ["SQL", "Java"]}
(2 rows)
```
Third, add the “Web Dev” skill to the employee with the id 1:


```sql
UPDATE 
  employee_profiles 
SET 
  profiles = jsonb_insert(
    profiles, '{skills,0}', '"Web Dev"'
  ) 
WHERE 
  id = 1
RETURNING *;
```
Output:


```sql
 id |                           profiles
----+--------------------------------------------------------------
  1 | {"name": "John", "skills": ["Web Dev", "PostgreSQL", "API"]}
(1 row)
```

## Summary

* Use the `jsonb_insert()` function to insert a new value into a JSON document of the type JSONB.

