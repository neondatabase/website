---
title: 'PostgreSQL jsonb_extract_path() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_extract_path/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_extract_path()` function to extract a JSON subobject at the specified path.



## Introduction to the PostgreSQL jsonb_extract_path() function



The `jsonb_extract_path()` function allows you to extract a JSON sub-object from a JSONB value at a specified path.



Here's the basic syntax of the `jsonb_extract_path()` function:



```
jsonb_extract_path(target jsonb, VARIADIC path_elems text[])
```



In this syntax:



- `target` is a JSONB data from which you want to extract data.
- -
- `path_elems` is a list of paths that you want to locate the elements in the JSONB data for extraction.
- 


Note that the path is not a JSON path. The syntax for the `path_elems` parameter is as follows:



- `'key'`: Access a specific key in the JSON object.
- -
- '`array_index`': Access an element in a JSON array using its index.
- 


To navigate through the nested objects or array, you can chain these path components together.



Suppose you have the following JSON object:



```
{
  "employee": {
    "name": "John Doe",
    "age": 22,
    "contacts": [
      {"type": "email", "value": "john.doe@test.com"},
      {"type": "phone", "value": "408-123-456"}
    ]
  }
}
```



Here are some examples of the path expressions:



- `'employee'` returns the entire `employee` object.
- -
- `['employee', 'name']` returns the name within the employee object, which is `"John Doe"`.
- -
- `['employee', 'contacts', '0', 'value']` returns the value in the first element of the contacts array, which is `john.doe@test.com`
- 


## PostgreSQL jsonb_extract_path() function examples



Let's take some examples of using the `jsonb_extract_path()` function.



### Setting up a sample table



First, [create a new table](/docs/postgresql/postgresql-create-table) called `documents`:



```
CREATE TABLE documents(
   id SERIAL PRIMARY KEY,
   data JSONB
);
```



Second, [insert two rows](/docs/postgresql/postgresql-insert) into the `documents` table:



```
INSERT INTO documents(data)
VALUES
  ('{"employee":{"name":"John Doe","age":22,"contacts":[{"type":"email","value":"john.doe@test.com"},{"type":"phone","value":"408-123-456"}]}}'),
  ('{"employee":{"name":"Jane Doe","age":21,"contacts":[{"type":"email","value":"jane.doe@test.com"},{"type":"phone","value":"408-123-789"}]}}');
```



### Basic jsonb_extract_path() function examples



The following example uses the `jsonb_extract_path()` function to extract the employee object:



```
SELECT
  jsonb_extract_path(data, 'employee') employee
FROM
  documents;
```



Output:



```
                                                                 employee
-------------------------------------------------------------------------------------------------------------------------------------------
 {"age": 22, "name": "John Doe", "contacts": [{"type": "email", "value": "john.doe@test.com"}, {"type": "phone", "value": "408-123-456"}]}
 {"age": 21, "name": "Jane Doe", "contacts": [{"type": "email", "value": "jane.doe@test.com"}, {"type": "phone", "value": "408-123-789"}]}
(2 rows)
```



The following example uses the `jsonb_extract_path()` function to extract the names of employees:



```
SELECT
  jsonb_extract_path(data, 'employee', 'name') name
FROM
  documents;
```



Output:



```
    name
------------
 "John Doe"
 "Jane Doe"
(2 rows)
```



The following example uses the `jsonb_extract_path()` function to extract the emails of employees:



```
SELECT
  jsonb_extract_path(
    data, 'employee', 'contacts', '0',
    'value'
  ) email
FROM
  documents;
```



Output:



```
        email
---------------------
 "john.doe@test.com"
 "jane.doe@test.com"
(2 rows)
```



## Summary



- Use the `jsonb_extract_path()` function to extract JSON sub-object at the specified path.
- 
