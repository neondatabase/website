---
title: "PostgreSQL ABS() Function"
page_title: "PostgreSQL ABS() Function"
page_description: "This tutorial shows you how to use the PostgreSQL ABS() function to calculate the absolute value of a number."
prev_url: "https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-abs/"
ogImage: ""
updatedOn: "2024-02-16T14:25:19+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Math Functions"
  slug: "postgresql-math-functions/"
next_page: 
  title: "PostgreSQL CEIL() Function"
  slug: "postgresql-math-functions/postgresql-ceil"
---




The PostgreSQL `ABS()` function returns the absolute value of a number.


## Syntax

The following illustrates the syntax of the `ABS()` function:


```csssql
ABS(numeric_expression)
```

## Arguments

The `ABS()` function requires one argument:

1\) `numeric_expression`

The `numeric_expression` can be a number or a numeric expression that evaluates to a number.


## Return Value

The `ABS()` function returns a value whose [data type](../postgresql-tutorial/postgresql-time) is the same as the input argument.


## Absolute Operator @

Besides the ABS() function, you can use the absolute operator @:


```
@ expression
```
In this syntax, the `@` operator returns the absolute value of the `expression`.


## Examples

The following example shows how to use the `ABS()` function to calculate the absolute value of a number:


```
SELECT ABS(-10.25) result;
```
The result is:


```css
 result
--------
  10.25
(1 row)

```
The following statement uses an expression for the `ABS()` function:


```
SELECT ABS( 100 - 250 ) result;
```
Here is the result:


```
 result
--------
    150
(1 row)
```
Besides the `ABS()` function, you can use the absolute operator `@`, for example:


```
SELECT @ -15 as result
```
It returned 15 as expected.


```
 result
--------
     15
(1 row)
```
In this tutorial, you have learned how to use the PostgreSQL `ABS()` function to calculate the absolute value of a number.

