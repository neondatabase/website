---
title: "PostgreSQL DOUBLE PRECISION Data Type"
page_title: "PostgreSQL DOUBLE PRECISION Data Type"
page_description: "In this tutorial, you will learn about the PostgreSQL DOUBLE PRECISION data type and its features."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-double-precision-type/"
ogImage: ""
updatedOn: "2024-04-19T03:25:47+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL NUMERIC Type"
  slug: "postgresql-tutorial/postgresql-numeric"
nextLink: 
  title: "PostgreSQL REAL Data Type"
  slug: "postgresql-tutorial/postgresql-real-data-type"
---




**Summary**: in this tutorial, you will learn about the PostgreSQL `DOUBLE PRECISION` data type and its features.


## Introduction to the PostgreSQL double precision type

In PostgreSQL, the `DOUBLE PRECISION` is an inexact, variable\-precision numeric type.

Inexact means that PostgreSQL cannot exactly convert some values into an internal format and can only store them as approximations. Consequently, storing and querying a value might show a slight difference.

If your application requires exact storage and calculation, it’s recommended to use the [numeric](postgresql-numeric) type instead.

Note that PostgreSQL double precision data type is an implementation of the [IEEE Standard 754 for Floating\-Point Arithmetic.](https://ieeexplore.ieee.org/document/8766229)

The following shows how to define a column with the `DOUBLE PRECISION` type:


```csssql
column_name double precision
```
Alternatively, you can use the `float8` or `float` data type which is the same as `DOUBLE PRECISION`:


```sql
colum_name float
```
A column of `DOUBLE PRECISION` type can store values that have a range around `1E-307` to `1E+308` with a precision of at least 15 digits.

If you store a value that is out of the range, PostgreSQL will be unable to store it and raise an error.

If you store numbers with very high precision, PostgreSQL may round them to fit within the limitation of double precision. This may potentially lose some precision in the calculation.

If you store very small numbers close to zero, PostgreSQL may raise an underflow error due to the limitations of double precision data type, which may be unable to accurately represent such small values distinct from zero.

In practice, you’ll use the double precision type for storing scientific measurements.


## PostgreSQL double precision type examples

Let’s take some examples of using the `DOUBLE PRECISION` data type.


### 1\) Basic double precision data type example

First, [create a table](postgresql-create-table) called `temperatures` to store temperature readings:


```sql
CREATE TABLE temperatures (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    temperature DOUBLE PRECISION
);
```
Second, insert some rows into the `temperatures` table:


```sql
INSERT INTO
  temperatures (location, temperature)
VALUES
  ('Lab Room 1', 23.5),
  ('Server Room 1', 21.8),
  ('Server Room 2', 24.3)
RETURNING *;
```
Output:


```sql
 id |   location    | temperature
----+---------------+-------------
  1 | Lab Room 1    |        23.5
  2 | Server Room 1 |        21.8
  3 | Server Room 2 |        24.3
(3 rows)
```
Third, calculate the average temperature of all locations:


```
SELECT AVG(temperature) 
FROM temperatures;
```
Output:


```sql
 avg
------
 23.2
```

### 2\) Storing inexact values

First, [create a table](postgresql-create-table) `t` with the column `c` of `DOUBLE PRECISION` type:


```
CREATE TABLE t(c double precision);
```
Second, [insert rows](postgresql-insert-multiple-rows) into the `t` table:


```sql
INSERT INTO t(c) VALUES(0.1), (0.1), (0.1)
RETURNING *;
```
Output:


```sql
  c
-----
 0.1
 0.1
 0.1
(3 rows)
```
Third, calculate the sum of values in the c column using the [`SUM()`](../postgresql-aggregate-functions/postgresql-sum-function) function:


```sql
SELECT SUM(c) FROM t;
```
Output:


```sql
         sum
---------------------
 0.30000000000000004
(1 row)
```
The output indicates that the sum of `0.1`, `0.1`, and `0.1` is not `0.3` but `0.30000000000000004`. This indicates that PostgreSQL cannot store the exact number `0.1` using the `DOUBLE PRECISION` type.


### 2\) Inserting too small numbers

The following statement attempts to [insert](postgresql-insert) a very small number into the `c` column of the `t` table:


```sql
INSERT INTO t(c) 
VALUES (1E-400);
```
It returns the following error:


```sql
ERROR:  "0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001" is out of range for type double precision
```
The reason is that the number is too small and very close to zero. PostgreSQL cannot store it due to the limitation of the double precision type.


## Summary

* `DOUBLE PRECISION` data type represents the inexact numbers.
* `DOUBLE PRECISION`, `FLOAT8`, or `FLOAT` are synonyms.
* Use `DOUBLE PRECISION` type to store inexact numbers and `NUMERIC` type to store exact numbers.

