---
title: 'PostgreSQL jsonb_path_query_first() Function'
redirectFrom:
            - /docs/postgresql/postgresql-jsonb_path_query_first 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_path_query_first/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_path_query_first()` function to extract the first JSON value that matches a JSON path expression from a JSON document.





## Introduction to the PostgreSQL jsonb_path_query_first() function





The `jsonb_path_query_first()` function allows you to query data from a [JSONB document](/docs/postgresql/postgresql-json/) based on a [JSON path](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-path) expression and return the first match.





Here's the basic syntax of the `jsonb_path_query_first()` function:





```
jsonb_path_query_first(jsonb_data, json_path)
```





In this syntax:





- First, specify a JSONB data from which you want to query data.
-
- Second, provide a JSON path to match elements in the JSONB data.





If the `jsonb_path_query_first()` function doesn't find any match, it returns `NULL`.





## PostgreSQL jsonb_path_query_first() function examples





Let's explore some examples of using the `jsonb_path_query_first()` function.





### 1) Basic jsonb_path_query_first() function example





The following example uses the `jsonb_path_query_first()` function to get the first pet of a person:





```
SELECT jsonb_path_query_first(
    '{"name": "Alice", "pets": ["Lucy","Bella"]}',
    '$.pets[*]'
) AS first_pet_name;
```





Output:





```
 first_pet_name
----------------
 "Lucy"
(1 row)
```





### 2) Using the jsonb_path_query_first() function with table data





First, [create a new table](/docs/postgresql/postgresql-create-table) called `person`:





```
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    data JSONB
);
```





In the `person` table, the `data` column has the type of JSONB that stores employee information including name, age, and pets.





Second, [insert data](/docs/postgresql/postgresql-insert-multiple-rows) into the `person` table:





```
INSERT INTO person (data)
VALUES
    ('{"name": "Alice", "age": 30, "pets": [{"type": "cat", "name": "Fluffy"}, {"type": "dog", "name": "Buddy"}]}'),
    ('{"name": "Bob", "age": 35, "pets": [{"type": "dog", "name": "Max"}]}'),
    ('{"name": "Charlie", "age": 40, "pets": [{"type": "rabbit", "name": "Snowball"}]}')
RETURNING *;
```





Third, retrieve the first pet name using the `jsonb_path_query_first()` function:





```
SELECT jsonb_path_query_first(data, '$.pets[*].name') AS first_pet_name
FROM person;
```





Output:





```
 first_pet_name
----------------
 "Fluffy"
 "Max"
 "Snowball"
(3 rows)
```





### 3) Handling missing paths





The following example attempts to find an element whose path does not exist:





```
SELECT jsonb_path_query_first(data, '$.email')
FROM person;
```





Output:





```
 jsonb_path_query_first
------------------------
 null
 null
 null
(3 rows)
```





In this case, the person object doesn’t have an `email` key, therefore the result is `NULL`.





## Summary





- Use the `jsonb_path_query_first()` function to extract the first JSON value that matches a JSON path expression from a JSON document.


