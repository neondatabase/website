---
title: "PostgreSQL jsonb_path_query_first() Function"
page_title: "PostgreSQL jsonb_path_query_first() Function"
page_description: "Use the PostgreSQL jsonb_path_query_first() function to extract the first JSON value that matches a JSON path from a JSON document."
prev_url: "https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_path_query_first/"
ogImage: ""
updatedOn: "2024-02-24T02:56:19+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL jsonb_path_query_array() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_path_query_array"
next_page: 
  title: "PostgreSQL jsonb_path_exists() Function"
  slug: "postgresql-json-functions/postgresql-jsonb_path_exists"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_path_query_first()` function to extract the first JSON value that matches a JSON path expression from a JSON document.


## Introduction to the PostgreSQL jsonb\_path\_query\_first() function

The `jsonb_path_query_first()` function allows you to query data from a [JSONB document](../postgresql-tutorial/postgresql-json) based on a [JSON path](postgresql-json-path) expression and return the first match.

Here’s the basic syntax of the `jsonb_path_query_first()` function:


```sql
jsonb_path_query_first(jsonb_data, json_path)
```
In this syntax:

* First, specify a JSONB data from which you want to query data.
* Second, provide a JSON path to match elements in the JSONB data.

If the `jsonb_path_query_first()` function doesn’t find any match, it returns `NULL`.


## PostgreSQL jsonb\_path\_query\_first() function examples

Let’s explore some examples of using the `jsonb_path_query_first()` function.


### 1\) Basic jsonb\_path\_query\_first() function example

The following example uses the `jsonb_path_query_first()` function to get the first pet of a person:


```sql
SELECT jsonb_path_query_first(
    '{"name": "Alice", "pets": ["Lucy","Bella"]}',
    '$.pets[*]'
) AS first_pet_name;
```
Output:


```sql
 first_pet_name
----------------
 "Lucy"
(1 row)
```

### 2\) Using the jsonb\_path\_query\_first() function with table data

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `person`:


```sql
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    data JSONB
);
```
In the `person` table, the `data` column has the type of JSONB that stores employee information including name, age, and pets.

Second, [insert data](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `person` table:


```sql
INSERT INTO person (data) 
VALUES
    ('{"name": "Alice", "age": 30, "pets": [{"type": "cat", "name": "Fluffy"}, {"type": "dog", "name": "Buddy"}]}'),
    ('{"name": "Bob", "age": 35, "pets": [{"type": "dog", "name": "Max"}]}'),
    ('{"name": "Charlie", "age": 40, "pets": [{"type": "rabbit", "name": "Snowball"}]}')
RETURNING *;
```
Third, retrieve the first pet name using the `jsonb_path_query_first()` function:


```sql
SELECT jsonb_path_query_first(data, '$.pets[*].name') AS first_pet_name
FROM person;
```
Output:


```sql
 first_pet_name
----------------
 "Fluffy"
 "Max"
 "Snowball"
(3 rows)
```

### 3\) Handling missing paths

The following example attempts to find an element whose path does not exist:


```sql
SELECT jsonb_path_query_first(data, '$.email')
FROM person;
```
Output:


```sql
 jsonb_path_query_first
------------------------
 null
 null
 null
(3 rows)
```
In this case, the person object doesn’t have an `email` key, therefore the result is `NULL`.


## Summary

* Use the `jsonb_path_query_first()` function to extract the first JSON value that matches a JSON path expression from a JSON document.

