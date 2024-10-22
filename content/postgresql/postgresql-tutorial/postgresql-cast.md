---
title: "PostgreSQL CAST: Convert a value of One Type to Another"
page_title: "PostgreSQL CAST: Convert a Value of One Data Type to Another"
page_description: "You will learn how to use the PostgreSQL CAST() function and cast operator (::) to cast a value of one type to another."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-cast/"
ogImage: ""
updatedOn: "2024-02-01T06:59:27+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL NULLIF"
  slug: "postgresql-tutorial/postgresql-nullif"
next_page: 
  title: "PostgreSQL EXPLAIN"
  slug: "postgresql-tutorial/postgresql-explain"
---




**Summary**: in this tutorial, you will learn how to use PostgreSQL `CAST()` function and operator to convert a value of one type to another.


## Introduction to PostgreSQL CAST() function and cast operator (::)

There are many cases in which you want to convert a value of one [type](postgresql-data-types) into another. PostgreSQL offers the `CAST()` function and cast operator (`::`) to do this.


### PostgreSQL CAST() function

Here’s the basic syntax of the type `CAST()` function:


```phpsqlsql
CAST(<code>value</code> AS target_type );
```
In this syntax:

* First, provide a `value` that you want to convert. It can be a constant, a table column, or an expression.
* Then, specify the target [data type](postgresql-data-types) to which you want to convert the `value`.

The `CAST()` returns a value after it has been cast to the specified target data type. If the `CAST()` function cannot cast the value to a target type, it’ll raise an error. The error message will depend on the nature of the conversion failure.


### PostgreSQL cast operator (::)

Besides the type `CAST()` function, you can use the following cast operator (`::`) to convert a value of one type into another:


```sql
value::target_type
```
In this syntax:

* `value` is a value that you want to convert.
* `target_type` specifies the target type that you want to cast the value to.

The cast operator `::` returns a value after casting the `value` to the `target_type` or raise an error if the cast fails.

Notice that the cast operator (::) is PostgreSQL\-specific and does not conform to the SQL standard


## PostgreSQL CAST() function and cast operator (::) examples

Let’s take some examples of using the `CAST` operator to convert a value of one type to another.


### 1\) Cast a string to an integer example

The following statement uses the `CAST()` operator to convert a string to an integer:


```sql
SELECT 
  CAST ('100' AS INTEGER);
```
Output:


```sql
 int4
------
  100
(1 row)
```
If the expression cannot be converted to the target type, PostgreSQL will raise an error. For example:


```
SELECT 
  CAST ('10C' AS INTEGER);
```

```sql
[Err] ERROR:  invalid input syntax for integer: "10C"
LINE 2:  CAST ('10C' AS INTEGER);
```

### 2\) Cast a string to a date example

This example uses the `CAST()` function to convert a string to a [date](postgresql-date):


```php
SELECT
   CAST ('2015-01-01' AS DATE),
   CAST ('01-OCT-2015' AS DATE);
```
Output:


```sql
    date    |    date
------------+------------
 2015-01-01 | 2015-10-01
(1 row)
```
In this example, we converted `2015-01-01` literal string into `January 1st 2015` and `01-OCT-2015` to `October 1st 2015`.


### 3\) Cast a string to a double example

The following example uses the CAST() function to convert a string `'10.2'` into a double:


```
SELECT
	CAST ('10.2' AS DOUBLE);
```
Whoops, we got the following error message:


```sql
[Err] ERROR:  type "double" does not exist
LINE 2:  CAST ('10.2' AS DOUBLE)
```
To fix this, you need to use `DOUBLE PRECISION` instead of `DOUBLE` as follows:


```css
SELECT
   CAST ('10.2' AS DOUBLE PRECISION);
```
Output:


```sql
 float8
--------
   10.2
(1 row)
```

### 4\) Cast a string to a boolean example

This example uses the `CAST()` to convert the string ‘true’, ‘T’ to true and ‘false’, ‘F’ to false:


```css
SELECT 
   CAST('true' AS BOOLEAN),
   CAST('false' as BOOLEAN),
   CAST('T' as BOOLEAN),
   CAST('F' as BOOLEAN);
```
Output:


```sql
 bool | bool | bool | bool
------+------+------+------
 t    | f    | t    | f
(1 row)

```

### 5\) Cast a string to a timestamp example

