---
title: 'PostgreSQL LCM() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-lcm
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `lcm()` function to calculate the least common multiple (LCM) of two or more integers.



## Introduction to PostgreSQL LCM function



The least common multiple (LCM) of two integers is the smallest integer that is divisible by each of the numbers.



For example, the LCM of 12 and 18 is 36 because 36 is divisible by 12 and 18.



PostgreSQL 13 or later offers a built-in `lcm()` function that calculates the LCM of two integers.



Here's the syntax of the `lcm()` function:



```
lcm(a,b)
```



In this syntax, `a` and `b` are the numbers with types of [integer](/docs/postgresql/postgresql-integer/), [bigint](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-integer/), and [numeric](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-numeric). The `lcm()` function returns the LCM of `a` and `b`.



If either a and b is zero, the `lcm()` function returns zero. If `a` and/or `b` are null, the `lcm()` function returns null.



## PostgreSQL LCM function examples



Let's take some examples of using the `lcm()` function.



### 1) Basic PostgreSQL lcm() function example



The following statement uses the `lcm()` function to calculate the LCM of two numbers 12 and 18:



```
SELECT lcm(12, 18) result;
```



Output:



```
 result
--------
     36
(1 row)
```



### 2) Using the lcm() function to find the LCM of three numbers



The following statement uses the `lcm()` function to find the LCM of three numbers 12, 18, and 24:



```
SELECT lcm(lcm(12,18),24) result
```



Output:



```
 result
--------
     72
(1 row)
```



In this example, we apply the `lcm()` function twice:



- lcm(12,18) returns the LCM of 12 and 18, which is 36.
- -
- lcm(lcm(12,18),24) calculates the LCM of the previous LCM (36) and 24, which is 72.
- 


### 3) Using the lcm() function to find the LCM of multiple numbers



First, [create a table](/docs/postgresql/postgresql-create-table) called `numbers` that have two columns `id` and `value`:



```
CREATE TABLE numbers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    value INTEGER NOT NULL
);
```



Second, [insert some rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `numbers` table:



```
INSERT INTO numbers (value)
VALUES (12), (18), (24), (48)
RETURNING *;
```



Output:



```
 id | value
----+-------
  1 |    12
  2 |    18
  3 |    24
  4 |    48
(4 rows)
```



Third, use a [recursive CTE](/docs/postgresql/postgresql-recursive-query) to calculate the LCM of all numbers in the `value` column of the `numbers` table.



```
WITH RECURSIVE lcm_cte AS (
  SELECT value AS lcm_value, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM numbers
  WHERE id = (SELECT min(id) FROM numbers)

  UNION ALL

  SELECT lcm(lcm_value, value), lcm_cte.rn + 1
  FROM lcm_cte
  JOIN numbers ON lcm_cte.rn + 1 = numbers.id
)
SELECT lcm_value
FROM lcm_cte
WHERE rn = (SELECT COUNT(*) FROM numbers);
```



Output:



```
 lcm_value
-----------
       144
(1 row)
```



## Defining an aggregate lcm() function



Using a recursive query is quite complicated. Fortunately, PostgreSQL allows you to define a user-defined aggregate function based on the built-in `lcm()` function:



```
CREATE AGGREGATE lcm_agg(bigint) (
    SFUNC = lcm,
    STYPE = bigint
);
```



You can use the `lcm_gg()` function as follows:



```
SELECT lcm_agg(value)
FROM numbers;
```



Output:



```
 lcm_agg
---------
     144
(1 row)
```



## Summary



- Use the `lcm()` function to calculate the least common multiple (LCM) of two or more integers.
- 