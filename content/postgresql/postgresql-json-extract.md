---
createdAt: 2024-02-23T09:33:34.000Z
title: 'PostgreSQL JSON Extract'
redirectFrom: 
            - /postgresql/postgresql-json-functions/postgresql-json-extract
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the operator `->` and `->>` to extract an element from a JSON array or a value of a key from a JSON object.

## Extracting elements from JSON arrays

To extract an element of a JSON array as a `JSONB` value, you use the `->` operator.

Here's the syntax for using the `->` operator:

```
json_array -> n
```

In this syntax, `n` locates the nth element in a JSON array. n can be positive or negative. If the n is negative, the operator `->` returns the element from the end of the array.

Note that the first element has an index of zero and the last element has an index of -1.

If the nth element does not exist, the operator `->` returns `null`. To extract an array element as a text string, you can use the `->>` operator:

```
json_array ->> n
```

## Extracting JSON array element examples

Let's explore some examples of using the `->` and `->>` operators.

### 1) Setting up a sample table

First, [create a new table](/postgresql/postgresql-create-table) called `employees` to store employee data:

```sql
CREATE TABLE employees(
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   phones JSONB NOT NULL
);
```

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `employees` table:

```sql
INSERT INTO employees (name, phones)
VALUES
   ('John Doe', '["(408) 555-1111", "(408) 555-2222", "(408) 555-3333"]'),
   ('Jane Smith', '["(408) 666-1111", "(408) 666-2222", "(408) 666-3333"]')
RETURNING *;
```

Output:

```
 id |    name    |                         phones
----+------------+--------------------------------------------------------
  1 | John Doe   | ["(408) 555-1111", "(408) 555-2222", "(408) 555-3333"]
  2 | Jane Smith | ["(408) 666-1111", "(408) 666-2222", "(408) 666-3333"]
(2 rows)
```

### 2) Extracting the first array element example

The following example uses the -> operator to retrieve the first phone number of an employee with the name John Doe:

```sql
SELECT
  name,
  phones -> 0 phone
FROM
  employees
WHERE
  name = 'John Doe';
```

Output:

```
   name   |      phone
----------+------------------
 John Doe | "(408) 555-1111"
(1 row)
```

In this example, we use the `->` operator with the index 0. Therefore, the expression `phones -> 0` returns the first element in the `phones` array as a `JSONB` value.

To extract the first phone number as a text string, you can use the ->> operator:

```sql
SELECT
  name,
  phones ->> 0 phone
FROM
  employees
WHERE
  name = 'John Doe';
```

Output:

```
   name   |     phone
----------+----------------
 John Doe | (408) 555-1111
(1 row)
```

### 3) Extracting the last array element example

The following example uses the `->` operator to retrieve the first phone number of an employee with the name `Jane Smith`:

```sql
SELECT
  name,
  phones -> -1 phone
FROM
  employees
WHERE
  name = 'Jane Smith';
```

Output:

```
    name    |      phone
------------+------------------
 Jane Smith | "(408) 666-3333"
(1 row)
```

To extract the last phone number as a `JSONB` value, you can use the ->> operator:

```sql
SELECT
  name,
  phones ->> -1 phone
FROM
  employees
WHERE
  name = 'Jane Smith';
```

Output:

```
    name    |     phone
------------+----------------
 Jane Smith | (408) 666-3333
(1 row)
```

### 4) Extracting an element that does not exist

The following example uses the `->` operator to retrieve the 4th phone number of an employee with the name `Jane Smith`:

```sql
SELECT
  name,
  phones -> 3 phone
FROM
  employees
WHERE
  name = 'Jane Smith';
```

Output:

```
    name    | phone
------------+-------
 Jane Smith | null
(1 row)
```

Since Jane Smith has 3 phone numbers only, the query returns `NULL`.

## Extracting object value

To extract a value of a JSON object by a key, you use the -> operator:

```
object -> 'key'
```

The -> operator returns the value of the 'key' as a JSONB value. If the key does not exist, the -> operator returns null.

If you want to return the value as an SQL value, you can use the ->> operator:

```
object ->> 'key'
```

## Extracting JSON object value example

### 1) Setting up a sample table

First, create a new table called `requests`:

```sql
CREATE TABLE requests(
   id SERIAL PRIMARY KEY,
   employee_id INT NOT NULL,
   request_date DATE NOT NULL,
   data JSONB NOT NULL
);
```

Second, insert some rows into the `requests` table:

```sql
INSERT INTO requests (request_date, employee_id, data)
VALUES
   ('2024-02-23',1, '{"current_position": "Software Engineer", "new_position": "Senior Software Engineer", "effective_date": "2024-03-01"}'),
   ('2024-02-24',2, '{"current_position": "Data Analyst", "new_position": "Senior Data Analyst", "effective_date": "2024-03-15"}'),
   ('2024-02-25',3, '{"current_position": "Marketing Manager", "new_position": "Senior Marketing Manager", "effective_date": "2024-04-01"}')
RETURNING *;
```

Output:

```
 id | employee_id | request_date |                                                         data
----+-------------+--------------+-----------------------------------------------------------------------------------------------------------------------
  1 |           1 | 2024-02-23   | {"new_position": "Senior Software Engineer", "effective_date": "2024-03-01", "current_position": "Software Engineer"}
  2 |           2 | 2024-02-24   | {"new_position": "Senior Data Analyst", "effective_date": "2024-03-15", "current_position": "Data Analyst"}
  3 |           3 | 2024-02-25   | {"new_position": "Senior Marketing Manager", "effective_date": "2024-04-01", "current_position": "Marketing Manager"}
(3 rows)
```

### 2) Extract a value from a JSON object

The following example uses the `->` operator to extract the current position of the request of employee ID 1:

```sql
SELECT
  data -> 'current_position' current_position
FROM
  requests
WHERE
  employee_id = 1;
```

Output:

```
  current_position
---------------------
 "Software Engineer"
(1 row)
```

The return value is a JSONB value.

To get the current position as a text string, you can use the `->>` operator:

```sql
SELECT
  data ->> 'current_position' current_position
FROM
  requests
WHERE
  employee_id = 1;
```

Output:

```
 current_position
-------------------
 Software Engineer
(1 row)
```

### 2) Extract a key that does not exist

The following example attempts to extract a value of a non-existing key from a JSON object:

```sql
SELECT
  data ->> 'position' position
FROM
  requests
WHERE
  employee_id = 1;
```

Output:

```
 position
----------
 null
(1 row)
```

## Summary

- Use the `json_array -> n` and `json_array ->> n` operator to extract a JSON array element as a `JSONB` value or as a text string specified by an index.
- Use the `json_object -> 'key'` and `json_object ->> 'key'` operator to extract a value from an object specified by a key as a JSONB value and a text string.