This example uses the cast operator (::) to convert a string to a [timestamp](postgresql-timestamp):


```
SELECT '2019-06-15 14:30:20'::timestamp;
```
Output:


```sql
      timestamp
---------------------
 2019-06-15 14:30:20
(1 row)
```

### 6\) Cast a string to an interval example

This example uses the cast operator to convert a string to an [interval](postgresql-interval):


```php
SELECT 
  '15 minute' :: interval, 
  '2 hour' :: interval, 
  '1 day' :: interval, 
  '2 week' :: interval, 
  '3 month' :: interval;
```
Output:


```sql
 interval | interval | interval | interval | interval
----------+----------+----------+----------+----------
 00:15:00 | 02:00:00 | 1 day    | 14 days  | 3 mons
(1 row)
```

### 7\) Cast a timestamp to a date example

The following example uses the `CAST()` to convert a timestamp to a date:


```
SELECT CAST('2024-02-01 12:34:56' AS DATE);
```
Output:


```sql
    date
------------
 2024-02-01
(1 row)
```

### 8\) Cast an interval to text

The following example uses `CAST()` function to convert an interval to text:


```
SELECT CAST('30 days' AS TEXT);
```
Output:


```sql
  text
---------
 30 days
(1 row)
```

### 10\) Cast a JSON to a JSONB

The following example uses the `CAST()` function to convert JSON to JSONB:


```
SELECT CAST('{"name": "John"}' AS JSONB);
```
Output:


```sql
      jsonb
------------------
 {"name": "John"}
(1 row)
```

### 11\) Cast a double precision to an integer

The following example uses `CAST()` function to convert double precision to integer:


```
SELECT CAST(9.99 AS INTEGER);
```
Output:


```sql
 int4
------
   10
(1 row)
```

### 12\) Cast an array to a text

The following example uses `CAST()` function to convert an array to text:


```
SELECT CAST(ARRAY[1, 2, 3] AS TEXT);
```
Output:


```php
  array
---------
 {1,2,3}
(1 row)
```

### 13\) Cast text to an array

The following example shows how to use the cast operator (::) to convert text to an array:


```php
SELECT '{1,2,3}'::INTEGER[] AS result_array;
```
Output:


```
 result_array
--------------
 {1,2,3}
(1 row)
```

### 14\) Using CAST with table data example

First, [create](postgresql-create-table) a `ratings` table that consists of two columns: `id` and `rating`:


```
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY, 
  rating VARCHAR (1) NOT NULL
);
```
Second, [insert some sample data](postgresql-insert) into the `ratings` table.


```sql
INSERT INTO ratings (rating) 
VALUES 
  ('A'), 
  ('B'), 
  ('C');
```
Because the requirements change, we have to use the same `ratings` table to store ratings as numbers 1, 2, and 3 instead of A, B, and C:


```sql
INSERT INTO ratings (rating) 
VALUES 
  (1), 
  (2), 
  (3);
```
Consequentially, the `ratings` table stores both alphabets \& numbers.


```sql
SELECT * FROM ratings;
```
Output:


```sql
 id | rating
----+--------
  1 | A
  2 | B
  3 | C
  4 | 1
  5 | 2
  6 | 3
(6 rows)
```
Now, we have to convert all values in the `rating` column into integers, all other A, B, C ratings will be displayed as zero.

To achieve this, you can use the [`CASE`](../postgresql-plpgsql/plpgsql-case-statement) expression with the type `CAST` as shown in the following query:


```
SELECT 
  id, 
  CASE WHEN rating~E'^\\d+$' THEN CAST (rating AS INTEGER) ELSE 0 END as rating 
FROM 
  ratings;
```
Output:


```
 id | rating
----+--------
  1 |      0
  2 |      0
  3 |      0
  4 |      1
  5 |      2
  6 |      3
(6 rows)
```
In this example:

* `rating ~ E'^\\d+$'`: This expression matches the values in the rating column with a regular expression `E'^\\d+$'`. The pattern checks if a value contains only digits (`\d+`) from the beginning (`^`) to the end (`$`). The letter `E` before the string indicates is an escape string.
* If the value contains only digits, the `CAST()` function converts it to an integer. Otherwise, it returns zero.

In this tutorial, you have learned how to use PostgreSQL `CAST` to convert a value of one type to another.

