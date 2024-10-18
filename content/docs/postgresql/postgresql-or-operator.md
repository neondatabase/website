---
title: 'PostgreSQL OR Operator'
redirectFrom: 
            - /docs/postgresql/postgresql-or
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL `OR` logical operator and how to use it to combine multiple boolean expressions.



## Introduction to the PostgreSQL OR operator



In PostgreSQL, a [boolean](/docs/postgresql/postgresql-boolean) value can have one of three values: `true`, `false`, and `null`.



PostgreSQL uses `true`, `'t'`, `'true'`, `'y'`, `'yes'`, `'1'` to represent `true` and `false`, `'f'`, `'false'`, `'n'`, `'no'`, and `'0'` to represent `false`.



A boolean expression is an expression that evaluates to a boolean value. For example, the expression `1<>1`is a boolean expression that evaluates to `false`:



```
SELECT 1 <> 1 AS result;
```



Output:



```
 result
--------
 f
(1 row)
```



The letter `f` in the output indicates `false`.



The `OR` operator is a logical operator that combines multiple boolean expressions. Here's the basic syntax of the `OR` operator:



```
expression1 OR expression2
```



In this syntax, `expression1` and `expression2` are boolean expressions that evaluate to `true`, `false`, or `null`.



The `OR` operator returns `true` only if any of the expressions is `true`. It returns `false` if both expressions are false. Otherwise, it returns null.



The following table shows the results of the `OR` operator when combining `true`, `false`, and `null`.



| OR        | True | False | Null |
| --------- | ---- | ----- | ---- |
| **True**  | True | True  | True |
| **False** | True | False | Null |
| **Null**  | True | Null  | Null |



In practice, you usually use the `OR` operator in a `WHERE` clause to ensure that either of the specified expressions must be true for a row to be included in the result set.



## PostgreSQL OR operator



Let's explore some examples of using the `OR` operator.



### 1) Basic PostgreSQL OR operator examples



The following example uses the `OR` operator to combine `true` with `true`, which returns `true`:



```
SELECT true OR true AS result;
```



Output:



```
 result
--------
 t
(1 row)
```



The following statement uses the `OR` operator to combine `true` with `false`, which returns true:



```
SELECT true OR false AS result;
```



Output:



```
 result
--------
 t
(1 row)
```



The following example uses the `OR` operator to combine `true` with `null`, which returns `true`:



```
SELECT true OR null AS result;
```



Output:



```
 result
--------
 t
(1 row)
```



The following example uses the `OR` operator to combine `false` with `false`, which returns `false`:



```
SELECT false OR false AS result;
```



Output:



```
 result
--------
 f
(1 row)
```



The following example uses the `OR` operator to combine `false` with `null`, which returns `null`:



```
SELECT false OR null AS result;
```



Output:



```
 result
--------
 null
(1 row)
```



The following example uses the `OR` operator to combine `false` with `false`, which returns `false`:



```
SELECT false OR false AS result;
```



Output:



```
 result
--------
 f
(1 row)
```



The following example uses the `OR` operator to combine `null` with `null`, which returns `null`:



```
SELECT null OR null AS result;
```



Output:



```
 result
--------
 null
(1 row)
```



### 2) Using the OR operator in the WHERE clause



We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration:



![](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/film.png)



The following example uses the `OR` operator in the `WHERE` clause to find the films that have a rental rate is `0.99` or `2.99`:



```
SELECT
  title,
  rental_rate
FROM
  film
WHERE
  rental_rate = 0.99 OR
  rental_rate = 2.99;
```



Output:



```
            title            | rental_rate
-----------------------------+-------------
 Academy Dinosaur            |        0.99
 Adaptation Holes            |        2.99
 Affair Prejudice            |        2.99
 African Egg                 |        2.99
...
```



## Summary



- Use the `OR` operator to combine multiple boolean expressions.
- 