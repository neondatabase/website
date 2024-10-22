---
title: "PostgreSQL EXP() Function"
page_title: "PostgreSQL EXP() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL EXP() function to calculate the exponential of a number."
prev_url: "https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-exp/"
ogImage: ""
updatedOn: "2024-04-18T03:00:18+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL DEGREES() Function"
  slug: "postgresql-math-functions/postgresql-degrees"
nextLink: 
  title: "PostgreSQL FACTORIAL() Function"
  slug: "postgresql-math-functions/postgresql-factorial"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `EXP()` function to calculate the exponential of a number.


## Introduction to the PostgreSQL EXP() function

An exponential of a number is the number e, approximately equal to `2.71`, raised to a given power (en).

In PostgreSQL, you can use the `EXP()` function to calculate the exponential of a number.

Here’s the syntax of the `EXP()` function:


```plaintextsql
EXP(n)
```
In this syntax:

* `n` is the number that you want to calculate the exponential. It can be a literal number, an expression, or a table column.

The `EXP()` function returns the exponential of a number in double precision. The `EXP()` function returns `NULL` if the n is `NULL`.

If n is a string, the `EXP()` function will attempt to convert it to a number before calculating the exponential. If the conversion fails, the `EXP()` function will raise an error.


## PostgreSQL EXP() function examples

Let’s take some examples to practice the `EXP()` function.


### 1\) Basic EXP() function examples

The following example uses the `EXP()` function to return the exponential of 1:


```sql
SELECT EXP(1) result;
```
Output:


```sql
      result
-------------------
 2.718281828459045
(1 row)
```
It returns the Euler number (e) because e1 is e.

The following statement uses the `EXP()` function to return the exponential of zero:


```sql
SELECT EXP(0) result;
```
Output:


```sql
 result
--------
      1
(1 row)
```
It returns 1 because e0 is 1\.


### 2\) Using the EXP() function with numeric strings

The following example uses the `EXP()` function with a numeric string:


```sql
SELECT EXP('10') result;
```
Output:


```sql
        exp
--------------------
 22026.465794806718
(1 row)
```
In this example, the EXP() function converts the string ’10’ to the number 10 before calculating the exponential of 10\.

The following example raises an error because the function fails to convert the string ’10x’ to a number:


```plaintext
SELECT EXP('10X') result;
```
Error:


```
ERROR:  invalid input syntax for type double precision: "10X"
LINE 1: SELECT EXP('10X') result;
                   ^
```

## Summary

* Use the `EXP()` function to calculate the exponential of a number.

