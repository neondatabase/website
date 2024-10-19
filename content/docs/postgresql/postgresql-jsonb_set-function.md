---
title: 'PostgreSQL jsonb_set() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-jsonb_set
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_set
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_set()` function to replace an existing value specified by a path with a new value in a JSON document.

## Introduction to the PostgreSQL jsonb_set() function

The `jsonb_set()` function allows you to replace an existing value specified by a path with a new value in a [JSON](/docs/postgresql/postgresql-json) document of the JSONB type.

More specifically, the `jsonb_set()` function allows you to replace an array element or key/value in a JSON object, or nested combinations of them.

Here's the syntax of the `jsonb_set()` function:

```
jsonb_set(
   target jsonb,
   path text[],
   new_value jsonb
   [, create_missing boolean]
)
```

In this syntax:

- `target`: This is the original JSON document of the JSONB type that you want to modify.
- `path`: This is an array of text elements that specifies the path to the key where you want to insert or update the data.
- `new_value` is the new JSONB value that you want to set at the specified path.
- `create_missing`: This is an optional boolean parameter indicating whether you want to create missing keys if they do not exist. It defaults to true, meaning that the function will create a new key if you attempt to set it for a key that does not exist.

The `jsonb_set()` function returns the modified JSON document with the `new_value` set at a specified `path`.

## PostgreSQL jsonb_set() function examples

Let's explore some examples of using the PostgreSQL `jsonb_set()` function

### 1) Updating an existing element in a JSON array

The following example uses the `jsonb_set()` function to update an existing element in a JSON array:

```
 SELECT jsonb_set('[1,2,3]', '{0}', '-1');
```

Output:

```
 jsonb_set
------------
 [-1, 2, 3]
(1 row)
```

In this example:

- The original array is `[1,2,3]`.
- The path `{0}` indicates the first element of the array.
- The number `-1` is the new value.

The `jsonb_set()` function sets the first element of the array to -1 and returns the modified document.

To insert the number 4 after the 3rd element, you use a non-existing path to the 4th element as follows:

```
 SELECT jsonb_set('[1,2,3]', '{4}', '4');
```

Output:

```
  jsonb_set
--------------
 [1, 2, 3, 4]
(1 row)
```

### 2) Updating an element in a nested JSON array

The following example uses the `jsonb_set()` function to update an element in a nested array:

```sql
SELECT
  jsonb_set(
    '[1,2,[4,5],6]', '{2,0}', '3'
  );
```

Output:

```
     jsonb_set
-------------------
 [1, 2, [3, 5], 6]
(1 row)
```

In this example:

- The original array is \[1,2,\[4,5],6].
- The path {2, 0}, 2 specifies the second element of the array which is the nested array \[4,5], and 0 specifies the first element of the nested array.
- 3 is the new value.

Therefore the `jsonb_set()` function changes the number 4 as the first element of the nested array \[4,5] to 3.

### 3) Updating data in a JSON object

The following example uses the `jsonb_set()` to update the value of a key in a JSON object:

```sql
SELECT
  jsonb_set('{"name": "Jane Doe"}', '{name}', '"Jane Smith"');
```

Output:

```
       jsonb_set
------------------------
 {"name": "Jane Smith"}
(1 row)
```

In this example:

- \{"name": "Jane Doe"} is the original object.
- \{name} is the path that indicates the name property (or key).
- "Jane Smith" is the new value to update.

Therefore, the `jsonb_set()` set the value of the `name` key in the JSON object to "Jane Smith".

Note that if you attempt to set a key that does not exist, you'll get an error, the jsonb_set will insert it. For example:

```sql
SELECT jsonb_set('{"name": "Jane Doe"}', '{age}', '25');
```

Output:

```
            jsonb_set
---------------------------------
 {"age": 25, "name": "Jane Doe"}
(1 row)
```

But if you set the `create_missing` parameter to false, the function will not insert a new key/value pair:

```sql
SELECT
  jsonb_set(
    '{"name": "Jane Doe"}', '{age}',
    '25',
    false
  );
```

Output:

```
      jsonb_set
----------------------
 {"name": "Jane Doe"}
(1 row)
```

### 4) Updating a value in a nested JSON object

The following example uses the `jsonb_set()` to modify a key/value pair in a nested JSON object:

```sql
SELECT
  jsonb_set(
    '{"name":"John Doe", "address" : { "city": "San Francisco"}}',
    '{address,city}', '"San Jose"'
  );
```

Output:

```
                       jsonb_set
-------------------------------------------------------
 {"name": "John Doe", "address": {"city": "San Jose"}}
(1 row)
```

In this example:

- `{"name":"John Doe", "address" : { "city": "San Francisco"}}` is the original JSON object.
- `{address, city}` is a path that specifies the `address` key whose value is an object and the `city` is the key of the `address` object that will be modified.
- `"San Jose"` is the value of the `city` key.

Therefore, the `jsonb_set()` function updates the `city` with the value `San Jose` in the `address` object of the JSON document.

### 5) Updating an element in an array of a nested object

The following example uses the `jsonb_set()` to update an element in an array of a nested object

```sql
SELECT
  jsonb_set(
    '{"name": "John", "skills" : ["PostgreSQL", "API"]}',
    '{skills,1}',
    '"Web Dev"'
  );
```

Output:

```
                       jsonb_set
-------------------------------------------------------
 {"name": "John", "skills": ["PostgreSQL", "Web Dev"]}
(1 row)
```

In this example:

- `{"name": "John", "skills" : ["PostgreSQL", "API"]}` is the original JSON object.
- `{skills,1}` is a path that specifies the skills key, which is an array, and 1 specifies the second element of the array.
- `"Web Dev"` is the new value to update.

The `jsonb_set()` function sets the second element of the skills array to `"Web Dev"`.

### 6) Using the PostgreSQL jsonb_set() function with table data

We'll show you how to use the `jsonb_set()` function to insert a new value into a JSON document and update it back to a table.

First, [create a new table](/docs/postgresql/postgresql-create-table) called `employee_skills`:

```sql
CREATE TABLE employee_skills(
    id INT PRIMARY KEY,
    data JSONB
);
```

Second, [insert rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `employee_skills` table:

```sql
INSERT INTO employee_skills(id, data)
VALUES
   (1, '{"name": "John", "skills" : ["PostgreSQL", "API"]}'),
   (2, '{"name": "Jane", "skills" : ["SQL","Java"]}')
RETURNING *;
```

Output:

```
 id |                       data
----+---------------------------------------------------
  1 | {"name": "John", "skills": ["PostgreSQL", "API"]}
  2 | {"name": "Jane", "skills": ["SQL", "Java"]}
(2 rows)
```

Third, replace the first skill in the skills array of the employee id 1 with the new skill `"Web Dev"`:

```sql
UPDATE
  employee_skills
SET
  data = jsonb_set(
    data, '{skills,0}', '"Web Dev"'
  )
WHERE
  id = 1
RETURNING *;
```

Output:

```
 id |                      data
----+------------------------------------------------
  1 | {"name": "John", "skills": ["Web Dev", "API"]}
(1 row)
```

## Summary

- Use the `jsonb_set()` function to update a JSON document of the type JSONB.
