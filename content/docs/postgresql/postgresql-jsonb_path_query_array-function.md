---
title: 'PostgreSQL jsonb_path_query_array() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_path_query_array/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_path_query_array()` function to query JSONB data using a JSON path and return matched elements as a JSON array.



# Introduction to PostgreSQL jsonb_path_query_array() function



The `jsonb_path_query_array()` function allows you to query [JSONB](/docs/postgresql/postgresql-json/) data using a [JSON path expression](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-path).



Here's the basic syntax of the `jsonb_path_query_array()` function:



```
jsonb_path_query_array(jsonb_data, json_path)
```



In this syntax:



- First, specify the `jsonb_data` that you want to query.
- -
- Second, provide a `json_path` that you want to match elements within the `jsonb_data`.
- 


The `jsonb_path_query_array()` function returns the matched elements as a JSON array.



If the function does not find any matched element, it returns an empty array.



If either argument is `NULL`, the function returns `NULL`.



## PostgreSQL jsonb_path_query_array() function example



Let's explore some examples of using the `jsonb_path_query_array()` function



### 1) Basic PostgreSQL jsonb_path_query_array() function example



The following example uses the `jsonb_path_query_array()` function to get the employee names as an array:



```
SELECT
  jsonb_path_query_array(
    '{"employees": [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]}',
    '$.employees[*].name'
  );
```



Output:



```
 jsonb_path_query_array
------------------------
 ["Alice", "Bob"]
(1 row)
```



In this example, the JSON path expression `$.employees[*].name` locates the value of the `name` key of all elements in the `employees` array.



### 2) Using jsonb_path_query_array() function with table data



First, [create a new table](/docs/postgresql/postgresql-create-table) called `employees`:



```
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    data JSONB
);
```



In the `employees` table, the `data` column has the type of `JSONB`.



Second, [insert some rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `employees` table:



```
INSERT INTO employees (data) VALUES
    ('{"name": "Alice", "age": 30, "pets": [{"type": "cat", "name": "Fluffy"}, {"type": "dog", "name": "Buddy"}]}'),
    ('{"name": "Bob", "age": 35, "pets": [{"type": "dog", "name": "Max"}]}'),
    ('{"name": "Charlie", "age": 40, "pets": [{"type": "rabbit", "name": "Snowball"}]}')
RETURNING *;
```



Output:



```
 id |                                                    data

----+-------------------------------------------------------------------------------------------------------------
  1 | {"age": 30, "name": "Alice", "pets": [{"name": "Fluffy", "type": "cat"}, {"name": "Buddy", "type": "dog"}]}
  2 | {"age": 35, "name": "Bob", "pets": [{"name": "Max", "type": "dog"}]}
  3 | {"age": 40, "name": "Charlie", "pets": [{"name": "Snowball", "type": "rabbit"}]}
(3 rows)
```



Third, use the `jsonb_path_query_array()` function to retrieve the pet names of employees as a JSON array:



```
SELECT jsonb_path_query_array(data, '$.pets[*].name') AS employee_pet_names
FROM employees;
```



Output:



```
 employee_pet_names
---------------------
 ["Fluffy", "Buddy"]
 ["Max"]
 ["Snowball"]
(3 rows)
```



### 3) Handling missing paths



If the specified path doesn't exist in the `JSONB` data, the `jsonb_path_query_array()` function returns an empty array. For example:



```
SELECT jsonb_path_query_array(data, '$.address')
FROM employees;
```



Output:



```
 jsonb_path_query_array
------------------------
 []
 []
 []
(3 rows)
```



In this example, the employee object doesn't have an `address` key, so the result is an empty array.



## Summary



- Use the `jsonb_path_query_array()` function to query JSONB data using a JSON path and return matched elements as a JSON array.
- 
